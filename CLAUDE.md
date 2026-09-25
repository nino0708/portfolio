# portfolio — Claude 向けの地図

新しいセッションはまずここを読む。リポジトリ全体を探索し直す前に、下の地図で目的の場所に直行すること。

## 構成

| 場所 | 中身 |
|---|---|
| ルート（`*.tf`, `lambda_src/`, `templates/`, `HTMLfiles/`） | 問い合わせフォーム（AWS: CloudFront + S3 / API Gateway + Lambda + DynamoDB + SES、Terraform） |
| `claude code/apps/tempus/` | **Tempus**: 時間割型タスク管理 PWA（React + Vite + TS / Supabase / Cloudflare） |
| `claude code/apps/accounting-app/` | 団体会計アプリ（Python/Flask + SQLite） |
| `claude code/docs/superpowers/specs/` | 設計スペック |

Mac 側のローカル clone は `~/portfolio`。`claude code/` 配下の作業では、`claude code/CLAUDE.md`（詳細な作業ルール）と `claude code/PROJECT_MAP.md`（全アプリの地図）も読む。エージェント・コマンド・資料は `claude code/.claude/`（`agents/`、`commands/`、`docs/`、`knowledge/`）にある。

## Tempus の要点

- 仕様は `docs/SPEC.md`、型は `src/types/domain.ts` が唯一の正。セットアップ手順は `README.md`
- 本番 URL: https://divine-breeze-3e59.itsuki9978miya.workers.dev
- 開発: `npm install` → `npm run dev` / `npm test` / `npm run verify:db`（PGlite で migration と RLS を検証）/ `npm run build`
- Edge Functions（`supabase/functions/`）: `plan-review`（毎朝7時の「今日の見立て」）、`calendar-sync`、`line-webhook`、`agent-ingest`、`usage-guard`、共通は `_shared/`
- `plan-review`: 既定モデル `claude-opus-5-5`（`PLAN_REVIEW_MODEL` で上書き）、adaptive thinking・effort `low`。`ANTHROPIC_API_KEY` が無いか `PLAN_REVIEW_MODE=free` だと Claude を呼ばず `_shared/insight.ts` の計算だけで見立てを作る（画面に「計算による見立て（無料）」と出る）
- デプロイは Mac から `supabase functions deploy <name>`。secrets は `supabase secrets list/set`
- migration は `supabase/migrations/` の連番。`*.prod.sql` は本番専用（cron 等）

## 作業ルール

- ユーザーは日本語・短く端的な説明を好む。ターミナル操作は、そのまま貼れるコマンドで渡す
- Mac のシェルは zsh。コマンド中の `"..."` 内に `!` を入れない（履歴展開で失敗する）
- 新しいファイルは必ず git 管理下に入れて push する。過去に Tempus の大半が未追跡のまま Mac にだけ残り、別セッションから見えなかった
- `.env` / `.env.local` / `terraform.tfvars` / `*.tfstate` / `settings.local.json` はコミットしない
- **作業の区切りでは、このファイルに「次のセッションが知っておくべきこと」を追記してコミットする**（読み直しの手間を減らすため）

## 最近の経緯

- 2026-09-25: Mac にだけあった Tempus 一式（plan-review、検証ログ、migration 0001〜0019 など）を PR #15 で main に取り込んだ
- 2026-09-25: Mac にだけあった `claude code/CLAUDE.md`・`PROJECT_MAP.md`・`.claude/` を main に push（`settings.local.json` と `.mcp.json` は除外）
