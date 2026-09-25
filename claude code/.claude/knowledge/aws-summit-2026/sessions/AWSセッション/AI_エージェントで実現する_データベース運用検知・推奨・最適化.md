---
title: "AI エージェントで実現する データベース運⽤︓検知・推奨・最適化"
category: "AWSセッション"
session_id: "DAT358"
pages: 53
topics: ["コスト最適化/FinOps", "生成AI/エージェント"]
services: ["Amazon Aurora", "Amazon DynamoDB", "Amazon RDS", "Amazon Redshift", "MCP"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/AWSセッション/AI エージェントで実現する データベース運⽤︓検知・推奨・最適化.pdf"
---
# AI エージェントで実現する データベース運⽤︓検知・推奨・最適化


## p.1

DAT358
AI エージェントで実現する
データベース運⽤︓検知・推奨・最適化
鈴⽊⼤樹
アマゾンウェブサービスジャパン合同会社


## p.2

⾃⼰紹介
鈴⽊ ⼤樹 (Daiki Suzuki)
アマゾンウェブサービスジャパン合同会社
ソリューションアーキテクト
BtoC のサービスを展開している
ウェブ系のお客様を主にご⽀援しています
好きなAWS サービス
2
Amazon Aurora


## p.3

本セッションの対象者とゴール
対象者
• データベースのメトリクスを⾒て、アラートに対応している⽅
• データベースのコスト最適化やパフォーマンス改善に関⼼のある⽅
• ⽇々の運⽤に AI エージェントをどのように組み込むか検討している⽅
ゴール
• AI エージェントが何を⾒て何を提案できるかを理解する
• ⾃社環境で⼩さく始められる「最初の⼀歩」を持ち帰る
3


## p.4

“データベースが⾃ら検知・
推奨・最適化できるようになると、
それらはリアクティブなシステム
ではなくなり、インテリジェントな
パートナーとなる。”
4


## p.5

アジェンダ
課題
ゴール
なぜ AI エージェントか
AWS データベースサービス と AI エージェント
デモ
メリット
まとめ


## p.6

R E A C T I V E , N O T P R O A C T I V E
課題
よくある問題 : 
• パフォーマンス
• 運⽤
• 可観測性
• リアクティブな監視≠ ビジネスレジリエンス
データベースのパフォーマンス問題は、
ワークロードに⽀障をきたした後に
しか診断されない。
6


## p.7

P R E D I C T A N D P R E V E N T
ゴール
もし以下のことができたら: 
• アラートだけでなく、
的を絞った最適化を推奨
• AI の洞察で継続的に最適化
• プロアクティブでデータ駆動型の意思決定
本番環境に影響を与える前に、
データベースの問題をプロアクティブに
検知、最適化、解決する。
7


## p.8

Insights, not alerts
なぜ AI エージェントか︖
従来の監視  
• ⼤量データの処理能⼒が限定的
• 問題発⽣後の遅延検出
• 背景情報やソリューションのないリアクティブなアラート
8


## p.9

Insights, not alerts
なぜ AI エージェントか︖
AI は⼤規模にメトリクスを処理し、異常を検出し、最適化を推奨可能
9
AI によるモニタリング
• メトリクス・ログ・クエリを⼤規模に分析
• リアルタイムで異常検知
• 問題の背景・診断・推奨アクションをプロアクティブに提供


## p.10

AWS データベースサービスと 
AI エージェント


## p.11

AWS データベースサービスの概要
Amazon RDS
マネージド RDBMS で
様々な DB エンジンを
カバー 
(MySQL, PostgreSQL, 
Oracle, SQL Server, 
MariaDB, Db2)
Amazon Redshift
分析向けのクラウド
データウェアハウス
⼤規模な並列クエリ
に対応
Amazon DynamoDB
サーバーレスNoSQL 
マネージドデータベース
⼀桁 ms 単位の⾼速な
パフォーマンス、
オートスケーリング
Amazon Aurora
クラウドネイティブで
MySQL/PostgreSQL
互換や DSQL の
DB エンジンをカバー
⾼可⽤性、
オートスケーリング
レプリケーション管理
11
デモ
デモ


## p.12

AWS データベースサービスと 
AI エージェント : 
Amazon RDS


## p.13

RELATIONAL DATABASE SERVICE
Amazon RDS – 3 つの課題 と AI エージェント
スロークエリ
根本原因
AI エージェント
ができること
結果/メリット
13
クエリ応答時間とデータベース効率の向上
クエリ実⾏データを分析、スロークエリを検出し
最適化されたインデックスやクエリを推奨
⾮効率的なクエリプラン、インデックスの⽋如、
最適化されていないスキーマ設計


## p.14

RELATIONAL DATABASE SERVICE
Amazon RDS – 3 つの課題 と AI エージェント
⼿動での垂直スケーリング
根本原因
AI エージェント
ができること
結果/メリット
14
最適化されたパフォーマンスとコスト効率
CPU、メモリ、I/O メトリクスを分析して
需要を予測し適切なサイジングを推奨
ワークロードの変動に合わせていない静的な
インスタンスサイジング


## p.15

RELATIONAL DATABASE SERVICE
Amazon RDS – 3 つの課題 と AI エージェント
ストレージ最適化
根本原因
AI エージェント
ができること
結果/メリット
15
ストレージコストの削減と、
より良いコストパフォーマンスの実現
メトリクスから使⽤パターンを分析して
適切なサイジングオプションを提案
過剰プロビジョニングされたストレージ、
未使⽤のボリューム、⾮効率的なデータ分散


## p.16

デモ : Amazon RDS の
インスタンスリサイズと
ストレージのコスト・性能最適化


## p.17

• AI エージェントが何の指標を⾒たのか
• AI エージェントがどんな根拠で結論を出したのか
• みなさん⾃⾝が同じことをしたら
どれくらい時間がかかりそうか
デモでご注⽬いただきたい点
18


## p.18

19
MCP の設定確認


## p.19

20
ストレージコスト最適化の分析依頼


## p.20

21
メトリクス取得・分析中


## p.21

metrics_to_fetch = [
('FreeStorageSpace', 'Bytes', 'Average'),
('ReadIOPS', 'Count/Second', 'Average'),
('WriteIOPS', 'Count/Second', 'Average'),
('ReadLatency', 'Seconds', 'Average'),
('WriteLatency', 'Seconds', 'Average'),
('CPUUtilization', 'Percent', 'Average'),
('FreeableMemory', 'Bytes', 'Average'),
('DatabaseConnections', 'Count', 'Average'),
]
22
収集したメトリクス例


## p.22

23
分析結果の表⽰・推奨アクションの提⽰


## p.23

24
分析結果・推奨アクション例


## p.24

25
コンピューティング最適化の分析依頼


## p.25

26
メトリクス取得・分析中


## p.26

metrics = [
('CPUUtilization', 'Percent'),
('FreeableMemory', 'Bytes'),
('DatabaseConnections', 'Count'),
('NetworkReceiveThroughput', 'Bytes/Second'),
('NetworkTransmitThroughput', 'Bytes/Second'),
('ReadIOPS', 'Count/Second'),
('WriteIOPS', 'Count/Second'),
('SwapUsage', 'Bytes'),
]
27
収集したメトリクス例


## p.27

28
分析結果の表⽰・推奨アクションの提⽰


## p.28

29
分析結果・推奨アクション例


## p.29

AWS データベースサービスと 
AI エージェント : 
Amazon Redshift


## p.30

CLOUD DATA WAREHOUSE
Amazon Redshift – 3 つの課題 と AI エージェント
スキュークエリ
根本原因
AI エージェント
ができること
結果/メリット
31
均等に分散された
より⾼速なクエリパフォーマンス
クエリログとワークロードを分析、
再分散戦略を提案
ノード間の不均等なデータ、ワークロードの分散


## p.31

CLOUD DATA WAREHOUSE
Amazon Redshift – 3 つの課題 と AI エージェント
⾮効率的な結合
根本原因
AI エージェント
ができること
結果/メリット
32
ネットワーク I/O とクエリ実⾏時間の削減
クエリプランの分析やデータシャッフルを検出し
最適化された内容を提案
結合時のノード間の不⼀致な分散、
⼤量のデータ移動


## p.32

CLOUD DATA WAREHOUSE
Amazon Redshift – 3 つの課題 と AI エージェント
最適でない分散キー
根本原因
AI エージェント
ができること
結果/メリット
33
最適なデータ配置と、バランスの取れた
クラスターパフォーマンス
不適切な結合キーを検出し、
最適な DISTKEY/SORTKEY の構成を推奨
不適切に選択された DISTKEY による
データの偏りとデータシャッフリング


## p.33

デモ : Amazon Redshift クラスターの
アーキテクチャ分析・推奨


## p.34

35
Redshift クラスターの分析依頼


## p.35

36
メトリクス取得・分析中


## p.36

37
分析のための SQL・Python スクリプト作成


## p.37

# スライス別⾏数（スキュー確認）
q_skew = """
SELECT trim(name) as tablename, slice, num_values
FROM svv_diskusage
WHERE name IN ('sales_fact', 'customers', 'stores',
'transaction_log')
ORDER BY tablename, slice
"""
38
作成した SQL ⽂の例


## p.38

39
分析レポート作成


## p.39

40
分析結果・推奨アクション例
-- 現在: DISTKEY(region_id) →変更: DISTKEY(customer_id)
CREATE TABLE sales_fact_optimized (
sale_id 
BIGINT,
customer_id INTEGER DISTKEY,
      ・・・・・・・・
sales_rep_id INTEGER
)
SORTKEY (sale_date, customer_id); -- 複合ソートキー


## p.40

AWS データベースサービスと 
AI エージェント : 
Amazon Aurora


## p.41

CLOUD-NATIVE RELATIONAL DATABASE
Amazon Aurora – 3 つの課題 と AI エージェント
レプリケーションラグ
根本原因
AI エージェント
ができること
結果/メリット
42
レイテンシの削減、読み取り整合性の向上、
より⾼速なフェイルオーバー
レプリケーションメトリクスを監視して
遅延を予測し、レプリカのチューニングや
フェイルオーバーを推奨
⾼頻度のボリューム書き込み、レプリカの
プロビジョニング不⾜、ネットワークレイテンシ


## p.42

CLOUD-NATIVE RELATIONAL DATABASE
Amazon Aurora – 3 つの課題 と AI エージェント
コネクションストーム
根本原因
AI エージェント
ができること
結果/メリット
43
安定したパフォーマンスと
ダウンタイムリスクの削減
異常な接続パターンを検出し、スロットリング、
プーリング、Aurora Serverless での調整を推奨
同時接続の急激な増加により、
負荷の不均衡やリソースの枯渇


## p.43

CLOUD-NATIVE RELATIONAL DATABASE
Amazon Aurora – 3 つの課題 と AI エージェント
スケーリングのボトルネック
根本原因
AI エージェント
ができること
結果/メリット
44
シームレスなスケーリング、最適化された
スループット、運⽤オーバーヘッドの削減
ワークロードトレンドを予測し、
リーダーインスタンス の
リバランシングやオートスケーリングを推奨
不均衡な読み取り/書き込みワークロード、
⼗分に活⽤されていないリーダーインスタンス


## p.44

AWS データベースサービスと 
AI エージェント : 
Amazon DynamoDB


## p.45

NOSQL DATABASE SERVICE
Amazon DynamoDB – 3 つの課題 と AI エージェント
ホットパーティション
根本原因
AI エージェント
ができること
結果/メリット
46
バランスの取れたワークロード、
レイテンシの削減、スループットの向上
ホットパーティションの検出とアクセスパターン
を分析し、より良いパーティションキー設計や
シャーディングを推奨
不均等なキー分散によって特定のパーティション
が不均衡なトラフィックを受信


## p.46

NOSQL DATABASE SERVICE
Amazon DynamoDB – 3 つの課題 と AI エージェント
⾼負荷時のスロットリング
根本原因
AI エージェント
ができること
結果/メリット
47
スロットリングイベントの減少、
安定したパフォーマンス
読み取り/書き込みメトリクスから
スロットリングを予測し、
動的なキャパシティ調整を推奨
バーストや予測不可能なトラフィックにより
キャパシティ制限を超過


## p.47

NOSQL DATABASE SERVICE
Amazon DynamoDB – 3 つの課題 と AI エージェント
予測しにくいワークロードのコストスパイク
根本原因
AI エージェント
ができること
結果/メリット
48
最適化されたコスト、⼀貫したパフォーマンス、
⼿動チューニングの削減
ワークロードトレンドを予測し、
容量モードの選択やキャッシュの導⼊の検討
オンデマンドの突発的消費、
オートスケーリングのスケールダウン遅延


## p.48

メリット


## p.49

F A S T E R , S M A R T E R , O P T I M I Z E D
AI 駆動監視のメリット
プロアクティブ
な監視
ダウンタイムの
削減
DBA の
⽣産性向上
分析作業の
⾃動化
よりスマートな
コスト管理
⾃動チューニング
運⽤オーバー
ヘッドの削減
リソースの
最適活⽤
50


## p.50

まとめ


## p.51

AI エージェントで実現するデータベース運⽤
• データはたくさんあるのに「なぜ起きたか」が分からない— 
多くのデータベース運⽤は、後⼿に回りがちだった
• AI エージェントは、メトリクス・ログ・クエリ・設定を横断して
原因を診断し、推奨アクションをコンテキスト付きで提⽰
• 分析やレポーティングはAI エージェントに任せ、
⼈間は実⾏可否の判断と、ビジネスインパクトの⾒極めに集中できる
• まずは 1 つのサービスから⼩さく始めて、効果を測り広げていく。
それがリアクティブな対応からプロアクティブな運⽤への最初の⼀歩
52


## p.52

Ask the Speaker
こちらのRoom 後⽅の外側にございます、
「Ask the Speaker」カウンターまでお越しください
鈴⽊⼤樹
アマゾンウェブサービスジャパン合同会社
Room


## p.53

本セッションのアンケートへ
ご協⼒をお願いします
Please give us your feedback
Thank you!
DAT358
