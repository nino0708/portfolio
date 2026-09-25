---
title: "5GC on AWS のサービス開始と Agentic AI による構築自動化"
category: "事例セッション"
session_id: "IND242"
pages: 49
topics: ["生成AI/エージェント"]
services: ["AgentCore", "Amazon Bedrock", "Amazon EKS", "Amazon RDS", "Amazon Route 53", "Amazon VPC", "MCP"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/事例セッション/5GC on AWS のサービス開始と Agentic AI による構築自動化.pdf"
---
# 5GC on AWS のサービス開始と Agentic AI による構築自動化


## p.1

IND242
5GC on AWS のサービス開始と
Agentic AI による構築自動化
國友宏一郎
株式会社NTTドコモ
シニアエキスパート


## p.2

ⓒ2026 NTT DOCOMO, INC. All Rights Reserved.
5GC on AWS のサービス開始と
Agentic AI による構築自動化
2026年5月15日
株式会社NTTドコモ
國友
宏一郎


## p.3

ⓒ2026 NTT DOCOMO, INC. All Rights Reserved.
自己紹介
Page 3
國友宏一郎
くにともこういちろう
NTTドコモ
コアネットワークデザイン部5Gコア担当
シニアエキスパート
これまでの経歴
・PDC-P(2Gパケット)の保守運用
・3Gパケットコアネットワーク開発
・4G(LTE)コアネットワーク開発
・5Gコアネットワーク開発
パケット系のコアネットワーク一筋です！
最近の業務
5GC on AWS
5GC スライス
趣味
社内でのIPv6 布教活動
アニメ鑑賞


## p.4

0
モバイルコアネットワークの進化と5G
1
5G SA への進化と5G コアの特徴
2
AI x GitOps を用いた5G コアの構築
3
パブリッククラウド上での5G コア実装
Contents
0
モバイルコアネットワークの進化と5G


## p.5

ⓒ2026 NTT DOCOMO, INC. All Rights Reserved.
モバイルネットワークの進化
Page 5
5G
社会課題解決
人間中心の価値創出
2020 年
第1 の波
携帯電話の普及
第2 の波
モバイルマルチメディア
3G
4G
2G
動く電話
持ち運べる
電話
ポケットに入る
携帯電話
情報が手中に
多彩な
APL・動画
1980 年
自動車電話
1985 年
ショルダーフォン
1990 年
MOVA
2000 年
i-mode
2010 年
スマホ
1G
第3 の波
新しい事業価値
6G
2030 年
モバイルコアネットワークの進化と5G


## p.6

ⓒ2026 NTT DOCOMO, INC. All Rights Reserved.
モバイルネットワークの進化
Page 6
2024:6.6Gbps
モバイルコアネットワークの進化と5G


## p.7

ⓒ2026 NTT DOCOMO, INC. All Rights Reserved.
本日のスコープ
• 無線基地局と外部ネットワークの
間を中継し、セッションを管理す
る制御信号やお客様のデータを
ルーティングするコアネットワー
ク領域
Page 7
コアネットワーク
基地局
ISP
DB
セッション管理
モバイルコアネットワークの進化と5G


## p.8

ⓒ2026 NTT DOCOMO, INC. All Rights Reserved.
コアネットワークの進化(技術トピック)
Page 8
2G
1G
デジタル化
パケット交換システム導入
モバイルコアネットワークの進化と5G


## p.9

ⓒ2026 NTT DOCOMO, INC. All Rights Reserved.
コアネットワークの進化(技術トピック)
Page 9
2G
国際標準規格採用
STM/ATM → IP 化
共通サーバ化(ATCA 等)
3G
STM/ATM:2G/3G世代まで主流であった伝送方式
STM: Synchronous Transfer Mode
ATM: Asynchronous Transfer Mode
ATCA: 通信事業者向けハードウェア規格
モバイルコアネットワークの進化と5G


## p.10

ⓒ2026 NTT DOCOMO, INC. All Rights Reserved.
コアネットワークの進化(技術トピック)
Page 10
3G
データ常時接続
C/U 分離(制御とデータの分離)
IoT への対応
VoLTE(音声IP 化)
仮想化
4G
モバイルコアネットワークの進化と5G


## p.11

ⓒ2026 NTT DOCOMO, INC. All Rights Reserved.
コアネットワークの進化(技術トピック)
Page 11
4G
多様な要求へ適応(大容量/低遅延/多端末)
5GC、SBA
ネットワークスライシング
クラウド
コンテナ
5G
モバイルコアネットワークの進化と5G


## p.12

0
モバイルコアネットワークの進化と5G
1
5G SA への進化と5G コアの特徴
2
AI x GitOps を用いた5G コアの構築
3
パブリッククラウド上での5G コア実装
Contents
1
5G SA への進化と5G コアの特徴


## p.13

ⓒ2026 NTT DOCOMO, INC. All Rights Reserved.
5G の要件
Page 13
※ Recommendation ITU-R M.2083-0 で規定される5G が持つべき能力
ピークレート20 Gbps※
無線区間の伝送遅延1 ms※
同時接続数106 デバイス/K㎡※
5G
目標性能
4K/8K ストリーミング
AR/VR
自動運転支援
遠隔医療
農業ICT
高速・大容量
高信頼・低遅延
多数の端末との接続
スマートシティ
スマートホーム
スタジアムソリューション
5G SA への進化と5G コアの特徴


## p.14

ⓒ2026 NTT DOCOMO, INC. All Rights Reserved.
5G マイグレーションと5GC
• 5G 開始当初は4G を活用するNon-StandAlone(NSA)で5G 導入
• 5GC 導入によりStand-Alone(SA)によるサービス提供が可能
Page 14
5G NSA
5G SA
4G
LTE 基地局
eNB
EPC
LTE エリア
LTE 基地局
eNB
NR 基地局
gNB
LTE エリア
NR エリア
LTE 基地局
eNB
NR 基地局
gNB
5GC
EPC
LTE エリア
NR エリア
4G 通信
5G通信
5G通信
5Gならでは
のサービス
EPC
5G SA への進化と5G コアの特徴


## p.15

ⓒ2026 NTT DOCOMO, INC. All Rights Reserved.
5G SA への取組み
• お客様の多様なニーズに応じたサービス提供を可能とするネット
ワークスライシングを段階的に導入
Page 15
基地局
伝送区間
コア区間
インターネット
ネットワークスライス（高速大容量）
ネットワークスライス（低遅延）
XR
自動運転
遠隔操作
コア内スライスからRAN、伝送区間
と協調したエンドエンドスライスへ
用途別スライス
5G SA への進化と5G コアの特徴


## p.16

ⓒ2026 NTT DOCOMO, INC. All Rights Reserved.
5GC の構成
• 5G コアはNF(Network Function) 
という論理装置(機能)群から構成
• NF 同士が必要なサービス、機能に
応じて相互にやり取りを行い5G 
SA サービスを提供する
Page 16
NSSF
NEF
NRF
PCF
UDM
UDR
SCP
AUSF
AMF
SMF
・・・
UPF
gNB
※代表的なもののみ記載
5G SA への進化と5G コアの特徴


## p.17

ⓒ2026 NTT DOCOMO, INC. All Rights Reserved.
NF 機能概要(制御系)
Page 17
NSSF
NEF
NRF
PCF
UDM
UDR
SCP
AUSF
AMF
SMF
・・・
UPF
gNB
AMF
Access and Mobility Management Function
加入者の位置登録、在圏移動などモ
ビリティを管理
SMF
Session Management Function
通信のセッション管理、U-Plane 割当
制御を行う
5G SA への進化と5G コアの特徴


## p.18

ⓒ2026 NTT DOCOMO, INC. All Rights Reserved.
NF 機能概要(DB系)
Page 18
NSSF
NEF
NRF
PCF
UDM
UDR
SCP
AUSF
AMF
SMF
・・・
UPF
gNB
UDM/UDR
Unified Data Management/ User Data Repository
加入者情報を保持
AUSF
Authentication Server Function
認証情報サーバ
5G SA への進化と5G コアの特徴
PCF
Policy Control Function
加入者のポリシー、QoS、課金制御
などを実施


## p.19

ⓒ2026 NTT DOCOMO, INC. All Rights Reserved.
NF 機能概要(新機能関連NF)
Page 19
NSSF
NEF
NRF
PCF
UDM
UDR
SCP
AUSF
AMF
SMF
・・・
UPF
gNB
NSSF
Network Slice Selection Function
適切なスライスの選択、割り当てを
行う
NRF
Network Repository Function
各NF の提供サービスの登録、管理、
ディスカバリーなどを担う
NEF
Network Exposure Function
5GC ネットワーク機能の外部からの
制御を可能とする
5G SA への進化と5G コアの特徴


## p.20

ⓒ2026 NTT DOCOMO, INC. All Rights Reserved.
NF 機能概要(U-Plane)
Page 20
NSSF
NEF
NRF
PCF
UDM
UDR
SCP
AUSF
AMF
SMF
・・・
UPF
gNB
UPF
User Plane Function 
ユーザーデータの送受信を行う
gNB
gNodeB
5G NR の基地局
(一応)
5G SA への進化と5G コアの特徴


## p.21

ⓒ2026 NTT DOCOMO, INC. All Rights Reserved.
5GC アーキテクチャの特徴
• 仮想化は(ほぼ)前提
• クラウドと親和性の高い要素技術
• SBA
• マイクロサービス
• コンテナ化
• C/U 分離
Page 21
ハード
ハイパーバイザー
VM
OS
ソフト
ハード
コンテナランタイム
ソフト
コンテナ
コンテナ化
5G SA への進化と5G コアの特徴


## p.22

ⓒ2026 NTT DOCOMO, INC. All Rights Reserved.
5GC アーキテクチャの特徴
• Service Based Architecture (SBA)
• システムを複数の独立した機能(サービス)
に分割し、それらが連携することにより
5GC 機能を提供
• モジュール化、自己完結、再利用性、フ
ラットなIF(SBI)
• C/U の完全分離
Page 22
NSSF
NEF
NRF
PCF
UDM
SCP
AUSF
AMF
SMF
・・・
UPF
gNB
SBI
5G SA への進化と5G コアの特徴


## p.23

ⓒ2026 NTT DOCOMO, INC. All Rights Reserved.
5GC アーキテクチャの特徴
• SBA
• システムを複数の独立した機能
(サービス)に分割し、それらが連携
することにより5GC 機能を提供
• モジュール化、自己完結、再利用性、
フラットなIF(SBI)
• C/U の完全分離
Page 23
NSSF
NEF
NRF
PCF
UDM
SCP
AUSF
AMF
SMF
・・・
UPF
gNB
CU 分離
U-Plane
C-Plane
5G SA への進化と5G コアの特徴


## p.24

ⓒ2026 NTT DOCOMO, INC. All Rights Reserved.
仮想化の現在地と5G 世代のクラウドへの期待
Page 24
共通サーバ化で迅速性アップ
物理作業のリードタイム自体は存在
迅速性
スケーリングによる柔軟性向上
物理リソースの確保自体は必要
ヒーリングにより連続的な復旧可能
ヒーリングリソースは常時確保要
汎用サーバでコスト削減効果
予備リソース分のコストは常時発生
可用性
柔軟性
経済性
クラウドリソースの適用
による迅速な容量確保
増減柔軟化、迅速化によ
るスケーラビリティ向上
グローバルな物理ロケー
ションの活用
必要なリソースを必要な
タイミングで利用
5G SA への進化と5G コアの特徴


## p.25

0
モバイルコアネットワークの進化と5G
1
5G SA への進化と5G コアの特徴
2
AI x GitOps を用いた5G コアの構築
3
パブリッククラウド上での5G コア実装
Contents
2
パブリッククラウド上での5G コア実装


## p.26

ⓒ2026 NTT DOCOMO, INC. All Rights Reserved.
ドコモが5G 時代にめざすネットワーク
Page 26
Availability
Flexibility
Sustainability
パブリッククラウド上での5G コア実装


## p.27

ⓒ2026 NTT DOCOMO, INC. All Rights Reserved.
ドコモが5G 時代にめざすネットワーク
• 通信は生活インフラであり、サービ
ス継続が社会的使命
• ネットワークのさらなる可用性向
上がこの使命を果たすために必要
• 実現手段の1 つとして自社のオンプ
レミス環境とクラウド環境との連携
を検討
Page 27
Availability
パブリッククラウド上での5G コア実装


## p.28

ⓒ2026 NTT DOCOMO, INC. All Rights Reserved.
ドコモが5G 時代にめざすネットワーク
• 5G 時代のネットワークには多くの
産業との連携や新たな付加価値の提
供が期待されている
• より柔軟・迅速なネットワーク
機能配備の実現がこの期待に応える
ために必要
• 実現手段の1 つとしてパブリックク
ラウドの活用が考えられる
Page 28
Flexibility
パブリッククラウド上での5G コア実装


## p.29

ⓒ2026 NTT DOCOMO, INC. All Rights Reserved.
ドコモが5G 時代にめざすネットワーク
• 通信事業者として持続可能な社会の
実現に貢献する責務
• より低環境負荷なネットワーク
の実現が責務を果たすために必要
• ネットワーク装置の低消費電力化が
1 つの実現手段
Page 29
Sustainability
パブリッククラウド上での5G コア実装


## p.30

ⓒ2026 NTT DOCOMO, INC. All Rights Reserved.
パブリッククラウド活用のモチベーション
• ドコモがめざすネットワークの実現に向けてパブリッククラウドを活用
Page 30
Availability
Sustainability
Flexibility
パブリッククラウドとオンプレミスの連携
柔軟かつ迅速なデプロイメント
より低消費電力なプロセッサ
パブリッククラウド上での5G コア実装
伝送路
パブリッククラウド
5GC
オンプレミス環境
5GC
5GC
消費電力


## p.31

ⓒ2026 NTT DOCOMO, INC. All Rights Reserved.
5GC におけるパブリッククラウド活用に向けた考察
• パブリッククラウドの特性
• 5GC の機能(NF)ごとの特性・要件
Page 31
パブリッククラウド上での5G コア実装


## p.32

ⓒ2026 NTT DOCOMO, INC. All Rights Reserved.
パブリッククラウドの特性
Page 32
特性
ポイント
固定費から変動費
事前の投資が不要
数年先を見据えた投資が不要
利用料とその変動を注視する必要
コスト最適化
ハードウェアに対する運用・保守が
不要
保守運用稼働の低減効果
セキュリティ観点の考慮
キャパシティ予測不要
余剰リソースへの投資が不要
必要時のみ必要リソースを確保
スケールメリット享受
巨大クラウドによる規模メリット
上手に使えばコスト低減期待
スピードと俊敏性
リソース調達が瞬時に可能
予測できない需要への対応迅速化
グローバルデプロイ
世界中の拠点を利用可能
拠点を用意する必要がない
用意された拠点からの選択
パブリッククラウド上での5G コア実装


## p.33

ⓒ2026 NTT DOCOMO, INC. All Rights Reserved.
5GC NF の特性
Page 33
制御系(AMF/SMF 等)
DB 系(UDM/AUSF 等)
U-Plane 系(UPF)
送受信データ量
小
小
大
管理データ量
小
大
小
遅延への要件
一般的に小
小
場合により大
データ重要性
小
大
小
リソース変動幅
大
小
大
パブリッククラウド上での5G コア実装


## p.34

ⓒ2026 NTT DOCOMO, INC. All Rights Reserved.
5GC NF の特性
Page 34
制御系
(AMF/SMF 等)
DB 系
(UDM/AUSF 等)
U-Plane系
(UPF)
送受信データ量
小
小
大
管理データ量
小
大
小
遅延への要件
一般的に小
小
場合により大
データ重要性
小
大
小
リソース変動幅
大
小
大
要求リソースが常に
大きいものはコスト
面の見極めが必要
パブリッククラウド上での5G コア実装


## p.35

ⓒ2026 NTT DOCOMO, INC. All Rights Reserved.
5GC NF の特性
Page 35
制御系
(AMF/SMF 等)
DB 系
(UDM/AUSF 等)
U-Plane 系
(UPF)
送受信データ量
小
小
大
管理データ量
小
大
小
遅延への要件
一般的に小
小
場合により大
データ重要性
小
大
小
リソース変動幅
大
小
大
パブリッククラウド
の提供拠点制約の中
で要件が満たされる
かの考慮が必要
パブリッククラウド上での5G コア実装


## p.36

ⓒ2026 NTT DOCOMO, INC. All Rights Reserved.
5GC NF の特性
Page 36
制御系
(AMF/SMF 等)
DB 系
(UDM/AUSF 等)
U-Plane 系
(UPF)
送受信データ量
小
小
大
管理データ量
小
大
小
遅延への要件
一般的に小
小
場合により大
データ重要性
小
大
小
リソース変動幅
大
小
大
重要性の高いデータ
に対するセキュリ
ティ観点の考慮が必
要
パブリッククラウド上での5G コア実装


## p.37

ⓒ2026 NTT DOCOMO, INC. All Rights Reserved.
5GC NF の特性
Page 37
制御系
(AMF/SMF 等)
DB 系
(UDM/AUSF 等)
U-Plane 系
(UPF)
送受信データ量
小
小
大
管理データ量
小
大
小
遅延への要件
一般的に小
小
場合により大
データ重要性
小
大
小
リソース変動幅
大
小
大
必要時のみリソース
確保できるパブリッ
ククラウドのメリッ
トを活かせる可能性
パブリッククラウド上での5G コア実装


## p.38

ⓒ2026 NTT DOCOMO, INC. All Rights Reserved.
5GC NF の特性を踏まえたクラウド配備評価
Page 38
制御系(AMF/SMF 等)
DB 系(UDM/AUSF 等)
U-Plane 系(UPF)
送受信データ量
〇
〇
△
管理データ量
〇
△
〇
遅延への要件
〇
〇
〇～×
データ重要性
〇
×～〇
〇
リソース変動幅
◎
〇
◎
パブリッククラウド上での5G コア実装


## p.39

ⓒ2026 NTT DOCOMO, INC. All Rights Reserved.
商用5GC におけるパブリッククラウド活用の開始
Page 39
パブリッククラウド上での5G コア実装
伝送路
ドコモ
自社仮想化基盤
5GC
UPF
Amazon EKS
5GC
5GC
Amazon VPC
AWS 上に5GC を構築、2026 年2 月より商用サービス開始（国内初！）
ネットワーク設備容量を需要に応じて柔軟・迅速に拡大可能に
AWS
Transit Gateway


## p.40

ⓒ2026 NTT DOCOMO, INC. All Rights Reserved.
まとめ
• ドコモはネットワークの可用性、柔軟性、迅速性向上の観点および
環境負荷低減の可能性を訴求しパブリッククラウドの活用を開始
• NF ごとの特性を踏まえパブリッククラウドへの適用性を評価
Page 40
パブリッククラウド上での5G コア実装


## p.41

0
モバイルコアネットワークの進化と5G
1
5G SA への進化と5G コアの特徴
2
AI x GitOps を用いた5G コアの構築
3
パブリッククラウド上での5G コア実装
Contents
3
AI x GitOps を用いた5G コアの構築


## p.42

ⓒ2026 NTT DOCOMO, INC. All Rights Reserved.
従来の構築プロセス
Page 42
AI x GitOps を用いた5G コアの構築
マニュアル・仕様書・
設計ルール確認
パラメータ設計・
設定ファイル作成
レビュー
構築・設定作業
AWS
5GC
大量の設定ファイルのレビュー
膨大なマニュアル・仕様書・
複雑な設計ルールの確認
多種の設定ファイルの作成
煩雑な構築手順の実施・設定投入
設定値の設計から構築まで、非常に多くの人手と時間を要する
人為ミスの発生や需要増への迅速な追従に影響あり
約４～６ヶ月程度
5GC
マニュアル
仕様書
設計ルール
基盤設定ファイル
アプリ設定ファイル
5GC 設定ファイル


## p.43

ⓒ2026 NTT DOCOMO, INC. All Rights Reserved.
AI x GitOps を用いた設計・構築の自動化
Page 43
AI x GitOps を用いた5G コアの構築
マニュアル・仕様書・
設計ルール確認
パラメータ設計・
設定ファイル作成
レビュー
構築・設定作業
AWS
5GC
大量の設定ファイルのレビュー
膨大なマニュアル・仕様書・
複雑な設計ルールの確認
多種の設定ファイルの作成
煩雑な構築手順の実施・設定投入
5GC
マニュアル
仕様書
設計ルール
AI による設計自動化
膨大なマニュアル・仕様書などをナレッジベースとし、
必要なファイルの生成をAI エージェントが行う
GitOps による構築自動化
設定ファイル・インフラ・アプリ構築手順
をすべてをコード化し、Git で管理・自動構築
（IaC・Single Source of Truth(SSoT)・CI/CD）
基盤設定ファイル
アプリ設定ファイル
5GC 設定ファイル


## p.44

ⓒ2026 NTT DOCOMO, INC. All Rights Reserved.
アーキテクチャ
Page 44
AI x GitOps を用いた5G コアの構築
GitOps
Agentic AI
構築指示
Git
CI/CD
Tools
商用環境
(5GConAWS)
AWS 上に5GC を
構築してください
SMF
AMF
git 担当エージェント
インフラ担当エージェント
アプリ担当エージェント
コンフィグ担当エージェント
5GC
ファイル
生成
生成
生成
格納
デプロイ
参照
ナレッジ
ベース
IF
仕様書
構築
マニュ
アル
アドレス
設計
参照
参照
検証自動化
オーケストレータ
オペレータ
レビュアー
確認・承認
コン
フィグ
アプリ
設定
インフラ
設定
構築・設定
スクリプト
コンフィグ投入
(CRD)
アプリ定義
(Helm)
インフラ定義
(Amazon 
CloudFormation)
Amazon EKS
Amazon RDS
Amazon Route 53


## p.45

ⓒ2026 NTT DOCOMO, INC. All Rights Reserved.
AI エージェントの詳細構成
Page 45
AI x GitOps を用いた5G コアの構築
5GConAWS
Agentic AI
Amazon Bedrock AgentCore
(Orchestrator Agent)
Amazon Bedrock 
(カスタムモデルホスティング)
Amazon Bedrock AgentCore
(Git Agent)
Amazon Bedrock AgentCore
(5GC Infra Agent)
Amazon Cognito
Amazon Bedrock 
AgentCore Gateway
A2A
MCP
MCP
Amazon Bedrock 
Knowledge Bases
GitOps
Amazon Bedrock AgentCore
(5GC App Config Agent)
MCP
Amazon Bedrock 
Knowledge Bases
Amazon Bedrock AgentCore
(5GC App Agent)
MCP
Amazon Bedrock 
Knowledge Bases
GitLab
Runner
Argo CD
Amazon Bedrock 
AgentCore Gateway
Amazon Bedrock 
AgentCore Gateway
Amazon Bedrock 
AgentCore Gateway
Agent-to-Agent (A2A)
Model Context Protocol (MCP)


## p.46

ⓒ2026 NTT DOCOMO, INC. All Rights Reserved.
AI × GitOps の活用による効果
Page 46
AI x GitOps を用いた5G コアの構築
マニュアル・仕様書・
設計ルール確認
パラメータ設計・
設定ファイル作成
レビュー
構築・設定作業
AWS
5GC
設計から構築にかかる時間を大幅に短縮
構築作業やマニュアル作成のコスト削減、人為ミス低減に繋がった
約４～６ヶ月程度
5GC
マニュアル
仕様書
設計ルール
基盤設定ファイル
アプリ設定ファイル
5GC設定ファイル
約１ヶ月未満
Before
After
約80 %短縮


## p.47

ⓒ2026 NTT DOCOMO, INC. All Rights Reserved.
今後の展望
Page 47
AI x GitOps を用いた5G コアの構築
マニュアル・仕様書・
設計ルール確認
パラメータ設計・
設定ファイル作成
レビュー
構築・設定作業
AWS
5GC 5GC
保守・運用
検証
5GC の設計から構築までをAI × GitOps で実装、リードタイム削減に成功
今後は適用領域を拡大し、AI が設計から運用まで一貫して最適化する世界を目指す
さらなる高速化・精度向上
AI による
レビュー
試験
機
試験
シナリオ
AI による
シナリオ作成
検証自動化
AWS
5GC 5GC
RCA
AI による
根本原因分析
基盤・他ノード
への拡張
check


## p.48

Exhibition Booth Information
展示ブースのご案内
A036
A063
A067
株式会社NTTドコモ
AWS for Industries Zone①


## p.49

本セッションのアンケートへ
ご協力をお願いします
Please give us your feedback
Thank you!
IND242
