---
title: "エージェンティック AI アプリの セキュリティ・UX・開発速度を同時に実現 ─ Amazon Bedrock AgentCore Identity が解決する 3つの課題"
category: "AWSセッション"
session_id: "SEC353"
pages: 39
topics: ["セキュリティ", "生成AI/エージェント"]
services: ["AWS CloudTrail", "AWS IAM", "AgentCore", "Amazon Bedrock", "MCP"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/AWSセッション/エージェンティック AI アプリの セキュリティ・UX・開発速度を同時に実現 ─ Amazon Bedrock AgentCore Identity が解決する 3つの課題.pdf"
---
# エージェンティック AI アプリの セキュリティ・UX・開発速度を同時に実現 ─ Amazon Bedrock AgentCore Identity が解決する 3つの課題


## p.1

SEC353
エージェンティックAI アプリの
セキュリティ・UX・開発速度を同時に実現
─Amazon Bedrock AgentCore Identity が解決する3 つの課題
柴田龍平
アマゾンウェブサービスジャパン合同会社


## p.2

本セッションでお話しすること
•
独自のエージェンティックAI を構築しようと考えている方
•
エージェンティックAI のセキュリティに関心のあるエンジニア・アーキテクト
•
エージェンティックAI を本番導入するにあたってのID とアクセス管理の課題
•
Amazon Bedrock AgentCore Identity の概要と始め方


## p.3

自己紹介
柴田
龍平
アマゾンウェブサービスジャパン
シニアソリューションアーキテクト
3
SaaS / ソフトウェアベンダーのお客様や
セキュリティに課題をお持ちのお客様を中心に
技術的なご支援しています。


## p.4

•
エージェンティックAI を取り巻く状況
•
エージェントシステムにおけるアイデンティティの課題
•
Amazon Bedrock AgentCore Identity とは
•
Amazon Bedrock AgentCore Identity の仕組み
•
セキュリティ・UX・開発速度のバランスを実現する
•
まとめ
アジェンダ


## p.5

エージェンティックAI を取り巻く状況


## p.6

エンタープライズ企業はエージェントへの投資を倍増
Gartner, “Top strategic Technology Trends for 2025,” October 2024 
Gartner, “Top Strategic Technology Trends: Agentic AI—the 
Evolution of Experience” February 2025
2028年までにエンタープライズ
ソフトウェアの33%がエージェ
ンティックAI を搭載
（2024年は1%未満）
2028年までに日常業務の意思決定
の15%がエージェンティックAI に
より自律的に行われるように


## p.7

組織がエージェンティックAI を採用したいと考える理由
大規模な生産性
コンテキストに
基づく意思決定
市場投入までの
時間短縮


## p.8

AI Agent の本番運用に
求められること
エージェントには必要最小限の
アクセス権限だけを付与する
エージェントの自律性と
組織のガードレールを両立させる
エージェントによるリソースアクセスを
漏れなく追跡できる監査証跡


## p.9

エージェントシステムにおける
アイデンティティの課題


## p.10

一般的なアクセスパターン
ユーザーの代理でタスクを実行
事前の認可を受けたエージェントが
イベントに対してタスクを実行


## p.11

組織内のエージェンティックAI ユースケース例
CRM システム: 
通話メモを取得
財務システム: 
支出データを取得
1
Email ツール: 
要約資料を作成・送信
Agent
2
3
4
5


## p.12

ID とアクセス管理の考慮点
エージェントの
呼び出し元の検証
Agent
CRM システム: 
通話メモを取得
財務システム: 
支出データを取得
Email ツール: 
要約資料を作成・送信
Agent


## p.13

ID とアクセス管理の考慮点
エージェントの
呼び出し元の検証
同意の管理
Agent
CRM システム: 
通話メモを取得
財務システム: 
支出データを取得
Email ツール: 
要約資料を作成・送信


## p.14

ID とアクセス管理の考慮点
エージェントの
呼び出し元の検証
同意の管理
Agent
CRM システム: 
通話メモを取得
財務システム: 
支出データを取得
Email ツール: 
要約資料を作成・送信
限られたシステム
アクセスのみに制限
CRM システム: 
通話メモを取得
財務システム: 
支出データを取得
Email ツール: 
要約資料を作成・送信


## p.15

ID とアクセス管理の考慮点
エージェントの
呼び出し元の検証
同意の管理
限られたシステム
アクセスのみに制限
カスタムコードの開発
Agent
CRM システム: 
通話メモを取得
財務システム: 
支出データを取得
Email ツール: 
要約資料を作成・送信


## p.16

エージェントシステムにおける根本的な
アイデンティティの3 つの課題
権限の安全な委任
独自の統合と
連携のためのコード
同意疲れへの対応


## p.17

エージェントシステムにおける根本的な
アイデンティティの3 つの課題
権限の安全な委任
独自の統合と
連携のためのコード
同意疲れへの対応
組織のエージェント採用を加速するための権限委任の仕組み
エージェンティックAI を本番で動作させるための土台


## p.18

Amazon Bedrock
AgentCore Identity とは


## p.19

AgentCore Identity
AgentCore 
Memory
AgentCore Gateway
AgentCore Policy
AgentCore Runtime
あらゆるフレームワークとモデルでAI エージェントを安全に大規模にデプロイ・運用するための
基盤サービス群
Amazon Bedrock AgentCore
AgentCore Observability
AgentCore Browser
AgentCore Code Interpreter
AgentCore Identity
MCP
Client
Agent instruction
Agent local tools
Agent context
Framework
Models
AgentCore Evaluations | AgentCore Optimization | AgentCore Payments etc.


## p.20

マネージドなエージェントのID とアクセス管理
Amazon Bedrock AgentCore Identity
権限の安全な委任
独自の統合と
連携のためのコード
同意疲れへの対応
セキュリティ
UX
開発速度
• エージェント固有ID を
付与し大規模に安全な
エージェント運用を実現
• AWS・3rd party サービ
ス（Google、GitHub、
Slack等）に安全にアク
セス
AI エージェント向けの
安全な委任アクセス
• Okta、Azure Entra ID 
Amazon Cognito など
既存のID システムと
シームレスに統合
• ユーザー移行や認証の
再構築を不要にし新規
コードの開発を削減
エージェント開発の加速
• セキュアなトークン
ボールトで同意疲れを
最小化
• 認証フローとクレデン
シャル管理を最適化
• 包括的な監査証跡で
完全な可視性を提供
最適化された
エージェント体験の構築


## p.21

Bedrock AgentCore Identity はこれらの両方をサポート
Inbound Auth
Outbound Auth
AI エージェントを構築するにあたって必要なのは…
ユーザーがアプリケーションから
エージェントにアクセス
エージェントが
リソースにアクセス
エージェンティックAI の認証認可の基礎
アプリ
ケーション
ユーザー
エージェント
ツール
リソース
ゲートウェイ


## p.22

AgentCore Identity で確認できること
エージェンティックAI の認証認可の基礎
Inbound Auth
Outbound Auth
このユーザーは誰か？
このエージェントは
本物か？
認証
(AuthN)
認可
(AuthZ)
このユーザーは
このエージェントを
呼び出す権限があるか？
ユーザーに代わって
リソースにアクセスする
権限があるか？
アプリ
ケーション
ユーザー
エージェント
ツール
リソース
ゲートウェイ
このエージェントは誰か？


## p.23

Amazon Bedrock
AgentCore Identity の仕組み


## p.24

ユーザー
利用
アプリケーション
実行
Inbound Auth
AgentCore Identity
外部リソース/
外部エージェント
(OAuth or API key 経由)
Outbound Auth
AgentCore Identity
アクセス
このユーザーは誰か？
エージェントを呼び出す
権限があるか？
エージェントの認証情報は有効か？
リソースとツールに
アクセスできるか？
既存IDP
エージェント
AgentCore Runtime
Bedrock AgentCore Identity 
Inbound / Outbound Auth の流れ
AWS Cloud
リソース


## p.25

エージェント
ユーザー
利用
アプリケーション
IdP トークンを
付与して実行
AgentCore Identity
既存IDP
ログイン情報
IdP トークン
ユーザー検証のための
公開鍵を取得
エージェントが
実行される
AgentCore Runtime
IdP トークンの
検証をリクエスト
ワークロードアクセストークン
(WAT) を返却
公開鍵（JWKS）
1
2
3
5
4
6
Bedrock AgentCore Identity Inbound Auth
このユーザーは誰か？エージェントを呼び出す権限があるか？


## p.26

Inbound Auth によるエージェントへのアクセス制御
IAM SigV4 による制御
JWT による制御
デフォルトの認証方式
呼び出し元アプリがEC2 / ECS / EKS 等で
稼働している場合IAM でアクセス制御が完結
IAM Role を使えば認証情報ローテーション不要
X-Amzn-Bedrock-AgentCore-Runtime-User-Id 
ヘッダー経由でユーザー情報をOutbound Auth に伝播
アプリケーションの認証情報を利用してアクセス
aud, client_id, scope や任意のクレームを
利用したアクセス制御が可能
JWT に含まれるユーザーのID は
自動的にOutbound Auth に伝播


## p.27

ワークロードアクセストークンとは？
IdP トークン(Access Token) + 
= ワークロードアクセストークン(WAT)
AgentCore Runtime
CRM 
agent
ワークロード
アクセストークン
(WAT)
IdP トークン
(Access Token)
Inbound
Auth
Oubound
Auth
リソースサーバー用
認証情報
Runtime やGatewayに対して一意の
識別子を割り当て
誰が、どのエージェント経由で
アクセスしているかを厳密に管理


## p.28

AgentCore Identity
AWS Cloud 
リソース
外部リソース
サービス
エージェント
リソースへの
アクセスを要求
AgentCore Runtime 
or Gateway
トークンボールト
外部ツールの
アクセストークン
AWS IAM 
実行ロール
認証情報
プロバイダー
OAuth フロー
(2LO / 3LO / OBO)
OAuth トークン
OAuth トークン
or API キー
Bedrock AgentCore Identity Outbound Auth
エージェントは有効か？ユーザーに代わって保護されたリソースにアクセスできるか？
ワークロード
アクセストークン
(WAT)
ユーザーのOAuth トークンを安全に保管
不要な同意要求を削減


## p.29

29
ユーザー
AWS リソースアクセス
例: ユーザーがエージェントを呼び
出してAWS サービスにアクセス
AWS サービス
リソース
エージェント
エージェント
AWS サービス
リソース
IAM
AWS リソース以外への
ユーザー代理アクセス
例: エージェントがユーザーに代わり
SaaS や社内アプリにアクセス
リソース
エージェント
ユーザー
On-Behalf-Of Access
(Token Exchange / JWT Bearer Grant)
※認可サーバーが対応している必要がある
3LO Access
(Authorization Code Grant)
※初回のみユーザー同意が必要
エージェント
リソース
AWS リソース以外への
マシンアクセス
例: エージェントが外部DB に
定期クエリジョブを実行
2LO Access
(Client Credentials Grant)
API Key
Outbound Auth としてサポートするアクセスパターン


## p.30

セキュリティ・UX・開発速度のバランスを
実現するAgentCore Identity


## p.31

ユーザーから見たAgentCore Identity の動作
AgentCore Identity が裏側で行うこと:
呼び出し元ID の検証: IdP が発行したユーザーのOAuth 
アクセストークンを検証し、ユーザーがエージェントを
呼び出せるか確認
ユーザー同意とスコープの強制: エージェントへの委任
権限を確認（例: CRM.Read, Finance.Read）
エージェントのタスク実行を認可: 時限付きトークンを
エージェントに発行しユーザーの代理でアクションを実行
認証情報交換の促進: トークンボールトに保管されたCRM・
財務・メールシステム発行のアクセストークンを
エージェントが安全に取得
リソースアクセスの仲介: エージェントがユーザーの
代理でCRM・財務・メールシステムに安全にアクセス
Agent
CRM 
通話メモ取得
財務システム
支出取得
Email
作成・送信


## p.32

32
開発者の体験：AgentCore Runtime とIdentity
Outbound Auth の拡張
リソース認証情報プロバイダーを使い、OAuth 2 
またはAPI キーでOutbound Auth を実現
OAuth のセットアップ:
: 認証情報プロバイダーから
Client ID とSecret を取得
例: Google Cloud Identity, Microsoft Entra ID (旧Azure AD), Okta & 
Auth0, Firebase Authentication, GitHub 等
: 認証情報プロバイダーを設定
AgentCore コンソール、boto3 またはAWS CLI 経由
: エージェントに
アクセストークン取得コードを追加
: アクセストークンで
外部リソースを呼び出すコードを追加
Google での例:
my_sample_agent.py
my_sample_agent.py
ステップ4
Google Drive アクセ
スの例
ステップ3


## p.33

AWS CloudTrail 統合: 
AgentCore Identity API の全API コールとAWS 
リソースへのエージェントアクションを
CloudTrail イベントとして記録可能
AgentCore Observability 統合: 
インバウンドの認証リクエスト、アウトバウンド
のトークン・API キー取得の成功率をトレース・
モニタリング
AgentCore Identity の
監査可能性と可観測性


## p.34

AgentCore Policy によるきめ細やかなツールの認可
FrontEnd
Application
アイデンティティ
プロバイダ
ユーザー
エージェント
AgentCore
Gateway
社内ツール
API
社内ツール
SaaS / API
社内ツール
API
DBDB
AgentCore
Policy
ツールを実行して
良いかクエリ
ALLOW or DENY
ポリシーの例：
permit(
principal is AgentCore::OAuthUser,
action == AgentCore::Action::"RefundTool___process_refund",
resource == AgentCore::Gateway::"arn:aws:bedrock-
agentcore:us-west-2:123456789012:gateway/refund-gateway"
)
when {
principal.hasTag("username") &&
principal.getTag("username") == "John" &&
context.input.amount < 500
};


## p.35

まとめ


## p.36

• セキュリティ：エージェントのアクセス制御やエージェントへの安全な権限移譲
• UX：ユーザーの同意疲れからの解放
• 開発速度：既存の認可サーバーやトークンの保管の実装
•
ユーザー認証からリソースアクセスまでの権限制御と監査証跡を提供
•
認可サーバーから取得したトークンの保管により同意疲れを軽減
•
既存のID 基盤をそのまま利用し、最小限のコードで実装
Key Takeaways


## p.37

AWS ドキュメント
https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity.html
Amazon Bedrock AgentCore Samples
https://github.com/awslabs/agentcore-samples
AgentCore CLI
https://github.com/aws/agentcore-cli
Amazon Bedrock AgentCore ワークショップ
https://catalog.us-east-1.prod.workshops.aws/workshops/abd92795-9a36-4e63-a115-
ad04f483248c/ja-JP
エージェンティックAI アプリの認証・認可・ログ設計ワークショップ
https://catalog.us-east-1.prod.workshops.aws/workshops/e777691e-4c73-430a-9cb0-
67dd9f96142b/ja-JP
Amazon Bedrock AgentCore Identity のはじめ方


## p.38

Ask the Speaker
こちらのRoom 後方の外側にございます、
「Ask the Speaker」カウンターまでお越しください
柴田龍平
アマゾンウェブサービスジャパン合同会社
Room


## p.39

本セッションのアンケートへ
ご協力をお願いします
Please give us your feedback
Thank you!
SEC353
