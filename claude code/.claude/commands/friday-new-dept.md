# Friday商事 新部署エージェント作成

Friday商事のサブエージェントを定型フォーマットで作成するスキルです。

## 使い方
```
/friday-new-dept
```
引数なしで起動すると対話形式で必要情報を収集します。
引数あり例: `/friday-new-dept 品質管理部 毎週水曜10時 仕入れた商品の品質・コンディションチェックを行う`

## 実行手順

### Step 1: 情報収集
$ARGUMENTS が空の場合はユーザーに以下を質問する（AskUserQuestion を使う）:
1. **部署名**（日本語）: 例「品質管理部」
2. **英語スラッグ**（ルーティン名に使用）: 例「quality-control」→ 自動で `friday-quality-control` になる
3. **起動スケジュール**（JST）: 例「毎週水曜 10:00」「毎日 9:00」
4. **この部署の主な役割・タスク**: 何を分析・チェック・管理するか
5. **Driveから読み込む他部署ファイル**: どの部署と連携するか（例: 市場分析・予算管理 等）
6. **Driveに書き出すファイル名**: 例「Friday商事_品質管理_最新.md」

$ARGUMENTS がある場合は「部署名 / スケジュール / タスク説明」として解釈して補完する。

### Step 2: cron式に変換
JST時刻をUTCに変換する（JST = UTC+9）:
- 例: 水曜10:00 JST → 火曜01:00 UTC → `0 1 * * 3`
- 例: 毎日7:00 JST → 毎日22:00 UTC（前日）→ `0 22 * * *`
- 例: 月曜9:00 JST → 月曜0:00 UTC → `0 0 * * 1`

変換後、UTCとJSTの時刻を確認としてユーザーに提示する。

### Step 3: UUIDを生成
python3 -c "import uuid; print(str(uuid.uuid4()))" でUUIDを生成する。

### Step 4: プロンプトを生成
以下の定型テンプレートに情報を埋め込む:

```
あなたはせどり会社「Friday商事」の【{部署名}】エージェントです。{スケジュール説明}に起動します。

## 会社情報
- 資本金：100,000円（初期）
- 事業：せどり（Amazon.co.jp / メルカリ / Yahoo!オークション）
- 社長：二瀬樹（itsuki9978miya@gmail.com）
- 連携部署：{連携部署名}（Driveで共有）

## 社長の価値観（常に守ること）
- 手順遵守：決めた手順を省略しない
- ダブルチェック：判断前に必ず数字・根拠を確認
- 記録管理：作業結果は必ずDriveに保存
- 再発防止：問題があれば原因まで追う
- PDCA：検知→切り分け→実行→振り返りのサイクルを回す

## レポートスタイル
- カジュアルな日本語（敬語不要）
- 短く端的に、結論を先に
- 絵文字は使わない
- 表・箇条書きで整理、必ず金額・数量を入れる
- リスクは「⚠️ 要確認」で明示

## 役割
{部署の役割説明}

## タスク手順

### Step 1: Driveから連携データを読み込む
以下を検索・読み込む：
- 「Friday商事_予算管理.md」→ 残予算・今週割当予算を確認
{連携部署のファイル読み込み指示}

### Step 2: Gmail で関連情報を収集
{Gmail検索クエリ}（直近24〜48時間 or 7日間）

### Step 3: {部署名}の分析・レポートを作成し「{Driveファイル名}」としてDriveに保存

---
# {部署名}レポート
更新日時: [今日の日付 JST]

{レポート構成（ユーザーの説明をもとに生成）}

---

### Step 4: Gmailで社長にレポート送信
- To: itsuki9978miya@gmail.com
- Subject: 【Friday商事/{部署名}】{レポート種別} [今日の日付]
- Body: Driveに書き込んだ内容と同じ
```

### Step 5: ユーザーに最終確認
生成したルーティン設定を表で見せる:
- 部署名
- スケジュール（JST / UTC）
- cron式
- 連携ファイル
- Driveへの書き出しファイル名

「この内容で作成しますか？」と確認を取る。

### Step 6: RemoteTriggerで作成
確認OKなら ToolSearch で RemoteTrigger を読み込み、以下で作成する:

```json
{
  "name": "friday-{英語スラッグ}",
  "cron_expression": "{cron式}",
  "enabled": true,
  "job_config": {
    "ccr": {
      "environment_id": "env_014n4w7TyX7oiMj3mHduZCcY",
      "session_context": {
        "model": "claude-sonnet-4-6",
        "sources": [{"git_repository": {"url": "https://github.com/nino0708/portfolio"}}],
        "allowed_tools": [
          "Bash", "Read",
          "mcp__claude_ai_Gmail__search_threads",
          "mcp__claude_ai_Gmail__get_thread",
          "mcp__claude_ai_Gmail__create_draft",
          "mcp__claude_ai_Google_Drive__search_files",
          "mcp__claude_ai_Google_Drive__read_file_content",
          "mcp__claude_ai_Google_Drive__create_file"
        ]
      },
      "events": [{
        "data": {
          "uuid": "{生成したUUID}",
          "session_id": "",
          "type": "user",
          "parent_tool_use_id": null,
          "message": {
            "role": "user",
            "content": "{生成したプロンプト}"
          }
        }
      }]
    }
  },
  "mcp_connections": [
    {
      "connector_uuid": "3d85bd29-085f-4a54-bb09-e36e859de3a6",
      "name": "Gmail",
      "url": "https://gmailmcp.googleapis.com/mcp/v1"
    },
    {
      "connector_uuid": "220032ee-9bbd-4e2c-9199-0f9e45a1ccda",
      "name": "Google-Drive",
      "url": "https://drivemcp.googleapis.com/mcp/v1"
    }
  ]
}
```

### Step 7: 作成完了を報告
- ルーティンID
- 管理URL: https://claude.ai/code/routines/{ID}
- 次回実行日時（JST）
- を表示して完了を伝える。

## 定型ルール（常に守ること）
- 資本金10万円を念頭に置いたプロンプトを生成する
- 必ず「Friday商事_予算管理.md」を読み込むステップを入れる
- 必ずDriveに分析結果を書き出すステップを入れる
- 必ずGmailでitsuki9978miya@gmail.comに送信するステップを入れる
- Gmail + Google Drive の両コネクターを必ずアタッチする
- モデルは常に claude-sonnet-4-6
- environment_id は常に env_014n4w7TyX7oiMj3mHduZCcY
