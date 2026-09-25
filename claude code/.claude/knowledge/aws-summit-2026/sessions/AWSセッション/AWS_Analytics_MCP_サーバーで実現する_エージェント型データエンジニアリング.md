---
title: "AWS Analytics MCP サーバーで実現する エージェント型データエンジニアリング"
category: "AWSセッション"
session_id: "ANT310"
pages: 55
topics: ["データ分析/基盤", "生成AI/エージェント"]
services: ["AWS Glue", "AgentCore", "Amazon Athena", "Amazon Bedrock", "Amazon EC2", "Amazon OpenSearch", "Amazon Q", "Amazon Redshift", "Amazon S3", "Amazon SageMaker", "Claude", "Kiro", "MCP"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/AWSセッション/AWS Analytics MCP サーバーで実現する エージェント型データエンジニアリング.pdf"
---
# AWS Analytics MCP サーバーで実現する エージェント型データエンジニアリング


## p.1

ANT310
AWS Analytics MCP サーバーで実現する
エージェント型データエンジニアリング
秋山怜穏
アマゾンウェブサービスジャパン合同会社


## p.2

自己紹介
秋山怜穏/ Reon Akiyama
アマゾンウェブサービスジャパン
ソリューションアーキテクト
- 公益・教育業界のお客様の技術支援を担当する
ソリューションアーキテクト
- 好きなAWSサービス
- Amazon Redshift


## p.3

対象者
•
データパイプラインの構築・運用に携わり、AIエージェント
による効率化に関心がある方
ゴール
•
AWS Analytics MCPサーバーを活用したエージェント型データ
エンジニアリングの仕組みと始め方を理解する
本セッションの対象者とゴール


## p.4

•
従来のデータエンジニアリングと課題
•
エージェント型データエンジニアリング
•
AWS が提供するAnalytics MCP サーバー
•
Kiro を用いたデータエンジニアリングのデモ
•
MCP サーバーを扱う際のベストプラクティス
•
Analytics MCP サーバーの導入パターン
•
まとめ
アジェンダ


## p.5

従来のデータエンジニアリングと課題


## p.6

データエンジニアリングの目指す形
収集
蓄積
処理
洞察
データ分析パイプライン
データ基盤
拡大するユースケース
生成AI
Customer 360
データメッシュ
適切なタイミングで意思決定者にインサイトを届け
データドリブンな意思決定を実現する


## p.7

データエンジニアリングの理想と実態
ビジネス側の要望
新しい分析を
すぐに始めたい
ビジネス側の要望
在庫をリアルタイムに
把握したい
ビジネス側の要望
定例レポートを
自動化したい
ビジネスのスピードにデータエンジニアリングが追いつけていない
パイプライン構築に
2〜3週間かかる⋯
データは3〜5日遅れて
更新される⋯
手動で更新のまま⋯


## p.8

コンテキスト
スイッチング
割り込み対応で開発の
集中が途切れる
リソースの
管理
クラスターやジョブの
設定・管理を個別に行う
トラブル
シューティング
エラーの原因特定と修正を
手動で繰り返す
APIやサービスの
仕様調査
ベストプラクティスの
調査に時間を費やす
生産性が低下する要因
データエンジニアの時間が、本来注力すべき開発以外に奪われている


## p.9

エージェント型データエンジニアリング


## p.10

エージェント型データエンジニアリングとは
従来型データエンジニアリング
エージェント型データエンジニアリング
データの探索や調査、ジョブやクエリ
の作成、出力の検証を自力で実施
データエンジニア
データエンジニア
AIエージェント
データの探索や調査、ジョブやクエリの作成、
出力の検証をAIエージェントに自然言語で指示
自然言語
Python
CLI
SQL
API
web
⋯


## p.11

AIエージェントの基本的なワークフロー
AI
エージェント
クエリ
LLM
プロンプトとツールの説明
タスクの実行で使用するツール
ツール結果
最終応答
応答
必要に応じて
繰り返し
ツール
呼び出し
結果
データ
ソース
ユーザー


## p.12

複数のツールやリソースとの通信は？
データ
ウェアハウス
SQL
データ
レイク
API
データ処理
API
データ
カタログ
API
Web
API
AIエージェント
N 個のエージェント× M 個のツール= N×M 種類の統合方法が必要になる


## p.13

Data Lake
Data Processing
Data Catalog
MCP による複数ツール・リソースとの通信
AIエージェント
AIエージェント
MCP
データ
ウェアハウス
Web
N（エージェント）+ M（ツール）= N+M 種類の標準的な統合で済む
SQL
API
API
= Model Context Protocol


## p.14

MCP のアーキテクチャ
データソース
MCPホスト
AI
エージェント
•
SageMaker Unified Studio
•
Kiro
•
Claude Code
•
Cursor
•
Visual Studio Code
•
Amazon Quickなど
Amazon EMR
Amazon Athena
Amazon S3
Amazon Glue
その他のサービス
Amazon Redshift
MCP
クライアント
MCPサーバー
ツール呼び出し
ツール定義
ツール
ツール
{ 
"name":  "create_crawler", 
"description":  "S3バケット用の
Glueクローラーを作成", 
"inputSchema": { 
"name":  {…} ,
"s3_target":  {…}, 
"schedule":  {…} 
} 
}  
※簡略化して記述


## p.15

AWS が提供するAnalytics MCP サーバー


## p.16

AWS Analytics MCPサーバー（1/2）
分析サービスとの自然言語インタラクション
Amazon EMR
AWS Glue
Amazon Athena
Amazon Redshift
自然言語による指示の例
MCPサーバー
Data Processing MCPサーバー
Redshift MCPサーバー
「S3バケット用のGlueクローラーを作成して」
「EMR環境の最近の障害を分析して」
「売上データを分析してトップ10製品を教えて」
「最適化できるGlueジョブはある？」
「所有するRedshiftクラスターを一覧表示して」
「分析クラスターとマーケティングクラスターの顧客獲
得コストを比較して」
分析サービス


## p.17

AWS Analytics MCPサーバー（2/2）
Amazon DataZone
（SageMaker Catalog）
Amazon MSK
Amazon OpenSearch
DataZone MCPサーバー
「分析プロジェクトを作成して」
「顧客行動データセットを公開して」
「売上データセットを検索して」
MSK MCPサーバー
「3ノードのMSKクラスターを作成して」
「ログ保持期間を20時間に設定して」
「クラスタのCPU使用率、ディスク容量を監視して」
OpenSearch MCPサーバー
「インデックスを一覧表示して」
「利用可能な製品は？」
自然言語による指示の例
MCPサーバー
分析サービス
分析サービスとの自然言語インタラクション


## p.18

Amazon Redshift
Amazon EMR
AWS Glue
Amazon Athena
Amazon S3
Amazon
DataZone
自然言語
クエリ
DataZone MCP Server
Data Processing MCP 
Server
Spark History MCP 
Server
Data Processing MCP 
Server
Documentation MCP 
Server
Redshift MCP Server
データガバナンス
データ品質
データ処理
データウェアハウス
リソース管理
ドキュメント
• SageMaker Unified Studio
• Kiro
• Claude Code
• Amazon Quick
• その他
MCPホスト
MCP
クライアント
ユーザー
全体アーキテクチャ
AWS サービス


## p.19

Kiro を用いた
データエンジニアリングのデモ


## p.20

データ探索
E T L ジョブの作成
     
Start
ジョブ実行＆
モニタリング
データカタログ化
データ検証
データウェアハウスへ
ロード
Finish
デモシナリオの全体像
小売顧客データを対象に、S3 上のデータに対するETL パイプラインを構築する


## p.21

データ探索
     
Start
小売顧客行動データと
顧客マスタデータの
所在を特定
Step1. データ探索


## p.22

データ探索
E T L ジョブの作成
     
Start
小売顧客行動データと
顧客マスタデータを
集約して
都道府県ごとの統計を
求めるGlueジョブを作成
Step2. ETLジョブの作成


## p.23

データ探索
E T L ジョブの作成
     
Start
ジョブ実行＆
モニタリング
ジョブを実行し
エラーの修正と
ジョブ実行の監視
を支援
Step3. ジョブ実行& モニタリング


## p.24

データ探索
E T L ジョブの作成
     
Start
ジョブ実行＆
モニタリング
データカタログ化
出力データセット
をカタログ化する
クローラーを作成
して実行。
Step4. データカタログ化


## p.25

データ探索
E T L ジョブの作成
     
Start
ジョブ実行＆
モニタリング
データカタログ化
データ検証
出力を検証する
クエリを実行。
Step5. データ検証


## p.26

データ探索
E T L ジョブの作成
     
Start
ジョブ実行＆
モニタリング
データカタログ化
データ検証
データウェアハウスへ
ロード
このデータをRedshift
にロードする
ノートブックを作成
Step6. データウェアハウスへロード


## p.27

データ探索
E T L ジョブの作成
     
Start
ジョブ実行＆
モニタリング
データカタログ化
データ検証
データウェアハウスへ
ロード
Finish
再掲
デモシナリオの全体像
小売顧客データを対象に、S3 上のデータに対するETL パイプラインを構築する


## p.29

＞あなたはデータエンジニアリングエージェントです。データセットを特定し処理する責任があります。以下の
各ステップの後に停止し、次に進む確認を求めてください。
1. S3バケット内の小売顧客行動データと顧客マスタデータの所在を確認。
2. customer_id列で小売顧客行動データと顧客ディメンションデータを結合し、都道府県ごとにpage_views列
とpurchase_amount列の合計を集約するGlueジョブを作成。データセットをS3バケットの新しいフォルダに
Parquet形式で出力。
3. 上記のジョブを実行。エラーの修正とジョブ実行の監視を支援。
4. 出力データセットをカタログ化するクローラーを作成して実行。
5. 出力を検証するクエリを実行。
6. このデータをAnalytics Redshiftクラスターにロードするノートブックを作成。
使用する入力プロンプト


## p.31

データ探索
Start
Step1. データ探索


## p.33

データ探索
E T L ジョブの作成
Start
Step2. ETLジョブの作成


## p.35

データ探索
E T L ジョブの作成
Start
ジョブ実行＆
モニタリング
Step3. ジョブ実行& モニタリング


## p.37

データ探索
E T L ジョブの作成
Start
ジョブ実行＆
モニタリング
データカタログ化
Step4. データカタログ化


## p.39

データ探索
E T L ジョブの作成
Start
ジョブ実行＆
モニタリング
データカタログ化
データ検証
Step5. データ検証


## p.41

データ探索
E T L ジョブの作成
Start
ジョブ実行＆
モニタリング
データカタログ化
データ検証
データウェアハウスへ
ロード
Finish
Step6. データウェアハウスへロード


## p.42

MCP サーバーを扱う際の
ベストプラクティス


## p.43

A. ツール呼び出しの最適化
タスクに関連するMCPサーバーのみを有効化し、ツール選択の精度を上げる
不要なMCPサーバーを削除
必要に応じて有効/無効を切替
ツールフィルターで絞り込む
OpenSearch MCPサーバーは名前、カテゴリ
、操作タイプによるフィルタリングが可能
KiroではMCPサーバーを右クリックで有効/
無効を切り替えられる
SageMaker Unified Studioでは使わないMCP
サーバーを削除できる


## p.44

B. データ保護
READ ONLYモードを活用し、必要な場合のみ書き込みを許可する
Data Processing MCPサーバー
デフォルト: 読み取り専用
リソースの作成やデータの書き戻しには
--allow write の明示的な設定が必要
Redshift MCPサーバー
読み取り専用のみ
書き込みは許可されていない
データの取得・クエリ用途に特化
MSK MCPサーバー
デフォルト: 書き込み可能
クラスター作成・設定変更がデフォルトで有効
読み取り専用への切替を推奨
OpenSearch MCPサーバー
読み取り専用のみ
書き込みは許可されていない
インデックスのリスト・データクエリ用途に特化


## p.45

C. ツールの許可リスト
ツールごとに自動承認か都度確認かを設定し、許可済みリストは十分に検証してから追加する
Kiro
SageMaker Unified Studio
ツールごとに「毎回確認」「常に許可」を設定可能
mcp.json で自動承認するツールのリストを定義


## p.46

D. ヒューマン・イン・ザ・ループ
エージェントに任せきりにせず、重要な判断は人間が確認する
実行前の確認
書き込み操作やリソース作成
の前に、実行内容を確認する
コードの検証
生成されたコードやクエリ
の内容をレビューする
結果の検証
出力データの正確性を
検証する
ツールの選定、権限の制御、人間による確認を組み合わせて
安全にエージェントを活用する


## p.47

Analytics MCP サーバーの導入パターン


## p.48

自然言語
クエリ
DataZone MCP Server
Data Processing MCP 
Server
Spark History MCP 
Server
Data Processing MCP 
Server
Documentation MCP 
Server
Redshift MCP Server
データガバナンス
データ品質
データ処理
データウェアハウス
リソース管理
ドキュメント
• SageMaker Unified Studio
• Kiro
• Claude Code
• Amazon Quick
• その他
MCPホスト
MCP
クライアント
ユーザー
Amazon Redshift
Amazon EMR
AWS Glue
Amazon Athena
Amazon S3
Amazon
DataZone
AWS サービス
A. 個人で利用する


## p.49

組織にスケールさせるために
mcp.json
設定ファイルの配布ではスケールしない
Amazon Redshift
Amazon EMR
AWS Glue
Amazon Athena
Amazon S3
Amazon
DataZone
AWS サービス


## p.50

B. 組織で利用する
Amazon Bedrock
プロンプト
AgentCore Runtime
AgentCore 
Gateway
AgentCore Memory
AgentCore Identity
AgentCore 
Runtime
AgentCore 
Runtime
その他のMCP Server
AgentCore 
Runtime
Amazon EC2
AWS  Lambda
AgentCore Observability
Amazon Cognito
その他のツール
Data Processing MCP Server
AIエージェント
MCP Server の集約
監視
認証・認可
記憶
LLM
ユーザー
Redshift MCP Server
Amazon Redshift
Amazon EMR
AWS Glue
Amazon Athena
Amazon S3
Amazon
DataZone
AWS サービス


## p.51

まとめ


## p.52

• MCP により、AI エージェントとAWS 分析サービスを標準的な方法で接
続し、自然言語でデータパイプラインの構築・実行・検証ができる
• AWS Analytics MCP サーバーはGlue、EMR、Athena、Redshift 等の主要
サービスに対応し、ベストプラクティスに沿ったコードを生成できる
• MCP サーバーの設定は数分で完了。安全性を確保する仕組みも備わって
おり、個人の環境から今日すぐに始められる
本セッションのまとめ


## p.53

リソース
AWS MCP Servers
AWS data processing 
MCP server blog
Amazon Redshift MCP 
server blog
Amazon Bedrock 
AgentCore
Amazon SageMaker 
Unified Studio Data agent


## p.54

Ask the Speaker
こちらのRoom 後方の外側にございます、
「Ask the Speaker」カウンターまでお越しください
秋山怜穏
アマゾンウェブサービスジャパン合同会社
Room


## p.55

本セッションのアンケートへ
ご協力をお願いします
Please give us your feedback
Thank you!
ANT310
