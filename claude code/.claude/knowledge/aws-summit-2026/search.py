#!/usr/bin/env python3
"""AWS Summit セッション資料の横断検索。

  python3 search.py "マルチエージェント"
  python3 search.py "RAG" --topic セキュリティ
  python3 search.py --service "Amazon Bedrock"
  python3 search.py --list-topics
"""
import argparse, json, re, sys
from collections import Counter
from pathlib import Path

BASE = Path(__file__).resolve().parent
CATALOG = json.load(open(BASE / "catalog.json", encoding="utf-8"))


def load_body(rec):
    """frontmatter は services/topics がそのまま検索にヒットしてノイズになるので落とす。"""
    text = (BASE / rec["path"]).read_text(encoding="utf-8")
    parts = text.split("---\n", 2)
    return parts[2] if len(parts) == 3 else text


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("query", nargs="?", help="全文検索するキーワード")
    ap.add_argument("--topic", help="テーマで絞り込む（部分一致）")
    ap.add_argument("--service", help="サービスで絞り込む（部分一致）")
    ap.add_argument("--category", help="カテゴリで絞り込む（部分一致）")
    ap.add_argument("--list-topics", action="store_true")
    ap.add_argument("--list-services", action="store_true")
    ap.add_argument("-n", type=int, default=20, help="表示件数 (default 20)")
    ap.add_argument("-c", "--context", type=int, default=2, help="ヒット箇所の表示数")
    a = ap.parse_args()

    if a.list_topics:
        for t, n in Counter(t for r in CATALOG for t in r["topics"]).most_common():
            print(f"{n:4d}  {t}")
        return
    if a.list_services:
        for s, n in Counter(s for r in CATALOG for s in r.get("services", [])).most_common():
            print(f"{n:4d}  {s}")
        return

    recs = CATALOG
    for key, val in (("topics", a.topic), ("services", a.service)):
        if val:
            recs = [r for r in recs if any(val in x for x in r.get(key, []))]
    if a.category:
        recs = [r for r in recs if a.category in r["category"]]

    if not a.query:
        if not recs:
            print("該当なし")
            return
        for r in recs[: a.n]:
            print(f"[{r['category']}] {r['title']} ({r['pages']}p)")
            print(f"    {r['path']}")
        print(f"\n{len(recs)} 件")
        return

    pat = re.compile(re.escape(a.query), re.IGNORECASE)
    hits = []
    for r in recs:
        body = load_body(r)
        found = list(pat.finditer(body))
        if found:
            hits.append((len(found), r, body, found))
    hits.sort(key=lambda x: -x[0])

    if not hits:
        print(f"'{a.query}' に該当なし")
        return

    for count, r, body, found in hits[: a.n]:
        print(f"\n\033[1m[{r['category']}] {r['title']}\033[0m  ({count}件 / {r['pages']}p)")
        print(f"  {r['path']}")
        for m in found[: a.context]:
            # ヒット位置が元PDFの何ページかを直前の "## p.N" 見出しから逆算する
            page = "?"
            pm = list(re.finditer(r"^## p\.(\d+)$", body[: m.start()], re.M))
            if pm:
                page = pm[-1].group(1)
            s = max(0, m.start() - 60)
            e = min(len(body), m.end() + 60)
            snip = re.sub(r"\s+", " ", body[s:e]).strip()
            print(f"    p.{page}: …{snip}…")

    print(f"\n{len(hits)} セッションがヒット")


if __name__ == "__main__":
    main()
