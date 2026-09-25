---
title: "Amazon ECS Managed Instances と AWS Fargate の仕組みと違いを知る"
category: "AWSセッション"
session_id: "CNS341"
pages: 66
topics: ["コスト最適化/FinOps", "生成AI/エージェント"]
services: ["AWS Fargate", "Amazon EC2", "Amazon ECS"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/AWSセッション/Amazon ECS Managed Instances と AWS Fargate の仕組みと違いを知る.pdf"
---
# Amazon ECS Managed Instances と AWS Fargate の仕組みと違いを知る


## p.1

CNS341
Amazon ECS Managed Instances と
AWS Fargate の仕組みと違いを知る
林航平
アマゾンウェブサービスジャパン合同会社


## p.2

自己紹介
林航平（Kohei Hayashi）
パブリックセクター技術統括本部
ガバメントクラウド技術本部
ソリューションアーキテクト
主に自治体領域のお客様への技術的な支援
お客様の生成AI 活用やコンテナ活用に関わるご支援
興味分野：コンテナ


## p.3

本セッションについて
想定聴講者
• Amazon ECS をご利用中でデータプレーンの運用負荷を軽減したい方
• Amazon ECS Managed Instances とAWS Fargate の使い分け
について知りたい方
ポイント
• ECS Managed Instances とFargate の仕組みと違い
•
キャパシティプロビジョニングとタスク配置
•
コスト最適化
•
インフラ管理と運用


## p.4

アジェンダ
イントロダクション
•
Amazon ECS
•
Amazon ECS Managed Instances
Amazon ECS Managed Instances とAWS Fargate
•
キャパシティプロビジョニングとタスク配置
•
コスト最適化
•
インフラ管理と運用
まとめ


## p.5

イントロダクション


## p.6

Amazon Elastic Container Service
シームレスなデプロイ、スケーリング、セキュリティのための
フルマネージドコンテナオーケストレーションサービス
30億以上のAmazon ECS タスクが毎週起動
65% 以上の新規AWS コンテナユーザーがAmazon ECS を利用
2025年のプライムデーで、平均1840万タスク/日が
AWS Fargate で実行


## p.7

Amazon ECS 構成要素
タスク
• 1つ以上のコンテナ
• コンピュート、ネットワーク、IAMの設定
タスク
タスク
サービス
クラスター
タスク
…
コンテナ


## p.8

Amazon ECS 構成要素
タスク
• 1つ以上のコンテナ
• コンピュート、ネットワーク、IAMの設定
サービス
• 1つ以上の同一タスク
• タスク実行コピー数の定義/維持
タスク
タスク
サービス
クラスター
タスク
…
コンテナ


## p.9

Amazon ECS 構成要素
タスク
• 1つ以上のコンテナ
• コンピュート、ネットワーク、IAMの設定
サービス
• 1つ以上の同一タスク
• タスク実行コピー数の定義/維持
クラスター
サービス、タスク、コンピュートの論理グループ
タスク
タスク
サービス
クラスター
タスク
…
コンテナ


## p.10

コンピュート
Amazon EC2, AWS Fargate, Amazon ECS Managed Instances
Amazon ECS 構成要素
タスク
• 1つ以上のコンテナ
• コンピュート、ネットワーク、IAMの設定
サービス
• 1つ以上の同一タスク
• タスク実行コピー数の定義/維持
クラスター
サービス、タスク、コンピュートの論理グループ
タスク
タスク
サービス
クラスター
タスク
…
コンテナ


## p.11

Amazon ECS 構成要素
タスク
• 1つ以上のコンテナ
• コンピュート、ネットワーク、IAMの設定
サービス
• 1つ以上の同一タスク
• タスク実行コピー数の定義/維持
クラスター
サービス、タスク、コンピュートの論理グループ
タスク
タスク
サービス
クラスター
タスク
…
コンテナ
コンピュート
Amazon EC2, AWS Fargate, Amazon ECS Managed Instances


## p.12

Amazon ECS Managed Instances
Fargate とEC2 起動タイプそれぞれのメリットを享受できる第3 の選択肢
AWS Fargate
Amazon EC2
ワークロードの要件を満たす
インスタンスタイプを自由に選択可能
インスタンス管理（パッチ適用等）は
AWS 側が実施
コンソリデーション等の
インフラストラクチャ最適化


## p.13

ECS on EC2 の責任共有モデル
アプリケーション
EC2 インスタンス
ECS Capacity Provider
ECS コントロールプレーン
AWS グローバル
インフラストラクチャ
ストレージ
ネットワーキング
モニタリング
コンピュート
リージョン
ローカルゾーン
エッジロケーション
コンピュート
オートスケーリング
お客様が管理
AWSが管理
起動
テンプレート
オペレーティ
ングシステム
コンテナ
ランタイム
ECS
エージェント
パッチ適用
モニタリング
AZ分散
インスタンス
選定
コンテナ
イメージ
ロード
バランサー
セキュリティ
グループ
IAMロール
基盤サービス


## p.14

Fargate とECS Managed Instances の責任共有モデル
お客様が管理
AWSが管理
ECS コントロールプレーン
AWS グローバル
インフラストラクチャ
基盤サービス
ストレージ
ネットワーキング
モニタリング
コンピュート
リージョン
ローカルゾーン
エッジロケーション
アプリケーション
EC2 インスタンス
ECS Capacity Provider
コンピュート
オートスケーリング
起動
テンプレート
オペレーティ
ングシステム
コンテナ
ランタイム
ECS
エージェント
パッチ適用
モニタリング
AZ分散
インスタンス
選定
コンテナ
イメージ
ロード
バランサー
セキュリティ
グループ
IAMロール


## p.15

タスクの分離境界
コンテナ
コンテナ
コンテナ
Amazon ECS Managed Instances
タスクB
コンテナ
タスクA
AWS Fargate
コンテナ
タスクA
コンテナ
タスクB
コンテナ
コンテナ
単一のEC2 インスタンスで
複数タスクを実行可能
Fargate ノードごとに
1タスクのみ実行可能


## p.16

AWS 
Fargate
Amazon ECS 
Managed 
Instances
Amazon 
EC2
ハードウェア
AWS
AWS
AWS
ロケーション
AWSリージョン
AWSリージョン
AWSリージョン
データプレーン配置アカウント
AWS管理
お客様アカウント
お客様アカウント
データプレーン
AWS管理
AWS管理
お客様管理
オペレーティングシステム
AWS管理
AWS管理
お客様管理
コントロールプレーン
AWSリージョン
AWSリージョン
AWSリージョン
Amazon ECS データプレーンの選択肢


## p.17

Amazon ECS Managed Instances と
AWS Fargate
- キャパシティプロビジョニングとタスク配置-


## p.18

Capacity Provider の概要
ECS Cluster
EC2 Auto Scaling Group
CapacityProvider
-
Auto Scaling Group ARN
-
Target Capacity
ECS Cluster
AWS Fargate
AWS Fargate Spot
CapacityProvider
FARGATE
CapacityProvider
FARGATE_SPOT
•
ECS とコンテナ実行基盤(Auto Scaling グループ/ Fargate) のインターフェイス
•
Auto Scaling Group、Fargate、ECS Managed Instances を
Capacity Provider として定義
•
定義したCapacity Provider をECS クラスターに紐付けて利用
•
Fargate のCapacity Provider (FARGATE / FARGATE_SPOT) は事前定義済み


## p.19

ECS スケジューリング
Amazon ECS クラスター
ECS タスク
Amazon ECS 
Managed ASG 
Capacity Provider
コンピュートエンジンとCapacity Providers


## p.20

ECS スケジューリング
Amazon ECS クラスター
ECS タスク
Amazon ECS 
Managed ASG 
Capacity Provider
コンピュートエンジンとCapacity Providers
AWS Fargate
Capacity Provider


## p.21

ECS スケジューリング
Amazon ECS クラスター
ECS タスク
Amazon ECS 
Managed ASG 
Capacity Provider
コンピュートエンジンとCapacity Providers
AWS Fargate
Capacity Provider
Amazon ECS 
Managed Instances 
Capacity Provider


## p.22

Amazon ECS
1 x vCPU
2 GB memory
AWS Fargate
Fargate – キャパシティプロビジョニング


## p.23

Amazon ECS
1 x vCPU
2 GB memory
AWS Fargate
4 x Task
Fargate – キャパシティプロビジョニング


## p.24

Amazon ECS
1 x vCPU
2 GB memory
AWS Fargate
Target group
Task
…
Task
…
Task …
Task
…
4 x Task
Fargate – キャパシティプロビジョニング


## p.25

Availability Zone 1
Availability Zone 3
Amazon ECS サービス
Amazon ECS Managed Instances Capacity Provider
ECS Managed Instances –
キャパシティプロビジョニング
ECS スケジューリング
Availability Zone 2


## p.26

ECS Managed Instances –
キャパシティプロビジョニング
Availability Zone 1
Availability Zone 3
Amazon ECS サービス
Amazon ECS Managed Instances Capacity Provider
ECS スケジューリング
Availability Zone 2
EC2 Fleet


## p.27

ECS Managed Instances –
キャパシティプロビジョニング
Availability Zone 1
Availability Zone 3
Amazon ECS サービス
Amazon ECS Managed Instances Capacity Provider
ECS スケジューリング
Availability Zone 2
ECS タスク
EC2 Fleet


## p.28

ECS スケジューリング
Amazon ECS クラスター
ECS タスク
Amazon ECS 
Managed Instances 
Capacity Provider
ECS Managed Instances – インスタンス選定
インスタンスタイプ


## p.29

ECS スケジューリング
Amazon ECS クラスター
ECS タスク
Amazon ECS 
Managed Instances 
Capacity Provider
ECS Managed Instances – インスタンス選定
インスタンスタイプ
インスタンス
属性


## p.30

ECS Managed Instances – インスタンス選定
ECS スケジューリング
ECS タスク
ECS タスク
EC2 インスタンス
ECS タスク
Memory Reservation
Memory
CPU
Memory
CPU
コンテナ


## p.31

ECS Managed Instances – タスクの配置（1）
ECS task
ECS Scheduling
ECS task ECS task ECS task ECS task
Pending Tasks
- インスタンスへの配置の流れ-


## p.32

ECS Managed Instances – タスクの配置（1）
ECS task
ECS Scheduling
Capacity we have
ECS task
ECS task
ECS task
ECS task ECS task
EC2 Instance
EC2 Instance
ECS task ECS task
Pending Tasks
- インスタンスへの配置の流れ-


## p.33

ECS Managed Instances – タスクの配置（1）
ECS task
ECS Scheduling
Capacity we have
Capacity we need
ECS task
ECS task
ECS task
ECS task ECS task
EC2 Instance
EC2 Instance
ECS task ECS task
Instance
Type A
Instance
Type B
Pending Tasks
- インスタンスへの配置の流れ-


## p.34

Virtual private cloud (VPC)
Availability Zone 1
Availability Zone 2
Availability Zone 3
Amazon ECS service
ECS task
Region
ECS task
ECS task
ECS task
Amazon ECS Managed Instances Capacity Provider
ECS Managed Instances – タスクの配置（2）
- 複数のタスクを大きなインスタンスに配置-
ECS task
ECS task
vCPU
vCPU
vCPU


## p.35

Virtual private cloud (VPC)
Availability Zone 1
Availability Zone 2
Availability Zone 3
Amazon ECS service
ECS task
Region
Image
ECS task
ECS task
ECS task
Amazon ECS Managed Instances Capacity Provider
Image
Image
ECS Managed Instances – タスクの配置（2）
- 複数のタスクを大きなインスタンスに配置-
ECS task
ECS task


## p.36

ECS task
Availability Zone 1
Availability Zone 2
Amazon ECS service
ECS task
Amazon ECS Managed Instances Capacity Provider
ECS Managed Instances – タスクの配置（3）
ECS Scheduling
ECS task
ECS task
EC2 Fleet
- タスクのAZ リバランス-


## p.37

ECS Managed Instances – タスクの配置（3）
- タスクのAZ リバランス-
ECS task
Availability Zone 1
Availability Zone 2
Amazon ECS service
ECS task
Amazon ECS Managed Instances Capacity Provider
ECS Scheduling
ECS task
ECS task
ECS task
EC2 Fleet


## p.38

ECS Managed Instances – タスクの配置（3）
- タスクのAZ リバランス-
ECS task
Amazon ECS service
ECS task
Amazon ECS Managed Instances Capacity Provider
ECS Scheduling
Availability Zone 1
Availability Zone 2
EC2 Fleet
ECS task
ECS task


## p.39

キャパシティプロビジョニングの整理
コンピュート
vCPU/RAMの組み合わせ
（=タスクサイズ）を指定可能
インスタンス属性/タイプを
指定可能な柔軟性
（ODCRの利用、GPU含む）
Capacity Provider
1インスタンスに1タスク起動
ECSによる高速スケーリング
Fargate
Managed Instances


## p.40

Amazon ECS Managed Instances と
AWS Fargate
- コスト最適化-


## p.41

コスト最適化
タスク起動時間の
短縮
購入オプション
イメージキャッシュの活用
Seekable OCI の活用
オンデマンド
Savings Plans
スポット
アイドル状態のインスタンスの検出
使用率の低いインスタンスの検出
ECS Managed Instances 
のインフラ最適化機能


## p.42

コスト最適化
タスク起動時間の
短縮
購入オプション
イメージキャッシュの活用
Seekable OCI の活用
オンデマンド
Savings Plans
スポット
アイドル状態のインスタンスの検出
使用率の低いインスタンスの検出
ECS Managed Instances 
のインフラ最適化機能


## p.43

Availability Zone 2
Availability Zone 3
Amazon ECS service
ECS task
Amazon ECS Managed Instances Capacity Provider
ECS Managed Instances – インフラ最適化
ECS Scheduling
ECS task
ECS task
Events
EC2 Fleet
- アイドル状態のインスタンスの検出-


## p.44

Availability Zone 2
Availability Zone 3
Amazon ECS service
ECS task
Amazon ECS Managed Instances Capacity Provider
ECS Managed Instances – インフラ最適化
ECS Scheduling
ECS task
ECS task
Events
EC2 Fleet
- アイドル状態のインスタンスの検出-


## p.45

Availability Zone 2
Availability Zone 3
Amazon ECS service
Amazon ECS Managed Instances Capacity Provider
ECS Managed Instances – インフラ最適化
ECS Scheduling
ECS task
Events
EC2 Fleet
- アイドル状態のインスタンスの検出-


## p.46

Availability Zone 2
Availability Zone 3
Amazon ECS service
ECS task
Amazon ECS Managed Instances Capacity Provider
ECS Managed Instances – インフラ最適化
ECS Scheduling
ECS task
Events
EC2 Fleet
- 使用率の低いインスタンスの検出-
ECS task
ECS task


## p.47

Availability Zone 2
Availability Zone 3
Amazon ECS service
Amazon ECS Managed Instances Capacity Provider
ECS Managed Instances – インフラ最適化
ECS Scheduling
ECS task
ECS task
Events
EC2 Fleet
- 使用率の低いインスタンスの検出-
ECS task
ECS task


## p.48

Availability Zone 2
Availability Zone 3
Amazon ECS service
Amazon ECS Managed Instances Capacity Provider
ECS Managed Instances – インフラ最適化
ECS Scheduling
ECS task
Events
EC2 Fleet
- 使用率の低いインスタンスの検出-
ECS task
ECS task


## p.49

コスト最適化
タスク起動時間の
短縮
購入オプション
イメージキャッシュの活用
Seekable OCI の活用
オンデマンド
Savings Plans
スポット
アイドル状態のインスタンスの検出
使用率の低いインスタンスの検出
ECS Managed Instances 
のインフラ最適化機能


## p.50

購入オプションの選択
Savings plans
コミット済みの
定常利用
ステートフルな
スパイクワークロード
オンデマンド
長期コミットメントなしで
使用分のみ課金
スポット
オンデマンド価格から
最大90%割引の
余剰キャパシティ
耐障害性、柔軟性のある
ステートレスワークロード
1年または3年の時間単位の
コミットメントで
最大72%の節約


## p.51

コスト最適化
タスク起動時間の
短縮
購入オプション
イメージキャッシュの活用
Seekable OCI の活用
オンデマンド
Savings Plans
スポット
アイドル状態のインスタンスの検出
使用率の低いインスタンスの検出
ECS Managed Instances 
のインフラ最適化機能


## p.52

タスク起動時間の短縮
キャッシュ
コンテナ
EC2 Instance
キャッシュ
コンテナ
イメージ
レジストリ
Fargate
Seekable OCI (SOCI) の活用
イメージの遅延読み込みを設定して
タスク起動を高速化
イメージキャッシュの活用
インスタンス上のイメージキャッシュを活用して
タスク起動時間の短縮
Amazon ECS Managed Instances
AWS Fargate


## p.53

Amazon ECS Managed Instances と
AWS Fargate
- インフラ管理と運用-


## p.54

Fargate – パッチの自動適用
Task retirement notice overview:
https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-maintenance.html#task-retirement-notice
Platform version 
revision x
リリース
Platform version 
revision x 上で
新タスク起動


## p.55

Fargate – パッチの自動適用
Task retirement notice overview:
https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-maintenance.html#task-retirement-notice
Platform version 
revision x
リリース
Platform version 
revision x 上で
新タスク起動
Platform version 
revision y
リリース
Platform version 
revision y 上で
新タスク起動


## p.56

Fargate – パッチの自動適用
Task retirement notice overview:
https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-maintenance.html#task-retirement-notice
Platform version 
revision x
リリース
Platform version 
revision x 上で
新タスク起動
Platform version 
revision x が
“リタイア予定”
Platform version 
revision x が
リタイア
イベントウィンドウ
or
タスクリタイアメント
待機時間
Platform version 
revision y
リリース
Platform version 
revision y 上で
新タスク起動


## p.57

Fargate – パッチの自動適用
Task retirement notice overview:
https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-maintenance.html#task-retirement-notice
Platform version 
revision x
リリース
Platform version 
revision x 上で
新タスク起動
Platform version 
revision x が
“リタイア予定”
Platform version 
revision x が
リタイア
Platform version 
revision y
リリース
Platform version 
revision y 上で
新タスク起動
Platf
rev
“リタ
Platf
r
イベントウィンドウ
or
タスクリタイアメント
待機時間


## p.58

• ECS マネージドインスタンスでは、起動後14 日後に
インスタンスのドレイニングが開始される
• ECS タスクを退避して、AMI を最新化すること（セキュリティ）が目的
• その後、起動後21日後にインスタンスが削除される
time
インスタンスの起動
ドレイニング開始
インスタンス削除
14 days
7 days
0 day
14 days
21 days
ECS Managed Instances – パッチの自動適用


## p.59

• 早期ドレイニングが発生するケース
• EC2 イベントウィンドウを設定している場合
• インスタンス上のソフトウェアにセキュリティ脆弱性が検出された場合
• 基盤となるハードウェアの健全性が低下した場合
time
インスタンスの起動
ドレイニング開始
インスタンス削除
13 days
8 days
0 day
14 days
21 days
EC2 イベントウィンドウ
ECS Managed Instances – パッチの自動適用


## p.60

その他セキュリティ観点での比較
パッチ適用
定期的なインスタンス入れ替え
• EC2イベントウィンドウ
• タスクリタイアメント待機時間
起動後14-21日でインスタンス
入れ替え
• EC2イベントウィンドウ
タスク分離境界
1インスタンスにつき1タスク起動
1インスタンスに
1〜複数タスク起動可能
OS
AWS管理のAMI
AWS管理のAMI
コンテナへのアクセスSSHアクセスは不可
（ECS Execは可能）
SSHアクセスは不可
（ECS Execは可能）
特権コンテナ
不可
可能
ネットワークモード
awsvpc
awsvpc / host / none
Fargate
Managed Instances


## p.61

Amazon ECS の
コンプライアンス
https://aws.amazon.com/compli
ance/services-in-scope/ 
•
Amazon ECS は以下のコンプライアンスプログラムの
対象です：PCI、HIPAA、SOC、ISO/CSA STAR、
ISMAP、MTCS、C5、HITRUST CSF、FINMA、PiTuKri、
FEDRAMP、DoD CC、IRAP、K-ISMS、ENS-High、
OSPAR、GSMA、CCCS
•
Amazon ECS Managed Instances とAWS Fargate は
AWS がインフラ管理とインスタンスパッチ適用を
担当するため、お客様のコンプライアンス対応を
支援します


## p.62

まとめ


## p.63

まとめ
コンピュート
vCPU/RAMの組み合わせ
（=タスクサイズ）を指定可能
インスタンス属性/タイプを指定可能な柔軟性
（ODCRの利用、GPU含む）
Capacity Provider
1インスタンスに1タスク起動
ECSによる高速スケーリング
コスト最適化
タスク集約率の管理不要
Seekable OCIの活用
インフラ最適化機能によるコスト最適化
イメージキャッシュの活用
インフラ管理と
運用
定期的なインスタンス入れ替え
起動後14-21日でインスタンス入れ替え
特権Linux capabilitiesをサポート
Fargate
Managed Instances


## p.64

まとめ詳細
コンピュート
AWSマネージドなインスタンス：
vCPU/RAMの組み合わせ（=タスク
サイズ）を指定可能
AWSマネージドなインスタンス：
インスタンス属性/タイプを指定可能な
柔軟性（ODCRの利用、GPU含む）
セルフマネージドインスタンス：
お客様側で指定したAMIでインス
タンスを起動（ODCRの利用）
Capacity Provider
FARGATE/FARGATE SPOT
•
1インスタンスに1タスク起動
•
ベストエフォートでAZ分散/リバ
ランス
MANAGED INSTANCES
•
ECSによる高速スケーリング
•
ECSによるインフラ最適化
•
ベストエフォートでAZ分散/リバランス
AUTO SCALING GROUP
•
Auto Scaling・CloudWatchと
連携したスケーリング
•
ベストエフォートでAZ分散/リ
バランス
コスト最適化
•
Compute SP/Spotの活用
•
タスク集約率の管理不要
•
Seekable OCIの活用
•
RI/SP/Spotの活用
•
インフラ最適化機能による
コスト最適化
•
イメージキャッシュの活用
•
RI/SP/Spotの活用
•
イメージキャッシュの活用
インフラ管理と
運用
AWSが管理
•
SSH不可（ECS Exec可能）
•
定期的なインスタンス入れ替え
お客様が設定可能
•
EC2イベントウィンドウ
•
タスクのリタイア待機時間
AWSが管理（お客様アカウント内に起動）
•
SSH不可（ECS Exec可能）
•
特権Linux capabilitiesをサポート
•
起動後14-21日でインスタンス入れ替え
お客様が設定可能
•
EC2イベントウィンドウ
お客様が管理
•
EC2イベントウィンドウの
設定が可能
Fargate
Managed Instances
EC2


## p.65

Ask the Speaker
こちらのRoom 後方の外側にございます、
「Ask the Speaker」カウンターまでお越しください
林航平
アマゾンウェブサービスジャパン合同会社
Room


## p.66

本セッションのアンケートへ
ご協力をお願いします
Please give us your feedback
Thank you!
CNS341
