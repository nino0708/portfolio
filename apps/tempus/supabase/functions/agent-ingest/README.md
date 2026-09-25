# agent-ingest

外部のAIエージェント（Friday商事・Built Japanなどのクラウドルーティン）から、Tempusにタスク・レポート・貼るだけテキスト（Xの投稿文案など）を直接POSTで流し込むEdge Function。

- Google Driveに置きっぱなしのレポートを見に行く手間をなくし、Tempusのホームに集約する
- `x-tempus-agent-key`ヘッダの共有シークレットだけで認証する（LINEのような署名検証は無いので、このキーの管理が唯一の防壁）
- `owner_id`は常に`TEMPUS_OWNER_EMAIL`から解決する。個人アプリなので受け口は1人分のみ
- 冪等性: 各要素の`dedupeKey`（省略時は内容から自動生成）で二重登録を防ぐ。同じ`dedupeKey`を2回送っても2件目は`skipped`になるだけで安全にリトライできる
- サイズ上限: リクエストボディ1MB超で413、`tasks`/`reports`/`clips`はそれぞれ最大100件で超えたら400（無料枠を守るため）
- 受け取った内容は必ず`agent_ingest_log`に記録される（`counts`にinserted/skippedの内訳、`raw_bytes`にボディサイズ）

## 二瀬さんが手を動かす作業（必須）

### 1. 共有シークレットを決める

`TEMPUS_AGENT_KEY`用の十分に長いランダム文字列を決める（例: `openssl rand -hex 32`で生成）。これを知っている者だけがタスクを起票できるので、Driveやチャット等の平文には残さない。

### 2. Secretsを設定する

```bash
# プロジェクトと未リンクなら先にリンク（1回だけ）
supabase link --project-ref <プロジェクトref>

supabase secrets set TEMPUS_AGENT_KEY=<openssl rand -hex 32等で生成した値>
supabase secrets set TEMPUS_OWNER_EMAIL=<Tempusにログインしている自分のGoogleアカウントのメールアドレス>
# SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY はSupabaseが自動的にEdge Functionへ注入するため、
# 通常は手動設定不要（ダッシュボードのProject Settings > API Keysに同じ値がある）
```

`TEMPUS_OWNER_EMAIL`は、Tempusに一度でもGoogleログインした後の`auth.users.email`と一致している必要がある（未ログイン状態のメールでは500エラーになる）。

### 3. マイグレーションを適用してデプロイする

```bash
# 0008_agent_ingest.sql（reports/clips/agent_ingest_log/agent_task_dedupe）と
# 0016_clip_task_link.sql（clips.task_id）を反映
supabase db push

supabase functions deploy agent-ingest
```

デプロイ後のURLは以下の形になる。

```
https://<プロジェクトref>.supabase.co/functions/v1/agent-ingest
```

### 4. 動作確認（curlで直接叩く）

```bash
curl -sS -X POST "https://<プロジェクトref>.supabase.co/functions/v1/agent-ingest" \
  -H "Content-Type: application/json" \
  -H "x-tempus-agent-key: <TEMPUS_AGENT_KEYの値>" \
  -d '{
    "agent": "動作確認",
    "tasks": [{"title": "疎通確認タスク"}]
  }'
```

`{"ok":true,"inserted":{"tasks":1,"reports":0,"clips":0},"skipped":{"tasks":0,"reports":0,"clips":0},"warnings":[]}` が返ればOK。Tempus側で受信箱にタスクが1件増えているか確認する。もう一度同じリクエストを送ると（`dedupeKey`省略時はtitle+dueAtから自動生成されるため）`skipped.tasks`が1になり、二重に増えないことも確認できる。

## クラウドルーティンのプロンプトに貼り付けるひな形

各ルーティンの末尾（レポート生成後・Drive保存後など）に以下を追記する。**ルーティンのNetwork accessをCustomにして`*.supabase.co`を許可すること**（デフォルトのNetwork accessだと外部POSTがブロックされる）。

````
## Tempusへの連携（必須）

このルーティンの成果物を、以下のcurlコマンドでTempusに送信すること。

- URL: https://<プロジェクトref>.supabase.co/functions/v1/agent-ingest
- ヘッダ `x-tempus-agent-key` に共有シークレットを設定する（値は環境変数 or 事前共有されたものを使う。プロンプトや出力に生の値を書かない）
- ボディはJSON。以下のいずれか、または複数を含めてよい（全て省略可）:
  - `agent`: このルーティンの部署名・役割名（必須。例 "仕入れリサーチ部"）
  - `tasks`: 起票したいタスクの配列。各要素 `{"title": "...", "notes": "...", "dueAt": "2026-09-01T09:00:00+09:00", "estimateMin": 45, "importance": "high"}`（titleのみ必須）
  - `reports`: 生成したレポートの配列。各要素 `{"source": "部署名", "title": "...", "bodyMd": "...", "url": "Driveリンク等", "reportedFor": "2026-08-26"}`（source, titleが必須）
  - `clips`: コピペ用テキスト（X投稿文案など）の配列。各要素 `{"label": "...", "text": "...", "url": "...", "taskDedupeKey": "同じリクエストで送ったタスクのdedupeKey"}`（label, textが必須）
    - `taskDedupeKey`を付けると、そのタスクの詳細を開いた時に本文が出る。付けない場合はどのタスクにも紐付かない単独のクリップになる
- 同じ内容を再送しても安全（自動で重複除去される）ので、失敗したら遠慮なくリトライしてよい

例:
```bash
curl -sS -X POST "https://<プロジェクトref>.supabase.co/functions/v1/agent-ingest" \
  -H "Content-Type: application/json" \
  -H "x-tempus-agent-key: $TEMPUS_AGENT_KEY" \
  -d '{
    "agent": "仕入れリサーチ部",
    "reports": [{
      "source": "仕入れリサーチ部",
      "title": "2026-08-26 仕入れ候補レポート",
      "bodyMd": "...(本文)...",
      "url": "https://drive.google.com/...",
      "reportedFor": "2026-08-26"
    }]
  }'
```
````

## 環境変数一覧

| 変数名 | 用途 | 入手先 |
|---|---|---|
| `TEMPUS_AGENT_KEY` | リクエスト認証用の共有シークレット | 自分で生成する（`openssl rand -hex 32`等） |
| `TEMPUS_OWNER_EMAIL` | 起票先のTempusユーザーを特定するメールアドレス | Tempusにログインしている自分のGoogleアカウント |
| `SUPABASE_URL` | Supabaseクライアント接続先 | 通常はSupabaseが自動注入 |
| `SUPABASE_SERVICE_ROLE_KEY` | RLSをバイパスしてtasks/reports/clips等を操作 | 通常はSupabaseが自動注入（Project Settings > API Keys） |

4つのうちどれか1つでも未設定だとEdge Functionは起動時に例外を投げて即失敗する（ログにどの変数が足りないか出る）。

## 動作の細部

- `POST`以外のメソッドは405
- `x-tempus-agent-key`が無い・不一致は401（タイミングセーフに比較。1文字でも違えば拒否される）
- リクエストボディが1MBを超えると413（`Content-Length`ヘッダでの事前チェックと、実際に読んだバイト数の両方でチェック）
- `agent`（送信元名）が無い/空文字、または`tasks`/`reports`/`clips`が配列でない、あるいは101件以上ある場合は400
- `TEMPUS_OWNER_EMAIL`に一致する`auth.users`が見つからない場合は500（Googleログインを一度も済ませていない等）
- 各要素の必須項目が欠けている場合（例: taskのtitle無し）はエラーにせず`skipped`に計上して処理を続ける
- 同じ`dedupeKey`（省略時は内容から自動生成）を持つ要素は2回目以降`skipped`に計上され、二重登録されない
  - `tasks`は`src/types/domain.ts`のTask型に`dedupeKey`が無いため、`tasks`テーブル自体には触れず、側テーブル`agent_task_dedupe`（`dedupe_key -> task_id`の対応のみを持つ）で冪等性を担保している（`line_webhook_events`と同じ考え方）
  - `reports`/`clips`はテーブル自体に`dedupe_key`列とUNIQUE制約を持つ
- `tasks`は`project_id=null`（受信箱）、`source='routine'`でINSERTする。`estimateMin`を明示した場合のみ`estimate_min`と`estimate_is_inferred=false`を設定し、省略時はDBのDEFAULT（30分・推定扱い）に任せる
- DBへのINSERT自体が失敗した場合（DB接続断など、呼び出し側の入力ミスではないもの）はその時点で例外にし、500として返す。ここまでに処理済みの件数は`agent_ingest_log`に記録してから返す
- `clips`の`taskDedupeKey`は`agent_task_dedupe`を引いて`task_id`に解決する。`tasks`は`clips`より先に処理されるので、同じリクエストで「タスク＋その投稿文」を一度に送れる
  - 一致するタスクが無い場合はclipを捨てず`task_id=null`で登録し、`warnings`に理由を入れて返す（静かに握りつぶすと投稿文がどこにも出ないまま成功扱いになる）
  - 既に同じ`dedupeKey`で入っているclipに後から紐付けを足す再送も効く（`task_id`がまだnullの行に限って埋める。既存の紐付けは上書きしない）
- 成功レスポンスは常に`{"ok":true,"inserted":{"tasks":n,"reports":n,"clips":n},"skipped":{...},"warnings":[...]}`の形。失敗時は`{"ok":false,"error":"..."}`とHTTPエラーコード
