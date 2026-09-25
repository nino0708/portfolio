---
title: "特許調査工数 50 %減も！オムロン R&D が 内製する『知財 AI エージェント』の裏側 －検索精度 UP &リードタイム短縮のノウハウ－"
category: "事例セッション"
session_id: "AIM234"
pages: 37
topics: ["生成AI/エージェント"]
services: ["AWS CloudFormation", "AWS CloudTrail", "AWS Config", "AWS Control Tower", "AWS IAM", "AWS Lambda", "Amazon Bedrock", "Amazon CloudWatch", "Amazon EC2", "Amazon OpenSearch", "Amazon S3", "Amazon SNS", "Amazon VPC"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/事例セッション/特許調査工数 50 %減も！オムロン R&D が 内製する『知財 AI エージェント』の裏側 －検索精度 UP &リードタイム短縮のノウハウ－.pdf"
---
# 特許調査工数 50 %減も！オムロン R&D が 内製する『知財 AI エージェント』の裏側 －検索精度 UP &リードタイム短縮のノウハウ－


## p.1

AIM234
特許調査工数50 %減も！オムロンR&D が
内製する『知財AI エージェント』の裏側
－検索精度UP &リードタイム短縮のノウハウ－
津田学
オムロン株式会社
部長


## p.2

(C) 2026 OMRON Corporation
特許調査工数50 %減も！
オムロンR&D が内製する『知財AI エージェント』の裏側
－検索精度UP &リードタイム短縮のノウハウ－
AWS Summit Japan 2026
オムロン株式会社ストラテジックR&D本部
デジタルソリューションセンタデジタルプラットフォーム部部長
津田学


## p.3

2
(C) 2026 OMRON Corporation
✓AI ネイティブ時代、AI エージェントは研究開発プロセスを劇的
に変え、工数を激減させる
→知財AI エージェントの事例紹介
✓AI エージェントの活用拡大には、セキュアなクラウド基盤が必須
→AI 基盤“RDinX”の事例紹介
本日お伝えしたいこと


## p.4

3
(C) 2026 OMRON Corporation
オムロンの事業領域
制御機器・FA システム事業を中心にオムロンユニークなポートフォリオを形成
研究開発部門は、これら事業の先端技術開発を担っている


## p.5

4
(C) 2026 OMRON Corporation
新事業・新技術を開発するうえで、特許調査は必要不可欠
研究開発で考案する発明に関する調査はエンジニア自身が行うことが多い
発明考案のプロセス
1. 発明創出
2. 先行技術調査
3. 発明説明書作成
技
術
動
向
分
析
技
術
課
題
の
発
見
解
決
手
段
の
考
案
母
集
団
作
成
特
許
検
索
ス
ク
リ
ー
ニ
ン
グ
先
行
技
術
文
献
の
特
定
発
明
説
明
書
記
入
ブ
ラ
ッ
シ
ュ
ア
ッ
プ
知
財
部
門
と
打
ち
合
わ
せ


## p.6

5
(C) 2026 OMRON Corporation
先行技術調査も、発明説明書作成も
知財のプロではないエンジニアが「発明のポイント」を理解することが難しく、時間がかかる
発明考案プロセスの課題
先行技術調査の課題
この特許の
発明のポイントって
何だ？
エンジニア
先行技術文献
（数百件～数千件）
発明説明書作成の課題
発明説明書
対比
エンジニア
先行技術文献を
読むだけで大変
まして、発明のポイントの
違いを説明するなん
て、、、


## p.7

6
(C) 2026 OMRON Corporation
特許の専門知識を持たないエンジニアでも
先行技術文献の調査や発明説明書作成を簡単にできるようになった
「発明のポイント」の理解を効率化
先行技術調査
AI で対話を行うシステムに関する
先行技術文献を調査したい
発明説明書作成
●検索した特許の発明のポイントを自然言語で
わかりやすく解説。対話型の質問もできる
●分析結果のレポートを作成
ユーザ
知財AI
エージェント
仕様書などのドキュメントを入力
ユーザ
知財AI
エージェント
エンジニア
先行特許と発明のポイント
がすぐにわかる！
●発明のポイントを自動生成
●先行技術の特定と特許性の検討をサポート
●発明説明書を自動生成
エンジニア
発明説明書を
らくらく作成！


## p.8

7
(C) 2026 OMRON Corporation
社外商用DB ではデータの取得に制約があるし、コストもかかる。また、自社で独自の機能を実装することが出来ない。
解決策として、特許庁から全特許データを取得し、社内で独自システムを自社開発。
オムロンの独自システムとして知財AI エージェントを内製
特許庁
社外DB
データ取得・
アップデート
商用ツール
Amazon OpenSearch Service
API
Web アプリ(Python/JS)
Amazon S3
バックエンド
フロントエンド
Amazon EC2
生成AI
AI・ビッグデータ分析
AWS Cloud
Amazon VPC: RDinX
ユーザー
Amazon Bedrock


## p.9

8
(C) 2026 OMRON Corporation
実際の知財AI エージェントの画面：特許調査
知財AI エージェントの画面
例）「AI」を検索
約1,000 件の公開特許がヒット
AI が1 件ごとに特許概要を解説
疑問点をAI に質問
（LLM とは？）
AI が解説
外国出願特許も
検索可能


## p.10

9
(C) 2026 OMRON Corporation
実際の知財AI エージェントの画面：特許調査
知財AI エージェントの画面
例）「AI」を検索
約1,000 件の公開特許がヒット
AI が1 件ごとに特許概要を解説
疑問点をAI に質問
（LLM とは？）
AI が解説


## p.11

10
(C) 2026 OMRON Corporation
実際の知財AI エージェントの画面：特許調査
例）「AI」を検索
約1,000 件の公開特許がヒット
AI が1 件ごとに特許概要を解説
疑問点をAI に質問
（LLM とは？）
AI が解説
知財AI エージェントの画面


## p.12

11
(C) 2026 OMRON Corporation
実際の知財AI エージェントの画面：特許調査
知財AI エージェントの画面
例）「AI」を検索
約1,000 件の公開特許がヒット
AI が1 件ごとに特許概要を解説
疑問点をAI に質問
（LLM とは？）
AI が解説


## p.13

12
(C) 2026 OMRON Corporation
実際の知財AI エージェントの画面：特許調査
例）「AI」を検索
約1,000 件の公開特許がヒット
AI が1 件ごとに特許概要を解説
疑問点をAI に質問
（LLM とは？）
AI が解説
知財AI エージェントの画面


## p.14

13
(C) 2026 OMRON Corporation
実際の知財AI エージェントの画面：特許調査
例）「AI」を検索
約1,000 件の公開特許がヒット
AI が1 件ごとに特許概要を解説
疑問点をAI に質問
（LLM とは？）
AI が解説
知財AI エージェントの画面


## p.15

14
(C) 2026 OMRON Corporation
実際の知財AI エージェントの画面：特許調査
例）「AI」を検索
約1,000 件の公開特許がヒット
AI が1 件ごとに特許概要を解説
疑問点をAI に質問
（LLM とは？）
AI が解説
知財AI エージェントの画面
モデル選択が可能


## p.16

15
(C) 2026 OMRON Corporation
実際の知財AI エージェントの画面：特許分析
出願人✕年次ヒートマップ分析
競合企業間技術類似度調査
競合ベンチマーク分析まとめ
知財AI エージェントの画面


## p.17

16
(C) 2026 OMRON Corporation
実際の知財AI エージェントの画面：特許分析
出願人✕年次ヒートマップ分析
競合企業間技術類似度調査
競合ベンチマーク分析まとめ
知財AI エージェントの画面


## p.18

17
(C) 2026 OMRON Corporation
実際の知財AI エージェントの画面：特許分析
出願人✕年次ヒートマップ分析
競合企業間技術類似度調査
競合ベンチマーク分析まとめ
知財AI エージェントの画面
※ LLMが出力した内容の例示であり、オムロンの見解ではありません。


## p.19

18
(C) 2026 OMRON Corporation
実際の知財AI エージェントの画面：発明説明書
技術文書などの入力
公知例調査の結果出力
発明説明書の出力
知財AI エージェントの画面
仕様書や設計書などの
ドキュメントを
ドラッグ＆ドロップ


## p.20

19
(C) 2026 OMRON Corporation
実際の知財AI エージェントの画面：発明説明書
技術文書などの入力
公知例調査の結果出力
発明説明書の出力
知財AI エージェントの画面
発明のポイントを抽出し
検索クエリを自然文で
生成
類似度の高い公知
例をランク付けして
表示


## p.21

20
(C) 2026 OMRON Corporation
実際の知財AI エージェントの画面：発明説明書
技術文書などの入力
公知例調査の結果出力
発明説明書の出力
知財AI エージェントの画面


## p.22

21
(C) 2026 OMRON Corporation
人は人が能力を発揮すべき発明創出に注力
先行技術調査や発明説明書などの事務作業は知財AI エージェントを活用することで、作業効率を大幅にアップ
知財AI エージェントの導入効果
人が時間をかけて創出
知財AI エージェント
50 %以上*短縮！
1. 発明創出
2. 先行技術調査
3. 発明説明書作成
技
術
動
向
分
析
技
術
課
題
の
発
見
解
決
手
段
の
考
案
母
集
団
作
成
特
許
検
索
ス
ク
リ
ー
ニ
ン
グ
先
行
技
術
文
献
の
特
定
発
明
説
明
書
記
入
ブ
ラ
ッ
シ
ュ
ア
ッ
プ
知
財
部
門
と
打
ち
合
わ
せ
*：オムロンR&D のエンジニアに対するアンケート結果（2026 年5 月実施）


## p.23

22
(C) 2026 OMRON Corporation
✓AI ネイティブ時代、AI エージェントは研究開発プロセスを劇的に
変え、工数を激減させる
→AI ネイティブ：
様々な業務プロセスの工数を激減するAI エージェントが多産
✓AI エージェントの活用拡大には、セキュアなクラウド基盤が必須
本日のまとめ①


## p.24

23
(C) 2026 OMRON Corporation
そのAI エージェント、
すぐに社内展開できますか？
セキュリテイ設計
コスト最適化


## p.25

24
(C) 2026 OMRON Corporation
情報漏えいやコストのことを考えると、エンジニアが個別に基盤構築を実行するのはリスクが高い
研究開発における生成AI 活用時のリスク
セキュリティ設計の課題
コスト最適化の課題
特許アイデアや未公開特許情報は重要機密情報
①生成AI の利便性からクラウドを使うのが理想だ
が、
セキュリティ設計には専門知識が必要
②社内公開するためにはユーザ認証が必須だが、
アプリ個別に構築すると効率が悪い
エンジニアはアプリ製作は得意だが、
インスタンスの運用管理は必ずしも得意ではない
①必要以上に高額なインスタンスを使ってしまう
②必要以上にインスタンスを稼働させてしまう


## p.26

25
(C) 2026 OMRON Corporation
そのAI エージェント、
すぐに社内展開できますか？
セキュリテイ設計
コスト最適化


## p.27

26
(C) 2026 OMRON Corporation
ローカルの開発環境をインターネット上のAWS に拡張して新たに作ること。設定を1 つ間違うと情報漏えいにつながる
ローカルネットワークと同等のセキュリティ設計をAWS 上に実装しなければならない
研究開発におけるクラウド活用、それは開発ロケをサイバー空間に引っ越すということ
オムロンR&D
(ローカル環境)
✕✕社EC サイト
オムロンRDinX
○○銀行サーバ
…
インターネット
AWS Cloud


## p.28

27
(C) 2026 OMRON Corporation
オムロン情報セキュリティルールをもとにセキュリティを設計し、AWS の設定項目に変換
セキュリティ設定はAWS のマネージドサービス”AWS Control Tower”で実現
情報セキュリティルールのAWS 設定項目への落とし込み
ControlTower（ガバナンス）
1
Alarm_${AccountId}_OutboundEndpoint_vpc-prod-rdportal_rslvr-out-a1a3e70fc07d4cd1b_Route53_EndpointHealthyENICount
1
[AWS-GR_LOG_GROUP_POLICY] AWS Control Tower によって設定された Amazon CloudWatch Logs ロググループの変更を許可しない
2
Alarm_${AccountId}_OutboundEndpoint_vpc-prod-rdportal_rslvr-out-a1a3e70fc07d4cd1b_Route53_OutboundQueryVolume
2
[AWS-GR_CLOUDWATCH_EVENTS_CHANGE_PROHIBITED] AWS Control Tower によって設定された Amazon CloudWatch の変更を許可しない
3
Alarm_${AccountId}_OutboundEndpoint_ai-eval_tabata_rslvr-out-e25dd4c294ee472cb_Route53_EndpointHealthyENICount
3
[AWS-GR_SNS_CHANGE_PROHIBITED] AWS Control Tower によって設定された Amazon SNS への変更を不許可にします
4
Alarm_${AccountId}_OutboundEndpoint_ai-eval_tabata_rslvr-out-e25dd4c294ee472cb_Route53_OutboundQueryVolume
4
[AWS-GR_SNS_SUBSCRIPTION_CHANGE_PROHIBITED] AWS Control Tower によって設定された Amazon SNS のサブスクリプションへの変更を不許可にします
5
Alarm_${AccountId}_rdinx-portal.wonder.jp-omron.com_ACM_DaysToExpiry_90
5
[AWS-GR_CLOUDTRAIL_CHANGE_PROHIBITED] CloudTrail への設定変更を不許可にします
6
Alarm_${AccountId}_rdinx-portal.wonder.jp-omron.com_ACM_DaysToExpiry_30
6
[AWS-GR_CLOUDTRAIL_CLOUDWATCH_LOGS_ENABLED] CloudTrail イベントと CloudWatch logs を統合する
7
Alarm_${AccountId}_rdinx-portal-stg.wonder.jp-omron.com_ACM_DaysToExpiry_90
7
[AWS-GR_CLOUDTRAIL_ENABLED] 利用可能なすべてのリージョンで CloudTrail を有効にする
8
Alarm_${AccountId}_rdinx-portal-stg.wonder.jp-omron.com_ACM_DaysToExpiry_30
8
[AWS-GR_CLOUDTRAIL_VALIDATION_ENABLED] CloudTrail ログファイルの整合性検証を有効にする
9
Alarm_${AccountId}_rdinx-portal-dev.wonder.jp-omron.com_ACM_DaysToExpiry_90
9
[AWS-GR_CONFIG_AGGREGATION_AUTHORIZATION_POLICY] AWS Control Tower によって作成された AWS Config アグリゲーション認可の削除を許可しない
10
Alarm_${AccountId}_rdinx-portal-dev.wonder.jp-omron.com_ACM_DaysToExpiry_30
10
[AWS-GR_CONFIG_AGGREGATION_CHANGE_PROHIBITED] AWS Control Tower で AWS Config リソースに付けたタグの変更を許可しない
11
Alarm_${AccountId}_app/alb-prod-rdportal/51b66bea7ad3d68c_ALB_ActiveConnectionCount
11
[AWS-GR_CONFIG_CHANGE_PROHIBITED] AWS Config への設定変更を不許可にします
12
Alarm_${AccountId}_app/alb-prod-rdportal/51b66bea7ad3d68c_ALB_HTTPCode_4XX_Error_Rate
12
[AWS-GR_CONFIG_ENABLED] 利用可能なすべてのリージョンで AWS Config を有効にする
13
Alarm_${AccountId}_app/alb-prod-rdportal/51b66bea7ad3d68c_ALB_HTTPCode_5XX_Error_Rate
13
[AWS-GR_CONFIG_RULE_CHANGE_PROHIBITED] AWS Control Tower によって設定された AWS Config ルールへの変更を不許可にします
14
Alarm_${AccountId}_ecs-service-prod-rdportal_ECS_CPUUtilization
14
[AWS-GR_IAM_ROLE_CHANGE_PROHIBITED] AWS Control Tower と AWS CloudFormation によって設定された AWS IAM ロールの変更を許可しない
15
Alarm_${AccountId}_ecs-service-prod-rdportal_ECS_MemoryUtilization
15
[AWS-GR_LAMBDA_CHANGE_PROHIBITED] AWS Control Tower によって設定された AWS Lambda 関数の変更を許可しない
16
Alarm_${AccountId}_EFS_prod-test-tabata_fs-0799e68fba1c3131f_fs-04a9da23ba218e2ea_EFS_TimesinceLastSync
16
[AWS-GR_REGION_DENY] リクエストされた AWS リージョンに基づいて AWS へのアクセスを拒否する
17
Alarm_${AccountId}_EFS_prod-test-tabata_fs-0799e68fba1c3131f_EFS_PercentIOLimit
17
ControlTower_DefaultRule_CHECK_FOR_S3_PUBLIC_WRITE
18
Alarm_${AccountId}_EFS_prod-test-tabata_fs-0799e68fba1c3131f_EFS_TotalIOBytes
18
ControlTower_CustomRule_CHECK_FOR_IAM_PASSWORD_POLICY
19
Alarm_${AccountId}_EFS_prod-test-tabata_fs-0799e68fba1c3131f_EFS_StorageBytes
19
ControlTower_DefaultRule_EBS_SNAPSHOT_PUBLIC_RESTORABLE_CHECK
20
Alarm_${AccountId}_EFS_ai-eval_fs-0684d1b7272fd5abb_fs-01602eeb866a9303a_EFS_TimesinceLastSync
20
ControlTower_DefaultRule_CHECK_FOR_ENCRYPTED_VOLUMES
21
Alarm_${AccountId}_EFS_ai-eval_fs-0684d1b7272fd5abb_EFS_PercentIOLimit
21
ControlTower_CustomRule_CHECK_FOR_DB_BACK-UP_PLAN
22
Alarm_${AccountId}_EFS_ai-eval_fs-0684d1b7272fd5abb_EFS_TotalIOBytes
22
ControlTower_DefaultRule_CHECK_FOR_S3_PUBLIC_ACCESS_BLOCK
23
Alarm_${AccountId}_EFS_ai-eval_fs-0684d1b7272fd5abb_EFS_StorageBytes
23
ControlTower_DefaultRule_CHECK_FOR_RESTRICTED_COMMON_PORTS_POLICY
24
Alarm_${AccountId}_mem2-account-dashboard-S3_Storage_Lens_AllRequests
24
ControlTower_DefaultRule_CHECK_FOR_RESTRICTED_SSH_POLICY
25
Alarm_${AccountId}_Backup_NumberOfBackupJobsFailed
25
ControlTower_DefaultRule_CHECK_FOR_ROOT_MFA
26
Alarm_${AccountId}_dxcon-osaka-1_dxcon-ffr44h88_DirectConnect_ConnectionState
26
ControlTower_DefaultRule_EC2_INSTANCE_NO_PUBLIC_IP
27
Alarm_${AccountId}_dxcon-osaka-1_dxcon-ffr44h88_DirectConnect_ConnectionBpsEgress
27
ControlTower_CustomRule_CHECK_FOR_ACM_CERTIFICATE_EXPIRATION
28
Alarm_${AccountId}_dxcon-osaka-1_dxcon-ffr44h88_DirectConnect_ConnectionBpsIngress
28
ControlTower_DefaultRule_SUBNET_AUTO_ASSIGN_PUBLIC_IP_DISABLED
29
Alarm_${AccountId}_cxd22216177_dxcon-ffr44h88_dxvif-ffk8e6uv_DirectConnect_VirtualInterfaceBpsEgress
29
ControlTower_DefaultRule_LAMBDA_FUNCTION_PUBLIC_ACCESS_PROHIBITED
30
Alarm_${AccountId}_cxd22216177_dxcon-ffr44h88_dxvif-ffk8e6uv_DirectConnect_VirtualInterfaceBpsIngress
30
ControlTower_DefaultRule_CHECK_FOR_S3_PUBLIC_READ
31
Alarm_${AccountId}_dxcon-osaka-2_dxcon-fgydgf8y_DirectConnect_ConnectionState
31
ControlTower_DefaultRule_LAMBDA_FUNCTION_PUBLIC_ACCESS_PROHIBITED
32
Alarm_${AccountId}_dxcon-osaka-2_dxcon-fgydgf8y_DirectConnect_ConnectionBpsEgress
32
ControlTower_DefaultRule_CHECK_FOR_S3_PUBLIC_ACCESS_BLOCK
33
Alarm_${AccountId}_dxcon-osaka-2_dxcon-fgydgf8y_DirectConnect_ConnectionBpsIngress
33
ControlTower_DefaultRule_CHECK_FOR_ROOT_MFA
34
Alarm_${AccountId}_cxd22216177_dxcon-fgydgf8y_dxvif-fgvue221_DirectConnect_VirtualInterfaceBpsEgress
34
ControlTower_DefaultRule_EBS_SNAPSHOT_PUBLIC_RESTORABLE_CHECK
35
Alarm_${AccountId}_cxd22216177_dxcon-fgydgf8y_dxvif-fgvue221_DirectConnect_VirtualInterfaceBpsIngress
35
ControlTower_CustomRule_CHECK_FOR_IAM_PASSWORD_POLICY
36
Alarm_${AccountId}_tgw-shared_tgw-08b1823f8460d27db_TransitGateway_BytesDropCountBlackhole
37
Alarm_${AccountId}_tgw-shared_tgw-08b1823f8460d27db_TransitGateway_BytesDropCountNoRoute
GuardDuty（セキュリティ）
38
Alarm_${AccountId}_tgw-shared_tgw-08b1823f8460d27db_TransitGateway_BytesIn
39
Alarm_${AccountId}_tgw-shared_tgw-08b1823f8460d27db_TransitGateway_BytesOut
1
CredentialAccess:IAMUser/AnomalousBehavior
40
Alarm_${AccountId}_tgw-attach-vpc-prod-rdportal_tgw-attach-020b779180df528e0_TransitGatewayAttachment_BytesDropCountBlackhole
2
DefenseEvasion:IAMUser/AnomalousBehavior
41
Alarm_${AccountId}_tgw-attach-vpc-prod-rdportal_tgw-attach-020b779180df528e0_TransitGatewayAttachment_BytesDropCountNoRoute
3
Discovery:IAMUser/AnomalousBehavior
42
Alarm_${AccountId}_tgw-attach-vpc-prod-rdportal_tgw-attach-020b779180df528e0_TransitGatewayAttachment_BytesIn
4
Exfiltration:IAMUser/AnomalousBehavior
43
Alarm_${AccountId}_tgw-attach-vpc-prod-rdportal_tgw-attach-020b779180df528e0_TransitGatewayAttachment_BytesOut
5
Impact:IAMUser/AnomalousBehavior
44
Alarm_${AccountId}_tgw-attach-vpc-itd-share_tgw-attach-03a59f958e367c42c_TransitGatewayAttachment_BytesDropCountBlackhole
6
InitialAccess:IAMUser/AnomalousBehavior
45
Alarm_${AccountId}_tgw-attach-vpc-itd-share_tgw-attach-03a59f958e367c42c_TransitGatewayAttachment_BytesDropCountNoRoute
7
PenTest:IAMUser/KaliLinux
46
Alarm_${AccountId}_tgw-attach-vpc-itd-share_tgw-attach-03a59f958e367c42c_TransitGatewayAttachment_BytesIn
8
PenTest:IAMUser/ParrotLinux
47
Alarm_${AccountId}_tgw-attach-vpc-itd-share_tgw-attach-03a59f958e367c42c_TransitGatewayAttachment_BytesOut
9
PenTest:IAMUser/PentooLinux
48
Alarm_${AccountId}_tgw-attach-vpc-next-eval_tgw-attach-03aec433fed8cde31_TransitGatewayAttachment_BytesDropCountBlackhole
10
Persistence:IAMUser/AnomalousBehavior
49
Alarm_${AccountId}_tgw-attach-vpc-next-eval_tgw-attach-03aec433fed8cde31_TransitGatewayAttachment_BytesDropCountNoRoute
11
Policy:IAMUser/RootCredentialUsage
50
Alarm_${AccountId}_tgw-attach-vpc-next-eval_tgw-attach-03aec433fed8cde31_TransitGatewayAttachment_BytesIn
12
PrivilegeEscalation:IAMUser/AnomalousBehavior
51
Alarm_${AccountId}_tgw-attach-vpc-next-eval_tgw-attach-03aec433fed8cde31_TransitGatewayAttachment_BytesOut
13
Recon:IAMUser/MaliciousIPCaller
52
Alarm_${AccountId}_tgw-attach-vpc-user-rdportal_tgw-attach-05a9291dd59f73f43_TransitGatewayAttachment_BytesDropCountBlackhole
14
Recon:IAMUser/MaliciousIPCaller.Custom
53
Alarm_${AccountId}_tgw-attach-vpc-user-rdportal_tgw-attach-05a9291dd59f73f43_TransitGatewayAttachment_BytesDropCountNoRoute
15
Recon:IAMUser/TorIPCaller
54
Alarm_${AccountId}_tgw-attach-vpc-user-rdportal_tgw-attach-05a9291dd59f73f43_TransitGatewayAttachment_BytesIn
16
Stealth:IAMUser/CloudTrailLoggingDisabled
55
Alarm_${AccountId}_tgw-attach-vpc-user-rdportal_tgw-attach-05a9291dd59f73f43_TransitGatewayAttachment_BytesOut
17
Stealth:IAMUser/PasswordPolicyChange
56
Alarm_${AccountId}_tgw-attach-vpc-shared_tgw-attach-0672bad0ca431f136_TransitGatewayAttachment_BytesDropCountBlackhole
18
UnauthorizedAccess:IAMUser/ConsoleLoginSuccess.B
57
Alarm_${AccountId}_tgw-attach-vpc-shared_tgw-attach-0672bad0ca431f136_TransitGatewayAttachment_BytesDropCountNoRoute
19
UnauthorizedAccess:IAMUser/InstanceCredentialExfiltration.InsideAWS
58
Alarm_${AccountId}_tgw-attach-vpc-shared_tgw-attach-0672bad0ca431f136_TransitGatewayAttachment_BytesIn
20
UnauthorizedAccess:IAMUser/InstanceCredentialExfiltration.OutsideAWS
59
Alarm_${AccountId}_tgw-attach-vpc-shared_tgw-attach-0672bad0ca431f136_TransitGatewayAttachment_BytesOut
21
UnauthorizedAccess:IAMUser/MaliciousIPCaller
60
Alarm_${AccountId}_tgw-attach-ib-func01-ImageBuilder_tgw-attach-07102d7329d046ae4_TransitGatewayAttachment_BytesDropCountBlackhole
22
UnauthorizedAccess:IAMUser/MaliciousIPCaller.Custom
61
Alarm_${AccountId}_tgw-attach-ib-func01-ImageBuilder_tgw-attach-07102d7329d046ae4_TransitGatewayAttachment_BytesDropCountNoRoute
23
UnauthorizedAccess:IAMUser/TorIPCaller
62
Alarm_${AccountId}_tgw-attach-ib-func01-ImageBuilder_tgw-attach-07102d7329d046ae4_TransitGatewayAttachment_BytesIn
24
Backdoor:EC2/C&CActivity.B
63
Alarm_${AccountId}_tgw-attach-ib-func01-ImageBuilder_tgw-attach-07102d7329d046ae4_TransitGatewayAttachment_BytesOut
25
Backdoor:EC2/C&CActivity.B!DNS
64
Alarm_${AccountId}_tgw-attach-vpc-osk-web-system_tgw-attach-0abc1cf21b681a0c3_TransitGatewayAttachment_BytesDropCountBlackhole
26
Backdoor:EC2/DenialOfService.Dns
65
Alarm_${AccountId}_tgw-attach-vpc-osk-web-system_tgw-attach-0abc1cf21b681a0c3_TransitGatewayAttachment_BytesDropCountNoRoute
27
Backdoor:EC2/DenialOfService.Tcp
66
Alarm_${AccountId}_tgw-attach-vpc-osk-web-system_tgw-attach-0abc1cf21b681a0c3_TransitGatewayAttachment_BytesIn
28
Backdoor:EC2/DenialOfService.Udp
67
Alarm_${AccountId}_tgw-attach-vpc-osk-web-system_tgw-attach-0abc1cf21b681a0c3_TransitGatewayAttachment_BytesOut
29
Backdoor:EC2/DenialOfService.UdpOnTcpPorts
68
Alarm_${AccountId}_tgw-attach-robo-rdinx-test-vpn-client_tgw-attach-0c8b4730d3e6e590b_TransitGatewayAttachment_BytesDropCountBlackhole
30
Backdoor:EC2/DenialOfService.UnusualProtocol
69
Alarm_${AccountId}_tgw-attach-robo-rdinx-test-vpn-client_tgw-attach-0c8b4730d3e6e590b_TransitGatewayAttachment_BytesDropCountNoRoute
31
Backdoor:EC2/Spambot
70
Alarm_${AccountId}_tgw-attach-robo-rdinx-test-vpn-client_tgw-attach-0c8b4730d3e6e590b_TransitGatewayAttachment_BytesIn
32
Behavior:EC2/NetworkPortUnusual
71
Alarm_${AccountId}_tgw-attach-robo-rdinx-test-vpn-client_tgw-attach-0c8b4730d3e6e590b_TransitGatewayAttachment_BytesOut
33
Behavior:EC2/TrafficVolumeUnusual
72
Alarm_${AccountId}_tgw-attach-vpc-ai-eval_tgw-attach-0d9482fc2962ef5da_TransitGatewayAttachment_BytesDropCountBlackhole
34
CryptoCurrency:EC2/BitcoinTool.B
73
Alarm_${AccountId}_tgw-attach-vpc-ai-eval_tgw-attach-0d9482fc2962ef5da_TransitGatewayAttachment_BytesDropCountNoRoute
35
CryptoCurrency:EC2/BitcoinTool.B!DNS
74
Alarm_${AccountId}_tgw-attach-vpc-ai-eval_tgw-attach-0d9482fc2962ef5da_TransitGatewayAttachment_BytesIn
36
Impact:EC2/AbusedDomainRequest.Reputation
75
Alarm_${AccountId}_tgw-attach-vpc-ai-eval_tgw-attach-0d9482fc2962ef5da_TransitGatewayAttachment_BytesOut
37
Impact:EC2/BitcoinDomainRequest.Reputation
76
Alarm_${AccountId}_tgw-attach-vpc-dev-cae_tgw-attach-0f89345fe1fe63145_TransitGatewayAttachment_BytesDropCountBlackhole
38
Impact:EC2/MaliciousDomainRequest.Reputation
77
Alarm_${AccountId}_tgw-attach-vpc-dev-cae_tgw-attach-0f89345fe1fe63145_TransitGatewayAttachment_BytesDropCountNoRoute
39
Impact:EC2/PortSweep
78
Alarm_${AccountId}_tgw-attach-vpc-dev-cae_tgw-attach-0f89345fe1fe63145_TransitGatewayAttachment_BytesIn
40
Impact:EC2/SuspiciousDomainRequest.Reputation
79
Alarm_${AccountId}_tgw-attach-vpc-dev-cae_tgw-attach-0f89345fe1fe63145_TransitGatewayAttachment_BytesOut
41
Impact:EC2/WinRMBruteForce
80
Alarm_${AccountId}_tgw-attach-robo-rdinx-vpn-server_tgw-attach-00fe374efb9fdb86f1_TransitGatewayAttachment_BytesDropCountBlackhole
42
Recon:EC2/PortProbeEMRUnprotectedPort
81
Alarm_${AccountId}_tgw-attach-robo-rdinx-vpn-server_tgw-attach-0fe374efb9fdb86f1_TransitGatewayAttachment_BytesDropCountNoRoute
43
Recon:EC2/PortProbeUnprotectedPort
82
Alarm_${AccountId}_tgw-attach-robo-rdinx-vpn-server_tgw-attach-0fe374efb9fdb86f1_TransitGatewayAttachment_BytesIn
44
Recon:EC2/Portscan
83
Alarm_${AccountId}_tgw-attach-robo-rdinx-vpn-server_tgw-attach-0fe374efb9fdb86f1_TransitGatewayAttachment_BytesOut
45
Trojan:EC2/BlackholeTraffic
84
Alarm_${AccountId}_tgw-attach-ib-base-ImageBuilder_tgw-attach-0ff63dde1ff5107c1_TransitGatewayAttachment_BytesDropCountBlackhole
46
Trojan:EC2/BlackholeTraffic!DNS
85
Alarm_${AccountId}_tgw-attach-ib-base-ImageBuilder_tgw-attach-0ff63dde1ff5107c1_TransitGatewayAttachment_BytesDropCountNoRoute
47
Trojan:EC2/DGADomainRequest.B
86
Alarm_${AccountId}_tgw-attach-ib-base-ImageBuilder_tgw-attach-0ff63dde1ff5107c1_TransitGatewayAttachment_BytesIn
48
Trojan:EC2/DGADomainRequest.C!DNS
87
Alarm_${AccountId}_tgw-attach-ib-base-ImageBuilder_tgw-attach-0ff63dde1ff5107c1_TransitGatewayAttachment_BytesOut
49
Trojan:EC2/DNSDataExfiltration
88
Alarm_${AccountId}_tgw-attach-dxgw_tgw-attach-0378f2cf6f85208e6_TransitGatewayAttachment_BytesDropCountBlackhole
50
Trojan:EC2/DriveBySourceTraffic!DNS
89
Alarm_${AccountId}_tgw-attach-dxgw_tgw-attach-0378f2cf6f85208e6_TransitGatewayAttachment_BytesDropCountNoRoute
51
Trojan:EC2/DropPoint
90
Alarm_${AccountId}_tgw-attach-dxgw_tgw-attach-0378f2cf6f85208e6_TransitGatewayAttachment_BytesIn
52
Trojan:EC2/DropPoint!DNS
91
Alarm_${AccountId}_tgw-attach-dxgw_tgw-attach-0378f2cf6f85208e6_TransitGatewayAttachment_BytesOut
53
Trojan:EC2/PhishingDomainRequest!DNS
92
Alarm_${AccountId}_nlb-rdinx-proxy-v2_net/nlb-rdinx-proxy-v2/bcec165140851160_NLB_ActiveFlowCount
54
UnauthorizedAccess:EC2/MaliciousIPCaller.Custom
93
Alarm_${AccountId}_nlb-rdinx-proxy-v2_net/nlb-rdinx-proxy-v2/bcec165140851160_NLB_ClientTLSNegotiationErrorCount
55
UnauthorizedAccess:EC2/MetadataDNSRebind
94
Alarm_${AccountId}_nlb-rdinx-proxy-v2_net/nlb-rdinx-proxy-v2/bcec165140851160_NLB_PortAllocationErrorCount
56
UnauthorizedAccess:EC2/RDPBruteForce
95
Alarm_${AccountId}_target-rdinx-proxy-v2_targetgroup/target-rdinx-proxy-v2/ec787e596a35d119_NLB_HealthyHostCount
57
UnauthorizedAccess:EC2/SSHBruteForce
96
Alarm_${AccountId}_nat-shared_nat-0d2bdd5a641a6c502_NATGateway_BytesInFromDestination
58
UnauthorizedAccess:EC2/TorClient
97
Alarm_${AccountId}_nat-shared_nat-0d2bdd5a641a6c502_NATGateway_BytesOutToDestination
59
UnauthorizedAccess:EC2/TorRelay
98
Alarm_${AccountId}_nat-shared_nat-0d2bdd5a641a6c502_NATGateway_ErrorPortAllocation
99
Alarm_${AccountId}_nat-shared_nat-0d2bdd5a641a6c502_NATGateway_PacketsDropCount
CloudWatch Alarm（システム稼働監視）
100
Alarm_${AccountId}_ec2-rdinx-proxy-v2_i-0a53169089f400d7e_EC2_CPUUtilization
101
Alarm_${AccountId}_ec2-rdinx-proxy-v2_i-0a53169089f400d7e_EC2_NetworkIn
102
Alarm_${AccountId}_ec2-rdinx-proxy-v2_i-0a53169089f400d7e_EC2_NetworkOut
103
Alarm_${AccountId}_ec2-rdinx-proxy-v2_i-0a53169089f400d7e_EC2_EBSReadOps
104
Alarm_${AccountId}_ec2-rdinx-proxy-v2_i-0a53169089f400d7e_EC2_EBSWriteOps
105
Alarm_${AccountId}_ec2-rdinx-proxy-v2_i-0a53169089f400d7e_EC2_StatusCheckFailed
106
Alarm_${AccountId}_ec2-rdinx-proxy-v2_EC2_ResourceCount_Standard/OnDemand
107
Alarm_${AccountId}_ec2-rdinx-proxy-v2_EC2_ResourceCount_G/OnDemand
108
Alarm_${AccountId}_ec2-rdinx-proxy-v2_i-0a53169089f400d7e_EC2_disk_used_percent
109
Alarm_${AccountId}_ec2-rdinx-proxy-v2_i-0a53169089f400d7e_EC2_mem_used_percent
110
Alarm_${AccountId}_OutboundEndpoint_OmronLan_rslvr-out-e69b01d23742477da_Route53_EndpointHealthyENICount
111
Alarm_${AccountId}_OutboundEndpoint_OmronLan_rslvr-out-e69b01d23742477da_Route53_OutboundQueryVolume
オムロン
情報セキュリティルール
オムロングループは、情報システムの
利用者活動、例外処理およびセキュリ
ティ事象を記録したログを取得する。ま
た、将来の調査やアクセス制御の監視
を補うために、予め設定した期間保持
する。
情報システムオーナー部門は、最小
権限の原則および職務の分離の原則
に基づき、ユーザを区別し、業務遂行
に必要な最小限の権限とアクセス権
のみ与えること。
セキュリティ設計
[AWS-GR_CLOUDTRAIL_ENABLED] 
利用可能なすべてのリージョンで
AWS CloudTrail を有効にする
✕：設定項目なし！！
→自前で実装
AWS
セキュリティ設定項目
AWS Control Tower
OGR
オムロン
情報セキュリティ
ルール


## p.29

28
(C) 2026 OMRON Corporation
グループIT 関連会社とともに、オムロンR&D の開発プロセスと情報セキュリティルールに即した要件を定義
実装にあたっては、AWS 様からセキュリティサービスの活用についてサポートを受ける
AWS 様、オムロングループIT 関連会社と連携し、独自の生成AI 基盤「RDinX」を構築
オムロン
IT 関連会社
要件定義
実装
オムロンR&D
企画構想
AWS 様
AWS サービスの
技術提供
3 者連携による
AWS セキュリティサービスの活用
AWS 上に
独自のセキュリティ設計を構築
RDinX


## p.30

29
(C) 2026 OMRON Corporation
「作ったエージェントをRDinX に登録すると、ユーザ認証が可能になり簡単にエージェントを共有できる」という触れ込みで
RDinX にエージェントを集約。相互通信時の監視もRDinX 上で完結
今後の展開：認証認可基盤とともにAI ゲートウェイの構築を目指す
…
RDinX
知財
AI エージェント
〇〇
エージェント
〇〇
AI システム
…
相互
通信
相互
通信
相互利用
作成したエージェントを
RDinX ポータルに登録
↓
相互利用のための
ユーザ認証が可能に
↓
相互利用・相互通信の
プロンプト監視も可能に


## p.31

30
(C) 2026 OMRON Corporation
そのAI エージェント、
すぐに社内展開できますか？
セキュリテイ設計
コスト最適化


## p.32

31
(C) 2026 OMRON Corporation
データ容量の増加に合わせてコストコントロールできるようサーバを選択
社員の稼働時間だけサーバを動かす「ON/OFF 制御」
コスト最適化の肝は「動的制御」
データ容量増加に合わせたサーバ選択
ON/OFF 制御
サーバレス優位
非稼働時間＝約55 %
月
火
水
木
金
土
日
インスタン
ス型優位
1 GB
10 GB
100 GB
1000 GB
コスト
インスタンス型
サーバレス
社員の稼働時間はON
平日夜間、休日などの非稼働時間はOFF
0:00
24:00
12:00


## p.33

32
(C) 2026 OMRON Corporation
AI ネイティブ時代、AI エージェントは研究開発プロセスを劇的に
変え、工数を激減させる
→AI ネイティブ：
様々な業務プロセスの工数を激減するAI エージェントが多産
AI エージェントの活用拡大には、セキュアなクラウド基盤が必須
→クラウド基盤：
AI ネイティブを支える強固なセキュリティ基盤に積極的な投資
が必要
本日のまとめ②


## p.34

33
(C) 2026 OMRON Corporation
「研究開発DX」を、日本の文化に。
Contact us
津田
学（TSUDA Manabu）
オムロン株式会社ストラテジックR&D本部
デジタルソリューションセンタ
デジタルプラットフォーム部長
Mail:           Manabu.Tsuda@omron.com
Linked In:
https://www.linkedin.com/in/ManabuTsuda/


## p.35

34
(C) 2026 OMRON Corporation


## p.36

Exhibition Booth Information
展示ブースのご案内
A020
オムロン株式会社
AWS for Industries Zone①


## p.37

本セッションのアンケートへ
ご協力をお願いします
Please give us your feedback
Thank you!
AIM234
