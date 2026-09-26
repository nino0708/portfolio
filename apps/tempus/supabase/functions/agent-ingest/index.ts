// Tempus: 外部AIエージェント（Fridayのクラウドルーティン等）からタスク/レポート/クリップを
// 流し込むEdge Function（Deno）。呼び出し元はブラウザではなくサーバー側のエージェントなので、
// line-webhookと違い失敗は握りつぶさずHTTPコード+JSONでそのまま返す。
//
// セキュリティ上の要:
// - ヘッダ x-tempus-agent-key を TEMPUS_AGENT_KEY とタイミングセーフに比較する。
//   ここが唯一の防壁（LINEのような署名検証は無い＝共有シークレットが漏れたら即アウト）。
// - owner_id は常に TEMPUS_OWNER_EMAIL から解決する。リクエスト側からowner_idを指定させない
//   （個人アプリなので受け口は1人分のみ。複数テナント化はしない）。
//
// 冪等性:
// - reports/clipsはテーブル自体にdedupe_key列とUNIQUE制約を持つ（supabase/migrations/0008_agent_ingest.sql）。
// - tasksはsrc/types/domain.tsのTask型にdedupe_keyが無いため、側テーブルagent_task_dedupeで
//   dedupe_key -> task_idの対応だけを持たせて重複を弾く（line_webhook_eventsと同じ考え方）。
//
// 無料枠を守るための上限:
// - リクエストボディは1MB超で413
// - tasks/reports/clipsはそれぞれ最大100件、超えたら400

import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2.45.0";
import { resolveClipKind } from "../_shared/clipKind.ts";

function requireEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) {
    throw new Error(
      `[agent-ingest] 環境変数 ${name} が設定されていません。` +
        `supabase secrets set ${name}=<値> を実行してからデプロイし直してください。`,
    );
  }
  return value;
}

// 起動時（モジュール評価時）に必須環境変数を確認する。1つでも欠けていれば
// ここで例外を投げ、Edge Functionの起動自体を失敗させて気づけるようにする。
const TEMPUS_AGENT_KEY = requireEnv("TEMPUS_AGENT_KEY");
const TEMPUS_OWNER_EMAIL = requireEnv("TEMPUS_OWNER_EMAIL");
const SUPABASE_URL = requireEnv("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const MAX_BODY_BYTES = 1024 * 1024; // 1MB
const MAX_ITEMS_PER_ARRAY = 100;

// ---- リクエストJSONの型（すべて省略可） ----

interface IncomingTask {
  title?: string;
  notes?: string;
  dueAt?: string;
  estimateMin?: number;
  importance?: string;
  dedupeKey?: string;
}

interface IncomingReport {
  source?: string;
  title?: string;
  bodyMd?: string;
  url?: string;
  reportedFor?: string;
  dedupeKey?: string;
}

interface IncomingClip {
  label?: string;
  text?: string;
  url?: string;
  imageUrl?: string;        // 投稿に添える画像URL（任意）。UIは投稿済みになった後にプレビュー表示する
  dedupeKey?: string;
  taskDedupeKey?: string;   // 同じリクエストで送ったタスクのdedupeKey。付けるとそのタスクの詳細に出る
  kind?: string;            // "x_post"（Xに貼る投稿文）| "note"（参考メモ）。省略時は送信元で決める（_shared/clipKind.ts）
}

interface IngestRequestBody {
  agent?: string;
  tasks?: IncomingTask[];
  reports?: IncomingReport[];
  clips?: IncomingClip[];
}

// ---- エラー ----
// throw して最上位のcatchで拾い、そのままHTTPコード+JSONにする。

class IngestError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// ---- 共有シークレットのタイミングセーフ比較 ----
//
// line-webhookの実装は「長さが違えば即false」だったが、あちらは相手がHMAC値（固定長）
// だったため長さの違いに情報価値が無かった。こちらのTEMPUS_AGENT_KEYは人間が決める
// 任意長の共有シークレットなので、長さの違いも定数時間で畳み込み、早期returnしない。
function timingSafeEqual(a: string, b: string): boolean {
  const bytesA = new TextEncoder().encode(a);
  const bytesB = new TextEncoder().encode(b);
  const maxLen = Math.max(bytesA.length, bytesB.length);
  let diff = bytesA.length ^ bytesB.length;
  for (let i = 0; i < maxLen; i++) {
    const byteA = i < bytesA.length ? bytesA[i] : 0;
    const byteB = i < bytesB.length ? bytesB[i] : 0;
    diff |= byteA ^ byteB;
  }
  return diff === 0;
}

// ---- dedupeKeyの既定生成（省略時のみ使う） ----

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function nonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isImportance(value: unknown): value is "low" | "mid" | "high" {
  return value === "low" || value === "mid" || value === "high";
}

// ---- ボディ読み込み（1MB上限） ----

async function readBodyWithLimit(req: Request): Promise<ArrayBuffer> {
  const contentLengthHeader = req.headers.get("content-length");
  if (contentLengthHeader) {
    const declared = Number(contentLengthHeader);
    if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
      throw new IngestError(413, `リクエストボディが大きすぎます（上限${MAX_BODY_BYTES}バイト、Content-Length: ${declared}バイト）`);
    }
  }
  const buf = await req.arrayBuffer();
  if (buf.byteLength > MAX_BODY_BYTES) {
    throw new IngestError(413, `リクエストボディが大きすぎます（上限${MAX_BODY_BYTES}バイト、実際: ${buf.byteLength}バイト）`);
  }
  return buf;
}

function parseJson(raw: ArrayBuffer): IngestRequestBody {
  let text: string;
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(raw);
  } catch {
    throw new IngestError(400, "リクエストボディをUTF-8として読めません");
  }
  try {
    return JSON.parse(text) as IngestRequestBody;
  } catch {
    throw new IngestError(400, "リクエストボディが正しいJSONではありません");
  }
}

function validateShape(payload: unknown): asserts payload is IngestRequestBody {
  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
    throw new IngestError(400, "リクエストボディはJSONオブジェクトである必要があります");
  }
  const body = payload as Record<string, unknown>;
  if (!nonEmptyString(body.agent)) {
    throw new IngestError(400, "agent（送信元ルーティン名）は必須の文字列です");
  }
  for (const key of ["tasks", "reports", "clips"] as const) {
    if (body[key] === undefined) continue;
    if (!Array.isArray(body[key])) {
      throw new IngestError(400, `${key}は配列である必要があります`);
    }
    const arr = body[key] as unknown[];
    if (arr.length > MAX_ITEMS_PER_ARRAY) {
      throw new IngestError(400, `${key}は最大${MAX_ITEMS_PER_ARRAY}件までです（${arr.length}件受信）`);
    }
  }
}

// ---- owner_id の解決 ----
// TEMPUS_OWNER_EMAILからauth.usersを引く。PostgRESTはauthスキーマを公開していないため、
// Admin API（supabase.auth.admin.listUsers）でページングしながら探す。個人アプリなので
// 実際には1〜数ユーザーしかいない想定だが、念のため最後まで辿る。

async function resolveOwnerId(): Promise<string> {
  const target = TEMPUS_OWNER_EMAIL.toLowerCase();
  const perPage = 200;
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) {
      throw new IngestError(500, `auth.admin.listUsersに失敗しました: ${error.message}`);
    }
    const found = data.users.find((u) => u.email?.toLowerCase() === target);
    if (found) return found.id;
    if (data.users.length < perPage) break; // 最終ページまで見た
  }
  throw new IngestError(
    500,
    `TEMPUS_OWNER_EMAIL(${TEMPUS_OWNER_EMAIL})に一致するauth.usersが見つかりません。Googleログインを一度済ませてから再実行してください。`,
  );
}

// ---- tasks ----
// dueAtは10進秒以下の妥当性チェックはDB(timestamptz)に任せる。DBが弾いたらINSERTエラーとして扱う。

async function ingestTasks(
  ownerId: string,
  items: IncomingTask[],
): Promise<{ inserted: number; skipped: number }> {
  let inserted = 0;
  let skipped = 0;

  for (const raw of items) {
    if (!nonEmptyString(raw?.title)) {
      skipped++;
      continue;
    }
    const title = raw.title!.trim().slice(0, 500);
    const dedupeKey = nonEmptyString(raw.dedupeKey)
      ? raw.dedupeKey!.trim()
      : await sha256Hex(`task:${title}:${raw.dueAt ?? ""}`);

    // 側テーブルで先に「予約」する。ここが競合したら（=既に処理済み）スキップする。
    const { data: claimed, error: claimError } = await supabase
      .from("agent_task_dedupe")
      .upsert(
        { owner_id: ownerId, dedupe_key: dedupeKey },
        { onConflict: "owner_id,dedupe_key", ignoreDuplicates: true },
      )
      .select("dedupe_key");
    if (claimError) {
      throw new IngestError(500, `agent_task_dedupeへの記録に失敗しました: ${claimError.message}`);
    }
    if (!claimed || claimed.length === 0) {
      skipped++;
      continue;
    }

    const insertPayload: Record<string, unknown> = {
      owner_id: ownerId,
      project_id: null,
      title,
      notes: nonEmptyString(raw.notes) ? raw.notes : null,
      due_at: nonEmptyString(raw.dueAt) ? raw.dueAt : null,
      importance: isImportance(raw.importance) ? raw.importance : "mid",
      source: "routine",
    };
    // estimateMin省略時はDBのDEFAULT(30)とestimate_is_inferred(true)に任せる。
    // 明示された場合のみ上書きし、推定ではなく明示値であることも記録する。
    if (typeof raw.estimateMin === "number" && Number.isFinite(raw.estimateMin) && raw.estimateMin > 0) {
      insertPayload.estimate_min = Math.round(raw.estimateMin);
      insertPayload.estimate_is_inferred = false;
    }

    const { data: task, error: insertError } = await supabase
      .from("tasks")
      .insert(insertPayload)
      .select("id")
      .single();

    if (insertError || !task) {
      // 予約だけ残ると次回以降ずっと「処理済み」扱いになり二度と入らなくなるので、
      // INSERT失敗時は側テーブルの予約を取り消す。
      await supabase
        .from("agent_task_dedupe")
        .delete()
        .eq("owner_id", ownerId)
        .eq("dedupe_key", dedupeKey);
      throw new IngestError(500, `tasksへのINSERTに失敗しました: ${insertError?.message ?? "unknown"}`);
    }

    await supabase
      .from("agent_task_dedupe")
      .update({ task_id: task.id })
      .eq("owner_id", ownerId)
      .eq("dedupe_key", dedupeKey);

    inserted++;
  }

  return { inserted, skipped };
}

// ---- reports ----

async function ingestReports(
  ownerId: string,
  items: IncomingReport[],
): Promise<{ inserted: number; skipped: number }> {
  let inserted = 0;
  let skipped = 0;

  for (const raw of items) {
    if (!nonEmptyString(raw?.source) || !nonEmptyString(raw?.title)) {
      skipped++;
      continue;
    }
    const source = raw.source!.trim();
    const title = raw.title!.trim();
    const dedupeKey = nonEmptyString(raw.dedupeKey)
      ? raw.dedupeKey!.trim()
      : await sha256Hex(`report:${source}:${title}:${raw.reportedFor ?? ""}`);

    const { data, error } = await supabase
      .from("reports")
      .upsert(
        {
          owner_id: ownerId,
          source,
          title,
          body_md: nonEmptyString(raw.bodyMd) ? raw.bodyMd : null,
          url: nonEmptyString(raw.url) ? raw.url : null,
          reported_for: nonEmptyString(raw.reportedFor) ? raw.reportedFor : null,
          dedupe_key: dedupeKey,
        },
        { onConflict: "owner_id,dedupe_key", ignoreDuplicates: true },
      )
      .select("id");

    if (error) {
      throw new IngestError(500, `reportsへのINSERTに失敗しました: ${error.message}`);
    }
    if (data && data.length > 0) inserted++;
    else skipped++;
  }

  return { inserted, skipped };
}

// ---- clips ----
//
// taskDedupeKey が付いていたら、同じリクエストで先に起票したタスク（またはそれ以前に
// 同じキーで起票したタスク）に紐付ける。tasksはclipsより先に処理されるので、
// 同一リクエスト内の「タスク＋その投稿文」がそのまま繋がる。
//
// 解決できなかった場合はclip自体は捨てずにtask_id=nullで入れ、warningsで呼び出し元に返す。
// 静かに握りつぶすと、投稿文がどこにも出ないまま成功扱いになってしまう。

async function resolveTaskId(
  ownerId: string,
  taskDedupeKey: string,
  cache: Map<string, string | null>,
): Promise<string | null> {
  const cached = cache.get(taskDedupeKey);
  if (cached !== undefined) return cached;

  const { data, error } = await supabase
    .from("agent_task_dedupe")
    .select("task_id")
    .eq("owner_id", ownerId)
    .eq("dedupe_key", taskDedupeKey)
    .maybeSingle();
  if (error) {
    throw new IngestError(500, `agent_task_dedupeの参照に失敗しました: ${error.message}`);
  }

  const taskId = (data?.task_id as string | null | undefined) ?? null;
  cache.set(taskDedupeKey, taskId);
  return taskId;
}

async function ingestClips(
  ownerId: string,
  agent: string,
  items: IncomingClip[],
): Promise<{ inserted: number; skipped: number; warnings: string[] }> {
  let inserted = 0;
  let skipped = 0;
  const warnings: string[] = [];
  const taskIdCache = new Map<string, string | null>();

  for (const raw of items) {
    if (!nonEmptyString(raw?.label) || !nonEmptyString(raw?.text)) {
      skipped++;
      continue;
    }
    const label = raw.label!.trim();
    const text = raw.text!;
    const dedupeKey = nonEmptyString(raw.dedupeKey)
      ? raw.dedupeKey!.trim()
      : await sha256Hex(`clip:${label}:${text}`);

    let taskId: string | null = null;
    if (nonEmptyString(raw.taskDedupeKey)) {
      const key = raw.taskDedupeKey!.trim();
      taskId = await resolveTaskId(ownerId, key, taskIdCache);
      if (taskId === null) {
        warnings.push(
          `clip「${label}」のtaskDedupeKey(${key})に一致するタスクが無いため、タスクに紐付けずに登録しました`,
        );
      }
    }

    const { data, error } = await supabase
      .from("clips")
      .upsert(
        {
          owner_id: ownerId,
          label,
          text,
          url: nonEmptyString(raw.url) ? raw.url : null,
          image_url: nonEmptyString(raw.imageUrl) ? raw.imageUrl : null,
          task_id: taskId,
          dedupe_key: dedupeKey,
          kind: resolveClipKind(raw.kind, agent),
        },
        { onConflict: "owner_id,dedupe_key", ignoreDuplicates: true },
      )
      .select("id");

    if (error) {
      throw new IngestError(500, `clipsへのINSERTに失敗しました: ${error.message}`);
    }
    if (data && data.length > 0) {
      inserted++;
      continue;
    }

    skipped++;
    // 同じdedupeKeyで既に入っている＝ignoreDuplicatesでtask_idが書かれていない。
    // 紐付けを足すために再送した時に何も起きないと直しようがないので、
    // まだ紐付いていない行に限って後から埋める（既存の紐付けは上書きしない）。
    if (taskId !== null) {
      const { error: linkError } = await supabase
        .from("clips")
        .update({ task_id: taskId })
        .eq("owner_id", ownerId)
        .eq("dedupe_key", dedupeKey)
        .is("task_id", null);
      if (linkError) {
        throw new IngestError(500, `clipsのtask_id紐付けに失敗しました: ${linkError.message}`);
      }
    }
  }

  return { inserted, skipped, warnings };
}

// ---- 監査ログ ----
// 失敗しても呼び出し元へのレスポンスは妨げない（記録の失敗でリクエスト全体を落とさない）。

async function logIngest(
  ownerId: string,
  agent: string,
  counts: { inserted: Record<string, number>; skipped: Record<string, number>; warnings: string[] },
  rawBytes: number,
): Promise<void> {
  const { error } = await supabase.from("agent_ingest_log").insert({
    owner_id: ownerId,
    agent,
    counts,
    raw_bytes: rawBytes,
  });
  if (error) {
    console.error("[agent-ingest] agent_ingest_logへの記録に失敗", error);
  }
}

// ---- エントリポイント ----

Deno.serve(async (req: Request) => {
  try {
    if (req.method !== "POST") {
      throw new IngestError(405, "POSTのみ受け付けます");
    }

    const providedKey = req.headers.get("x-tempus-agent-key");
    if (!providedKey || !timingSafeEqual(providedKey, TEMPUS_AGENT_KEY)) {
      throw new IngestError(401, "x-tempus-agent-keyが不正です");
    }

    const rawBody = await readBodyWithLimit(req);
    const parsed = parseJson(rawBody);
    validateShape(parsed);

    const ownerId = await resolveOwnerId();

    const results: {
      inserted: Record<string, number>;
      skipped: Record<string, number>;
      warnings: string[];
    } = {
      inserted: { tasks: 0, reports: 0, clips: 0 },
      skipped: { tasks: 0, reports: 0, clips: 0 },
      warnings: [],
    };

    try {
      const t = await ingestTasks(ownerId, parsed.tasks ?? []);
      results.inserted.tasks = t.inserted;
      results.skipped.tasks = t.skipped;

      const r = await ingestReports(ownerId, parsed.reports ?? []);
      results.inserted.reports = r.inserted;
      results.skipped.reports = r.skipped;

      const c = await ingestClips(ownerId, parsed.agent!, parsed.clips ?? []);
      results.inserted.clips = c.inserted;
      results.skipped.clips = c.skipped;
      results.warnings = c.warnings;
    } finally {
      // 途中で例外が飛んでも、ここまでの結果は必ずログへ残す（記録を重視する方針のため）。
      await logIngest(ownerId, parsed.agent!, results, rawBody.byteLength);
    }

    return jsonResponse(200, {
      ok: true,
      inserted: results.inserted,
      skipped: results.skipped,
      warnings: results.warnings,
    });
  } catch (err) {
    if (err instanceof IngestError) {
      return jsonResponse(err.status, { ok: false, error: err.message });
    }
    console.error("[agent-ingest] 予期しないエラー", err);
    return jsonResponse(500, { ok: false, error: "internal error" });
  }
});
