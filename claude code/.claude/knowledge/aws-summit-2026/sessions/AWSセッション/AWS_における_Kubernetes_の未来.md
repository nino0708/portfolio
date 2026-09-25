---
title: "AWS における Kubernetes の未来"
category: "AWSセッション"
session_id: "CNS348"
pages: 61
topics: ["AI駆動開発"]
services: ["AWS IAM", "AWS Organizations", "Amazon EKS", "Amazon Q", "Kiro", "MCP", "Trainium"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/AWSセッション/AWS における Kubernetes の未来.pdf"
---
# AWS における Kubernetes の未来


## p.1

CNS348
AWS におけるKubernetes の未来
⼩⻄杏典
アマゾンウェブサービスジャパン合同会社


## p.2

⾃⼰紹介
 ⼩⻄ 杏典 (Kyosuke Konishi)
  Amazon Web Services Japan G.K.
  Solutions Architect
ISV/SaaS 企業のお客様を中⼼に
ソリューションアーキテクトとして技術⽀援に従事
• 好きなサービス
               Amazon EKS                   Kiro CLI
 
@_konippi
https://x.com/_konippi
konippi
https://github.com/konippi


## p.3

• Kubernetes と Amazon EKS のいま
• Amazon EKS のアップデート
• クラスターの運⽤を進化させる
• クラスターをあらゆる場所で実⾏する
• クラスターインフラストラクチャを⾃動化する
• クラスターを超えてプラットフォームを構築する
• AI を超⼤規模に実⾏する
• Amazon EKS のこれから
アジェンダ


## p.4

80%
本番環境で使⽤中
13%
パイロット / 評価中
https://www.cncf.io/reports/cncf-annual-report-2024/


## p.5

シンプルさ
AWS SDK
10,000 メソッド
Kubernetes Core
1,500 メソッド


## p.6

シンプルさ
⼀貫性
拡張性
数百の互換ツール
約 200 の CNCF プロジェクト
無限のカスタマイズ


## p.7

25
24
23
22
21
20
19
18
17
16
15
14
13
12
11
10
9
8
7
6
5
4
3
2
0
EKS ⼀般提供を
開始
マネージドクラ
スターバージョン
アップデート
GPU サポート
HIPAA 適格
32 の AWS リージ
ョンに拡⼤
Kubernetes ネッ
トワークポリシー
の適⽤
バージョンの
延⻑サポート
バージョン
リリースの加速
Pod Identity
S3 Mountpoints 
CSI ドライバー
アップグレード
インサイト
IPv6 クラスターが
利⽤可能に
Outposts 上の
ローカルクラスター
Trainium 
インスタンス
AWS marketplace
からのアドオン
PrivateLink サポート
Nitro enclaves
起動時間の短縮
OIDC アクセス認証
クラスター作成時
間 40% 短縮
EFA, P4d インスタ
ンスサポート
EKS Anywhere GA
EKS Connector
FedRamp High 準拠
コントロールプレー
ンのスケーリング
Karpenter 
プロジェクト
ISO, PCI, SOC 準拠
15 の AWS リージ
ョンに拡⼤
EBS、EFS、
FSx for Lustre ⽤ 
CSI ドライバー
Pod セキュリティ
ポリシー
マネージド型
ノードグループ
EKS Fargate
EKS on AWS 
Outposts
2018
2020
2021
2022
2023
2019
2024
Amazon Linux 
2023
⾃動バージョン
アップグレード
ゾーンシフト
完全 IPv6 サポート
Auto Mode
Hybrid Nodes
メトリクス
ダッシュボード
ノードのヘルスと
⾃動ノード修復
2025
EKS Capabilities
AWS におけるマネージド Kubernetes の 8 年間
デフォルトの
エンベロープ暗号化
マルチクラスター
グローバル
ダッシュボード
10万ノード
クラスター
AWS Backup for 
EKS
コミュニティ
アドオン
Launch Counter //
ACK プロジェクト
料⾦を $0.10/時間
に値下げ
シークレットの
暗号化
SLA を 99.95% に
引き上げ
EKS CIS 
ベンチマーク
EKS コンソールで
k8s リソース表⽰
EKS on AWS Local 
zones
EKS アドオン
Load balancer 
controller


## p.8

Kubernetes 環境の構築
コンテナ
パッケージング
アプリケーション / コード / データ
Kubernetes コントロールプレーン
開発者ツール
管理ツール
インフラストラクチャ
レジストリ


## p.9

IDP、デプロイメント、ジョブ、ML ワークフロー
Kubernetes 
コントロールプレーン
開発者ツール
管理ツール
デプロイメント、オブザーバビリティ、
ガバナンス、トラフィック、セキュリティ
インフラストラクチャ
スケール、可⽤性、統合と拡張
コンピューティング、ネットワーク、ストレージ
レジストリ
アプリケーション / コード / データ
Kubernetes 環境の構築
コンテナ
パッケージング


## p.10

A M A Z O N E K S
数千万の
クラスターを運⽤
ü Kubernetes を運⽤する最も信頼性の⾼い⽅法
 
ü 信頼性、スケーラビリティ、セキュリティに
優れたアプリケーションを構築 
ü 完全なアップストリーム準拠で認定済みの 
Kubernetes 適合性


## p.11

クラスターの運⽤を進化させる


## p.12

クラスターインサイトの
オンデマンド更新
マネージドノードグループの
新しい更新戦略
Kubernetes バージョン
サポートの迅速化
⾃動更新を待たずに、
クラスターアップグレードや
設定変更時のテストと検証が可能
クラスター内の EC2 インスタンスを
新しい設定や Kubernetes バージョン
に更新する際の柔軟性と制御性を提供
過去 2 年間全てのアップストリーム 
Kubernetes バージョンを 
45 ⽇以内に EKS で提供
EKS アップグレードの改善


## p.13

EKS グローバルダッシュボード
クラスターインベントリの確認、
コンプライアンスの監視、
フリート全体のバージョンドリフトなどの修正計画
AWS Organizations からワンクリックで有効化し、
アカウント全体の全てのクラスターを表⽰


## p.14

EKS アップグレードインサイト


## p.15

問題の迅速なトラブルシューティング
クラスター内の
オブザーバビリティ
API サーバーに頻繁にリクエストを
投げているクライアントの確認、
ノードヘルスの診断など


## p.16

EKS コンテナ
ネットワークの
オブザーバビリティ
ネットワークパフォーマンスモニタリング
Pod およびノードレベルのネットワークメトリクスを CloudWatch 
またはオブザーバビリティスタックにエクスポートし、クラスター
トラフィック、AZ 間フロー、AWS サービス全体の異常検出に活⽤
EKS ネイティブの可視化
Network Flow Monitor を活⽤した EKS コンソールのネイティブな
可視化で Kubernetes ネットワーク環境をより深く把握
⼀⽬でわかるサービスマップ
ワークロード間の通信を可視化し、再送信や再送信タイムアウトを
引き起こす原因となる頻繁にリクエストを投げているクライアントや
ネットワークフローを特定


## p.17

EKS コンテナ
ネットワークの
オブザーバビリティ
サービスマップ: ポッドビュー
フローテーブル: クラスタービュー


## p.18

Amazon EKS 向け CloudWatch Container Insights
メトリクスによる
クラスターヘルスの
可視化
Application Signals サポート, EBS 詳細パフォーマンスメトリクス, 1 分未満の GPU メトリクス
リソース消費量上位から
プロアクティブに対応
アラームと使⽤率
ステータスによる
パフォーマンス概要


## p.19

EKS と Kubernetes のコンテキストを理解
EKS と Kubernetes のコンテキスト情報で
運⽤・トラブルシューティングエージェントを強化
クラスター運⽤の⾃動化
⾃作スクリプトなしで運⽤エージェントに
EKS クラスターと Kubernetes リソースの管理機能を付与
統合されたセキュリティ
ホストされた EKS MCP サーバーにより、クライアントローカルの 
MCP サーバーが不要に。AWS IAM とSigV4 による⼀貫した
認証・認可を実現
あらゆる開発環境で
Q コンソール、Kiro、その他の AI 搭載 IDE に統合
フルマネージド型
EKS MCP サーバー 
(preview)


## p.20

複雑なコンテナトラブルシューティングの解決
ログ、メトリクス、イベント、設定を横断的に調査する
必要がある多層的なコンテナの問題を解決
AI を活⽤した根本原因分析
数百万の EKS クラスターから得ることが可能な
内部テレメトリと運⽤パターンにアクセス
コンソールの各画⾯に組み込み
トラブルシューティングや使い始めの際に Q へ質問
EKS コンソールに 
Amazon Q 
Developer を統合


## p.21

Amazon EKS アドオン
EKS クラスター
ü クラスター起動前のアドオン構成
ü コアネットワークアドオンなしでのクラスター起動 
(例: VPC CNI、CoreDNS など)
Kubecost, Datadog, Upbound UXP, Kubearmor, Gloo,
Akuity, New Relic, Splunk, Datree, Dynatrace, Rafay, 
StormForge, Kong など多数
ü Metrics server / Kube state metrics
ü ExternalDNS
ü Fluent Bit
ü Cert Manager
拡充されたコミュニティカタログ


## p.22

AWS Backup の Amazon EKS サポート
Amazon EKS バックアップには、EKS クラスター状態 (Kubernetes のデプロイメントおよびリソース) 
と EKS クラスターにアタッチされた永続ボリューム (EBS、EFS、S3) のバックアップが含まれる
AWS ネイティブな
バックアップソリューション
サードパーティツールやアドオンが不要な
完全ネイティブな AWS Backup ソリューション
コンプライアンスの確保
コンプライアンス確保のために
定期バックアップのスケジュール実⾏と
アカウント間 / リージョン間コピーの作成
粒度の細かいリストア体験
RTO 短縮に向けた、EKS クラスター全体・
特定の EKS 名前空間・永続ストレージ単位での
リカバリ
災害およびデータ損失からの保護
データ損失イベント時やクラスター
アップグレード前における EKS クラスターと
アプリケーションデータの保護


## p.23

クラスターをあらゆる場所で実⾏する


## p.24

グローバルな展開
38
118
35
31


## p.25

ロケーション
コントロールプレーン
ノード
サポート
ハードウェア
AWS マネージド
カスタマー管理
リージョン接続
の要否
Amazon EKS
EKS Distro
任意
Kubernetes をどこでも実⾏可能
EKS on 
Local Zones
任意
任意
任意
コミュニティ
不要
カスタマー
オンプレミス
不要
必要
Outpost
必要
Wavelength
必要
ローカルゾーン
必要
必要
Wavelength
EKS on 
Wavelength
EKS on 
Outposts
Hybrid 
Nodes
EKS
Anywhere
カスタマー
オンプレミス
オンプレミス
オンプレミス
オンプレミス
オンプレミス
ローカルゾーン


## p.26

Hybrid Nodes
クラスターをあらゆる場所へ拡張


## p.27

既存のオンプレミスやエッジインフラストラクチャを 
Amazon EKS クラスターのノードとして活⽤し、
環境を横断した Kubernetes 運⽤の統⼀を実現
オンプレミスアプリケーションに A M A Z O N E K S のパワーをもたらす
Amazon EKS Hybrid Nodes
環境を横断した Kubernetes 運⽤を統⼀することで
運⽤効率を向上
Kubernetes 管理の総保有コスト (TCO) を削減
オンプレミスで AWS クラウドのメリットと
スケールを享受
ワークロードをどこでも実⾏できる柔軟性を獲得


## p.28

クラスターインフラストラクチャを
⾃動化する


## p.29

Auto Mode
Kubernetes クラスター
インフラストラクチャを⾃動化する


## p.30

Amazon EKS 
Auto Mode
クラスター運⽤を AWS にオフロードし、
アジリティの向上とイノベーションの加速
を実現
AWS における運⽤上の優秀性により、
アプリケーションのパフォーマンス・
可⽤性・セキュリティを向上
⾃動キャパシティプランニングと
動的スケーリングにより、
コンピューティングコストを最適化


## p.31

Amazon EKS cluster
EKS account
Customer account
Karpenter
Amazon EBS 
CSI Driver
AWS Load Balancer 
Controller
Amazon EKS Add-Ons
kube-proxy
EKS Pod 
Identity
EC2 Instances 
Supporting AWS Services
EBS Volumes
Application Load 
Balancer
Network Load 
Balancer
以前の EKS クラスターアーキテクチャ
Managed Control Plane
Cluster 
Endpoint


## p.32

Auto Mode を利⽤した EKS クラスターアーキテクチャ
Amazon EKS cluster
EKS account
Managed Control Plane
Customer account
Supporting AWS Services
EBS Volumes
Application Load 
Balancer
Network Load 
Balancer
EC2 Managed Instances 
Compute
Storage
Load 
Balancing
Managed Capabilities
Cluster 
Endpoint


## p.33

EKS Auto Mode の主な機能
全ての EC2 インス
タンスタイプを
利⽤可能
あらゆる 
Kubernetes ワーク
ロードを実⾏可能
コアクラスター
機能をフル
マネージドで提供
デフォルトで
セキュア
より簡単でより
素早く始められる
⾃動アップグレード


## p.34

EKS Auto Mode 
新機能
SOCI による並列プル & アンパック
EKS Auto Mode で NVIDIA (G, P) または Trainium インスタンスを
利⽤する際、SOCI がデフォルトで有効になり、起動・スケーリングが
⾼速化されます。
静的キャパシティプロビジョニング
EKS Auto Mode で AI のトレーニングや推論など、要件の厳しい
ワークロードで必要となる事前確保したキャパシティが
利⽤可能になりました。
FIPS、ガバメントクラウド、ローカルゾーンをサポート
EKS Auto Mode が AWS GovCloud およびローカルゾーンで利⽤可能
になり、FIPS 準拠もオプトインで選択可能です。
⾼度なネットワーキングオプション
ノードとは別のサブネットで Pod を実⾏できるほか、
パブリック IP アドレスの割り当てを抑⽌することも可能です。
新機能の全リストはこちら


## p.35

クラスターを超えて
プラットフォームを構築する


## p.36

Capabilities
Capabilities
プラットフォームを構築・スケールする


## p.37

EKS Capabilities
基盤サービスを AWS にオフロードし、
開発速度の向上を実現
Kubernetes ネイティブのプラットフォーム
サービスでオープンスタンダードを採⽤・拡張
初⽇からベストプラクティスで構築し、
⾃⼰修復型・宣⾔的なシステムでスケール


## p.38

宣⾔型継続的デプロイメントと Argo CD
ボタン⼀つでフルマネージドの Argo CD による GitOps
Argo CD で構築
•
オープンスタンダードな
GitOps ツール
•
宣⾔型のプロジェクト、
アプリケーション、
リソース
AWS と統合
•
EKS のクラスター設定を
簡素化
•
IAM Identity Center による
シングルサインオンサポート
•
AWS Secrets Manager による
シークレット管理
過度な制約なし
•
EKS によるフルマネージド、
Kubernetes 標準リソースを
利⽤
•
移⾏が容易、
独⾃コンポーネントなし


## p.39

カスタムリソースの作成とオーケストレーション
Kubernetes ネイティブなクラウドリソース管理とカスタマイズ
ACK と kro で構築
•
IaC を標準化レイヤーに
組み込む
•
AWS クラウドリソース向け
のカスタムリソース
•
クラスターおよびその他の
クラウドリソースを管理
依存関係を⼀元管理
•
依存するワークロードと
クラウドリソースを⼀緒に
作成・管理・モニタリング
•
複数ツールと複数の
信頼可能なリソースによる
分散管理を解消
新たな標準
•
コンポジションとカスタム
リソースにkro を活⽤
•
ACK の機能は
アップストリーム標準への
整合に向けて進化中


## p.40

カスタマーエクスペリエンス
# aws eks create-capability     \
      –-type argocd          \
      --cluster staging-east \
      --service-role arn:aws:iam::..
EKS 管理者
$ kubectl apply –f app-stack.yaml
$ kubectl get apps –n my-team 
EKS 開発者


## p.41

Amazon EKS のセルフマネージドプラットフォーム
Amazon EKS Cluster
EKS account
Managed Control Plane
Etcd
 Instances
API Server 
instances
Customer account
ArgoCD
Self-managed OSS
Kube Resource 
Orchestrator
AWS Controllers 
for K8s
EC2 Instances 
AWS Resources
IAM Roles
S3 Buckets
ElastiCache 
Nodes


## p.42

EKS Capabilities と EKS Auto Mode
Amazon EKS cluster
EKS account
Managed Control Plane
Etcd
 Instances
API Server 
instances
Customer account
Cluster resources
Cloud Resources
Applications
Compositions
EC2 Managed Instances 
ACK
ArgoCD
kro
Managed Capabilities
AWS Resources
IAM Roles
S3 Buckets
ElastiCache 
Nodes


## p.43

EKS Capabilities のビジョン
EKS Capabilities は Kubernetes on AWS でお客様が構築・スケール
するためのマネージド機能を提供し、進化するクラスターライフ
サイクル機能を補完します
オープンスタンダード
⼀般的なユースケースに対応
するオープンスタンダードの
ソリューションでお客様が実際
に取り組む場所に寄り添います
使いやすさ
フルマネージドなソリューショ
ンで運⽤負担をオフロードし、
開発者のワークフローをシンプ
ルにします
新たなイノベーション
Kubernetes の拡張性を活かし、
ネイティブな EKS 機能を
クラスター内に組み込みます


## p.44

AI を超⼤規模に実⾏する


## p.45

10 万ノード超えまでスケール
80 万個の NVIDIA GPU
160 万個の AWS Trainium チップ
Amazon EKS 
超⼤規模
クラスター


## p.46

超⼤規模クラスターを⽀える上で
最も重要な変更
コンセンサス処理のオフロード
キースペースのパーティション化
インメモリデータベース
超⼤規模クラスター
次世代の
データストア


## p.47

プロビジョンド
コントロールプレーン
コンピュート容量を強化した、
⾼性能なコントロールプレーン
スケーリングティアのご紹介


## p.48

プロビジョンド
コントロールプレーン
事前にコントロールプレーンをプロビジョニングし、
予測可能なパフォーマンスを実現
要求の厳しいワークロード向けに、
⼤幅に強化されたコンピュート容量を提供
コントロールプレーンのティアを設定し、
ベースラインを超えてスケールすることで
予期しない需要の急増に対応


## p.49

Amazon EKS コントロールプレーンの選択肢
スタンダードおよびプロビジョンドコントロールプレーン
モデルの
切り替え


## p.50

新しいティアでは何が提供されるか
プロビジョンドコントロールプレーン
スケーリングティア
ティアごとの値 (EKS v1.30+)
API リクエスト
同時実⾏数
ポッドスケジューリング
レート
クラスター
データベースサイズ
XL
1700
167
16GB
2XL
3400
283
16GB
4XL
6800
400
16GB
8XL
13600
400
16GB
公開されたプライシングページはこちら


## p.51

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
Amazon EKS のこれから


## p.52

”Kubernetes API とエコシステムの
ツールは使いたい。しかし、クラスターや
アップグレードのことは考えたくない”
- Kubernetes を新たに採⽤されたお客様


## p.53

ソフトウェアの
技術的課題に取り組む
それ以外の
難しい課題に取り組む


## p.54

テクノロジー企業にならずにテクノロジーを使いこなす
先進的な運⽤はすでに存在する⼀⽅で、
まだ⼀部の企業にしか⾏き届いていない
オープンソースも⼤規模に運⽤するほど
コストがかかる


## p.55

価値創出までの時間を短縮する
イノベーションを⺠主化する
導⼊のハードルを下げる
で共に早く前進する
CAPEX を OPEX に転換する


## p.56

EKS の進化
2018
2020
2021
2022
2019
マネージドコントロールプレーン
マネージドデータプレーン
マネージド運⽤ツール


## p.57

EKS の進化
マネージドクラスター
マネージドプラットフォームコンポーネント
統合された開発者エクスペリエンス
統合されたハイブリッド環境
2018
2019
2020
2021
2022
2023
2024
2025
これから


## p.58

あらゆるスケールの重要なワークロードパターンに対応
AWS との統合強化とツールの深化
ワークロードの存在する場所に対応
オープンソースコミュニティのイノベーション加速
プラットフォーム構築の簡素化
今後 3 年間の


## p.59

公開されたロードマップ
•
私たちが取り組んでいる内容を最新情報としてキャッチアップできます
•
フィードバックやアイデアをお寄せいただきたいです
•
新機能のリリース時に通知を受け取れます
github.com/aws/containers-roadmap


## p.60

Ask the Speaker
こちらのRoom 後⽅の外側にございます、
「Ask the Speaker」カウンターまでお越しください
⼩⻄杏典
アマゾンウェブサービスジャパン合同会社
Room


## p.61

本セッションのアンケートへ
ご協⼒をお願いします
Please give us your feedback
Thank you!
CNS348
