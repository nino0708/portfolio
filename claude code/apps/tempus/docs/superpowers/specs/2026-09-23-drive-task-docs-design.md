# タスクごとの思考ログ（Googleドキュメント）

## 背景・課題

タスクを解決するまでに何を考えたかが、どこにも残らない。タスクは完了や削除で一覧から消えるので、
考えた過程を後から振り返れない。

タスクごとに Googleドキュメントを Drive に自動で作って紐付け、考えたことと、
**AI（Claude）と私がどう進めたか**をそこに書き残せるようにする。
ドキュメントはタスクとは別に Drive に置くので、タスクが消えても残り続ける。

## Drive 上の構成

```
マイドライブ/
└─ Tempus/
   ├─ <プロジェクト名>/          例: Built Japan, Friday商事, Tempus, AWS育成
   │   └─ <起票日>_<タイトル>    例: 2026-09-23_LPの構成を決める
   └─ その他タスク/             プロジェクト未設定のタスク
```

- プロジェクトを作るとフォルダを作る。名前を変えるとフォルダ名も付け直す
- タスクを別のプロジェクトに移すと、ドキュメントも移す
- タイトルを直すと、ドキュメント名も付け直す
- 完了すると、ドキュメントの末尾に「■ YYYY-MM-DD に完了（実績 N分）」を追記する
- **タスクを消してもドキュメントは消さない**（消す処理自体を持たない）
- 人が Drive からドキュメントを消した場合は作り直さない（本人の意思として扱う）

ドキュメントの本文は「背景・目的／考えたこと（日付ごとに追記）／検討した選択肢と判断／結果・振り返り／進め方の記録（AIと私）」の見出しだけを用意する。
「進め方の記録（AIと私）」は必ず最後の見出しにする。書き足しはドキュメントの末尾に入るので、記録と完了の一文はここに時系列で並ぶ。
後から単体で読んでも何のタスクか分かるように、プロジェクト・起票日・期間・起票時点のメモを冒頭に書き込む。

## 仕組み

| 部品 | 役割 |
|---|---|
| `supabase/migrations/0020_drive_task_docs.sql` | フォルダ・ドキュメントの ID と URL を覚える列を追加 |
| `supabase/functions/drive-sync` | Drive のフォルダ・ドキュメントを作る・揃える |
| `supabase/functions/_shared/driveDoc.ts` | ドキュメント名と本文を組み立てる純関数（テストあり） |
| `src/lib/drive.ts` | アプリから drive-sync を呼ぶ |
| `TaskDetail` | 「思考ログを開く」ボタンと、私の分の記録を書き足す入力欄 |

- 認証は calendar-sync と同じ。`google_credentials` に保存済みの更新用トークンを使う
- 権限は `drive.file`（このアプリが作ったファイルにしか触れない）。既存の Drive のファイルは読めないし触れない
- アプリは一覧が変わるたびに（3秒待ってから）drive-sync を呼ぶ
- 1回の呼び出しで作るのは 25 件まで。既存タスクの取り込みは、アプリが残りが無くなるまで数回呼ぶ。取りこぼしは cron で拾う
- 2本同時に走っても同じタスクに二重に紐付かないよう、`drive_doc_id is null` を条件に書き込み、負けた方は作った物をゴミ箱に入れる

## 進め方の記録（AIと私）

drive-sync に `{ "action": "log" }` を付けて呼ぶと、同期の代わりに1件書き足す。

```
[2026-09-25 18:30] AI: 構成案を3つ出した
[2026-09-25 18:42] 私: B案に決めた
    理由: 既存記事と揃うから
■ 2026-09-26 に完了（実績 45分）
```

| 項目 | 内容 |
|---|---|
| `task_id` | タスクのID。無ければ `task_title` で探す |
| `task_title` | 完全一致 → 部分一致の順で、新しいタスクを1件選ぶ（完了済みも対象） |
| `author` | 書き手。省略すると `AI`。アプリの入力欄からは `私` |
| `text` | 本文。複数行可（2行目以降は字下げ）。5000字まで |

- ドキュメントがまだ無ければ、その場で作ってから書き足す
- 人が Drive から消したドキュメントには書き足さない（410 を返す。作り直さない）

### Claude（セッション・ルーティン）から書き足す

cron と同じ `x-drive-sync-key` で呼ぶ。持ち主は `TEMPUS_OWNER_EMAIL` のユーザーになる。

```bash
curl -sS -X POST "https://nucqcatwhwdjsphetops.supabase.co/functions/v1/drive-sync" \
  -H "Content-Type: application/json" \
  -H "x-drive-sync-key: $DRIVE_SYNC_KEY" \
  -d '{"action":"log","task_title":"LPの構成を決める","author":"AI","text":"構成案を3つ出した"}'
```

Claude のクラウド環境から呼ぶには、環境の設定で
- 環境変数に `DRIVE_SYNC_KEY`（関数に設定したのと同じ値）を入れる
- Network access の許可ドメインに `nucqcatwhwdjsphetops.supabase.co` を足す

ルーティンのプロンプトには「作業の区切りごとに、上の curl で Tempus の該当タスクに何をしたかを1〜3行で書き足す」と書いておく。

## 有効にする手順

1. **Google Cloud コンソール**（Tempus の OAuth クライアントがあるプロジェクト）で
   **Google Drive API** と **Google Docs API** を有効にする
2. 同じ場所の OAuth 同意画面のスコープに `https://www.googleapis.com/auth/drive.file` を追加する
3. アプリのログイン処理（`src/lib/supabase.ts` の `signIn`）で要求しているスコープに
   `https://www.googleapis.com/auth/drive.file` を足す
   （calendar のスコープの後ろに半角スペース区切りで追加。更新用トークンを取り直すため `prompt: 'consent'` も必要）
4. マイグレーションを当てる: `supabase db push`
5. 関数をデプロイする: `supabase functions deploy drive-sync`
   （環境変数は calendar-sync と共通。cron 用の鍵は `DRIVE_SYNC_KEY`、無ければ `CALENDAR_SYNC_KEY` を使う）
6. アプリで一度ログインし直し、Drive の許可を出す → 開いた時点で既存タスクのドキュメントが作られ始める
7. （任意）calendar-sync と同じ要領で cron を登録する。ヘッダーは `x-drive-sync-key`。1時間おき程度で十分
8. AI から記録を書き足すなら、`TEMPUS_OWNER_EMAIL` を関数の環境変数に入れ、Claude の環境に上の設定をする

## スコープ外

- ドキュメントの本文をアプリの中で表示・編集すること（Drive で開いて書く）
- 共有プロジェクトで他の人のドキュメントを見ること（ドキュメントは各自の Drive に作る）
