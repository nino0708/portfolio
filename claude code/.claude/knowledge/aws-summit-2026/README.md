# AWS Summit セッション資料ナレッジベース

AWS Summit のセッション資料 PDF **150本**（元データ 914MB）を全文Markdown化したもの。
PDFそのものはリポジトリに入れていない（サイズのため）。テキストだけで **3.4MB**。

## 構造

```
aws-summit-2026/
├── README.md          # このファイル（使い方）
├── INSIGHTS.md        # ★横断合成（意思決定用）— 判断に迷ったらまずここ
├── DIGEST.md          # 全150件の結論部だけを集めたダイジェスト（横断分析用・207KB）
├── INDEX.md           # 全150件の一覧表（カテゴリ別・スポンサー・ページ数・テーマ）
├── BY-THEME.md        # テーマ別索引（生成AI/セキュリティ/FinOps ...）
├── BY-SERVICE.md      # AWSサービス別索引（Bedrock/Lambda/S3 ...）
├── catalog.json       # 全メタデータ（機械可読・スクリプトから使う用）
├── search.py          # 横断検索ツール
└── sessions/
    ├── AWSセッション/        (67件)  AWS公式スピーカー
    ├── 事例セッション/       (44件)  ユーザー企業の導入事例
    └── パートナーセッション/ (39件)  パートナー各社
```

各セッションファイルは frontmatter + ページ単位の本文:

```markdown
---
title: "Kiro と Amazon の文化から学ぶ AI 駆動開発の型"
category: "AWSセッション"
sponsor: "Trend Micro"        # パートナーセッションのみ
session_id: "DVT301"          # 公式サイトのセッション番号と照合できる
pages: 61
topics: ["AI駆動開発", "生成AI/エージェント"]
services: ["Kiro", "Amazon Bedrock", "MCP"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/..."
---

## p.1
（1ページ目の本文）

## p.2
...
```

`## p.N` 見出しがあるので、ヒットした箇所が**元PDFの何ページか**そのまま分かる。
原本を見たいときは frontmatter の `source_pdf` を開く。

## 引き方

**0. 判断材料が欲しいとき** → **`INSIGHTS.md`（約12KB）を読む**。
150件を読んだ上での横断合成。「エージェントの精度が出ない」「コストをどう見積もるか」
「本番に出す前に何を揃えるか」といった論点ごとに、資料の結論と出典セッションIDが並べてある。
そこから原文に降りるのが最短。

**1. テーマ・サービスから探す** → `BY-THEME.md` / `BY-SERVICE.md` を開く

**2. キーワードで全文検索**（一番速い）

```bash
cd .claude/knowledge/aws-summit-2026

# どのセッションが該当するか（ファイル名だけ）
grep -rl "AgentCore" sessions/

# 前後の文脈つきで（-h で冗長なパス表示を抑制）
grep -rn -B2 -A4 "コスト最適化" sessions/AWSセッション/
```

**3. 付属ツールで検索**

```bash
python3 search.py "マルチエージェント"            # 全文検索、ヒット数順
python3 search.py "RAG" --topic セキュリティ      # テーマで絞る
python3 search.py --service "Amazon Bedrock"      # サービスで一覧
python3 search.py --list-topics                   # テーマ一覧と件数
```

**4. メタデータで絞る**

```bash
# 50ページ以上のボリュームある資料
python3 -c "
import json
for r in json.load(open('catalog.json')):
    if r['pages'] >= 50: print(r['pages'], r['title'])
"
```

## Claude に使わせるとき

`INDEX.md`(46KB) や `BY-THEME.md`(62KB) は**全部読ませると重い**。
まず `grep` か `search.py` で候補を数件に絞り、その `sessions/**.md` だけを読ませるのが安い。

セッションIDでの逆引きも効く（`AIM412` など公式サイトの番号）:

```bash
grep -rl "AIM412" . | head
```

## 再生成

生成スクリプトは `tools/summit-kb/` にある。PDFフォルダを差し替えて順に実行する:

```bash
python3 tools/summit-kb/extract.py      # PDF -> sessions/**.md + catalog.json
python3 tools/summit-kb/retag.py        # topics/level を付け直す
python3 tools/summit-kb/build_index.py  # INDEX / BY-THEME / BY-SERVICE を生成
```

`extract.py` の `SRC` が元PDFフォルダのパス。`source_pdf` は取り込み時の絶対パスなので、
PDFを移動・削除すると古くなる点に注意（テキストは残るので検索自体は動く）。

## 既知の制約

- **レベル表記（L100〜L400）はほぼ取れない** — 資料側に記載があるのが150件中4件だけ。
- **図表は落ちる** — テキストのみ抽出。アーキテクチャ図が主眼の資料は元PDFを見る必要がある。
- `topics` はタイトル＋冒頭3ページのキーワード判定。取りこぼしはあるので、
  厳密に探すときはタグに頼らず全文 grep する。
