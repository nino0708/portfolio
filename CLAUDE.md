# portfolio

二瀬樹のポートフォリオ兼、個人ツール置き場。Mac のローカル clone は `~/portfolio`。

## どこに何があるか（詳細は必要なときだけ `docs/PROJECT_MAP.md`）

- `apps/tempus/` — タスク管理 PWA（本番稼働中）。触る前に `apps/tempus/CLAUDE.md`
- `apps/accounting-app/` — 団体会計アプリ（Flask）。触る前に `apps/accounting-app/CLAUDE.md`
- `apps/` のその他・`tools/`・`content/` — 小物アプリとスクリプト
- `infra/contact-form/` — AWS 問い合わせフォームの Terraform（リソースは削除済み）。`HTMLfiles/` は GitHub Pages 公開用なので動かさない
- `docs/` — `routines.md`（Friday商事・Built Japan のルーティン一覧）・`friday-persona.md`・`archive/`
- ブログ（Built Japan）は別リポジトリ `nino0708/blog`

## 作業ルール

- ユーザーは日本語・短く端的な説明を好む。絵文字は使わない。ターミナル操作はそのまま貼れるコマンドで渡す
- Mac のシェルは zsh。`"..."` の中に `!` を入れない（履歴展開で失敗する）
- 新しいファイルは必ず git 管理下に入れて push する（過去に Tempus の大半が Mac にだけ残り、別セッションから見えなかった）
- コミットしない: `.env*`・`*.tfvars`・`*.tfstate*`・`settings.local.json`・`.mcp.json`・生成物（`tsbuildinfo` 等）
- `package-lock.json`・`deno.lock` は読まない（`.claude/settings.json` で拒否済み）。依存を知りたい時は `package.json` を見る
- 大きなファイルは全体を読まず、Grep で場所を絞ってから該当範囲だけ読む
- コメントは「なぜ」が非自明な時だけ。不要な抽象化はしない。SQL/XSS/コマンドインジェクションに注意
- **作業の区切りでは、このファイルか各アプリの CLAUDE.md に「次のセッションが知っておくべきこと」を1〜2行で追記してコミットする**。長くなったら `docs/` に移し、ここは60行以内に保つ

## 最近の経緯

- 2026-09-25: Mac にだけあった Tempus 一式を main に取り込み（PR #15）、Claude 用の説明書を整備
- 2026-09-25: Tempus の plan-review に一度 API キーを設定したが外した（Tempus は AI を呼ばない方針）
- 2026-09-25: app-glow-up-weekly の残 PR #12〜#14 をマージし、関連コマンド・定期作業を削除
- 2026-09-25: トークン節約のため構成を再編（`claude code/` を廃止して平らに、AWS Summit 資料と Claude Code 公式ドキュメントの写しを削除、Terraform を `infra/` へ、会計アプリの app.py/app.js を分割）
