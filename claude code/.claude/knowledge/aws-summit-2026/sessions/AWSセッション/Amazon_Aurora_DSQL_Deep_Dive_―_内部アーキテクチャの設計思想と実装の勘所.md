---
title: "Amazon Aurora DSQL Deep Dive ― 内部アーキテクチャの設計思想と実装の勘所"
category: "AWSセッション"
session_id: "DAT338"
pages: 111
topics: ["アーキテクチャ/サーバーレス"]
services: ["AWS CloudTrail", "AWS Lambda", "Amazon Aurora", "Amazon DynamoDB", "Amazon RDS"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/AWSセッション/Amazon Aurora DSQL Deep Dive ― 内部アーキテクチャの設計思想と実装の勘所.pdf"
---
# Amazon Aurora DSQL Deep Dive ― 内部アーキテクチャの設計思想と実装の勘所


## p.1

DAT338
Amazon Aurora DSQL Deep Dive
― 内部アーキテクチャの設計思想と実装の勘所
永末健太
アマゾンウェブサービスジャパン合同会社


## p.2

自己紹介
永末健太
Database Specialist Solutions Architect
エンタープライズのお客様を中心にデータベースを
AWS 上に実装する際の技術的な課題解決を支援しています。
好きなAWS サービス
Amazon Aurora
DynamoDB
2


## p.3

本セッションの対象者
•
対象
•
分散データベースやサーバーレスアーキテクチャに関心のある方
•
データベースのスケーラビリティや可用性に課題感を持たれている方
•
この話を聞いて
•
Aurora DSQL のアーキテクチャの特徴を理解する
•
Aurora DSQL を使ったアプリケーション開発で意識すべき点を把握する
3


## p.4

• サーバーレスデータベースの必要性
• Aurora DSQL 概要
• アーキテクチャDive Deep
• 認証と認可
• コードサンプル
• パフォーマンス
• 考慮事項
• アーキテクチャの設計思想とベストプラクティス
• まとめ
アジェンダ
4


## p.5

サーバーレスデータベースの必要性


## p.6

サーバーレスアプリに向くデータベースは？
Amazon 
DynamoDB
Amazon RDS
Amazon 
Aurora
Amazon 
Aurora 
Serverless
6


## p.7

サーバーレスアプリに向くデータベースは？
Amazon RDS
Amazon 
Aurora
Amazon 
Aurora 
Serverless
Amazon 
DynamoDB
7


## p.8

サーバーレスアプリに向くデータベースは？
Amazon 
DynamoDB
Amazon 
Aurora
Amazon 
Aurora 
Serverless
Amazon RDS
8


## p.9

サーバーレスアプリに向くデータベースは？
Amazon 
DynamoDB
Amazon RDS
Amazon 
Aurora 
Serverless
Amazon 
Aurora
9


## p.10

サーバーレスアプリに向くデータベースは？
Amazon 
DynamoDB
Amazon RDS
Amazon 
Aurora
Amazon 
Aurora 
Serverless
10


## p.11

•
Amazon DynamoDB と同じくらいサーバーレス
•
複数テーブルにまたがる複雑なトランザクションなど
リレーショナルデータベースのメリットを提供する
上記を両立するAWS データベースサービスは作れないか？
サーバーレスアプリに向くデータベースは？
11


## p.12

Aurora DSQL の登場


## p.13

Aurora DSQL とは？
1
2
3
4
あらゆる規模で強い整合性
マルチリージョンでアクティブ-アクティブ
（99.99% / 99.999%）
自動スケーリング、インフラ管理不要
サーバーレス分散SQL データベース
13


## p.14

Aurora DSQL を選ぶべきケース
1
2
3
4
PostgreSQL 互換：使い慣れたツールとSQL
イベント駆動型・スパイクトラフィックに最適
サーバーレス/ マイクロサービスパターンに適合
ACID 対応トランザクションワークロード
14


## p.15

Aurora DSQL 概要


## p.16

マルチAZ アクティブ-アクティブ
3つのAZ にデータをレプリケーション
読み書き両方を処理する1つのエンドポイント
インスタンスのサイジング・スケーリング・管理不要
パッチ適用やアップグレードによるダウンタイムなし
ストレージとコンピューティングは自動スケーリング
99.99% の可用性を目指した設計
シングルリージョンクラスター
Region
Customer VPC
Application
Aurora DSQL Cluster
16


## p.17

分散アーキテクチャ
シングルリージョンクラスター
Region
Customer VPC
Application
コンピュート(クエリ処理) レイヤー
トランザクションログ(コミット) レイヤー
ストレージレイヤー
Endpoint
AZ1
AZ2
AZ3
17


## p.18

シングルリージョンのメリットに加えて：
両リージョンで強い整合性
両リージョンが対等
ープライマリ/セカンダリの区別なし
両リージョンで読み書き可能
99.999% の可用性を目指した設計
リージョン全体の障害時でも強いデータ整合性
を保つ完全自動化された障害復旧
マルチリージョンクラスター
Region
Customer VPC
Application
Aurora DSQL
Witness Region
Replicated Journal
Region
Customer VPC
Application
Aurora DSQL
<<synchronous>>
18


## p.19

Aurora DSQL のコンポーネント
Aurora DSQL
F R O N T E N D
Q U E R Y
P R O C E S S O R
A D J U D I C A T O R
J O U R N A L
C R O S S B A R
S T O R A G E
Region
Virtual private cloud (VPC)
Endpoint
クライアントから
の接続を終端する
レイヤー
PostgreSQL に由来
し、クエリーを処理
するレイヤー
トランザクシン間の
競合を検知する
レイヤー
トランザクション
ログを管理する
レイヤー
各パーティションの
トランザクション
ログをグローバルに
並び替え、ストレージ
へ連携
読み取りに最適化
されたストレージ
エンジンレイヤー
IAM
期限付き認証トークン
接続時にトークンを
使って認証
19


## p.20

Hi, Lisa Nix
Price
Dietary
Rating
PizzaOnPrem
2    (10000+)
$10.90 delivery
Sands Expo, Las Vegas Blvd.
Las Vegas, Nevada
Full Stack Pizza Co.
4.5    (3000)
$1.50 delivery
Papa Jeff’s
4    (6000+)
$0 delivery
READ 
transaction
20


## p.21

WHERE rating >= 4.0;
Hi, Lisa Nix
Price
Dietary
Rating
Sands Expo, Las Vegas Blvd.
Las Vegas, Nevada
Full Stack Pizza Co.
4.5    (3000)
$1.50 delivery
Werneroni
5    (11000+)
$0.50 delivery
PizzaOnPrem
2    (10000+)
$10.90 delivery
Papa Jeff’s
4    (6000+)
$0 delivery
Two Pizza team
3.5    (800+)
$1.50 delivery
2
3
4
5
A P P L Y
4
5
SELECT * FROM Restaurants
21


## p.22

Hi, Lisa Nix
Price
Dietary
Rating
Sands Expo, Las Vegas Blvd.
Las Vegas, Nevada
Full Stack Pizza Co.
4.5    (3000)
$1.50 delivery
Two Pizza team
3.5    (800+)
$1.50 delivery
Werneroni
5    (11000+)
$0.50 delivery
PizzaOnPrem
2    (10000+)
$10.90 delivery
Papa Jeff’s
4    (6000+)
$0 delivery
2
3
4
5
A P P L Y
4
5
FRONTEND
0 9 : 3 4 : 2 1 : 8 0 0 5 8 82 3 0 0
CLIENT
LOCAL 
CLOCK
QUERY
PROCESSOR
T x S T A R T T I M E
22


## p.23

Hi, Lisa Nix
Price
Dietary
Rating
Sands Expo, Las Vegas Blvd.
Las Vegas, Nevada
Full Stack Pizza Co.
4.5    (3000)
$1.50 delivery
Two Pizza team
3.5    (800+)
$1.50 delivery
Werneroni
5    (11000+)
$0.50 delivery
PizzaOnPrem
2    (10000+)
$10.90 delivery
Papa Jeff’s
4    (6000+)
$0 delivery
2
3
4
5
A P P L Y
4
5
0 9 : 3 4 : 2 1 : 8 0 0 5 8 82 3 0 0
T x S T A R T T I M E
FRONTEND
CLIENT
LOCAL 
CLOCK
QUERY
PROCESSOR
23


## p.24

Hi, Lisa Nix
Price
Dietary
Rating
Sands Expo, Las Vegas Blvd.
Las Vegas, Nevada
Full Stack Pizza Co.
4.5    (3000)
$1.50 delivery
Two Pizza team
3.5    (800+)
$1.50 delivery
Werneroni
5    (11000+)
$0.50 delivery
PizzaOnPrem
2    (10000+)
$10.90 delivery
Papa Jeff’s
4    (6000+)
$0 delivery
2
3
4
5
A P P L Y
4
5
FRONTEND
CLIENT
QUERY
PROCESSOR
C R O S S B A R
STORAG E
SHARD 
MAP
STORAG E
STORAG E
A D J U D I C A T O R
A D J U D I C A T O R
J O U R N A L
J O U R N A L
READ PATH
24


## p.25

Hi, Lisa Nix
Price
Dietary
Rating
Sands Expo, Las Vegas Blvd.
Las Vegas, Nevada
Full Stack Pizza Co.
4.5    (3000)
$1.50 delivery
Two Pizza team
3.5    (800+)
$1.50 delivery
Werneroni
5    (11000+)
$0.50 delivery
PizzaOnPrem
2    (10000+)
$10.90 delivery
Papa Jeff’s
4    (6000+)
$0 delivery
2
3
4
5
A P P L Y
4
5
C R O S S B A R
A D J U D I C A T O R
A D J U D I C A T O R
J O U R N A L
J O U R N A L
FRONTEND
QUERY
PROCESSOR
STORAG E
STORAG E
STORAG E
READ PATH
CLIENT
25


## p.26

Hi, Lisa Nix
Price
Dietary
Rating
Sands Expo, Las Vegas Blvd.
Las Vegas, Nevada
Full Stack Pizza Co.
4.5    (3000)
$1.50 delivery
Two Pizza team
3.5    (800+)
$1.50 delivery
Werneroni
5    (11000+)
$0.50 delivery
PizzaOnPrem
2    (10000+)
$10.90 delivery
Papa Jeff’s
4    (6000+)
$0 delivery
CLIENT
FRONTEND
QUERY
PROCESSOR
A D J U D I C A T O R
A D J U D I C A T O R
J O U R N A L
J O U R N A L
C R O S S B A R
READ PATH
26


## p.27

Interactive
transaction


## p.28

SELECT * FROM Restaurants WHERE rating >= 
4.0;
BEGIN;
SELECT * FROM Items WHERE restaurant_id
= 1;
SELECT * FROM Items WHERE item_id = 3;
UPDATE Items SET qty = qty – 1 WHERE item_id
= 3;
INSERT INTO Orders VALUES (NOW(), 3, 1, ...);
UPDATE Users SET last_order = NOW() WHERE id 
= 7;
COMMIT;
Hi, Lisa Nix
Price
Dietary
Rating
Sands Expo, Las Vegas Blvd.
Las Vegas, Nevada
Full Stack Pizza Co.
4.5    (3000) $1.50 delivery
3.5    (800+) $1.50 delivery
Werneroni
5    (11000+) $0.50 delivery
2    (10000+) $10.90 delivery
Papa Jeff’s
4    (6000+)
$0 delivery
Full Stack 
Pizza Co.
4.5    (3000) $1.50 delivery
Pizza Pies
Margherita
$10.99
Mozzarella cheese, 
tomato base
Pepperoni
$13.99
Mozzarella cheese, 
pepperoni, tomato base
Vegetarian Hot
$12.99
Mozzarella cheese, 
onions, green chillis
Hawaiian
$13.99
Mozzarella cheese, ham, 
pineapple, tomato base
Herring
$8.99
Pickled herring, onion, 
egg, potato base
Vegetarian Hot
$12.99
Mozzarella cheese, onions, green 
chillis, jalapeños, green peppers, 
red peppers, black olives
Top Rated
P L A C E O R D E R
Size
9”
12
”
+ $3.99
15
”
+ $5.99
Success!
Your pizza is on its way, Lisa! 
T R A C K M Y O R D E R
28


## p.29

Hi, Lisa Nix
Price
Dietary
Rating
Sands Expo, Las Vegas Blvd.
L a s V e g a s , Ne va da
Full Stack Pizza Co.
4.5    (3000)
$1.50 delivery
3.5    (800+)
$1.50 delivery
Werneron
i
5    (11000+) $0.50 delivery
2    (10000+) $10.90 delivery
Papa Jeff’s
4    (6000+)
$0 delivery
FRONTEND
CLIENT
C R O S S B A R
STORAGE
STORAGE
STORAGE
A D J U D I C A T O R
A D J U D I C A T O R
J O U R N A L
J O U R N A L
WRITE
PATH
0
C R O S S B A R
A D J U D I C A T O R
J O U R N A L
J O U R N A L
A D J U D I C A T O R
SELECT
BEGIN
SELECT
UPDATE
INSERT INTO
UPDATE
COMMIT
QUERY
PROCESSOR
29


## p.30

The Query 
Processo
r
    
HOST
FIRECRACKER 
microVM
BARE METAL 
INSTANCE
QUERY 
PROCESSOR


## p.31

WRITE PATH
STORAGE
STORAGE
STORAGE
READ PATH
QUERY
id
restauran
t
ratin
g
1
Full Stack Pizza 
Co. 
4.5
2
Papa Jeff’s
4
3
Werneroni
5
S N A P S H O T
01トランザクション開始時点のデータ断面
(Snapshot Isolation)
31


## p.32

WRITES
02 書き込みセットをQP 上に一時保持
W R I T E S E T
WRITE PATH
STORAGE
STORAGE
STORAGE
READ PATH
32


## p.33

The Adjudicator
    
ADJUDICATOR
T R A N S A C T I O N A
T R A N S A C T I O N B
33


## p.34

QP がトランザクションペイロードを生成
ADJUDICATOR
T R A N S A C T I O N
A
τstart
write 
set
post
images
Q U E R Y
P R O C E S S O R
34
ペイロード


## p.35

ADJUDIC ATOR
T R A N S A C T I O N A
τ s t a r t
T R A N S A C T I O N B
τ s t a r t
1 0 : 0 9 : 3 3 . 9 0 3 7 4 6 8 6 6
1 0 : 0 9 : 3 5 . 5 4 5 9 4 2 6 5 0
同時実行トランザクション
35
ペイロード
ペイロード


## p.36

Adjudicator が書き込みの競合を検知
A DJU DIC A TOR
T R A N S A C T I O N A
τstart
1 0 : 0 9 : 3 3 . 9 0 3 7 4 6 8 6 6
SELECT * FROM Restaurants WHERE rating >= 4.0;
BEGIN;
SELECT * FROM Items WHERE restaurant_id = 1;
UPDATE Items SET qty = qty – 1 WHERE item_id = 
3;
COMMIT;
INSERT INTO Orders VALUES (NOW(), 3, 1, ...);
UPDATE Users SET last_order = NOW() WHERE id = 
7;
UPDATE Items SET qty = qty – 1 WHERE item_id = 
3;
INSERT INTO Orders VALUES (NOW(), 3, 1, ...);
1
T R A N S A C T I O N A
T R A N S A C T I O N B
τstart
1 0 : 0 9 : 3 5 . 5 4 5 9 4 2 6 5 0
SELECT * FROM Restaurants WHERE rating >= 4.0;
BEGIN;
SELECT * FROM Items WHERE restaurant_id = 1;
UPDATE Items SET qty = qty – 1 WHERE item_id = 
3;
COMMIT;
INSERT INTO Orders VALUES (NOW(), 3, 1, ...);
UPDATE Users SET last_order = NOW() WHERE id = 
21;
UPDATE Items SET qty = qty – 1 WHERE item_id = 
3;
INSERT INTO Orders VALUES (NOW(), 3, 1, ...);
2
T R A N S A C T I O N B
36
ペイロード
ペイロード


## p.37

競合がない場合はCommit 続行
ペイロード
ペイロード
τstart
1 0 : 0 9 : 3 3 . 9 0 3 7 4 6 8 6 6
SELECT * FROM Restaurants WHERE rating >= 
4.0;
BEGIN;
SELECT * FROM Items WHERE restaurant_id = 
1;
UPDATE Items SET qty = qty – 1 WHERE item_id
= 3;
COMMIT;
INSERT INTO Orders VALUES (NOW(), 3, 1, ...);
UPDATE Users SET last_order = NOW() WHERE id 
= 7;
T R A N S A C T I O N A
τstart
1 0 : 0 9 : 3 5 . 5 4 5 9 4 2 6 5 0
SELECT * FROM Restaurants WHERE rating >= 
4.0;
BEGIN;
SELECT * FROM Items WHERE restaurant_id = 
2;
UPDATE Items SET qty = qty – 1 WHERE item_id
= 7;
COMMIT;
INSERT INTO Orders VALUES (NOW(), 7, 1, ...);
UPDATE Users SET last_order = NOW() WHERE id 
= 21;
T R A N S A C T I O N B
A DJU DIC A TOR
37


## p.38

Durability


## p.39

E R Y
E S S O R
W R I T E
P A T H
INSERT INTO
J O U R N A L
J O U R N A L
J O U R N A L
J O U R N A L
C R O S S B A R
C R O S S B A R
A D J U D I C A T O R
A D J U D I C A T O R
T x P A Y L O A D
S T O R A G E
S T O R A G E
S T O R A G E
永続性はストレージ
レイヤーが担う
39


## p.40

F R O N T E N D
Q U E R Y
P R O C E S S O R
S T O R A G E
S T O R A G E
S T O R A G E
W R I T E
P A T H
INSERT INTO
J O U R N A L
J O U R N A L
J O U R N A L
J O U R N A L
C R O S S B A R
C R O S S B A R
A D J U D I C A T O R
A D J U D I C A T O R
T x P A Y L O A D
永続性はJournal が
担う
40


## p.41

STORAGE
STORAGE
STORAGE
SELECT
UPDATE
FRONTEND
QUERY
PROCESSOR
T x P A Y L O A D
WRITE
PATH
C R O S S B A R
A D J U D I C A T O R
A D J U D I C A T O R
J O U R N A L
J O U R N A L
41


## p.42

τstart
τcommit
42


## p.43

C L O C K B O U N D
Q U E R Y
P R O C E S S O R
Amazon Time Sync Service
43


## p.44

アーキテクチャDive Deep


## p.45

D S Q L
アクティブーアクティブ
水平スケール
Simple  by 
design
Aurora DSQL
Network Load Balancer
Your 
application
…
Scale out, not up
Query 
Processor
Query 
Processor
Query 
Processor
45


## p.46

C O N N E C T I N G : D S Q L
ハードウェアレベルの仮想化
ミリ秒で起動
最小限のオーバーヘッド
Firecracker
Warm Pool
μVM
Agent
μVM
μVM
μVM
μVM
μVM
46


## p.47

C O N N E C T I N G : D S Q L
ハードウェアレベルの仮想化
ミリ秒で起動
最小限のオーバーヘッド
Firecracker
Warm Pool
μVM
Agent
μVM
μVM
μVM
μVM
μVM
zjthp5qbrepxud6tbkbyxcun24.dsql.us-west-2.on.aws
μVM
47


## p.48

M E M O R Y : D S Q L
各μVM は完全なOS 
接続は低コストである必要がある
Query 
Processor in 
Firecracker
Warm Pool
μVM
Agent
-
Linux
-
Postgres server
-
Sundry services
Memory usage: 700MiB
48


## p.49

M E M O R Y : D S Q L
各μVM は完全なOS 
接続は低コストである必要がある
Query 
Processor in 
Firecracker
Warm Pool
μVM
Agent
-
Linux
-
Postgres server
-
Sundry services
μVM
μVM
μVM
Memory usage: 2.8GiB
49


## p.50

M E M O R Y : D S Q L
μVM はスナップショットから起動
メモリページを複数μVM 間で共有
Snapstart
Warm Pool
μVM
Agent
-
Linux
-
Postgres server
-
Sundry services
Memory usage: 700MiB
Memory
50


## p.51

M E M O R Y : D S Q L
μVM はスナップショットから起動
メモリページを複数μVM 間で共有
Snapstart
Warm Pool
μVM
Agent
-
Linux
-
Postgres server
-
Sundry services
Memory usage: 700MiB
Memory
Disk
51


## p.52

M E M O R Y : D S Q L
μVM はスナップショットから起動
メモリページを複数μVM 間で共有
Snapstart
Warm Pool
μVM
Agent
-
Linux
-
Postgres server
-
Sundry services
Memory usage: 700MiB
Memory
Disk
700MiB file on disk
52


## p.53

M E M O R Y : D S Q L
μVM はスナップショットから起動
メモリページを複数μVM 間で共有
Snapstart
Warm Pool
μVM
Agent
Memory
Disk
μVM
53


## p.54

M E M O R Y : D S Q L
μVM はスナップショットから起動
メモリページを複数μVM 間で共有
Snapstart
Warm Pool
μVM
Agent
Memory
Disk
μVM
Memory
μVM
54


## p.55

M E M O R Y : D S Q L
μVM はスナップショットから起動
メモリページを複数μVM 間で共有
Snapstart
Warm Pool
μVM
Agent
Memory
Disk
μVM
Memory
μVM
55


## p.56

R O U T I N G : D S Q L
認証・認可
配置
Relay
Aurora DSQL
Network Load Balancer
zjthp5qbrepxud6tbkbyxcun24.dsql.us-west-2.on.aws
Token
AWS Identity and Access 
Management (IAM)
Relay
AWS CloudTrail
56
Your 
application


## p.57

R O U T I N G : D S Q L
認証・認可
配置
Relay
Aurora DSQL
Network Load Balancer
zjthp5qbrepxud6tbkbyxcun24.dsql.us-west-2.on.aws
Relay
57
Your 
application


## p.58

R O U T I N G : D S Q L
認証・認可
配置
Relay
Aurora DSQL
Network Load Balancer
zjthp5qbrepxud6tbkbyxcun24.dsql.us-west-2.on.aws
Relay
58
Your 
application


## p.59

R O U T I N G : D S Q L
認証・認可
配置
Relay
Aurora DSQL
Network Load Balancer
zjthp5qbrepxud6tbkbyxcun24.dsql.us-west-2.on.aws
Relay
59
Your 
application


## p.60

R O U T I N G : D S Q L
認証・認可
配置
Relay
Aurora DSQL
Network Load Balancer
zjthp5qbrepxud6tbkbyxcun24.dsql.us-west-2.on.aws
Relay
60
Your 
application


## p.61

R O U T I N G : D S Q L
認証・認可
配置
Relay
Aurora DSQL
Network Load Balancer
zjthp5qbrepxud6tbkbyxcun24.dsql.us-west-2.on.aws
Relay
61
Your 
application


## p.62

C O N N E C T I N G : D S Q L
同一AZ を優先選択
障害時は自動フォールバック
Zonal routing
Load Balancer
AWS Cloud
Availability Zone 1
Availability Zone 2
Availability Zone 3
Aurora DSQL
62


## p.63

C O N N E C T I N G : D S Q L
同一AZ を優先選択
障害時は自動フォールバック
Zonal routing
Load Balancer
AWS Cloud
Availability Zone 1
Availability Zone 2
Availability Zone 3
Aurora DSQL
63


## p.64

C O N N E C T I N G : D S Q L
同一AZ を優先選択
障害時は自動フォールバック
Zonal routing
Load Balancer
AWS Cloud
Availability Zone 1
Availability Zone 2
Availability Zone 3
Aurora DSQL
64


## p.65

C O N N E C T I N G : D S Q L
同一AZ を優先選択
障害時は自動フォールバック
Zonal routing
Load Balancer
AWS Cloud
Availability Zone 1
Availability Zone 2
Availability Zone 3
Aurora DSQL
65


## p.66

C O N N E C T I N G : D S Q L
同一AZ を優先選択
障害時は自動フォールバック
Zonal routing
Load Balancer
AWS Cloud
Availability Zone 1
Availability Zone 2
Availability Zone 3
Aurora DSQL
66


## p.67

C O N N E C T I N G : D S Q L
同一AZ を優先選択
障害時は自動フォールバック
Zonal routing
Load Balancer
AWS Cloud
Availability Zone 1
Availability Zone 2
Availability Zone 3
Aurora DSQL
67


## p.68

C O N N E C T I N G : D S Q L
同一AZ を優先選択
障害時は自動フォールバック
Zonal routing
Load Balancer
AWS Cloud
Availability Zone 1
Availability Zone 2
Availability Zone 3
Aurora DSQL
68


## p.69

認証と認可


## p.70

AWS Signature v4 アルゴリズムを使用
Aurora DSQL の認証
1
2
3
4
パスワード不要
トークンを使用して認証
認証トークンはAWS SDK を使用して
ローカルの高速暗号処理で生成
70


## p.71

Aurora DSQL の認証
71


## p.72

Aurora DSQL の認証
72


## p.73

psql でのAurora DSQL 認証
73


## p.74

コードサンプル


## p.75

サンプルアプリケーション
Amazon 
API Gateway
Amazon 
Aurora
Users
Orders
AWS Cloud
AWS Lambda
Order API
AWS Lambda
AWS Lambda
AWS Lambda
Create Order
Get Orders By 
Date Range
Get Orders 
By ID
Update Order 
Status
75


## p.76

AWS SAM によるInfrastructure as Code
76


## p.77

AWS SAM によるInfrastructure as Code
77


## p.78

AWS SAM によるInfrastructure as Code
78


## p.79

AWS SAM によるInfrastructure as Code
79


## p.80

AWS SAM によるInfrastructure as Code
80


## p.81

AWS SAM によるInfrastructure as Code
81


## p.82

AWS SAM によるInfrastructure as Code
82


## p.83

AWS SAM によるInfrastructure as Code
83


## p.84

JDBC コネクションプールライブラリのHikariCP
84


## p.85

JDBC コネクションプールライブラリのHikariCP
85


## p.86

JDBC コネクションプールライブラリのHikariCP
86


## p.87

JDBC コネクションプールライブラリのHikariCP
87


## p.88

JDBC コネクションプールライブラリのHikariCP
88


## p.89

Aurora DSQL コネクター
IAM トークン生成を自動処理
1
2
3
パスワード管理不要
既存のPython、Node.js、JDBC、Go、Ruby、
PHP、.Net、Rust コネクターで動作
4
トランザクションの競合発生時における
リトライ処理を自動化
89


## p.90

Aurora DSQL JDBC コネクターを使用した
HikariCP 接続プール
90


## p.91

Aurora DSQL JDBC コネクターを使用した
HikariCP 接続プール
91


## p.92

Hibernate
ORM (Object-Relational Mapping) 
フレームワーク対応状況
1
2
3
SQLAlchemy
Django
4
Tortoise ORM
92


## p.93

パフォーマンス


## p.94

再掲）サンプルアプリケーション
Amazon 
API Gateway
Amazon 
Aurora
Users
Orders
AWS Cloud
AWS Lambda
Order API
AWS Lambda
AWS Lambda
AWS Lambda
Create Order
Get Orders By 
Date Range
Get Orders 
By ID
Update Order 
Status
94


## p.95

パフォーマンス測定のターゲット
各シナリオのLambda 関数パフォーマンスを確認
1
2
3
4
5
Lambda 関数はJava で記述
シングルリージョン・マルチリージョン両方で測定
Lambda ウォームスタート時間のみに焦点
99 パーセンタイルまでに焦点
95


## p.96

パフォーマンス測定のターゲット対象外
他のAmazon データベースとのパフォーマンス比較
1
2
3
大規模ワークロード下でのパフォーマンス
スケールアウト中のパフォーマンス
（ストレージ、QP、Adjudicator の追加時）
96


## p.97

1件の注文作成（2つの注文アイテム付き）
同一トランザクション内
で合計3 回のINSERT 
0.00
10.00
20.00
30.00
40.00
50.00
60.00
single-region cluster
multi-region cluster
p50
p75
p90
p99
ms
97


## p.98

ID で注文取得（2つのアイテム取得）
2 回のSELECT
ms
0.00
2.00
4.00
6.00
8.00
10.00
12.00
14.00
16.00
18.00
20.00
cluster
p50
p75
p90
p99
98


## p.99

考慮事項


## p.100

Aurora DSQL の主要サービスクォータ
クォータ
値
変更可否
最大接続数
10,000
最大トランザクション時間
5 分
最大接続時間
60 分
トランザクション内の最大変更行数
3,000 行
トランザクション内の最大変更サイズ
10 MiB
100
https://docs.aws.amazon.com/aurora-dsql/latest/userguide/CHAP_quotas.html


## p.101

サポートされていないオブジェクト
• デフォルト値を持つカラム
• 一時テーブル
• トリガー
• パーティション
• SQL 以外の言語で記述された関数
101


## p.102

VACUUM (不要)
サポートされていない制約とコマンド
TRUNCATE
Foreign keys
1
2
3
102


## p.103

PostgreSQL 拡張機能は未サポート
pg_stat_statements
1
2
3
PGAudit
PGVector
要望の多い下記拡張機能を含め、現時点では利用できません
103


## p.104

アーキテクチャの設計思想と
ベストプラクティス


## p.105

Firecraker microVM 採用のメリット
Firecracker microVM でQP を実行することで：
• ウォームプールにより非常に高速な起動時間
• VM のCPU とメモリ使用量を拡大・縮小する能力
• リソースのクリーンアップが容易
• VM は60 分の固定期間後に終了
105


## p.106

トランザクション制限の設計意図
• トランザクション最大時間5 分の制限により：
• コミット時のAdjudicator の競合検出作業が減少し、マルチリージョン
書き込みのクエリパフォーマンスが安定
• 古い参照を破棄することでMVCC ガベージコレクションが容易に
• トランザクション内の最大変更行数3,000 行
• メモリバッファの1 回のフラッシュのみで安定したクエリパフォーマンス
106


## p.107

DSQL で最高のパフォーマンスを達成するための
アドバイス
多くのトランザクションを並列に行い、QP による水平スケーリングを活用する
小さな行と小さなトランザクションを優先する
マイクロサービスごとに別々のクラスターの使用を検討する
EXPLAIN ANALYZE をプロファイリングツールとして使用する
クライアントサイドのデータベース接続プーリングを使用する
107


## p.108

まとめ


## p.109

Aurora DSQL まとめ
利用する上でのポイントは「並列・小さく・接続プール」
1
2
3
4
5
インフラ管理不要でサーバーレスかつ複雑なSQLを実行可能
Simple by design — トランザクション単位でスケール
制約ではなく、安定性能のための設計
ACID サポート— あらゆる規模で強い整合性（結果整合性ではない）
109


## p.110

Ask the Speaker
こちらのRoom 後方の外側にございます、
「Ask the Speaker」カウンターまでお越しください
永末健太
アマゾンウェブサービスジャパン合同会社
Room


## p.111

本セッションのアンケートへ
ご協力をお願いします
Please give us your feedback
Thank you!
DAT338
