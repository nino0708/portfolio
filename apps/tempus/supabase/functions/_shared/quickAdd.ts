// iPhone のショートカットから1件だけ起票する時の簡易形式。
// { "title": "...", "notes": "..." } だけを送れば、{ agent: "iPhone共有", tasks: [{ title, notes }] } として扱う。
// ショートカットで入れ子の配列を組むのは手間なので、平らな形も受け付ける。
export function expandQuickAdd(payload: unknown): unknown {
  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) return payload;
  const b = payload as Record<string, unknown>;
  const title = typeof b.title === "string" ? b.title.trim() : "";
  if (b.tasks !== undefined || title === "") return payload;
  const notes = typeof b.notes === "string" && b.notes.trim() !== "" ? b.notes : undefined;
  const agent = typeof b.agent === "string" && b.agent.trim() !== "" ? b.agent : "iPhone共有";
  return { agent, tasks: [{ title: title.slice(0, 200), ...(notes ? { notes } : {}) }] };
}
