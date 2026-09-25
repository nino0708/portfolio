---
title: "既存 DB の限界を突破、秒間 10 億件を処理し、 AI と共創するデータ基盤の新標準"
category: "パートナーセッション"
sponsor: "ClickHouse"
session_id: "PRT212"
pages: 30
topics: ["データ分析/基盤"]
services: ["Amazon Aurora", "Amazon EC2", "Amazon EKS", "Amazon Kinesis", "Amazon RDS", "Amazon S3", "Claude", "MCP"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/パートナーセッション/既存 DB の限界を突破、秒間 10 億件を処理し、 AI と共創するデータ基盤の新標準 (sponsored by ClickHouse).pdf"
---
# 既存 DB の限界を突破、秒間 10 億件を処理し、 AI と共創するデータ基盤の新標準


## p.1

PRT212-S
既存DB の限界を突破、秒間10 億件を処理し、
AI と共創するデータ基盤の新標準
(sponsored by ClickHouse)
北迫清訓
ClickHouse株式会社
最高技術責任者兼技術統括本部長


## p.2

©2026 CLICKHOUSE INC., CONFIDENTIAL & PROPRIETARY
既存DBの限界を突破
秒間10億件を処理し
AIと共創するデータ基盤の新標準
2026.06.25
ClickHouse株式会社
北迫 清訓
The Leading Database for AI


## p.3

©2026 CLICKHOUSE INC., CONFIDENTIAL & PROPRIETARY
2
自己紹介
北迫  清訓
(きたさこ きよのり)
外資系ITコンサルを経て、2012年よりパブリッククラウドベンダーにて日本における
クラウドの立ち上げを初期メンバーとして牽引。
デジタル領域のクラウド普及や音声AIサービスの立ち上げ、戦略的企業のDX支援を
歴任した後、現在はClickHouseの技術統括として、AI時代に求められる次世代デー
タ基盤の普及とデータ戦略の高度化を推進。


## p.4

©2026 CLICKHOUSE INC., CONFIDENTIAL & PROPRIETARY
©2026 CLICKHOUSE INC., CONFIDENTIAL & PROPRIETARY
3
AI Era
データベースが遅ければ
AIは止まる
●
AIエージェントは１つの問いに答えるために、数十から数百のクエリ
を並列で発行する。
●
その全てにミリ秒で応答できなければ、どれだけ優れたモデルを利
用していてもワークフローは止まる。


## p.5

©2026 CLICKHOUSE INC., CONFIDENTIAL & PROPRIETARY
©2026 CLICKHOUSE INC., CONFIDENTIAL & PROPRIETARY
4
データプラットフォーム市場を塗り替える3つのシフト
AIによるデータプラットフォームニーズの変化
アプリのエージェント化
分析インターフェースの会話化
オブザーバビリティのAI駆動化
●AIエージェントが内部で数十〜数百のクエリを並列実行 
→ アクセスパターンが動的・予測不能に
　静的に最適化された専用DBでは対応できない
●Text-to-SQLにより、1つの問いが数十のクエリを生成 
→ 「誰が・いつ・どのデータに」が予測不能に
　事前設計の前提が崩れる
●AIが能動的に異常を検知・収集・要約するAI SREへ 
→ AIが自律的にデータを探索する
　静的ダッシュボードを前提とした基盤では機能しない


## p.6

©2026 CLICKHOUSE INC., CONFIDENTIAL & PROPRIETARY
5
©2026 CLICKHOUSE INC., CONFIDENTIAL & PROPRIETARY
データドリブンから ワークフロードリブンへ
ワークフロードリブン
USER
AGENT
USER
AGENT
USER
AGENT
クエリ
数千件 / 日
パターン
検索的・並列
レスポンス
ミリ秒
エージェント
アプリケーション
全従業員
AI SRE
データドリブン
USER
USER
USER
USER
USER
USER
クエリ
数十件 / 日
パターン
計画的・逐次的
レスポンス
数秒
アプリケーション
データアナリスト
SRE
AIエージェントがワークフロー主体になることで、データプラットフォームの要求が変化
MCP
MCP
サイロ化かつ個別最適化
RDB
DWH
Observability


## p.7

©2026 CLICKHOUSE INC., CONFIDENTIAL & PROPRIETARY
©2026 CLICKHOUSE INC., CONFIDENTIAL & PROPRIETARY
6
MongoDB / DynamoDB など
●高速Key Valueアクセスに最適
●データ量のスケーラビリティにも対応
⚠ 複雑な集計クエリが不得意。用途
に応じた専用DB。
既存のDBの３つのカテゴリ
なぜ従来のデータ基盤がAI時代に追いつかないのか
リレーショナルDB
データウェアハウス
NoSQL
MySQL / PostgreSQL / Oracle など
●トランザクション処理に最適
●アプリケーション開発など汎用的に
利用可能なデータベース
⚠ データ量が増えるとクエリが急激に
低下。
BigQuery / Snowflake / Databricks など
●大規模データのバッチ分析
●定期レポートや大規模集計に強い
⚠ 準リアルタイムがベース。大規模同
時アクセスは不得意。
スピード、スケール、コスト、この３つを同時に満たすDBが存在しなかった


## p.8

©2026 CLICKHOUSE INC., CONFIDENTIAL & PROPRIETARY
7


## p.9

©2026 CLICKHOUSE INC., CONFIDENTIAL & PROPRIETARY
8
ClickHouse
2009
プロトタイプ
2016
オープン
ソース
2021
ClickHouse 
Inc.
2022
ClickHouse
Cloud
2024
AWS Tokyo 
Regionオープン
2025
GCP Tokyo 
Regionオープン
Tesla
わずか4年で4,000社以上の企業が利用
世界で最も人気のある分析データベース


## p.10

©2026 CLICKHOUSE INC., CONFIDENTIAL & PROPRIETARY
9
©2026 CLICKHOUSE INC., CONFIDENTIAL & PROPRIETARY
   The Leading  Database for 
AI
ClickHouse オープンソース の
カラム型 OLAP データベース です。 
膨大なデータをSQL で 超高速 に
分析できるように設計されています。
圧倒的な データ圧縮率 と
最適化されたクエリエンジンで
大幅なコスト削減 を実現します。
簡単にスケール可能
負荷に応じてダイナミックにスケール
同時処理数
高QPSによる高速同時処理
データの高圧縮
数十倍のストレージ容量の削減
ミリ秒での処理
ペタバイト規模でもmsでクエリ


## p.11

©2026 CLICKHOUSE INC., CONFIDENTIAL & PROPRIETARY
10
なぜClickHouse は速いのか
ˮ データを読まないことが最速 ˮ  ストレージレイヤーの哲学
MergeTree
Parts
Parts
Parts
Cache
  SQL
Cache
  SQL
Cache
  SQL
INSERT
SELECT
S3互換 共有オブジェクトストレージ
分離されたコンテナコンピュート
※ClickHouse Cloudのアーキテクチャ
カラム型ストレージ
列単位でデータを保持することで、超効率的なデータ圧縮を実現
クエリに必要な列だけの読み込みにより劇的なI/O削減
オブジェクトストレージ利用による圧倒的なコストメリット
事前集計するMergeTreeエンジン
小さいファイル単位Partsでの並列書き込み
クエリ用の参照ファイルの分離と結合による最適化
ファイル結合時の事前ソートと集計によるスキャン量の最小化
スキップインデックス
不要なデータブロックを読み飛ばし、必要最低限のI/Oでクエリ
Multi-Core 
CPU
Multi-Core 
CPU
Multi-Core 
CPU


## p.12

©2026 CLICKHOUSE INC., CONFIDENTIAL & PROPRIETARY
11
なぜClickHouse は速いのか
CPUコアをフル活用する並列処理
MergeTree
Parts
Parts
Parts
Cache
  SQL
Cache
  SQL
Cache
  SQL
INSERT
SELECT
S3互換 共有オブジェクトストレージ
分離されたコンテナコンピュート
※ClickHouse Cloudのアーキテクチャ
マルチスレッド x 分散並列スキャン
クエリをCPUコアに分散し、全コアが同時にデータを処理
共通オブジェクトストレージによる、全ノードが並列で同一データを参照
SIMD ベクトル化クエリとJITコンパイル
１クロックで複数のデータを同時処理することでCPUを最大限に活用
CPU専用のネイティブコードへのコンパイルによる処理の高速化
オートスケール
クエリの負荷に応じて、ノードを秒単位で動的に追加・削除
共有ストレージによりノード追加がリニアにスループットをスケール
アイドル時はコンピュートをゼロに停止も可能
Multi-Core 
CPU
Multi-Core 
CPU
Multi-Core 
CPU


## p.13

©2026 CLICKHOUSE INC., CONFIDENTIAL & PROPRIETARY
12
顧客が実証した「速さ」
スピード、スケール、コストを凌駕するデータベース
４万以上のマイクロサービスから生
成されるあらゆるログを集計
5PB / 日
1,250万 / 秒
データインジェスト
500〜1,000 QPSを
ミリ秒で処理
クエリの最適化で
処理性能が4.3倍
Druidから移行した
イベントデータ基盤
10億件+ / 分
イベントインジェスト
30倍のデータ圧縮
90%のコスト削減
オブザーバビリティおよびモ
デル開発時の分析基盤
PB / 日
データインジェスト
Claude 4
の開発に利用
Claudeが
ClickHouseを選択
ANTHROPIC


## p.14

©2026 CLICKHOUSE INC., CONFIDENTIAL & PROPRIETARY
©2025 CLICKHOUSE INC., CONFIDENTIAL & PROPRIETARY
13
ClickHouse の提供モデルとプライシングプラン
ClickHouse
Cloud
BYOC
Bring Your Own Cloud)
OSS
フルマネージド DBaaS
●AWSおよび主要CSPに対応
●Tokyo Region稼働中
●自動スケーリング
●AWS Marketplace経由で購入可能
ハーフマネージド DBaaS
●ユーザのAWS環境で稼働
●ClickHouseが運用管理
●VPC内に完全分離
●データ主権・コンプライアンス対応
オープンソース
●Apache 2.0
●EC2 / EKS / オンプレどこでも動作
●手動クラスター管理
●コミュニティサポート
コンピュート時間課金 + ストレージ容量による従量課金モデル
Development
$0.2818 / hr 〜
開発・テスト用途
シングルレプリカ
Scale
$0.3856 / hr 〜
本番・高可用性環境
24365サポート
Enterprise
$0.5043 / hr 〜
ミッションクリティカル
TAM + 最優先サポート
AWS Marketplace
請求を統合
EDP消費対象


## p.15

©2026 CLICKHOUSE INC., CONFIDENTIAL & PROPRIETARY
14
AWS Cloud
Virtual private cloud (VPC)
Availa1
Query Engine Container Nodes
Data Storage
ClickHouse on AWS
AWS上でフルマネージドで動くClickHouse Cloud
Control Plane
Proxy / Load Balancer
Cloud Console
Service
Management
Monitoring
Backup / 
Restore
etc..
AZ1
AZ2
AZ3
Virtual private cloud 
(VPC)
お客様環境 VPC
ClickPipes Managed Ingest Service)
Application Frontend
RDB
Realtime Data Ingest Source
AWS PrivateLink
VPC
VPC
東京リージョンサポート
Amazon Kinesis
Amazon MSK
Amazon EC2
Amazon EKS
Amazon RDS
Amazon S3
Amazon S3


## p.16

©2026 CLICKHOUSE INC., CONFIDENTIAL & PROPRIETARY
15
次世代データスタック


## p.17

©2026 CLICKHOUSE INC., CONFIDENTIAL & PROPRIETARY
16
Agentic Data Stack
ClickHouseが実現する次世代データスタック
     ClickHouse
Postgres
Langfuse
LLMオブザーバビリティ
ClickPipes
ユーザー
ClickHouse Agent
Agentic AI 分析
ClickStack
オブザーバビリティ
API
アプリ
UI
その他ソース
データレイク
オープンテーブル
フォーマット
外部ソースを
直接参照
CDC
リアルタイム
同期
DB
高速分析処理
外部データ取り込み
基幹データ・トランザクション
データ
連携
LLM
直接連携
AI / LLM


## p.18

©2026 CLICKHOUSE INC., CONFIDENTIAL & PROPRIETARY
17
ClickPipes
マネージドデータ統合パイプライン
Amazon MSK Kafka Confluent DigitalOcean
Redpanda WarpStream
Amazon S3
DigitalOcean
R2
Amazon RDS
PostgreSQL
MySQL
MariaDB
Supabase
STREAMING
OBJECT STORAGE
CDC Change Data Capture)
マネージドデータインジェストサービス
●UIで簡単に設定でき、継続的なデータの取り込みが可能
●データ量に応じてリニアにスケール
●ストリーミングインジェスト、オブジェクトストレージ、RDBとのChange Data 
Captureに対応
Amazon Kinesis
Amazon Aurora


## p.19

©2026 CLICKHOUSE INC., CONFIDENTIAL & PROPRIETARY
18
Managed Postgres by ClickHouse
次世代ハイブリッドデータベース
マネージドPostgreSQLサービス
●
UIからのインスタンスのサイズを指定し簡単起動
●
冗長構成、リードレプリカ、自動バックアップ、バージョンアップなどす
べてマネージドで提供
●
NVMeストレージを利用しており、高い同時実行性のもと19.8K TPS
を実現 (他社に比べ4.5倍)
OLAPのClickHouseとNaitiveに連携し、Postgresのエンド
ポイントからClickHouseへ分析クエリーをオフロード
アプリケーションからは透過的にOLTPとOLAPが一つのエンドポイントで利用可能


## p.20

©2026 CLICKHOUSE INC., CONFIDENTIAL & PROPRIETARY
19
ClickHouse Agent
ClickHouseに格納されているデータを
自然言語で分析可能なUIインターフェース
●
OSSのChat UIプロダクト LibreChat を買収し、
マネージドサービスとして提供
●
ClickHouseのDBにはMCPで接続
○
その他のMCPサービスにも接続可能
●
グラフィカルなデータの可視化から、エージェントの作
成などもサポート
真のデータの民主化を実現する会話形式でのデータ利活用


## p.21

©2026 CLICKHOUSE INC., CONFIDENTIAL & PROPRIETARY
20
ClickStack
ClickHouseに格納されたOpenTelemetryデータをダッシュボードで可視化
●
OSSのモニタリングツール HyperDX を買収しマネージドサービスとして提供
●
通常のモニタリング、アラートダッシュボードに加え、MCPによ外部からの制御も可能
●
AIと連携したログの解析機能を実装
AI SREを実現するオブザーバビリティダッシュボード
Dashboards
Notebook


## p.22

©2026 CLICKHOUSE INC., CONFIDENTIAL & PROPRIETARY
21
Langfuse
Agentアプリケーションの品質管理と
分析を行うプラットフォーム
●
2026年2月にClickHouseが買収
●
トレースによるAgentボトルネックの特
定、LLMコストの可視化、プロンプト管理
を実現
●
LLM-as-a-JudgeによるAgentレスポン
スのスコアリング機能を実装
LLMオブザーバビリティによるエージェントの監視


## p.23

©2026 CLICKHOUSE INC., CONFIDENTIAL & PROPRIETARY
22
Agentic Data Stack 
AIシフトの全てに答えることが可能なデータプラットフォーム
USER
AGENT
USER
AGENT
USER
AGENT
エージェント
アプリケーション
全従業員
AI SRE
1s
クエリ速度
PB
スケール
1000
ノード並行性
MCP
MCP
Managed 
Postgres
ClickPipes
ClickHouse Agent
ClickStack
Langfuse


## p.24

©2026 CLICKHOUSE INC., CONFIDENTIAL & PROPRIETARY
23
ユースケース


## p.25

©2026 CLICKHOUSE INC., CONFIDENTIAL & PROPRIETARY
24
ユーザ事例: Tesla
テスラのギガファクトリーから車両アプリまであらゆるデータを管理
Tesla
ギガファクトリー
工場センサーをリアルタイム処理。品質異常を即時検知し生産
ラインを止めずに対応
コネクテッドビークル
全世界数百万台の車両テレメトリデータをリアルタイムで取得。
Teslaアプリの車両ステータス・充電状況などのダッシュボード
にも利用
エネルギーシステム
充電ステーション・Tesla Energy製品のリアルタイム監視
"There's nothing out there that competes 
  with ClickHouse."
— Alon Tal, Senior Staff Software Engineer, Tesla
数千万行/秒
常時処理データ量
1京行
データインジェストの実績
800万+
全世界のテスラ車


## p.26

©2026 CLICKHOUSE INC., CONFIDENTIAL & PROPRIETARY
25
ユーザ事例: Lyft
全米主要都市で展開するライドシェアサービス、需給管理をリアルタイムで最適化
需給リアルタイム分析
都市・地域ごとの乗車需要とドライバー稼働をリアルタイムに把
握。需給の偏りを即時検知し、インセンティブ配信を自動判断
バッチ + リアルタイム統合
従来バッチ処理とリアルタイム処理で別々に運用していた分析
基盤をClickHouseの一つの環境に統合
キャンペーンターゲティング
リアルタイムのユーザー行動ログを元にプロモーションを動的
調整
"This journey [to ClickHouse] has been   
  really revolutionary."
— Ritesh Varyani, Staff Software Engineer, Lyft
数千 QPS
ピーク時のクエリ処理量
基盤統合
バッチとリアルタイムを統合
450TB/
日
乗車データ処理用


## p.27

©2026 CLICKHOUSE INC., CONFIDENTIAL & PROPRIETARY
26
ユーザ事例: GitLab
長年サービス基準を満たせなかった新しい機能を次々とリリース
プロダクトアナリティクス
機能採用率・ユーザ行動・エラー率をリアルタイムで追跡。「クエ
リ15秒超の機能はリリース不可」のルールから解放。1億行超
のクエリが0.24秒で
Contribution Analytics / DORA
チーム・個人の貢献分析と開発パフォーマンス指標DORAを
リアルタイムで表示。3040秒かかっていたクエリが160倍高
速に
AI Coding Assistant
GitLab Duoの利用率・開発速度向上をリアルタイムに提供化
"ClickHouse became a breakthrough for 
releasing features we had been sitting on 
for years."
— Dennis Tang, Sr. Engineering Manager, GitLab
0.24秒
1億行超クエリの応答時間
新機能リリース
ClickHouseの採用で実現
160倍
クエリの高速化


## p.28

©2026 CLICKHOUSE INC., CONFIDENTIAL & PROPRIETARY
27
Agentic Data Stack by ClickHouse
AIはデータ基盤の「使われ方」を根本的から変えた
●
人がクエリを設計する時代から、AIがワークフローを動かすためにデータを横断的に収集する時
代に。従来のサイロ化されたデータ基盤ではシフトに追いつけない
ClickHouseのAgentic Data Stackが、３つのAIシフトの全てに答える
●
アプリのエージェント化、分析インターフェースの会話化、オブザーバビリティのAI駆動化をAgentic Data 
Stackがすべてサポート
AI時代のデータ基盤の新標準
ClickHouseは「スピード」「スケール」「コスト」の
すべてで同時に問題を解決する、AI時代のデータベース


## p.29

©2026 CLICKHOUSE INC., CONFIDENTIAL & PROPRIETARY
28
ClickHouse を
体験してみてください 
アカウント作成のみで始められる、
30日間の無料トライアルを実施中


## p.30

本セッションのアンケートへ
ご協力をお願いします
Please give us your feedback
Thank you!
PRT212-S
