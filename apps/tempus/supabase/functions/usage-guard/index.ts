// Tempus: Supabase無料枠の予算ガードEdge Function（Deno）。1日1回、外部のスケジューラ
// （GitHub Actions cron / pg_cron+pg_net。詳細はREADME.md）から叩かれる想定。
//
// 目的: Supabase Freeプランは課金が発生しない。超過するのは請求ではなく
// サービス制限（プロジェクト一時停止／DB読み取り専用／API 402）。守るのは「止まらないこと」。
// Management APIにはusage/quota/invoiceのエンドポイントが無いため、自分のDBを自分で
// 測るしかない（docs/SPEC.md「制約」参照）。measure = public.collect_usage()（0009_usage_guard.sql）。
//
// 重要な副次効果: Supabaseは「7日間未使用のプロジェクトを自動停止する」。この関数が毎日
// DBに書き込むこと自体が、その自動停止を防ぐ役割を兼ねている（=無料枠の話とは別に、
// 動かし続けること自体に意味がある）。
//
// 測れないもの: 通信5GB/月はPostgres/Storageの中から観測できる値ではないため、ここでは
// 測らない。測れないものを測ったふりをしない。設計側で画像・添付をSupabaseに置かない
// 方針にして構造的に食わせないようにしている（そちらで対処済み）。
//
// 通知方針: LINEのpush APIは月200通枠を消費する（reply APIと違いカウント対象）。
// 90%以上、または70%を「初めて」跨いだ時だけ送る。毎日は鳴らさない
// （枠の節約と、鳴りすぎて無視される事故を防ぐため）。前回どこまで通知したかは
// usage_guard_stateテーブル（シングルトン1行）で覚えておく。

import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2.45.0";

function requireEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) {
    throw new Error(
      `[usage-guard] 環境変数 ${name} が設定されていません。` +
        `supabase secrets set ${name}=<値> を実行してからデプロイし直してください。`,
    );
  }
  return value;
}

// 起動時（モジュール評価時）に必須環境変数を確認する。1つでも欠けていれば
// ここで例外を投げ、Edge Functionの起動自体を失敗させて気づけるようにする。
const USAGE_GUARD_KEY = requireEnv("USAGE_GUARD_KEY");
const SUPABASE_URL = requireEnv("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

// LINE通知は任意（未設定なら「70%/90%を跨いでも通知はスキップし、判定結果だけ返す」動作にする）。
// line-webhookやagent-ingestと違い、これが無くても集計自体は無意味にならないためrequireEnvにしない。
const LINE_CHANNEL_ACCESS_TOKEN = Deno.env.get("LINE_CHANNEL_ACCESS_TOKEN") ?? null;
const LINE_USER_ID = Deno.env.get("LINE_USER_ID") ?? null;

const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

// ---- 無料枠の上限（後から直せるようファイル先頭に定数としてまとめる） ----
// 出典: docs/SPEC.md「制約」/ Supabase公式の無料枠一覧。通信5GB/月は測れないためここには含めない。
//
// 正直な注記: edgeInvocationsも通信5GBと同じく実際には測れない。Management APIに
// usage/quota系のエンドポイントが無いため、Edge関数の呼び出し回数を外部からもDBからも
// 取得する手段が無い（collect_usage()のedge_invocationsは常にnull）。上限だけは
// ここに定義しておき、将来ダッシュボードの表示値を手動で埋める余地を残す。
// used=nullの項目はcomputeRatios()でratio=nullになり、閾値判定からは自動的に除外される
// （「測れないものを0%として扱う」誤魔化しをしない）。
const FREE_TIER_LIMITS = {
  dbBytes: 500 * 1024 * 1024, // DB 500MB
  storageBytes: 1024 * 1024 * 1024, // ファイル 1GB
  authUsers: 50_000, // MAU 5万
  edgeInvocations: 500_000, // Edge関数 50万回/月（測定手段が無いため常にratio=null。上の注記参照）
} as const;

const WARN_THRESHOLD = 0.7; // 70%で警告
const CRITICAL_THRESHOLD = 0.9; // 90%で強い警告

// ---- LINE push API ----
// line-webhookのreply APIとは違い、push APIは月200通の無料枠を消費する。
// だから毎日は呼ばない（本ファイルの通知トリガー判定を参照）。
const LINE_PUSH_ENDPOINT = "https://api.line.me/v2/bot/message/push";

async function pushLine(text: string): Promise<{ sent: boolean; error?: string }> {
  if (!LINE_CHANNEL_ACCESS_TOKEN || !LINE_USER_ID) {
    return { sent: false, error: "LINE_CHANNEL_ACCESS_TOKEN または LINE_USER_ID が未設定のためスキップ" };
  }
  try {
    const res = await fetch(LINE_PUSH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        to: LINE_USER_ID,
        messages: [{ type: "text", text }],
      }),
    });
    if (!res.ok) {
      const errBody = await res.text();
      console.error(`[usage-guard] LINE push失敗: ${res.status} ${errBody}`);
      return { sent: false, error: `LINE push failed: ${res.status}` };
    }
    return { sent: true };
  } catch (err) {
    console.error("[usage-guard] LINE push APIへのリクエストでエラー", err);
    return { sent: false, error: err instanceof Error ? err.message : "unknown error" };
  }
}

// ---- 共有シークレットのタイミングセーフ比較 ----
// USAGE_GUARD_KEYは人間が決める任意長の共有シークレットなので、長さの違いも定数時間で
// 畳み込み、早期returnしない（agent-ingest/index.tsと同じ考え方）。
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

// ---- collect_usage() の戻り値の型（0009_usage_guard.sql の usage_snapshots に対応） ----

interface UsageSnapshotRow {
  id: string;
  taken_at: string;
  db_bytes: number | string | null; // bigintはsupabase-jsではstringで返ることがある
  storage_bytes: number | string | null;
  table_rows: Record<string, number> | null;
  auth_users: number | null;
  edge_invocations: number | null;
  notes: string | null;
}

type NotifyLevel = "none" | "warn70" | "critical90";

interface UsageRatio {
  key: "dbBytes" | "storageBytes" | "authUsers" | "edgeInvocations";
  label: string;
  used: number | null;
  limit: number;
  ratio: number | null; // 0〜1超。値が取れない場合はnull
}

function toNumberOrNull(value: number | string | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  const n = typeof value === "string" ? Number(value) : value;
  return Number.isFinite(n) ? n : null;
}

function computeRatios(row: UsageSnapshotRow): UsageRatio[] {
  const base: UsageRatio[] = [
    {
      key: "dbBytes",
      label: "DB容量",
      used: toNumberOrNull(row.db_bytes),
      limit: FREE_TIER_LIMITS.dbBytes,
      ratio: null,
    },
    {
      key: "storageBytes",
      label: "ストレージ容量",
      used: toNumberOrNull(row.storage_bytes),
      limit: FREE_TIER_LIMITS.storageBytes,
      ratio: null,
    },
    {
      key: "authUsers",
      label: "MAU(認証ユーザー数)",
      used: toNumberOrNull(row.auth_users),
      limit: FREE_TIER_LIMITS.authUsers,
      ratio: null,
    },
    {
      key: "edgeInvocations",
      label: "Edge関数呼び出し回数",
      used: toNumberOrNull(row.edge_invocations),
      limit: FREE_TIER_LIMITS.edgeInvocations,
      ratio: null,
    },
  ];
  return base.map((r) => ({ ...r, ratio: r.used === null ? null : r.used / r.limit }));
}

// 70%/90%の閾値判定。境界値は「以上」で切る（69.9%はwarn未満、70.0%はwarn、
// 89.9%はwarn、90.0%はcritical）。ratioがnull（値が取れなかった項目）は無視する。
function classifyLevel(ratios: UsageRatio[]): NotifyLevel {
  const known = ratios.filter((r): r is UsageRatio & { ratio: number } => r.ratio !== null);
  if (known.some((r) => r.ratio >= CRITICAL_THRESHOLD)) return "critical90";
  if (known.some((r) => r.ratio >= WARN_THRESHOLD)) return "warn70";
  return "none";
}

// 通知するかどうか: 「90%以上」は毎回鳴らす（実際に止まりかねないため）。
// 「70%台」は前回未通知(none)から初めて跨いだ時だけ。既にwarn70/critical90を
// 通知済みで、今回もwarn70のまま（悪化していない）なら鳴らさない。
function shouldNotify(currentLevel: NotifyLevel, lastLevel: NotifyLevel): boolean {
  if (currentLevel === "critical90") return true;
  if (currentLevel === "warn70") return lastLevel === "none";
  return false;
}

function formatBytes(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  if (mb >= 1024) return `${(mb / 1024).toFixed(2)}GB`;
  return `${mb.toFixed(1)}MB`;
}

function formatUsed(key: UsageRatio["key"], used: number): string {
  if (key === "dbBytes" || key === "storageBytes") return formatBytes(used);
  return used.toLocaleString("ja-JP");
}

function buildMessage(level: NotifyLevel, ratios: UsageRatio[]): string {
  const known = ratios.filter((r): r is UsageRatio & { ratio: number; used: number } =>
    r.ratio !== null && r.used !== null
  );
  const threshold = level === "critical90" ? CRITICAL_THRESHOLD : WARN_THRESHOLD;
  const overThreshold = known.filter((r) => r.ratio >= threshold);
  const target = overThreshold.length > 0 ? overThreshold : known;
  const lines = target
    .sort((a, b) => b.ratio - a.ratio)
    .map((r) => `・${r.label}: ${(r.ratio * 100).toFixed(1)}%（${formatUsed(r.key, r.used)} / ${formatUsed(r.key, r.limit)}）`);

  const heading = level === "critical90"
    ? "[Tempus] Supabase無料枠 90%超え注意"
    : "[Tempus] Supabase無料枠 70%超え";
  const note = level === "critical90"
    ? "このままだとプロジェクト停止・読み取り専用化・API 402の恐れがあります。"
    : "まだ余裕はありますが、そろそろ意識しておいてください。";

  return [heading, ...lines, note, "※通信5GB/月はここでは測れません（測れないので割り切って対象外）。"].join("\n");
}

// ---- エントリポイント ----

Deno.serve(async (req: Request) => {
  if (req.method !== "POST" && req.method !== "GET") {
    return new Response("method not allowed", { status: 405 });
  }

  const providedKey = req.headers.get("x-usage-guard-key");
  if (!providedKey || !timingSafeEqual(providedKey, USAGE_GUARD_KEY)) {
    console.error("[usage-guard] x-usage-guard-keyが不正なリクエストを拒否");
    return new Response("unauthorized", { status: 401 });
  }

  try {
    // 1. 使用量を実測してusage_snapshotsに1行記録する。
    //    このDBアクセス自体が「7日間未使用による自動停止」を防ぐ役割も兼ねている。
    const { data: snapshot, error: collectError } = await supabase
      .rpc("collect_usage")
      .single<UsageSnapshotRow>();

    if (collectError || !snapshot) {
      throw new Error(`collect_usageに失敗しました: ${collectError?.message ?? "unknown"}`);
    }

    // 2. 無料枠に対する使用率を計算する。
    const ratios = computeRatios(snapshot);
    const currentLevel = classifyLevel(ratios);

    // 3. 前回の通知状態を読む（usage_guard_stateはシングルトン1行）。
    const { data: state, error: stateError } = await supabase
      .from("usage_guard_state")
      .select("last_notified_level")
      .eq("id", true)
      .single();

    if (stateError || !state) {
      throw new Error(`usage_guard_stateの取得に失敗しました: ${stateError?.message ?? "unknown"}`);
    }
    const lastLevel = state.last_notified_level as NotifyLevel;

    // 4. 90%以上か、70%を初めて跨いだ時だけLINEに通知する。毎日は鳴らさない。
    const willNotify = shouldNotify(currentLevel, lastLevel);
    let notifyResult: { sent: boolean; error?: string } | null = null;
    let message: string | null = null;

    if (willNotify) {
      message = buildMessage(currentLevel, ratios);
      notifyResult = await pushLine(message);
    }

    // 通知レベルが変化した場合のみ状態を更新する（毎日書き込むと変化していない情報の
    // 上書きになるだけなので、意味のある変化があった時だけにする）。
    if (currentLevel !== lastLevel) {
      const { error: updateStateError } = await supabase
        .from("usage_guard_state")
        .update({
          last_notified_level: currentLevel,
          last_notified_at: willNotify ? new Date().toISOString() : undefined,
          updated_at: new Date().toISOString(),
        })
        .eq("id", true);
      if (updateStateError) {
        console.error("[usage-guard] usage_guard_stateの更新に失敗", updateStateError);
      }
    }

    // 5. 古いスナップショットを掃除する（予算ガード自身がDB容量を圧迫しないため）。
    const { data: prunedCount, error: pruneError } = await supabase.rpc("prune_usage_snapshots");
    if (pruneError) {
      console.error("[usage-guard] prune_usage_snapshotsに失敗", pruneError);
    }

    // 6. 結果をJSONで返す。
    return new Response(
      JSON.stringify({
        ok: true,
        takenAt: snapshot.taken_at,
        usage: ratios.map((r) => ({
          key: r.key,
          label: r.label,
          used: r.used,
          limit: r.limit,
          ratioPercent: r.ratio === null ? null : Number((r.ratio * 100).toFixed(2)),
        })),
        // 通信5GB/月はPostgres/Storageの中から観測できないため測っていない（測れないものを
        // 測ったふりをしない）。設計側で画像・添付をSupabaseに置かない方針にして対処済み。
        networkEgress: "unmeasured (structurally avoided instead — see README.md)",
        level: currentLevel,
        previousLevel: lastLevel,
        notified: notifyResult?.sent ?? false,
        notifySkippedReason: willNotify ? notifyResult?.error ?? null : "70%未満、または既に同レベルで通知済み",
        prunedSnapshots: pruneError ? null : prunedCount,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("[usage-guard] 予期しないエラー", err);
    return new Response(
      JSON.stringify({ ok: false, error: err instanceof Error ? err.message : "internal error" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});
