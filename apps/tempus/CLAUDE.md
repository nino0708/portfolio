# Tempus

時間割型タスク管理 PWA（本番稼働中）。本番: https://divine-breeze-3e59.itsuki9978miya.workers.dev

- 仕様の正は `docs/SPEC.md`、型の正は `src/types/domain.ts`。セットアップ・デプロイ手順は `README.md`
- 構成: 画面は Cloudflare Workers／DB と Edge Functions は Supabase（ref `nucqcatwhwdjsphetops`）／LINE 公式アカウントからも起票可
- 開発: `npm run dev`・`npm test`・`npm run verify:db`（PGlite で migration と RLS を検証）・`npm run build`
- Edge Functions（`supabase/functions/`）: `plan-review`（毎朝7時の見立て）・`calendar-sync`・`line-webhook`・`agent-ingest`（ルーティンからのタスク登録口）・`usage-guard`・共通は `_shared/`
- migration は `supabase/migrations/` の連番。`*.prod.sql` は本番専用（cron 等）

## 方針・注意

- **Tempus は無料のタスク管理。AI（Claude API 等の従量課金）は呼ばない**。AI 連携を提案・追加しない。plan-review は `ANTHROPIC_API_KEY` を設定せず計算だけで見立てを作る（Claude 経路のコードは残っているが使わない）
- 貼るだけの文案は `clips`。`kind` が `x_post`（投稿文）なら「Xで投稿」ボタン（X の intent URL を本文入りで開く。`src/lib/xPost.ts`）、`note`（参考メモ）はコピーのみ。agent-ingest は kind 省略時に送信元で決める（秘書 → note。`_shared/clipKind.ts`）。`clips[].taskDedupeKey` を task の `dedupeKey` と一致させないとタスクに紐付かない
- Tempus はプッシュ通知しない。開いた時に見えるだけ
- `supabase` CLI は Mac のターミナル.app から叩く（非TTYだとキーチェーン待ちで無言でハングする）。`wrangler` は非TTYでも通る
- デプロイ: 画面は `npm run deploy`（build → wrangler で Worker `divine-breeze-3e59` へ。`wrangler.jsonc`）。Edge Function は `npx supabase functions deploy <name>`、migration は `npx supabase db push`、secrets は `npx supabase secrets list/set`
- 使い終わった設計メモは `docs/archive/`
