---
title: "Amazon EC2 がセキュアな理由を、 専用チップの設計から徹底解説 — EC2 インスタンスの裏で動く AWS Nitro System —"
category: "AWSセッション"
session_id: "CMP336"
pages: 55
topics: ["セキュリティ"]
services: ["Amazon EC2", "Inferentia", "Trainium"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/AWSセッション/Amazon EC2 がセキュアな理由を、 専用チップの設計から徹底解説 — EC2 インスタンスの裏で動く AWS Nitro System —.pdf"
---
# Amazon EC2 がセキュアな理由を、 専用チップの設計から徹底解説 — EC2 インスタンスの裏で動く AWS Nitro System —


## p.1

CMP336
Amazon EC2 がセキュアな理由を、
専用チップの設計から徹底解説
— EC2 インスタンスの裏で動くAWS Nitro System —
杉山遼子
アマゾンウェブサービスジャパン合同会社


## p.2

Amazon EC2 の特徴といえば...？
パフォーマンス
セキュリティ


## p.3

自己紹介
杉山
遼子
アマゾンウェブサービスジャパン
ソリューションアーキテクト
エネルギー業界のお客様の
クラウド活用をご支援しています。
好きなAWS サービス
Amazon EC2


## p.4

• Amazon EC2 の裏側の仕組みに興味がある方
• クラウドのセキュリティ設計を深く理解したい方
• インフラ基盤の技術選定に関わるエンジニア・アーキテクト
前提知識
• EC2 の基本的な使い方
本セッションの対象者


## p.5

• AWS のシリコンイノベーション
• AWS Nitro System とは
• AWS Nitro System ができるまで
• AWS Nitro System セキュリティのDive Deep
• まとめ・今日からできること
アジェンダ


## p.6

AWS のシリコンイノベーション


## p.7

AWS の3 つのシリコンイノベーション
AWS Nitro System
サーバーの仮想化基盤を
専用チップで実現
Graviton4
AWS Graviton
クラウドワークロードに
最適化した高効率CPU
Inf1
AWS Inferentia
AWS Trainium
ML の推論とトレーニングに
特化したアクセラレータ


## p.8

2 0 1 1
2 0 1 3
2 0 1 5
2 0 1 7
2 0 1 8
2 0 1 9
2 0 2 0
2 0 2 1
2 0 2 2
2 0 2 3
2 0 2 4
2 0 2 5
NITRO V1
NITRO V3
NITRO V2
NITRO V4
NITRO V6
NITRO V5
GRAVITON2
GRAVITON3/3E
TRAINIUM
GRAVITON4
TRAINIUM2
GRAVITON5
GRAVITON
INFERENTIA
10 年以上の
シリコン
イノベーション
の系譜
TRAINIUM3


## p.9

AWS 特化の
最適化
開発サイクルの
加速
領域横断による
イノベーション
ハードウェア
レベルの防御
自社開発
4 つの
理由


## p.10

AWS Nitro System とは


## p.11

従来のAWS の仮想化
ホストCPU
お客様のインスタンス
Xen Hypervisor
管理・監視
セキュリティ
ローカル
ストレージ
Amazon
VPC
Amazon
EBS
Dom0


## p.12

課題①：パフォーマンス
ホストCPU
Xen Hypervisor
お客様のインスタンス
管理・監視
セキュリティ
ローカル
ストレージ
Amazon
VPC
Amazon
EBS
Dom0
VM と仮想化処理が
CPU を奪い合う
リソースを最大限お客様に
提供できない


## p.13

課題②：イノベーション速度
ホストCPU
お客様のインスタンス
Xen Hypervisor
管理・監視
セキュリティ
ローカル
ストレージ
Amazon
VPC
Amazon
EBS
Dom0
巨大なコードベースを
改修のたび全体を検証
新機能の出荷に
時間を要する


## p.14

課題③：セキュリティ
ホストCPU
お客様のインスタンス
Xen Hypervisor
管理・監視
セキュリティ
ローカル
ストレージ
Amazon
VPC
Amazon
EBS
Dom0
巨大なコードベース
セキュリティ上の
攻撃面が広い


## p.15

Nitro の解決策
専用ハードウェア（Nitro Card）に機能をオフロード
NITRO CARD
Amazon
VPC
Amazon
EBS
管理・監視
セキュリティ
ローカル
ストレージ
ホストCPU
お客様のインスタンス
Nitro Hypervisor


## p.16

AWS Nitro System の3 つの構成要素
ネットワーク・
ストレージのI/O 
を処理
NITRO CARD
ベアメタルに近い
性能を実現する
軽量でセキュアな
ハイパーバイザー
NITRO HYPERVISOR
マザーボードに
組み込まれた
ハードウェアの
信頼の起点
NITRO SECURITY CHIP


## p.17

© 2023, Amazon Web Services, Inc. or its affiliates. All rights reserved.
NITRO
HYPERVISOR
ファームウェア
NITRO
SECURITY
CHIP
Nitro System
NITRO
CARD


## p.18

1 つの機能に1 枚の専用カード
Nitro Chip
Nitro Card
AWS Village Compute ブースで実物展示中！


## p.19

モジュラー設計がお客様にもたらすメリット
パフォーマンス
セキュリティ


## p.20

AWS Nitro System ができるまで


## p.21

AWS Nitro System ができるまで
①ネットワークをNitro Card へオフロード
NITRO CARD
Amazon
VPC
Amazon
EBS
管理・監視
セキュリティ
ローカル
ストレージ
ホストCPU
お客様のインスタンス
Nitro Hypervisor
ネットワーク


## p.22

①Nitro Card へのネットワークのオフロード
ネットワークのセキュリティとスケーラビリティを両立
VPC データプレーンの
オフロード
セキュリティグループ、ルーティング、
暗号化をハードウェアで処理
→ホストCPU の消費をゼロに
Elastic Network Adaptor 
(ENA)
Dom0 を経由しない
スケーラブルなネットワーク
→CPU への負荷なく
最大200 Gbps までスケール


## p.23

Scalable Reliable Datagram
1 フロー1 パスの制約をマルチパス通信で突破
• SRD はパケットを複数
パスに同時分散し、Nitro
Card が順序を再構成
• 輻輳やリンク障害を
リアルタイムに検知し、
即座に迂回
• EFA・EBS・ENA Express
の共通基盤
サーバー
サーバー


## p.24

ENA でのネットワークフロー
AWS ネットワーク
インスタンス
TCP 5-tuple
flow hash
ENA
ENA
インスタンス
到着順の乱れ
→混雑を検知
→送信減速


## p.25

ENA Express でのネットワークフロー
TCP 5-tuple
flow hash
ENA
ENA
インスタンス
インスタンス
AWS ネットワーク
正しい順序で
届いたように
見せる


## p.26

アプリ変更なしでシングルフローを高速化
ENA Express
5x
シングルフロー帯域幅、5 → 25 Gbps
設定を有効にするだけ
同一AZ 内で利用可能
アプリの変更は不要


## p.27

Elastic Network Adapter パフォーマンス
1
1
10
25
50
75
100
100
200
600
0
200
400
600
2006
2009
2013
2016
2021
2022
2025
帯域幅（Gbps）
Nitro 以前
Nitro
ネットワーク最適化Nitro


## p.28

AWS Nitro System ができるまで
②ストレージをNitro Card へオフロード
NITRO CARD
Amazon
VPC
Amazon
EBS
管理・監視
セキュリティ
ローカル
ストレージ
ホストCPU
お客様のインスタンス
Nitro Hypervisor
ストレージ


## p.29

②Nitro Card へのストレージのオフロード
CPU 負荷なく、セキュリティとパフォーマンスを両立
EBS データプレーンの
オフロード
専用チップによる自動暗号化・
SRD の複数経路で、
パフォーマンスを向上
Non-Volatile Memory 
express (NVMe)
主要OS の標準ドライバーで
そのまま利用可能
高IOPS・高帯域を実現


## p.30

Amazon Elastic Block Store パフォーマンス
1
1
1
2
4
19
60
80
150
8
16
32
80
260
350
720
0
200
400
600
800
2007 2009 2012 2013 2015 2017 2020 2022 2025
帯域幅(Gbps)
IOPS (K)
Nitro 以前
Nitro


## p.31

Nitro System 導入によるイノベーションの加速
モジュラー設計により柔軟な対応が可能に
2017
1,000+
NITRO SYSTEM
以前
NITRO SYSTEM
導入後
2025
2006
70
インスタンスタイプ数


## p.32

AWS Nitro System セキュリティ
Dive Deep


## p.33

データをすべてのライフサイクルで保護する
データの保管
データの移動
データの処理
保管時、移動時は暗号化できる。では処理中は？


## p.34

コンフィデンシャルコンピューティングとは
処理中のデータの保護における2 つの観点
②お客様組織内での保護
①クラウドプロバイダ
からの保護
Nitro Sytem による
セキュリティ強化
Nitro Enclaves
EC2 インスタンスアテステーション


## p.35

コンフィデンシャルコンピューティングとは
処理中のデータの保護における2 つの観点
①クラウドプロバイダ
からの保護
クラウド事業者の社員が
うちのデータ見れるのでは？
Nitro System が構造的
にアクセス経路を排除
4 つの仕組みを解説


## p.36

セキュアブート
すべてのハードウェア
およびソフトウェアコ
ンポーネントが起動時
に暗号的に検証
AWS Nitro System によるセキュリティの強化
①クラウドプロバイダーからの保護
移動時・保管時の
暗号化
Nitro System 内の
すべての通信チャネル
が暗号化
ファームウェアの
ライブアップデート
Nitro System コンポー
ネントは、お客様の操作
なしにアップデート可能
人間のログイン
手段なし
Nitro System や基盤
サーバーへの操作は、
認証・暗号化された
API 経由のみ


## p.37

AWS Nitro System
の基準を引き上げる


## p.38

ROM
ファームウェア
ブートローダー
OS
起動
VM
Apps
AWS Nitro System
の基準を引き上げる


## p.39

製造
組立
輸送
設置
電源接続
ROM
ファームウ
ェア
ブートロー
ダー
OS
AWS Nitro System
の基準を引き上げる
起動


## p.40

秘密鍵
チップに閉じ込められ、
外に出ることはない
公開鍵
製造記録の一部として
安全に管理
起動


## p.41

製造品質の検証
CPU の検証
ファームウェアの検証
全検証完了
Nitro Chip が
信頼の連鎖の起点


## p.42

Graviton4 へ
信頼の連鎖を拡張
CPU 間通信の暗号化を検証
Nitro Chip が
信頼の連鎖の起点
PCIe の整合性検証と
データ暗号化


## p.43

AWS Nitro System セキュリティ設計の
ホワイトペーパーをぜひご確認ください
「AWS でもお客様データに触れない」を、どう設計で担保しているかを解説
https://a.co/hYWhsH9
AWS Nitro System 主要3 要素の
セキュリティ設計詳細レビュー
AWS Nitro System の整合性保護、
テナント分離モデル、オペレーター
アクセスを排除した設計の詳細


## p.44

コンフィデンシャルコンピューティングとは
処理中のデータの保護における2 つの観点
①クラウドプロバイダ
からの保護
Nitro Sytem による
セキュリティ強化
②お客様組織内での保護
Nitro Enclaves
EC2 インスタンスアテステーション


## p.45

コンフィデンシャルコンピューティングとは
処理中のデータの保護における2 つの観点
復号
署名
トークン化
マスク
代表的な処理
未承認アクセスを一切排除
事前に承認・認証された
コードのみがデータを処理
②お客様組織内での保護
Nitro Enclaves
EC2 インスタンスアテステーション


## p.46

AWS Nitro Enclaves：機密コードの分離実行
②お客様組織内での保護
Nitro Enclaves
ユーザー
ライブラリ
アプリ
ケーション
OS
CPU とメモリの分離
セキュアな
ローカルチャネル
暗号化データ
平文
Amazon EC2 インスタンス
高度に機密性の高いデータをさらに保護・処理するための
分離されたコンピューティング環境を作成
信頼されたアプリケーション
トークン化
された番号
暗号化
された番号


## p.47

EC2 インスタンスアテステーション
②お客様組織内での保護
Nitro EC2 インスタンス
AWS Nitro Enclaves 
•
「動いているソフトウェアが改ざんなく起動している」を証明
•
EC2 インスタンス全体の信頼性を暗号学的に検証
•
Enclaves の制約を解消し、GPU/AI ワークロードでもアテステーションが可能に


## p.48

EC2 インスタンスアテステーションの
ユースケース：機密医療データの処理
患者
データ
患者
データ
医療機関A
医療機関B
Nitro EC2 インスタンス
機密情報処理・分析
AWS KMS
構成証明ドキュメント
暗号化されたデータキー


## p.49

②お客様組織内での保護
まとめ
EC2 インスタンス
アテステーション
インスタンス全体を証明
GPU/AI ワークロード全体を
追加料金なし
Nitro Enclaves
一部を隔離して機密処理
鍵・PII など小さな機密処理
追加料金なし


## p.50

まとめ・今日からできること


## p.51

• 機能を専用ハードウェアに分離し、
• 多様な選択肢の提供
• セキュリティの向上
• Nitro System のセキュリティDive Deep
• AWS もお客様のデータにアクセスできない
• お客様内での分離の仕組み
AWS Nitro System
セキュアな仮想環境を実現する信頼の起点
ホワイトペーパー
をご確認ください
https://a.co/hYWhsH9


## p.52

Exhibition Booth Information
展示ブースのご案内
A124
AWS コンピュートコアサービス
AWS Village①


## p.53

Exhibition Booth Information
展示ブースのご案内
A125
生成AI を支えるインフラ技術
AWS Village①


## p.54

Ask the Speaker
こちらのRoom 後方の外側にございます、
「Ask the Speaker」カウンターまでお越しください
杉山遼子
アマゾンウェブサービスジャパン合同会社
Room


## p.55

本セッションのアンケートへ
ご協力をお願いします
Please give us your feedback
Thank you!
CMP336
