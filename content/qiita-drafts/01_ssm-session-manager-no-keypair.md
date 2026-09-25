# SSM Session Managerでキーペア・踏み台・22番ポートが全部いらなくなった話

<!-- tags: AWS, SSM, EC2, セキュリティ, インフラ -->
<!-- status: 下書き -->

## はじめに

EC2に接続するといえば「キーペア作って、踏み台EC2を立てて、セキュリティグループで22番を開ける」という構成が定番だと思っていた。
SSM Session Managerを知ってからそのイメージが全部崩れた。

---

## SSHとSSM Session Managerの比較

| 項目 | SSH接続 | SSM Session Manager |
|---|---|---|
| キーペア | 必要 | **不要** |
| セキュリティグループ（22番ポート） | 開放必要 | **不要** |
| パブリックIP | 必要な場合あり | **不要** |
| 踏み台サーバー | 必要な場合あり | **不要** |
| 接続ログ | 別途設定 | CloudTrailに自動記録 |

22番ポートを開けなくていいのでセキュリティグループがすっきりする。踏み台EC2も不要なのでコストも下がる。

---

## 必要なもの

### EC2インスタンス側
- SSMエージェントがインストール・起動していること
  - Amazon Linux 2 / Amazon Linux 2023 はデフォルトでインストール済み
- IAMロールに `AmazonSSMManagedInstanceCore` ポリシーをアタッチ

### 接続する側
- AWS CLIとSession Managerプラグインのインストール
- `ssm:StartSession` 権限を持つIAMユーザー/ロール

### ネットワーク
- SSMエンドポイントへのアウトバウンド443番が通ること
- プライベートサブネットの場合はVPCエンドポイントが必要（以下3つ）
  - `com.amazonaws.region.ssm`
  - `com.amazonaws.region.ssmmessages`
  - `com.amazonaws.region.ec2messages`

---

## 接続コマンド

```bash
aws ssm start-session --target i-xxxxxxxxxxxxxxxxx
```

---

## プライベートサブネットでも使えるのがポイント

インターネットゲートウェイなしのプライベートサブネットでも、VPCエンドポイントさえ作れば接続できる。
本番環境でパブリックIPを持たせたくないEC2への接続手段として重宝する。

---

## まとめ

- キーペア管理・踏み台運用・ポート開放の3つをまとめて廃止できる
- CloudTrailに接続ログが残るので監査にも強い
- Amazon Linux系なら追加インストール不要ですぐ使える

---

<!-- TODO: VPCエンドポイント構成の図を追加する -->
<!-- TODO: CloudFormationでの設定例を追加する -->
