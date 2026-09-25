---
title: "データウェアハウスのモダナイズ - 事例とデモで学ぶ Amazon Redshift マルチウェアハウスアーキテクチャ"
category: "AWSセッション"
session_id: "ANT209"
pages: 57
topics: ["アーキテクチャ/サーバーレス", "データ分析/基盤", "マイグレーション/モダナイゼーション", "機械学習/MLOps"]
services: ["AWS Glue", "AWS IAM", "AWS Lambda", "Amazon Bedrock", "Amazon Q", "Amazon RDS", "Amazon Redshift", "Amazon S3", "Amazon SageMaker", "MCP"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/AWSセッション/データウェアハウスのモダナイズ - 事例とデモで学ぶ Amazon Redshift マルチウェアハウスアーキテクチャ.pdf"
---
# データウェアハウスのモダナイズ - 事例とデモで学ぶ Amazon Redshift マルチウェアハウスアーキテクチャ


## p.1

ANT209
データウェアハウスのモダナイズ
- 事例とデモで学ぶAmazon Redshift
マルチウェアハウスアーキテクチャ
平井健治
アマゾンウェブサービスジャパン合同会社


## p.2

自己紹介
平井
健治
アマゾンウェブサービスジャパン
ソリューションアーキテクト
小売業のお客様を中心にご支援しつつ、
Analytics の技術支援も行っています。
好きなAWS サービス
Amazon Redshift、Amazon SageMaker
Amazon S3、AWS Lambda


## p.3

対象者
• Amazon Redshift でデータウェアハウスを運用している
• ワークロードの増加に伴うスケーリングに課題を感じている
ゴール
• マルチウェアハウスアーキテクチャの考え方を理解する
• 段階的なモダナイゼーションの進め方をイメージできる
本セッションの対象者とゴール


## p.4

• マルチウェアハウスアーキテクチャの理解
• Amazon Redshift によるマルチウェアハウス
アーキテクチャの実現
• マルチウェアハウスアーキテクチャによるス
ケーリング事例- Vanguard
• デモ
アジェンダ


## p.5

マルチウェアハウスアーキテクチャの
理解


## p.6

複数のワークロードが
共通のコンピュートを共有
•
スケーラビリティの制約
•
ワークロードの干渉
•
リソースの競合
単一
ウェアハウス
構成の課題1
ストリーム
バッチソース
BI ツール
データAPI
データサイエンス
アプリケーション
Amazon Redshift
ストリーム
取り込み
バッチ
取り込み
データ
サイエンス
探索的分析
レポート/
ダッシボード


## p.7

ハブアンドスポーク
•
ワークロードの完全な分離
•
ワークロード間の干渉なし
•
数分で新しいエンドポイント
を起動し、新しいワークロー
ドをオンボード
マルチ
ウェアハウス
アーキテクチャ
ストリーム
取り込み
バッチ
取り込み
データ
サイエンス
探索的分析
レポート/
ダッシュボード
Redshift Managed  
Storage (RMS)
BI ツール
データAPI
データサイエンス
アプリケーション
ストリーム
バッチソース


## p.8

マルチテナントワークロード向け
マルチウェアハウス
•
テナントの完全な分離
•
シンプルなコスト配賦
•
テナントの所在地に近いコン
ピュートをプロビジョニング
マルチ
ウェアハウス
アーキテクチャ
テナント1
(東京)
データソース
テナント2
(ソウル)
テナント3
(シンガポール)
ap-northeast-1
ap-northeast-2
ap-southeast-1
データ
取り込み
テナント1
テナント2
テナント3
Redshift Managed  
Storage (RMS)


## p.9

複数のドメインが
共通のコンピュートを共有
•
複雑なリソース優先順位付け
•
複雑なコスト配賦
•
複雑なデータ分離
単一
ウェアハウス
構成の課題2
Amazon Redshift
単一ウェアハウス
R&D
人事
ファイ
ナンス
マーケ
ティング
セールス
カスタマー
サービス


## p.10

データメッシュ
•
独立したリソース割り当てと
スケーリング
•
各グループはコンプライアン
ス要件に準拠してデータ資産
を共有
•
シンプルなコスト配賦
マルチ
ウェアハウス
アーキテクチャ
Redshift Managed 
Storage (RMS)
人事
ファイ
ナンス
セールス
R&D
マーケ
ティング
カスタマー
サービス


## p.11

Amazon Redshift による
マルチウェアハウスアーキテクチャの実現


## p.12

Amazon Redshift - 大規模スケール向けに設計
コンピュートとストレージの分離
AWS Account B
AWS Account A
Redshift Managed Storage (RMS)
高性能列指向ストレージ
Amazon Redshift コンピュート
Amazon Redshift
サーバーレス
Amazon Redshift
プロビジョンド
読み取りと書き込み
Amazon Redshift
サーバーレス
コンピュート
高性能MPP (超並列処理) 
コンピュートの選択
(プロビジョンド/ サーバーレス) 
異なるAWS アカウントに配置可能
異なるAWS リージョンに配置可能
高速SSD キャッシュを搭載
ストレージ
高度に最適化された
列指向ストレージ


## p.13

Amazon Redshift フェデレーテッドアクセス許可
Redshift Managed 
Storage (RMS)
人事
ファイ
ナンス
セールス
R&D
マーケ
ティング
カスタマー
サービス
Glue Data Catalog
2025年
11月
リリース


## p.14

Amazon Redshift フェデレーテッドアクセス許可
FGAC ポリシーの作成:
CREATE RLS POLICY region_policy
WITH (region VARCHAR(256))
USING (region = current_user_region());
オブジェクトへの権限付与
ATTACH RLS POLICY region_policy ON 
customer_table TO ”awsidc:sales";
Redshift Managed 
Storage (RMS)
人事
ファイ
ナンス
セールス
R&D
マーケ
ティング
カスタマー
サービス
Glue Data Catalog
2025年
11月
リリース


## p.15

Amazon Redshift フェデレーテッドアクセス許可
他の任意のウェアハウス
からアクセス
SELECT * 
from customer_table
--出力
セールスには担当地域の
データのみ表示
Redshift Managed 
Storage (RMS)
人事
ファイ
ナンス
セールス
R&D
マーケ
ティング
カスタマー
サービス
Glue Data Catalog
2025年
11月
リリース
FGAC ポリシーの作成:
CREATE RLS POLICY region_policy
WITH (region VARCHAR(256))
USING (region = current_user_region());
オブジェクトへの権限付与
ATTACH RLS POLICY region_policy ON 
customer_table TO ”awsidc:sales";


## p.16

Amazon Redshift – データレイクの分析
AWS Cloud
Redshift Managed Storage (RMS)
高性能列指向ストレージ
S3 tables
AWS マネージド
Apache Iceberg 
データレイク
Amazon S3 
Data Lake
セルフマネージド
データレイク
Amazon Redshift
Amazon Redshift
Serverless コンピュート
Amazon Redshift
Provisioned コンピュート
データレイク


## p.17

Amazon Redshift – データレイクの分析
AWS Cloud
Redshift Managed Storage (RMS)
高性能列指向ストレージ
S3 tables
AWS マネージド
Apache Iceberg 
データレイク
Amazon S3 
Data Lake
セルフマネージド
データレイク
Amazon Redshift
Amazon Redshift
Serverless コンピュート
Amazon Redshift
Provisioned コンピュート
データレイク
2X
クエリパフォーマンスの向上
Amazon Redshift Serverless 
からのApache Iceberg


## p.18

生成AI を活用したデータウェアハウス
Amazon Redshift
Amazon Q
Generative SQL
Amazon Redshift  
MCP Server
テキストからSQL
ナレッジベースとしてのAmazon Redshift
AI エージェント
2025年のエレクトロニクス
の総売上は？
select sum(sale_amt) from sales 
where product_name = 'electronics’ 
and year = 2025
Amazon Redshift からSQL を使用して
Amazon Bedrock のLLM を呼び出し
select find_sentiment(review) from reviews
Amazon Bedrock


## p.19

マルチウェアハウスアーキテクチャ
によるスケーリング事例- Vanguard


## p.20

50+ MILLION
投資家
$11.6+ TRILLION
運用資産
450
ファンド/ETF
20,000
従業員
世界有数の投資会社であり、
低コストの投資信託、ETF、
アドバイス、関連サービスを
幅広く提供


## p.21

Customer 360 のビジネスユースケース
アナリティクスと
ビジネス
インテリジェンス
予測
インテリジェンス
リアルタイムCX


## p.22

開始時の課題
真実が複数存在
(データの不整合)
一貫性のない
レポーティング
スケーリングの
課題
パフォーマンス
の低下
データソース
データスワンプ（沼地）
(Parquet on Amazon S3)


## p.23

モダナイゼーション：第一段階
集中型エンタープライズデータウェアハウスClient 360 を構築
データソース
From: データスワンプ（沼地）
(Parquet on Amazon S3)
Amazon Redshift
Provisioned
BI ツール
アナリスト
探索
データ
サイエンス
Amazon S3
（生データ）
データソース
To: 集中型DWH
(Client 360)


## p.24

第一段階後のメリット
Amazon Redshift
Provisioned
BI ツール
アナリスト
探索
データ
サイエンス
Amazon S3
（生データ）
• Client360 ゴールデンソース
• 10倍のパフォーマンス
• 一貫性のあるレポーティング
ビジネス部門からの信頼向上
• 新しいユースケースの実現


## p.25

20TB
Redshift Managed 
Storege (RMS)
100
アクティブユーザー
月間50万以上
ユーザークエリ
1,000以上
バッチジョブ
データ
ウェアハウス
ワークロード
の規模
S3 データレイク：150TB
テーブル：600+
ビュー：400+
アナリスト
データエンジニア
データサイエンティスト


## p.26

第一段階後の急成長
データ+ オブジェクトの
年間成長
新しいユースケースの
年間成長
2X
2X


## p.27

単一ウェアハウスアーキテクチャの
スケーリング課題
パフォーマンスの
ボトルネック
ワークロード管理の
複雑さ
リソースの競合
テーブルロックが
ETL をブロック
ピーク時の
パフォーマンス
低下
ETL とアナリストが
リソースを奪い合う
SLA 未達
マテリアライズド
ビューの
低速リフレッシュ


## p.28

モダナイゼーション：第二段階
Amazon Redshift
Provisioned
BI ツール
アナリスト
探索
データ
サイエンス
Amazon S3
（生データ）
From: 集中型
単一ウェアハウス
Redshift Managed Storage
(RMS)
高性能列指向ストレージ


## p.29

モダナイゼーション：第二段階
ハブアンドスポーク
BI ツール
アナリスト
探索
データ
サイエンス
Amazon Redshift
Serverless
Amazon Redshift
Serverless
Amazon Redshift
Serverless
Amazon Redshift
Provisioned
Amazon S3 
（生データ）
To: 分散型
マルチウェアハウス
Redshift Managed Storage
(RMS)
高性能列指向トレージ


## p.30

アナリストの
利便性向上
リソース競合の
解消
アナリストが
自律的に分析
可能に
第二段階後の
メリット
SLAの改善


## p.31

さらなるモダナイゼーションの動機
書き込み用の
単一エンドポイント
競合
集中型
データオーナーシップ
ガバナンスの
ボトルネック
クロスドメインの
相互依存
アジリティの低下


## p.32

将来のアーキテクチャ– データメッシュ
(構想中)
BI ツール
アナリスト
探索
データ
サイエンス
Amazon Redshift
Serverless
Amazon Redshift
Serverless
Amazon Redshift
Serverless
RMS
Apache Iceberg
加工済み
ドメイン2
Redshift
Managed
Storage
データソース
増分マテリアライズド
ビューで高速化
Apache Iceberg
加工済み
ドメイン1
Apache Iceberg
加工済み
ドメイン3
AWS Glue
Amazon S3
（生データ）
Amazon Redshift
Serverless
Amazon Redshift
Serverless
Amazon Redshift
Serverless


## p.33

得られた教訓
メトリクスを追跡して成果を
測定する
シンプルに始める
成長に合わせてアーキテクチャ
を見直す
ベンダーと協力する
新機能の採用に
柔軟でオープンに


## p.34

デモ


## p.35

デモシナリオ- Anycompany
Amazon RDS
for Oracle
セールス
Amazon 
Data Firehose
クリックストリーム
イベント
ソースからデータを
取り込み変換
ビジネス
インテリジェンス
レポーティング/ダッシュボード
KPI
データの
民主化
生成AI
自然言語ベースの分析


## p.36

Anycompany マルチウェアハウスアーキテクチャ


## p.37

Anycompany マルチウェアハウスアーキテクチャ
Amazon Redshift
データの
ロードと変換
Amazon Redshift
レポーティング
Amazon Redshift
生成AI
アプリケーション


## p.38

Anycompany マルチウェアハウスアーキテクチャ
Amazon Redshift
データの
ロードと変換
Redshift 
Managed 
Storage 
(RMS)
Zero 
ETL
Amazon RDS
for Oracle
セールス
Amazon Redshift
レポーティング
Amazon Redshift
生成AI
アプリケーション


## p.39

Anycompany マルチウェアハウスアーキテクチャ
Amazon Redshift
データの
ロードと変換
Redshift 
Managed 
Storage 
(RMS)
Zero 
ETL
Amazon RDS
for Oracle
セールス
Amazon Data 
Firehose
クリックストリーム
イベント
S3 Tables
Amazon Redshift
レポーティング
Amazon Redshift
生成AI
アプリケーション


## p.40

Anycompany マルチウェアハウスアーキテクチャ
Amazon Redshift
データの
ロードと変換
Redshift 
Managed 
Storage 
(RMS)
Zero 
ETL
Amazon RDS
for Oracle
セールス
AWS IAM 
Identity Center 
Amazon 
SageMaker 
Catalog
Amazon Data 
Firehose
クリックストリーム
イベント
S3 Tables
Amazon Redshift
レポーティング
Amazon Redshift
生成AI
アプリケーション


## p.41

Anycompany マルチウェアハウスアーキテクチャ
Amazon Redshift
データの
ロードと変換
Redshift 
Managed 
Storage 
(RMS)
Zero 
ETL
Amazon RDS
for Oracle
セールス
AWS IAM 
Identity Center 
Amazon 
SageMaker 
Catalog
Amazon Data 
Firehose
クリックストリー
ムイベント
S3 Tables
Amazon Redshift
レポーティング
Amazon Redshift
生成AI
アプリケーション


## p.42

Anycompany マルチウェアハウスアーキテクチャ
Amazon Redshift
データの
ロードと変換
Redshift 
Managed 
Storage 
(RMS)
Zero 
ETL
Amazon RDS
for Oracle
セールス
AWS IAM 
Identity Center 
Amazon 
SageMaker 
Catalog
Amazon Data 
Firehose
クリックストリーム
イベント
S3 Tables
Amazon Redshift
レポーティング
Amazon Redshift
生成AI
アプリケーション
Amazon Bedrock
ナレッジベース：
構造化データ


## p.43

ワークロードごとに個別のウェアハウスを作成
ETL
レポー
ティング
生成AI


## p.44

データのロードと変換
Amazon Redshift
データの
ロードと変換
Redshift 
Managed 
Storage 
(RMS)
Zero
ETL
Amazon RDS
for Oracle
セールス


## p.46

集中型データガバナンス＋AWS IAM Identity 
Center統合
Amazon Redshift
データのロード
と変換
Redshift 
Managed 
Storage 
(RMS)
Zero 
ETL
Amazon RDS
for Oracle
セールス
Amazon Data 
Firehose
クリックストリーム
イベント
S3 Tables


## p.47

集中型データガバナンス＋AWS IAM Identity 
Center統合
Amazon Redshift
データのロード
と変換
Redshift 
Managed 
Storage 
(RMS)
Zero 
ETL
Amazon RDS
for Oracle
セールス
AWS IAM 
Identity Center 
Amazon 
SageMaker 
Catalog
Amazon Data 
Firehose
クリックストリーム
イベント
S3 Tables


## p.49

AWS IAM Identity Centerでコンシューマーに
ログインしてデータを分析
Amazon Redshift
データのロード
と変換
Redshift 
Managed 
Storage 
(RMS)
Zero 
ETL
Amazon RDS
for Oracle
セールス
AWS IAM 
Identity Center 
Amazon 
SageMaker 
Catalog
Amazon Data 
Firehose
クリックストリーム
イベント
S3 Tables
Amazon Redshift
レポーティング


## p.51

生成AI アプリケーションでの利用
Amazon Redshift
データのロード
と変換
Redshift 
Managed 
Storage 
(RMS)
Zero 
ETL
Amazon RDS
for Oracle
セールス
AWS IAM 
Identity Center 
Amazon 
SageMaker 
Catalog
Amazon Data 
Firehose
クリックストリーム
イベント
S3 Tables
Amazon Redshift
レポーティング
Amazon Redshift
生成AI
アプリケーション
Amazon Bedrock
ナレッジベース：
構造化データ


## p.53

Anycompany マルチウェアハウスアーキテクチャ
Amazon Redshift
データのロード
と変換
Redshift 
Managed 
Storage 
(RMS)
Zero 
ETL
Amazon RDS
for Oracle
セールス
AWS IAM 
Identity Center 
Amazon 
SageMaker 
Catalog
Amazon Data 
Firehose
クリックストリーム
イベント
S3 Tables
Amazon Redshift
レポーティング
Amazon Redshift
生成AI
アプリケーション
Amazon Bedrock
ナレッジベース：
構造化データ


## p.54

まとめ


## p.55

• 単一ウェアハウスの課題はマルチウェアハウスアーキテクチャで解決できる
• 課題：リソース競合、ワークロード干渉、スケーリング制約
• 解決：ワークロード分離、独立スケーリング
• シンプルに始めて、成長に合わせてアーキテクチャを見直す
• 事例：単一ウェアハウスマルチウェアハウス（ハブアンドスポーク
データメッシュ）
• Amazon Redshift はコンピュートとストレージの分離により、段階的なアー
キテクチャの進化を支える
• フェデレーテッドアクセス許可、Apache Iceberg連携
まとめ


## p.56

Ask the Speaker
こちらのRoom 後方の外側にございます、
「Ask the Speaker」カウンターまでお越しください
平井健治
アマゾンウェブサービスジャパン合同会社
Room


## p.57

本セッションのアンケートへ
ご協力をお願いします
Please give us your feedback
Thank you!
ANT209
