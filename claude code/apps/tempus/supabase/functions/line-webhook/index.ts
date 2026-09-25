// Tempus: LINEに一言送るとタスクが起票される Edge Function（Deno）。
//
// 起票の必須項目はタイトルのみ（docs/SPEC.md）。LINEの本文をそのままtitleにし、
// project_id=NULL（受信箱）で投げ込む。estimate_min/importance/status等はDBのDEFAULTに任せる。
//
// セキュリティ上の要:
// - X-Line-Signatureをチャネルシークレットで検証できないリクエストは401で即拒否する。
//   ここを飛ばすと誰でも他人のprofilesに紐づくタスクを起票できてしまう。
// - タスクの所有者は「送ってきたLINEユーザー」ではなく、profiles.line_user_idで突合できた
//   Tempusユーザーのみ。突合できなければタスクは作らない。
//
// LINEはWebhookの応答が遅いとタイムアウト扱いで再送してくる。処理は軽量に保ち、
// 再送された同一イベント（webhookEventId）はline_webhook_eventsテーブルで弾いて二重起票を防ぐ。
//
// 返信は必ず reply API（/v2/bot/message/reply）を使うこと。push APIは無料枠(月200通)を消費するため
// 絶対に使わない。reply APIの応答メッセージはLINEの無料枠カウント対象外。

import { createClient } from "npm:@supabase/supabase-js@2.45.0";

function requireEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) {
    throw new Error(
      `[line-webhook] 環境変数 ${name} が設定されていません。` +
        `supabase secrets set ${name}=<値> を実行してからデプロイし直してください。`,
    );
  }
  return value;
}

// 起動時（モジュール評価時）に必須環境変数を確認する。1つでも欠けていれば
// ここで例外を投げ、Edge Functionの起動自体を失敗させて気づけるようにする。
const LINE_CHANNEL_SECRET = requireEnv("LINE_CHANNEL_SECRET");
const LINE_CHANNEL_ACCESS_TOKEN = requireEnv("LINE_CHANNEL_ACCESS_TOKEN");
const SUPABASE_URL = requireEnv("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const MAX_TITLE_LEN = 200;
const LINE_REPLY_ENDPOINT = "https://api.line.me/v2/bot/message/reply";

// ---- LINE webhookペイロードの最小限の型（使うフィールドのみ） ----

interface LineWebhookRequestBody {
  destination?: string;
  events?: LineEvent[];
}

interface LineEvent {
  type: string;
  webhookEventId?: string;
  replyToken?: string;
  source?: { type?: string; userId?: string };
  message?: { type: string; text?: string };
}

// ---- 署名検証 ----

function toBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// 文字列の内容比較にかかる時間から情報が漏れないよう、早期returnせず全バイトを見る。
// （長さが違う場合のみ即falseだが、これは今回の用途では情報漏洩にならない: 期待値は
//  HMAC-SHA256のbase64で常に固定長のため、長さの違いはヘッダが壊れている/偽物である
//  ことしか示さない）
function timingSafeEqual(a: string, b: string): boolean {
  const bytesA = new TextEncoder().encode(a);
  const bytesB = new TextEncoder().encode(b);
  if (bytesA.length !== bytesB.length) return false;
  let diff = 0;
  for (let i = 0; i < bytesA.length; i++) {
    diff |= bytesA[i] ^ bytesB[i];
  }
  return diff === 0;
}

async function computeLineSignature(secret: string, body: ArrayBuffer): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, body);
  return toBase64(new Uint8Array(signature));
}

async function verifyLineSignature(
  secret: string,
  rawBody: ArrayBuffer,
  signatureHeader: string | null,
): Promise<boolean> {
  if (!signatureHeader) return false;
  const expected = await computeLineSignature(secret, rawBody);
  return timingSafeEqual(expected, signatureHeader);
}

// ---- LINE reply API ----
// push APIは絶対に使わない（月200通の無料枠を消費するため）。reply APIはカウント対象外。

async function replyText(replyToken: string, text: string): Promise<void> {
  try {
    const res = await fetch(LINE_REPLY_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        replyToken,
        messages: [{ type: "text", text }],
      }),
    });
    if (!res.ok) {
      const errBody = await res.text();
      console.error(`[line-webhook] reply失敗: ${res.status} ${errBody}`);
    }
  } catch (err) {
    console.error("[line-webhook] reply APIへのリクエストでエラー", err);
  }
}

// ---- 1イベントの処理 ----

async function handleEvent(event: LineEvent): Promise<void> {
  // テキストメッセージ以外（スタンプ・画像・フォロー等）は無視する。
  if (event.type !== "message" || event.message?.type !== "text") {
    return;
  }

  const eventId = event.webhookEventId;
  const replyToken = event.replyToken;
  const userId = event.source?.userId;
  const text = event.message?.text;

  if (!eventId || !replyToken || !userId || text === undefined) {
    console.error("[line-webhook] イベントに必須フィールドが無い", event);
    return;
  }

  // 冪等性チェック: LINEはwebhookを再送することがあるため、同じwebhookEventIdの
  // 2回目以降は二重にタスクを作らず、返信もしない（reply tokenは使い捨てで再送時には
  // 既に無効になっているため、再度返信を試みてもエラーになるだけ）。
  // ON CONFLICT DO NOTHING（ignoreDuplicates）で「初めて見たイベントか」を1回のINSERTで
  // 原子的に判定する。
  const { data: insertedEvent, error: insertEventError } = await supabase
    .from("line_webhook_events")
    .upsert({ event_id: eventId }, { onConflict: "event_id", ignoreDuplicates: true })
    .select("event_id");

  if (insertEventError) {
    console.error("[line-webhook] line_webhook_eventsへの記録に失敗", insertEventError);
    return;
  }
  if (!insertedEvent || insertedEvent.length === 0) {
    console.log(`[line-webhook] 重複イベントを無視: ${eventId}`);
    return;
  }

  // サロゲートペア（絵文字等）を分断しないようArray.fromでコードポイント単位に扱う。
  const chars = Array.from(text.trim());
  if (chars.length === 0) {
    await replyText(replyToken, "何も書かれていません");
    return;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("line_user_id", userId)
    .maybeSingle();

  if (profileError) {
    console.error("[line-webhook] profilesの検索に失敗", profileError);
    return;
  }

  if (!profile) {
    await replyText(
      replyToken,
      `連携がまだです。アプリの設定画面でこのコードを登録してください: ${userId}`,
    );
    return;
  }

  const fullText = chars.join("");
  const isOverLimit = chars.length > MAX_TITLE_LEN;
  const title = isOverLimit ? chars.slice(0, MAX_TITLE_LEN).join("") : fullText;
  const notes = isOverLimit ? fullText : null;

  const { data: task, error: taskError } = await supabase
    .from("tasks")
    .insert({
      owner_id: profile.id,
      project_id: null,
      title,
      notes,
      source: "line",
    })
    .select("id, title")
    .single();

  if (taskError || !task) {
    console.error("[line-webhook] tasksへのINSERTに失敗", taskError);
    return;
  }

  // 冪等性テーブルにどのタスクが作られたかを残す（監査・デバッグ用）。失敗しても
  // タスク自体は作成済みなのでユーザーへの返信は続行する。
  const { error: linkError } = await supabase
    .from("line_webhook_events")
    .update({ task_id: task.id })
    .eq("event_id", eventId);
  if (linkError) {
    console.error("[line-webhook] line_webhook_events.task_idの更新に失敗", linkError);
  }

  await replyText(replyToken, `登録した: ${task.title}`);
}

// ---- エントリポイント ----

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("method not allowed", { status: 405 });
  }

  // HMAC計算には生のリクエストボディが必要なので、まずArrayBufferで受け取る。
  const rawBody = await req.arrayBuffer();
  const signatureHeader = req.headers.get("x-line-signature");

  const isValid = await verifyLineSignature(LINE_CHANNEL_SECRET, rawBody, signatureHeader);
  if (!isValid) {
    console.error("[line-webhook] 署名検証に失敗したリクエストを拒否");
    return new Response("invalid signature", { status: 401 });
  }

  let body: LineWebhookRequestBody;
  try {
    body = JSON.parse(new TextDecoder().decode(rawBody));
  } catch (err) {
    // 署名は正しいのにJSONとして壊れている、はほぼ起こらないが念のため。
    // LINE側には200を返し延々と再送されるのを避け、原因はログで追う。
    console.error("[line-webhook] リクエストボディのJSONパースに失敗", err);
    return new Response("ok", { status: 200 });
  }

  const events = body.events ?? [];
  // LINEの疎通確認（Verifyボタン）はevents:[]で送られてくる。必ず200を返す。
  if (events.length === 0) {
    return new Response("ok", { status: 200 });
  }

  // 各イベントは独立して処理し、1件の失敗が他のイベントやレスポンスに影響しないようにする。
  // 個々のエラーはhandleEvent内でログして握りつぶす方針だが、二重の保険としてここでもcatchする。
  await Promise.all(
    events.map((event) =>
      handleEvent(event).catch((err) => {
        console.error("[line-webhook] イベント処理で予期しないエラー", err);
      })
    ),
  );

  // 重い処理はしていないが、DB/LINE APIへの疎通不良等どんな理由であれ
  // LINE側には200を返す（そうしないと延々と再送されてしまう）。
  return new Response("ok", { status: 200 });
});
