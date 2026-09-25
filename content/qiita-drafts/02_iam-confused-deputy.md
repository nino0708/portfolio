# IAMの「混乱した代理問題」と外部IDによる対策

<!-- tags: AWS, IAM, セキュリティ, クロスアカウント -->
<!-- status: 下書き -->

## 混乱した代理（Confused Deputy）とは

権限を持つサービス（代理人）が、悪意ある第三者に騙されて意図しない操作を実行してしまうセキュリティ脆弱性。

---

## 典型的な攻撃シナリオ

```
攻撃者(Account C) → SaaSサービス(Account B) → あなたのリソース(Account A)
                              ↑
                   Account Bは正規の権限を持つが
                   攻撃者のリクエストを代理実行してしまう
```

1. Account A が Account B（SaaS）に `AssumeRole` を許可する
2. 攻撃者（Account C）が Account B のサービスを使って Account A へのアクセスを要求
3. Account B は Account A へのアクセス権を持っているため、攻撃者の代わりに実行してしまう

---

## 対策①：`aws:SourceArn` / `aws:SourceAccount` 条件キー

ロールの信頼ポリシーに条件を追加して、正当な呼び出し元のみを許可する。

```json
{
  "Effect": "Allow",
  "Principal": {
    "Service": "lambda.amazonaws.com"
  },
  "Action": "sts:AssumeRole",
  "Condition": {
    "ArnLike": {
      "aws:SourceArn": "arn:aws:lambda:ap-northeast-1:123456789012:function:MyFunction"
    },
    "StringEquals": {
      "aws:SourceAccount": "123456789012"
    }
  }
}
```

---

## SourceArnでも防げないケース

Account C が Account B の**正規のリソース**（たとえばB側のLambda）を利用してアクセスしてくる場合、SourceArnはAccount Bのものなので条件を通過してしまう。

```
攻撃者(C) → Account BのLambda（正規）→ Account A
                    ↑
         SourceArnはBのものなので通過してしまう ❌
```

これを防ぐのが**外部ID**。

---

## 対策②：外部ID（External ID）

### 仕組み

Account Aがロールを作成する際、**自分だけが知っているシークレットな文字列（外部ID）** を信頼ポリシーに設定する。

```json
{
  "Effect": "Allow",
  "Principal": {
    "AWS": "arn:aws:iam::ACCOUNT_B_ID:root"
  },
  "Action": "sts:AssumeRole",
  "Condition": {
    "StringEquals": {
      "sts:ExternalId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
    }
  }
}
```

### セットアップの流れ

1. **Account B がお客様ごとにユニークな外部IDを発行** し、Account A に通知
2. **Account A が IAMロールを作成**し、信頼ポリシーに外部IDを設定
3. Account A がロールARNを Account B に伝える
4. **Account B が外部IDを添えて AssumeRole** → 成功

### 攻撃者には外部IDがわからないので防御できる

```
攻撃者(C) → Account BのサービスにロールARNだけ登録
Account B → ExternalIdなしでAssumeRole → 失敗 ✅
```

### 外部IDの要件
- 予測不可能であること（UUIDなど）
- Account A と Account B の間で秘密裏に共有すること
- Account B はお客様ごとに異なる外部IDを使うこと

---

## 外部IDにも限界はある

外部IDは「AssumeRoleの瞬間」を守るもの。発行済みの一時クレデンシャルを Account C に渡された場合は防げない。これは AWS 側では解決できず、**Account B のアプリケーション設計・運用**で対処する問題。

---

## まとめ

| 対策 | 防げるケース | 防げないケース |
|---|---|---|
| SourceArn / SourceAccount | 別アカウントからの直接AssumeRole | Bの正規リソース経由の攻撃 |
| 外部ID | Bの正規リソースを使った攻撃 | 発行済みクレデンシャルの横流し |

両方組み合わせるのが基本。

---

<!-- TODO: 図（攻撃フローと防御フローの比較）を追加 -->
