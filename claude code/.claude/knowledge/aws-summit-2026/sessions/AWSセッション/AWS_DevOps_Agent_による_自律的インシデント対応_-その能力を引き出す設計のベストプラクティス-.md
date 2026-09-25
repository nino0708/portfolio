---
title: "AWS DevOps Agent による ⾃律的インシデント対応 －その能⼒を引き出す設計のベストプラクティス－"
category: "AWSセッション"
session_id: "CNS319"
pages: 67
topics: ["組織/内製化", "運用/SRE"]
services: ["AWS DevOps Agent", "AgentCore", "Amazon CloudWatch", "Claude", "Kiro", "MCP"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/AWSセッション/AWS DevOps Agent による ⾃律的インシデント対応 －その能⼒を引き出す設計のベストプラクティス－.pdf"
---
# AWS DevOps Agent による ⾃律的インシデント対応 －その能⼒を引き出す設計のベストプラクティス－


## p.1

CNS319
AWS DevOps Agent による
⾃律的インシデント対応
－その能⼒を引き出す設計のベストプラクティス－
加藤正樹
アマゾンウェブサービスジャパン合同会社


## p.2

Who am I?
Masa Kato
Sr. Specialist Solutions Architect
Amazon Web Services Japan
Focus
• Modernization
• Cloud Operation
Background
SRE / CCoE / Platform Engineering


## p.3

想定聴講者
こんな⽅を想定しています
• オンコール・インシデント対応をしているエンジニア・
エンジニアリングマネージャー
• オブザーバビリティや各種運⽤ツールを設計・実装している⽅
• DevOps Agent を検討中の⽅・使い始めた⽅
これらの知識を前提としています
• AWS でシステムを構築・運⽤する際の基礎知識
• オブザーバビリティの基礎


## p.4

Agenda
• 運⽤にAI を組み込むには
• デモ
• 能⼒を引き出す設計のベストプラクティス
• 応⽤編〜さらなる拡張〜
• まとめ


## p.5

運⽤にAI を組み込むには


## p.6

障害タイムライン
正常
異常
障害
正常
障害発⽣
発報
対応開始
復旧開始復旧
Time To Resolve
調査・切り分け
初動
Time to Resolve 短縮の鍵は初動と調査・切り分け


## p.7

障害は状況を選ばない
• 障害は時間も状況も選ばずに発⽣する
• 睡眠中・会議中でも対応を迫られる
• 即座には動けず、頭も切り替えられない


## p.8

⻑期化しがちな障害調査
• アプリの複雑化で問題箇所の絞り込みが難航
• ツールを跨いだテレメトリ調査
• ナレッジが属⼈化し、特定の⼈しか対応できない


## p.9

AI 利⽤の課題- 挙動
⽌まる
判断保留で⼈を待つ
⼈が指⽰しないと進まない
暴⾛する
⾃⾛させると勝⼿に判断・実⾏
危険な操作で被害が広がる
⾃⾛しつつ、危険な⾏動はしない仕組みが必要


## p.10

AI 利⽤の課題- 調査ロジック
テレメトリ
変更履歴
パイプライン
コードリポジトリ
システム構成
多様なデータソースを横断する調査ロジックが必要


## p.11

AI 利⽤の課題- コンテキスト整備
Day 1 — 整備直後
全員のセットアップが揃う
コンテキストも共有されている
Day N — 運⽤するうちに
進化が速い⽣成AI への追従
メンバー間で差が広がる
チーム全員で同じコンテキストを維持する仕組みが必要


## p.12

これらを全て⾃前で整備するのは
現実的ではない


## p.13

AWS DevOps Agent
調査はAI 、判断は⼈
障害対応と運⽤改善に特化したAI エージェント


## p.14

A W S D E V O P S A G E N T
⾃律調査
• 各種チケット・チャットツールと
ビルトインで連携可能
• Slack, ServiceNow, PagerDuty, Webhook
• 既存ツールのチケットやアラートに
反応して調査を起動
• 調査結果を起票元のチケットや
チームチャンネルへ投稿可能


## p.15

A W S D E V O P S A G E N T
テレメトリを
調査
• ビルトインで各種オブザーバビリティ
ツールと連携可能
• Amazon CloudWatch, Dynatrace, 
Datadog, Grafana, New Relic, Splunk
• 複数ツールを横断したテレメトリの
調査が可能


## p.16

A W S D E V O P S A G E N T
リポジトリに
連携
• 各種コードリポジトリにビルトインで
連携可能
• GitHub, GitLab, Azure DevOps
• 障害調査でコードとデプロイ履歴を
相関させ、障害を引き起こした
変更を特定
• ロールバックやコード改善を提案


## p.17

A W S D E V O P S A G E N T
ナレッジを
共有
• チームのナレッジを共有する仕組み
を内蔵
• Skills (Agent Skills 準拠)
• Agent Instructions (AGENTS.md)
• 現場のRunbook や作業⼿順書を
流⽤可能
• チーム内で調査品質を均⼀化


## p.18

システム構成を⾃動的に学習


## p.19

事例: KDDI – インシデント調査での活⽤
導⼊前
1.（再）問い合わせ
KDDI 様
AWS
サポート
2. 情報提供依頼
3. 再調査
導⼊後
• DevOps Agent の調査結果を直接
AWS サポートに共有可能に
• 同じ情報を共有した状態で
AWS サポートと議論が可能に
調査リードタイム
数週間→数⽇
出典: AWS blog「KDDI が実践するAWS DevOps Agent 活⽤: AWS サポートと連携したインシデント対応の効率化」


## p.20

デモ


## p.21

⾃律調査
CloudWatch Alarm により、
⾃律的に調査を開始


## p.22

初動
アラームの内容を確認し、
調査計画を⽴てる


## p.23

複数箇所を並⾏して調査
メトリクス、CloudTrail 
ログを並⾏調査


## p.24

複数テレメトリを⾃動で相関づける
複数のテレメトリを
相関づけて調査する


## p.25

調査中にチャット可能
DevOps Agent の調査を
中断させずに、
チャットが可能


## p.26

調査中にチャット可能


## p.27

複数の調査結果を統合分析


## p.28

調査結果を元に根本原因にたどり着く


## p.29

緩和計画
準備からロールバックまで
段階的に⼿順を提⽰


## p.30

緩和計画をコーディングエージェントへ
緩和計画をSPEC としてKiro 等の
コーディングエージェントに
渡すことも可能


## p.31

能⼒を引き出す設計のベストプラクティス


## p.32

能⼒を引き出す
設計のベスト
プラクティス
1. 調査スコープを決めて精度を引き出す
2. テレメトリを充実させて正確性を上げる
3. ナレッジを共有して時間を短縮する


## p.33

能⼒を引き出す
設計のベスト
プラクティス
1. 調査スコープを決めて精度を引き出す
2. テレメトリを充実させて正確性を上げる
3. ナレッジを共有して時間を短縮する


## p.34

Agent Space
DevOps Agent の調査スコープを定義する論理コンテナ
Agent Space
AWS アカウント
ユーザー
オブザーバビリティ
アラート
コードリポジトリ
• 環境やチームをまたぐ意図しない
アクセスを防⽌
• 外部ツールとのインテグレーションも
Agent Space 単位で構成する
• 標準では作成元のアカウントのみが
Agent Space に含まれる


## p.35

標準Agent Space で課題となるケース1
Agent Space A
Account 1
Agent Space B
Account 2
同⼀システム
• Agent Space A の調査は
Account 1 内に限定される
• Account 2 で起きた変更やエラーが
調査できない
根本原因にたどり着けない


## p.36

Agent Space はシステム単位でまとめる
Agent Space
Account 1
Account 2
同⼀システム
• Account 1 とAccount 2 の両⽅が
調査対象になる
• Account 1 で発覚した障害でも
Account 2 まで含めて調査される


## p.37

複数Agent Space を1 アカウントで利⽤
AWS アカウント
Agent Space (ステージング)
Agent Space (本番)
• タグ・リージョン等でAgent Space 
の調査対象を絞る
• prd の障害調査にstg のリソースが
混⼊しない
• 調査履歴がAgent Space 単位で分離
できる


## p.38

共通基盤を複数チームで使うケース
Platform Team
Agent Space
決済基盤
認証基盤
Service Team
Agent Space
Frontend
Backend
認証基盤(Platform)
認証基盤
同⼀AWS アカウントを複数Agent Space に含めることも可能


## p.39

Agent Space 設計の原則
Agent Space は調査スコープに合わせる
• 依存先まで含めて1 つのAgent Space にまとめる
• 環境やチーム単位で複数のAgent Space に分ける


## p.40

能⼒を引き出す
設計のベスト
プラクティス
1. 調査スコープを決めて精度を引き出す
2. テレメトリを充実させて正確性を上げる
3. ナレッジを共有して時間を短縮する


## p.41

テレメトリが充実すれば調査は深まる


## p.42

インフラメトリクスを拡充する
Container Insights
• Pod / Node の
リソース使⽤率
• コンテナ再起動回数・
稼働Pod 数
Database Insights
• スロークエリ
• 接続数
• 待機イベント・Top 
SQL
Lambda Insights
• コールドスタート
• メモリ使⽤率
• 実⾏時間
Insights ファミリーでマネージドサービスの内部状態まで観測
出典: Amazon CloudWatch — インフラストラクチャのモニタリング


## p.43

アプリケーションテレメトリを拡充する
メトリクス
• リクエスト数
• エラー率
• レイテンシ
ログ
• リクエストログ
• エラーログ
トレース
• サービス間の依存
• 区間ごとの遅延


## p.44

アプリケーションテレメトリを拡充する
メトリクス
• リクエスト数
• エラー率
• レイテンシ
ログ
• リクエストログ
• エラーログ
トレース
• サービス間の依存
• 区間ごとの遅延


## p.45

OpenTelemetry (OTel)
テレメトリのオープンスタンダード
AWS Distro for OpenTelemetry (ADOT)
• OTel をAWS 向けに最適化したディストリビューション
• 主要⾔語でゼロコード計装に対応
• 収集したテレメトリをCloudWatch に集約


## p.46

テレメトリ充実の進め⽅
テレメトリは積み上げで効く
• Insights ファミリーでAWS マネージドサービスを
深く観測
• OpenTelemetry で計装と相関づけを容易に実現


## p.47

能⼒を引き出す
設計のベスト
プラクティス
1. 調査スコープを決めて精度を引き出す
2. テレメトリを充実させて正確性を上げる
3. ナレッジを共有して時間を短縮する


## p.48

ナレッジの有無で調査時間が変わる
ナレッジ整備前、根本原因到達まで6 分32 秒
ナレッジ整備後、根本原因到達まで3 分38 秒


## p.49

Skills とAgent Instructions の使い分け
観点
Skills
Agent Instructions
仕様
Agent Skills
AGENTS.md
適⽤タイミング
必要時にロード
常時適⽤
1 Agent Space 
あたり
複数
グローバル+
各機能毎1
サイズ
最⼤6 MB (zip 全体)
推奨120 ⾏/ 上限25 KB
NEW
個別⼿順はSkills 、共通前提はAgent Instructions


## p.50

Skill で調査順序を教える
---
name: eks-retail-store-context
description: devops-agent-eks 上のEKS Retail Store の調査⼿順。UI /
Catalog などのマイクロサービスやバックエンドのデータストア(Aurora MySQL,
Aurora PostgreSQL など) の障害調査時に利⽤。
---
## 環境
- EKS Cluster ARN: `<EKS_CLUSTER_ARN>`
## 調査順序
1. データベース接続
2. サービスヘルス(Pod ステータス)
3. リソース利⽤率降順(CPU / メモリ)
...
## 調査順序
1. データベース接続
2. サービスヘルス(Pod ステータス)
3. リソース利⽤率降順(CPU / メモリ)
...


## p.51

Skill をDevOps Agent と⼀緒に作る
markdown 等のテキスト形式の他、
PDF や画像からの取り込みも可能


## p.52

ナレッジ共有の進め⽅
現場のナレッジでDevOps Agent を強化する
• 個別の⼿順はSkills で教える
• 共通の前提はAgent Instructions で教える


## p.53

応⽤編〜さらなる拡張〜


## p.54

⼿元の運⽤資産をもっと活⽤したい
AWS DevOps Agent
?
チケット
社内Wiki


## p.55

MCP サーバーで拡張する
AWS DevOps Agent
MCP サーバー
チケット
社内Wiki


## p.56

MCP サーバーで拡張する
DevOps Agent は
調査と提案のみ
MCP サーバー側で整える
AWS DevOps Agent
MCP サーバー
チケット
社内Wiki


## p.57

事例: CyberAgent - 独⾃MCP による拡張
• CloudWatch / Database Insights だけでは
DB の中⾝までは⾒られない
• 本番DB の調査ではきめ細かい制御が必要
• AgentCore Gateway & Lambda で安全に調査できる
独⾃MCP サーバーを構築
DevOps Agent
AgentCore Gateway
Lambda
Aurora MySQL
出典: CyberAgent SRG ブログ


## p.58

まとめ


## p.59

調査はAI 、判断は⼈


## p.60

参考リソース
ベストプラクティス
https://aws.amazon.com/jp/blogs/
news/best-practices-for-deploying-
aws-devops-agent-in-production/
CDK サンプル
https://github.com/aws-samples/
sample-aws-devops-agent-cdk
AWS DevOps Agent
ワークショップ
https://catalog.us-east-
1.prod.workshops.aws/
workshops/767d3081-b4fa-4e08-
81da-17e5c94a1a08/ja-JP


## p.61

直近のアップデート
• Memories
直近の調査結果から傾向を学び、次回調査を⾼速化
• Custom Agents
定期レポート等の独⾃エージェントを実装可能に
• Remote Server (MCP/A2A)
Kiro / Claude Code からDevOps Agent を呼び出し可能に
• Asset API
Skill 等のアセットをAPI で管理可能に
• 5 リージョン追加, Skill の有効化・無効化, and more!


## p.62

A W S D E V O P S A G E N T
Release
Management
Public Preview
• Release Readiness Review
変更による関連サービスへの影響や権限変更の
安全性を評価
• Autonomous Release Testing
変更に特化したテストプランを⾃動⽣成・実⾏


## p.63

Exhibition Booth Information
展⽰ブースのご案内
A110
⽣成AI オブザーバビリティ
AWS Village①


## p.64

Exhibition Booth Information
展⽰ブースのご案内
A111
AI エージェントで変わる
クラウド運⽤
AWS Village①


## p.65

Exhibition Booth Information
展⽰ブースのご案内
A132
Frontier Agents
AWS Village①


## p.66

Ask the Speaker
こちらのRoom 後⽅の外側にございます、
「Ask the Speaker」カウンターまでお越しください
加藤正樹
アマゾンウェブサービスジャパン合同会社
Room


## p.67

本セッションのアンケートへ
ご協⼒をお願いします
Please give us your feedback
Thank you!
CNS319
