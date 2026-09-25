---
title: "AI を活用した新しいデプロイメント手法と CI:CD における迅速な障害検知と 復旧の実現方法"
category: "AWSセッション"
session_id: "DVT350"
pages: 41
topics: ["AI駆動開発", "運用/SRE"]
services: ["AWS CDK", "AWS CloudFormation", "AWS Config", "AWS Lambda", "Amazon S3", "Kiro", "MCP"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/AWSセッション/AI を活用した新しいデプロイメント手法と CI:CD における迅速な障害検知と 復旧の実現方法.pdf"
---
# AI を活用した新しいデプロイメント手法と CI:CD における迅速な障害検知と 復旧の実現方法


## p.1

DVT350
AI を活用した新しいデプロイメント手法と
CI/CD における迅速な障害検知と
復旧の実現方法
岩下高志朗
アマゾンウェブサービスジャパン合同会社
富永崇之
アマゾンウェブサービスジャパン合同会社


## p.2

岩下高志朗(いわしたこうしろう)
アマゾンウェブサービスジャパン合同会社
技術統括本部
エンタープライズ技術本部
エネルギー＆ユーティリティー部
ソリューションアーキテクト
エネルギー業界のお客様を中心にご支援しています。
好きなAWS サービス
自己紹介
Kiro


## p.3

富永崇之(とみながたかゆき)
アマゾンウェブサービスジャパン合同会社
技術統括本部
金融ソリューション本部
金融第3ソリューション部
ソリューションアーキテクト
証券業界のお客様を中心にご支援しています。
好きなAWS サービス
自己紹介
Kiro


## p.4

•
Part1 MCPを活用したCI/CDパイプラインの構築
o CI/CD の現状と課題
o エージェントを使ったAWS へのデプロイ
o パイプラインの構築と本番デプロイのデモ
o トラブルシューティングのデモ
o Part2 継続的コンフィグレーションとフィーチャーフラグ
o 継続的コンフィグレーション
o フィーチャーフラグ
o 運用におけるフィーチャーフラグのデモ
o まとめ
Agenda


## p.5

AWS サービス開発チームのソフトウェアリリース方法
コードツールを使った継続的リリース
ソース
ソース
ソース
ビルド
スキャン
ビルド
テスト
パッケージ
パッケージ
パッケージ
ステージング
デプロイ
デプロイ
ウェーブ1
デプロイ
デプロイ
デプロイ
ウェーブ2
デプロイ
デプロイ
デプロイ
ステージ条件
結合テスト
CloudWatch
アラーム
安定確認時間
1 時間
ステージ条件
結合テスト
CloudWatch
アラーム
安定確認時間
1 時間
ウェーブN
デプロイ
デプロイ
デプロイ
ステージ条件
結合テスト
CloudWatch
アラーム
安定確認時間
1 時間
機能フラグ
フラグ
フラグ
ロールバック
(アラーム発生時）


## p.6

AWS DevOps ツール: フルセットのツール群
モニター
AWS 
X-Ray
AWS 
CodeConnections
AWS 
CodeDeploy
AWS 
CodeBuild 
Amazon
CloudWatch
AWS CodePipeline
AWS 
CodeArtifact
Amazon
DevOps Guru
MODEL
AWS CloudFormation
AWS Cloud Development Kit (AWS CDK)
CDK8s、CDK-Terraform
AWS Serverless
Application Model(AWS SAM)
AWS Config Amazon
Managed
Grafana
Amazon
Managed
Service for
Prometheus
AWS 
AppConfig
リリース
デプロイ
ビルド
とテスト
ソース/
アーティファクト
オーサリング
AWS IDE Toolkits
AWS SDKs
Kiro


## p.7

SDLC が成熟した企業の軌跡
CI/CD パイプラインの成熟度はSDLC の成熟度と同様の軌跡をたどる
ゼロからイチへ
実装のスピード
成長中のスタートアップ
コラボレーション
スケールアップ
技術のスケーリング
SDLC の成熟
度：低
SDLC の成熟
度：高
エンタープライズ
フルカバー


## p.8

CI/CD パイプラインの課題
ベストプラクティス
への追従
セキュリティの
確保
成長に合わせた
スケーリング
トラブルシューティング
とメンテナンス
コスト管理


## p.9

DevOps の専門知識を必要とせず、
やりたいことを言葉で伝えるだけで、
CI/CD パイプラインのセットアップとデプロイの自動化を
実現します。
CI/CD にエージェントを使用する理由


## p.10

AWS MCP を使ったデプロイの
オーケストレーション
初日から安全なデプロイ
素早くリリース、賢くスケール
アイデアから本番環境まで
ベストプラクティスに基づいた素早いセットアップで
最初から正しく始められる
成長に合わせてパイプラインを拡張しながら
効率性を維持
シンプルなモックアップから
エンタープライズアプリケーションまで適用


## p.11

# AWS CDK
## Overview
Domain expertise for CDK construct authoring, deployment workflows, compliance, drift...
## Critical Warnings
- Deadly embrace（クロススタック参照のデッドロック）
- Construct ID changes cause replacement（論理ID変更でリソース置換）
- UPDATE_ROLLBACK_FAILED の対処法
- S3 バケットの削除ポリシー
## Common Workflows
| Task | Quick Command | Details |
|------|--------------|---------|
| Bootstrap | `cdk bootstrap ...` | … |
| Deploy | `cdk synth → cdk diff → cdk deploy` | ... |
| ...
## Troubleshooting
| Error | Cause → Fix |
|-------|-------------|
| DeployFailed | [Details](references/troubleshooting-deployment.md) |
| ...
## Construct Patterns
...
•
Amazon/AWS 内の知見をもとに公開
•
準決定論的アプローチ（構造化/制約）
を採用
•
様々な形でAgent から利用可能
• MCP として利用
• Agent Skills で利用
AWS MCP – Agent Skills
11
構造化されたマークダウンファイルでAI エージェントが
ベストプラクティスに基づいてワークフローを実行
https://github.com/aws/agent-toolkit-for-aws
Overview, Warnings, Workflows で
指示を構造化
手順を明確に定義。再現性が生まれ
デバッグや手順の改善を容易にする。


## p.12

AWS MCP サーバーを使ったデプロイは、
あなたのチームに最初に加わる
DevOps 実現のための強力な味方です。


## p.13

プロダクトオーナーの紹介
Coffee Hub のプロダクトオーナー兼開発者
こうしろうはコーヒーサービスアプリのPoC に取り組んでいます。
彼はスタッフや友人にリリース前のアプリをいち早く披露するため、
AWS MCP サーバーを使用したデプロイを試してみることにしました。


## p.14

プレビューフロー
お気に入りの
IDE を開く
IDE にAWS MCP サーバーを
インストールして設定
IDE のAI チャットに指示
“アプリをデプロイしてく
ださい”
アプリのプレビューを
確認
リンクを共有


## p.15

セットアップとプレビューフロー
デモ


## p.17

AWS コンポーネント
セットアップとプレビューフロー
Web
アプリケーション
AWS Cloud
Amazon 
CloudFront
Amazon API 
Gateway
Amazon S3
AWS
Lambda
Supabase
Supabase
認証・認可
Supabase
ストレージ
PostgreSQL
ユーザー
ブラウザ
認証
&
DB コール
API コール
アセット読み込み
実行
DB コール


## p.18

リリースの準備が完了
Coffee Hub のプロダクトオーナー兼開発者
こうしろうはAWS で本番リリースをすることを決めました。
PoC の開発にはAWS MCP サーバーがとても役に立ちました。
ベストプラクティスを活用しながらCI/CD のインフラを構成し、
アプリを本番環境へ移行したいと考えています。


## p.19

リリースまでの流れ
お気に入りの
IDE を開く
IDE のAI チャットに指示
AI からの確認事項に回答する
（例: GitHub への接続方法）
パイプラインの作成・
デプロイ完了まで待つ
（2～5分ほど）
“アプリをデプロイするための
パイプラインを作成してください”


## p.20

デプロイパイプラインの構築
デモ


## p.22

AWS コンポーネント
デプロイとトラブルシューティングフロー
Web
アプリケーション
AWS Cloud
Amazon 
CloudFront
Amazon API 
Gateway
Amazon S3
AWS Lambda
Supabase
Supabase
認証・認可
Supabase
ストレージ
PostgreSQL
ユーザー
ブラウザ
認証
&
DB コール
API コール
アセット読み込み
実行
CI/CD
DB コール
AWS
CloudFormation
AWS
CodeBuild
ソースコードをプル
GitHub Webhook イベント
デプロイアクション
インフラとアプリの
デプロイ
リポジトリ
AWS
CodePipeline


## p.23

トラブルに遭遇
Coffee Hub のプロダクトオーナー兼開発者
顧客からの機能リクエストが届き始めました。
こうしろうはコードをプッシュした後に
パイプラインの問題に遭遇しました。
AWS MCP サーバーを使ったデプロイ機能を活用して、
トラブルシューティングを行います。


## p.24

トラブルシューティングフロー
お気に入りの
IDE からコミッ
トをプッシュ
パイプラインの
失敗アラートを受信
IDE のAI チャットに助けを求める
AI の提案内容を
確認・承認する
変更をコミットして
プッシュ
新機能が実装
“変更が失敗しました。
何が起こったのですか？”


## p.25

トラブルシューティングフロー
デモ


## p.27

AWS MCP を使用してデプロイするメリット
CI/CD を数分でセットアップ
AI の力によるエラーのトラブルシューティング
ベストプラクティスを活用し、成長に合わせて規模を拡大


## p.28

AWS MCP によるデプロイの将来像
フルスタック
アプリケーション
をデプロイ
パイプラインの
更新と
スケーリング
コスト最適化
自己修復
パイプライン
AI テンプレート
パイプライン


## p.29

かつては数週間かかっていた作業が、
今では数分で完了します。
いくつかのプロンプトを入力するだけで、
AWS で成功するための準備が整います。


## p.30

継続的コンフィグレーションと
フィーチャーフラグ


## p.31

CI/CD の後はどうなるのでしょうか？


## p.32

継続的コンフィグレーションの位置付け
継続的インテグレーション(Continuous Integration)、継続的デプロイ(Continuous Deploy) に
続く第3の"C” それが、継続的コンフィグレーション(Continuous Configuration) 
モニター
AWS 
X-Ray
AWS 
CodeConnections
AWS 
CodeDeploy
AWS CodeBuild 
Amazon
CloudWatch
AWS CodePipeline
AWS 
CodeArtifact
Amazon
DevOps Guru
MODEL
AWS CloudFormation
AWS Cloud Development Kit (AWS CDK)
CDK8s、CDK-Terraform
AWS Serverless
Application Model(AWS SAM)
AWS Config
Amazon
Managed
Grafana
Amazon
Managed
Service for
Prometheus
AWS 
AppConfig
リリース
デプロイ
ビルド
とテスト
ソース/
アーティファクト
オーサリング
AWS IDE Toolkits
AWS SDKs
Kiro


## p.33

ソフトウェアの実行時に設定を参照することで、以下が可能になります
継続的コンフィグレーション
設定でソフトウェアの挙動を動的に変える
機能のオン/オフの切り替え
オペレーションのチューニング
(スロットリング、ログ、負荷のシフトなど)
変更の影響範囲を制限する
…これらを新しいコードのデプロイやアプリの再起動なしに実現できる


## p.34

AWS AppConfig
フィーチャー
フラグ
01
02
03
高速ロールバック
ロールバックが必要になった場合は、
特定の機能だけを無効化できます
- 全部をロールバックする必要はありません
複雑なブランチ管理は不要
機能をブランチではなくフラグで管理し、
ユーザには非公開のまま継続的にデプロイします
- トランクベースの開発への移行を実現します
デプロイとローンチの分離
本番環境において機能を有効化するだけで、
機能をローンチすることが出来ます
- コードの更新は不要です


## p.35

平均回復時間(MTTR) を短縮できる
本番環境で検証でき、
変更の影響範囲も抑えられる
ソフトウェアのリリース頻度が上げられる
A/B テストで得られた実データをもとに
意思決定できる
AWS AppConfig
フィーチャー
フラグの効果


## p.36

「継続的コンフィグレーションを使用して変
化にリアルタイムで反応する力をつけておけ
ば、機会が訪れたときにすぐに対応できるよ
うになります。
そしていつの日か、事が起きる前に反応がで
きるようになるかもしれません。」
Werner Vogels 
アマゾン副社長兼最高技術責任者


## p.37

本番環境において新機能をリリース、問題を検出して自動でロールバック
1. フィーチャーフラグを利用した機能制御
2. フィーチャーフラグのデプロイ
3. アラーム監視による自動ロールバック
デモ: リリースにおけるオートロールバック


## p.39

1. CI/CDは爆速で進化しています
2. MCPを活用することによって開発は更に早くなります
3. 継続的コンフィグレーションにフィーチャーフラグが活用できます
本セッションのまとめ


## p.40

Ask the Speaker
こちらのRoom 後方の外側にございます、
「Ask the Speaker」カウンターまでお越しください
岩下高志朗
アマゾンウェブサービスジャパン合同会社
富永崇之
Room


## p.41

本セッションのアンケートへ
ご協力をお願いします
Please give us your feedback
Thank you!
DVT350
