---
title: "【デモで実演】新時代に迫る脅威！ －生成 AI への脅威事例と AI Security について－"
category: "パートナーセッション"
sponsor: "Trend Micro"
session_id: "PRT220"
pages: 43
topics: ["セキュリティ", "生成AI/エージェント"]
services: ["AWS CloudTrail", "AWS Direct Connect", "AWS Outposts", "AgentCore", "Amazon Bedrock", "Amazon DynamoDB", "Amazon EC2", "Amazon ECS", "Amazon EKS", "Amazon RDS", "Amazon S3", "Amazon SQS", "Amazon VPC", "Claude", "MCP"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/パートナーセッション/【デモで実演】新時代に迫る脅威！ －生成 AI への脅威事例と AI Security について－ (sponsored by Trend Micro).pdf"
---
# 【デモで実演】新時代に迫る脅威！ －生成 AI への脅威事例と AI Security について－


## p.1

PRT220-S
【デモで実演】新時代に迫る脅威！
－生成AI への脅威事例とAI Security について－
(sponsored by Trend Micro)
大守哲広
トレンドマイクロ株式会社
ソリューションエンジニア


## p.2

1
【デモで実演】新時代に迫る脅威！
～生成AIへの脅威事例とAI Securityについて～
AWS Summit Japan 2026
トレンドマイクロ株式会社
大守哲広


## p.3

2
TrendAI
について


## p.4

3
TrendAI
とは
トレンドマイクロの
エンタープライズ向け
ビジネスユニット
AIセキュリティプラットフォーム
TrendAI Vision One
と
提供機能のブランド名
TrendAI Vision One
Cloud
Security
Email
Security
Endpoint
Security
Service
Providers
Data
Security
SIEM
Network
Security
Identity
Security
Dashboard
Threat
Intelligence
Security
Operations
Cyber Risk
Exposure
Management


## p.5

4
Technology Partner
of the Year 2026を受賞
AWSとトレンドマイクロのアライアンス関係
AWS コンピテンシー 16種類取得
AI Software Competency も取得
• AI Software Competency
• Amazon Linux Ready
• Authority to Operate
• AWS Built-in Competency
• Containers Software Competency
• AWS Graviton Ready
• AWS Outposts Ready
• AWS PrivateLink Ready
• AWS Security Incident Response Ready
• Cloud Operations Software Competency
• DevOps Software Competency
• Government Software Competency
• Healthcare Software Competency
• MSSP Software Competency
• Security Software Competency
• Small and Medium Business Software 
Competency
Technology Partner
of the Year 2026
受賞
お客さまのクラウドジャーニーをセキュリティで加速させる


## p.6

5
AI時代の新たなセキュリティ課題


## p.7

6
Question
AIを使ったことがない、
見たことがない方はいますか


## p.8

7
❝AIが狙われる❞のはもう「未来の話」ではない
2,130
これは2025年に公開されたAIに関連
するCVEの件数です
前年34.6％の増加
11万3,000台以上現存する
インターネット上に露出したAIサーバ
中心となるインスタンスはOllama
(調査台数：31万台、調査調査期間：2025年9月〜12月)
エージェント型AIの脆弱性が1年で
255％増加
CVE数：74件→ 263件
MCPサーバー：0件から新規95件のCVE
2025年に確認された深刻度が「高／
クリティカル」のAI関連CVE：641件
クリティカル：124件＋高：517件
AIサプライチェーンにおける脆弱性の46.5％が
深刻なレベルと判定
Source: TrendAI
 State of AI Security Report 2026


## p.9

8
97%
AIが攻撃・侵害を受け
た事例で適切なアクセ
ス制御が欠如していた
63%
これだけの企業が
セキュリティ評価なし
にAIを導入している
80%
これだけの企業が生成AI
モデルのセキュリティに
自信がない
Source: 1Accenture: State of Cybersecurity Resilience 2025 | 2IBM The Cost of a Data Breach Report 2025  |  3 WEF Global Cybersecurity Outlook 2025. 
数字が示すAIセキュリティの現実


## p.10

9
TrendAI
が提供するセキュリティプラットフォーム
TrendAI Vision One


## p.11

10
AI環境全体を守り続けるための設計図：Blueprint
特定
発見とリスク評価
保護
セキュアな
AIの利用と開発
検知
AIを活用した自動検知
対応
自立型エージェント
による対応
AIワークスペースの利用
従業員
開発者
AIエージェント／AIアプリ
（エンドポイント）
▼
社内／パブリックAIサービス
LLMアプリ、Embedded Copilot、
エンタープライズエージェントなど
お客様のAIアプリケーションスタック
AI データ
ナレッジ、RAG、メモリ
生成AI／
エージェント型AIアプリ
（LLM、AIエージェント、MCP）
AI ワークロード
Kubernetes、コンテナ
AIインフラストラクチャ
オンプレミス、プライベートクラウド、
パブリッククラウド、AIファクトリー


## p.12

11
AIサービス利用環境のセキュリティ
特定
発見とリスク評価
保護
セキュアな
AIの利用と開発
検知
AIを活用した自動検知
対応
自立型エージェント
による対応
AIワークスペースの利用
従業員
開発者
AIエージェント／AIアプリ
（エンドポイント）
▼
社内／パブリックAIサービス
LLMアプリ、Embedded Copilot、
エンタープライズエージェントなど
お客様のAIアプリケーションスタック
AI データ
ナレッジ、RAG、メモリ
生成AI／
エージェント型AIアプリ
（LLM、AIエージェント、MCP）
AI ワークロード
Kubernetes、コンテナ
AIインフラストラクチャ
オンプレミス、プライベートクラウド、
パブリッククラウド、AIファクトリー


## p.13

12
導入組織のセキュリティ課題
権限のないアクション
実行
許可されていない生成
AI利用とデータ漏洩
可視性、説明責任、
管理能力の欠如


## p.14

13
13
AIサービス利用の安全を担保していくための3つの柱
水際での検知・遮断
AIサービスの特定
TrendAI Vision One
 で
統合・完結
①可視化と把握
•
利用AIサービスやAI
エージェントを可視化、
リスクを棚卸
②リアルタイム保護
•
常時AIへの入出力やAI
エージェントの挙動を
監視
•
個人情報の流出やシステ
ム破壊をブロック
③統合運用
•
TrendAI Vision One
で
一つのコンソール、一つの
プラットフォームの実現
•
運用負荷を軽減


## p.15

14
14
AIサービス利用の安全を担保していくための3つの柱
水際での検知・遮断
AIサービスの特定
TrendAI Vision One
 で
統合・完結
①可視化と把握
• 利用AIサービスやAIエージェントを可視化、リスクを棚卸
②リアルタイム保護
③統合運用


## p.16

15
15
AIサービス利用の安全を担保していくための3つの柱
AIサービスの特定
水際での検知・遮断
TrendAI Vision One
 で
統合・完結
②リアルタイム保護
• 常時AIへの入出力やAIエージェントの挙動を監視
• 個人情報の流出やシステム破壊をブロック
①可視化と把握
③統合運用


## p.17

16
16
AIサービス利用の安全を担保していくための3つの柱
AIサービスの特定
TrendAI Vision One
 で統合・完結
水際での検知・遮断
③統合運用
• TrendAI Vision One
で一つのコンソール、
一つのプラットフォームの実現
• 運用負荷を軽減
①可視化と把握
②リアルタイム保護


## p.18

17
弊社が推奨するAIサービス利用時の対策ソリューション
Vision One Endpoint 
Security
• インターネット上の
AIサービスの可視化
• AIサービスのアクセス制御
• AIサービスでの入出力制御
• ローカルAIアプリケーション
の実行制御
• ローカルAIアプリケーション
の改ざん検知
※通信制御時にAgentをインストールする場合がございます
オススメ！
オススメ！
V1ESをご利用の場合は
Agentインストール必要なし！
ゲートウェイ型※
Agent型
AI Secure Access
Cyber Risk Exposure 
Management
• インターネット上及び
ローカルのAIサービスの
可視化
• AIサービス利用に関する
リスク評価
• ZTSA/V1ESから収集した
ログの統合管理
Agent型
統合リスク管理


## p.19

18
AI開発環境のセキュリティ
特定
発見とリスク評価
保護
セキュアな
AIの利用と開発
検知
AIを活用した自動検知
対応
自立型エージェント
による対応
AIワークスペースの利用
従業員
開発者
AIエージェント／AIアプリ
（エンドポイント）
▼
社内／パブリックAIサービス
LLMアプリ、Embedded Copilot、
エンタープライズエージェントなど
お客様のAIアプリケーションスタック
AI データ
ナレッジ、RAG、メモリ
生成AI／
エージェント型AIアプリ
（LLM、AIエージェント、MCP）
AI ワークロード
Kubernetes、コンテナ
AIインフラストラクチャ
オンプレミス、プライベートクラウド、
パブリッククラウド、AIファクトリー


## p.20

19
19
従来のアプリセキュリティ
LLMセキュリティの現実
入力の形式が決まっている
（正規表現・スキーマで管理できる）
入力が自由な自然言語なので
制限できない
攻撃の種類が限られている
（SQLインジェクション、XSSなど）
攻撃が会話でのやり取りの
中に潜む
入口での検査が有効
（WAFやDLPで防げる）
モデルの自己制御の限界
何が出力されるか予測できる
出力に機密情報が混入する
リスクがある
従来とは異なるAIプロジェクトのセキュリティ


## p.21

20
20
LLMセキュリティの現実
入力が自由な自然言語なので
制限できない
攻撃が会話でのやり取りの
中に潜む
モデルの自己制御の限界
出力に機密情報が混入する
リスクがある
従来とは異なるAIプロジェクトのセキュリティ
これら全ての課題に
TrendAI Vision One
の
AI Application Securityが
対応！
AI
Security


## p.22

21
21
User
Application Load 
Balancer
Amazon ECS
(Frontend)
Amazon ECS
(Backend)
Amazon RDS
(Database)
Amazon DynamoDB
(Prompts)
On-Prem
Database
Amazon ECS
(AI Service)
Amazon SQS
(AI Jobs)
Amazon ECS
Connectors
(MCP)
On-Prem
Application
Amazon S3
(Storage)
Amazon Bedrock
AWS CloudTrail
AIアプリケーションの一般的な構成
On Premise
AWS Direct Connect


## p.23

22
安全なAI開発：プロンプトインジェクションと
エージェント悪用を防止（AI Application Security）
AI Scanner
 
-本番前にAI環境の脆弱性を洗い出す
⚫実際の攻撃をシミュレート
（レッドチーミング）
⚫脆弱性・ポリシー違反を事前に検出
AI Guard 
 
-本番稼働後もAIを24時間監視・防御
⚫機密情報の漏洩をリアルタイムでブロック
⚫プロンプトインジェクションなど
リアルタイムでAIに対する脅威をブロック


## p.24

23
23
AI Scanner
Amazon ECS
(Backend)
Amazon RDS
(Database)
Amazon ECS
AI Service 
Amazon ECS
Connectors
(MCP)
AI Scanner
AI Scannerが
疑似攻撃の
プロンプトを実施
実行前に
疑似攻撃の
手法を指定
AIアプリケーション内の
脆弱性を可視化
Amazon Bedrock
Amazon DynamoDB
(Prompts)


## p.25

24
24
自社AIアプリをスキャンする
注意：スキャン先は、フロントエンドではなくBedrockを呼び出すエンドポイントに
設定してください
コマンドライン実行
CI/CD対応
コマンド一行の実行で
模擬攻撃が開始！
「エージェントツール
定義の漏洩」の項目で
攻撃成功
その他の項目では
守られている


## p.26

25
25
AI GuardでAIへの入口と出口を守る
User
Application Load 
Balancer
Amazon ECS
(Frontend)
Amazon ECS
(Backend)
Amazon RDS
(Database)
Amazon DynamoDB
(Prompts)
On-Prem
Database
Amazon ECS
(AI Service)
Amazon ECS
Connectors
(MCP)
AWS Direct 
Connect
On-Prem
Application
On Premise
AI Guard: 
Input 
AI Guard: 
Output 
ユーザ入力
プロンプトの
引き渡し
プロンプト
DBからデータを
取得して
Full Request
ツール
DBを検索
システム
あなたはアナリストです
Amazon Bedrock


## p.27

26
デモ：AI Guardのダッシュボード画面
稼働中のAIアプリケーション全てでの
ポリシー違反件数と違反ポリシーごとの
件数が確認可能


## p.28

27
デモ：AI Guardのダッシュボード画面
AIアプリケーション単位で検知
ログを確認可能


## p.29

28
デモ：AI Guardのダッシュボード画面


## p.30

29
29
デモ内容の振り返り
User
Prompt
User
Response
AI Guard
AI Guard
Input 
Guardrails
許可 / 
ブロック
150–400 ms
AI Guard
AI Guard
Output 
Guardrails
許可 / 
ブロック
150–400 ms
AWS Strands
SDK
Amazon Bedrock
Claude Haiku 4.5
2–4 sec
Customer Hosted 
AI Guard
Trend Hosted AI Guard
AWS Cloud
Inference
Agent 
orchestration
Inference


## p.31

30
30
レイヤー
機能
動作タイミング
検出例
Amazon Bedrock 
Guardrails
APIレイヤーでの
高速コンテンツ
フィルタリング
リアルタイム
（ネイティブ）
ポリシー違反、
有害コンテンツ
TrendAI AI 
Scanner
デプロイ前の
脆弱性評価
デプロイ前
設定ミスのリスク、
依存関係のCVE、
既知の攻撃
TrendAI AI 
Guard
巧妙な攻撃を見抜く
リアルタイム検知
(インテリジェント検知)
入力・出力の
検査
巧妙なプロンプトイ
ンジェクション、
個人情報の漏洩
Amazon Bedrock + AI Guardが必要な理由
「AmazonBedrockにもガードレールがあるのに、なぜAI Guard？」
役割が違うから。だから"併用"する。
AWS＝基盤
＋
TrendAI＝巧妙な攻撃の検知＆監査


## p.32

31
31
AI Guard logs: "Rule FI-005Y.001 detected PII (credit card, chars 47-62); 
Context: Sales Team; Confidence: 99.2%"
Amazon Bedrock logs: "Content blocked"
参考：検知ログ出力で見る併用が必要な理由
「ブロックした」のみログに記録
証跡も含めログに記録


## p.33

32
TrendAI Vision One
で実現する
AI環境全体の保護


## p.34

33


## p.35

34
Data Security
File Security
Container 
Security Endpoint 
Security Code 
Security 
AIの4層をカバーする
AIデータ
•
RAG, Embedding
•
ユーザー&セッションメモリー
•
訓練＆教師データ
1
L1
Amazon Bedrock 
Knowledge Bases
Amazon Bedrock 
AgentCore 
Memory
Amazon S3
AI Application 
Security
AIアプリケーション
•
エージェント
•
LLM
•
MCP, Tools
2
Amazon Bedrock 
Model, Agent
Amazon Bedrock 
AgentCore 
Runtime, 
Gateway
Self-hosted 
container
Agent
LLM
MCP
AIワークロード
•
Kubernetes
•
コンテナイメージ
•
ソースコード
3
AWSマネージド
Amazon EKS
Amazon EC2
Cloud Risk 
Management
CDR/AI-DR
Cloud IPS
AIインフラ
•
IAMアイデンティティ
•
ネットワーク, API
•
暗号化・シークレット
4
Amazon IAM
Amazon VPC
AWS Secrets 
Manager


## p.36

35
TrendAI Vision One
プラットフォームに
より、すべての情報を一か所に集約すること
ができ、サイバーセキュリティチームが、
異なるIT組織間の壁を越えることなく、
あらゆるオフェンスやイベントに横断的に
対処できるようになりました。
•
- Samer Mansour 
Vice President, CISO, Panasonic North America


## p.37

36
36
リスクが高いと感じるところから始める保護
AIセキュリティで今すぐ
対処すべき課題は何ですか？


## p.38

37
37
リスクが高いと感じるところから始める保護
AIセキュリティで今すぐ対処すべき課題は何ですか？
AI Guard
AI Guard
①稼働中のAIアプリを
保護したい
まずは今あるAIアプリの保護からスタート


## p.39

38
38
リスクが高いと感じるところから始める保護
AI Guard
AI Scanner
②本番リリース前に脆弱性を
チェックしたい
これからリリースする予定のAIアプリの脆弱性を把握
AIセキュリティで今すぐ対処すべき課題は何ですか？


## p.40

39
39
リスクが高いと感じるところから始める保護
AI Guard
Cloud Risk Management
③AIインフラ全体を
保護したい
個々のアプリだけでなくAIにかかわる資産全体の保護
AIセキュリティで今すぐ対処すべき課題は何ですか？


## p.41

40
40
リスクが高いと感じるところから始める保護
AIセキュリティで今すぐ対処すべき課題は何ですか？
稼働中のAIアプリを
保護したい
まずは今あるAIアプリの
保護からスタート
本番リリース前に
脆弱性をチェックしたい
これからリリースする予定
のAIアプリの脆弱性を把握
AIインフラ全体を
保護したい
Cloud Risk 
Management
個々のアプリだけでなく
AIにかかわる資産全体の保護
AI Scanner
AI Guard
今ある直近のリスクから始め、全体へ保護を広げていく
1
2
3


## p.42

41
41
Get Started Today
Deploy AI Application Security in Minutes
Demo from github
ブース番号:P019
Platinum Sponsor
Partner Solution Expo エリア
セッションアンケート


## p.43

本セッションのアンケートへ
ご協力をお願いします
Please give us your feedback
Thank you!
PRT220-S
