---
title: "エージェンティック AI のための データ活⽤実践ガイド"
category: "AWSセッション"
session_id: "ANT301"
pages: 50
topics: ["アーキテクチャ/サーバーレス", "データ分析/基盤", "生成AI/エージェント"]
services: ["AWS Glue", "AgentCore", "Amazon Athena", "Amazon Bedrock", "Amazon S3", "Amazon SageMaker", "MCP", "Strands Agents", "Valkey"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/AWSセッション/エージェンティック AI のための データ活⽤実践ガイド.pdf"
---
# エージェンティック AI のための データ活⽤実践ガイド


## p.1

ANT301
エージェンティックAI のための
データ活⽤実践ガイド
⼤薗純平
アマゾンウェブサービスジャパン合同会社


## p.2

⾃⼰紹介
⼤薗 純平
アマゾンウェブサービスジャパン合同会社
シニアアナリティクスソリューションアーキテクト
2
AWS のData & AI 関連サービスを活⽤した
アーキテクティング/ソリューション提案⽀援や、
AWS サービスの開発チームとのコラボレーション
ワークを⾏っている。2017 年より現職 
2


## p.3

想定参加者
• エージェンティックAI アプリケーションに対応するデータ基盤を
検討中のアーキテクトおよびビジネス意思決定者の⽅
お話すること
• 全体像とアーキテクチャの考え⽅およびAWS サービス間の繋がり⽅
お話しないこと
• 個別ユースケースの詳細や各AWS サービスの深堀り
本⽇のセッション
3


## p.4

エージェンティック AI の基礎
従来型アプリケーションからエージェンティックアプリケーションへ
エージェンティックAI のデータガバナンス
エージェンティックAI の統⼀アーキテクチャ
アジェンダ
4


## p.5

エージェンティック AI の基礎
5


## p.6

エージェンティック AI の基礎
REASON
(推論)
ユーザーリクエスト
の理解、アクション
プランの作成、次の
アクションの決定に
L L M を活⽤
6


## p.7

エージェンティック AI の基礎
ACT
(⾏動)
LLM の応答に基づ
きツールを使って
アクションを実⾏し
結果を保存
REASON
(推論)
7
ユーザーリクエスト
の理解、アクション
プランの作成、次の
アクションの決定に
L L M を活⽤


## p.8

エージェンティック AI の基礎
REMEMBER
(記憶)
会話履歴、ツールの
実⾏結果、その他の
関連データをエージ
ェントのメモリに
保存
REASON
(推論)
ACT
(⾏動)
LLM の応答に基づ
きツールを使って
アクションを実⾏し
結果を保存
8
ユーザーリクエスト
の理解、アクション
プランの作成、次の
アクションの決定に
L L M を活⽤


## p.9

ReAct ループ
会話履歴、ツールの
実⾏結果、その他の
関連データをエージ
ェントのメモリに
保存
REASON
(推論)
ACT
(⾏動)
LLM の応答に基づ
きツールを使って
アクションを実⾏し
結果を保存
9
REMEMBER
(記憶)
ユーザーリクエスト
の理解、アクション
プランの作成、次の
アクションの決定に
L L M を活⽤


## p.10

ReAct ループ
REASON
(推論)
ACT
(⾏動)
LLM の応答に基づ
きツールを使って
アクションを実⾏し
結果を保存
⽥中
⾃動⾞保険に
加⼊したい
AI
お客様の
保険⾒積は…
10
REMEMBER
(記憶)
ユーザーリクエスト
の理解、アクション
プランの作成、次の
アクションの決定に
L L M を活⽤
会話履歴、ツールの
実⾏結果、その他の
関連データをエージ
ェントのメモリに
保存


## p.11

ReAct ループで保険⾒積を取得する流れ
1.
⾃動⾞保険に
加⼊したい
11


## p.12

ReAct ループで保険⾒積を取得する流れ
1.
⾃動⾞保険に
加⼊したい
システム
プロンプト
…
状態 ( S T A T E )
エージェント
コンテキスト管理
(メモリ) から状態
と会話履歴を取得
12


## p.13

ReAct ループで保険⾒積を取得する流れ
1.
⾃動⾞保険に
加⼊したい
システム
プロンプト
…
状態 ( S T A T E )
エージェント
コンテキスト管理
(メモリ) から状態
と会話履歴を取得
プロンプトを整形し
LLM に送信し
出⼒を解析(推論)
13


## p.14

ReAct ループで保険⾒積を取得する流れ
1.
⾃動⾞保険に
加⼊したい
システム
プロンプト
…
状態 ( S T A T E )
⾏動( A C T )
ツール呼び出し：
get_driver_details(owner)
エージェント
コンテキスト管理
(メモリ) から状態
と会話履歴を取得
プロンプトを整形し
LLM に送信し
出⼒を解析(推論)
次のアクションを
決定し、ツール呼び
出しまたは応答、
状態を更新
14


## p.15

ReAct ループで保険⾒積を取得する流れ
1.
⾃動⾞保険に
加⼊したい
システム
プロンプト
…
状態 ( S T A T E )
⾏動( A C T )
ツール呼び出し：
get_driver_details(owner)
15


## p.16

ReAct ループで保険⾒積を取得する流れ
1.
⾃動⾞保険に
加⼊したい
システム
プロンプト
…
2.
…
…
ドライバ
ー情報
ツール呼び出し：
get_vehicle_details(owner)
状態 ( S T A T E )
⾏動( A C T )
ツール呼び出し：
get_driver_details(owner)
16


## p.17

ReAct ループで保険⾒積を取得する流れ
1.
⾃動⾞保険に
加⼊したい
システム
プロンプト
…
2.
…
…
ドライバ
ー情報
3.
…
…
…
ツール呼び出し：
calculate_risk(owner, cars)
⾞両
情報
状態 ( S T A T E )
⾏動( A C T )
ツール呼び出し：
get_vehicle_details(owner)
ツール呼び出し：
get_driver_details(owner)
17


## p.18

ReAct ループで保険⾒積を取得する流れ
1.
⾃動⾞保険に
加⼊したい
システム
プロンプト
…
2.
…
…
ドライバ
ー情報
3.
…
…
…
⾞両
情報
4.
…
…
…
ツール呼び出し：
get_quote(owner, cars, risk)
…
リスク
状態 ( S T A T E )
⾏動( A C T )
ツール呼び出し：
calculate_risk(owner, cars)
ツール呼び出し：
get_vehicle_details(owner)
ツール呼び出し：
get_driver_details(owner)
18


## p.19

ReAct ループで保険⾒積を取得する流れ
1.
⾃動⾞保険に
加⼊したい
2.
3.
4.
5.
…
…
…
ユーザーに応答
…
…
⾒積り
状態 ( S T A T E )
⾏動( A C T )
ツール呼び出し：
get_quote(owner, cars, risk)
ツール呼び出し：
calculate_risk(owner, cars)
ツール呼び出し：
get_vehicle_details(owner)
ツール呼び出し：
get_driver_details(owner)
システム
プロンプト
…
…
…
ドライバ
ー情報
…
…
…
⾞両
情報
…
…
…
…
リスク
19


## p.20

ReAct ループで保険⾒積を取得する流れ
1.
⾃動⾞保険に
加⼊したい
2.
3.
4.
5.
6.
…
…
…
応答
…
…
…
お客様の⾃動⾞
保険の⾒積は…
ユーザー⼊⼒を待機
状態 ( S T A T E )
⾏動( A C T )
…
…
…
ユーザーに応答
…
…
⾒積り
ツール呼び出し：
get_quote(owner, cars, risk)
ツール呼び出し：
calculate_risk(owner, cars)
ツール呼び出し：
get_vehicle_details(owner)
ツール呼び出し：
get_driver_details(owner)
システム
プロンプト
…
…
…
ドライバ
ー情報
…
…
…
⾞両
情報
…
…
…
…
リスク
20


## p.21

免責⾦額を
10万円に変更して
ReAct ループで保険⾒積を取得する流れ
1.
⾃動⾞保険に
加⼊したい
システム
プロンプト
…
状態 ( S T A T E )
⾏動( A C T )
6.
…
…
…
応答
…
…
…
お客様の⾃動⾞
保険の⾒積は…
…
ユーザー⼊⼒を待機
7.
…
…
…
…
…
…
…
コンテキストウィンドウ上限
に到達、コンテキストを圧縮
…
…
…
…
…
ツール呼び出し︓
update_quote(id, params)
…
圧縮済み
メッセージ
圧縮
ツール呼び出し：
get_driver_details(owner)
21


## p.22

メモリの構成要素
短期メモリ
⻑期メモリ
現在のタスクまたはセッション(スレッド)
現在のユーザーまたはアプリ全体の永続データ
22


## p.23

エージェント
の状態
アクションプラン
ループ間共有データ
スクラッチパッド
メッセージ
会話履歴
連続した
メッセージ
通常はエージェンティック
フレームワーク依存の
バックエンドデータストア
開発者の制御がおよびにくい
メモリの構成要素
短期メモリ
⻑期メモリ
現在のタスクまたはセッション(スレッド)
現在のユーザーまたはアプリ全体の永続データ
23


## p.24

エージェント
の状態
アクションプラン
ループ間共有データ
スクラッチパッド
メッセージ
会話履歴
連続した
メッセージ
通常はエージェンティック
フレームワーク依存の
バックエンドデータストア
開発者の制御がおよびにくい
メモリの構成要素
短期メモリ
⻑期メモリ
現在のタスクまたはセッション(スレッド)
現在のユーザーまたはアプリ全体の永続データ
セマンティック
要求タスクに関連
するセマンティッ
クコンテキスト
エピソード
過去のやり取り
と結果
(強化学習)
プロファイル
ユーザーの
プロファイルと
関連データ
通常はベクトルデータストアや
エンタープライズデータベースから
ツールを使って取得
データへのアクセス性と品質が重要
24


## p.25

プロンプト
システムプロン
プト、指⽰
バージョン管理された
アプリコード、
ファイル、KV ストア
プロンプトチューニング
メモリの構成要素
短期メモリ
⻑期メモリ
現在のタスクまたはセッション(スレッド)
現在のユーザーまたはアプリ全体の永続データ
エージェント
の状態
アクションプラン
ループ間共有データ
スクラッチパッド
メッセージ
会話履歴
連続した
メッセージ
通常はエージェンティック
フレームワーク依存の
バックエンドデータストア
開発者の制御がおよびにくい
セマンティック
要求タスクに関連
するセマンティッ
クコンテキスト
エピソード
過去のやり取り
と結果
(強化学習)
プロファイル
ユーザーの
プロファイルと
関連データ
通常はベクトルデータストアや
エンタープライズデータベースから
ツールを使って取得
データへのアクセス性と品質が重要
25


## p.26

エージェント
エージェント
Model Context Protocol (MCP)
エージェントとデータソース間のやり取りを標準化
エージェント
MCP クライアント
MCP サーバー
DB ドライバー
顧客
AnyCompany
 Insurance
AI エージェント
⾞両データ 
MCP サーバーツール︓
get_owner_vehicles(ssn)
get_vehicle_by_vin(vin)
get_vehicle_telemetry(vin)
...
⾞両
データベース
（リレーショナル
または NoSQL）
26


## p.27

従来型アプリケーションから
エージェンティックアプリケーションへ 
― ツールの背後にあるデータ
27


## p.28

アプリケーションの対象ユーザーは︖
AnyCompany
 Insurance
アプリケーション
対象ユーザー
28


## p.29

アプリケーションの対象ユーザーは︖
AnyCompany
 Insurance
アプリケーション
対象ユーザー
外部顧客／
エンドユーザー
⽥中︓ 
⾃動⾞保険に加⼊したい顧客
29


## p.30

アプリケーションの対象ユーザーは︖
AnyCompany
 Insurance
アプリケーション
対象ユーザー
外部顧客／
エンドユーザー
社内顧客／
社内ユーザー
⽥中︓ 
⾃動⾞保険に加⼊したい顧客
佐藤︓
請求内容の正確性を検証したい保険⾦請求調査員
30


## p.31

アプリケーションの対象ユーザーは︖
AnyCompany
 Insurance
アプリケーション
対象ユーザー
外部顧客／
エンドユーザー
社内顧客／
社内ユーザー
佐藤︓
請求内容の正確性を検証したい保険⾦請求調査員
鈴⽊︓
新しいデータプロダクトを構築したいデータエンジニア
⽥中︓ 
⾃動⾞保険に加⼊したい顧客
31


## p.32

従来型アプリ体験
⽥中
ウェブサイト
API
データストア
エンドユーザー体験
32


## p.33

エンドユーザー体験
従来型アプリ体験
⽥中
ウェブサイト
API
データストア
エージェンティック A I アプリ体験
⽥中
AI アシスタント
セマンティック API
（ベクトル、ANN）
参照
データ
API
データストア
MCP 経由のツール
33


## p.34

従来型アプリ体験
⽥中
ウェブサイト
API
データストア
エージェンティック A I アプリ体験
⽥中
AI アシスタント
セマンティック API
（ベクトル、ANN）
API
データストア
MCP 経由のツール
同じバックエンド
システム
エンドユーザー体験
参照
データ
34


## p.35

エージェンティック AI のデータガバナンス
35


## p.36

佐藤
港区での
衝突事故の⾼額
な保険⾦請求を
表⽰して
Amazon SageMaker
(ビジネスカタログ)
Data products:
- 保険⾦請求
- 保険契約
-  …
AWS Glue
(テクニカルカタログ)
Tables:
-  claims
-  policies
-  …
タスク︓
データプロダクトの検索
1
2
ツール呼び出し
調査員
…
= ユーザーロール
調査員
調査員
調査員
AWS Lake Formation
(security)
Claim adjuster (role):
-  テーブル: claims, policies …
-  ⾏フィルタ: Area=港区
-  列フィルタ: injuries
- 監査︓7年間の全クエリ
調査員ロール
コンテキスト
メモリ
Amazon Athena
(クエリエンジン)
ツール呼び出し
タスク︓
レポート作成
Amazon S3
(S3 tables)
レポート
調査員
タスク︓
データ取得
コンテキスト
3
36
エージェンティック AI データ利⽤者の体験


## p.37

エージェンティック AI データ利⽤者の優先事項
データプロダクトにおける信頼性、セキュリティ、パフォーマンス
1
データ品質︓SageMaker Catalog でデータ品質とリネージを確認
2
データの発⾒性︓SageMaker Catalog のメタデータとビジネス⽤語集でデータを検索
3
データへのアクセス︓Trusted Identity Propagation でユーザー ID ベースのアクセスポリシーを定義
4
低レイテンシーデータアクセス︓Glue Materialized Views でアクセスパターンに基づきデータを事前計算
5
セキュリティ︓Lake Formation のきめ細かいアクセス制御で機密データを除外
37


## p.38

Amazon MSK
(ストリーミング)
⾞両
テレマティクス
…
＝ ユーザーロール
タスク︓ストリーミング取
り込みの設定(トピック)
データエンジニア
データエンジニア
ツール呼び出し
コンテキスト
AWS Glue
(Spark ジョブ)
ツール呼び出し
データエンジニア
メモリ
メモリ
AWS Glue Data 
Quality - DQDL
AWS Glue
Data Catalog
ETL
ジョブ
Amazon S3
(S3 tables)
コンテキスト
Amazon SageMaker
(ビジネスカタログ)
ツール呼び出し
メモリ
タスク︓トピックコンシュ
ーマーパイプラインの構築
コンテキスト
タスク︓データプロダクトを
マーケットプレイスに公開
AWS Lake Formation
(ガバナンス)
1
データエンジニア
2
3
鈴⽊
運転データから
速度違反のデータ
セットを取得する
IaC のデプロイコ
ードを作成して…
データエンジニア
38
エージェンティック AI データ⽣産者の体験


## p.39

データの管理と正確性
1
正確性︓SageMaker Data Agents でパイプライン構築を⽀援、最終検証は⼈が実施
2
データ品質︓Glue Data Quality でパイプラインにデータ品質ルールを組み込む
3
データに意味を与える︓SageMaker Catalog でカラムレベルのメタデータやタグを追加
4
監査︓利⽤状況を追跡・監視し、意図した使われ⽅となっているかを検証
39
エージェンティック AI データ⽣産者の優先事項


## p.40

エージェンティックAI の統⼀アーキテクチャ
40


## p.41

外部
ユーザー
質問
•
Amazon Bedrock AgentCore - セキュリティ、
メモリ、API へのゲートウェイ、エージェンテ
ィックソリューションの柔軟なランタイム
•
現在の要件をサポートし、将来の柔軟性を確保
Strands Agents, LangGraph,.. 
エージェントロジック
Memory Runtime
Gateway Identity
41
Amazon Bedrock
AgentCore


## p.42

外部
ユーザー
エージェントロジック
Amazon Bedrock
AgentCore
社内
ユーザー
質問
質問
•
Amazon Bedrock AgentCore が社内の質問、
データ、スケーリング、現在と将来の柔軟性
をサポート
Strands Agents, LangGraph,.. 
エージェントロジック
Memory Runtime
Gateway Identity
42
Amazon Bedrock
AgentCore


## p.43

Strands Agents, LangGraph,.. 
エージェントロジック
Amazon Bedrock
AgentCore
外部
ユーザー
エージェントロジック
Amazon Bedrock
AgentCore
Amazon
 Bedrock
LLM
推論
推論
質問
質問
•
Amazon Bedrock により、新しいバージョンや 
LLM が登場しても、ニーズに最適な LLM を柔軟に
選択可能
Memory Runtime
Gateway Identity
43
社内
ユーザー


## p.44

Strands Agents, LangGraph,.. 
エージェントロジック
外部
ユーザー
エージェントロジック
Amazon Bedrock
AgentCore
Amazon
 Bedrock
LLM
Amazon Bedrock
ナレッジベース
Aurora PostgreSQL, 
OpenSearch Service, 
ElastiCache Valkey, 
…
Amazon Bedrock 
Managed 
Knowledge Base
推論
推論
RAG
RAG
質問
質問
データ
AI エージェント
•
ナレッジベースを活⽤して RAG をサポートし、
ユーザー体験を向上
Memory Runtime
Gateway Identity
44
社内
ユーザー
Amazon Bedrock
AgentCore


## p.45

Strands Agents, LangGraph,.. 
エージェントロジック
外部
ユーザー
エージェントロジック
Amazon Bedrock
AgentCore
Amazon
 Bedrock
LLM
Aurora PostgreSQL, 
OpenSearch Service, 
ElastiCache Valkey, 
…
推論
推論
RAG
RAG
質問
質問
データ
AI エージェント
Memory Runtime
Gateway Identity
MCP
サーバー
MCP
サーバー
ツール
呼び出し
•
MCP ツールとサービスを追加する
ことで、運⽤系・分析系などの多様
なデータソースを、新しいエージェ
ンティック AI エコシステムに簡単
につなぎ込めるようになる
•
これらのMCP コネクタがデータを
エージェントに届けることで、⾃然
⾔語をデータソース固有のクエリや
プロトコルに変換し、回答を返すこ
とが可能になる
ツール
呼び出し
45
RAG 
(ツール経由)
RAG 
(ツール経由)
Amazon Bedrock
ナレッジベース
Amazon Bedrock
AgentCore
社内
ユーザー
Amazon Bedrock 
Managed 
Knowledge Base


## p.46

Strands Agents, LangGraph,.. 
エージェントロジック
外部
ユーザー
エージェントロジック
Amazon Bedrock
AgentCore
Amazon
 Bedrock
LLM
Aurora PostgreSQL, 
OpenSearch Service, 
ElastiCache Valkey, 
…
推論
推論
RAG
RAG
質問
質問
データ
AI エージェント
Memory Runtime
Gateway Identity
MCP
サーバー
MCP
サーバー
ツール
呼び出し
ツール
呼び出し
RAG 
(ツール経由)
RAG 
(ツール経由)
APIs
DB
エンジン
Aurora,
DynamoDB,
ElastiCache
…
外部サービス API
データ取得
または変更
データ取得
または変更
Redshift,
Athena
…
分析
エンジン
APIs
46
Amazon Bedrock
AgentCore
社内
ユーザー
Amazon Bedrock
ナレッジベース
データ
(API または
定型クエリ
経由)
Amazon Bedrock 
Managed 
Knowledge Base


## p.47

Strands Agents, LangGraph,.. 
エージェントロジック
外部
ユーザー
エージェントロジック
Amazon Bedrock
AgentCore
Amazon
 Bedrock
LLM
Aurora PostgreSQL, 
OpenSearch Service, 
ElastiCache Valkey, 
…
推論
推論
RAG
RAG
質問
質問
データ
AI エージェント
Memory Runtime
Gateway Identity
MCP
サーバー
MCP
サーバー
ツール
呼び出し
ツール
呼び出し
RAG 
(ツール経由)
RAG 
(ツール経由)
APIs
DB
エンジン
Aurora,
DynamoDB,
ElastiCache
…
外部サービス API
データ取得
または変更
データ取得
または変更
Redshift,
Athena
…
APIs
データ
(API または
定型クエリ
経由)
データ処理
Catalogs,
FGAC,
S3 
Lakehouse
Kinesis,
MSK (Kafka)
Streaming 
data
Glue,
Spark,
Flink
ETL
データおよび制御アクション
47
Amazon Bedrock
AgentCore
Amazon Bedrock
ナレッジベース
社内
ユーザー
分析
エンジン
Amazon Bedrock 
Managed 
Knowledge Base


## p.48

Call to action
データを 
API でカプセル化
MCP で API と
エージェントを接続
データガバナンスと
エンドツーエンドの
セキュリティを
最優先に
AWS サービスを
活⽤して
運⽤をシンプルに
48


## p.49

Ask the Speaker
こちらのRoom 後⽅の外側にございます、
「Ask the Speaker」カウンターまでお越しください
⼤薗純平
アマゾンウェブサービスジャパン合同会社
Room


## p.50

本セッションのアンケートへ
ご協⼒をお願いします
Please give us your feedback
Thank you!
ANT301
