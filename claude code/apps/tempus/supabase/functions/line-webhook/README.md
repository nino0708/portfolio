# line-webhook

LINEに一言送るとTempusにタスクが起票されるEdge Function。

- テキストメッセージだけを扱う。本文をtitleにして`tasks`にINSERTする（`project_id=NULL`＝受信箱、`source='line'`）
- `profiles.line_user_id`で送信者のLINEユーザーIDとTempusユーザーを突合する。未連携なら起票せず、連携用のLINEユーザーIDを案内する
- 返信は必ず **reply API**（`/v2/bot/message/reply`）。push APIは使わない（push APIは月200通の無料枠を消費するが、replyはカウント対象外なので無料で無制限に使える）
- `X-Line-Signature`をチャネルシークレットで検証し、失敗したリクエストは401で拒否する
- LINEの再送（webhookEventIdが同じ）は`line_webhook_events`テーブル（`supabase/migrations/0005_line_events.sql`）で弾き、二重起票しない

## 二瀬さんが手を動かす作業（必須）

### 1. LINE Developersでチャネルを作る

1. https://developers.line.biz/console/ にログイン
2. プロバイダーを作成（未作成の場合）→ チャネルを新規作成 → **Messaging API**
3. チャネル基本設定タブで以下を控える
   - **チャネルシークレット**（Basic settings内）→ 環境変数 `LINE_CHANNEL_SECRET`
4. Messaging API設定タブで**チャネルアクセストークン（長期）**を発行 → 環境変数 `LINE_CHANNEL_ACCESS_TOKEN`

### 2. 応答メッセージをOFFにする

Messaging API設定タブ、またはLINE Official Account Managerの「応答設定」で以下を変更する。

- **応答メッセージ: OFF**（このEdge Functionのreplyとぶつかるため）
- **あいさつメッセージ: 任意でOFF**
- **Webhookの利用: ON**

### 3. Webhook URLを設定する

Edge Functionをデプロイした後（下記コマンド参照）、発行されるURLをMessaging API設定タブの「Webhook URL」に設定し、**検証（Verify）ボタン**で200が返ることを確認する。

```
https://<プロジェクトref>.supabase.co/functions/v1/line-webhook
```

### 4. 自分のLINEユーザーIDをprofilesに登録する

このEdge Functionは`profiles.line_user_id`で突合するだけで、LINEユーザーID自体の払い出しはしない。連携できていない状態で送ると「連携がまだです。アプリの設定画面でこのコードを登録してください: <userId>」と返信が来るので、その`userId`をTempusの`profiles.line_user_id`に保存する（v1時点でアプリ側の設定画面が無ければ、Supabaseのテーブルエディタから直接入れる）。

### 5. Botを友だち追加する

作成したチャネルのQRコード（Messaging API設定タブ）から自分のLINEで友だち追加する。追加していないとメッセージを送れない。

## デプロイ手順

```bash
# プロジェクトと未リンクなら先にリンク（1回だけ）
supabase link --project-ref <プロジェクトref>

# 環境変数（secrets）を設定
supabase secrets set LINE_CHANNEL_SECRET=xxxxx
supabase secrets set LINE_CHANNEL_ACCESS_TOKEN=xxxxx
# SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY はSupabaseが自動的にEdge Functionへ注入するため、
# 通常は手動設定不要（ダッシュボードのProject Settings > API Keysに同じ値がある）

# マイグレーション適用（tasksテーブルを作る他の担当分のマイグレーションより後に実行すること）
supabase db push

# デプロイ
supabase functions deploy line-webhook
```

デプロイ後、LINE Developersの「検証」ボタンで200が返ることを確認し、実際にBotへ一言送ってタスクが起票されるか確認する。

## 環境変数一覧

| 変数名 | 用途 | 入手先 |
|---|---|---|
| `LINE_CHANNEL_SECRET` | Webhook署名検証 | LINE Developers > チャネル基本設定 |
| `LINE_CHANNEL_ACCESS_TOKEN` | reply API呼び出し | LINE Developers > Messaging API設定（長期トークン発行） |
| `SUPABASE_URL` | Supabaseクライアント接続先 | 通常はSupabaseが自動注入 |
| `SUPABASE_SERVICE_ROLE_KEY` | RLSをバイパスしてtasks/profilesを操作 | 通常はSupabaseが自動注入（Project Settings > API Keys） |

4つのうちどれか1つでも未設定だとEdge Functionは起動時に例外を投げて即失敗する（ログにどの変数が足りないか出る）。

## 動作の細部

- `events`が空配列のリクエスト（LINEの疎通確認）は署名検証だけ行い200を返す
- 本文が200文字を超える場合、先頭200文字を`title`、全文を`notes`に入れる（起票自体は止めない）
- 空文字・空白のみの本文は「何も書かれていません」と返信してタスクは作らない
- 未連携ユーザーからのメッセージはタスクを作らず、連携方法を案内する返信のみ行う
- 処理中のエラー（DB接続・LINE API失敗など）はログに残した上でLINEには200を返す（再送ループを避けるため）。署名検証の失敗だけは例外で401を返す
