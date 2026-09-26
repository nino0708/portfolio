// 文案(clip)の種類。x_post = X に貼る投稿文（「Xで投稿」ボタンを出す）、note = 参考メモ（コピーだけ）。
// 送信元が kind を指定していればそれを使う。無ければ送信元の名前で決める。
// 社長室（秘書）の文案は部署資料からの抜き出しで、投稿文ではない。
export type ClipKind = "x_post" | "note";

export function resolveClipKind(kind: unknown, agent: string): ClipKind {
  if (kind === "x_post" || kind === "note") return kind;
  return agent.includes("秘書") ? "note" : "x_post";
}
