# TODO: 思考ログ（Drive連携）を有効にする

このアプリ自身（Supabase・Google Cloud）にアクセスできないクラウド環境で実装したため、
残りは全部PCでの手作業。設計・詳しい手順は
`2026-09-23-drive-task-docs-design.md` の「有効にする手順」を参照。

- [ ] 変更をPCの Tempus に取り込む（`git fetch && git checkout claude/dreamy-feynman-4sl73g`、
      GitHubに無いファイルがある場合は新規・変更ファイルを手元にコピー）
- [ ] `npm test` / `npm run build` が通ることを確認
- [ ] Google Cloud コンソールで Google Drive API / Google Docs API を有効化
- [ ] OAuth 同意画面のスコープに `https://www.googleapis.com/auth/drive.file` を追加
- [ ] `src/lib/supabase.ts` の `signIn` のスコープに同じ `drive.file` を追加
      （`access_type: 'offline'`, `prompt: 'consent'` も確認）
- [ ] `supabase db push`（0018_drive_task_docs.sql を適用）
- [ ] `supabase functions deploy drive-sync`
- [ ] アプリでログアウト→再ログインし、Driveの許可（チェックボックス）を出す
- [ ] Google ドライブに `Tempus/` フォルダとプロジェクト別フォルダ（Built Japan / Friday商事 / Tempus / AWS育成 / その他タスク）・ドキュメントができているか確認
- [ ] タスク詳細の「思考ログを開く」ボタンが機能するか確認
- [ ] タスク詳細の「進め方の記録」に書いて Enter → ドキュメント末尾に `[日時] 私: …` が入るか確認
- [ ] AI からの記録: 関数の環境変数に `TEMPUS_OWNER_EMAIL=redacted@example.com` と `DRIVE_SYNC_KEY` を設定
      （`supabase secrets set ...`）→ Claude の環境に `DRIVE_SYNC_KEY` と、許可ドメイン
      `nucqcatwhwdjsphetops.supabase.co` を追加 → 設計書の curl で `[日時] AI: …` が入るか確認
- [ ] （任意）cron で `drive-sync` を定期実行（calendar-sync と同じ要領、ヘッダーは `x-drive-sync-key`）

詰まったら `google_credentials.drive_last_error` を確認。
