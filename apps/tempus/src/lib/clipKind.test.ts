import { describe, expect, it } from "vitest";
import { resolveClipKind } from "../../supabase/functions/_shared/clipKind";

describe("resolveClipKind", () => {
  it("指定があればそれを使う", () => {
    expect(resolveClipKind("note", "マーケティング部")).toBe("note");
    expect(resolveClipKind("x_post", "社長室（秘書）")).toBe("x_post");
  });
  it("秘書からの文案は既定でメモ", () => {
    expect(resolveClipKind(undefined, "社長室（秘書）")).toBe("note");
  });
  it("それ以外は既定で投稿文", () => {
    expect(resolveClipKind(undefined, "編集部")).toBe("x_post");
    expect(resolveClipKind("unknown", "マーケティング部")).toBe("x_post");
  });
});
