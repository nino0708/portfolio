---
title: "Apache Iceberg on AWS 実践ガイド -設計・取り込み・活用のベストプラクティス"
category: "AWSセッション"
session_id: "ANT355"
pages: 37
topics: ["データ分析/基盤", "機械学習/MLOps"]
services: ["AWS CDK", "AWS Glue", "Amazon Athena", "Amazon Aurora", "Amazon Bedrock", "Amazon Q", "Amazon RDS", "Amazon Redshift", "Amazon S3", "Amazon SageMaker"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/AWSセッション/Apache Iceberg on AWS 実践ガイド -設計・取り込み・活用のベストプラクティス.pdf"
---
# Apache Iceberg on AWS 実践ガイド -設計・取り込み・活用のベストプラクティス


## p.1

ANT355
Apache Iceberg on AWS 実践ガイド
- 設計・取り込み・活用のベストプラクティス
松岡勝也
アマゾンウェブサービスジャパン合同会社


## p.2

松岡勝也/ Katsuya Matsuoka
所属：
アマゾンウェブサービスジャパン合同会社
技術統括本部通信・メディア技術本部
メディア・広告ソリューション部
ソリューションアーキテクト
好きなAWS サービス：
自己紹介
Amazon SageMaker
AWS CDK
AWS Glue
@ktsmats


## p.3

• データ基盤の現状・動向
– レイクハウスにおけるApache Iceberg
• AWS のアナリティクススタック
– 各レイヤーで活用できるサービス
• 実装パターン
– バッチ ETL / ストリーミング
• まとめ
Agenda


## p.4

• Apache Iceberg の導入検討/運用をされている方
• Apache Iceberg の基本的な特徴を把握している方
• Amazon S3 など基本的な AWS サービスを把握している方
本セッションのゴール
•
レイクハウスアーキテクチャの全体像とプラクティスを把握
想定聴講者


## p.5

データ基盤の動向


## p.6

AI アプリケーションと
エージェント
オーケストレーション
データ基盤
AI の基盤であるデータ
• データストレージ＆管理
• データ処理＆変換
• データカタログ＆ガバナンス


## p.7

セキュリティと
信頼性
パフォーマンスと
スケーラビリティ
データ品質と
ガバナンス
データの分断と
サイロ化
Agentic AI におけるデータの障壁


## p.8

発見可能性 
オープンで
スケーラブルな基盤
一貫したアクセス
ポリシー
レイクハウスにより Agentic AI の開発を加速


## p.9

ACID 
トランザクション
スキーマ進化
クエリ
パフォーマンス
タイムトラベル
Apache Iceberg 
Agentic AI 時代のデータ基盤を支えるオープンテーブルフォーマット


## p.10

Apache Iceberg V3
行リネージ
スケーラブルな
変更追跡
Variant
データ型
半構造化データを
効率的に取り扱う
削除
ベクトル
書き込み性能の
最適化
デフォルト値
データ処理を標準化
および簡素化


## p.11

AWS のアナリティクススタック


## p.12

AWS アナリティクススタック
Zero-ETL
カタログ
フェデレーション
クエリ
フェデレーション
データソース
オペレーショナル
データベース
他のデータソース
ビジネス
アプリケーション
データ
ウェアハウス
ストリーミング
Iceberg REST 
カタログ
AWS Glue Data Catalog
テクニカルカタログ
AWS Lake Formation
統合アクセス制御
Amazon SageMaker Catalog
ビジネスカタログ
カタログ&ガバナンス
3P Apache Iceberg 
互換エンジン
AWS Glue
Amazon 
EMR 
Amazon 
Redshift
処理
Amazon 
Athena 
Amazon S3 Amazon S3 Tables
Redshift 
Managed Storage (RMS)
ストレージ
取り込み
AWS Glue
Amazon 
EMR
Amazon 
Data Firehose
Amazon MSF
Amazon MSK
Amazon Bedrock
生成AI / ML
Amazon SageMaker
Unified Studio
Amazon Quick
Agentic AI / BI
活用
ISV 
ソリューション


## p.13

AWS アナリティクススタック
Zero-ETL
カタログ
フェデレーション
クエリ
フェデレーション
データソース
オペレーショナル
データベース
他のデータソース
ビジネス
アプリケーション
データ
ウェアハウス
ストリーミング
Iceberg REST 
カタログ
AWS Glue Data Catalog
テクニカルカタログ
AWS Lake Formation
統合アクセス制御
Amazon SageMaker Catalog
ビジネスカタログ
カタログ&ガバナンス
3P Apache Iceberg 
互換エンジン
AWS Glue
Amazon 
EMR 
Amazon 
Redshift
処理
Amazon 
Athena 
Amazon S3 Amazon S3 Tables
Redshift 
Managed Storage (RMS)
ストレージ
取り込み
AWS Glue
Amazon 
EMR
Amazon 
Data Firehose
Amazon MSF
Amazon MSK
Amazon Bedrock
生成AI / ML
Amazon SageMaker
Unified Studio
Amazon Quick
Agentic AI / BI
活用
ISV 
ソリューション


## p.14

Iceberg への取り込みに使える AWS サービス
Amazon EMR
Amazon Managed Service
for Apache Flink (MSF)
Amazon Data Firehose
AWS Glue
サーバーレスで
スケーラブルな
データ統合サービス
Apache Flink の
フルマネージドサービス
ストリーミングデータを
リアルタイムで配信する
フルマネージドサービス
Apache Spark、Trino、
Flink、Hive などの
マネージドクラスター


## p.15

AWS アナリティクススタック
Zero-ETL
カタログ
フェデレーション
クエリ
フェデレーション
データソース
オペレーショナル
データベース
他のデータソース
ビジネス
アプリケーション
データ
ウェアハウス
ストリーミング
Iceberg REST 
カタログ
AWS Glue Data Catalog
テクニカルカタログ
AWS Lake Formation
統合アクセス制御
Amazon SageMaker Catalog
ビジネスカタログ
カタログ&ガバナンス
3P Apache Iceberg 
互換エンジン
AWS Glue
Amazon 
EMR 
Amazon 
Redshift
処理
Amazon 
Athena 
Amazon S3 Amazon S3 Tables
Redshift 
Managed Storage (RMS)
ストレージ
取り込み
AWS Glue
Amazon 
EMR
Amazon 
Data Firehose
Amazon MSF
Amazon MSK
Amazon Bedrock
生成AI / ML
Amazon SageMaker
Unified Studio
Amazon Quick
Agentic AI / BI
活用
ISV 
ソリューション


## p.16

高水準のセキュリティ・
コンプライアンス・監査機能
Hive Metastore API 互換
高可用性・スケーラビリティ
・耐久性
サーバーレスで
優れたコスト効率
外部メタデータストアの
フェデレーション
AWS Glue 
Data Catalog
AWS Glue Data Catalog
オープンテーブルフォーマット
Apache Iceberg
Delta Lake
Apache Hudi


## p.17

Glue Data Catalog での Iceberg テーブルの管理
Glue Data Catalog
• コンパクション
スモールファイルを自動的に大きなファイルへ統合してクエリ
パフォーマンスを向上し、Sort / Z-order でのクエリパターンに
応じたデータ配置にも対応
• スナップショット管理
古いスナップショットを自動削除し、ストレージコストを削減
• 孤立ファイルの削除
メタデータから参照されていないファイルを定期的に特定して削除


## p.18

Glue Data Catalog でのコンパクション
• バックグラウンドで実行され、Amazon S3 上の
すべてのコミットとデータ変更を追跡
• スモールファイルのデータコンパクションを
自動的にトリガー
• コンパクションで Iceberg テーブルのメタデータ
オーバーヘッドを削減し、読み取り性能を向上
• 一度設定すると、コンパクション用 ETL パイプライン
の作成・実行・監視が不要


## p.19

リモートIceberg カタログのカタログフェデレーション
Glue Data Catalog
• データの移動や複製なしに、リモートカタログ経由で 
Amazon S3 上の Iceberg テーブルに直接アクセス
• Glue Data Catalog とリモートカタログ間の
リアルタイムメタデータ同期で最新クエリ結果を保証
• AWS 分析エンジンでデータを発見・読み取り可能
• リモートテーブルへのきめ細かい権限を適用し、
一貫したセキュリティポリシーを確保


## p.20

AWS 
分析エンジン
オープン
レイクハウス
フェデレーテッド
カタログアカウント
Iceberg REST API 
で最新のテーブル
メタデータを取得
メタデータ
の読み取り
S3 上のデータにアクセス
1
2
3
リモートIceberg カタログのカタログフェデレーション
Amazon EMR
Lake Formation
Glue Data 
Catalog
Amazon Redshift
Amazon Athena


## p.21

AWS アナリティクススタック
Zero-ETL
カタログ
フェデレーション
クエリ
フェデレーション
データソース
オペレーショナル
データベース
他のデータソース
ビジネス
アプリケーション
データ
ウェアハウス
ストリーミング
Iceberg REST 
カタログ
AWS Glue Data Catalog
テクニカルカタログ
AWS Lake Formation
統合アクセス制御
Amazon SageMaker Catalog
ビジネスカタログ
カタログ&ガバナンス
3P Apache Iceberg 
互換エンジン
AWS Glue
Amazon 
EMR 
Amazon 
Redshift
処理
Amazon 
Athena 
Amazon S3 Amazon S3 Tables
Redshift 
Managed Storage (RMS)
ストレージ
取り込み
AWS Glue
Amazon 
EMR
Amazon 
Data Firehose
Amazon MSF
Amazon MSK
Amazon Bedrock
生成AI / ML
Amazon SageMaker
Unified Studio
Amazon Quick
Agentic AI / BI
活用
ISV 
ソリューション


## p.22

Amazon S3 Tables
フルマネージドの Apache Iceberg テーブル
• コンパクション
スモールファイルを自動的に大きなファイルへ統合し、
クエリパフォーマンスを向上
• スナップショット管理
スナップショットの保持期間を管理し、タイムトラベルを
維持しながらストレージコストを最適化
• 孤立ファイルの削除
テーブルスナップショットから参照されていない
すべてのオブジェクトを特定して削除


## p.23

S3 汎用バケット / S3 テーブルバケットの比較
S3 汎用
バケット
S3 テーブル
バケット
• S3 汎用 バケットと Glue Data Catalog を組み合わせて Iceberg テーブルを構成
• Key / Prefix の設計や、テーブルを構成するデータを直接管理する
• カスタマイズ性が高く、Iceberg や S3 の機能を隅々まで活かすことができる
• Glue Data Catalog によってコストと性能の自動最適化が可能
• 表形式データに最適化されたバケットタイプでフルマネージド Iceberg テーブル
• API のみを通じてテーブルの内部的な仕組みを意識することなく、
安全かつ効率的に Iceberg を利用できる
• S3 テーブルバケット単独でコストと性能の自動最適化機能を備える


## p.24

AWS アナリティクススタック
Zero-ETL
カタログ
フェデレーション
クエリ
フェデレーション
データソース
オペレーショナル
データベース
他のデータソース
ビジネス
アプリケーション
データ
ウェアハウス
ストリーミング
Iceberg REST 
カタログ
AWS Glue Data Catalog
テクニカルカタログ
AWS Lake Formation
統合アクセス制御
Amazon SageMaker Catalog
ビジネスカタログ
カタログ&ガバナンス
3P Apache Iceberg 
互換エンジン
AWS Glue
Amazon 
EMR 
Amazon 
Redshift
処理
Amazon 
Athena 
Amazon S3 Amazon S3 Tables
Redshift 
Managed Storage (RMS)
ストレージ
取り込み
AWS Glue
Amazon 
EMR
Amazon 
Data Firehose
Amazon MSF
Amazon MSK
Amazon Bedrock
生成AI / ML
Amazon SageMaker
Unified Studio
Amazon Quick
Agentic AI / BI
活用
ISV 
ソリューション


## p.25

Iceberg を利用できるクエリエンジン
Amazon EMR
Amazon Redshift
Amazon Athena
AWS Glue
サーバーレスで
スケーラブルな
データ統合サービス
フルマネージドの
ペタバイトスケールの
データウェア
インタラクティブな
サーバーレス分析サービス
Spark、Trino、Flink、Hive 
等のマネージドクラスター


## p.26

ビュー定義＆計算
事前計算済み
データ
I C E B E RG テーブル
クエリ
CREATE MATERIALIZED 
VIEW AS 
   SELECT …
Amazon S3 Amazon 
S3 Tables
AWS Glue 
Data Catalog
AWS Glue のマテリアライズドビュー
Amazon EMR 
Amazon Redshift
Amazon Athena


## p.27

AWS アナリティクススタック
Zero-ETL
カタログ
フェデレーション
クエリ
フェデレーション
データソース
オペレーショナル
データベース
他のデータソース
ビジネス
アプリケーション
データ
ウェアハウス
ストリーミング
Iceberg REST 
カタログ
AWS Glue Data Catalog
テクニカルカタログ
AWS Lake Formation
統合アクセス制御
Amazon SageMaker Catalog
ビジネスカタログ
カタログ&ガバナンス
3P Apache Iceberg 
互換エンジン
AWS Glue
Amazon 
EMR 
Amazon 
Redshift
処理
Amazon 
Athena 
Amazon S3 Amazon S3 Tables
Redshift 
Managed Storage (RMS)
ストレージ
取り込み
AWS Glue
Amazon 
EMR
Amazon 
Data Firehose
Amazon MSF
Amazon MSK
Amazon Bedrock
生成AI / ML
Amazon SageMaker
Unified Studio
Amazon Quick
Agentic AI / BI
活用
ISV 
ソリューション


## p.28

AWS アナリティクススタック
Zero-ETL
カタログ
フェデレーション
クエリ
フェデレーション
データソース
オペレーショナル
データベース
他のデータソース
ビジネス
アプリケーション
データ
ウェアハウス
ストリーミング
Iceberg REST 
カタログ
AWS Glue Data Catalog
テクニカルカタログ
AWS Lake Formation
統合アクセス制御
Amazon SageMaker Catalog
ビジネスカタログ
カタログ&ガバナンス
3P Apache Iceberg 
互換エンジン
AWS Glue
Amazon 
EMR 
Amazon 
Redshift
処理
Amazon 
Athena 
Amazon S3 Amazon S3 Tables
Redshift 
Managed Storage (RMS)
ストレージ
取り込み
AWS Glue
Amazon 
EMR
Amazon 
Data Firehose
Amazon MSF
Amazon MSK
Amazon Bedrock
生成AI / ML
Amazon SageMaker
Unified Studio
Amazon Quick
Agentic AI / BI
活用
ISV 
ソリューション


## p.29

実装パターン


## p.30

Apache Iceberg によるメダリオンアーキテクチャ
• スキーマ進化
ソースの変更への追従
• ACID トランザクション
複数ライターから同時書込
• スナップショット期限管理
低コストでの長期保存
• MERGE INTO
差分データの効率的な反映
• パーティション進化
データ量の変化への適用
• タイムトラベル
変換処理失敗時の切り戻し
• マテリアライズドビュー
集約テーブルを効率的に維持
• Sort / Z-order
クエリパターンに応じた配置
• 自動コンパクション
ファイルを常に最適化
ブロンズ（生データ）
シルバー（クレンジング）
ゴールド（分析）
ポイント
生データを無期限に保持し、
S3 ライフサイクルでGlacier 
ポイント
更新にはMERGE を使用し、
定期的にコンパクションを実施
ポイント
Sort / Z-order コンパクション、
30 日間のスナップショット保持


## p.31

パターン1: バッチETL
Amazon 
Athena
AWS Glue 
ETL
Amazon EMR 
生データ
ステージング
データ
整備済み
データ
Amazon 
SageMaker AI
Amazon Quick
Amazon RDS
Amazon Aurora
Amazon S3
Amazon 
Redshift
Lake Formation
Glue 
Data Catalog
SageMaker 
Catalog
ソース
取り込み
ストレージ
処理
活用
カタログ &
ガバナンス


## p.32

パターン1: バッチETL
Amazon 
Athena
AWS Glue 
ETL
Amazon EMR 
生データ
ステージング
データ
整備済み
データ
Amazon 
SageMaker AI
Amazon Quick
Amazon RDS
Amazon Aurora
Amazon S3
Amazon 
Redshift
Lake Formation
Glue 
Data Catalog
SageMaker 
Catalog
ソース
取り込み
ストレージ
処理
活用
カタログ &
ガバナンス
設計上のポイント
• パーティション進化
データ量やクエリパターンの変化に応じて
パーティション戦略を適用
• レコードレベル更新
MERGE・UPDATE・DELETE でデータを変更し、
読み取り性能重視の場合 Copy-on-Write が最適
運用上のポイント
• ファイルサイズ
128-512MB を目安に設定
• ソート戦略
クエリパターンに応じて Sort / Z-order
• テーブル管理
コンパクション・スナップショット期限・列統計


## p.33

パターン2: ストリーミング
Amazon 
Athena
Amazon 
SageMaker AI
Amazon Quick
Amazon 
Redshift
Lake Formation
Glue 
Data Catalog
SageMaker 
Catalog
ソース
取り込み
ストレージ
処理
活用
カタログ &
ガバナンス
その他
イベントソース
Amazon MSF
Stream processing
Data Firehose
Streaming Sink
Amazon MSK
S3 Tables
Amazon S3


## p.34

パターン2: ストリーミング
Amazon 
Athena
Amazon 
SageMaker AI
Amazon Quick
Amazon 
Redshift
Lake Formation
Glue 
Data Catalog
SageMaker 
Catalog
ソース
取り込み
ストレージ
処理
活用
カタログ &
ガバナンス
その他
イベントソース
Amazon MSF
Stream processing
Data Firehose
Streaming Sink
Amazon MSK
S3 Tables
Amazon S3
設計上のポイント
• スモールファイル前提の設計
シャッフルなしで書き込みレイテンシを最小化し、
コールドパーティションをコンパクション
• Merge-on-Read を検討
読み取りエンジンの対応状況により採用判断、
読み取り前にコンパクションで統合も選択肢
• ファイルフォーマットの選択
書き込み性能重視の場合 Avro で書き込み、
コンパクション時にParquet へ変換
運用上のポイント
• 定期的なコンパクション
自動コンパクションの活用
• スナップショットの期限管理
メタデータの肥大化を防止
• 競合の監視
コミットリトライ率を追跡し、競合増加時に
並行度を調整


## p.35

• 従来のデータレイクの課題や Agentic AI の発展により、
データ基盤としてレイクハウスが求められている
• Apache Iceberg はそれを支えるオープンテーブルフォーマット
• AWS アナリティクススタックがデータの取り込みから活用まで
各レイヤーで Apache Iceberg をサポート
• Glue Data Catalog・S3 Tables 等で運用負荷を最小化
• ユースケースに応じた取り込みパターンの選択が重要
• バッチETL とストリーミングでそれぞれの設計・運用上の
プラクティスを参考に構築
まとめ


## p.36

Ask the Speaker
こちらのRoom 後方の外側にございます、
「Ask the Speaker」カウンターまでお越しください
松岡勝也
アマゾンウェブサービスジャパン合同会社
Room


## p.37

本セッションのアンケートへ
ご協力をお願いします
Please give us your feedback
Thank you!
ANT355
