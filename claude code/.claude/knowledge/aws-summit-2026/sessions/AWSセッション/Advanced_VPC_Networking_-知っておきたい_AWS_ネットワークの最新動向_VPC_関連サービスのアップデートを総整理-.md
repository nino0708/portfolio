---
title: "Advanced VPC Networking －知っておきたい AWS ネットワークの最新動向 ： VPC 関連サービスのアップデートを総整理－"
category: "AWSセッション"
level: "L300"
session_id: "CDN320"
pages: 105
topics: ["その他"]
services: ["AWS Direct Connect", "AWS IAM", "AWS Lambda", "AWS Transit Gateway", "Amazon CloudFront", "Amazon DynamoDB", "Amazon Route 53", "Amazon S3", "Amazon VPC"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/AWSセッション/Advanced VPC Networking －知っておきたい AWS ネットワークの最新動向 ： VPC 関連サービスのアップデートを総整理－.pdf"
---
# Advanced VPC Networking －知っておきたい AWS ネットワークの最新動向 ： VPC 関連サービスのアップデートを総整理－


## p.1

CDN320
Advanced VPC Networking
－知っておきたいAWS ネットワークの最新動向：
VPC 関連サービスのアップデートを総整理－
長谷川工祐
アマゾンウェブサービスジャパン合同会社


## p.2

• 対象者：
• Amazon VPC やAWS Network Firewall 等のネットワークサービスの基
礎的な内容について理解している
• 2025年に発表されたAWSのネットワークサービスのアップデートをま
とめてキャッチアップしたい
• ゴール：
• 自分の環境に効くアップデートを一つでも持ち帰っていただく
本セッションの対象者とゴール
L300 / 40 分/ 質疑は会場外Ask the Speaker にて


## p.3

経歴：
2020年にAWSに入社。
前職はSIerにて、複数の中央省庁案件におけるネットワーク
技術支援を10年担当していました。
複数の省庁のネットワーク更改案件や、大規模クラウドリフ
ト案件なども経験しました。
好きなAWSサービス：
Amazon VPC、AWS Transit Gateway、AWS Direct Connect
長谷川工祐／Kosuke Hasegawa
パブリックセクター技術本部シニアソリューションアーキテクト
3
3 / 104


## p.4

•
01. Amazon VPC
•
02. アプリケーションネットワーキング
•
03. グローバル＆ハイブリッド接続
•
04. DNS / IPアドレス管理/ IPv6対応
•
05. エピローグ
アジェンダ
4 / 104


## p.5

01.
Amazon VPC
5 / 104


## p.6

Amazon
VPC
インターネット接続
VPC 接続
VPC セキュリティ
NAT Gatewayの
最新アップデート
6 / 104


## p.7

IPv4 インターネット
接続
サブネット 1
10.0.1.0/24
プライベート
10.0.3.0/24
NAT GW AZ1
サブネット 3
パブリック
インターネットゲートウェイ (IGW)
Amazon VPC
EC2
アベイラビリティーゾーン 1
アベイラビリティーゾーン 2
サブネット 2
10.0.2.0/24
プライベート
10.0.4.0/24
サブネット 4
パブリック
EC2
NAT GW AZ2
ルートテーブル
VPC CIDR
Local
0.0.0.0/0
NATGW-
AZ1
ルートテーブル
VPC CIDR
Local
0.0.0.0/0
NATGW-AZ2
ルートテーブル
VPC CIDR
Local
0.0.0.0/0
IGW
ルートテーブル
VPC CIDR
Local
0.0.0.0/0
IGW
AWS NAT Gateway
7 / 104


## p.8

Amazon VPC
リージョンNAT ゲートウェイ
インターネットゲートウェイ (IGW)
リージョン NAT 
ゲートウェイ
アベイラビリティーゾーン
アベイラビリティーゾーン
サブネット
サブネット
8 / 104


## p.9

リージョン NAT 
ゲートウェイ
インターネットゲートウェイ (IGW)
アベイラビリティーゾーン
アベイラビリティーゾーン
サブネット
サブネット
Amazon VPC 
リージョン NAT ゲートウェイ
AZ2 のルートテーブル
VPC CIDR
local
0.0.0.0/0
リージョン NAT ゲート
ウェイ ID
AZ1 のルートテーブル
VPC CIDR
local
0.0.0.0/0
リージョン NAT ゲート
ウェイ ID
リージョン NAT ルートテーブル
VPC CIDR
local
0.0.0.0/0
インターネットゲ
ートウェイ
リージョン NAT ゲートウェイは アベイラビリティーゾーンを自
動更新し、ワークロードが存在する場所に追随します。
リージョン NAT ゲートウェイは VPC 内のサブネット
を必要としないため、VPC 管理を簡素化できます
また、ポート枯渇に対する自動保護を備え、AZ ごとに
最大 32 個の Elastic IP を自動的に割り当てます。
9 / 104


## p.10

Amazon
VPC
インターネット接続
VPC 接続
VPC セキュリティ
AWS Network Firewallの
最新アップデート
10 / 104


## p.11

サブネット 1
プライベート
インターネットゲートウェイ (IGW)
Amazon VPC
アベイラビリティーゾーン 1
アベイラビリティーゾーン 2
サブネット 2
プライベート
AWS Network Firewall の
最新アップデート
インターネット
接続
NFW サブネット AZ1
NFW サブネット AZ2
NFW エンドポイント
NFW エンドポイント
AWS Network 
Firewall
リージョン NAT 
ゲートウェイ
ルートテーブル
0.0.0.0/0
NFWE-AZ2
VPC 
CIDR
local
ルートテーブル
0.0.0.0/0
NFWE-AZ1
VPC 
CIDR
local
ルートテーブル
0.0.0.0/0
R-NAT-ID
VPC 
CIDR
local
ルートテーブル
0.0.0.0/0
R-NAT-ID
VPC 
CIDR
local
AWS Network Firewall
RNAT ルートテーブル
0.0.0.0/0
IGW
サブネッ
ト 1
NFWE-AZ1
サブネッ
ト 2
NFWE-AZ2
11 / 104


## p.12

AWS Network Firewall
複数 VPC エンドポイント
NFW エンドポイント
NFW エンドポイント
NFW エンドポイント
12 / 104


## p.13

サブネット 
プライベート
インターネットゲートウェイ (IGW)
Amazon VPC
アベイラビリティーゾーン1
NFW サブネット AZ1
NFW エンドポイント
サブネット 
プライベート
アベイラビリティーゾーン 
NFW サブネット AZ2
NFW エンドポイント
リージョン NAT 
ゲートウェイ
Amazon VPC
Amazon VPC
Amazon VPC
NFW エンドポイント
AWS Network 
Firewall
AWS Network Firewall 
複数エンドポイント
複数エンドポイントを使うことで、複
数 VPC にまたがるファイアウォール
展開のスケーリングを簡素化しつつ、
集中ポリシーでコスト最適化も実現で
きます
ドメイン (本番・開発など) やコンプ
ライアンス要件ごとにファイアウォ
ールを分けることが推奨されます。
また、ポリシー内で エンドポイント 
ID を使うことで、特定の VPC にのみ
適用されるルールを作成できます。
13 / 104


## p.14

AWS Network Firewall
アクティブ脅威防御: AWS インフラで観測される動的
かつ進行中の脅威活動に対する、インテリジェンス駆
動型の自動保護機能。新規ファイアウォールポリシー
作成時にアラートモードを指定すると有効化される。
パートナーマネージドルール: AWS パートナーが専
門的にキュレーションし自動更新するセキュリティ
ルールを、ネットワークファイアウォールポリシー
に直接展開できる機能。
コンソールとモニタリングの強化: 拡張されたモニタ
リングインサイトや高度な TLS 検査機能を含み、フ
ァイアウォール性能の可視性向上と送信接続に対す
るセキュリティ強化を実現。
14 / 104


## p.15

AWS Network Firewall
Proxy
パブリックプレビュー
インターネットゲートウェイ (IGW)
AWS NAT Gateway + 
Network Firewall プロキシ
Amazon VPC
AWS Network Firewall 
プロキシエンドポイント
15 / 104


## p.16

AWS Network Firewall 
Proxy
新機能: AWS Network Firewall を AWS NAT ゲート
ウェイ と統合し、明示的プロキシインフラの管理
を AWS にオフロード可能。
インターネットゲートウェイ (IGW)
プライベートサブネット
パブリックサブネット
AWS PrivateLink を活用したエンドポイントにより、フルマネージドな NFW Proxy 
と NAT ゲートウェイのイーグレスにアクセス
NFW Proxy エンドポイントの DNS 名を使
用した明示的プロキシ設定
クライアント
NWF Proxyエンドポイント
NAT ゲートウェイ + 
NFW Proxy
AWS Network Firewall Proxy
16 / 104


## p.17

AWS Network Firewall 
Proxy
新機能: AWS Network Firewall を AWS NAT ゲート
ウェイ と統合し、明示的プロキシインフラの管理
を AWS にオフロード可能。
インターネットゲートウェイ (IGW)
プライベートサブネット
パブリックサブネット
クライアント
NWF Proxyエンドポイント
NAT ゲートウェイ + 
NFW Proxy
ルートテーブル
VPC CIDR
Local
ルートテーブル
VPC CIDR
Local
0.0.0.0/0
IGW
既存の VPC 設計へシームレスに統合 ― サブネット
追加やルートテーブルの変更は不要。
17 / 104


## p.18

AWS Network Firewall 
Proxy
クライアント
NAT ゲートウェイ + NWF Proxy
パケットフロー
宛先: 
test.example.com
DNS 解決前ポリシー
プロキシ接続のセットアップ
1
2
HTTP CONNECT 
test.example.com:443
3
TCP 接続のセットアップ
4
5
HTTP RESPONSE 200 
接続確立
6
HTTP リクエスト 
(例: GET /test.html)
プリリクエストポリシー
7
8
HTTP リクエスト 
(例: GET /test.html)
9
HTTP RESPONSE
 200 OK
ポストリクエストポリシー
10
HTTP RESPONSE
 200 OK
11
このフローは NWF Proxyが TLS インターセプト用に構成
されていることを前提としています。そうでない場合、
トラフィックはクライアントと宛先の間で暗号化された
ままです。
18 / 104


## p.19

AWS Network Firewall 
Proxy アーキテクチャ
インターネットゲートウェイ (IGW)
プライベートサブネット
パブリックサブネット
クライアント
NWF Proxyエンドポイント
NAT ゲートウェイ + 
NFW Proxy
ルートテーブル
VPC CIDR
Local
ルートテーブル
VPC CIDR
Local
0.0.0.0/0
IGW
分散型 IPv4 egress
各 VPC が独自の NWF Proxy構成とエンドポイント
を分散型デザインで持つことができ、既存デプロ
イメントとシームレスに統合されます
19 / 104


## p.20

AWS Network Firewall 
Proxy アーキテクチャ
プロキシのデプロイを集約し、VPC のルーティング変更
なしに、クライアント VPC から Network Firewall プロ
キシエンドポイント経由でアクセスさせることができま
す。
インターネットゲートウェイ (IGW)
NAT ゲートウェイ + 
NFW Proxy
クライアント
NWF Proxyエンドポイント
クライアント
NWF Proxyエンドポイント
クライアント
NWF Proxyエンドポイント
ルートテーブル
VPC CIDR
Local
ルートテーブル
VPC CIDR
Local
0.0.0.0/0
IGW
IPv4 アウトバウンド通信の集約
20 / 104


## p.21

AWS Network Firewall 
Proxy アーキテクチャ
AWS Transit Gateway や AWS Cloud WAN を使用して
プロキシのデプロイを集約することもでき、既存のイ
ンフラストラクチャへの統合が容易になります。
インターネットゲートウェイ (IGW)
NAT ゲートウェイ + 
NFW Proxy
クライアント
クライアント
クライアント
IPv4 アウトバウンド通信の集約
ルートテーブル
VPC CIDR
Local
集約型 Egress VPC CIDR
TGW / Cloud WAN
ルートテーブル
VPC CIDR
Local
0.0.0.0/0
IGW
Transit Gateway
Cloud WAN
NFW Proxy 
エンドポイント
21 / 104


## p.22

Amazon
VPC
インターネット接続
VPC 接続
VPC セキュリティ
BGPでVPCルートテーブルを更新可能に
22 / 104


## p.23

Amazon VPC
ルートサーバー
アベイラビリティーゾーン
サブネット
サブネット
EC2
EC2
Route Server エンドポイント
BGP
BGP
ルートテー
ブル更新
ルートテー
ブル更新
インターネットゲートウェイ (IGW)
アベイラビリティーゾーン
アベイラビリティーゾーン
23 / 104


## p.24

Amazon VPC 
ルートサーバー
ルートサーバーは次の ルートテーブル種別に対応: サ
ブネット未関連付けのルートテーブル、サブネットの
ルートテーブル、インターネットゲートウェイのルー
トテーブル。
ルートサーバーは Virtual Private Gateway に関連付け
られたルートテーブルには対応していません。AWS 
Transit Gateway のルートテーブルへ経路を伝播するに
は TGW Connect を利用してください。
アプリケーションが Gateway Load Balancer (GWLB) に
統合されている場合は、フェイルオーバーの第一選択肢
として GWLB を検討してください。収束時間の短縮には 
BFD を使えます。
アベイラビリティーゾーン
アベイラビリティーゾーン
サブネット
サブネット
EC2
EC2
Route Server エンドポイント
BGP
BGP
インターネットゲートウェイ 
(IGW)
ルートテー
ブル更新
ルートテー
ブル更新
24 / 104


## p.25

Amazon VPC 
ルートサーバー
アベイラビリティーゾーン
アベイラビリティーゾーン
サブネット
サブネット
EC2-A
EC2-B
Route Server エンドポイント
インターネットゲートウェイ (IGW)
VPC 
10.1.0.0/16
Route Server ピア
アクティブ
スタンバイ
サブネット
サブネット
ルートテーブル
VPC CIDR
Local
172.16.1.1/32
EC2-A
ルートテーブル
VPC CIDR
Local
172.16.1.1/32
EC2-A
ルートテーブル
VPC CIDR
Local
ルートテーブル
VPC CIDR
Local
ユースケース:アプリケーシ
ョンのフローティング IP
25 / 104


## p.26

Amazon VPC 
ルートサーバー
アベイラビリティーゾーン
アベイラビリティーゾーン
サブネット
サブネット
Route Server エンドポイント
インターネットゲートウェイ (IGW)
VPC 
10.1.0.0/16
アクティブ
サブネット
サブネット
ルートテーブル
VPC CIDR
Local
172.16.1.1/32
EC2-B
ルートテーブル
VPC CIDR
Local
172.16.1.1/32
EC2-B
ルートテーブル
VPC CIDR
Local
ルートテーブル
VPC CIDR
Local
Route Server ピア
EC2-A
EC2-B
ユースケース:アプリケーシ
ョンのフローティング IP
26 / 104


## p.27

Amazon
VPC
インターネット接続
VPC 接続
VPC セキュリティ
VPC間トラフィック検査で
専用VPCが不要に
27 / 104


## p.28

VPC 接続
AWS Transit Gateway
Amazon VPC
IPv4 CIDR
IPv6 CIDR
Amazon VPC
10.1.0.0/16
2001:db8:1234:1a00::/56
Amazon VPC
10.2.0.0/16
2001:db8:1234:1b00::/56
Amazon VPC
IPv4 CIDR
IPv6 CIDR
Transit Gateway ルートテーブル
10.1.0.0/16
VPC-attachment-1
10.2.0.0/16
VPC-attachment-2
2001:db8:1234:1a00::/56
VPC-attachment-1
2001:db8:1234:1b00::/56
VPC-attachment-2
…
…
シングルリージョンデプロイ
28 / 104


## p.29

VPC
IPv4 CIDR
IPv6 CIDR
VPC
IPv4 CIDR
IPv6 CIDR
AWS Network Firewall
VPC間のインスペクション
ルートテーブル
その他の VPC 
CIDR
Transit Gateway
ルートテーブル
その他の VPC 
CIDR
Transit Gateway
TGW サブネット
TGW サブネット
アベイラビリティーゾーン
アベイラビリティーゾーン
NFW サブネット
NFW サブネット
TGW ENI
TGW ENI
NFW エンドポイント
NFW エンドポイント
VPC
各サブネットのルーティング構成を
正しく管理する必要があります。
AWS Network 
Firewall
VPC 接続
29 / 104


## p.30

AWS Transit Gateway
Network Firewall アタッチメント
30 / 104


## p.31

AWS Transit Gateway
Network Firewall アタッチメント
Transit Gateway ルートテーブル 
INSPECTION
VPC の IPv4 プレ
フィックス
VPC アタッチメン
ト
VPC の IPv6 プレ
フィックス
VPC アタッチメン
ト
Transit Gateway ルートテーブル 
SPOKE
すべての IPv4 プ
レフィックス
NFW-attachment
すべての IPv6 プ
レフィックス
NFW-attachment
AWS Network Firewall を AWS Transit Gateway にネイティブにアタッチし、
VPC 間トラフィックを検査できるようになりました
ルートテーブル
その他の VPC 
CIDR
Transit Gateway
ネイティブな AWS Network Firewall アタッチメントにより、
VPC 間トラフィックのフィルタリングを行うユースケースで 
AWS Transit Gateway 上の Network Firewall 管理が簡素化され
ます
31 / 104


## p.32

Amazon
VPC
インターネット接続
VPC 接続
VPC セキュリティ
AWS Transit Gateway
コストの負担先が選べるように
32 / 104


## p.33

AWS Transit Gateway
柔軟なコスト配分
33 / 104


## p.34

AWS Transit Gateway
柔軟なコスト配分
Shared Services 
アプリ VPC
AWS Direct Connect 
Gateway
AWS Network Firewall
以下のようなカスタム計測ポリシーを作成でき、トラ
フィックフローの属性に基づいてどのアカウントに課
金するかを定義できます（例: アタッチメント種別、
アタッチメント ID、ネットワークアドレス）。
①送信元アタッチメントの所有者
②宛先アタッチメントの所有者
③Transit Gateway の所有者
34 / 104


## p.35

Amazon
VPC
インターネット接続
VPC 接続
VPC セキュリティ
VPC 内通信の暗号化を可視化・制御
35 / 104


## p.36

Amazon VPC セキ
ュリティ
Amazon VPC
通信の暗号化
サブネット
Web アプリ
Nitro レベルの暗号化
サブネット
バックエンドアプリ
Nitro インスタンス
Nitro インスタンス
AWS Nitro ベースのインスタンスは、パフォー
マンスに影響を与えずにハードウェアレイヤー
で自動的にトラフィックを暗号化します。
この暗号化では、256 ビット暗号化による 
Authenticated Encryption with Associated 
Data (AEAD) アルゴリズムを使用します。
36 / 104


## p.37

Amazon VPC セキ
ュリティ
Amazon VPC
通信の暗号化
サブネット
Web アプリ
Nitro インスタンス
Amazon VPC
サブネット
バックエンドアプリ
Nitro インスタンス
Nitro レベルの暗号化
VPC ピアリ
ング
この暗号化は、同じ VPC 内、または同じリージ
ョン内のピアリング接続された VPC 内の Nitro 
ベースのインスタンス間で機能します
37 / 104


## p.38

Amazon VPC セキ
ュリティ
Amazon VPC
通信の暗号化
サブネット
Web アプリ
サブネット
バックエンドアプリ
Nitro インスタンス
非 Nitro インスタンス
サブネット
WEB APP
Application Load 
Balancer
AWS Transit 
Gateway
クライアントアプリ
トラフィックが VPC 内の
サービスやネットワーク機器を経由
する場合はどうでしょうか？ 
?
?
?
Nitro ベースでないインスタンスを使用
している場合はどうなるか?
38 / 104


## p.39

Amazon VPC
暗号化コントロール
AWS Transit 
Gateway
VPC ピアリ
ング
39 / 104


## p.40

Amazon VPC
サブネット
Web アプリ
サブネット
バックエンドアプリ
Nitro インスタンス
非 Nitro インスタンス
サブネット
WEB APP
Application Load Balancer
AWS Transit 
Gateway
クライアントアプリ
VPC 暗号化コントロール
?
?
Amazon VPC 
暗号化コントロール
VPC 暗号化コントロール
Amazon VPC の新機能で、伝送中の暗号化を監
査・強制し、リージョン内 VPC 内および VPC 
間の全トラフィックに対して適用できます。
?
40 / 104


## p.41

Amazon VPC
サブネット
Web アプリ
サブネット
バックエンドアプリ
サブネット
WEB APP
Application Load Balancer
AWS Transit 
Gateway
クライアントアプリ
Amazon VPC 
暗号化コントロール
VPC 暗号化コントロール 
モニターモード
暗号化コントロールはモニターモードで構成できます。
これにより、強制モードを有効化した場合に許可されな
いフローやインスタンスを事前に監査できます。
暗号化コントロールはVPC フローログに新しいフィール
ドを追加し、トラフィックがハードウェア暗号化か、ア
プリケーション暗号化か、あるいはその両方かを示しま
す。
VPC 暗号化コントロール 
モニターモード
仕組み
Nitro インスタンス
非 Nitro インスタンス
41 / 104


## p.42

Amazon VPC
サブネット
Web アプリ
サブネット
バックエンドアプリ
Nitro インスタンス
Nitro インスタンス
サブネット
WEB APP
Application Load Balancer
AWS Transit 
Gateway
クライアントアプリ
Amazon VPC 
暗号化コントロール
VPC 暗号化コントロール 
強制モード
すべてのリソースを暗号化準拠インフラに
移行後、強制モードを有効化できます。
VPC 暗号化コントロール
 強制モード
仕組み
42 / 104


## p.43

02.
アプリケーション
ネットワーキング
43 / 104


## p.44

AWS PrivateLink
Amazon VPC Lattice
AWSサービスへの
アプリケーション接続
アプリケーション
ネットワーキング
44 / 104


## p.45

AWS サービスへのアプ
リケーション接続
Amazon VPC
EC2
AWS サービスのパブリックエンドポイント
インターフェイス 
エンドポイント
Route 53
Resolver
ゲートウェイ 
エンドポイント
Amazon S3
Amazon DynamoDB
ルートテーブル
S3
S3 ゲートウェイエンドポイン
ト
DynamoDB
DynamoDB ゲートウェイエン
ドポイント
ゲートウェイエンドポイントおよびインターフェイスエンドポ
イントはいずれも、リージョン内からのAWS サービスパブリッ
クエンドポイントへのアクセスを提供します
45 / 104


## p.46

AWS PrivateLink
AWS サービス向けクロスリージョン対応
Amazon Simple Storage Service 
(Amazon S3)
46 / 104


## p.47

AWS サービスへの
アプリケーション接続
Amazon VPC
EC2
AWS サービスのパブリックエンドポイント
Route 53
Resolver
インターフェイス 
エンドポイント
Amazon S3
AWS サービスのパブリックエンドポイント
クロスリージョン
インターフェイスエンドポイント
Amazon ECR
AWS IAM
AWS KMS
Amazon Data 
Firehose
Amazon S3、ECR、IAM、KMS、Data 
Firehose、ECS、Route 53、AWS Lambda
、Kinesis Analytics、Kinesis Analytics FIPS 
でサポートされています
インターフェイス 
エンドポイント
47 / 104


## p.48

AWS PrivateLink
Amazon VPC Lattice
内部のアプリケーション
間接続 
アプリケーション
ネットワーキング
48 / 104


## p.49

アプリケーション
間接続
基礎
EC2 Auto Scaling
create-slides
コンピューティング
アプリ名
49 / 104


## p.50

アプリケーション
間接続
基礎
EC2 Auto Scaling
create-slides
existing-features-database
new-features-update
Web アプリ、TCP アプリ、
データストアが混在
AWS Lambda
generate-sections
50 / 104


## p.51

Amazon VPC
Amazon VPC
Amazon VPC
アプリケーション
間接続
AWS Lambda
new-features-update
VPC は AWS におけるネット
ワークレベルの境界です
EC2 Auto Scaling
create-slides
基礎
existing-features-database
generate-sections
51 / 104


## p.52

generate-sections
Amazon VPC
Amazon VPC
Amazon VPC
Amazon VPC Lattice
EC2 Auto Scaling
AWS Lambda
create-slides
new-features-update
VPC Lattice 
サービス
VPC Lattice サービス
VPC Lattice 
サービス
サービスは名前、自動生成された一意の 
FQDN、リスナー、ターゲットグループ、ルー
ティング、および (オプションの) 認証ポリシ
ーを持ちます
existing-features-database
52 / 104


## p.53

Amazon VPC
Amazon VPC
Amazon VPC
EC2 Auto Scaling
create-slides
new-features-update
VPC Lattice 
リソース
VPC Lattice リソース
VPC Lattice 
リソース
Amazon VPC Lattice
リソースは名前、自動生成された一意の 
FQDN、ARN / DNS / IP で識別されるター
ゲット、および TCP ポートを持ちます。
generate-sections
AWS Lambda
existing-features-database
53 / 104


## p.54

generate-sections
Amazon VPC
Amazon VPC
Amazon VPC
EC2 Auto Scaling
AWS Lambda
create-slides
new-features-update
VPC Lattice 
サービスネット
ワーク
CDN320-apps
論理的なグルーピングの
仕組み
VPC Lattice 
サービスネットワーク
Amazon VPC Lattice
サービスネットワークは、相互に通信する必
要があるアプリケーションとリソースのため
の論理的なグルーピングの仕組みです。
existing-features-database
54 / 104


## p.55

generate-sections
Amazon VPC
Amazon VPC
Amazon VPC
EC2 Auto Scaling
AWS Lambda
create-slides
new-features-update
VPC Lattice 
サービスネットワーク
CDN320-apps
サービスネットワーク 
VPC 関連付け
サービス関連付け
リソース関連付け
関連付け
サービス
ネットワーク
エンドポイント
サービスネットワークエ
ンドポイント関連付け
Amazon VPC Lattice
existing-features-database
55 / 104


## p.56

generate-sections
Amazon VPC
Amazon VPC
Amazon VPC
EC2 Auto Scaling
AWS Lambda
create-slides
new-features-update
認証ポリシー
サービス
ネットワーク
エンドポイント
Amazon VPC Lattice
VPC Lattice 認証ポリシーを使用する際、
アプリケーションがトラフィックを 
SIGv4 で署名する必要はありません。
existing-features-database
VPC Lattice 
サービスネットワーク
CDN320-apps
56 / 104


## p.57

generate-sections
Amazon VPC
AWS Lambda
create-slides
existing-features-database
DNS
Route 53
Resolver
Q:
generate-sections.reinvent2025.com
(A & AAAA) は？
回答: VPC Lattice IP
Amazon VPC Lattice
VPC Lattice 
サービスネットワーク
CDN320-apps
57 / 104


## p.58

Amazon VPC Lattice
リソース向けカスタム DNS
Amazon VPC
リソース構成
existing-features-database.reinvent2025.com
カスタム DNS
カスタム DNS
58 / 104


## p.59

Amazon VPC
create-slides
VPC Lattice 
サービスネットワーク
CDN320-apps
リソース向けカスタム DNS
カスタム DNS: 
new-features-update.reinvent2025.com
new-features-update
Amazon VPC Lattice
リソース設定には、検証済みおよび未検証
のドメイン名を指定できます。
59 / 104


## p.60

AWS PrivateLink
Amazon VPC Lattice
高度なアーキテクチャ
アプリケーション
ネットワーキング
60 / 104


## p.61

アプリケーション間接
続
高度なアーキテクチャ
AWS 上のアプリケーションに対し、
オンプレミスアプリへの接続性を提供する
VPC
VPC Lattice 
サービスネットワーク
CDN320-apps
VPC
VPC
中継用VPC から 
オンプレミスへ
リソース
ゲートウェ
イ
データ
センター
previous-years-slides
all-time-features
リソース構成
リソース構成
AWS からアクセスする必要があるオンプレミスのアプリ
ケーションは、それぞれリソース設定として表現されます 
新しいカスタムDNS機能を使うことで、
プライベートホストゾーンの管理を不要にできます
ターゲットIPまたはパブリックに
名前解決可能なDNS名
Transit 
Gateway
Cloud 
WAN
Direct
Connect
61 / 104


## p.62

アプリケーション間接
続
高度なアーキテクチャ
オンプレミスのアプリに、
AWS上のアプリへの接続性を提供する
VPC Lattice 
サービスネットワーク
CDN320-apps-for-
on-prem
オンプレミスからの
中継用VPC
Transit 
Gateway
Cloud 
WAN
Direct
Connect
データ
センター
legacy-slide-builder アプリケ
ーション
generate-sections
AWS Lambda
new-features-update
リソース構成
サービスネットワークエンドポイント
オンプレミスにルーティング
された IP アドレス
サービスネットワーク内の
各サービス・リソースのFQDN
DNS設定
new-features-update.reinvent2025.com 
Alias/CNAME vpce-id-snra-id… 
（対象リソースのSNE FQDN）
62 / 104


## p.63

03.
グローバル＆ハイブリッド
接続
63 / 104


## p.64

グローバル & 
ハイブリッド
接続
AWS Cloud WAN
ハイブリッド接続
64 / 104


## p.65

基礎
AWS Cloud WAN
コアネットワーク
ネットワーク接続コンポーネントの
論理的なコンテナ
AWS Cloud WAN
65 / 104


## p.66

基礎
AWS Cloud WAN
コアネットワーク
コアネットワークエッジ
コアネットワークエッジ
コアネットワークエッジ
リージョン
リージョン
リージョン
AWS 上のアタッチメントのためのリ
ージョナルルーティングハブ
AWS Cloud WAN
66 / 104


## p.67

基礎
AWS Cloud WAN
コアネットワーク
リージョン
リージョン
リージョン
セグメント A
セグメント B
ネットワークセグメント C
Cloud WAN セグメントにより、グローバルなネ
ットワークセグメンテーションを実装できます
AWS Cloud WAN
67 / 104


## p.68

AWS Cloud WAN
アタッチメント
リージョン
AWS Cloud WAN
セグメント A
セグメント B
Amazon VPC
VPC アタッチメント
Cloud WAN への VPC レベルルーティ
ングは、ルートテーブル内のルートで
制御します
68 / 104


## p.69

基礎
リージョン
リージョン
リージョン
AWS Cloud WAN
セグメント A
セグメント B
VPC
VPC
VPC
VPC
VPC
VPC
グローバルにセグメント化
された動的ルーティング
AWS Cloud WAN
69 / 104


## p.70

アタッチメント
リージョン
AWS Cloud WAN
セグメント A
セグメント B
Amazon VPC
エンドツーエンドの BGP 動的ルーティング
を活用した、SD-WAN アプライアンスと 
Cloud WAN の最適化された統合。
Cloud WAN ENI
アタッチメントサ
ブネット – AZ1
Cloud WAN ENI
アタッチメントサ
ブネット – AZ2
アプライアンス
アプライアンス
トンネルレスConnect
アタッチメント
AWS Cloud WAN
70 / 104


## p.71

アタッチメント
TGW 環境をグローバルネットワークに簡単
に接続でき、Cloud WAN への移行を容易に
します
リージョン
AWS Cloud WAN
Transit Gateway
ルートテーブル A
ルートテーブル B
Core 
Network 
Edge
セグメント A
セグメント B
Transit Gateway 
ルートテーブルアタッチメント
AWS Cloud WAN
71 / 104


## p.72

アタッチメント
Cloud WANグローバルネットワークとオン
プレミスネットワーク間の、BGPによるエン
ドツーエンドの動的ルーティング
リージョン
リージョン
リージョン
AWS Cloud WAN
Core Network 
Edge
Core Network 
Edge
Core Network 
Edge
セグメント A
セグメント B
Direct Connect Gateway 
アタッチメント
Direct Connect 
Gateway
AWS Cloud WAN
72 / 104


## p.73

AWS Cloud WAN
セキュリティグループ参照
SG-A
SG-B
SG-C
AWS Cloud WAN
セグメント A
セグメント B
73 / 104


## p.74

リージョン
AWS Cloud WAN
セグメント A
セグメント B
VPC
VPC
SG-A
SG-B
インバウンドルール:
SG-A, ポート 3389 を許可
AWS Cloud WAN
セキュリティグループ参照
ユースケース：マイクロ
セグメンテーション
74 / 104


## p.75

AWS Cloud WAN
高度なルーティング制御
75 / 104


## p.76

AWS Cloud WAN
高度なルーティング制御
リージョン
リージョン
リージョン
AWS Cloud WAN
セグメント A
セグメント B
VPC
VPC
VPC
VPC
VPC
VPC
ユースケース：
ルートフィルタリングと制御
Direct Connect Gateway 
A
Direct Connect Gateway 
B
VPN
VPC
SDWAN
TGW
共有
AWS Site-to-Site 
VPN
76 / 104


## p.77

AWS Cloud WAN
高度なルーティング制御
リージョン
リージョン
リージョン
AWS Cloud WAN
セグメント A
セグメント B
VPC
VPC
VPC
VPC
VPC
VPC
VPN
AWS Site-to-Site 
VPN
VPC
SDWAN
TGW
共有
Cloud WAN のルート管理を細かく調整する
ために、ルートのフィルタリング、集約、
パス操作を設定できます
Direct Connect Gateway 
A
Direct Connect Gateway 
B
77 / 104


## p.78

リージョン
リージョン
リージョン
AWS Cloud WAN
セグメント A
セグメント B
VPC
VPC
VPC
VPC
VPC
VPC
Direct Connect Gateway 
A
Direct Connect Gateway 
B
VPN
AWS Site-to-Site 
VPN
VPC
SDWAN
TGW
共有
AWS Cloud WAN
高度なルーティング制御
仕組み
アクション
78 / 104


## p.79

リージョン
リージョン
リージョン
AWS Cloud WAN
セグメント A
セグメント B
VPC
VPC
VPC
VPC
VPC
VPC
Direct Connect Gateway 
A
Direct Connect Gateway 
B
VPN
AWS Site-to-Site 
VPN
VPC
SDWAN
TGW
共有
AWS Cloud WAN
高度なルーティング制御
仕組み
条件
79 / 104


## p.80

リージョン
リージョン
リージョン
AWS Cloud WAN
セグメント A
セグメント B
VPC
VPC
VPC
VPC
VPC
VPC
Direct Connect Gateway 
A
Direct Connect Gateway 
B
VPN
AWS Site-to-Site 
VPN
VPC
SDWAN
TGW
共有
AWS Cloud WAN
高度なルーティング制御
仕組み
"routing-policies": [
    {
      "routing-policy-name": "TestRoutingPolicy",
      "routing-policy-description": "Policy to...",
      "routing-policy-direction": "inbound",
      "routing-policy-number": 100,
      "routing-policy-rules": [
        {
          "rule-number": 50,
          "rule-definition": {
            "match-conditions": [
              {
                "type": "prefix-equals",
                "value": "99.99.99.0/24"
              }
            ],
            "condition-logic": "or",
            "action": {
              "type": "drop"
            }
          }
        }
      ]
JSON 形式
80 / 104


## p.81

リージョン
リージョン
リージョン
AWS Cloud WAN
セグメント A
セグメント B
VPC
VPC
VPC
VPC
VPC
VPC
Direct Connect Gateway 
A
Direct Connect Gateway 
B
VPN
AWS Site-to-Site 
VPN
VPC
SDWAN
TGW
共有
AWS Cloud WAN
高度なルーティング制御
仕組み
アタッチメントルーティン
グポリシールールを定義
3
81 / 104


## p.82

リージョン
リージョン
リージョン
AWS Cloud WAN
セグメント A
セグメント B
VPC
VPC
VPC
VPC
VPC
VPC
Direct Connect Gateway 
A
Direct Connect Gateway 
B
VPN
AWS Site-to-Site 
VPN
VPC
SDWAN
TGW
共有
AWS Cloud WAN
高度なルーティング制御
仕組み
ポリシーを適用する
リージョンを選択する
3
このポリシー用にアタッチメント
で参照するラベルを設定
82 / 104


## p.83

リージョン
リージョン
リージョン
AWS Cloud WAN
セグメント A
セグメント B
VPC
VPC
VPC
VPC
VPC
VPC
Direct Connect Gateway 
A
Direct Connect Gateway 
B
VPN
AWS Site-to-Site 
VPN
VPC
SDWAN
TGW
共有
AWS Cloud WAN
高度なルーティング制御
仕組み
コアネットワークポリシーを
生成・適用する
4
83 / 104


## p.84

リージョン
リージョン
リージョン
AWS Cloud WAN
セグメント A
セグメント B
VPC
VPC
VPC
VPC
VPC
VPC
Direct Connect Gateway 
A
Direct Connect Gateway 
B
VPN
AWS Site-to-Site 
VPN
VPC
SDWAN
TGW
共有
AWS Cloud WAN
高度なルーティング制御
仕組み
アタッチメントにルーティ
ングポリシーラベルを適用
4
84 / 104


## p.85

リージョン
リージョン
リージョン
AWS Cloud WAN
セグメント A
セグメント B
VPC
VPC
VPC
VPC
VPC
VPC
Direct Connect Gateway 
A
Direct Connect Gateway 
B
VPN
AWS Site-to-Site 
VPN
VPC
SDWAN
TGW
共有
AWS Cloud WAN
高度なルーティング制御
Routing Information Base (RIB) 
ビュー
ルートの BGP 属性を
完全に可視化できます
85 / 104


## p.86

グローバル & 
ハイブリッド
接続
AWS Cloud WAN
ハイブリッド接続
86 / 104


## p.87

基礎
AWS Direct Connect
Amazon VPC
VPC A
VPC B
AWS Transit 
Gateway
AWS Cloud 
WAN
仮想プライベー
トゲートウェイ
AWS Direct Connect 
Gateway
AWS Direct Connect 
Gateway
Direct Connect
POP
カスタマー
ルーター
DX ルーター
プライベート仮想
インターフェイス
トランジット仮想
インターフェイス
オンプレミス
カスタマー
ルーター
Amazon VPC
プライベート仮想
インターフェイス
AWS クラウド
パブリック仮想
インターフェイス
87 / 104


## p.88

Before
AWS クラウド
クラウドサービスプロバイ
ダー
リージョン
VPC
VPC
VPC
リージョン
仮想ネットワーク / 仮想プ
ライベートクラウド
Point of Presence (POP)
AWS
ルーター
お客様 / 
パートナーの 
ルーター
CSP
ルーター
POP 経由の
ルーティング
AWS Interconnect
Multicloud
88 / 104


## p.89

AWS クラウド
クラウドサービスプロバイ
ダー
リージョン
VPC
VPC
VPC
リージョン
Point of Presence (POP)
AWS
ルーター
お客様 / 
パートナーの 
ルーター
CSP
ルーター
Point of Presence (POP)
AWS
ルーター
お客様 / 
パートナーの 
ルーター
CSP
ルーター
最大可用性構成
AWS Interconnect
Multicloud
Before
仮想ネットワーク / 仮想プ
ライベートクラウド
89 / 104


## p.90

AWS Interconnect
Multicloud
GA
Google Cloud
90 / 104


## p.91

AWS クラウド
リージョン
VPC
VPC
VPC
最大可用性構成
AWS Transit 
Gateway
AWS Cloud 
WAN
仮想プライベー
トゲートウェイ
Direct Connect Gateway
Google Cloud
マネージド Virtual Private Cloud
テナント Virtual Private Cloud
リージョン
リージョン
Cloud Router
サブネット
サブネット
サブネット
Now
AWS Interconnect
Multicloud
AWS Interconnect
Multicloud
91 / 104


## p.92

AWS Interconnect
Multicloud
使い方 / 完成イメージ
AWS クラウド
クラウドサービスプロバイダー
カスタマー
リージョン
リージョン
Interconnect を作成
1
2
AWS が新規 Interconnect 
の作成をリクエスト
3
アクティベーションキーで 
Interconnect を承認
4
AWS と CSP が要求されたキャパシティ
で Interconnect をプロビジョン
92 / 104


## p.93

AWS Interconnect
Multicloud
GA
Google Cloud
Microsoft Azure in 2026
93 / 104


## p.94

アプリケーション間接
続
高度なアーキテクチャ
マルチクラウドアプリケーション
接続を提供 
マルチクラウド接続のための 
中継用 VPC
Count-slides
Count-animations
Stickers-database
リソース
ゲートウェイ
リソース構成
app-x
リソース構成
resource-x
Transit 
Gateway
Cloud 
WAN
VPC Lattice 
サービスネットワーク
CDN320-apps-
Region-1
クラウドサービスプロバイ
ダー
Direct Connect Gateway
AWS Interconnect
Multicloud
アプリケーション
リソース
94 / 104


## p.95

04.
DNS, IPアドレス管理, 
IPv6対応
95 / 104


## p.96

統合グローバル DNS 解決: オンプレミス・支社・リモート
クライアントなど、どこからでもパブリックドメインおよ
びプライベートドメイン（Route 53 プライベートホストゾ
ーン）の DNS クエリを解決します。
GA
Amazon Route 53
Global Resolver
低レイテンシと可用性のための Anycast アーキテクチャ: 
グローバル Anycast IPv4 および IPv6 アドレスを使用して
、DNS クエリをお客様が選択した最寄りの AWS リージョ
ンにルーティングし、リージョン間で自動フェイルオーバ
ーします。
組み込みのセキュリティとトラフィックフィルタリング: 
暗号化 DNS プロトコル（Do53、DoH、DoT）に対応し、
DNS ファイアウォールによるフィルタリング（マルウェア
、フィッシング、望ましくないコンテンツ）を適用でき、
高度な DNS 脅威（DNS トンネリング、DGA）を検出し、
集中ログ機能を備えています。
運用負荷の削減: パブリックおよびプライベート DNS 解決
を単一のグローバル到達可能なリゾルバーに統合すること
で、複数のリゾルバー群の維持やカスタム転送の構成が不
要になります。
96 / 104


## p.97

Amazon VPC IP
Address Manager
IPAM と AWS プレフィックスリストの統
合により、プレフィックスリストの更新
を自動的に管理できます。
IPAM は パブリック IPv4 アドレス割り当てポリ
シーに対応し、リージョン NAT ゲートウェイや 
Elastic IPv4 アドレスで利用できます。
IPAM と Infoblox の統合により、Infoblox 
Universal IPAM から重複のない IP アドレ
ス割り当てを自動的に取得できます
97 / 104


## p.98

IPv6 採用
100 以上の AWS サービスが本年これまで
に IPv6 対応をリリースしました。
ex.ゲートウェイエンドポイントもIPv6対応
AWS サービスの 75% 以上が IPv6 に対応
しています。
98 / 104


## p.99

05.
エピローグ
99 / 104


## p.100

SD-WAN アプライアンス
インターネット
Connect
(GRE)
 および Tunnel-less)
VPC
VPC
VPC
TGW Connect (GRE)
VPC
ピアリング接続
VPC
クロスリージョン ピアリング接続
VPC
VPC
VPC
SD-WAN アプライアンス
インターネット
カスタマーゲートウェイ
DX-GW
VPN 接続
DX 接続
DX-GW
VPN 接続
DX POP
企業 
データセンター
AWS Transit 
Gateway
AWS PrivateLink
インターフェイスエンドポ
イントによる150 以上のサ
ービスへの接続
AWS PrivateLink
Network Load 
Balancer
ターゲット
PrivateLink サービスプロバイダー VPC
インターネット
Amazon 
S3
パブリックサービス 例:
Amazon 
DynamoDB
Gateway Load 
Balancer
検査 VPC
ターゲット
FW
FW
EC2
サブネット 4
VPC CIDR: 10.0.0.0/16  /  2001:db8:1234:1a00::/56
サブネット 2
2001:db8:1234:1a20::/64
2001:db8:1234:1a40::/64
10.0.1.0/24
サブネット 1
2001:db8:1234:1a10::/64
10.0.2.0/24
10.0.4.0/24
パブリック
プライベート
プライベート
ターゲット
ELB
ターゲット
インターフェイス
エンドポイント
サブネット
10.0.3.0/24
2001:db8:1234:1a30::/64
NAT-GW
ANFW
サブネット 3
パブリック
VPC
ゲートウェイエンドポイント
インターネットゲー
トウェイ (IGW)
Egress専用 IGW
仮想プライベート
ゲートウェイ
インターフェイス
エンドポイント
サブネット
VPC
VPC
AWS Transit Gateway
VPC
VPC
20以上
IPv6 対応
の発表
+ プライベート IPv6 アドレッシング
新機能: IPv6 サポート
EC2 Instance 
Connect (EIC)
管理者
AWS コンソール
セキュリティ
グループ
VPC
VPC
セキュリティグループ
AWS アカウ
ント
AWS アカウ
ント
サブネット
サブネット
X
セキュリティ
グループ
DX-GW
SG-A
EC2
SG-B
AWS Cloud WAN
セグメント A
セグメント B
AWS Network 
Firewall
Gateway Load 
Balancer + サードパー
ティアプライアンス
VPC
リソース構成
IPv6 ターゲット
グループ
IPv4 またはIPv6
UDP リスナー
クロスリージョン
ターゲット
App n
SN-A
SN-E
サービス/リソ
ース関連付け
VPC Lattice
EC2
ECS
TLS
リソース構成
AWS Verified Access
信頼プロバイダー
ユーザー
アプリケーショ
ン関連付け
サブネット
App 1
TCP
アプリ
一時的リソース
Amazon CloudFront
POP
POP
POP
CloudWatch Observability
2024 年 12 月
100 / 104


## p.101

SD-WAN アプライアンス
インターネット
Connect
(GRE)
 および Tunnel-less)
VPC
VPC
VPC
TGW Connect (GRE)
VPC
ピアリング接続
VPC
クロスリージョン ピアリング接続
VPC
VPC
VPC
SD-WAN アプライアンス
インターネット
カスタマーゲートウェイ
DX-GW
VPN 接続
DX 接続
DX-GW
VPN 接続
DX POP
企業 
データセンター
AWS Transit 
Gateway
AWS PrivateLink
インターフェイスエンドポ
イントによる150 以上のサ
ービスへの接続
AWS PrivateLink
Network Load 
Balancer
ターゲット
PrivateLink サービスプロバイダー VPC
インターネット
Amazon 
S3
パブリックサービス 例:
Amazon 
DynamoDB
Gateway Load 
Balancer
検査 VPC
ターゲット
FW
FW
EC2
サブネット 4
VPC CIDR: 10.0.0.0/16  /  2001:db8:1234:1a00::/56
サブネット 2
2001:db8:1234:1a20::/64
2001:db8:1234:1a40::/64
10.0.1.0/24
サブネット 1
2001:db8:1234:1a10::/64
10.0.2.0/24
10.0.4.0/24
パブリック
プライベート
プライベート
ターゲット
ELB
ターゲット
インターフェイス
エンドポイント
サブネット
10.0.3.0/24
2001:db8:1234:1a30::/64
NAT-GW
ANFW
サブネット 3
パブリック
VPC
ゲートウェイエンドポイント
インターネットゲー
トウェイ (IGW)
Egress専用 IGW
仮想プライベート
ゲートウェイ
インターフェイス
エンドポイント
サブネット
VPC
VPC
AWS Transit Gateway
VPC
VPC
20以上
IPv6 対応
の発表
+ プライベート IPv6 アドレッシング
新機能: IPv6 サポート
EC2 Instance 
Connect (EIC)
管理者
AWS コンソール
セキュリティ
グループ
VPC
VPC
セキュリティグループ
AWS アカウ
ント
AWS アカウ
ント
サブネット
サブネット
X
セキュリティ
グループ
DX-GW
SG-A
EC2
SG-B
AWS Cloud WAN
セグメント A
セグメント B
AWS Network 
Firewall
Gateway Load 
Balancer + サードパー
ティアプライアンス
VPC
リソース構成
IPv6 ターゲットグループ
IPv4 またはIPv6
UDP リスナー
クロスリー
ジョン
ターゲット
App n
SN-A
SN-E
サービス/リソ
ース関連付け
VPC Lattice
EC2
ECS
TLS
リソース構成
AWS Verified Access
信頼プロバイダー
ユーザー
アプリケーショ
ン関連付け
サブネット
App 1
TCP アプ
リ
一時的リソース
Amazon CloudFront
POP
POP
POP
CloudWatch Observability
2024年12月
Amazon VPC
Regional NAT Gateway
Network Firewall Proxy / 複数VPC EP
VPC Route Server
TGW Native NFW Attachment
VPC 暗号化コントロール
Application Networking
PrivateLink クロスリージョン
Gateway Endpoint IPv6
Lattice Custom DNS / 設定可能なIP
ALB / NLB 2025 新機能
Global & Hybrid
Cloud WAN SG 参照
Cloud WAN Advanced Routing Controls
Site-to-Site VPN 5 Gbps
Interconnect Multicloud / Last Mile（GA）
DNS / IPAM
Route 53 Global Resolver（GA）
VPC IPAM 新機能
IPv6 採用75% 突破
2025 年の
ネットワーク
新機能
150以上
101 / 104


## p.102

SD-WAN アプライアンス
インターネット
Connect
(GRE)
 および Tunnel-less)
VPC
VPC
VPC
TGW Connect (GRE)
VPC
ピアリング接続
VPC
クロスリージョン ピアリング接続
VPC
VPC
VPC
SD-WAN アプライアンス
インターネット
カスタマーゲートウェイ
DX-GW
VPN 接続
DX 接続
DX-GW
VPN 接続
DX POP
企業 
データセンター
AWS Transit 
Gateway
AWS PrivateLink
インターフェイスエンドポ
イントによる150 以上のサ
ービスへの接続
AWS PrivateLink
Network Load 
Balancer
ターゲット
PrivateLink サービスプロバイダー VPC
インターネット
Amazon 
S3
パブリックサービス 例:
Amazon 
DynamoDB
Gateway Load 
Balancer
検査 VPC
ターゲット
FW
FW
EC2
サブネット 4
VPC CIDR: 10.0.0.0/16  /  2001:db8:1234:1a00::/56
サブネット 2
2001:db8:1234:1a20::/64
2001:db8:1234:1a40::/64
10.0.1.0/24
サブネット 1
2001:db8:1234:1a10::/64
10.0.2.0/24
10.0.4.0/24
パブリック
プライベート
プライベート
ターゲット
ターゲット
インターフェイス
エンドポイント
サブネット
10.0.3.0/24
2001:db8:1234:1a30::/64
NAT-GW
NFW
サブネット 3
パブリック
ゲートウェイエンドポイント
インターネット
ゲートウェイ (IGW)
Egress専用 IGW
仮想プライベート
ゲートウェイ
インターフェイス
エンドポイント
サブネット
VPC
VPC
AWS Transit Gateway
VPC
VPC
+ プライベート IPv6 アドレッシング
新機能: IPv6 サポート
EC2 Instance 
Connect (EIC)
管理者
AWS コンソール
セキュリティ
グループ
VPC
VPC
セキュリティグループ
AWS アカウ
ント
AWS アカウ
ント
サブネット
サブネット
X
セキュリティ
グループ
DX-GW
SG-A
EC2
SG-B
AWS Cloud WAN
セグメント A
セグメント B
AWS Network 
Firewall
Gateway Load 
Balancer + サードパー
ティアプライアンス
VPC
リソース構成
IPv6 ターゲットグループ
IPv4 またはIPv6
UDP リスナー
クロスリージョン
ターゲット
App n
SN-A
SN-E
サービス/リソ
ース関連付け
VPC Lattice
EC2
ECS
TLS
リソース構成
AWS Verified Access
信頼プロバイダー
ユーザー
アプリケーショ
ン関連付け
サブネット
App 1
TCP アプ
リ
一時的リソース
Amazon CloudFront
POP
POP
POP
CloudWatch Observability
VPC BPA
2025 年 12 月
リージョナル
NATGW
100 以上
IPv6 対応
の発表
Amazon API 
Gateway Portal
VPC
暗号化コン
トロール
カスタム DNS 
名
ルート
サーバー 
エンドポイント
NFW
プロキ
シ
NFW
Cloud WAN ルーティングポリシー
VPC
VPC
セキュリティ
グループ
Amazon 
Route 53 Global 
Resolver
複数の NFW エンドポイント
AWS Interconnect
Multicloud
ELB
VPN コンセントレーター
eero
2025.12時点
102 / 104


## p.103

Exhibition Booth Information
展示ブースのご案内
A120
マネージドサービスを活用し
多層防御でシステムを守る
AWS Village ①
A141
AWS ネットワーキングサービス
AWS Village ②


## p.104

Ask the Speaker
こちらのRoom 後方の外側にございます、
「Ask the Speaker」カウンターまでお越しください
長谷川工祐
アマゾンウェブサービスジャパン合同会社
Room
103 / 104


## p.105

本セッションのアンケートへ
ご協力をお願いします
Please give us your feedback
Thank you!
CDN320
104 / 104
