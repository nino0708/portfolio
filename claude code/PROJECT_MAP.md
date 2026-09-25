# プロジェクト構造マップ

このファイルはClaude Codeが各ディレクトリの目的を素早く把握するためのナビゲーションガイドです。
（最終確認: 2026-08-29 — 実ディレクトリと突き合わせ済み）

## トップ構造

```
claude code/
├─ apps/      ← 動くWebアプリ
├─ tools/     ← 生成・自動化スクリプト
├─ content/   ← コンテンツ・下書き・学習資料
├─ .claude/   ← docs(公式ドキュメント日本語版) / commands(スラッシュコマンド)
│              / skills(オンデマンドスキル) / agents(サブエージェント) / knowledge(AWS Summit全文)
├─ CLAUDE.md
├─ PROJECT_MAP.md
└─ skills-lock.json  ← 外部スキルの導入元とハッシュ
```

> ⚠️ **`claude code/` 配下はほぼ git 未追跡**。追跡済みは `apps/accounting-app/` と `apps/tempus/supabase/functions/calendar-sync/index.ts` の1ファイルのみ。それ以外（Tempus本体・tokyo-building-blog・.claude・このファイル）はバックアップされていない。

## ディレクトリ一覧

| パス | 種別 | 概要 |
|---|---|---|
| `apps/tempus/` | Webアプリ(React/Vite PWA)+Supabase | **時間割型タスク管理・本番稼働中**。仕様の正は `docs/SPEC.md`、型の正は `src/types/domain.ts`。ルーティン連携手順は `docs/ops/`。Cloudflare Workers配信・Supabase(DB/Edge Functions)・LINE起票 |
| `apps/accounting-app/` | Webアプリ(Python/Flask) | 団体会計の汎用アプリ。複合仕訳・整合性チェッカー・かんたん入力アシスタント。DB: `data/accounting.db` |
| `apps/tokyo-building-blog/` | Webサイト(Astro)+AWS | 建築ブログ Built Japan の**ローカル版**。⚠️ 本番ビルド元は GitHub `nino0708/blog` で内容が乖離している。本番修正時はこちらをミラーせず `nino0708/blog` の実ファイルを取得して編集する |
| `apps/valetudo/` | 単一HTML | 体調管理アプリ。猫が反応する毎日の体調記録。`valetudo.html` を開くだけ |
| `apps/ドリンク代計算/` | 単一HTML | 飲み会の必要なお酒の本数・費用を出す幹事向けツール。会計アプリから切り出したもの。`index.html` を開くだけ |
| `apps/builtjapan-brand/` | HTML/CSS素材 | `@builtjapan` のX用ヘッダー＆アイコン。ヘッドレスChromeで実ファイル化（成果物は `out/`） |
| `apps/friday-brand/` | HTML/CSS素材 | Friday商事のX用ヘッダー＆アイコン。同上 |
| `tools/auto-blog/` | スクリプト(Python) | Claude APIを使った自動ブログ記事生成・投稿ツール（Qiita下書き） |
| `tools/record-blog/` | スクリプト(Python) | スクリーン録画フレームからブログ記事を自動生成するツール |
| `tools/friday-assistant/` | スクリプト(Node.js) | LINE通知・タスク管理・スケジューラー。Friday個人アシスタント版 |
| `tools/dividend-portfolio/` | スクリプト(Python) | 高配当株の月次買付アシスタント。推奨表＋保有状況から「何を何株買うか」を出す（`allocate.py`／`fetch_prices.py`） |
| `tools/summit-kb/` | スクリプト(Python) | AWS Summit資料のナレッジベース構築側（PDF抽出・索引生成・タグ付け）。成果物は `.claude/knowledge/aws-summit-2026/` |
| `tools/screenshot.py` | スクリプト(Python) | 任意URLのスクリーンショット撮影(Playwright)。`python3 tools/screenshot.py <URL> [--full] [--out FILE]` |
| `tools/youtube/yt.py` | スクリプト(Python) | YouTube情報取得(yt-dlpラッパー・認証不要)。`info`/`transcript`/`search`/`channel`。字幕は `tools/youtube/.cache/` に保存。Claude側は `/youtube` スキル経由で自動起動 |
| `content/games/` | HTML/JS | ブラウザで動くゲーム群。現在: `tourism-train-game.html`（観光列車ゲーム） |
| `content/qiita-drafts/` | Markdown | Qiita投稿用の記事下書き置き場 |
| `content/aws-sap-blackbelt-summary/` | HTML/PDF | AWS SAP攻略のプレゼン資料・要点化レポート（学習資料） |
| `.claude/docs/` | ドキュメント(Markdown) | Claude Code公式ドキュメントの日本語版＋便利機能カタログ `cc-features-9.md`。`/cc-docs` でインデックス確認 |
| `.claude/commands/` | スラッシュコマンド | `/app-glow-up`・`/cc-docs`・`/design`・`/drive-up`・`/friday-new-dept`・`/new-skill` |
| `.claude/skills/` | スキル | `grill-me`（要件を詰める）・`youtube`。導入元は `skills-lock.json` |
| `.claude/agents/` | サブエージェント定義 | `aws-ops-advisor`・`friday-analyst`・`security-reviewer`・`ui-design-reviewer` |
| `.claude/knowledge/aws-summit-2026/` | ナレッジベース | AWS Summit セッション資料150本の全文。**索引を丸読みせず** `python3 search.py "キーワード"` か grep で絞る。横断合成は `INSIGHTS.md` |

## 各アプリの起動方法

### apps/tempus
```bash
cd apps/tempus
npm install
npm run dev          # 開発サーバー
npm test             # ユニットテスト(vitest)
npm run verify:db    # DBスキーマ・RLSの検証
# 本番デプロイ・Edge Function の手順は apps/tempus/README.md と memory project_tempus.md を参照
```

### apps/accounting-app
```bash
cd apps/accounting-app
pip install -r requirements.txt
python app.py
# → http://localhost:5000
```

### apps/valetudo・apps/ドリンク代計算
単一HTMLなのでブラウザで開くだけ（サーバー不要）。
```bash
open apps/valetudo/valetudo.html
open apps/ドリンク代計算/index.html
```

### apps/tokyo-building-blog
```bash
cd apps/tokyo-building-blog/site
npm install && npm run dev   # http://localhost:4321
# ⚠️ 本番反映はこのローカルではなく nino0708/blog 側で行う
```

### tools/auto-blog ・ tools/record-blog
```bash
cd tools/<どちらか>
pip install -r requirements.txt
# .env に ANTHROPIC_API_KEY 等を設定してから実行
python auto_blog.py     # または python record_blog.py
```

### tools/friday-assistant
```bash
cd tools/friday-assistant
npm install
# .env に LINE_TOKEN 等を設定してから実行
node scripts/scheduler.js
```

## 関連リソース

- リモートルーティン（Friday商事・Built Japan）管理: https://claude.ai/code/routines
- メモリファイル: `~/.claude/projects/-Users-itsukinino-portfolio/memory/`
- ルーティンの一覧・起動時刻・停止中のものは `CLAUDE.md` の表を参照（2026-08-29に実機と突き合わせ済み）

> ⚠️ ディレクトリを再編した場合、リモートルーティンが旧パスを参照していれば https://claude.ai/code/routines から手動更新が必要。
