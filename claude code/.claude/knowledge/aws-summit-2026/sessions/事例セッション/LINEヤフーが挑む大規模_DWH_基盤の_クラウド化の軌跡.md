---
title: "LINEヤフーが挑む⼤規模 DWH 基盤の クラウド化の軌跡"
category: "事例セッション"
session_id: "ANT325"
pages: 31
topics: ["データ分析/基盤"]
services: ["AWS CloudFormation", "AWS Direct Connect", "AWS Transit Gateway", "Amazon CloudWatch", "Amazon Q", "Amazon Redshift", "Amazon S3", "Claude", "MCP"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/事例セッション/LINEヤフーが挑む⼤規模 DWH 基盤の クラウド化の軌跡.pdf"
---
# LINEヤフーが挑む⼤規模 DWH 基盤の クラウド化の軌跡


## p.1

ANT325
LINEヤフーが挑む⼤規模DWH 基盤の
クラウド化の軌跡
⽥中章宏
LINEヤフー株式会社


## p.2

© LY Corporation
LINEヤフー株式会社
Data CBU
データPFインフラユニット
データプロセッシングPFディビジョン
⽥中章宏(Tanaka Akihiro)
LINEヤフーが挑む
⼤規模DWH 基盤のクラウド化の軌跡
オンプレミスからAmazon Redshift へ
そしてAI-Ready なプラットフォームへ


## p.3

© LY Corporation
Agenda
01
イントロダクション
02
次世代DWH 選定(PoC)
03
移⾏プロジェクトの軌跡
04
クラウド化による技術的恩恵
05
AI-Ready なデータ基盤へ
3
On-Premise
Amazon
Redshift
AI-Ready
Future


## p.4

© LY Corporation
01 イントロダクション
4


## p.5

© LY Corporation
5
Speaker Profile
© LY Corporation
01 イントロダクション
⽥中章宏(Tanaka Akihiro)
移⾏プロジェクトPM
AI 活⽤PJ メンバー
好きなAWS サービス
Amazon Redshift
Amazon S3 Tables
趣味
低⼭登⼭、観劇
国内IT ベンダーで
サーバ、ストレージ、NW、DB、
仮想化などインフラエンジニア
外資DWH ベンダーで
データエンジニア／PM
（⼤⼿EC 企業常駐）
ヤフーへDWH エンジニアとして
⼊社
※2023.10 LINEヤフーへ統合
経歴
13+ 
years
5+ 
years
4+ 
years


## p.6

© LY Corporation
6
Our Mission
© LY Corporation
01 イントロダクション
Mission
Vision
データを通じた
ユーザーベネフィット最⼤化と
事業価値最⼤化
Data for All


## p.7

© LY Corporation
7
LINEヤフーが扱う「⼤規模データ」
01 イントロダクション
オンプレミス
1.1+EB
オンプレミス
3+PB
Amazon Redshift へ移⾏
約3,000 +
ユーザー数
約7.25 億+
クエリ／⽇


## p.8

© LY Corporation
02 次世代DWH 選定(PoC)
8


## p.9

© LY Corporation
9
PoC 経緯＆スケジュール
2024
2023
2022
2021
PoC クライテリア策定
PoC 実施
2021/7/1
PoC 検討開始
2023/FH
次世代DWH 決定
PoC 経緯
02 次世代DWH 選定(PoC)
当時の部⾨CTO からの指摘。最先端のよりよい技術の採⽤を⽬的として
「複数プロダクトを精緻に⽐較・評価した上で次世代DWH基盤を検討すること」
⇒PoC クライテリア（技術検証項⽬）を策定・実施し、またTCO 評価も実施する


## p.10

© LY Corporation
10
PoC クライテリア(技術検証項⽬)
#
要件
項⽬数
満点
Redshift
分類
⼤項⽬
点数
要件充⾜
1
機能要件
リソース制御機能
6
12
11
○
2
クエリチューニング機能
4
8
4
△
3
クエリ機能
6
12
11
△
4
ユーザ向け管理機能
2
4
1
△
5
コネクティビティ
6
12
12
○
6
⾮機能要件
性能要件
単体性能要件
広告
60
86
65
△
共通
41
62
48
△
コマース
28
22
16
△
7
同時実⾏性能要件
広告
1
2
1
△
共通
1
2
2
○
コマース
1
2
0
△
8
拡張性要件
伸縮性
6
12
12
○
9
可⽤性要件
稼働率
4
8
8
○
10
バックアップ/リカバリ
3
6
6
○
11
運⽤・保守性要件
監視・モニタリング
2
10
10
○
12
セキュリティ要件
アクセス制御
3
6
6
○
13
認証・認可
3
6
6
○
14
暗号化
2
4
4
○
15
監査
2
4
4
○
合計
59
124
96
02 次世代DWH 選定(PoC)
機能要件や⼀般的な⾮機能要件
では差が出ないので、性能要件
での検証に注⼒


## p.11

© LY Corporation
11
PoC 性能検証内容
02 次世代DWH 選定(PoC)
PoC 検証項⽬
単体性能検証
同時実⾏性能検証
⽬的
重いクエリがレスポンス要件を満たすか
同⼀条件での複数クエリの総処理時間を測定
対象クエリ
実⾏時間/CPU 時間/IO 量等が上位のクエリを抽出
単体性能検証で使⽤した全クエリ
検証⽅法
クエリを単体で実⾏して応答時間を計測
クエリを⼀⻫に実⾏し、完了するまでの時間を⽐較
前提
1つのクラスタに複数サービスが同居
Service A
Service B
Service C
Service D
Batch
マルチテナント環境
通常ベンチマーク(TPC-DS など)
 → 今回は不採⽤
キーポイント
クラスタA
Q1
Q2
Q3
クラスタB
Q4
Q5
Q6
クラスタC
Q7
Q8
Q9
クラスタ別に
代表クエリ群を選定
検証条件
移⾏元
旧DWH
移⾏先
次期DWH
必要データを
すべて移⾏
標準ベンチマークではなく、“クラスタ別の代表クエリ群”で実態に近い性能を検証


## p.12

© LY Corporation
12
PoC 性能検証準備（クエリ選定）
02 次世代DWH 選定(PoC)
クラスタ
クエリ
タイプ
Complex
Moderate
Simple
合計
Very
Heavy
Middle
Light
Very
Heavy
Heavy
Middle
Light
Very
Heavy
Middle
Light
共通
Select
5
5
5
5
5
5
5
5
5
5
5
5
91
Insert
1
1
1
5
5
5
Update
1
Merge Into
2
5
Delete
5
広告
Select
5
4
2
5
4
1
1
5
5
5
119
Insert
1
5
5
4
3
1
5
5
2
3
5
5
Update
1
3
1
5
Merge Into
4
5
5
Delete
2
2
5
5
コマース
Select
5
5
5
5
5
5
5
5
5
5
5
5
188
Insert
5
5
4
3
5
5
5
5
5
5
5
5
Update
4
5
Merge Into
3
1
5
5
3
5
5
5
5
5
Delete
5
5
5
5
約400+クエリ
各クラスタの代表的なクエリの中で、
●各種クエリタイプ(SEL-INS-UPD-MERGE-DEL)
●テーブル結合数や関数の複雑さ
●利⽤データ量
で分類して、検証クエリとして選定


## p.13

© LY Corporation
13
PoC 性能検証結果
02 次世代DWH 選定(PoC)
SELECT の単体性能や同時実⾏性能検証については優位性があったが、⼤量⾏
のINSERT や特定の述語を含むクエリは極端に遅くなる傾向もあった
⇒クエリ書換で対処する⽅針とした（書換コストとしてTCO へ加算）
単体性能検証結果
※⼀部
同時実⾏性能検証結果
※⼀部


## p.14

© LY Corporation
14
PoC 結果
PoC クライテリア評価結果にTCO 評価を加え、
総合的な判断でAmazon Redshift 採⽤に決定
✅
✅
02 次世代DWH選定(PoC)


## p.15

© LY Corporation
03 移⾏プロジェクトの軌跡
15


## p.16

© LY Corporation
16
移⾏スケジュール＆体制
03 移⾏プロジェクトの軌跡
2026
2025
2024
2023
移⾏プロジェクト(約１年半)
2026/3/31
移⾏プロジェクト完了
2024/FH
移⾏プロジェクト開始
LINEヤフー 
DWH チーム
AWS Professional Services
（有償コンサルティング部⾨）
協⼒会社様
Amazon
Redshift
Reserved
Instance
増強
増強
増強
PoC


## p.17

© LY Corporation
17
アーキテクチャ
03 移⾏プロジェクトの軌跡
VPC for VPC endpoint  (CIDR: 10.xx.xx.0/24)
AWS Cloud
AWS Direct Connect 
Gateway
VPC for Redshift.  (CIDR: 172.xx.0.0/18)
Attachment
Availability Zone 1
Private 
subnet
A クラスター（Multi-AZ）
B クラスター（Multi-AZ）
C クラスター（Multi-AZ）
Availability Zone 2
Private 
subnet
Availability Zone 3
Private 
subnet
Multi-AZ Deploy のため 3 AZ 構成
Availability Zone 1
Private 
subnet
Availability Zone 2
Private 
subnet
Availability Zone 3
Private 
subnet
Redshift-managed
VPC endpoint
← LINEヤフー
 Data Center
Amazon S3 VPC Endpoint
(Interface型)
Amazon S3 VPC Endpoint
(Gateway型)
オンプレからアップロード
Redshift にロード
AWS STS VPC endpoint
(Interface型)
Primary
Primary
Primary
Secondary
Secondary
Secondary
全社のIP レンジ制約を考慮しつつ、アドレス空間を確保するためRedshift-managed VPCE の活⽤
AWS Transit Gateway
AWS Direct Connect


## p.18

© LY Corporation
18
クラスターのサイズ& data sharing構成
data sharing
data sharing
Amazon Redshift Managed Storage
(RMS)
Amazon Redshift Cluster
Cluster A
ra3.16xlarge × 10+ ノード（Multi-AZ）
Cluster B
ra3.16xlarge × 10+ ノード（Multi-AZ）
Cluster C
ra3.16xlarge × 10+ ノード（Multi-AZ）
合計: 約60+ ノード
03 移⾏プロジェクトの軌跡
⾮常に便利な機能だが、現時点では、クラスタ多段での参照は不可だったり、
権限管理は煩雑だったりという注意点もある


## p.19

© LY Corporation
19
同時実⾏性能検証のシナリオ
移⾏中のトラブル（性能課題）
03 移⾏プロジェクトの軌跡
•
社内⼤⼝ユーザーを抱える部⾨からPoC 時の性能検証では実運⽤に耐えられるか不安と指摘
•
旧DWH の負荷の⾼い時間帯のワークロードを擬似的に再現して検証したい
クエリ投⼊するタイミングを指定


## p.20

© LY Corporation
20
同時実⾏性能検証のクライテリア
移⾏中のトラブル（性能課題）
03 移⾏プロジェクトの軌跡
許容できる条件
•
95 %のクエリの完了時間が旧DWH（38 分）以下であること
•
クエリの平均応答時間が旧DWH（95,247 秒）以下であること
当初想定のノード数、構成では性能を満たせず
特にユーザーレスポンスを重視
クエリ完了時間
パーセンタイル
グラフ


## p.21

© LY Corporation
21
同時実⾏性能検証結果
移⾏中のトラブル（性能課題）
03 移⾏プロジェクトの軌跡
カテゴリ
指標
6/23
7/1①
7/3②
7/8①
7/8②
7/25①
7/25②
結果
合否
NG
NG
NG
OK
NG
NG
OK
総実⾏時間
（分）
107
145
65
48
55
74
66
95%完了時間
（⽬標: 38分）
83
100
37
35
36
39
38
クエリ平均応答時間
（対⽬標⽐）
-
-
188%
69%
117%
115%
80%
構成/設定
総ノード数
23
24
(12×2)
24
(12×2)
46
(23×2)
24
(12×2)
28
(14×2)
30
(15×2)
Multi-AZ
-
Yes
Yes
Yes
Yes
Yes
Yes
Concurrency
scaling
-
-
1
-
2
-
-
WLM
⼿動
(30+5+5)
⼿動
(20+4+4)
⾃動
⾃動
⾃動
⾃動
⾃動
最終構成
Multi-AZ + ⾃動WLM で
⼤幅に性能向上
0
20
40
60
80
100
120
140
160
6/23
7/1①
7/3②
7/8①
7/8②
7/25①
7/25②
平均応答時間（対⽬標⽐）
● 対⽬標⽐● ⽬標 100%
0%
50%
100%
150%
200%
6/23
7/1①
7/3②
7/8①
7/8②
7/25①
7/25②
実⾏時間の推移（分）
● 95%完了時間● ⽬標 38分
Elastic/Classic resize 
で短期間で構成変更して
の検証が実施可能


## p.22

© LY Corporation
22
Multi-AZ
移⾏中のトラブル（性能課題）
03 移⾏プロジェクトの軌跡
Primary とSecondary はActive-Active、Secondary クラスタはPrimary の負荷状況に応じて使⽤される。
BI
バッチ
ワークロード
Primary
Multi-AZ
Secondary
負荷状況に応じて Secondary にクエリを割り当て
（Primary のキューにクエリが溜まるまでは Secondary は使われない）
BI
バッチ
ワークロード
Single-AZ
ただし、現時点では、Secondary クラスタへルーティングできるクエリのタイプには制約がある
Virtual private cloud (VPC)
Virtual private cloud (VPC)
Availability Zone 1
Availability Zone 2
Availability Zone 3
Availability Zone 1
Availability Zone 2
Availability Zone 3


## p.23

© LY Corporation
04 クラウド化による技術的恩恵
23


## p.24

© LY Corporation
24
バッチ処理性能の⽐較検証レポート
Migration Impact
04クラウド化による技術的恩恵
過去1週間の DAG タスク実⾏時間を集計し、全体平均と主要タスクタイプ別の差を⽐較。
26 %短縮Redshift が
全体平均で⾼速
全体平均の⽐較
Redshift
83.2
旧DWH
112.4
主要タスクタイプ別の⽐較
■ Redshift   ■ 旧DWH
※バー⻑は各カテゴリ内で相対⽐較
値
差分
取得 / get
520.0
968.2
46 %短縮
集計 / summary
101.4
121.7
17 %短縮
Load / Merge
66.2
84.3
21 %短縮
更新 / update
52.0
41.2
唯⼀逆転


## p.25

© LY Corporation
25
その他のクラウド化による技術的恩恵
Migration Impact
04クラウド化による技術的恩恵
現場のリアルな声
クラウド（AWS）への移⾏は、単なるインフラの置き換えではなく、
構築スピード感向上 と 物理的制約・運⽤負荷の軽減 をもたらした。
01
構築スピード感と柔軟性の向上
• 要件別の専⽤クラスタを素早く追加
可能（AWS CloudFormation 活⽤）
• 既存クラスタ間の連携もシームレス
（data sharing）
• Amazon Redshift Serverless も導
⼊検討
02
物理メンテの苦労から解放
（NoOps 化）
• DC への機器メンテ出張がゼロ
• 複雑なネットワーク設計から解放
• ⻑時間停⽌の定期メンテが不要
• 物理故障アラート／緊急⼊館が激減
03
AWS エコシステム、イノベー
ションで可能性が拡⼤
• Zero-ETL など最新アーキテクチャ
が選択肢に
• 次世代データ活⽤の検討範囲が⼤き
く拡⼤
• Amazon Redshift RG instance へ
の期待


## p.26

© LY Corporation
05 AI-Ready なデータ基盤へ
26


## p.27

© LY Corporation
27
AI Ready 化へのロードマップ
05 AI-Ready なデータ基盤へ


## p.28

© LY Corporation
28
⾃然⾔語でのDWH 操作と障害対応の⾃動化を、MCP で安全に段階導⼊する
MCP サーバー活⽤ユースケースと実装イメージ
05 AI-Ready なデータ基盤へ
1 DWH への⾃然⾔語アクセス
例: 「先⽉の売上を抽出して共有フォルダに保存」
⾃然⾔語
指⽰
→
SQL ⽣成
+実⾏
→
CSV 化
→
保存
AI が DWH 読取 → 加⼯ → 保存 のツール連鎖を⾃動判断
SQL 不要で、Amazon Redshift からの抽出を Amazon S3 / Drive / ローカルへ保存
2 障害予兆検知と⾃動処置
例: 監視アラートを AI が受信し、初期対応を代⾏
アラート→
メトリクス
取得
→
ログ
抽出
→
処置案
/ 実⾏
過去の類似ログ照合と⼀次切り分けを数秒で実施
Amazon CloudWatch で負荷・エラー率を確認し、再起動・クエリ
キャンセル等は承認後に実⾏
3 実装構成イメージ
AI クライアント → MCP サーバー群 → 対象システム
→
→
AI クライアント
Claude Desktop
社内 AI チャット UI
Amazon Quick
MCP サーバー群
DWH
インフラ操作
ログ・ファイル
対象システム
Amazon Redshift
Amazon CloudWatch
Amazon S3 / Drive / Local
redshift-mcp-server
filesystem / s3
AWS SDK / GCP SDK


## p.29

© LY Corporation


## p.30

© LY Corporation
Thank you !


## p.31

本セッションのアンケートへ
ご協⼒をお願いします
Please give us your feedback
Thank you!
ANT325
