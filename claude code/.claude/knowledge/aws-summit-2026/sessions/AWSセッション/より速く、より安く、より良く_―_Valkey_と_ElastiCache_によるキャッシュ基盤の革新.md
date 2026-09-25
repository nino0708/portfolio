---
title: "より速く、より安く、より良く ― Valkey と ElastiCache によるキャッシュ基盤の革新"
category: "AWSセッション"
session_id: "DAT456"
pages: 105
topics: ["アーキテクチャ/サーバーレス"]
services: ["Valkey"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/AWSセッション/より速く、より安く、より良く ― Valkey と ElastiCache によるキャッシュ基盤の革新.pdf"
---
# より速く、より安く、より良く ― Valkey と ElastiCache によるキャッシュ基盤の革新


## p.1

DAT456
より速く、より安く、より良く
― Valkey とElastiCache によるキャッシュ基盤の革新
水澤健
アマゾンウェブサービスジャパン合同会社


## p.2

自己紹介
水澤健(Mizusawa Ken)
クラウドサポートエンジニア
ElastiCache - Subject Matter Expert 
主な担当サービス
ElastiCache, MemoryDB, EC2 (Linux), EBS


## p.3

1. Valkey の起源
2. マルチスレッドアーキテクチャ
3. ElastiCache Serverless
4. 信頼性の向上
5. メモリオーバヘッドの削減
6. まとめ
Agenda


## p.4

Valkey の起源


## p.5

Valkey
Source: https://valkey.io/


## p.6

Valkey の起源
Redis 
7.2
Valkey
7.2
Valkey
8.0
Valkey
8.1
Valkey
9.0
FORK
2009
Redis 7.4
Valkey X.Y 
and  
beyond
2024
Valkey
9.1


## p.7

Redis OSS に代わるコミュニティ主導の選択肢
Redis 出身のMaintainers/contributors
マルチベンダーガバナンスモデル
Redis OSS 7.2 のドロップイン置き換え
Linux Foundation による管理運営
寛容なライセンス(BSD)
オープンソース(OSS)
50+ の組織
10+ のマネージドValkey プロバイダ
150+ のコードコントリビュータ
1300+ のコミット
30M+ のコンテナプル
活発なコミュニティ
Valkey


## p.8

サーバレス(Serverless) 構成
インフラ管理不要で使用量に応じた課金
Amazon
ElastiCache
for Valkey
GENERALLY 
AVAILABLE
Redis OSS より低コストでの提供
ノードベースで20%、サーバレスで33% 低コスト
シームレスなアップグレード
Redis OSS からワンクリックでのアップグレード
永久のオープンソース
寛容なライセンス(BSD) でLinux Foundation が管理


## p.9

ElastiCache for Valkey
Valkey
7.2
Valkey
8.0
Valkey
8.1
Redis OSS 
7.1
Coming Soon…
Valkey
8.2
Valkey
9.0


## p.10

マルチスレッドアーキテクチャ


## p.11

キャッシングワークロードはスパイクしやすい
Requests per second 
Hour of Day
ワークロード


## p.12

キャッシングワークロードはスパイクしやすい
プロビジョンド
キャパシティ
ワークロード
Requests per second 
Hour of Day


## p.13

スケールアップvs スケールアウト
CPU
CPU
CPU
CPU
CPU
CPU
CPU
CPU
CPU
CPU
スケールアップ
スケールアウト
CPU
CPU
CPU
CPU
CPU
CPU


## p.14

スケールアップvs スケールアウト
発想の転換:
既に今あるリソースを
もっと有効活用できないか
CPU
CPU


## p.15

Valkey 7.2：シングルスレッド
メインスレッド
1. クライアント接続の検出
2. クライアントからのコマンドの読み取り
3. コマンド内容の解析・検証
4. コマンド処理の実行
5. クライアントへのレスポンスの送信
Parse 
Command
Read client 
Command
Execute 
Command
Send 
response
System 
epoll


## p.16

ボトルネックの特定
Flame Graph
Parse 
Command
Read client 
Command
Execute 
Command
Send 
response
System 
epoll


## p.17

ボトルネックの特定
Flame Graph
Parse 
Command
Read client 
Command
Execute 
Command
Send 
response
System 
epoll


## p.18

Valkey 7.2：シングルスレッド
メインスレッド
1. クライアント接続の検出
2. クライアントからのコマンドの読み取り
3. コマンド内容の解析・検証
4. コマンド処理の実行
5. クライアントへのレスポンスの送信
4. コマンド処理の実行
Parse 
Command
Read client 
Command
Execute 
Command
Send 
response
System 
epoll


## p.19

Execute 
Command
マルチスレッドアーキテクチャ
1.
2.
3.
4.
5.
メインスレッド
I/Oスレッド1


## p.20

Execute 
Command
マルチスレッドアーキテクチャ
1.
2.
3.
4.
5.
メインスレッド
I/Oスレッド1


## p.21

Execute 
Command
マルチスレッドアーキテクチャ
メインスレッド
I/Oスレッド1
Execute 
Command


## p.22

Execute 
Command
マルチスレッドアーキテクチャ
メインスレッド
I/Oスレッド1
Execute 
Command
I/Oスレッド2


## p.23

Execute 
Command
マルチスレッドアーキテクチャ
メインスレッド
I/Oスレッド1
Execute 
Command
I/Oスレッド2


## p.24

Execute 
Command
マルチスレッドアーキテクチャ
メインスレッド
I/Oスレッド1
Execute 
Command
I/Oスレッド2
Execute 
Command
Execute 
Command


## p.25

360,460
1,190,000
0
200,000
400,000
600,000
800,000
1,000,000
1,200,000
1,400,000
Valkey 7.2
Valkey 8.0
Requests per second
Valkey 7.2 vs. Valkey 8.0 Performance Improvements
スループットが+230% 向上
Source 1:  https://valkey.io/blog/unlock-one-million-rps/
Source 2:  https://valkey.io/blog/unlock-one-million-rps-part2/


## p.26

ElastiCache Serverless


## p.27

キャッシングワークロードはスパイクしやすい
プロビジョンド
キャパシティ


## p.28

キャッシングワークロードはスパイクしやすい
プロビジョンド
キャパシティ
マルチスレッド化: 
以前より小さなインスタンスでも
高いスループットを発揮できるように


## p.29

ElastiCache Serverless
Throughput


## p.30

ElastiCache Serverless アーキテクチャ図
Service VPC
Proxy Fleet
AZ1
NLB
Customer VPC
Client 
Application
Client 
Application
VPC-EP
ENI
AZ1
Cache nodes
Client 
Application
Client 
Application
VPC-EP
ENI
AZ2
Client 
Application
Client 
Application
VPC-EP
ENI
AZ3
Proxy Fleet
AZ2
Cache nodes
Proxy Fleet
AZ3
Cache nodes


## p.31

Serverless: 垂直スケーリング(スケールアップ)
Cache nodes
オンデマンドワークロードに
対する瞬時のスケーリングで
スループットが8 倍に増加
- 5 秒で30k から240k PPS へ
Slot 
A
Slot 
B
Slot 
C
Slot 
D


## p.32

Serverless: 垂直スケーリング(スケールアップ)
Cache nodes
オンデマンドワークロードに
対する瞬時のスケーリングで
スループットが8 倍に増加
- 5 秒で30k から240k PPS へ
Slot 
A
Slot 
B
Slot 
C
Slot 
D


## p.33

Serverless: 垂直スケーリング(スケールアップ)
Cache nodes
オンデマンドワークロードに
対する瞬時のスケーリングで
スループットが8 倍に増加
- 5 秒で30k から240k PPS へ
Slot 
A
Slot 
B
Slot 
C
Slot 
D


## p.34

Serverless: 水平スケーリング(スケールアウト)
Slot 
A
Slot 
B
Slot 
C
Slot 
D
Slot 
D
2 ~ 3 分ごとにPPS を倍増


## p.35

ElastiCache for Valkey
Valkey
7.2
Valkey
8.0
Valkey
8.1
Redis OSS 
7.1
Coming 
Soon
Valkey
8.2
スループットが
最大230% 向上
ノードベースで20% 安価
サーバレスで33％安価
Valkey
9.0


## p.36

信頼性の向上


## p.37

キャッシュは
バックエンドと同等か、
それ以上の可用性が必要
Availability is 
everything


## p.38

Topic 1.
レプリケーション処理の改善
Topic 2.
突発的な障害発生への対応
(Valkey 8.0 以前）
Valkey 8.1 での改善


## p.39

Valkey のアップグレード
Set FOO BAR
Primary
Version 7.2
Replica
Version 7.2
Set FOO BAR
Shards


## p.40

Valkey のアップグレード
Primary
Version 7.2
Replica
Version 7.2
Replica
Version 8.0
Replica
Version 8.0


## p.41

Valkey のアップグレード
Primary
Version 7.2
Replica
Version 7.2
Replica
Version 8.0
Replica
Version 8.0
フェーズ1:
フルスナップショットの転送
フェーズ2:
増分書き込みのストリーミング
Set FOO BAR
Set FOO BAR


## p.42

Valkey のアップグレード
Primary
Version 7.2
Replica
Version 7.2
Replica
Version 8.0
Replica
Version 8.0
Set HOME MN
Get FOO
FAILOVER


## p.43

Valkey のアップグレード
Replica
Version 7.2
Replica
Version 7.2
Primary
Version 8.0
Replica
Version 8.0
Set HOME MN
FAILOVER


## p.44

Valkey のアップグレード
Primary
Version 8.0
Replica
Version 7.2
Replica
Version 7.2
Replica
Version 8.0
Set HOME MN
Set HOME MN
フェーズ2:
増分書き込みのストリーミング


## p.45

前方互換性のないレプリケーション
SYNC Version 8.0
Replica
Version 8.0
Primary
Version 9.0
新Version からのスナップショットを
旧Version は受信できない


## p.46

前方互換性のあるレプリケーション
SYNC Version 8.0
Snapshot version 11
SYNC Version 8.0
Replica
Version 8.0
Primary
Version 9.0
Replica
Version 8.0
Primary
Version 9.X


## p.47

障害時のより安全なアップグレード
Primary
Version 8.0
Replica
Version 7.2
Replica
Version 7.2
Replica
Version 8.0


## p.48

障害時のより安全なアップグレード
Primary
Version 9.X
Replica
Version 7.2
Replica
Version 7.2
Replica
Version 9.X


## p.49

デュアルチャンネルレプリケーション
Primary
Version 8.0
Replica
Version 8.0
フルスナップショット
増分書き込み
同時に送信可能
→メモリプレッシャー軽減+ データ同期の高速化


## p.50

Topic 1.
レプリケーション処理の改善
Topic 2.
突発的な障害発生への対応
(Valkey 8.0 以前）
Valkey 8.1 での改善


## p.51

突発的な障害への対応改善
PING
PING
PING
PONG
<No Response>
Cluster Enabled
PONG
全てのノードが
互いに情報を共有
PING/PONG Message:
• Slot ownership
• Node Epoch
• Gossip information


## p.52

突発的な障害への対応改善
Shard 1
Epoch 1
Shard 2
Epoch 2
Shard 3
Epoch 3
Primaries
Replicas
Node Epoch:
論理的なバージョン番号


## p.53

突発的な障害への対応改善
Shard 1
Epoch 1
Shard 2
Epoch 2
Shard 3
Epoch 4
Primaries
Replicas
Epoch 3
Epoch 4


## p.54

突発的な障害への対応改善
Shard 1
Epoch 1
Shard 2
Epoch 2
Shard 3
Epoch 3
Primaries
Replicas
AUTH
Epoch 5
AUTH
Epoch 5


## p.55

突発的な障害への対応改善
Shard 1
Epoch 1
Shard 2
Epoch 2
Shard 3
Epoch 3
Primaries
Replicas
Granted
Granted


## p.56

突発的な障害への対応改善
Shard 1
Epoch 1
Shard 2
Epoch 5
Shard 3
Epoch 3
Primaries
Replicas
Epoch 2
Epoch 5
過半数のプライマリからの承認により
フェイルオーバーが実行される


## p.57

問題: 同時障害(Concurrent failures)
Shard 1
Epoch 1
Shard 4
Epoch 6
Shard 2
Epoch 5
Shard 3
Epoch 4
AUTH
Epoch 8
AUTH
Epoch 7


## p.58

問題: 同時障害(Concurrent failures)
Shard 1
Epoch 1
Shard 4
Epoch 6
Shard 2
Epoch 5
Shard 3
Epoch 4
Granted
Granted
AUTH
Epoch 8
AUTH
Epoch 7


## p.59

同時障害の処理
Shard 1
Epoch 1
Shard 4
Epoch 6
Shard 2
Epoch 5
Shard 3
Epoch 4
Rejected
Rejected
AUTH
Epoch 8
AUTH
Epoch 7
どちらも過半数のプライマリからの
承認を得られない状態


## p.60

Topic 1.
レプリケーション処理の改善
Topic 2.
突発的な障害発生への対応
(Valkey 8.0 以前）
Valkey 8.1 での改善


## p.61

解決策: わずかな遅延(delay) の追加
Shard 1
Epoch 1
Shard 4
Epoch 6
Shard 2
Epoch 5
Shard 3
Epoch 4
AUTH
Epoch 7
AUTH
Epoch 7
Granted
Granted


## p.62

解決策: わずかな遅延(delay) の追加
Shard 1
Epoch 1
Shard 4
Epoch 6
Shard 2
Epoch 7
Shard 3
Epoch 4
AUTH
Epoch 8
AUTH
Epoch 8
Granted
Granted


## p.63

解決策: わずかな遅延(delay) の追加
Shard 1
Epoch 1
Shard 4
Epoch 6
Shard 2
Epoch 7
Shard 3
Epoch 8
Epoch 5
Epoch 4
Epoch 7
Epoch 8
大規模なクラスターでの
フェイルオーバー時間が改善


## p.64

ElastiCache for Valkey
より高速な
フェイルオーバー
デュアルチャンネル
レプリケーション
前方互換性のある
レプリケーション
Valkey
7.2
Valkey
8.0
Valkey
8.1
Redis OSS 
7.1
Valkey
8.2
Valkey
9.0
Coming 
Soon


## p.65

メモリオーバーヘッドの削減


## p.66

Valkey 7.2 のメモリオーバーヘッド
User Workloads are 
memory bound 
key : ~ 16 bytes
value : ~ 80 bytes
+32 bytes : TTL (有効期限) 付きの場合
+16 bytes : クラスターモードの場合
52 bytes : 単純なkey-value の場合
For 1 key-value data


## p.67

Topic 1.
従来のデータ構造
Topic 2.
データ構造の移行による削減
• ポインタ削減のための動的構造への移行
• Swiss Table によるメモリアクセスの効率化
• SIMD を活用した高速化
(Single Instruction Multiple Data)


## p.68

Table Array
Bucket 000
Bucket 001
Bucket 010
…
HashTable
Metadata
Table
{ key: “FOO” value: “BAR”}


## p.69

“FOO”
Table Array
Bucket 000
Bucket 001
Bucket 010
…
HASH ( FOO ) = Bucket 000
HashTable
Metadata
Table
Entry
Key
Value
Next
{ key: “FOO” value: “BAR”}


## p.70

Valkey Object
[Metadata]
Value
“FOO”
“BAR”
Table Array
Bucket 000
Bucket 001
Bucket 010
…
HashTable
Metadata
Table
Entry
Key
Value
Next
{ key: “FOO” value: “BAR”}
HASH ( FOO ) = Bucket 000


## p.71

“FOO”
Table Array
Bucket 000
Bucket 001
Bucket 010
…
HashTable
Metadata
Table
Entry
Key
Value
Next
Entry
Key
Value
Next
“BAZ”
HASH ( FOO ) = Bucket 000
HASH ( BAZ ) = Bucket 000
異なるKey が
同じBucket に保存される
= 衝突(Hash Collision)


## p.72

Valkey Object
[Metadata]
Value
“FOO”
“BAR”
Table Array
Bucket 000
Bucket 001
Bucket 010
…
HASH(FOO) = 000
HashTable
Metadata
Table
Entry
Key
Value
Next
Entry
Key
Value
Next
~ 100 ナノ秒
“BAZ”
ポインタ参照のたびに
伴う処理時間
8 Byte 固定


## p.73

Topic 1.
従来のデータ構造
Topic 2.
データ構造の移行による削減
• ポインタ削減のための動的構造への移行
• Swiss Table によるメモリアクセスの効率化
• SIMD を活用した高速化
(Single Instruction Multiple Data)


## p.74

静的構造から動的構造への移行
64
32
24
8
64
30
64
Type LRU  Refcount
Value Ptr
24
8
Type LRU   Refcount
Value Ptr
has embedded key/ttl
8
Key overhead
Key
Static 
structure
Dynamic
allocated 
structure


## p.75

Valkey Object
[Metadata]
Value
“FOO”
“BAR”
Table Array
Bucket 000
Bucket 001
Bucket 010
…
HashTable
Metadata
Table
Entry
Key
Value
Next
Entry
Key
Value
Next
Static 
structure
“BAZ”


## p.76

Table Array
Bucket 000
Bucket 001
Bucket 010
…
HashTable
Metadata
Table
Valkey Object
Key
Value
Metadata
Valkey Object
“BAZ”
Value
Metadata
Next
Next
“FOO”
Dynamic
allocated
structure
“BAR”


## p.77

Table Array
Bucket 000
Bucket 001
Bucket 010
…
HashTable
Metadata
Table
Valkey Object
“FOO”
Value
Metadata
Valkey Object
“BAZ”
Value
Metadata
衝突時に隣の空きBucket に格納
→Next ポインタが不要になる。
Lin
Linear probing
“BAR”


## p.78

Topic 1.
従来のデータ構造
Topic 2.
データ構造の移行による削減
• ポインタ削減のための動的構造への移行
• Swiss Table によるメモリアクセスの効率化
• SIMD を活用した高速化
(Single Instruction Multiple Data)


## p.79

Table Array
Bucket 000
Bucket 001
…
HashTable
Metadata
Table
Valkey Object
Key
Value
Metadata
Valkey Object
Key
Value
Metadata
…
Linear probing
データが異なるBucket に分散


## p.80

Table Array
HashTable
Metadata
Table
Bucket 000
M 0 1 2 3 4 5 6
Bucket 001
M 0 1 2 3 4 5 6
64 bytes
Valkey Object
Key
Value
Metadata
Valkey Object
Key
Value
Metadata
Bucket 自体を64 bytes (= CPU Cache Line size) に拡張
→1 回のメモリアクセスでBucket 全体の読み込みが可能に
Swiss Table


## p.81

Table Array
HashTable
Metadata
Table
Valkey Object
Key1
Value
Metadata
Valkey Object
Key2
Value
Metadata
Bucket 000
M 0 1 2 3 4 5 6
Bucket 001
M 0 1 2 3 4 5 6
Valkey Object
Key3
Value
Metadata
Valkey Object
Key4
Value
Metadata
Valkey Object
Key5
Value
Metadata
Valkey Object
Key6
Value
Metadata
全て順番に確認して
探す必要がある


## p.82

Topic 1.
従来のデータ構造
Topic 2.
データ構造の移行による削減
• ポインタ削減のための動的構造への移行
• Swiss Table によるメモリアクセスの効率化
• SIMD を活用した高速化
(Single Instruction Multiple Data)


## p.83

SIMD を活用した高速lookup
HASH (FOO)  =  01010011 01000101 01000001
SIMD = Single Instruction Multiple Data
→1 回の命令で複数のデータを同時に処理可能なCPU の機能
Top Byte
不要: 通常は破棄する
Bottom Bytes
保存するBucket 番号の決定
あるKey をHASH 関数に渡す→ハッシュ値( bit 列)
例) Bucket 000 に保存


## p.84

SIMD を活用した高速lookup
8
8
8
8
8
8
8
1byte hashes
8
Presence bits
Bucket Metadata
Bucket 000
M 0 1 2 3 4 5 6
Swiss Table
FOO
…
…
Top Byte をBucket のMetadata に保存
HASH (FOO)  =  01010011 01000101 01000001


## p.85

SIMD を活用した高速lookup
8
8
8
8
8
8
8
8
Bucket Metadata
M 0 1 2 3 4 5 6
Swiss Table
HASH (Key_1)  =  01010011 01000101 01000001
HASH (Key_2)  =  11110000 01000101 01000001
HASH (Key_3)  =  00001111 01000101 01000001
⋮
Bucket 000
各ハッシュ値のTop Byte をそれぞれ保存
→データ検索時に比較確認のため使用する
Key_1
…
Key_2
…
Key_3
…


## p.86

SIMD を活用した高速lookup
const uint8x8_t hash_vector = vld1_u8(b->hashes);
const uint8x8_t h2_vector = vdup_n_u8(h2);
const uint8x8_t equal_mask = vceq_u8(hash_vector, h2_vector);
uint64_t matches = vget_lane_u64(vreinterpret_u64_u8(equal_mask), 0);
/* reduce each match to one bit and zero out invalid positions */
const uint64_t valid_entry_mask = (1ul << (ENTRIES_PER_BUCKET << 3)) - 1ul;
matches = matches & 0x8080808080808080ul & valid_entry_mask;
順番に1 つずつ確認する必要なく、1 回の命令で全て同時に比較確認可能
8
8
8
8
8
8
8
8
Bucket Metadata


## p.87

Table Array
HashTable
Metadata
Table
Valkey Object
Key
Value
Metadata
Valkey Object
Key
Value
Metadata
Bucket 000
M 0 1 2 3 4 5 6
Bucket 001
M 0 1 2 3 4 5 6
Bucket 000
M 0 1 2 3 4 5 6
Valkey Object
Key
Value
Metadata
Next ポインタはバケット単位で1 つだけで済む


## p.88

ほぼ全てのユーザーのメモリ使用量を削減
Valkey 7.2
Valkey 8.1
8 bytes for entry pointer
8 bytes for server object pointer
0-8* bytes for table overhead
1-10* bytes for table overhead
8 bytes for key pointer
-
8 bytes for server object pointer
-
8 bytes for next pointer
-
8 bytes for value pointer
8 bytes for value pointer
8 + 4 bytes for metadata
8 + 4 + 1 bytes for metadata
*load factor の影響を受けますが、ここでは同一とみなしています。
Valkey 7.2
Valkey 8.1
Total 
52 ~ 60 Bytes
29 ~ 38 Bytes


## p.89

メモリオーバーヘッドの
削減によりコストを最適化
メモリ使用量の
削減
注: 削減効果は乗算で計算: 1 – (80.3% * 73%) = 41.4%
合計41.4% のメモリ使用量の削減
キー数
メモリ使用量
Valkey 7.2
Valkey 8.0
Valkey 8.1
19.7% 削減
27% 削減


## p.90

メモリ参照回数の削減により
システム全体の効率が向上
CPU 使用時間の
削減
0 ns
100 ns
200 ns
300 ns
400 ns
500 ns
600 ns
find 0% miss
find 50% miss
find 100% miss
450MB dataset, 128B strings, 45MB L3 cache, 
x86_64 architecture (Lower is better)
Valkey 7.2   –
Valkey 8.1
※ グラフは低いほど良い結果


## p.91

メモリの節約
確率的データ構造により
大規模なデータセットを
確率的に近似判定
Bloom Filters
HyperLogLog
Bloom Filter
Dataset
“element1”
“element2”
“element3”
“element4”
“element5”
大きさはどれくらいか
データは含まれているか
(estimate cardinality)
(membership test)


## p.92

”element2”
Q. Is “elementX” in the Dataset ?
”element6”
偽陽性
(False Positive)
Dataset
“element1”
“element2”
“element3”
“element4”
“element5”
True (1)    or   False (0)
False Positive
極めて低い確率でTrue と誤って回答


## p.93

Topic 1.
従来のデータ型: Set による判定
Topic 2.
確率的データ構造: Bloom Filters による判定


## p.94

例: 悪意のあるIP アドレスの判定
DB への確認
“True(1) or False(0)”


## p.95

例: 悪意のあるIP アドレスの判定(Set)
“True (1)”
SISMEMBER “malicious IP”
回答:
リクエストを
ブロック
Data type : Set
DB のデータを単純に
Set 型としてロード


## p.96

例: 悪意のあるIP アドレスの判定(Set)
“False (0)”
SISMEMBER “malicious IP”
回答:
リクエストを
許可
Data type : Set
キャッシュによる
高速な判定を実現も
メモリ消費は大きい


## p.97

Topic 1.
従来のデータ型: Set による判定
Topic 2.
確率的データ構造: Bloom Filters による判定


## p.98

例: 悪意のあるIP アドレスの判定(Bloom Filters)
“False (0)”
BF.EXISTS “malicious IP”
回答:
リクエストを
許可
Data type : Bloom Filter


## p.99

例: 悪意のあるIP アドレスの判定(Bloom Filters)
“True (1)”
BF.EXISTS “malicious IP”
DB への確認
“True (1)”
回答:
リクエストを
ブロック
偽陽性: (False Positive)
誤って悪意のあるIP と
判定しているかもしれない
Data type : Bloom Filter


## p.100

False Positive rate 1% の
Bloom Filter により
メモリ使用量を98% 削減
Bloom Filters により
メモリ使用量を大幅に削減可能
98%
※データベースでの負荷増加は
CPU 使用率で1% 未満


## p.101

ElastiCache for Valkey
オーバーヘッドを
最大20% 削減
オーバーヘッドを
最大27% 削減
Bloom Filters 提供
Valkey
7.2
Valkey
8.0
Valkey
8.1
Redis OSS 
7.1
Coming 
Soon
Valkey
8.2
Valkey
9.0


## p.102

• 全文検索& ハイブリッド検索
• 高データ耐久性(durability) オプション
• Hash 型でのフィールド単位の有効期限(TTL)
• クラスターモードでの複数DB サポート
ElastiCache
for
Valkey 9.0
• パイプライン処理のスループット向上
• アトミックなスロットマイグレーション(移行)
新機能
パフォーマンス・信頼性


## p.103

1. Valkey の起源
- Redis よりフォークされ誕生
- ベンダー中立のオープンソースプロジェクト
2. マルチスレッドアーキテクチャ
- 230 ％のスループット向上、コストの最適化
3. 信頼性の向上
- レプリケーション改善、フェイルオーバーの高速化
4. メモリオーバヘッドの削減
- 内部構造の再構築による最大約40% の削減
- 確率的データ構造: Bloom filter の導入
振り返り


## p.104

Ask the Speaker
こちらのRoom 後方の外側にございます、
「Ask the Speaker」カウンターまでお越しください
水澤健
アマゾンウェブサービスジャパン合同会社
Room


## p.105

本セッションのアンケートへ
ご協力をお願いします
Please give us your feedback
Thank you!
DAT456
