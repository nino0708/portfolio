---
title: "AI で加速するデジタルレジリエンス - Splunk が導くデータ活用の未来"
category: "パートナーセッション"
sponsor: "Splunk"
session_id: "PRT122"
pages: 33
topics: ["データ分析/基盤"]
services: ["AWS Security Hub", "Amazon Bedrock", "Amazon CloudWatch", "Amazon EventBridge", "Amazon GuardDuty", "Amazon S3", "Claude", "MCP"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/パートナーセッション/AI で加速するデジタルレジリエンス - Splunk が導くデータ活用の未来 (sponsored by Splunk).pdf"
---
# AI で加速するデジタルレジリエンス - Splunk が導くデータ活用の未来


## p.1

PRT122-S
AI で加速するデジタルレジリエンス: 
Splunk が導くデータ活用の未来
(sponsored by Splunk)
内田大樹
Splunk Services Japan合同会社
技術統括本部エンタープライズ技術本部
/ Senior Solutions Engineer


## p.2

AI で加速するデジタルレジリエンス
Splunk が導くデータ活⽤の未来
Splunk Services Japan合同会社
Senior Solutions Engineer
内⽥⼤樹
2026年6⽉25⽇


## p.3

© 2026 Cisco and/or its aﬃliates. All rights reserved.
© 2026 Cisco and/or its aﬃliates. All rights reserved.
Forward-looking 
statements
This presentation may contain forward-looking statements regarding future events, plans or the expected 
ﬁnancial performance of our company, including our expectations regarding our products, technology, strategy, 
customers, markets, acquisitions and investments. These statements reﬂect management’s current expectations, 
estimates and assumptions based on the information currently available to use. These forward-looking 
statements are not guarantees of future performance and involve signiﬁcant risks, uncertainties and other factors 
that may cause our actual results, performance or achievements to be materially diﬀerent form results, 
performance or achievements expressed or implied by the forward-looking statements contained in this 
presentation. For additional information about factors that could cause actual results to diﬀer materially from 
those described in the forward-looking statements made in this presentation, please refer to Cisco’s periodic 
reports its other ﬁlings with the SEC, including the risk factors identiﬁed in Cisco’s most recent quarterly report on 
Form 10-Q and annual report on Form 10-K, copies of which may be obtained by visiting the Cisco Investor 
Relations website at investor.cisco.com or the SEC’s website at www.sec.gov. Any projections in this presentation 
are based on information currently available to Cisco, which is subject to change. The forward-looking statements 
made in this presentation are made as of the time and date of this presentation. If reviewed after the initial 
presentation, even if made available by us, on our website or otherwise, it may not contain current or accurate 
information. We disclaim any obligation to update or revise any forward-looking statement based on new 
information, future events or otherwise, except as required by applicable law. 
In addition, any information about our roadmap outlines or our general product direction is subject to change at 
any time without notice. It is for information purposes only and shall not be incorporated into any contract or 
other commitment. We undertake no obligation either to develop the features or functionalities described, in 
alpha or beta or in preview (used interchangeably), or to include any such feature or functionality in a future 
release.
Copyright © 2026 Cisco and/or its aﬃliates. All rights reserved. Cisco, Splunk and the Cisco and Splunk logos are 
trademarks or registered trademarks of Cisco and/or its aﬃliates in the U.S. and other countries. To view a list of 
Cisco trademarks, go to www.cisco.com/go/trademarks. Third-party trademarks mentioned in this presentation 
are the property of their respective owners. The use of the word partner does not imply a partnership relationship 
between Cisco and any other company.


## p.4

© 2026 Cisco and/or its aﬃliates. All rights reserved.
© 2026 Cisco and/or its aﬃliates. All rights reserved.
⾃⼰紹介
内⽥⼤樹
Hiroki Uchida
Splunk Services Japan合同会社
Senior Solutions Engineer
2024‒ Splunk Services Japan / Senior Solutions Engineer
2019‒2024   Amazon Web Services Japan / Solutions Architect
趣味:  写真撮影/  お酒( 主にビール)  /  ボードゲーム
@nikuyoshi
過去の登壇資料


## p.5

© 2026 Cisco and/or its aﬃliates. All rights reserved.
© 2026 Cisco and/or its aﬃliates. All rights reserved.
いきなりですが質問です！！Splunk、ご存知ですか？
1. 使っている( 業務で活⽤中)
2. 触ったことはある( PoCや検証含む)
3. 名前は聞いたことがある
4. 初めて聞いた
皆さまのXのポスト、お待ちしてます！
#AWSSummit
#AWSSummitJapan
#Splunk


## p.6

© 2026 Cisco and/or its aﬃliates. All rights reserved.
© 2026 Cisco and/or its aﬃliates. All rights reserved.
本資料の想定聴講者
1. 幅広く情報収集されている⽅
Splunk の名前は知っているが、Cisco 統合後の姿が分からず、AWS 環境でどう活⽤できるかを知りたい
2. AI 活⽤に踏み出したいセキュリティ運⽤者
AWS のセキュリティログ監視は運⽤できているが、AI による検知の⾃動化に踏み出せていない、
セキュリティ運⽤担当者
3. 散らばるデータに困っているデータエンジニア‧アーキテクト
社内のAI 活⽤を進めたいが、ログ‧DB‧SaaS‧Excel に散らばるデータをどう統合するかで⽌まっている、
データエンジニア/ ソリューションアーキテクト
4. 内製の限界を感じ始めたアーキテクト
AWS で内製してきたデータ基盤に限界を感じ始め、AI 活⽤の規模拡⼤に向けて商⽤プラットフォームを
検討し始めた、AWS ソリューションアーキテクト
こんな⽅に、特に持ち帰っていただきたい内容です


## p.7

© 2026 Cisco and/or its aﬃliates. All rights reserved.
© 2026 Cisco and/or its aﬃliates. All rights reserved.
本資料の範囲
本⽇お伝えすること
1. AI 時代、避けては通れない喫緊の課題
2. Cisco / Splunk が考える Data Fabric 構想、将来のデータ活⽤の姿
3. AWS 環境で何が具体的に⾒えるか- 事例とデモ
本⽇お伝えしないこと
1.
Splunk 各製品の機能網羅とチューニングTips ( 公式ドキュメント/ ブースで )
2.
SPL や設定の詳細解説 ( 別セッション/ ブースで )
3.
あらゆる業界‧規模に当てはまる唯⼀の正解の提⽰ ( お客様ごとに最適解は異なります )


## p.8

© 2026 Cisco and/or its aﬃliates. All rights reserved.
© 2026 Cisco and/or its aﬃliates. All rights reserved.
Better Together ‒ AWSと歩んだ14年
AWS Partner Network 参加から、Agentic AI / Amazon Bedrock 連携まで
2012‒2014
AWS Partner Network 参加
Splunk Cloud on AWS GA
AWS Data and Analytics
コンピテンシー取得
2015‒2017
Splunk Cloud が
AWS 9 リージョン展開
Splunk Add-on for AWS 
リリース
AWS Marketplace で
Splunk Cloud 提供開始
2017‒2020
AWS Marketplace 
プライベートオファー
ローンチパートナー
AWS と3 年間の
戦略協業契約(SCA) 締結
2021‒2022
Splunk Global Alliance
AWS Partner of the Year
受賞
115 件のマイグレーション/
253 件のAWS Marketplace 
受注
2023‒2024
AWS PrivateLink / 
AppFabric /
Amazon Security Lake 
サポート
Amazon Data Firehose
初のPartner Destination
AWS Partner Awards
4部⾨受賞、
Migration コンピテンシー
2025‒2026
Splunk Federated Search
for Amazon S3
Agentic Marketplace 
ローンチ
Amazon Bedrock との
AI ツールキット連携
AWS Security Hub Extended 
でSplunk 対応
SAP Logserv 統合
AWS Frontier Agent 
Integration


## p.9

© 2026 Cisco and/or its aﬃliates. All rights reserved.
© 2026 Cisco and/or its aﬃliates. All rights reserved.
アジェンダ
AI 時代、何が
⾒えていないのか
なぜCisco × Splunk 
でしか解けないのか
AWS の世界で、
それがどう動くのか
⽇本企業の喫緊課題
統合がもたらす価値
デモと事例


## p.10

© 2026 Cisco and/or its affiliates. All rights reserved.
複雑なIT環境、点在するデータ
⽌まらないインシデント
Edge
data centers
Mobile 
networks
Wireless
gateway
Cloud 
providers
BYOD
Enterprise 
Edge
Regional 
data centers
Local
ISP
Transport
Boston, MA
Mobile User
AWS/SaaS
Provider
Factory
Cameras & 
Sensors
Home 
Office
Enterprise HQ
Paris, France
Enterprise
Data Center
Branch
Office


## p.11

© 2026 Cisco and/or its aﬃliates. All rights reserved.
ü 能動的サイバー防御（ACD）
•
サイバー対処能⼒強化法および同整備法
•
サプライチェーンセキュリティ評価制度
ü 脆弱性対策（LotL、ランサムウェア）
ü Claude Mythos の影響
ü AIの利活⽤推進と安全性の確保
ü インシデントログ‧証跡と対応を⼀元管理
ü 監査‧経営報告の説明責任と継続的な対処
ü 脆弱性を横断的に検知、被害拡⼤を阻⽌
ü AIの利⽤状況を⼀元的に監視‧可視化
ü 誰が‧どのAIで‧どのデータを使ったか
を管理‧可視化できる体制整備
⾒えないリスクを⾒える安⼼へ
複雑化するIT環境をシンプルに統制
AIによる守りの負荷を低減、攻めの変⾰へ


## p.12

© 2026 Cisco and/or its aﬃliates. All rights reserved.
© 2026 Cisco and/or its aﬃliates. All rights reserved.


## p.13

© 2026 Cisco and/or its aﬃliates. All rights reserved.
l 現状の課題
 
⽇本企業の多くが、複雑なIT環境、部⾨やシステムごとに分断されたデータに
 
悩まされています。
l Cisco × Splunkにしかできないこと（ Ciscoが捉えて、Splunkが理解する ）
 
シスコ: 世界最⼤級のネットワーク可視性を持つ強靭な神経（つなぐ⼒）
 
Splunk: AIを最適に活⽤するクリーンデータを⽣み出す 頭脳（分析⼒）
l 未来の姿（ベネフィット）
 
⼈間とAIの共存により、膨⼤なデータを活⽤し、複雑な処理を⾼速で処理し、
 
競争⼒を維持し続けるための真のデジタルレジリエンスに貢献します。
 
© 2026 Cisco and/or its aﬃliates. All rights reserved.


## p.14

© 2026 Cisco and/or its aﬃliates. All rights reserved.
© 2026 Cisco and/or its aﬃliates. All rights reserved.
アジェンダ
AI 時代、何が
⾒えていないのか
なぜCisco × Splunk 
でしか解けないのか
AWS の世界で、
それがどう動くのか
⽇本企業の喫緊課題
統合がもたらす価値
デモと事例


## p.15

© 2026 Cisco and/or its aﬃliates. All rights reserved.
© 2026 Cisco and/or its aﬃliates. All rights reserved.
© 2026 SPLUNK LLC
AI 時代における最先端のデジタルレジリエンスプラクティスの実現
検索‧分析‧可視化
フェデレーション
AI 連携（MCP）
ネットワーク
ネットワーク
AI ワークロード
レガシーシステム
クラウドネイティブ
Detection
Engineering
Detection
UEBA
Triage
Investigation
SOAR
TI Curation
組み込みAI
Asset
Discovery
Domain-speciﬁc
AI Assistant
AI
Observability
Network
Observability
APM
Infrastructure
Monitoring
DEX
Management
Business
Insight
Log
Analysis
Application
Security
Federating Cisco Firewall Data
Isovalent + Splunk Integration
Cisco Talos Intelligence
AI Agent Monitoring
AppDynamics agent with OpenTelemetry
AI Defense Integration
Integration with ThousandEyes
Splunk Cloud - データプラットフォーム
Cisco AI Canvas
Amazon S3
Snowﬂake
Splunk コミュニティ
Splunkbase: App 2100以上
Cisco network data
•
Catalyst Center ISE
•
Catalyst SD-WAN
•
Meraki
•
ThousandEyes
•
UCS
•
Nexus, ACI
Cisco threat data
•
Secure Firewall
•
Meraki
•
Secure Network Analytics
•
Secure Access Umbrella
•
AI Defense
•
Talos
•
XDR
Splunk Security
Splunk Observability
Cisco Data Fabric
© 2026 Cisco and/or its aﬃliates. All rights reserved.


## p.16

© 2026 Cisco and/or its aﬃliates. All rights reserved.
© 2026 Cisco and/or its aﬃliates. All rights reserved.
全領域をつなぐ、新時代の
オペレーショナルインテリジェンス
Cisco Data Fabric
MCP Server
Splunk & Cisco AI 
Assistants + Agents
External Data Sources & 3rd Party
Data lakes 
(Multi-
vendor)
Security
Networking, 
Infrastructure, 
Applications 
(Multi-vendor)
Cisco
Splunk
Federation
Federation
Data 
Management
Data 
Management
Nexus 
Dashboard
Nexus 
Devices
Catalyst 
Center
Catalyst 
Devices
Device 
Manager
Devices
Domain 
controllers
Splunk & Cisco
アプリケーション
Customer & Partner 
Apps
3rd Party AI Apps 
(ChatGPT, Gemini,…)


## p.17

© 2026 Cisco and/or its aﬃliates. All rights reserved.
© 2026 Cisco and/or its aﬃliates. All rights reserved.
Splunk の特徴1/2 ‒ Schema on the ﬂy
データを取り込みやすく、取り込んだ後も定義がしやすい
オリジナル・データ
オリジナル・データ
離反率予測
⼀般的なデータ活⽤
アプリケーション
業務基盤監視
データ変換
レイヤー
データソース
レイヤー
アプリケーション
レイヤー
データ管理
レイヤー
故障調査
異常挙動検知
セキュリティ
標的型攻撃
対策
不正アクセス
分析
アプリ開発
ABテスト
評価
ビジネス分析
最適
ルート検索
配達⽣産性
分析
アクセス解析
オリジナル‧データ
⼀切の変換‧加⼯を施さず、そのままの形で⾼速取り込み
抽出
変換
ロード
荷物量
予測
NEW
構造化条件は
後から⾃由に定義
構造化条件
（スキーマ）


## p.18

© 2026 Cisco and/or its aﬃliates. All rights reserved.
© 2026 Cisco and/or its aﬃliates. All rights reserved.
Splunk の特徴2/2 ‒ 正規化、相関分析のしやすさ
過去の資料


## p.19

© 2026 Cisco and/or its aﬃliates. All rights reserved.
© 2026 Cisco and/or its aﬃliates. All rights reserved.
ひとつのMCPサーバーで、
すべてのSplunkの機能を、
あらゆるAIから使えるように。
•
過去24時間のアラートを教えて
( ⾃然⾔語の問い合わせ)
•
セキュリティインシデントを分析して
( 調査の⾃動化)
•
異常検知の結果から、影響範囲を特定して
( 複合分析)
集めたデータをAIが直接使える
Cisco Data Fabric
MCP
LLM / Agent


## p.20

© 2026 Cisco and/or its aﬃliates. All rights reserved.
© 2026 Cisco and/or its aﬃliates. All rights reserved.
アジェンダ
AI 時代、何が
⾒えていないのか
なぜCisco × Splunk 
でしか解けないのか
AWS の世界で、
それがどう動くのか
⽇本企業の喫緊課題
統合がもたらす価値
デモと事例


## p.21

© 2026 Cisco and/or its aﬃliates. All rights reserved.
© 2026 Cisco and/or its aﬃliates. All rights reserved.
20年以上、世界の
トップブランドが
信頼するデジタル
レジリエンスの基盤、


## p.22

© 2026 Cisco and/or its aﬃliates. All rights reserved.
© 2026 Cisco and/or its aﬃliates. All rights reserved.
これから実施するデモのアーキテクチャ
AWS Cloud (us-west-2)
ユーザ
ネットワーク機器
Mac mini  (Docker)
UF container
Stream container
Syslog (CEF)
NetFlow
送信(egress)
‧ネットワーク機器のSyslog (CEF) → UF container → Indexer
‧ネットワーク機器のNetFlow → Stream container → Indexer
Data Sources
Pipeline
Splunk Add-on
VPC Flow Logs
Amazon GuardDuty
AWS Security Hub
Amazon CloudWatch Logs
Amazon EventBridge
Amazon Simple 
Notiﬁcation 
Service (SNS)
Amazon Simple 
Queue Service 
(SQS)
Amazon EventBridge
Splunk Add-on for AWS
SQS-based
Indexer Cluster (3× m7i.xlarge / 3-AZ / RF=3, SF=2)
HEC / S2S
Search Head
m7i.xlarge · :8000 / :8089
Cluster Manager
m7i.large
S2S 9997 / TLS
HTTPS :8000
Customer DC / オンプレ(⾃宅)
Amazon Simple 
Notiﬁcation 
Service (SNS)
Amazon Simple 
Queue Service 
(SQS)


## p.23

© 2026 Cisco and/or its aﬃliates. All rights reserved.
© 2026 Cisco and/or its aﬃliates. All rights reserved.
デモ動画


## p.24

オブザーバビリティによる
デジタルレジリエンスの向上
アプリケーションの
問題検出にかかる
スピードが向上
本番環境におけコード
変更の成功率向上
イノベーションに
費やす時間の増加
オブザーバビリティ
ソリューションの
ROIが向上
SP.LINKS
ソフトバンク
NTTドコモ
© 2026 Cisco and/or its aﬃliates. All rights reserved.


## p.25

まとめ


## p.26

© 2026 Cisco and/or its aﬃliates. All rights reserved.
© 2026 Cisco and/or its aﬃliates. All rights reserved.
本⽇お伝えしたこと
1. データの中⼼が、AI 時代の
レジリエンスを決める
2. Cisco × Splunk だから、
集めたデータがAI から
直接使える
3. AWS でも、オンプレでも、
Splunk が⼀つの視点をつくる
Next Action 
1. AWS Marketplace からSplunk
Cloud を試す
2. Splunk Observability Cloudの
Free Tier を試す
3. Splunk ブースでデモを体験
4. Splunk ブースで個別相談
( セキュリティ、Observability、データ分析、
Ciscoとの統合等、お気軽にお⽴ち寄りください！)


## p.27

© 2026 Cisco and/or its aﬃliates. All rights reserved.
© 2026 Cisco and/or its aﬃliates. All rights reserved.
現在地
Splunk
ブース


## p.28

© 2026 Cisco and/or its aﬃliates. All rights reserved.
© 2026 Cisco and/or its aﬃliates. All rights reserved.
最後に、アンケート回答にご協⼒ください！！


## p.29

Thank you


## p.30

Appendix


## p.31

© 2026 Cisco and/or its aﬃliates. All rights reserved.
© 2026 Cisco and/or its aﬃliates. All rights reserved.
Splunk Observability Cloud ‒ Free Edition
キーポイント
•
14⽇のトライアルがFree Editionに
•
トライアルは廃⽌され、無期限のSplunk 
Observability Cloud Free Editionに
•
15ホストまでであれば全てのユーザーは無料で
Splunk O11y Cloudを機能制限なく無期限に利⽤
できるようになりました。
•
制約事項
•
15ホストまで
•
サポートはなし
•
30⽇間ログインしていないと無効になります
•
全機能が使えますがRegionによって使えない機能が
ありますのでご注意ください
Free Editionはこちらから
https://www.splunk.com/en_us/download/observability-
cloud-playground.html
アカウント作成やサインアップといった事前のコミットメントを⼀切必要とせず、全機能を即座に体験


## p.32

© 2026 Cisco and/or its aﬃliates. All rights reserved.
© 2026 Cisco and/or its aﬃliates. All rights reserved.
Splunk Observability Cloud - Playground
キーポイント
•
事前データが投⼊済み
検証環境にはあらかじめダミーのダッシュボードやメトリ
クス、トレース、ログなどの各種データが展開されていま
す。ユーザー⾃らエージェントの導⼊やデータソースの設定
を
⾏うことなく、実際のUI操作やトラブルシューティングの
流れを体験できます。
•
シームレスなFree Edition への移⾏
Playgroundで操作感を試し、そのまま本格的な検証や開発に
移⾏したい場合は、アプリ内から直接「Free Edition」へ
即座にサインアップが可能です。
ブログ記事はこちら
Playgroundはこちらから
https://www.splunk.com/en_us/download/observability-
cloud-playground.html
アカウント作成やサインアップといった事前のコミットメントを⼀切必要とせず、全機能を即座に体験


## p.33

本セッションのアンケートへ
ご協力をお願いします
Please give us your feedback
Thank you!
PRT122-S
