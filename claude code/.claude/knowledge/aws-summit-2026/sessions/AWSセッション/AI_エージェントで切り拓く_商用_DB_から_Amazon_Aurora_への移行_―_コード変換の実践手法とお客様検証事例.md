---
title: "AI エージェントで切り拓く 商⽤ DB から Amazon Aurora への移⾏ ― コード変換の実践⼿法とお客様検証事例"
category: "AWSセッション"
session_id: "DAT302"
pages: 54
topics: ["生成AI/エージェント"]
services: ["AWS DMS", "Amazon Aurora", "Amazon Bedrock", "Amazon EC2", "Amazon RDS", "Amazon S3", "Claude", "Kiro", "MCP", "Strands Agents"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/AWSセッション/AI エージェントで切り拓く 商⽤ DB から Amazon Aurora への移⾏ ― コード変換の実践⼿法とお客様検証事例.pdf"
---
# AI エージェントで切り拓く 商⽤ DB から Amazon Aurora への移⾏ ― コード変換の実践⼿法とお客様検証事例


## p.1

DAT302
AI エージェントで切り拓く
商⽤DB からAmazon Aurora への移⾏
 ― コード変換の実践⼿法とお客様検証事例
⻑久保武
アマゾンウェブサービスジャパン合同会社


## p.2

⻑久保 武
Database Specialist Solutions Architect
エンタープライズのお客様を中⼼に、データベースを
 AWS 上に実装する際の技術⽀援をしています
好きな AWS サービス
Amazon Aurora
Amazon RDS
⾃⼰紹介


## p.3

• 対象
• 商⽤データベースから PostgreSQL への移⾏に関⼼があるが、
移⾏時のコード変換に課題を感じている⽅
• ⽣成 AI をどう活⽤して変換すれば良いか、具体的なイメージが
湧かない⽅
• セッションを通じて
• ⽣成AI を活⽤した SQL コードの変換アプローチをご理解いただく
• お客様の検証事例を踏まえて、次のアクションをご検討いただく
本セッションのゴール
3


## p.4

• データベース移⾏の背景と課題
• ⽣成AI を活⽤したコード変換アプローチ
• お客様検証事例
• AWS の移⾏⽀援サービス
• まとめ
Agenda


## p.5

データベース移⾏の背景と課題


## p.6

リレーショナルデータベース
⾼セキュア
⾼可⽤性と永続性
⾼スケール
容易な管理
Amazon Aurora
MySQL
PostgreSQL
MariaDB
SQL Server
Oracle
ハードウェア、OS、
DB ソフトウェアを
容易にデプロイ、保守可能
監視ツール内蔵
数クリックでコンピュートと
ストレージをスケール可能
アプリケーションの
ダウンタイムは最⼩限
マルチ AZ
レプリケーション
⾃動フェイルオーバー
⾃動バックアップ
スナップショット
保存時と通信時の暗号化
業界コンプライアンスと
保証プログラム準拠
IBM Db2
Amazon RDS
MySQL
PostgreSQL
DSQL
6


## p.7

なぜデータベースを移⾏するのか
• ライセンス費⽤、サポート費⽤の圧縮
• ワークロード毎に最適なDB を採⽤し、さらなるコスト最適化
• レガシーアプリを刷新、マネージドサービスの活⽤で運⽤負荷を軽減
• 将来のデータ活⽤を⾒据えたアーキテクチャを採⽤
• 特定リージョンでなく、複数のリージョンでの可⽤性
• ⽌められないシステムから、⽌まっても素早く復旧可能なシステムへ
Innovation
を⽀える
• 常に最新のパッチレベルを維持し、不正アクセスや悪意のある攻撃から回避
• ベスプラに基づく権限設計で、属⼈的で曖昧な管理から脱却
• ビジネスニーズに応じたスモールスタート
• ビジネスの成⻑に追随するスケーラビリティ
• 突発的な需要に追随する迅速なスケーリング
ビジネス成⻑
への追随
コスト削減
⾼い可⽤性
セキュリティへの
対応
⼈材不⾜への対応
7


## p.8

DB移⾏における代表的なブロッカー
技術
• コードの互換性、
固有機能の利⽤
• 性能要件
• テスト⼯数
セキュリティ/
コンプライアンス
• 個⼈情報や
機密情報の扱い
• 業界固有の
規制要件
• セキュリティ基準
への適合
• 監査要件への対応
運⽤/組織
• バックアップ/
リカバリの⽅式変更
• 監視/運⽤ツールの
変更
• 障害対応⽅法の
変更
• クラウドのスキル
• 他組織の抵抗
コスト
• ライセンス体系の
変更
• 技術的難易度から
派⽣する移⾏プロ
ジェクトの⻑期化
• 従量課⾦による
予測困難なコスト
への対応
8


## p.9

DB移⾏における代表的なブロッカー
技術
• コードの互換性、
固有機能の利⽤
• 性能要件
• テスト⼯数
セキュリティ/
コンプライアンス
• 個⼈情報や
機密情報の扱い
• 業界固有の
規制要件
• セキュリティ基準
への適合
• 監査要件への対応
運⽤/組織
• バックアップ/
リカバリの⽅式変更
• 監視/運⽤ツールの
変更
• 障害対応⽅法の
変更
• クラウドのスキル
• 他組織の抵抗
コスト
• ライセンス体系の
変更
• 技術的難易度から
派⽣する移⾏プロ
ジェクトの⻑期化
• 従量課⾦による
予測困難なコスト
への対応
9


## p.10

⽣成AI を活⽤したコード変換アプローチ


## p.11

コード変換におけるサービスの位置付け
AWS DMS
Kiro / Strands Agents
⾃動⼀括変換
⾃動⼀括変換
対話での変換
アプリケーション SQL
スキーマオブジェクト
(Table, Index,…)
コードオブジェクト
（Procedure, Function, …）
（動的 SQL 含む）
DDL
Oracle
SQL
Oracle
11
* AWS DMS : AWS Database Migration Service (DMS) 
DDL
PostgreSQL
SQL
PostgreSQL


## p.12

コード変換におけるサービスの位置付け
AWS DMS
⾃動⼀括変換
DDL
Oracle
SQL
Oracle
• 従来からのルールベースによる変換でコスト削減
• ⼀部可能なものは⽣成AI を使った⾃動変換
12
* AWS DMS : AWS Database Migration Service (DMS) 
DDL
PostgreSQL
SQL
PostgreSQL
アプリケーション SQL
スキーマオブジェクト
(Table, Index,…)
コードオブジェクト
（Procedure, Function, …）
（動的 SQL 含む）
Kiro / Strands Agents
⾃動⼀括変換
対話での変換


## p.13

DMS による移⾏難易度の評価・レポート作成
13


## p.14

DMS による移⾏難易度の評価・レポート作成
14
エンジン変更の難易度の⽐較評価
コード変換に関わる⼯数を算出


## p.15

DMS による移⾏難易度の評価・レポート作成
15
オブジェクトタイプ毎に変換難易度を確認
エンジン変更の難易度の⽐較評価
コード変換に関わる⼯数を算出


## p.16

DMS による DB オブジェクトの⾃動変換
16


## p.17

コード変換におけるサービスの位置付け
AWS DMS
⾃動⼀括変換
DDL
Oracle
SQL
Oracle
17
DDL
PostgreSQL
SQL
PostgreSQL
アプリケーション SQL
スキーマオブジェクト
(Table, Index,…)
コードオブジェクト
（Procedure, Function, …）
（動的 SQL 含む）
Kiro / Strands Agents
⾃動⼀括変換
対話での変換


## p.18

コード変換におけるサービスの位置付け
AWS DMS
⾃動⼀括変換
DDL
Oracle
SQL
Oracle
18
DDL
PostgreSQL
SQL
PostgreSQL
アプリケーション SQL
スキーマオブジェクト
(Table, Index,…)
コードオブジェクト
（Procedure, Function, …）
（動的 SQL 含む）
• AI エージェントによる変換
• コーディング規約や社内ノウハウでカスタマイズ
Kiro / Strands Agents
⾃動⼀括変換
対話での変換


## p.19

コード変換におけるサービスの位置付け
AWS DMS
⾃動⼀括変換
DDL
Oracle
SQL
Oracle
19
DDL
PostgreSQL
SQL
PostgreSQL
アプリケーション SQL
スキーマオブジェクト
(Table, Index,…)
コードオブジェクト
（Procedure, Function, …）
（動的 SQL 含む）
• AI エージェントによる変換
• コーディング規約や社内ノウハウでカスタマイズ
Kiro / Strands Agents
⾃動⼀括変換
対話での変換


## p.20

⽣成 AI 活⽤イメージ (SQL 変換)
移⾏元 DB の SQL ⽂の変換⽅法を問い合わせる
20


## p.21

⽣成 AI 活⽤イメージ (SQL 変換)
21
変更ポイントの説明とともに
変換後の SQL ⽂を提⽰してくれる


## p.22

⽣成 AI 活⽤イメージ (SQL 変換)
22
変更ポイントの説明とともに
変換後の SQL ⽂を提⽰してくれる


## p.23

⽣成 AI 活⽤イメージ (SQL 変換)
疑問があったら掘り下げる
23


## p.24

⽣成 AI 活⽤イメージ (SQL 変換)
移⾏元 DB の SQL ⽂の変換⽅法を問い合わせる
具体例とともに回答してくれる
24


## p.25

⽣成 AI 活⽤イメージ (アプリ SQL 変換)
アプリケーションコードを
コピペしてKiro に問い合わせる
25


## p.26

⽣成 AI 活⽤イメージ (アプリ SQL 変換)
26


## p.27

⽣成 AI 活⽤イメージ (アプリ SQL 変換)
27
SQL ⽂を動的に組み⽴てている場合（動的SQL）、
従来のルールベースでの変換ツールでは SQL の抽出が困難


## p.28

⽣成 AI 活⽤イメージ (アプリ SQL 変換)
組み⽴て前のSQL⽂の要素を SQL ⽂として認識し変換できる
28


## p.29

⽣成 AI 活⽤イメージ (アプリ SQL 変換)
29
変換前
変換後
Oracle 固有の関数・構⽂が
標準 SQL に変換されている


## p.30

変換する際の基本指針
## 変換時の基本⽅針
-
PostgreSQL バージョン 15 で実⾏可能な完全で構⽂的に正しいコードを出⼒します
-
スキーマ名とオブジェクト名を⼩⽂字に変換し、SQL キーワードは⼤⽂字を維持します
-
元のコードからのコメントを保持します
-
PostgreSQL は関数内でのトランザクション制御（COMMIT、ROLLBACK）を許可していな
いため、関数からトランザクション制御コードを削除し、「トランザクション制御は呼び出
し元のコードで実装する必要がある」コメントを追加します
-
PostgreSQL は関数のネストをサポートしていないため、すべての内部関数を別個の独⽴し
た関数として定義し、メインの⼿続きから呼び出す構造に変更します
(省略)
開発・移⾏プロジェクトの⽅針、コーディング規約、
お客様に蓄積されたノウハウ等を⾃然⾔語で指⽰
30


## p.31

コード変換におけるサービスの位置付け
AWS DMS
⾃動⼀括変換
DDL
Oracle
SQL
Oracle
31
DDL
PostgreSQL
SQL
PostgreSQL
アプリケーション SQL
スキーマオブジェクト
(Table, Index,…)
コードオブジェクト
（Procedure, Function, …）
（動的 SQL 含む）
• AI エージェントによる変換
• コーディング規約や社内ノウハウでカスタマイズ
Kiro / Strands Agents
⾃動⼀括変換
対話での変換


## p.32

コード変換におけるサービスの位置付け
AWS DMS
⾃動⼀括変換
DDL
Oracle
SQL
Oracle
32
DDL
PostgreSQL
SQL
PostgreSQL
アプリケーション SQL
スキーマオブジェクト
(Table, Index,…)
コードオブジェクト
（Procedure, Function, …）
（動的 SQL 含む）
• AI エージェントによる変換
• コーディング規約や社内ノウハウでカスタマイズ
Kiro / Strands Agents
⾃動⼀括変換
対話での変換


## p.33

⑥レポート作成
④テスト⽣成・実⾏
③変換
①DDL 抽出
DB オブジェクトの変換フローを⾃動化
②テスト⽣成・実⾏
Oracle
OK
結果相違
PostgreSQL
Oracle
Report
(DBMS_METADATA)
33
⑤突合
DDL
PostgreSQL
テスト
結果
DDL
Oracle
テスト
結果


## p.34

変換フロー
以下の⼿順を守ってOracle のデータベースオブジェクトをPostgreSQL に変換してください
•
1. 対象となるDB オブジェクトのDDL を抽出し、oracle.sql に保存する
•
2. そのSQL をよく読み込んで理解し、テスト⽤のDDL をoracle_test.sql に保存する
•
3. Oracle でテストを実⾏して結果を確認し、oracle_test.txt に保存する
•
4. Oracle SQL をPostgreSQL ⽤に変換し、postgres.sql に⼀時保存する
•
5. 変換したDDL をPostgreSQL DB に対して実⾏し、オブジェクトを作成する
•
6. Oracle と同じテストケースをPostgreSQL に書き換え、postgres_test.sql に保存する
•
7. テストコードを実⾏し、postgres_test.txt に結果を保存する
•
8. Oracle の結果と⽐較検証し、異なる場合は原因を分析し、ステップ4に戻り修正 (最⼤3回まで試⾏)
•
9. テストを通過したPostgreSQL のSQL を最終版としpostgres.sql に保存する
•
10. 変換結果のサマリー作成する
•
    - 成功した場合はOK.txt を作成
•
- 失敗した場合はNG.txt を作成
変換フローを⾃然⾔語で指⽰
34


## p.35

テストの指針
## テストケース作成⽅針
- 以下の観点で最低限のテストケースを作成する:
  1. **正常系**: 標準的な⼊⼒での動作確認
2. **境界値**: NULL 値、空⽂字列、最⼤値/最⼩値
3. **エッジケース**: オブジェクト固有の特殊な処理パターン
- テストデータは⼀時テーブルを使⽤し、テスト後は必ずクリーンアップする
## テスト実⾏時の考慮事項
-
Oracle 環境、PostgreSQL 環境に変換対象のオブジェクトが参照するテーブルや索引がある
か確認します
-
依存オブジェクトが存在する場合は、新たに DDL を作成するのではなく、それらオブジェ
クトを利⽤します
-
依存オブジェクトが存在しない場合は、テスト⽤の最⼩限のダミーデータを作成し、テスト
後に削除します
35
テストのやり⽅を⾃然⾔語で指⽰


## p.36

テスト結果
⽣成AI にて作成された簡易単体テストを全て通過
36


## p.37

⑥レポート作成
④テスト⽣成・実⾏
⑤突合
③変換
①SQL 抽出
アプリ SQL の変換フローを⾃動化
②テスト⽣成・実⾏
SQL
PostgreSQL
テスト
結果
SQL
Oracle
テスト
結果
OK
結果相違
PostgreSQL
Oracle
Report
37
app
app
Application
Source
app
(静的解析ツール)


## p.38

お客様検証事例


## p.39

三菱電機ビルソリューションズ様  検証事例
従来のルールベースでの変換ツール(SCT) では、変換困難
Oracle →Aurora PostgreSQL 移⾏の課題
202 ⼈⽉
DB オブジェクト
⼿動変換⼯数の⾒積り
アプリSQL
抽出不可
39


## p.40

三菱電機ビルソリューションズ 様  検証事例
検証結果
90%
DB オブジェクト変換成功率
95%
アプリSQL 変換成功率
48%
⼯数削減率
https://aws.amazon.com/jp/blogs/news/ai-agent-accelerating-oracle-to-aurora-postgresql-migration/
詳細はこちら
40
上位 5 個のAction Item が含まれる
プロシージャを対象に検証
対象とした 24 個の DAO に対して
23 個が変換成功（1個は参照オブ
ジェクトがないため対象外）
202 ⼈⽉→100 ⼈⽉


## p.41

KDDI 様  検証事例
ルールベースの⾃動変換ツール(SCT) で⾃動変換できない
複雑なDB オブジェクトが多数存在
Oracle →Aurora PostgreSQL 移⾏の課題
100 個以上
DB オブジェクト
⾃動変換不可
16.5 ⼈⽉
25,000 ⾏
巨⼤パッケージ
41
DB オブジェクト
⼿動変換⼯数の⾒積り


## p.42

KDDI 様  検証事例
マルチエージェントによる段階的アプローチ
1
Oracle 検証
• Oracle DDL の抽出
• 依存オブジェクトの解析
• 最適な変換順序の決定
• テストコード⽣成・実⾏
• テスト結果の記録
2
PostgreSQL 変換
• SCT の変換結果の確認
• 変換計画の作成
• PostgreSQL DDL への変換
• シンタックスチェック
3
PostgreSQL 検証
• PostgreSQL での
テストコードの作成・実⾏
• 実⾏結果との⽐較
• 変換結果の判定
42
各エージェントが専⾨領域に集中することで、変換の精度と効率の改善を図る


## p.43

KDDI 様  検証事例
検証結果
92%
DB オブジェクト変換成功率
1000 ⾏未満: 12/13 件が成功
4000 ⾏超: マルチエージェント対応
                    等で 3 件全て成功
100%
アプリSQL 変換成功率
全30 件の変換・テストに成功
76%
⼿動変換⼯数削減
16.5 ⼈⽉→4.0 ⼈⽉
変換コスト
~20 分
1 オブジェクトあたりの平均変換時間
~20 USD
1 オブジェクトあたりのAWS コスト（平均）
43


## p.44

• ハルシネーションのリスクに留意
• 全てのSQL を⽣成AI で変換できる訳ではない
• ⽣成AI により変換されたSQL が正しい結果を返すか、
性能⾯で懸念がないか等の確認が必要
• ⼗分な期間を設けた網羅的なテスト実施が重要
• 従来の⼿動による変換と同様
⽣成AI を活⽤したコード変換に際して
44
[AWS サイトより引⽤]
⽣成AI システムは、その進歩にもかかわらず、不正確または誤解を招くような情報を⽣成することがあります


## p.45

AWS の移⾏⽀援サービス


## p.46

https://github.com/aws-samples/sample-sql-converter-agent-workshop
GitHub にサンプルスクリプトを公開中
46


## p.47

変換作業に必要なコンポーネントを迅速に⽤意
sql-converter-agent
ユーザ
AWS Cloud
Private subnet
EC2
Amazon Aurora
PostgreSQL
Strands 
Agents
Kiro
MCP Server
Oracle
DB
DMS
47


## p.48

コストイメージ
* インスタンスの起動時間や、コードの変換難易度、変換試⾏回数などの要因により、これよりもコストが⾼くなる可能性があります。
* 上記は 2026/6 時点の⾒積りとなります。最新情報は適宜ご確認ください。
インフラ : 約 70,600 円 / Month (8hour/day)
•
Amazon EC2
︓t3.large  (2 vCPU, 8 GiB Mem, 50 GB Storage) (On-Demand)
•
Amazon S3  
︓Standard 10 GB 
•
Amazon Aurora 
︓db.t2.large (2 vCPU, 8 GiB Mem, gp3 50 GB, Single AZ) (On-Demand)
•
AWS DMS  
︓c6i.xlarge (4 vCPU, 8 GiB Mem, 50 GB Storage, Single AZ) (On-Demand)
⽣成 AI : 約 88 円 / ストアドプロシージャ
Ø Amazon Bedrock (Claude Sonnet 4.6) を利⽤し、約 500 ⾏のストアドプロシージャを変換する。
その際に10回繰り返し試⾏した場合、82.3 円 (*)
•
{ (⼊⼒ token x ⼊⼒token 1000個あたりの価格) + (出⼒ token x 出⼒token 1000 個あたりの価格) } * 試⾏回数
= ((8676/1000)*0.003+(2048/1000)*0.015) * 10
    = 0.568 USD = 88.04 円 (155円 / USD 換算）
155 円/ USD 換算, 東京リージョン
48


## p.49

SQL Converter Agent Workshop (SCAW)
⽣成 AI を活⽤したコード変換ワークショップ
Oracle Database 向けに書かれたサンプルコードをベースに、
⽣成 AI によるコード変換の作業イメージを把握し、スムーズな PoC 実施に繋げる
Step1 : 
変換環境の構築
Step2 : 
ルールベースによる変換
Step3 : 
AI エージェントによる変換
49


## p.50

まとめ


## p.51

• 商⽤DB からのエンジン変更を伴う移⾏は、コード変換が⼤きなブロッカー
• ⽣成AI を活⽤し変換作業を⼤幅に効率化可能
⾃動変換成功率︓90%、⼿動による変換⼯数︓最⼤ 76% といった実証結果
• ハルシネーションのリスクから、従来通り変換後のテストは必要だが、
移⾏の技術的ハードルを⼤きく下げる強⼒な⼿段
• PoC の際には、ワークショップやサンプルスクリプトをご活⽤ください
AI エージェントで切り拓く
商⽤DB から Amazon Aurora への移⾏
51


## p.52

Exhibition Booth Information
展⽰ブースのご案内
A148
⽣成AIでデータベース業務を効率化
AWS Village①


## p.53

Ask the Speaker
こちらのRoom 後⽅の外側にございます、
「Ask the Speaker」カウンターまでお越しください
⻑久保武
アマゾンウェブサービスジャパン合同会社
Room


## p.54

本セッションのアンケートへ
ご協⼒をお願いします
Please give us your feedback
Thank you!
DAT302
