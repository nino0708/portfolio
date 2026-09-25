# LambdaのCloudWatch Logsにログが出ない原因の切り分け方

<!-- tags: AWS, Lambda, CloudWatch, トラブルシューティング -->
<!-- status: 下書き -->

## 症状

Lambda + API Gateway + DynamoDB のサーバーレス構成で、本番デプロイ後に CloudWatch Logs にログが一切表示されない。

---

## 結論から言うと

**「ロググループが作成されていない = Lambda 関数がそもそも実行されていない」**

Lambda 関数は**初回実行時に自動でロググループとログストリームを作成する**。ロググループ自体が存在しないということは、一度も実行されていないことを意味する。

---

## よくある誤解と正しい理解

| 疑ったこと | 実際 |
|---|---|
| IAMロールに CloudWatch への権限がない | ❌ 権限不足の場合でも「アクセス拒否エラー」のログは出る。ロググループ自体は作成される |
| CloudWatch Logs のライブラリが未設定 | ❌ Lambda 標準ランタイムはライブラリ不要で自動ログ出力する |
| CloudWatch Logs エージェントが未設定 | ❌ エージェントは EC2 向け。Lambda には不要 |
| ロググループとログストリームが作成されていない | ✅ これが正解。関数が実行されていない |

---

## 切り分け手順

### Step 1：ロググループの存在を確認

```bash
aws logs describe-log-groups \
  --log-group-name-prefix "/aws/lambda/関数名"
```

存在しない → **関数が一度も実行されていない**

### Step 2：テスト実行してみる

マネコンの「テスト」タブから手動実行してみる。
- エラーが出る → エラーメッセージを確認
- 成功するのにログが出ない → リージョンを確認（別リージョンに出ている可能性）

### Step 3：API Gateway の設定を確認

本番環境特有の問題として多いのが以下：
- **ステージのデプロイが完了していない**（変更後に「デプロイ」ボタンを押し忘れ）
- **Lambda の ARN またはエイリアスが間違っている**
- **本番ステージが別リージョンの Lambda を指している**

### Step 4：リージョンを確認

```bash
aws lambda get-function --function-name 関数名
```

デプロイしたつもりの関数が実際にどのリージョンにあるか確認する。

---

## IAMロールの権限設定（正しい設定の確認）

ログが出始めた後も、IAMロールには以下のポリシーが必要：

```json
{
  "Effect": "Allow",
  "Action": [
    "logs:CreateLogGroup",
    "logs:CreateLogStream",
    "logs:PutLogEvents"
  ],
  "Resource": "arn:aws:logs:*:*:*"
}
```

または `AWSLambdaBasicExecutionRole` マネージドポリシーをアタッチする。

---

## まとめ

- ロググループがない = 関数が実行されていない → まずデプロイ設定を疑う
- テスト環境では動いたのに本番で動かない → API Gateway のデプロイ忘れが定番のミス
- IAM 権限不足の場合はエラーログが出るのでロググループは存在する

---

<!-- TODO: API Gateway のデプロイ手順を追加 -->
