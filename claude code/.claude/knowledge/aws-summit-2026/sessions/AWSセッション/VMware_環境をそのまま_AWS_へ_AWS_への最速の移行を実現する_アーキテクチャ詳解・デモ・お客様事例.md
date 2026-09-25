---
title: "VMware 環境をそのまま AWS へ︓ AWS への最速の移⾏を実現する アーキテクチャ詳解・デモ・お客様事例"
category: "AWSセッション"
session_id: "MAM332"
pages: 42
topics: ["アーキテクチャ/サーバーレス", "マイグレーション/モダナイゼーション"]
services: ["AWS CloudFormation", "AWS Lambda", "AWS Outposts", "AWS Transit Gateway", "Amazon EC2", "Amazon EKS", "Amazon FSx", "Amazon RDS", "Amazon VPC"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/AWSセッション/VMware 環境をそのまま AWS へ︓ AWS への最速の移⾏を実現する アーキテクチャ詳解・デモ・お客様事例.pdf"
---
# VMware 環境をそのまま AWS へ︓ AWS への最速の移⾏を実現する アーキテクチャ詳解・デモ・お客様事例


## p.1

MAM332
VMware 環境をそのまま AWS へ︓
AWS への最速の移⾏を実現する
アーキテクチャ詳解・デモ・お客様事例
豊⽥ 真⾏
アマゾン ウェブサービス ジャパン合同会社


## p.2

⾃⼰紹介
豊⽥真⾏
アマゾンウェブサービスジャパン合同会社
シニアパートナーソリューションアーキテクト
経歴
•
外資系 IT ベンダーにて VMware vSphere を⽤いた
エンタープライズ向けクラウドサービスの設計・構築に従事
•
Global の Team Lead として10ヶ国のクラウドサービスの
⽴ち上げを担当
•
クラウドマイグレーションアーキテクトとしてオンプレミスの
vSphere 環境からクラウドへの移⾏を担当後、2019 年より現職
•
VMware vExpert 2022-2026
ミッション
•
AWS パートナーのVMware ワークロードのAWS 移⾏のための⽀援


## p.3

本セッションのねらい
VMware ワークロードを AWS へ最短で移⾏する 
Amazon Elastic VMware Service (Amazon EVS) のアーキテクチャを理解する
想定聴講者
•
既存の VMware 投資を活かして AWS へ移⾏したい⽅
•
IP アドレス維持やダウンタイム最⼩化、古いOS の移⾏が課題の⽅
前提知識
•
AWS︓Amazon EC2  とAmazon VPC などネットワークサービスの基本
•
VMware ︓ VMware vSphere、vSAN、NSX の基本
ゴール
•
VMware ワークロードを AWS に移⾏する選択肢の理解
•
Amazon EVS のアーキテクチャ詳細と活⽤事例の理解


## p.4

• VMware ワークロードの移⾏パス
• Amazon EVS の概要
• Amazon EVS ネットワークアーキテクチャ
• Amazon EVS ストレージアーキテクチャ
• デモ
• お客様事例
Agenda


## p.6

Amazon Elastic VMware Service 
(Amazon EVS)
Amazon Elastic Compute Cloud
(Amazon EC2)
Amazon Elastic Kubernetes Service 
(Amazon EKS)
AWS Lambda
Amazon Relational Database Service 
(Amazon RDS)
VMware ワークロードの移⾏パス


## p.7

VMware ワークロードの将来の状態
AWS オンプレミス
AWS Outposts
Amazon EC2
コンテナ
マネージドサービス
AWS クラウドのサービスを
オンプレミス環境で実⾏
代替パートナーオファリング
Nutanix Cloud Clusters 
(NC2) on AWS
Red Hat OpenShift Service 
on AWS (ROSA)
迅速な導⼊／
早期 ROI
クラウドのメリット
最⼤化／⾼ ROI
Amazon EVS
リロケート
AWS リージョン
モダンアプリケーション
リファクタ
Amazon EC2
マネージドサービス
リプラットフォーム
リプラットフォーム
リホスト
コンテナ


## p.8

AWS CloudFormation、AWS CLI、SDK
オンプレミス
vSphere ベースの環境
vSphere
vSAN
NSX
お客様データセンター
VMware Cloud Foundation
SDDC
Manager
vSphere
vSAN
NSX
Amazon 
EC2
Amazon 
S3
Amazon 
RDS
AWS 
Shield
Amazon 
CloudWatch
AWS Systems
Manager
Elastic Load 
Balancing
Amazon 
Bedrock
AWS グローバルインフラストラクチャ
Amazon EVS の概要
Amazon Virtual Private Cloud (Amazon VPC) 内の EC2 ベアメタルインスタンスで VMware Cloud Foundation (VCF) を直接実⾏
Amazon EVS


## p.9

i4i.metal
64 個の物理コア
30 TB
8 x 3,750 GB AWS Nitro SSD
1024 GiB メモリ
I4i
i7i.metal-24xl
48 個の物理コア
22.5 TB
6 x 3,750 GB AWS Nitro SSD
768 GiB メモリ
I7i
• x86 ベアメタル EC2 インスタンス
•
i4i.metal : 
Intel Xeon Ice Lake - 128 vCPUs -
2.9 GHz / 3.5 GHz Turbo
•
i7i.metal-24xl : 
Intel Xeon Emerald Rapids -
96 vCPUs - 3.2 GHz / 4.0 GHz Turbo
• Broadcom による認定
Amazon EVS コンピューティング


## p.10

Amazon EVS 環境
VCF 管理アプライアンス
クラスタ 1 (最低 4 ホスト)
EVS 環境 1
ESXi ホスト 1
ESXi ホスト 2
ESXi ホスト 3
ESXi ホスト 4
ESXi ホスト 5-32
クラスタ (最低 3 ホスト)
EVS 環境 : VCF インスタンスの
リソースを格納する論理的なコンテナ
• ホスト: VCF の要件に基づき、最低 4 台の
インスタンス
• VMware Cloud Builder を使⽤して
導⼊される標準の VCF 5.2.2 / 5.2.1
• 統合 VCF ドメインのみサポート
• vSphere、vSAN、NSX をデプロイ時
に⾃動的に構成
• クラスタの追加が可能
• 環境あたり 4 〜 32 ホスト
VCF 管理アプライアンス
クラスタ 1 (最低 4 ホスト)
EVS 環境 2
ESXi ホスト 1
ESXi ホスト 2
ESXi ホスト 3
ESXi ホスト 4
ESXi ホスト 5-32
クラスタ (最低 3 ホスト)


## p.11

Amazon EVS 
ネットワークアーキテクチャ


## p.12

ネットワークビルディングブロック
管理 VM
ESXi ホスト
NSX Edge (T0)
論理ネットワークセグメント 1
Amazon EVS
EVS VLAN サブネット
アベイラビリティーゾーン A
EVS VLAN subnet
Customer VPC
EVS VLAN subnets
- ホスト管理
- vMotion
- vSAN 
など
-NSX アップリンク
AWS Cloud
ルートサーバー
エンドポイント
NAT 
ゲートウェイ
インターネット
ゲートウェイ
Application 
Load Balancer
Public subnets 
Private subnets 
•
お客様の VPC 内で実⾏
• Amazon EVS VLAN サブネット: 
EVS によって管理される
VLAN タグが付与された
サブネット
• ESXi ホスト管理、vCenter、
vMotion、vSAN など VCF
 インフラサービスに VPC 接続
を提供
• その他の AWS サービスは
引き続き標準の
VPC サブネットを使⽤


## p.13

Virtual Private Cloud (VPC)
Amazon EVS 
ホスト
vmnic0
vmnic1
タグなし
タグ付き
Amazon Elastic VMware Service
EVS VLAN サブネット
nsxUplink
70
edgeVTep
60
expansionVlan1
90
expansionVlan2
100
hcx
80
vmManagement
20
vTEP
50
vSAN
40
vMotion
30
vmkManagement
10
サービスアクセス
サブネット
EVS VLAN サブネット︓ホストネットワーク


## p.14

Virtual Private Cloud (VPC)
Amazon Elastic VMware Service
NSX Edge (T0)
Tier 1 Gateway
論理ネットワークセグメント 1
論理ネットワークセグメント 2
environment-cl01
nsxUplink
70
edgeVTep
60
expansionVlan1
90
expansionVlan2
100
hcx
80
vmManagement
20
vTEP
50
vSAN
40
vMotion
30
vmkManagement
10
サービスアクセス
サブネット
管理 VM & HCX
EVS VLAN サブネット︓オーバーレイネットワーク
EVS VLAN サブネット


## p.15

ルートサーバー:
BGP を使⽤してVPC のルートテーブルを動的に
設定する仕組み。 VPC 内の仮想アプライアンスから
ルートを受信し、ルートテーブルへ⾃動反映
ルートサーバーピア:
ルートサーバーエンドポイントと AWS 上のアプライ
アンス間で確⽴する BGP セッション設定
ルートサーバーエンドポイント:
ネットワークアプライアンスがルートサーバーと BGP 
セッションを確⽴するためのコンタクトポイント
リージョン
AWS Cloud
VPC サブネット
仮想プライベートクラウド (VPC)
ルートサーバー
ピア 
エンドポイント 
エンドポイント
NSX アップリンクサブネット 
 (10.10.11.0/24)
ルートサーバー
ピア 
NSX 
Edge
NSX
Edge
ルートテーブル-A
ルートテーブル-B
VPC ルートサーバー
VPC ルート
サーバー


## p.16

リージョン
AWS Cloud
VPC サブネット
仮想プライベートクラウド (VPC)
VPC ルート
サーバー
ルートサーバー
ピア 02
エンドポイント 01
エンドポイント 02
NSX アップリンクサブネット 
 (10.10.11.0/24)
ルートサーバー
ピア 01
NSX 
Edge
NSX
Edge
ルートテーブル
ルートテーブル
NSX Edge と VPC ルートサーバー
NSX と VPC ルートサーバー設定
構成要素
• ルートサーバーエンドポイント × 2、
エンドポイント毎にルートサーバーピア × 1 が必要
設定の取得元
• NSX 設定（エッジアップリンク IP、ASN 等）は 
ルートサーバーピアから取得
ピアの要件
• 各ピアは 同じ ASN（NSX Tier-0 BGP で使⽤）
• エッジアップリンク IP として使う ピア IP は
異なる値 にする
送信先
ターゲット
タイプ
10.10.0.0/16
local
Static
0.0.0.0/0
nat-123abcd
Static
オーバーレイ CIDRs
10.10.11.x
Propagated
オンプレミス CIDRs
tgw-123abcd
Static


## p.17

リージョン
AWS Cloud
パブリックサブネット
仮想プライベートクラウド (VPC)
VPC ルート
サーバー
NSX アップリンクサブネット 
 (10.10.11.0/24)
NSX 
edge
NSX 
edge
送信先
ターゲット
タイプ
10.10.0.0/16
ローカル
Static
0.0.0.0/0
nat-123abcd
Static
オーバーレイ CIDRs
10.10.11.x
Propagated
オンプレミス CIDRs
tgw-123abcd
Static
送信先
ターゲット
タイプ
10.10.0.0/16
ローカル
Static
0.0.0.0/0
igw-567efgh
Static
オーバーレイ CIDRs
10.10.11.x
Propagated
オンプレミス CIDRs
tgw-123abcd
Static
NAT
ゲートウェイ
インターネット接続
インターネット
ゲートウェイ
ルートテーブル
ルートテーブル


## p.18

リージョン
AWS Cloud
仮想プライベート
ゲートウェイ
トランジット
仮想インターフェース
Direct Connect 
ゲートウェイ
オンプレミス
データセンター
VMware Cloud Foundation 
(VCF)
SDDC 
Manager
vSphere
vSAN
NSX-T
Amazon VPC (EVS VPC)
プライベートサブネット
Amazon 
EC2
Amazon 
EC2
Amazon 
EC2
Amazon VPC
オンプレミス接続
Transit 
Gateway
Direct 
Connect
IPSec VPN


## p.19

検査後のルートテーブル
CIDR
アタッチメント
172.21.0.0/16
ワークロード VPC01
10.0.0.0/16
EVS VPC
192.168.0.0/12
EVS VPC（オーバーレイ）
10.0.0.0/8
DXGW
0.0.0.0/0
Egress VPC
172.24.0.0/16
Ingress VPC
プライベート
サブネット
プライベート
サブネット
パブリック
サブネット
TGW 
ENI
Ingress VPC 
(172.24.0.0/16)
インターネット
ゲートウェイ
TGW 
ENI
NAT 
ゲートウェイ 
EVS VPC (10.0.0.0/16)
プライベート
サブネット
パブリック
サブネット
Egress VPC 
(172.23.0.0/16)
インターネット
ゲートウェイ
TGW 
ENI
検査前ルートテーブル
CIDR
アタッチメント
0.0.0.0/0
AWS Network Firewall
AWS Transit Gateway
TGW association
TGW 
association
Application 
Load Balancer
ワークロード VPC 
(172.21.0.0/16)
Amazon EVS
EVS VLAN サブネット
ネイティブ
アタッチメント
AWS Network Firewall
プライベート
サブネット
TGW 
ENI
DXGW
Direct 
Connect
オンプレミス 
10.0.0.0/8 
TGW association
TGW 
association
TGW 
association
VPC アタッチメント
VPC アタッチメント
VPC 
アタッチメント 
VPC アタッチメント
AWS Network Firewall による Amazon EVS の保護
TGW association
DXGW アタッチメント
検査後のルートテーブル
CIDR
アタッチメント
172.21.0.0/16
ワークロード VPC01
10.0.0.0/16
EVS VPC
192.168.0.0/12
EVS VPC（オーバーレイ）


## p.20

Amazon EVS 
ストレージアーキテクチャ


## p.21

プライマリストレージ︓VMware vSAN
•
vSAN Express Storage Architecture (ESA)
•
Adaptive RAID-5 を含むすべての 
RAID 構成
•
⾼性能Nitro NVMeドライブを搭載
•
最⼤スループットと低レイテンシーを
必要とするワークロードに最適
vSAN データストア
vSphere
vSAN
Elastic VMware 
Service


## p.22

ポリシーの割り当て先:
• 多数の VM
• 単⼀仮想マシン
• 仮想マシンの個々の VMDK
• コンテナ永続ボリューム⽤ 
VMDK
vCenter での管理
シンプルでスケーラブル
ストレージポリシー定義
Failures to Tolerate
オブジェクトあたり
ディスクストライプ数
IOPS Limits
値
1 Failure — RAID-5 
(Erasure Coding)
None - 標準クラスタ
1000
ポリシールール
Site Disaster 
Tolerance
1
Kubernetes 
ストレージクラス 
EVS 環境
ストレージポリシー
ストレージポリシーベースの管理
アプリケーションのニーズに基づいた保護とパフォーマンスを実現
vmdk
vmdk
vmdk


## p.23

付属ストレージ
追加ストレージ
ローカルインスタンス
ストレージ 
powered by vSAN
Amazon FSx for NetApp 
ONTAP
サードパーティ
(Pure Cloud Block Store)
顧客適合性
HCI のシンプルさと
簡単な利⽤
ワークロード VM 向けの 
NetApp データサービスと
マルチプロトコルサポート
Pure Storage に精通し
オンプレミスで使⽤している
範囲
vSphere クラスタ
Amazon EVS 環境
Amazon EVS 環境
ストレージタイプ
NVMe/SSD
SSD アクティブストレージ + 
キャパシティプール 
(設定可能)
SSD アクティブストレージ + 
キャパシティプール 
(設定可能)
接続性
ローカル
NFS, iSCSI
NFS
価格
ノードあたりの価格
複数の項⽬に基づき価格設定
複数の項⽬に基づき価格設定
データストアのオプション


## p.24

追加ストレージ: Amazon FSx for NetApp ONTAP
AWS グローバルインフラストラクチャ
vSphere
vSAN
同期ミラー
追加データストア
NFS、iSCSI
vSAN データストア
FSx for NetApp ONTAP
お客様管理者
(AWS Cloud 管理者)
お客様管理者
(EVS VMware 管理者)


## p.25

Amazon EVS
管理 VM 
論理ネットワークセグメント
お客様の VPC
EVS ネットワーク
/ds-1
/ds-2
NFS データストア 1
NFS データストア 2
プライマリ
セカンダリ
アクティブ 
ENI
パッシブ ENI
NFS 
トラフィック
FSx for NetApp 
ONTAP
/ds-3
/ds-1
/ds-2
/ds-3
NFS データストア 3
NFS
NFS
アベイラビリティーゾーン
プライベート
サブネット
NSX Edge (T0)
NFS データストア接続
ESXi ホスト


## p.26

アベイラビリティーゾーン
管理 VM 
ESXi ホスト
NSX Edge (T0)
お客様の VPC
ds-1
ds-2
iSCSI データストア 1
iSCSI データストア 2
プライマリ
セカンダリ
アクティブ 
ENI
パッシブ ENI
iSCSI
トラフィック
ds-3
ds-1
ds-2
ds-3
iSCSI データストア 3
LUN
LUN
Amazon EVS
EVS ネットワーク
プライベート
サブネット
iSCSI データストア接続
論理ネットワークセグメント
FSx for NetApp 
ONTAP


## p.27

デモ


## p.31

お客様事例


## p.32

リサーチ
NYU グロスマン
医学部
NYU ランゴーン・ヘルス
“ NYU ランゴーン・ヘルスは、世界最⾼⽔準の患者ケアを提供し、
医学教育を推進し、研究におけるイノベーションを推し進める
ことを使命としています。その際、患者さまやご家族、社会の
ニーズを考慮しています。 “
患者ケア


## p.33

NYU ランゴーン・ヘルスのクラウド導⼊
ビジネス要件
• アプリケーションの
クラウドへの迅速な移⾏
• クラウドを事業継続に
活⽤
• ホスト型ソリューションの 
管理権限の維持
• 柔軟なライセンスモデル
• 多層セキュリティ
• スタッフの離職率の最⼩化
• 設備投資の削減
Amazon EVS を採⽤した理由
• ⾃社の VPC 内で稼働
• IaC（コード） によるプロビジョニング
• 既存 VCF ライセンスが持ち込み可能
• パイロットライトから
段階的なスケールが可能
• セキュリティプロビジョニングの⾃動化
• EVS ノードあたりの定額料⾦
ビジネスユースケース


## p.34

アエロメヒコは、1934 年に設⽴されたメキシコの
フラッグシップ航空会社で、メキシコシティに
本社を置いています。
メキシコ国内、南北アメリカ、ヨーロッパ、アジアの 
90 以上の⽬的地への運航を⾏っており、
スカイチーム アライアンスの創設メンバーです。
アエロメヒコ航空


## p.35

⽬標
•
4 年間で 346 のアプリのモダナイゼーション
•
3 つの主要なオンプレミスデータセンターを廃⽌
AWS 利⽤状況
•
68 の AWS サービスを積極的に活⽤
•
主要リージョン: us-east-1 (バージニア北部)、
us-west-2 (DR ⽤- オレゴン)
タイムライン
•
2021 年: AWS での最初のワークロード、データレイク 
- Redshift
•
2022 年: ランディングゾーン
•
2023 年: アプリの 14% をモダナイズ
•
2024 年: アプリの 44% をモダナイズ


## p.36

Amazon EVS を採⽤により
VMware ワークロードのクラウド移⾏を加速
アプリケーション
を
 で移⾏
数字で⾒る成果
Amazon EVS が⽬標達成に貢献
データセンターからの脱却
ハードウェアへの再投資を回避し、
スケーラビリティと俊敏性を獲得
迅速な移⾏
既存の VMware ツールとスキルを
維持しながら、ゼロダウンタイムかつ
数週間でクラウドに移⾏
という厳格な移⾏ウィンドウを
遵守し、業務への⽀障を回避
アプリケーションの再設計やチームの再トレーニングを⾏うことなく、
VMware ワークロードを AWS に移⾏する⼿段を必要とする、複数年に
わたるクラウド戦略を持っていました。
Amazon EVS の採⽤により、AWS 上で VMware 環境を実⾏するための道筋
を⼿に⼊れました。
利⽤サービス・プログラム
Amazon EVS
•
MAP Lite
•
Proof of Concept
より広範なモダナイゼーション:
•
AWS Lambda
•
Amazon RDS for SQL Server


## p.37

Fernando Rocha
Senior Vice President of IT and CIO, Aeromexico 
Amazon EVS を活⽤することで、
オンプレミスのインフラへの投資を
必要とせずにクラウドへ
アプリケーションを移⾏できます。
業務に必要な耐障害性とセキュリティ
を維持しながら、クラウド化への
取り組みを加速する上で⾮常に重要な
役割を果たしました。


## p.38

災害やセキュリティ対策を⾒据えて Amazon EVS を
実証したところ、新サービスにありがちな不安定さはなく、
本番利⽤できる品質、機能であることが確認できました。
Amazon EVS を当社の重要基盤の現実的な選択肢として
⼿応えを得ており、VMware ワークロードの選択肢が
広がる点も⾮常に⼼強いと感じています。
増⽥和樹様
CTO付IT基盤運⽤部上級ITアーキテクト
オリックス⽣命保険株式会社


## p.39

は VPC 内で VMware Cloud Foundation を直接実⾏し、
既存のスキル・ツールを活かしたまま AWS へ移⾏が可能
本格運⽤を⾒据えた
アーキテクチャ
オーバーレイネットワークを 
VPC ルートサーバーで
vSAN + FSx for ONTAP でストレージの
・
を実現
お客様が実証する
移⾏の成果
グローバル・国内の
エンタープライズ企業が 
Amazon EVS で
AWS で選べる移⾏パス
まとめ
リホスト、リプラットフォーム、
リファクタなど多様な移⾏パス
の中から、リロケートとして
VMware 環境を


## p.40

Exhibition Booth Information
展⽰ブースのご案内
A129
AWS for VMware
AWS Village①


## p.41

Ask the Speaker
こちらの Room 後⽅の外側にございます、
「Ask the Speaker」カウンターまでお越しください
豊⽥ 真⾏
アマゾン ウェブサービス ジャパン合同会社
Room


## p.42

本セッションのアンケートへ
ご協⼒をお願いします
Please give us your feedback
Thank you!
MAM332
