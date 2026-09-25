---
title: "AWS Infrastructure as Code - 2025 年主要アップデートの振り返り"
category: "AWSセッション"
session_id: "DVT225"
pages: 82
topics: ["セキュリティ", "生成AI/エージェント"]
services: ["AWS CDK", "AWS CloudFormation", "AWS Lambda", "AWS Transit Gateway", "Amazon API Gateway", "Amazon Bedrock", "Amazon DynamoDB", "Amazon EC2", "Amazon Kinesis", "Amazon RDS", "Amazon S3", "MCP"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/AWSセッション/AWS Infrastructure as Code - 2025 年主要アップデートの振り返り.pdf"
---
# AWS Infrastructure as Code - 2025 年主要アップデートの振り返り


## p.1

DVT225
AWS Infrastructure as Code : 
2025 年主要アップデートの振り返り
菊地晏南
アマゾンウェブサービスジャパン合同会社


## p.2

菊地晏南 / Anan Kikuchi
Solutions Architect
活動 
 
 
AWS CDK Conference 2025 での登壇や
 
 
 
AWS CDK を学べるワークショップのメン
 
 
 
テナンスなど IaC に関する活動に従事
趣味 
 
 
バスケットボール、バレーボール、
 
 
 
旅⾏、Web 開発
好きなAWS サービス
AWS Cloud Development Kit
(AWS CDK)
AWS CloudFormation
Amazon Bedrock
@anan_kikuchi


## p.3

このセッションを聴きにきた理由は︖
Ø 組織がクラウドの使⽤を迅速かつ安全に拡⼤する⽅法を学びたい
Ø セキュリティとコンプライアンスの保護対策を講じたい
Ø IaC を利⽤中で開発スピードを最⼤化したい


## p.4

アジェンダ
01. IaC とは︖
02. アプリケーションを迅速に開発
03. コラボレーション環境で
      アプリケーションを安全に進化させる
04. IaC ワークフローの簡素化とガバナンス
05. インフラ管理の進化


## p.5

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
IaC とは︖


## p.6

テンプレート
ツール
インフラストラクチャ
CreateBucket()
Infrastructure as Code (IaC) の基本
Resources:
  LogBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: log-bucket
      Tags:
        - Key: Note
          Value: App Logs
log-bucket
Note = AppLogs
PutBucketTagging()


## p.7

環境の複製
信頼性と安全性のある更新
設定のバージョン管理
AWS CloudFormation: 2011 年に提供開始
開発
テスト
本番（⽶国）
本番（EU）
IaC
v1
v2
v3


## p.8

AWS IaC ポートフォリオ
何百ものAWS および
サードパーティリソース
AWS CloudFormation resource registry
AWS Service Catalog、AWS Amplify
Amazon EC2
AWS Transit Gateway
Amazon S3
Amazon Kinesis
Amazon Kendra
AWS CDK、AWS SAM
AWS CloudFormation
AWS CloudFormation 
Hook
AWS Cloud 
Control API


## p.9

AWS Cloud Development Kit (CDK)
プログラミング⾔語
クラスとメソッドのみ
⾃動補完
インラインの
ドキュメンテーション
安全なデフォルト値
再利⽤可能なクラス


## p.10

CloudFormation
リソース
L1
⾃動⽣成
専⽤コンストラクト
L3+
構成パターンの抽象化
AWS コンストラクト
L2
⾼レベルの
サービスコンストラクト
カスタマイズ可能
型安全性と
安全なデフォルト値
CDK コンストラクトレベル


## p.11

AI ⽀援開発
プラットフォーム主導の
ガバナンス
あらゆるチーム向けのクラウドインターフェース
「CloudFormation がサポートしていないAWS の機能は、
 私たちのクラウドインフラでは利⽤できません」
— エンタープライズCIO 
IaC
ゴールデン・パス
プロアクティブな
統制
開発者主導のデプロイ
アプリ1
開発チーム1


## p.12

より安全な管理
より簡単な構築とテスト
より簡単な統制
IaC は新しいワークフローに対応するために
進化する必要がある


## p.13

インフラ管理の
進化
IaC ワークフローの簡素化とガバナンス
本⽇ご紹介するアップデート
AWS CloudFormation 
IDE エクスペリエンス
早期エラー検証
ドリフト対応
変更セット
CDK リファクタリング
CDK ミックスイン
CloudFormation フック
コントロールカタログ
スタックセットの
依存関係
AWS IaC
MCP Server
アプリケーションを迅速に開発
コラボレーション環境で
アプリケーションを安全に進化させる


## p.14

インフラ管理の
進化
IaC ワークフローの簡素化とガバナンス
本⽇ご紹介するアップデート
AWS CloudFormation 
IDE エクスペリエンス
早期エラー検証
ドリフト対応
変更セット
CDK リファクタリング
CDK ミックスイン
CloudFormation フック
コントロールカタログ
スタックセットの
依存関係
AWS IaC
MCP Server
アプリケーションを迅速に開発
コラボレーション環境で
アプリケーションを安全に進化させる


## p.15

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
ワークフロー
CDK CLI
AWS 
CloudFormation
スタック
コンストラクト
ソースコード
テンプレート
アセット
クラウドアセンブリ
クラウドリソース
実⾏
合成
デプロイ
プロビジョニング
🔎cdk diff: 変更内容の確認
🚀cdk deploy: 変更のクラウドへの反映
cdk synth: テンプレートとアセットの作成
📙cdk init: 新しいプロジェクトの作成


## p.16

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
IaC コードの開発


## p.17

問題: AWS CloudFormation テンプレート開発の簡略化


## p.18

問題: AWS CloudFormation テンプレート開発の簡略化


## p.19

問題: AWS CloudFormation テンプレート開発の簡略化


## p.20

解決策: AWS CloudFormation IDE エクスペリエンス
AWS でアプリケーションを作成、デバッグ、デプロイするための
オープンソースプラグイン
AWS Toolkit
Visual Studio
Visual Studio Code
IntelliJ Idea


## p.21

⾃動補完とホバー
解決策: AWS CloudFormation IDE エクスペリエンス


## p.22

解決策: AWS CloudFormation IDE エクスペリエンス
シンタックス検証


## p.23

解決策: AWS CloudFormation IDE エクスペリエンス
セキュリティベストプラクティスチェック


## p.24

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
IaC のデプロイ


## p.25

問題: 開発/テストサイクルの短縮
IaC
デプロイ開始
プロビジョニング
エラー発⽣
デプロイメント
ロールバック
変更セット
作成
プロビジョニングエラーによりIaC の開発ループが⻑くなる
デプロイ
プレビュー
変更セット
実⾏
IaC コードを修正


## p.26

解決策: 早期エラー検証
変更セット作成中のプロビジョニングエラーを検出
IaC
変更セットを作成
プロビジョニングエラー
検出
IaC コードを修正


## p.27

例: 変更セットの中⾝


## p.28

例: 変更セットの中⾝


## p.29

インフラ管理の
進化
IaC ワークフローの簡素化とガバナンス
本⽇ご紹介するアップデート
AWS CloudFormation 
IDE エクスペリエンス
早期エラー検証
ドリフト対応
変更セット
CDK リファクタリング
CDK ミックスイン
CloudFormation フック
コントロールカタログ
スタックセットの
依存関係
AWS IaC
MCP Server
アプリケーションを迅速に開発
コラボレーション環境で
アプリケーションを安全に進化させる


## p.30

コードレビュー
バージョン管理
CI/CD パイプライン
IaC はDevOps のベストプラクティスをもたらす
IaC がもたらす安全性のメリットを享受するには
IaC コードと実際のリソースの状態が常に⼀致している必要がある


## p.31

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
IaC ドリフトの管理


## p.32

問題:ドリフトしたリソースの調整
IaC
開発者1
リソース
デプロイ


## p.33

問題:ドリフトしたリソースの調整
IaC
リソース
開発者 2
AWS マネジメント
コンソール
開発者1
更新


## p.34

問題:ドリフトしたリソースの調整
IaC
リソース
ドリフト
開発者 2
AWS マネジメント
コンソール
開発者1


## p.35

問題:ドリフトしたリソースの調整
デプロイへの予期しない影響
アプリケーションの複製が不可
コンプライアンスポリシーの違反
IaC
リソース
「チームはドリフトをたくさん積み重ねてきたので、
IaC パイプラインをあきらめてしまった」
- クラウドプラットフォームリード
ドリフト
開発者 2
AWS マネジメント
コンソール
開発者1


## p.36

解決策:ドリフト対応変更セット
IaC の更新
開発者1
デプロイメント
プレビュー
実際の状態の
取得
リソース
(ドリフト発⽣中)
ドリフト対応変更セット
作成
ステップ#1
IaC を実際のインフラストラクチャの状態と⽐較する


## p.37

解決策:ドリフト対応変更セット
予期しないドリフトの巻き戻しの
修正
ステップ#2
デプロイがドリフトしたリソースに与える影響を確認する
IaC の更新
開発者1
デプロイメント
プレビュー
実際の状態の
取得
リソース
(ドリフト発⽣中)
ドリフト対応変更セット
作成


## p.38

解決策:ドリフト対応変更セット
ステップ#3
ドリフトしたリソースをIaC 定義に合わせる
IaC の更新
開発者1
デプロイメント
プレビュー
リソース
(ドリフト発⽣中)
ドリフト対応変更セット
作成
変更セット
実⾏


## p.39

解決策:ドリフト対応変更セット
IaC の更新
開発者1
デプロイメント
プレビュー
リソース
（調整済み）
ドリフト対応変更セット
作成
変更セット
実⾏
同期済み
結果
ドリフトの安全な調整


## p.40

例: 誤動作しているアプリケーション
初期状態
S3 バケット
（有効期限1 ⽇）
Lambda 関数
（タイムアウト 10 秒）
アラーム
Resources:
  Bucket:
    Type: AWS::S3::Bucket
    Properties:
 
LifecycleConfiguration:
 
  ExpirationInDays: 1 
  BucketAlarm: 
    Type: AWS::CloudWatch::Alarm
    Properties:
      MetricName: NumberOfObjects
  Function:
    Type: AWS::Lambda::Function
    Properties:
 
Timeout: 10
IaC テンプレート


## p.41

AWS マネジメントコンソールのアクション
例: コンソールでのトラブルシューティング
⼿動変更後の状態
1. バケットの有効期限を100 ⽇間に延⻑
2. アラームを削除
3. 関数のタイムアウトを増やす
10 秒から20秒まで✅
S3 バケット
（有効期限100 ⽇）
Lambda 関数
（タイムアウト20 秒）
アラーム


## p.42

例: IaC を希望の状態に更新
Resources:
  Bucket:
    Type: AWS::S3::Bucket
    Properties:
 
LifecycleConfiguration:
 
  ExpirationInDays: 1 
  BucketAlarm: 
    Type: AWS::CloudWatch::Alarm
    Properties:
      MetricName: NumberOfObjects
  Function:
    Type: AWS::Lambda::Function
    Properties:
 
Timeout: 10 20


## p.43

例:ドリフト対応変更セットの作成


## p.44

例: S3 バケットのプロパティレベルの差分


## p.45

例: S3 バケットのプロパティレベルの差分


## p.46

例: 変更セットを実⾏する
S3 バケット
（有効期限1 ⽇）
Lambda 関数
（タイムアウト20秒）
アラーム
正常な状態
IaC コードと同期


## p.47

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
IaC のリファクタリング


## p.48

問題:アプリケーションリファクタリング
Amazon API Gateway
Amazon DynamoDB
ユーザー
Amazon DynamoDB
製品
API スタック
CDK App
Amazon DynamoDB
注⽂
AWS Lambda


## p.49

問題:アプリケーションリファクタリング
Amazon API Gateway
AWS Lambda
製品
Amazon DynamoDB
ユーザー
Amazon DynamoDB
製品
API スタック
CDK App
Amazon DynamoDB
注⽂
AWS Lambda
ユーザー
AWS Lambda
注⽂
ユーザースタック
製品スタック
注⽂スタック


## p.50

解決策: CDK リファクタリング
• コンストラクトの名前変更
• スタック間でのリソース移動（置換なし）
• CDK App を再編成
$ cdk refactor --unstable=refactor


## p.51

解決策: CDK リファクタリング
aws://123456789012/us-east-1
例︓リソースのスタック間移動


## p.52

解決策: CDK リファクタリング
実⾏中のリファクタリング


## p.53

インフラ管理の
進化
IaC ワークフローの簡素化とガバナンス
本⽇ご紹介するアップデート
AWS CloudFormation 
IDE エクスペリエンス
早期エラー検証
ドリフト対応
変更セット
CDK リファクタリング
CDK ミックスイン
CloudFormation フック
コントロールカタログ
スタックセットの
依存関係
AWS IaC
MCP Server
アプリケーションを迅速に開発
コラボレーション環境で
アプリケーションを安全に進化させる


## p.54

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
コンストラクトの開発


## p.55

問題: L2 サポートに時間がかかる
Amazon DynamoDB
Amazon RDS
Amazon EC2
AWS Lambda
L2 コンストラクト
カスタム
コンストラクト
L3 パターン
セキュアREST API
CloudWatch から 
Kinesis へ
⾃社
Amazon DynamoDB Amazon Relational 
Database Service 
(Amazon RDS)
Amazon Elastic 
Compute Cloud 
(Amazon EC2)
AWS Lambda
AWS


## p.56

CDK L2
サポートを
待つ
コンストラクト
開発者
カスタムコンス
トラクトのサ
ポートを待つ
新機能による
アプリケーションの
安全な展開
新機能が組み込
まれたカスタム
コンストラクト
のメンテナンス
問題: L2 サポートに時間がかかる


## p.57

L2 S3 バケット
L1 バケット
L1 KMS キー
暗号化
L2 コンストラクト


## p.58

繰り返しの実装
L2 DynamoDB テーブル
L1 テーブル
L1 KMS キー
暗号化
L2 S3 バケット
L1 バケット
L1 KMS キー
暗号化
L2 ECR リポジトリ
L1 リポジトリ
L1 KMS キー
暗号化
L2 EBS ボリューム
L1 ボリューム
L1 KMS キー
暗号化
L2 RDS データベース
クラスター
L1 データベース
クラスター
L1 KMS キー
暗号化
L2 EFS ファイルシステム
L1 ファイルシステム
L1 KMS キー
暗号化


## p.59

暗号化
暗号化
暗号化
暗号化
暗号化
暗号化
繰り返しの実装


## p.60

暗号化
繰り返しの実装


## p.61

暗号化
あらゆるレベルの
コンストラクトに対応する
組み合わせ⾃由で
再利⽤可能な抽象化
⾃動削除
ロギング
解決策: CDK ミックスイン


## p.62

例: CDK ミックスイン
※ 2026年6⽉現在 EncryptionAtRest は未実装


## p.63

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
プロアクティブな統制の強制


## p.64

問題: コンプライアンスフィードバックの遅延
IaC の設定ミス
開発者
リソース
デプロイ
Resources:
  Bucket:
    Type: AWS::S3::Bucket
    Properties:  
      PublicAccessBlockConfiguration:
        BlockPublicACLs: false


## p.65

問題: コンプライアンスフィードバックの遅延
リソース
デプロイ
発⾒的
スキャン
セキュリティ
チーム
リスク検出
フィードバック
発⾒的スキャンツールが問題を事後的に発⾒
IaC の設定ミス
開発者


## p.66

解決策: CloudFormation フック
リソース
スタック
Cloud Control API
変更セット
フック呼び出しポイント
デプロイ
フック
検証
デプロイの
ブロック
フィードバック
IaC の設定ミス
開発者


## p.67

解決策: コントロールカタログの使⽤


## p.68

解決策: コントロールカタログの使⽤


## p.69

解決策: コントロールカタログの使⽤


## p.70

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
アカウントのベースライン化


## p.71

スタックセットを使⽤するベースラインアカウント
IaC
デプロイ
スタックセット
スタック
管理者
アカウント
アカウントA
スタック
アカウントB
スタック
アカウントA
スタック
アカウントB
リージョン1
リージョン2


## p.72

問題: デプロイメントの順序
ネットワークス
タックセット
管理者
アカウント
リージョン1
ID
スタックセット
アプリケーション
スタックセット
ネットワーク
スタック
新規
アカウント
ID 
スタック
アプリケーション
スタック


## p.73

ネットワークス
タックセット
ID
スタックセット
アプリケーション
スタックセット
リージョン1
ネットワーク
スタック
新規
アカウント
ID 
スタック
アプリケーション
スタック
解決策: スタックセットの依存関係
管理者
アカウント
依存
依存
依存
依存


## p.74

インフラ管理の
進化
IaC ワークフローの簡素化とガバナンス
本⽇ご紹介するアップデート
AWS CloudFormation 
IDE エクスペリエンス
早期エラー検証
ドリフト対応
変更セット
CDK リファクタリング
CDK ミックスイン
CloudFormation フック
コントロールカタログ
スタックセットの
依存関係
AWS IaC
MCP Server
アプリケーションを迅速に開発
コラボレーション環境で
アプリケーションを安全に進化させる


## p.75

皆さんの組織では、
スピードと正確さはうまく両⽴できていますか︖
AI はスピードを約束するが、インフラには
正確さが必要


## p.76

AI と IaC は互いに補完し合う
スピード
運⽤上の安全性
ベストプラクティスに基づくガードレール
使いやすさ
監査可能性
信頼性
すぐに始められる
AI
IaC


## p.77

問題: ⻑いフィードバックループ
リソースの
設定ミス
デプロイ
発⾒的
スキャン
セキュリティ
チーム
リスク検出
フィードバック
IaC の設定ミス
開発者
エージェント
プロンプト


## p.78

解決策: AWS IaC MCP Server
Well-Architected な
検証済みのIaC
開発者
プロンプト
ナレッジツール
トラブルシューティング
ツール
検証ツール
エージェント
AWS MCP Server の
使⽤を開始する


## p.79

インフラ管理の
進化
IaC ワークフローの簡素化とガバナンス
まとめ
AWS CloudFormation 
IDE エクスペリエンス
早期エラー検証
ドリフト対応
変更セット
CDK リファクタリング
CDK ミックスイン
CloudFormation フック
コントロールカタログ
スタックセットの
依存関係
AWS IaC
MCP Server
アプリケーションを迅速に開発
コラボレーション環境で
アプリケーションを安全に進化させる


## p.80

Next Step
すでに AWS CDK をお使いの⽅々
新機能を試してみましょう︕
What’s New / AWS ブログ / サンプルコード / ワークショップ など
これから AWS CDK を使い始める⽅々
まずは概要を押さえてから、サンプルアプリを作ってみましょう︕
スライド
AWS CDK ⼊⾨ガイド
これだけは知っておきたいヒント集
ワークショップ
TypeScript の基礎から始める
AWS CDK 開発⼊⾨
ワークショップ
AWS CDK Immersion Day
ワークショップ


## p.81

Ask the Speaker
こちらのRoom 後⽅の外側にございます、
「Ask the Speaker」カウンターまでお越しください
菊地晏南
アマゾンウェブサービスジャパン合同会社
Room


## p.82

本セッションのアンケートへ
ご協⼒をお願いします
Please give us your feedback
Thank you!
DVT225
