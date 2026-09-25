---
title: "SageMaker HyperPod で GPU 投資を成果に変える ― 基盤モデルの学習・推論を支える ML Performance Engineering 入門"
category: "AWSセッション"
session_id: "AIM461"
pages: 92
topics: ["機械学習/MLOps"]
services: ["Amazon Bedrock", "Amazon CloudWatch", "Amazon EC2", "Amazon EKS", "Amazon FSx", "Amazon Q", "Amazon Q Developer", "Amazon S3", "Amazon SageMaker", "SageMaker HyperPod", "Trainium"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/AWSセッション/SageMaker HyperPod で GPU 投資を成果に変える ― 基盤モデルの学習・推論を支える ML Performance Engineering 入門.pdf"
---
# SageMaker HyperPod で GPU 投資を成果に変える ― 基盤モデルの学習・推論を支える ML Performance Engineering 入門


## p.1

AIM461
SageMaker HyperPod でGPU 投資を成果に変える
― 基盤モデルの学習・推論を支える
ML Performance Engineering 入門
渡辺啓太
アマゾンウェブサービスジャパン合同会社


## p.2

自己紹介
渡辺啓太（Keita Watanabe）
Principal Worldwide Specialist Solutions Architect, GenAI
アマゾンウェブサービスジャパン｜東京
略歴
• 自動運転を手掛けるスタートアップ企業にて
ML Researcher として意思決定システムの研
究開発に従事
• 日本最大級のE コマースサイトを手掛ける
企業にてMachine Learning Researcher とし
て商品画像検索サービスの研究開発に従事
• 現職ではSolutions Architect として、Slurm
やKubernetes 上の基盤モデル学習や推論を
支援


## p.3

1.
大規模化する基盤モデルと計算資源の課題
2.
計算資源の有効活用（Goodput）をどう測るか
3.
最適化の全体像
4.
有効活用を高めるAWS Building Blocks
5.
学習・推論の最適化
Agenda


## p.4

スケーリング則: 3つのフェーズ
https://blogs.nvidia.co.jp/blog/ai-scaling-laws/ より
事前トレーニングスケーリング
モデル規模・学習データ・計算量を増
やすほど、ベースモデルの損失が冪乗
則で下がる
事後トレーニングスケーリング
事前学習済みモデルへの追加学習
(SFT/RLHF/RLVR) を増やすほど、指
示追従と推論能力が引き出される
テストタイムスケーリング
推論時の思考連鎖や探索に費やす計算
を増やすほど、難問の正答率が伸びる


## p.5

Goodput = 価値ある計算に使えた時間/ 確保した総資源時間
•  学習: 確保したGPU 時間のうち、進捗(loss が下がる方向のforward/backward) に充てられた割合
•  推論: 確保したサーバ時間のうち、SLO を満たして応答できたリクエストの割合
スケールするほどギャップは広がる
•  大規模クラスタでは「素のthroughput × 時間」と「実際の学習進捗」の乖離が大きくなる
•  単一指標(MFU やreq/s) だけでは、どこを直せば伸びるのか判断できない
評価指標: 計算資源の有効活用
「使ったGPU 時間」と「価値のある計算に使えたGPU 時間」は別物


## p.6

学習効率の実測値— 大規模実例
Llama 3 405B  ｜Meta・16,384× H100・54 日学習
100%
90%
確保したGPU 時間
停止しない時間の割合
（ETT）
実際に進捗へ使えた時間
（MPG）= ETT × MFU
× MFU (PG) ≈ 40%（純計算率）
MPG ≈ 36%
MPG ＝ETT × MFU ≈ 0.90 × 0.40 ≈ 0.36
確保したGPU 時間のうち、学習の進捗に使えたのは約1/3 のみ
466 件のinterruption・MTBI ≈ 2.8 時間→RG（Runtime Goodput）の上限を決める要因


## p.7

計算資源を無駄にするハードウェア障害
基盤モデルの学習・推論では、PCI バス切断・ビット反転・SDC といった障害は避けられない
宇宙線
Silent data corruption (SDC)
PCIe バスからの脱落
ハードウェア障害による中断が、確保した計算資源の多くを無駄にする


## p.8

無駄をどう減らすか
— 計算資源を有効活用
するアーキテクチャ


## p.9

学習推論３階層アーキテクチャ
Architecture & 
Orchestration
Algorithms &
Software
Network
•
広帯域
インターコネクト
•
高速
アクセラレーター
Compute
•
分散ファイル
ストレージ
Storage
Infrastructures
•
リソース管理
•
ジョブスケジューリング
•
機械学習フレームワーク
•
通信ライブラリetc.
下位のレイヤーの性能が上位の性能を
律速する
各レイヤの最適化が計算資源の有
効活用に不可欠


## p.10

Building blocks                          AWS 
Offering
Architecture & 
Orchestration
Algorithms &
Software
Amazon EKS
AWS 
ParallelCluster
Amazon 
Sagemaker
HyperPod
Network
•
広帯域
インターコネクト
•
高速
アクセラレーター
Compute
•
分散ファイル
ストレージ
Storage
. . .
Frameworks
Amazon EC2 
UltraClusters
Infrastructures
•
リソース管理
•
ジョブスケジューリング
•
機械学習フレームワーク
•
通信ライブラリetc.


## p.11

Infrastructure


## p.12

Building blocks                          AWS 
Offering
Architecture & 
Orchestration
Algorithms &
Software
Amazon EKS
AWS 
ParallelCluster
Amazon 
Sagemaker
HyperPod
Network
•
広帯域
インターコネクト
•
高速
アクセラレーター
Compute
•
分散ファイル
ストレージ
Storage
. . .
Frameworks
Amazon EC2 
UltraClusters
Infrastructures
•
リソース管理
•
ジョブスケジューリング
•
機械学習フレームワーク
•
通信ライブラリetc.


## p.13

Amazon EC2 UltraClusters
13
高性能コンピューティング、ネットワーキング、ストレージをサポートするスーパーコンピューター
Network
Compute
Storage
P5
NVIDIA 
H100/H200 
TENSOR CORE
P6
NVIDIA B200
TENSOR CORE
TRN2
AWS 
TRAINIUM2
TRN3
AWS 
TRAINIUM3
Elastic Fabric Adapter
FSx for Lustre
Amazon S3
Elastic Fabric Adapter 
(EFA)
Scalable low-
latency storage
Second-generation EC2 UltraClusters


## p.14

NVIDIA GPU instances
Instance Size
ACC
NUM 
ACC 
ACC Memory
Acc. P2P BW
EFA
P5.48xlarge
H100
8
640 GB
900 GB/s
3200 Gbps EFAv2
P5e.48xlarge
H200
8
1128 GB
900 GB/s
3200 Gbps EFAv2
P5en.48xlarge
H200
8
1128 GB
900 GB/s
3200 Gbps EFAv3
P6-B200.48xlarge
B200
8
1440 GB
1.8 TB/s
3200 Gbps EFAv4
P6e-GB200.36xlarge
GB200
4
740 GB
1.8 TB/s
3200 Gbps EFAv4
u-p6e-gb200x36
GB200
36
6.7 TB
1.8 TB/s
14400 Gbps EFAv4
u-p6e-gb200x72
GB200
72
13.3 TB
1.8 TB/s
28800 Gbps EFAv4
https://aws.amazon.com/ec2/instance-types
P6
NVIDIA 
H100/H200 
TENSOR CORE
P5
NVIDIA B200
TENSOR CORE


## p.15

EFA の有無が学習に与える影響
https://medium.com/pytorch/training-a-1-trillion-parameter-model-
with-pytorch-fully-sharded-data-parallel-on-aws-3ac13aa96cff
記事公開日: 2022/05/16
2.5x
512 GPUs =  64 instances


## p.16

• POSIX ファイルシステム互換
• Amazon S3 とのネイティブ統合
Amazon FSx for Lustre
高性能ワークロード向けのフルマネージドLustre ファイルシステム
Transparently access to the data on S3 through 
Lustre
Data created on Lustre is 
persisted in
Amazon S3 
Amazon FSx
for Lustre
Amazon S3


## p.17

Building blocks                          AWS 
Offering
Architecture & 
Orchestration
Algorithms &
Software
Amazon EKS
AWS 
ParallelCluster
Amazon 
Sagemaker
HyperPod
Network
•
広帯域
インターコネクト
•
高速
アクセラレーター
Compute
•
分散ファイル
ストレージ
Storage
. . .
Frameworks
Amazon EC2 
UltraClusters
Infrastructures
•
リソース管理
•
ジョブスケジューリング
•
機械学習フレームワーク
•
通信ライブラリetc.


## p.18

Orchestrator


## p.19

Orchestrator の選択肢
⚙
Slurm
HPC(High Performance 
Computing)クラスター向けに
設計されたオープンソースの
ジョブスケジューラ。同一ス
クリプトを複数の計算ノード
上で並列実行する「バッチ並
列ジョブ」をサポートする。
シンプルながら強力
☁
Kubernetes
多様なコンテナ化アプリケー
ションを実行できる、オープ
ンソースのコンテナオーケス
トレーションプラットフォー
ム。同一基盤で学習・推論の
両ワークロードを扱える。
Cloud-native & flexible
VS
2


## p.20

•
数秒〜数分で障害を検出
•
ノードの再起動または交換を
トリガー
HEALTH MONITORING AGENT (HMA)
継続的なパッシブモニタリング・すべてのGPU ノードでDaemonSet として稼働
Detection Mechanisms
Response Behavior
Key Design Principle
DCGM Policy Violations
ダブルビットエラー(DBE)、PCI エラー、
温度違反、電力違反
カーネルログを解析しXID エラーや
SXID 等の致命的エラーを検出
Node Problem Detector (NPD) 
Wrapper
NVML API Checks
GPU レベルの直接ヘルスクエリ
非侵襲的— GPU 容量を消費しない
トレーニングジョブへの性能影響は最小


## p.21

DHC Tests
ノード起動時・オンデマンドで実行するストレステスト
PHASE 1
Node-Level Tests
クラスター使用前に各ノードを個別
に検証
GPU Test 
EFA Networking Tests
GPU/NVLink Count 
Verification
Unschedulable Tainting
PHASE 2
Cluster-Level Tests
分散ワークロード向けのノード間検
証
Inter-Node Communication
Network Infrastructure
Test Outcomes & 
Observability
正常なノードはスケジュール可能になる
異常なノードは交換対象としてフラグ付け
結果はAmazon CloudWatch に記録
deep-health-check-status ラベルで進捗を追
跡
DHC の流れ
Instance Joins Cluster
新しいノードを検出
Tainted Unschedulable
テスト中はワークロードをブロック
Phase 1: Node Tests
GPU, Trainium, EFA, NVLink counts
Phase 2: Cluster Tests
Inter-node communication
Outcome
Healthy →Schedulable | Unhealthy →Replace


## p.22

HyperPod Deep Health Checks
ノード起動時・オンデマンドで実行するストレステスト
PHASE 1
Node-Level Tests
各ノードを個別に検証
Accelerator Tests
各ノードのGPU をテスト
EFA Networking Tests
各ノードでElastic Fabric Adapter の
ネットワーキングを検証
GPU/NVLink Count Verification
想定されるGPU とNVLink の数がハー
ドウェアと一致することを検証
Unschedulable Tainting
テスト中はワークロードのスケジュー
リングを禁止する
PHASE 2
Cluster-Level Tests
分散ワークロード向けのノード間検証
Inter-Node Communication
クラスター内のノード間通信を検証
Network Infrastructure
ノード間のネットワークインフラ全体の
接続性をテスト
Test Outcomes & Observability
正常なノードはスケジュール可能になる
異常なノードは交換対象としてフラグ付け
結果はAmazon CloudWatch に記録
deep-health-check-status ラベルで進捗を追跡


## p.23

Amazon SageMaker HyperPod Observability
Amazon Managed Prometheus と
Grafana のワンクリックデプロイ
GenAIクラスターとワークロードに
最適化された、構成済みのメトリク
ス
クラスターのスケールに応じたメト
リクス収集の自動スケーリング


## p.24

GPU Failure Dashboard
https://github.com/awslabs/awsome-distributed/tree/main/4.validation_and_observability/4.prometheus-
grafana


## p.25

Building blocks                          AWS 
Offering
Architecture & 
Orchestration
Algorithms &
Software
Amazon EKS
AWS 
ParallelCluster
Amazon 
Sagemaker
HyperPod
Network
•
広帯域
インターコネクト
•
高速
アクセラレーター
Compute
•
分散ファイル
ストレージ
Storage
. . .
Frameworks
Amazon EC2 
UltraClusters
Infrastructures
•
リソース管理
•
ジョブスケジューリング
•
機械学習フレームワーク
•
通信ライブラリetc.


## p.26

Demystifying ML Software Stack on AWS


## p.27

ワークロードを動的にスケール
アップ/ダウンさせ、クラスター
利用率を最大化
スケーリングはデータ並列(DP) 
レプリカ単位で行われる
Elastic Training
on Amazon SageMaker HyperPod


## p.28

ElasticTraining の内部動作
利用可能なコンピューティングリソースを使うため、トレーニングジョブを動的にスケール
Detection
リソースとPod
イベントの監視
Coordination
各Rankへ同期
シグナルを送信
Checkpoint
PyTorch DCPで
状態を保存
Restart
新ノード構成で
プロセス再起動
Resume
チェックポイントを
ロード・再分配
リソース
イベント
Elastic
シグナル
新しい
構成
プロセス
準備完了
https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-elastic-training.htm


## p.29

Checkpointless Training
on Amazon SageMaker HyperPod
Checkpoint-less リカバリにより
障害復旧を数分で実現:
最適化された集団通信の初期化
メモリマップによるデータ読み込み
In-process recovery
Checkpointless recovery


## p.30

クラスターが大きいほど、トレーニング障害
や復旧中のアイドル時間が長時間化する
Step 1
Step 2
Checkpoint
Step 3
Recovery 
Process
Step 3
Step 
4
ステップ4 完了前に障害発生
最後に保存した
チェックポイントへロールバック
トレーニングステップ3 をやり直し
チェックポイント
処理による損失時間
復旧とロールバックによる損失時間
学習再開
Time


## p.31

Rootless & TCPStoreless による耐障害通信
中央TCPStore／Root への依存を排し、フォルトから高速復旧
従来: Rooted + TCPStore
Rank 1
Rank 2
Rank 6
Rank 3
Rank 5
Rank 4
TCPStore
Rank 0 (Root)
•  中央TCPStore に全接続
•  再起動ごとに初期化やり直し
•  Rank 0 が単一障害点（SPOF）
Rootless + TCPStoreless
Rank 0
Rank 1
Rank 5
Rank 2
Rank 4
Rank 3
中央ストアなし
TCPStore 不要
•  TCPStore 接続を排除
•  global counter で対称アドレス生成
•  in-process リカバリでSPOF 解消
https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-checkpointless-
features-communication.html


## p.32

Memory-mapped DataLoader
共有メモリ・キャッシュでデータローダを高速復旧
学習バッチの単一コピーを共有
リモート(Amazon S3 / FSx)
学習バッチをTP rank 0 のみが取得（重複排除）
mmap 単一共有コピー
全GPU プロセスが共有（コピーなし）
GPU 0–7 が単一コピーを共有
8 コピー→1 コピー（メモリ削減）
永続キャッシュで高速復旧
キャッシュ構造（tmpfs に永続化）
B-1
B
B+1
B+2
…
現在バッチ±数バッチを保持（lookback＋prefetch）
再起動時の比較
従来：再起動後に初期化待ち（idle）
MMAP：再起動後すぐに再開
初期化待ちを排除→MTTR・idle 短縮
https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-checkpointless-features-mm


## p.33

In-process recovery
モデル冗長性による無停止復旧
障害復旧の3 段階エスカレーション（IPR を最優先）
IPR ― プロセス内で復旧
（最優先）
PLR ― プロセス再起動
（IPR 不可時）
JLR ― ノード交換・再起動
（最終手段）
仕組み：モデル冗長性＋P2P 状態転送
レプリカグループA（健全）
Rank 0 ・1 ・2
レプリカグループB（復旧中）
Rank 1 を交換・状態を受信
P2P
・状態を2 つ以上のノードグループに完全複製（冗長性）
・健全レプリカがstep を完了し、回復ノードへ状態をP2P 転送
・GPU メモリ保持・ディスクI/O 不要・前ステップ再開→MTTR 短縮
IPR = In-Process Recovery
PLR = Process-Level Restart
JLR = Job-Level Restart
MTTR = Mean Time To Recovery
https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-checkpointless-in-process-recovery


## p.34

計算資源を9 5 % 以上有効活用
Amazon SageMaker HyperPod 
上のCheckpointless トレーニン
グにより、数千台のAI アクセラ
レータ規模のクラスターで95% 
を超えるトレーニングgoodput 
を実現
Performance
Cluster 
(H100s)
Model
Traditio
nal 
recover
y
Checkpoi
ntless 
recovery
Improvem
ent
2,304 
GPUs
Internal 
model
15-30 
minutes
< 2 
minutes
~87-93% 
faster
256 GPUs
Llama-3 
70B
(pre-
training)
4 min 
52 sec
47 
seconds
~84% 
faster
16 GPUs
Llama-3 
70B
(fine-
tuning)
5 min 
10 sec
50 
seconds
~84% 
faster


## p.35

同一GPU ではprefill とdecode が互いに律速する
フェーズを別のGPU プールに分離するDisaggregated Inference で、各ハードウェアを上限まで活用する
従来：1 枚のGPU でprefill＋decode
演算(compute)
メモリ帯域(memory 
BW)
両フェーズが互いに律速し、どちらも上限に
届かない（GPU 利用効率が低い）
prefill とdecode を別々のGPU に分離
Prefill 専用GPU
計算律速(compute-bound)
演算(compute)
プロンプトを一括処理し、演算を使い切る
Decode 専用GPU
メモリ帯域律速(memory-bound)
メモリ帯域(memory 
BW)
トークンを逐次生成し、メモリ帯域を使い切る
KV
KV キャッ
シュ
各GPU を役割に最適化→推論のGPU 利用効率を最大化
https://haoailab.com/blogs/distserv
e/


## p.36

NIXL on EFA によるDisaggregated Inference
prefill とdecode を分離し、KV キャッシュをEFA/RDMA で高速転送— 推論側のGPU 利用効率を最大化
Prefill GPUs
計算律速(compute-bound)
プロンプト全体を1回の順伝播で
処理
→KV キャッシュを生成
Decode GPUs
メモリ帯域律速(memory-bound)
KV キャッシュを読みながら
トークンを逐次生成
NIXL on EFA
KV キャッシュを高速転送
EFA / RDMA・GPUDirect（低レイテンシ・高スループッ
ト）
※ TCP 転送ではTTFT（初回トークンまでの時間）を圧迫
もたらす効果
KV スループット向上
転送がボトルネックにならない
トークン間レイテンシ削減
応答がより速く滑らかに
GPU 利用効率を最大化
prefill・decode を各々最適化
出典: AWS「NIXL with EFA」(2026年3月・NVIDIA GTC 2026)
https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start-nixl.html


## p.37

Conclusion


## p.38


スケーリング則が性能を決める
事前学習・事後学習・推論時のいずれの段階でも、投じた計算量に比例してモデル性能
が向上する（冪乗則）

計算資源の有効活用が鍵
大規模な学習・推論ではGPU を「価値ある計算」にどれだけ充てられるかがコストと
速度を決める

AWS Building Blocks を土台に
Amazon EC2 UltraCluster 上に大規模クラスタを構築

障害に強いクラスタ運用
ヘルスモニタリングとDeep Health Checks、ノード自動交換で大規模学習の中断を最
小化

学習推論の効率を最大化
Elastic Training とCheckpointless Training で学習の、NIXL on EFA を用いた
Disaggregated Inference により推論のリソース利用効率を改善
まとめ：お持ち帰りいただきたい要点


## p.39

Call to Action
awsome-distributed-ai repository
•
https://github.com/awslabs/awsome-distributed-ai
AWS ParallelCluster/AWS PCS/Amazon EKS/Amazon SageMaker HyperPod 向
けのリファレンスアーキテクチャ
•
Megatron-Core、Nemo、PyTorch FSDP など各種分散学習フレームワーク向け
のテストケース
•
検証(NCCL テスト)
•
オブザーバビリティ(Prometheus & Grafana)
Workshop
•
AI on SageMaker HyperPod: https://awslabs.github.io/ai-on-sagemaker-
hyperpod/
•
ML on AWS ParallelCluster: https://catalog.workshops.aws/ml-on-aws-
parallelcluster
•
ML on AWS Parallel Computing Service: https://catalog.workshops.aws/ml-on-
pcs


## p.40

Please complete the 
session survey
Thank you


## p.41

基盤モデル学習推論向け３層アーキテクチャ


## p.65

Code text


## p.71

Please complete the 
session survey


## p.74

N E W


## p.75

These example slides are examples of the usage of the template’s 
layouts. Feel free to use and take inspiration from them! 
The next set of slides are example designs


## p.76

•
Overview
•
About the workstream
•
Key players
•
Cadence for comms
•
Actions and resources
Agenda


## p.77

Actions and resources


## p.78

First internal comms – next week 
Category strategy and templates 
Individual workstreams connecting 
with POCs 
Actions and 
resources


## p.79

H O W W E M A K E T H I S H A P P E N
Aligning teams through 
structure, transparency, and 
shared tools
•
Weekly core workstream meetings
•
Monthly LT updates
•
Workstream wiki (launching soon)
•
Shared allocation strategies across teams 
•
Centralized intake processes
Mechanisms 
and Comms


## p.80

製品を見る
Amazon Q 
Developer
ソフトウェア開発向けの最
も高性能な生成AI アシス
タント
Amazon 
SageMaker
機械学習モデルを大規模に
構築・トレーニング・デプ
ロイ
Amazon Elastic 
Compute 
Cloud (EC2)
クラウド上の仮想サーバー
Generative AI
人工知能(AI)
Compute


## p.81

AWS で宇宙を探索


## p.82

A M A Z O N B E D R O C K
Amazon Bedrock Guardrails は、
生成AI アプリケーションを大規
模に安全に構築するための設定
可能なセーフガードを提供しま
す。
Guardrails で責任あ
るAI アプリケーショ
ンを構築
75%
RAG や要約のユースケー
スにおける、モデルのハル
シネーション応答のフィル
タリング


## p.83

80%
A M A Z O N Q
組織に合わせてカスタマイズ
された、業界をリードするエ
ンタープライズAI ソリュー
ション
Amazon Q の高度なエー
ジェントによるコーディン
グタスクの高速化


## p.84

A M A Z O N Q
組織に合わせてカスタマイズ
された、業界をリードするエ
ンタープライズAI ソリュー
ション
Color A
Color B
XX%


## p.85

A M A Z O N Q
業界をリードす
るエンタープラ
イズAI ソ
リューション
0
1
2
3
4
5
6
Category 1
Category 2
Category 3
Category 4
Axis Title
Axis Title
Series 1
Series 2
Series 3


## p.86

A M A Z O N Q
業界をリードす
るエンタープラ
イズAI ソ
リューション
0
1
2
3
4
5
6
Category 1
Category 2
Category 3
Category 4
Axis Title
Axis Title
Series 1
Series 2
Series 3


## p.87

A M A Z O N Q
業界をリードする
エンタープライズ
AI ソリューション
0
1
2
3
4
5
6
Q1
Q2
Q3
Q4
Axis Title
Axis Title
Option 1
Option 2
Option 3


## p.88

A M A Z O N Q
組織に合わせてカスタマイズ
された、業界をリードするエ
ンタープライズAI ソリュー
ション
Category 3
XX%
Category 2
XX%
Category 1
XX%


## p.89

Label A
Label B
Label C
Label D
Label A
Label B
Label C
Label D
Lorem ipsum dolor sit amet, consectetur
adipiscing elit
Lorem ipsum dolor sit amet, consectetur
adipiscing elit
Lorem ipsum dolor sit amet, consectetur
adipiscing elit
Lorem ipsum dolor sit amet, consectetur
adipiscing elit¥


## p.90

Bayer Crop Science は、生成AI を
活用してデータサイエンティストが
より速く簡単にイノベーションでき
るよう支援しています。
Bayer Crop Science はAWS の
生成AI でリジェネラティブ農業
をスケール
Up to 70%
Amazon Q Business による
従業員オンボーディング時
間の削減
Up to 30%
Amazon Q Developer によ
る開発者生産性の向上
Amazon Q Business
Amazon Q Developer


## p.91

Ask the Speaker
こちらのRoom 後方の外側にございます、
「Ask the Speaker」カウンターまでお越しください
渡辺啓太
アマゾンウェブサービスジャパン合同会社
Room


## p.92

本セッションのアンケートへ
ご協力をお願いします
Please give us your feedback
Thank you!
AIM461
