---
title: "三井住友信託銀行の戦略的 AWS 投資と 組織イノベーション三井住友信託銀行の戦略的 AWS 投資と 組織イノベーション"
category: "事例セッション"
session_id: "IND214"
pages: 15
topics: ["組織/内製化"]
services: ["AWS CloudFormation", "AWS CloudTrail", "Amazon Aurora", "Amazon Bedrock", "Amazon CloudWatch", "Amazon Inspector", "Strands Agents"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/事例セッション/三井住友信託銀行の戦略的 AWS 投資と 組織イノベーション三井住友信託銀行の戦略的 AWS 投資と 組織イノベーション.pdf"
---
# 三井住友信託銀行の戦略的 AWS 投資と 組織イノベーション三井住友信託銀行の戦略的 AWS 投資と 組織イノベーション


## p.1

IND214
三井住友信託銀行の戦略的AWS 投資と
組織イノベーション
岡松参次郎
三井住友信託銀行株式会社
執行役員


## p.2

1
自己/会社紹介
３～５
2
AWSとの歩み
６～８
3
AWSとの協業
９～１２
4
組織変革と人材育成への取り組み
１３
5
まとめ
１４
目次
2


## p.3

© 2026 SUMITOMO MITSUI TRUST BANK, LIMITED All rights reserved.
自己/会社紹介～自己紹介～
略歴：
1997 年旧三井信託銀行（現三井住友信託銀行）静岡支店入社
～システム企画、リテール事業企画、経営企画等に従事～
2017 年7 月住信SBIネット銀行執行役員（システム担当）
2024 年4 月三井住友信託銀行執行役員兼IT業務推進第一部部長
2026 年4 月三井住友信託銀行執行役員（現職）
氏名：岡松参次郎（おかまつさんじろう）
役割：情報システム開発・保守担当の執行役員
内製化や開発プロセス変革などを担当
AWS との協業の責任者
3
1


## p.4

© 2026 SUMITOMO MITSUI TRUST BANK, LIMITED All rights reserved.
信託銀行同士の統合で誕生した、日本最大の専業メガ信託
自己/会社紹介～三井住友信託銀行とは～
三井信託銀行
1962 年設立
中央三井
トラスト・グループ
住友信託銀行
グループ
日本で最古の
信託会社
として設立
中央三井信託銀行
中央三井アセット
信託銀行
中央信託銀行
1924 年設立
1925 年設立
住友信託銀行
住友信託銀行
2011年4月三井住友トラストグループ発足
上場
持株会社
中核
（※）
（※）2026年8月3日「ドコモSMTBネット銀行」に社名変更します。
4
1


## p.5

© 2026 SUMITOMO MITSUI TRUST BANK, LIMITED All rights reserved.
信託とは、様々な社会課題や顧客に応じた少量多品種オーダーメイド型サービス
商品・プロセスの設計も含め「モノづくり」に近い
自己/会社紹介～信託ビジネスとは～
銀行業務以外にも多様な事業を有する複合体
・年金などの資産運用管理、不動産仲介・証券化、株主を管理する証券代行業務など
多数の事業を展開
・お客様一人ひとりに合わせたオーダーメード型サービスが多数
・「１００年パスポート」など、期間が非常に長いサービスが多いことも信託の特徴
5
1


## p.6

© 2026 SUMITOMO MITSUI TRUST BANK, LIMITED All rights reserved.
AWS との歩み～三井住友信託銀行のインフラ像～
6
ホスト・オンプレ基盤
OA系基盤
AWS基盤
勘定系システムを利用
（勘定元帳、端末、ATM、全銀）
OAを利用
（業務系）情報システムを利用
A システム
B システム
…
A ユーザ
B ユーザ
業務利用
業務利用
OA利用
TB社員/パートナー
業務利用
業務利用
A ユーザ
B ユーザ
勘定系
元帳
ATM
全銀
ホスト
インフラが必要な情報システムは
AWS へ集約。スケールメリット
（リソース・コスト面）を享受
この方針は堅持
外部DC
化推進
ホスト（勘定系）、OA 系以外はAWS へ集約
2


## p.7

© 2026 SUMITOMO MITSUI TRUST BANK, LIMITED All rights reserved.
AWS との歩み～三井住友信託銀行でのAWS の活用方法～
Phase1:実現
クラウド1st で業務アプリを原則AWS に移行する方針を決定
IT 環境・開発プロセスのシンプル化を達成
Phase2:完結
最重要となる顧客元帳の移行を決断、SWIFT など基幹システムも
クラウドネイティブ化を加速する標準化施策の展開
Phase3:限界突破へ
よりAgility 高く、より統制の効いたインフラへ
インフラからの攻めの経営— さらなる高みへ

2017 年8 月共通分散基盤にてAWS 採用（クラウド基盤）

2019 年アプリケーション基盤構築プロジェクト開始

2020 年2 月クラウド基盤への大規模移行開始

202５年５月顧客元帳（統合顧客管理DB）のAWS 移行を決定

顧客元帳移行でのAmazon Bedrock の活用
※Exadata→Amazon Aurora（PostgreSQL）

All-Out Cloud Factory での標準化検討開始
インフラが必要な情報システムのほぼ全てがAWS 上で稼働ー「実現」から「限界突破」のフェーズへー
" 弊社の信託ビジネスはモノづくりに拘るべき← AWS と合致。AWS のモノづくりを大事にする思想・文化を取り込んで、インフラを進化"
7
2


## p.8

© 2026 SUMITOMO MITSUI TRUST BANK, LIMITED All rights reserved.
AWS との歩み～戦略的"Bet" をした背景～
課題感
事業最適での共通部品の重複
個別最適で構築されたシステム群により、同様の機能が複数存在
統一したガバナンス・セキュリティの困難さ
個別環境ごとの運用が、全社横断のセキュリティ・ガバナンス統制を阻害
Why
AWS?
標準化・共通化による利益
信託ビジネスは少量多品種⇒ ビルディングブロックとしてのAWS サービスと親和性
AWS を標準アーキテクチャにすることによるIT 環境・開発/ 運用プロセスの標準化
Migration for Resiliency
マルチクラウド構成を取らないことで
障害発生時の復旧プロセスを簡略化、
耐障害性を向上
Migration for Security
AWSの脅威インテリジェンスも含め、
セキュリティは個別対策を取るのでは
なく、AWS にオフロード
Migration for Agility
信託ビジネス特有の少量多品種ニーズ
に対し、AWS のビルディングブロック
を活用した迅速なシステム構築・変更を
実現
信託ビジネスの「モノづくり」を表現するインフラとして、Best な選択⇒「AWS 」
" アーキテクチャを超え、信託ならではの精神を表現できるインフラ"
8
2


## p.9

© 2026 SUMITOMO MITSUI TRUST BANK, LIMITED All rights reserved.
All-Out Cloud Factory
SMTB のためのクラウドベストプラクティス
を実装するための組織設置
技術・組織両面での標準化推進
データ利活用や生成AI/Agent インフラ
などAI-ready な環境醸成支援
オープンかつマネージドで信託特性に合致した
テクノロジーでの標準化
耐久性と伸長性に優れた
システムアーキテクチャの採用
（プラットフォームエンジニアリング）
AI/データを活用したビジネス価値の創出
三井住友信託銀行がAWS とクラウドネイティブ化やAI-ready 化に向け、
総力を挙げて（All-out）取り組むための共創活動の現場（Factory）
真のCloud Native 化
AWS との協業～よりAgility 高く、より統制の効いたインフラの実現～
三井住友信託銀行がAWS と共同で推進する“モノづくりが主役のCloud Native 化”への取り組み
新規
ビジ
ネス
既存
アプリ
既存
基盤
9
3


## p.10

© 2026 SUMITOMO MITSUI TRUST BANK, LIMITED All rights reserved.
AWS との協業～All-Out Cloud Factory の具体的タスク～
タ
ス
ク
個別案件
高度IT人材に
よる内製化
技術標準化・
共通化の推進
新技術活用
(モダナイズ)
保守・運用
業務の
効率化
データ利活用
高度IT人材による内製化
保守・運用業務の効率化
技術標準化・共通化の推進
データ利活用
新技術活用(モダナイズ)
2026年度
2027年度
2028年度
4月〜6月
7月〜9月
10月〜12月
1月〜3月
4月〜6月
7月〜9月
10月〜12月
1月〜3月
4月〜6月
7月〜9月
10月〜12月
1月〜3月
SWIFT 更改
遺言管理
統合顧客管理DB の移行
DC Web 更改
生成AI 基盤
CI/CD によるDevOps
環境提供の検討
検証環境・サンドボックス環境
の利用拡大
次期標準アーキテクチャ検討
構築プロセス省力化
変更プロセス省力化
生成AI ユースケース拡大
個別案件から得られた標準化施策の横展開
パイロット
個別案件からの既出
標準化候補
生産性基盤の構築
10
3


## p.11

© 2026 SUMITOMO MITSUI TRUST BANK, LIMITED All rights reserved.
以下の手順に従って、
Oracle のパッケージを
PostgreSQL に変換して
ください。
…
AWSとの協業～個別事例①「統合顧客元帳等の移行」～
11
3
顧客元帳は現行オンプレミス環境で稼働しているが、AWSへの移行を決定
移行にあたりDBMS がOracleからPostgreSQL に変換する必要
AWS Generative AI Innovation Center (GenAI IC)からAmazon 
Bedrock を使ったツール提供の支援を受け移行を効率化
All-out の枠組みで、上記ツールを標準化。AI エージェント（Strands Agentsライ
ブラリで実装）にPostgreSQL のクエリ実行やファイル読み書きなどのツールを与え、
作業手順に従って変換
事前に依存関係分析を実行し、変換計画を立てることにより、処理の効率化および
イレギュラーな事態にも対応可能
標準化ツールとして、変換対象を拡張中
プログラム
総数
ProC
160
PKG
406
PLSQL
113
アプリSQL
Java(XML)
719
plsql
64
パッケージ
12
プロシージャ
24
ファンクション
63
ProC
96
アプリSQL
xml
570
プロシージャ
326
パッケージ
5
ProC
65
アプリSQL
xml
676
外訪支援(i-Boats)
アプリSQL
xml
757
4,056
i-Ships(ホスト連動)
DBオブジェクト
対象システム
大分類
小分類
統合顧客管理
DB(T-CIF含む）
DBオブジェクト
営業支援(i-
Ships(本体))
DBオブジェクト
変換順
SQL
Oracle
conversion
_plan.json
SQL
PgSQL
変換済み
オブジェクト
DDL
Oracle
Bedrock
Aurora PostgreSQL
Package schema.pkg_name
AIエージェント
ツール
PosgresSQL
tool
File read/write
tool
Shell command
tool
ファイルシステム
シェル
Bedrock
Strands Agents
変換手順書
プロンプト（変換対象名）
パッケージ変換
PL/SQL 変換
依存関係一覧
dependencies.json
変換対象リスト
object_list.ini
プロンプト
自動生成
AIエージェントツール
MyBatis 変換
Pro*C 変換
更なる変換対象拡張


## p.12

© 2026 SUMITOMO MITSUI TRUST BANK, LIMITED All rights reserved.
生産基盤はEUC 開発の統制強化の観点から、AWS のネイティブ機能を中心に活用し構築したEUC 専用の開発・運用基盤
ユーザーのEUC はT-SQL、Python で構築。本プラットフォームでライブラリ管理、本番リリース運営、静的テストなどを自動化・規律化
AWS との協業～個別事例②「生産性基盤」～
No
1
(使用可能ライブラリはCodeArtifactで制限）
3
5
6
7
8
9
11
14
16
(リリースされたLambdaに対して自動スキャン）
18
(出力されたログは未加工でS3に保存)
20
(メールに記載のURLを押下）
Visual Expert
12
13
15
17
19
単体テスト管理
単体テスト
リグレッションテスト管理
改ざん検知
操作履歴管理
脆弱性管理
デプロイ
4
10
Amazon CloudWatch Metrics
静的チェック
Liquibase(SQL)・オリジナルツール(Lambda)
利用するツール
GitHub Enterprise Server
AWS CodeArtifact
GitHub Enterprise Server
SonarQube
ビルド
AWS CloudFormation
(Serverless Application Model)
パイプライン管理
リリース承認
メトリクス管理
AWS CodeBuild
AWS CloudFormation
(Serverless Application Model）
Liquibase(SQL)
Amazon Inspector
AWS CloudTrail
Amazon CloudWatch Logs
デプロイ管理
ログ管理
AWS CodePipeline
リグレッションテスト
ビルド管理
構成管理
機能
コードレビュー
マージ承認
AWS CodeBuild
差分検証ツール
（Pythonで作成した検証ツール）
AWS CodeBuild
ライブラリ管理
GitHub Enterprise Server
AWS CodePipeline
AWS CodeBuild
pytest
2
12
3
資産管理企画推進部
EUC アプリ開発者


## p.13

© 2026 SUMITOMO MITSUI TRUST BANK, LIMITED All rights reserved.
組織変革と人材育成への取り組み
システム子会社の統合という組織変革と文化の再構築
•
外部環境への変化の対応と内製力の強化のため、システム子会社を銀行本体に垂直統合
•
もう一度、一から十まで自分たちでつくる経験を通じて、高度IT人材としての土台の育成を企図
•
その文化・風土づくりの核として、AWSをはじめとした外部パートナーにもご協力いただき、研究成
果発表や先人達の経験から学ぶ「Tech Journey」を創設
•
「学ぶを楽しむ。そこで得た知識・知見、仲間に感動する」をテーマにエンゲージメントを創出
＜2025 年度までの実績＞
Learn and Be Curious
•
Amazon のLeadership Principles
を組織変革に活用
•
継続的な学習文化の構築
•
「学ぶを楽しむ」という新しい価値観の醸成
Renaissance Developer
•
幅広い技術領域に精通した開発者の育成
•
Amazon 開発者哲学の実践
•
現場から経営層まで全レイヤーでの人材育成
AWS カルチャーと同様の文化（モノづくりを大事にする組織・人材）にするための取り組み
開催回数
１５回
参加者
３０００名＋
うち外部
３００名＋
13
4


## p.14

© 2026 SUMITOMO MITSUI TRUST BANK, LIMITED All rights reserved.
まとめ～これまでの成果と今後のパートナーシップ～
1. 集約メリット
IT 環境・開発プロセスのシンプル化
Migration for 
Resiliency/Security/Agility
2. 標準化の取り組み
標準化・生成AI 活用
All-Out Cloud Factory による
共創推進
3. 組織変革
Tech Journey に３０００名強参加
Amazon Culture でモノづくりを大
事にする文化を醸成
次なる新たなステージの像
→お客さま一人一人のオーダーメイド・サービスインフラの提供
→少量多品種のスケール実現が可能
→AWS の効率性を徹底し、自らの技術力を向上
イノベーションを推進する環境（クラウド）と次世代AI 人材（カルチャー）の両面でAWS をパートナーとして推進
三井住友信託銀行だけの「ダ・ヴィンチエンジニアリング」の確立へ
14
5


## p.15

本セッションのアンケートへ
ご協力をお願いします
Please give us your feedback
Thank you!
IND214
