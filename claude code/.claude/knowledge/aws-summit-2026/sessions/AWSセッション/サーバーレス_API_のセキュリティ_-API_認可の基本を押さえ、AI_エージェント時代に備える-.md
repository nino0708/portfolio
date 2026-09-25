---
title: "サーバーレス API のセキュリティ －API 認可の基本を押さえ、AI エージェント時代に備える－"
category: "AWSセッション"
session_id: "CNS315"
pages: 112
topics: ["アーキテクチャ/サーバーレス", "セキュリティ", "生成AI/エージェント"]
services: ["AWS Lambda", "AWS Systems Manager", "AWS WAF", "AgentCore", "Amazon Aurora", "Amazon Bedrock", "Amazon ElastiCache", "Amazon GuardDuty", "Amazon Inspector", "Amazon Neptune", "MCP"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/AWSセッション/サーバーレス API のセキュリティ －API 認可の基本を押さえ、AI エージェント時代に備える－.pdf"
---
# サーバーレス API のセキュリティ －API 認可の基本を押さえ、AI エージェント時代に備える－


## p.1

CNS315
サーバーレスAPI のセキュリティ
－API 認可の基本を押さえ、AI エージェント時代に備える－
渡辺紘久
アマゾンウェブサービスジャパン合同会社


## p.2

対象者
• サーバーレスAPI のセキュリティや認可を整理したい
• API の認可とAI エージェントの認可がどうつながるか
理解したい
ゴール
• サーバーレスAPI のセキュリティ対策の全体像をつかむ
• API 認可の仕組みを理解する
• AI エージェントの認可とのつながりを知る
対象とゴール


## p.3

• 題材：フィットネスアプリ
• API セキュリティの基礎
• アイデンティティ(ID) を意識したAPI 認可
• AI エージェントの認可－はじめの一歩
• まとめ
アジェンダ


## p.4

• 題材：フィットネスアプリ
• API セキュリティの基礎
• アイデンティティ(ID) を意識したAPI 認可
• AI エージェントの認可－はじめの一歩
• まとめ
アジェンダ


## p.5

題材：フィットネスアプリ


## p.6

フィットネスアプリの基本アーキテクチャ
Activities API
API Gateway
Lambda
DynamoDB


## p.7

• 題材：フィットネスアプリ
• API セキュリティの基礎
• アイデンティティ(ID) を意識したAPI 認可
• AI エージェントの認可－はじめの一歩
• まとめ
アジェンダ


## p.8

API セキュリティの基礎


## p.9

API セキュリティの基礎説明の流れ
• IAM を土台にしたセキュアなAPI 構築
• 開発スピードを止めない自動化と守りの多層防御


## p.10

API セキュリティの基礎説明の流れ
• IAM を土台にしたセキュアなAPI 構築
• 開発スピードを止めない自動化と守りの多層防御


## p.11

IAM によるサービスへのアクセス制御
• AWS Identity and Access Management (IAM) の
アクセス権限で、以下へのアクセスを認可:
• コントロールプレーン－リソースの管理
（例）:
• CreateFunction (Lambda)
• UpdateTable (DynamoDB)
• データプレーン－リソースの操作・実行
（例）:
• Invoke (Lambda)
• PutItem (DynamoDB)


## p.12

IAM によるサービスへのアクセス制御
Activities API
• AWS Identity and Access Management (IAM) の
アクセス権限で、以下へのアクセスを認可:
• コントロールプレーン－リソースの管理
（例）:
• CreateFunction (Lambda)
• UpdateTable (DynamoDB)
• データプレーン－リソースの操作・実行
（例）:
• Invoke (Lambda)
• PutItem (DynamoDB)
サービスコント
ロールポリシー
(SCP)
API Gateway
Lambda
DynamoDB


## p.13

IAM によるサービスへのアクセス制御
Activities API
• AWS Identity and Access Management (IAM) の
アクセス権限で、以下へのアクセスを認可:
• コントロールプレーン－リソースの管理
（例）:
• CreateFunction (Lambda)
• UpdateTable (DynamoDB)
• データプレーン－リソースの操作・実行
（例）:
• Invoke (Lambda)
• PutItem (DynamoDB)
リソースポリシー
サービスコント
ロールポリシー
(SCP)
Lambda
DynamoDB
API Gateway


## p.14

IAM によるサービスへのアクセス制御
IAM アイデンティティ
ベースのポリシー
リソースポリシー
アクセス許可の
境界
IAM セッション
ポリシー
Activities API
サービスコント
ロールポリシー
(SCP)
• AWS Identity and Access Management (IAM) の
アクセス権限で、以下へのアクセスを認可:
• コントロールプレーン－リソースの管理
（例）:
• CreateFunction (Lambda)
• UpdateTable (DynamoDB)
• データプレーン－リソースの操作・実行
（例）:
• Invoke (Lambda)
• PutItem (DynamoDB)
Lambda
DynamoDB
API Gateway


## p.15

IAM によるLambda 関数のセキュア化
リソースベースのポリシー
実行ロール
リソースベースのポリシー
• 関数を誰が呼び出せるかを定義
• クロスアカウントアクセスをサポート
• 同期および非同期呼び出しに使用
“API Gateway A から
Lambda 関数B を呼び出す”
実行ロール
• どのAWS リソースへアクセスできるかを
定義
• ポーリングベースの呼び出し(SQS など) に
も使用（Lambda ポーリング）
“Lambda 関数B はDynamoDB テーブルC に
書き込み可能”


## p.16

最小権限の原則
• 最小権限とは、目的の作業に必要な
最小限の権限の集合
• 時間とともに見直していく
• 権限を実行ロール経由でアタッチ
• リソースごとに専用のロールを推奨
• きめ細かな権限を付与
権限設定
アクセス検証
権限調整


## p.17

データベース・API 連携のセキュア化
API 連携
• 利用可能な場合はIAM を優先
• API Gateway, AWS AppSync, 
Lambda function URLs
• IAM が使えない場合API キー, OAuth
• AWS Secrets Manager や
AWS Systems Manager の機能である
Parameter Store などを活用
データベース
• データベースがIAM による保護を
サポートしている場合
• 利用可能な場合はIAM を優先
• 例: Amazon Neptune, Amazon ElastiCache, 
Amazon Aurora
•
Aurora では、新規接続が多い場合はRDS Proxy 等
も検討
• IAM のサポートがない場合
• 環境変数よりマネージドなシークレット管理
を優先
• ハードコードしない
Activities API
Lambda
DynamoDB
API Gateway


## p.18

API セキュリティの基礎説明の流れ
• IAM を土台にしたセキュアなAPI 構築
• 開発スピードを止めない自動化と守りの多層防御


## p.19

Amazon Inspector でコードと依存関係を分析
Amazon Inspector
# ←脆弱なバージョン（例: 2.19.0）
対象：デプロイ前のコードと依存関係


## p.20

Amazon GuardDuty でランタイム異常を検出
• 正確でコンテキストに基づいた、すぐ対処できる検出結果を生成
• Lambda 関数のVPC 接続有無に関わらず対応
• 設定変更不要で利用可能
Activities API
対象：実行中のLambda 関数
Lambda
DynamoDB
API Gateway


## p.21

Lambda でイベントペイロードを検証
• 処理前、パース前に入力を検証
• 厳密な型付けを使用
• 1 つのパラメータで複数のデータ型を
受け付けない
• 汎用的な型（例：String）には、
制約と追加の検証を適用
• すべてのイベントソースで検討する
• 特にAPI において重要
Powertools for AWS Lambda による実装例
対象：Lambda 関数の入力


## p.22

API Gateway でイベントペイロードを検証
• API リクエストを受け付ける前に
入力を検証
• ペイロードのモデルを指定
• 3つの設定オプション:
• Body のみ
• クエリ文字列パラメータとヘッダー
• Body、クエリ文字列パラメータ、および
ヘッダー
対象：API に届いたリクエスト


## p.23

AWS WAF でAPI エンドポイントを保護
IP ベースの制御
• 悪意のあるIP アドレスからの保護
• レートベースルール
• IP 許可/拒否リスト
• 地理的リージョンの許可/拒否リスト
AWS WAF
AWS マネージド
ルール
レートベース
ルール
サードパーティ
ルール
カスタムルール
Routes API
Socials API
Support API
Activities API
対象：API に届く前のリクエスト


## p.24

AWS WAF でAPI エンドポイントを保護
ルールベースの制御
• マネージドルールで一般的な
攻撃パターンから保護
• OWASP Top 10 を踏まえた構成
• カスタムルールの定義または
サードパーティルールの活用
• HTTP リクエストの検査
Routes API
Socials API
Support API
Activities API
AWS マネージド
ルール
レートベース
ルール
サードパーティ
ルール
カスタムルール
対象：API に届く前のリクエスト
AWS WAF


## p.25

• 題材：フィットネスアプリ
• API セキュリティの基礎
• アイデンティティ(ID) を意識したAPI 認可
• AI エージェントの認可－はじめの一歩
• まとめ
アジェンダ


## p.26

アイデンティティ(ID) を意識したAPI 認可


## p.27

API における認可ポイントの整理
API Gateway
Lambda
ユーザー
Web
ブラウザ
Web
アプリケーション


## p.28

API における認可ポイントの整理
Lambda
Fitness Web
アプリケーション
ユーザー
Web
ブラウザ
Web
アプリケーション
API Gateway


## p.29

API における認可ポイントの整理
Lambda
Activities API や
Routes API
ユーザー
Web
ブラウザ
Web
アプリケーション
Fitness Web
アプリケーション
API Gateway


## p.30

API における認可ポイントの整理
Lambda
ビジネス
ロジック
Activities API や
Routes API
ユーザー
Web
ブラウザ
Web
アプリケーション
Fitness Web
アプリケーション
API Gateway


## p.31

API における認可ポイントの整理
Lambda
Fitness Web
アプリケーション
リソースポリシーと
実行ロール
Activities API や
Routes API
ビジネス
ロジック
ユーザー
Web
ブラウザ
Web
アプリケーション
API Gateway


## p.32

API における認可ポイントの整理
Lambda
Fitness Web
アプリケーション
リソースポリシーと
実行ロール
ユーザー認証と認可
ビジネス
ロジック
ユーザー
Web
ブラウザ
Web
アプリケーション
Activities API や
Routes API
API Gateway


## p.33

サーバーレスアプリケーションの全体像
Fitness アプリケーション
Fitness Web
アプリケーション


## p.34

サーバーレスアプリケーションの全体像
Activities API
Fitness アプリケーション
Fitness Web
アプリケーション


## p.35

サーバーレスアプリケーションの全体像
Activities API
Routes API
Socials API
Support API
Fitness アプリケーション
Fitness Web
アプリケーション


## p.36

API 認可の説明の流れ
• OAuth2 登場人物
• 関連するクレデンシャル
• 関連するトークン
• OAuth2 グラントタイプ
• 認可コードフロー
• クライアントクレデンシャルフロー
• きめ細かな認可
• 各API のビジネスロジックでの認可
• Amazon Verified Permissions による認可


## p.37

API 認可の説明の流れ
• OAuth2 登場人物
• 関連するクレデンシャル
• 関連するトークン
• OAuth2 グラントタイプ
• 認可コードフロー
• クライアントクレデンシャルフロー
• きめ細かな認可
• 各API のビジネスロジックでの認可
• Amazon Verified Permissions による認可


## p.38

OAuth2 登場人物
リソース
オーナー
ユーザー


## p.39

OAuth2 登場人物
ユーザー
エージェント
Web
ブラウザ
リソース
オーナー
ユーザー


## p.40

OAuth2 登場人物
ユーザー
エージェント
Web
アプリケーション
クライアント
Web
ブラウザ
リソース
オーナー
ユーザー


## p.41

OAuth2 登場人物
リソース
サーバー
API Gateway
ユーザー
エージェント
クライアント
Web
アプリケーション
Web
ブラウザ
リソース
オーナー
ユーザー


## p.42

OAuth2 登場人物
認可
サーバー
Amazon
Cognito
リソース
サーバー
リソース
オーナー
ユーザー
エージェント
クライアント
Web
アプリケーション
ユーザー
Web
ブラウザ
API Gateway


## p.43

API 認可の説明の流れ
• OAuth2 登場人物
• 関連するクレデンシャル
• 関連するトークン
• OAuth2 グラントタイプ
• 認可コードフロー
• クライアントクレデンシャルフロー
• きめ細かな認可
• 各API のビジネスロジックでの認可
• Amazon Verified Permissions による認可


## p.44

関連するクレデンシャル
クライアントID
公開可能な情報: 
アプリケーションの識別用


## p.45

関連するクレデンシャル
公開可能な情報: 
アプリケーションの識別用
クライアントシークレット
秘密情報: 
アプリケーションの認証用
※ Confidential Client を前提
クライアントID


## p.46

API 認可の説明の流れ
• OAuth2 登場人物
• 関連するクレデンシャル
• 関連するトークン
• OAuth2 グラントタイプ
• 認可コードフロー
• クライアントクレデンシャルフロー
• きめ細かな認可
• 各API のビジネスロジックでの認可
• Amazon Verified Permissions による認可


## p.47

関連するトークン
アクセストークン
短期間有効なトークン。
保護されたリソースへの
アクセス時に提示し、
呼び出し元に
許可された操作範囲
（スコープ）を定義


## p.48

関連するトークン
長期間有効なトークン。
ユーザーの再ログインなし
に期限切れのアクセス
トークンを自動的に更新
リフレッシュトークン
アクセストークン
短期間有効なトークン。
保護されたリソースへの
アクセス時に提示し、
呼び出し元に
許可された操作範囲
（スコープ）を定義


## p.49

関連するトークン
ID トークン
短期間有効なトークン。
ユーザーのID 情報
（名前・メール等）を
含み、リクエスターが
「誰か」を示す認証の
証明として使用
短期間有効なトークン。
保護されたリソースへの
アクセス時に提示し、
呼び出し元に
許可された操作範囲
（スコープ）を定義
長期間有効なトークン。
ユーザーの再ログインなし
に期限切れのアクセス
トークンを自動的に更新
リフレッシュトークン
アクセストークン


## p.50

関連するトークン
ID トークン
短期間有効なトークン。
ユーザーのID 情報
（名前・メール等）を
含み、リクエスターが
「誰か」を示す認証の
証明として使用
短期間有効なトークン。
保護されたリソースへの
アクセス時に提示し、
呼び出し元に
許可された操作範囲
（スコープ）を定義
長期間有効なトークン。
ユーザーの再ログインなし
に期限切れのアクセス
トークンを自動的に更新
リフレッシュトークン
アクセストークン
OAuth2
OpenID Connect 
(OIDC)


## p.51

API 認可の説明の流れ
• OAuth2 登場人物
• 関連するクレデンシャル
• 関連するトークン
• OAuth2 グラントタイプ
• 認可コードフロー
• クライアントクレデンシャルフロー
• きめ細かな認可
• 各API のビジネスロジックでの認可
• Amazon Verified Permissions による認可


## p.52

OAuth2 グラントタイプ
認可コードフロー
ユーザーを代理してアクセス
（人が介在）
クライアントクレデンシャルフロー
アプリ自身としてアクセス
（マシン間/ M2M）


## p.53

認可コードフロー: フェーズ1 認可コード生成
クライアント
Web
アプリケーション
リソース
オーナー
ユーザー
エージェント
ユーザー
Web 
ブラウザ
アプリに
アクセス
1
ユーザーを代理してアクセス（人が介在）


## p.54

認可コードフロー: フェーズ1 認可コード生成
認可
サーバー
Amazon
Cognito
クライアント
Web
アプリケーション
リソース
オーナー
ユーザー
エージェント
ユーザー
Web 
ブラウザ
アプリに
アクセス
1
クライアントID 
付きリダイレクト
2
ユーザーを代理してアクセス（人が介在）


## p.55

認可コードフロー: フェーズ1 認可コード生成
認可
サーバー
Amazon
Cognito
クライアント
ユーザーがログイン
3
Web
アプリケーション
リソース
オーナー
ユーザー
エージェント
ユーザー
Web 
ブラウザ
アプリに
アクセス
1
クライアントID 
付きリダイレクト
2
ユーザーを代理してアクセス（人が介在）


## p.56

認可コードフロー: フェーズ1 認可コード生成
認可
サーバー
Amazon
Cognito
認可コードが
生成される
クライアント
4
ユーザーがログイン
3
Web
アプリケーション
リソース
オーナー
ユーザー
エージェント
ユーザー
Web 
ブラウザ
アプリに
アクセス
1
クライアントID 
付きリダイレクト
2
ユーザーを代理してアクセス（人が介在）


## p.57

認可コードフロー: フェーズ1 認可コード生成
認可
サーバー
Amazon
Cognito
認可コードが
生成される
クライアント
認可コード付き
リダイレクト
5
4
ユーザーがログイン
3
Web
アプリケーション
リソース
オーナー
ユーザー
エージェント
クライアントID 
付きリダイレクト
2
ユーザー
Web 
ブラウザ
アプリに
アクセス
1
ユーザーを代理してアクセス（人が介在）


## p.58

認可コードフロー: フェーズ2 トークン生成と使用
クライアント
Web
アプリケーション
ユーザーを代理してアクセス（人が介在）


## p.59

認可コードフロー: フェーズ2 トークン生成と使用
認可コード
を受信
デプロイ時に配置：
・クライアントID
・クライアントシークレット
1
クライアント
Web
アプリケーション
ユーザーを代理してアクセス（人が介在）


## p.60

認可コードフロー: フェーズ2 トークン生成と使用
認可
サーバー
Amazon
Cognito
認可コード
を受信
クライアントID、ク
ライアントシークレ
ット、認可コードを
トークンと交換
1
2
クライアント
Web
アプリケーション
デプロイ時に配置：
・クライアントID
・クライアントシークレット
ユーザーを代理してアクセス（人が介在）


## p.61

認可コードフロー: フェーズ2 トークン生成と使用
リソース
サーバー
認可
サーバー
API Gateway
Amazon
Cognito
認可コード
を受信
Bearer トークンに
よる保護リソースへ
のリクエスト
1
2
3
クライアント
クライアントID、ク
ライアントシークレ
ット、認可コードを
トークンと交換
Web
アプリケーション
デプロイ時に配置：
・クライアントID
・クライアントシークレット
ユーザーを代理してアクセス（人が介在）


## p.62

認可コードフロー: フェーズ2 トークン生成と使用
認可
サーバー
Amazon
Cognito
認可コード
を受信
Bearer トークンの検証
に使う公開鍵を取得
1
2
3
4
クライアント
リソース
サーバー
クライアントID、ク
ライアントシークレ
ット、認可コードを
トークンと交換
Web
アプリケーション
API Gateway
デプロイ時に配置：
・クライアントID
・クライアントシークレット
Bearer トークンに
よる保護リソースへ
のリクエスト
ユーザーを代理してアクセス（人が介在）


## p.63

認可コードフロー: フェーズ2 トークン生成と使用
認可
サーバー
Amazon
Cognito
認可コード
を受信
1
2
3
4
クライアント
リソース
サーバー
クライアントID、ク
ライアントシークレ
ット、認可コードを
トークンと交換
Web
アプリケーション
API Gateway
Lambda
デプロイ時に配置：
・クライアントID
・クライアントシークレット
ビジネス
ロジック
5
Bearer トークンの検証
に使う公開鍵を取得
Bearer トークンに
よる保護リソースへ
のリクエスト
ユーザーを代理してアクセス（人が介在）


## p.64

認可コードフロー全体像
1
Amazon
Cognito
Lambda
7
2
3
4
5
6
リソース
サーバー
認可
サーバー
リソース
オーナー
ユーザー
エージェント
クライアント
ユーザー
Web 
ブラウザ
Web
アプリケーション
API Gateway
ビジネス
ロジック
ユーザーを代理してアクセス（人が介在）


## p.65

OAuth2 グラントタイプ
認可コードフロー
ユーザーを代理してアクセス
（人が介在）
クライアントクレデンシャルフロー
アプリ自身としてアクセス
（マシン間/ M2M）


## p.66

クライアントクレデンシャルフロー
バッチ
アプリケーション
クライアント
アプリ自身としてアクセス（マシン間/ M2M）


## p.67

クライアントクレデンシャルフロー
クライアント
デプロイ時に配置：
・クライアントID
・クライアントシークレット
バッチ
アプリケーション
アプリ自身としてアクセス（マシン間/ M2M）


## p.68

クライアントクレデンシャルフロー
Amazon
Cognito
1
クライアントID とクラ
イアントシークレット
をトークンと交換
認可
サーバー
クライアント
デプロイ時に配置：
・クライアントID
・クライアントシークレット
バッチ
アプリケーション
アプリ自身としてアクセス（マシン間/ M2M）


## p.69

クライアントクレデンシャルフロー
API Gateway
Amazon
Cognito
1
2
リソース
サーバー
認可
サーバー
クライアント
クライアントID とクラ
イアントシークレット
をトークンと交換
デプロイ時に配置：
・クライアントID
・クライアントシークレット
バッチ
アプリケーション
Bearer トークンによる
保護されたリソースへの
リクエスト
アプリ自身としてアクセス（マシン間/ M2M）


## p.70

クライアントクレデンシャルフロー
Amazon
Cognito
Bearer トークンの検証
に使う公開鍵を取得
3
1
2
リソース
サーバー
認可
サーバー
クライアント
クライアントID とクラ
イアントシークレット
をトークンと交換
デプロイ時に配置：
・クライアントID
・クライアントシークレット
API Gateway
バッチ
アプリケーション
Bearer トークンによる
保護されたリソースへの
リクエスト
アプリ自身としてアクセス（マシン間/ M2M）


## p.71

クライアントクレデンシャルフロー
Amazon
Cognito
Lambda
4
3
Bearer トークンによる
保護されたリソースへの
リクエスト
1
2
認可
サーバー
クライアント
クライアントID とクラ
イアントシークレット
をトークンと交換
デプロイ時に配置：
・クライアントID
・クライアントシークレット
リソース
サーバー
API Gateway
ビジネス
ロジック
バッチ
アプリケーション
Bearer トークンの検証
に使う公開鍵を取得
アプリ自身としてアクセス（マシン間/ M2M）


## p.72

OAuth2 グラントタイプの使い分け
認可コードフロー
ユーザーを代理してアクセス
（人が介在）
クライアントクレデンシャルフロー
アプリ自身としてアクセス
（マシン間/ M2M）


## p.73

API 認可の説明の流れ
• OAuth2 登場人物
• 関連するクレデンシャル
• 関連するトークン
• OAuth2 グラントタイプ
• 認可コードフロー
• クライアントクレデンシャルフロー
• きめ細かな認可
• 各API のビジネスロジックでの認可
• Amazon Verified Permissions による認可


## p.74

API 認可の説明の流れ
• OAuth2 登場人物
• 関連するクレデンシャル
• 関連するトークン
• OAuth2 グラントタイプ
• 認可コードフロー
• クライアントクレデンシャルフロー
• きめ細かな認可
• 各API のビジネスロジックでの認可
• Amazon Verified Permissions による認可


## p.75

各API のビジネスロジックでの認可
リソース
サーバー
API Gateway
Lambda
ビジネス
ロジック


## p.76

各API のビジネスロジックでの認可
リソース
サーバー
API Gateway
Lambda
ビジネス
ロジック


## p.77

API 認可の説明の流れ
• OAuth2 登場人物
• 関連するクレデンシャル
• 関連するトークン
• OAuth2 グラントタイプ
• 認可コードフロー
• クライアントクレデンシャルフロー
• きめ細かな認可
• 各API のビジネスロジックでの認可
• Amazon Verified Permissions による認可


## p.78

Amazon Verified Permissions による認可
認可
サーバー
アイデンティティ
プロバイダー
認証
1
リソース
オーナー
ユーザー


## p.79

Amazon Verified Permissions による認可
リソース
サーバー
API Gateway
認証
1
2
Bearer トークンによる
保護されたリソースへの
リクエスト
認可
サーバー
アイデンティティ
プロバイダー
リソース
オーナー
ユーザー


## p.80

Amazon Verified Permissions による認可
認証
1
2
3
Bearer トークンが
有効であることを確認
リソース
サーバー
認可
サーバー
アイデンティティ
プロバイダー
Lambda
オーソライザー
API Gateway
リソース
オーナー
ユーザー
Bearer トークンによる
保護されたリソースへの
リクエスト


## p.81

Amazon Verified Permissions による認可
Verified
Permissions
認証
1
2
Bearer トークンが
有効であることを確認
3
ポリシーを評価
4
リソース
サーバー
認可
サーバー
アイデンティティ
プロバイダー
Lambda
オーソライザー
API Gateway
リソース
オーナー
ユーザー
Bearer トークンによる
保護されたリソースへの
リクエスト


## p.82

Amazon Verified Permissions による認可
バックエンド
統合
Lambda
オーソライザー
Verified
Permissions
認証
1
2
3
4
バックエンド
の呼び出し
5
Bearer トークンが
有効であることを確認
ポリシーを評価
リソース
サーバー
認可
サーバー
アイデンティティ
プロバイダー
API Gateway
リソース
オーナー
ユーザー
Bearer トークンによる
保護されたリソースへの
リクエスト


## p.83

Cedar によるきめ細かなポリシー
Cognito
ユーザープール
API メソッド/リソース
Cognito
ユーザー
グループ
リソースの所有者= リクエスト元ユーザー


## p.84

• 題材：フィットネスアプリ
• API セキュリティの基礎
• アイデンティティ(ID) を意識したAPI 認可
• AI エージェントの認可－はじめの一歩
• まとめ
アジェンダ


## p.85

AI エージェントの認可－はじめの一歩


## p.86

AI エージェントの認可説明の流れ
• 自分で組み立てるAI エージェント認可─仕組みと課題
• マネージドサービスによる解決─Amazon Bedrock AgentCore


## p.87

AI エージェントの認可説明の流れ
• 自分で組み立てるAI エージェント認可─仕組みと課題
• マネージドサービスによる解決─Amazon Bedrock AgentCore


## p.88

フィットネスアプリAPI をエージェントから使う
Activities API
Routes API
Socials API
Support API
Fitness アプリケーション
Fitness Web
アプリケーション


## p.89

フィットネスアプリAPI をエージェントから使う
Activities API
Routes API
Socials API
Support API
Fitness アプリケーション
Fitness Web
アプリケーション


## p.90

ツールコーリングによるAPI 連携
Fitness エージェント
Activities
Routes
Socials
Support
Activities API
Routes API
Socials API
Support API
Tools


## p.91

ツールコーリングの課題
Activities
Routes
Socials
Support
Activities API
Routes API
Socials API
Support API
Tools
Fitness エージェント


## p.92

標準化されたツール接続(MCP)
Activities
Routes
Socials
Support
Activities API
Routes API
Socials API
Support API
MCP
クライアント
MCP
サーバー
Fitness エージェント


## p.93

エージェントでのOAuth2 適用
Fitness エージェント
Activities
Activities API
MCP
クライアント
MCP
サーバー


## p.94

エージェントでのOAuth2 適用
Activities
Activities API
認可コードフロー
Fitness エージェント
MCP
クライアント
MCP
サーバー


## p.95

エージェントでのOAuth2 適用
Activities
Activities API
クライアント
クレデンシャル
フロー
認可コードフロー
Fitness エージェント
MCP
クライアント
MCP
サーバー


## p.96

エージェントでのOAuth2 適用
Activities
Activities API
認可コードフロー
クライアント
クレデンシャル
フロー
クライアント
クレデンシャル
フロー
Fitness エージェント
MCP
クライアント
MCP
サーバー


## p.97

エージェントでのOAuth2 適用─課題
Activities
Activities API
MCP
サーバー
※ユーザーのID 伝搬は別途必要
認可コードフロー
クライアント
クレデンシャル
フロー
クライアント
クレデンシャル
フロー
Fitness エージェント
MCP
クライアント
→トークン交換で解決


## p.98

AI エージェントの認可説明の流れ
• 自分で組み立てるAI エージェント認可─仕組みと課題
• マネージドサービスによる解決─Amazon Bedrock AgentCore


## p.99

Amazon Bedrock AgentCore の構成要素
AgentCore Runtime
Models
AgentCore Identity
AgentCore Observability
AgentCore
Memory
AgentCore Gateway
AgentCore Browser
AgentCore Code Interpreter
MCP
Client
Agent instruction
Agent local tools
Agent context
Framework
あらゆるフレームワークとモデルでAI エージェントを安全に大規模にデプロイ・運用するための
基盤サービス群


## p.100

Amazon Bedrock AgentCore の構成要素
AgentCore Runtime
Models
AgentCore Identity
AgentCore Observability
AgentCore
Memory
AgentCore Gateway
AgentCore Browser
AgentCore Code Interpreter
MCP
Client
Agent instruction
Agent local tools
Agent context
Framework
あらゆるフレームワークとモデルでAI エージェントを安全に大規模にデプロイ・運用するための
基盤サービス群


## p.101

AgentCore Gateway
AgentCore Runtime
Models
AgentCore Identity
AgentCore Observability
AgentCore
Memory
AgentCore Gateway
AgentCore Browser
AgentCore Code Interpreter
MCP
Client
Agent instruction
Agent local tools
Agent context
Framework
ツールへの統一された入り口


## p.102

AgentCore Identity
AgentCore Runtime
Models
AgentCore Identity
AgentCore Observability
AgentCore
Memory
AgentCore Gateway
AgentCore Browser
AgentCore Code Interpreter
MCP
Client
Agent instruction
Agent local tools
Agent context
Framework
エージェントの認証・認可とクレデンシャル管理


## p.103

AgentCore Identity の役割─インバウンド認証
インバウンド認証
(IAM/OAuth)
ユーザー
アプリケーション
エージェント


## p.104

AgentCore Identity の役割─アウトバウンド認証
ユーザー
アプリケーション
エージェント
インバウンド認証
(IAM/OAuth)
その他の
AWS
リソース
AgentCore
Gateway
外部
リソース
アウトバウンド認証
(IAM)
アウトバウンド認証
(OAuth)
アウトバウンド認証
(OAuth)


## p.105

[SEC353]
エージェント型AI アプリのセキュリティ・UX・開発速度を同
時に実現
─Amazon Bedrock AgentCore Identity が解決する3 つの課
題
日時：6/26 (金) 13:00 – 13:40
会場：Hall 8 / Room 05
AgentCore Identity 関連セッション


## p.106

まとめ


## p.107

• 多層防御を適用する
まとめ


## p.108

• 多層防御を適用する
• 常に最小権限ポリシーを適用する
まとめ


## p.109

• 多層防御を適用する
• 常に最小権限ポリシーを適用する
• セキュリティ対策と制御を自動化する
まとめ


## p.110

• 多層防御を適用する
• 常に最小権限ポリシーを適用する
• セキュリティ対策と制御を自動化する
• AWS の各サービス間の緊密な統合を活用する
まとめ


## p.111

Ask the Speaker
こちらのRoom 後方の外側にございます、
「Ask the Speaker」カウンターまでお越しください
渡辺紘久
アマゾンウェブサービスジャパン合同会社
Room


## p.112

本セッションのアンケートへ
ご協力をお願いします
Please give us your feedback
Thank you!
CNS315
