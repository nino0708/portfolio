---
title: "Amazon S3 で切り開く クラウドストレージの未来"
category: "AWSセッション"
session_id: "STG206"
pages: 56
topics: ["その他"]
services: ["AWS Glue", "AWS IAM", "Amazon Athena", "Amazon Bedrock", "Amazon CloudWatch", "Amazon S3", "Amazon SageMaker"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/AWSセッション/Amazon S3 で切り開く クラウドストレージの未来.pdf"
---
# Amazon S3 で切り開く クラウドストレージの未来


## p.1

STG206
Amazon S3 で切り開く
クラウドストレージの未来
佐藤真也
アマゾンウェブサービスジャパン合同会社


## p.2

INNOVATING 
AT SCALE


## p.3

YEARS OF 
EVOLUTION


## p.4

2
1
0
9
8
0
9
8
5
4
3
0
9
8
0
9
8
T
objects
M
requests per 
second
A M A Z O N S 3


## p.5

Amazon S3
S3 Files
S3 Vectors
S3 Tables
S3 Metadata
S3 Express


## p.6

Amazon
S3 Files


## p.7

ファイルベースのワークロードの拡⼤
ゲノミクス &
ライフサイエンス
⾦融
メディア &
コンピュータ
グラフィックス
エージェンティック
アプリケーション
Machine Learning
インタラクティブ分析


## p.8

Amazon S3 
バケット
ファイル
システム


## p.9

N E W
Amazon S3 Files
G E N E R A L A V A I L A B I L I T Y
ファイルシステムアクセスを提供する
最初のクラウドオブジェクトストレージ


## p.10

Amazon  S3 Files の紹介
Amazon S3 バケットへファイルシステムとしてアクセスする
Amazon  S3
バケット
Amazon S3 
Files
新たな AWS リソース
•
バケットやプレフィックスからファイル
システムを作成し、データの複製は不要
•
サーバレス
•
イレブンナインの耐久性
•
マルチアベイラリティゾーン
•
NFS v4 以上をサポート


## p.11

Amazon 
S3 Files
•
ファイルシステム内のデータをインテリジェントに格納
•
ファイルシステムへの変更はファイルアプリケーションに即座に反映
•
ファイルシステムと Amazon S3 バケット間で変更が同期


## p.12

最適化されたパフォーマンス
~1ms
ミリ秒単位のファイル読み取り
パフォーマンス
書き込みは最短 2.7 ms
TB/s+
読み取りスループットは
ファイルシステム合計で
最⼤数 TB/s
クライアントあたり最⼤3 GB/s


## p.13

Amazon S3
S3 Files
S3 Vectors
S3 Tables
S3 Metadata
S3 Express


## p.14

Amazon
S3 Vectors


## p.16

Vector
L E N G T H
W I D T H
0.2
0.1


## p.17

Vector
H E I G H T
0.3
L E N G T H
W I D T H
0.2
0.1


## p.18

Vector
C O L O R
S H A P E
S I Z E
0.2
0.1
0.3


## p.19

Embedding model
0.3
0.1
0.6
0.9
0.2
…


## p.20

~250
ベクトルインデックス
~1MB
( 0 . 1 % )
~300
ベクトルインデックス
~1-2MB 
( 0 . 1 % )
~570,000
ベクトルインデックス
~2,300MB
( 2 3 0 % )
1GB 
画像
1GB 
8K 動画
1GB 
テキスト


## p.21

Amazon S3 Vectors
G E N E R A L A V A I L A B I L I T Y
インデックスあたりの
最⼤ベクトル保存・
クエリ数
最低クエリレイテンシー
ベクトルのアップロード、保存、クエリのコストを最⼤
90% 削減する数⼗億規模のベクトルストア
バケットあたりの
インデックス数、
最⼤ 20 兆ベクトル
をサポート


## p.23

近似最近傍探索
アルゴリズム


## p.26

Amazon 
S3 Vectors
まとめ
•
ベクトルを⽤いることで、特定のテキスト
・画像・動画と関連する情報を検索できる
•
Amazon S3 Vectors により⼤量のベクトル
データをコスト効率よく保存・検索できる


## p.27

Amazon S3
S3 Files
S3 Vectors
S3 Tables
S3 Metadata
S3 Express


## p.28

Amazon 
S3 Tables


## p.29

400K
S3 Tables


## p.30

テーブルレイアウト
db.table1
現在のメタデータ
ポインタ
Iceberg カタログ
Manifest file
Manifest list
Metadata file
s0 s1


## p.31

テーブルレイアウト
db.table1
現在のメタデータ
ポインタ
Manifest file
Manifest file
Iceberg カタログ
Manifest list
Manifest list
Metadata file
s0 s1
Metadata file
s0 s1 s2


## p.32

テーブルレイアウト
db.table1
現在のメタデータ
ポインタ
Metadata f
Iceberg カタログ
Manifest list
Metadata file
s7
Manifest file
Manifest list
Metadata file
s6
Manifest file
Manifest list
Metadata file
…
s5
Manifest file
Manifest list
Metadata file
s0 s1 s2 s3 s4
Manifest file
Manifest list
Metadata file
s0 s1 s2 s3
Manifest file
Manifest list
Metadata file
s0 s1 s2
Manifest file
Manifest list
Metadata file
s0 s1
Manifest file
4
…
…
…
Manifest list
Manifest file


## p.33

継続的な最適化
基盤となる Parquet ファイルの⾃動コンパクション
[Blog] How Amazon S3 Tables use compaction 
to improve query performance


## p.34

R E : I N V E N T 2 0 2 5
Amazon S3 Tables 
Intelligent-Tiering
⾃動コスト最適化


## p.35

Archive Instant Access
90+ ⽇
Frequent Access
0 – 30 ⽇
Infrequent Access
30 – 90 ⽇
40%
コスト最適化
68%
コスト最適化
⾃動コスト最適化
最⼤
80%
最適化


## p.36

階層ごとのメンテナンス
メンテナンスは
アクセスとみなされない
コールドデータのまま
最⼤
80%
最適化


## p.37

アクセス許可の簡素化
すぐに取り組みたい場合
ガバナンスを強化したい場合
AWS IAM 許可
AWS Glue Data Catalog
Amazon Athena / EMR / Redshift で分析
AWS Lake Formation を有効化
テーブルまたはプリンシパルごとのルール
きめ細かなアクセス制御
Amazon S3 Tables
同じデータ同じデータパス
Amazon S3 Tables または既存 Iceberg マテリアライズドビューに対する AWS IAM ベースの許可を提供開始
N E W


## p.38

Amazon 
S3 Tables
まとめ
•
Iceberg は、従来のデータレイクの課題を
解決するためにデータの持ち⽅を⼯夫
•
Amazon S3 Tables はマネージドな Iceberg 
テーブルを実現できるサービス
•
データコンパクションや、Intelligent-
Tiering を通じて、コストと性能を最適化


## p.39

Amazon 
S3 Metadata
データに関するデータ


## p.40

複数のデータ
汎⽤バケット
Amazon  S3
メタデータを設定
AWS が管理する
テーブルバケット
リアルタイム
インベントリデータ
ジャーナルデータ
Amazon S3 Metadata テーブル


## p.41

承認パイプライン上のベンダー契約
書で、「承認済み」状態であり、過
去 30 ⽇以内にヨーロッパで追加さ
れたもの
D O C U M E N T S
過去 7 ⽇以内に追加された、
データ分類タグが「Restricted」で
アプリケーションソースタグが
「Inventory」の Apache Parquet
ファイル
D A T A F I L E S
2024 年 1 ⽉ 1 ⽇以降に追加
された、1 MB から 10 MBの
間の画像
I M A G E S A N D V I D E O
データを理解するための仕組み


## p.42

ユースケース: 監査とコンプライアンス
どのようなデータが
削除されましたか︖
SELECT bucket, key, version_id
FROM "s3tablescatalog/aws-
s3"."b_mybucket"."journal”
WHERE record_timestamp > 
(current_date 
- interval ‘1’ day)
AND record_type = 'DELETE’
AND 
is_delete_marker = TRUE;
DELETE
BOB
ALICE
CAROL
PUT
PUT


## p.43

ユースケース: リッチなコンテキストの保存と検索
Amazon S3 オブジェクトに付与する annotation を
Amazon S3 Metadata の annotation テーブルに格納
N E W
そのオブジェクトは、
どのようなデータですか︖
June 16, 2026


## p.44

Amazon S3
S3 Files
S3 Vectors
S3 Tables
S3 Metadata
S3 Express


## p.45

Amazon 
S3 Express
ディレクトリバケット


## p.46

Amazon 
S3 Express 
の進化
料⾦の値下げ
最⼤ 2M/s ものリクエスト
オブジェクトのリネーム
アクセスポイント
Amazon CloudWatch メトリクス
インベントリ
M A R C H
A P R I L


## p.47

Amazon S3
S3 Files
S3 Vectors
S3 Tables
S3 Metadata
S3 Express


## p.48

Amazon S3 
Access Points 
for FSx


## p.49

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
Enterprise Data Center
Filers
Servers
Apps
FSx


## p.50

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
FSx
Enterprise Data Center
Filers
Servers
Apps


## p.51

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
FSx
Enterprise Data Center
Filers Servers
Apps
AWS Glue
Amazon SageMaker
Amazon Athena
Amazon Bedrock
同じデータをクラウドネイティブアプリから利⽤する


## p.52

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
FSx
Enterprise Data Center
Filers Servers
Apps
S3 Access Points
AWS Glue
Amazon SageMaker
Amazon Athena
Amazon Bedrock
同じデータをクラウドネイティブアプリから利⽤する


## p.53

Amazon S3
S3 Files
S3 Vectors
S3 Tables
S3 Metadata
S3 Express


## p.54

The future of cloud storage


## p.55

Ask the Speaker
こちらのRoom 後⽅の外側にございます、
「Ask the Speaker」カウンターまでお越しください
佐藤真也
アマゾンウェブサービスジャパン合同会社
Room


## p.56

本セッションのアンケートへ
ご協⼒をお願いします
Please give us your feedback
Thank you!
STG206
