---
title: "「 AI エージェントが店長になる日」 －小売 DX 次の 10 年－"
category: "事例セッション"
session_id: "IND237"
pages: 29
topics: ["生成AI/エージェント"]
services: ["AWS Glue", "AWS Lambda", "AgentCore", "Amazon Bedrock", "Amazon DynamoDB", "Amazon EventBridge", "Claude"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/事例セッション/「 AI エージェントが店長になる日」 －小売 DX 次の 10 年－.pdf"
---
# 「 AI エージェントが店長になる日」 －小売 DX 次の 10 年－


## p.1

IND237
「AI エージェントが店長になる日」
－小売DX 次の10 年－
石川尚
東芝テック株式会社
執行役員・全社デジタル統括責任者


## p.2

File   Edit   Selection   View   Go   Run   Terminal   Help
01-cover.md — IND237 — Visual Studio Code
☰
🔍
⛓
▷
⧉
EXPLORER
▾KEYNOTE
▾slides
●01-cover.md
○02-motivation.md
○03-problem.md
○04-solution.md
○05-architecture.md
○06-demo.md
○07-closing.md
▸assets
○README.md
○package.json
📝01-cover.md
✕
keynote  ›  slides  ›  01-cover.md
1
2
3
4
5
6
7
8
9
10
11
12
<!-- ───────────────────────────────────────────────────── -->
<!-- AWS Summit Japan 2026
·  事例セッション· [IND237] -->
<!-- ───────────────────────────────────────────────────── -->
# AI エージェントが店長になる日
— 小売DX 次の10 年—
## whoami
- 石川尚(Ishikawa Takashi)  執行役員・全社デジタル統括責任者
·  東芝テック株式会社
- 11y at Global Retailer →now leading retail AI / digital strategy at Toshiba Tec
- Development case: POS data × store-operation knowledge × AWS agent technologies
⧉main    ↑ 0  ↓ 0    ✕0  ⚠0    事例セッション[IND237] ·  AWS Summit Japan 2026  ·  6/26 Hall 4 Room 12
Ln 5, Col 1    Spaces: 2    UTF-8    LF    Markdown    🙂


## p.3

// today's positioning
P.02 / Scope of today's talk
本日の位置づけ
小売業のお客様が抱える店舗課題に対して、東芝テックが考えるAI エージェントのソリューション開発事例
// Today's focus
What we will cover today
01  東芝テックのご紹介、なぜ我々がAI エージェントに取り組むのか
02  小売店舗の顧客課題理解
03  POS データと店舗業務知見をAI に接続する実装
04  AWS サービスの活用ポイント
// development case
© 2026 Toshiba Tec Corporation


## p.4

// company overview
P.03 / Toshiba Tec at a glance
Toshiba Tec at a glance
POS · self-checkout · retail solutions — 店舗現場に最も近いデータ接点を持つ会社
01  WHAT WE DO
POS · SCO · 
Retail Solutions
小売IT 専業— レジから店舗運営まで
end-to-end store hardware + SaaS
02  MARKET POSITION
#1 Japan · #1 World
52 % domestic 17 % global
POS systems & self-checkout, 2024 installed-base share
03  INSTALLED BASE
≈ 2.75M POS units
global  ·  約275 万台·  Japan 61 万台
global installed base across 30+ countries
Japan ≈ 610K units
04  STRATEGIC ASSET
POS data structure + store 
touchpoints
＝小売AI の起点·  the starting point for retail AI
データ構造・業務意味・現場接点を理解していることが、
AI エージェント開発の土台
// source: Toshiba Tec FY March 2025  ·  Global EPOS & Self-Checkout 2025 (Datos Insights)
© 2026 Toshiba Tec Corporation


## p.5

// why us
P.04 / Why we can build this
Why we can build retail AI agents
小売AI を現場で動かすには、技術だけでなく、POS・店舗・運用をつなぐ力が必要
01
Hardware 
footprint
POS  端末の設置基盤
2.75M
units in stores worldwide
02
POS application 
knowledge
POS アプリ・データ構造の
理解
03
Store operation 
domain 
knowledge
店舗運営の業務知見
04
Cloud-native 
platform
ELERA®
microservices · APIs · 
real-time data sync
// the takeaway
ハードウェア× データ× 業務知見× プラットフォーム
— 4 つ揃ってAI エージェントが現場で動く
// hardware  ·  POS app  ·  store ops  ·  ELERA®  ·  field — the moat for retail AI agents
© 2026 Toshiba Tec Corporation


## p.6

// chapter 02 — motivation
P.05 / Why we're building this
小売業界の課題
// motivation:  why retail needs agents now
© 2026 Toshiba Tec Corporation


## p.7

// the headline
P.06 / Retail workforce snapshot
Retail faces a huge labor shortage
人手不足・人件費の上昇を90 ％以上のお客様が課題視、
事業継続性の観点からも店舗効率化が必須
// Source: 内閣府高齢社会白書· バイト求人ネット(2023) · 2024年版スーパーマーケット白書
© 2026 Toshiba Tec Corporation
// the headline
90 %+
人材難・人件費増が
経営課題
735 万人
小売業の雇用者数
働き手は減少傾向
11.6 %
人件費の売上高構成比
利益圧迫の主因
¥ 1,300
アルバイト平均時給
10 年で+ 58 %
// the real bottleneck  労働人口は減少・最低賃金は上昇— 人件費は構造的に増加


## p.8

// store-ops 101
P.07 / The operating loop
Store Ops: Labor-Hour Productivity Must Be Improved End-to-End
店舗の人時効率は、計画・割り当て・実行まで一気通貫の改善が必要
© 2026 Toshiba Tec Corporation
01
Planning
計画(見積もり)
売上計画・需要予測・発注数量
必要人時を見積もる＝例100 時間
02
Allocation
シフト作成/割当
レジ
品出し
鮮魚
惣菜
人時配置
必要人時より増えがち＝例110 時間
03
Execution
実行
タスク例：製造・陳列・販売・値引き
欠勤・天候・在庫変化に応じて修正する
// 計画・割当を誤れば、実行(Execution) を効率化しても人件費は減らない
·  optimizing Execution alone won’t cut labor cost


## p.9

// who decides
P.08 / Decision-makers in the store
Roles are often split across management layers.
一定規模のチェーンストアでは計画・割当・実行を店長と現場責任者が分担している
© 2026 Toshiba Tec Corporation
// the operator
店長
Store Manager
計画Planning ＋割当Allocation（全体）
現場責任者A
売場A の責任者
実行Execution ― 現場指導
現場責任者B
売場Bの責任者
実行Execution（指導）＋計画Planning（発注）
現場責任者C
人員・作業割当の責任者
割当Allocation ― 日次・時間帯の個人タスク


## p.10

// where we play
P.09 / Toshiba Tec today
実行支援から、AI が意思決定（計画・割当）も支援へ
①これまで：実行(Execution) を支援→ ②これから：AI が計画・割当の意思決定も支援
© 2026 Toshiba Tec Corporation
01 Planning
計画
- 売上計画
- 需要予測
- 発注数量
02 Allocation
割当
- 人時配置
03 Execution
実行
- 製造
- 陳列
- 販売
- 値引き
- 廃棄
// これまでTEC が提供
Execution support
実行支援・省力化/ Labor saving
ハードウェア・ソリューション・データサービス
+ plan()
AI が計画を支援
+ allocate()
AI が割当を支援
+ improve()
実行結果で継続改善
生成AI エージェントが支援する領域
計画・割当という上流の意思決定こそ、
AI エージェントが価値を発揮する新領域


## p.11

// chapter 03 — Solution
P.10 / Solution
Solution
// tech:  POS data × AI agents on AWS
© 2026 Toshiba Tec Corporation


## p.12

// our solution
P.11 / Solution — start with Section B
解決策: 現場責任者の判断をAI エージェントで支援
// in scope · the agent's role
現場責任者B
Section B Manager
← AI による判断支援
売場B の責任者
— responsible for execution on sales floor
陳列·  値引き·  発注対応
placement  ·  markdown  ·  ordering
// why start with Section B · 3 reasons
01  POS データで判断根拠を作りやすい
section-B decisions can be grounded in POS data and explained
02  値引き・陳列・発注は
売上・廃棄・粗利に直結する
markdown · placement · ordering — move revenue, waste, GP%
03  店舗ルールを明文化しやすい
rules can be codified as conditions, actions, criteria, and exceptions
© 2026 Toshiba Tec Corporation
なぜ現場責任者の支援から始めたのか？


## p.13

// demo & implementation
P.12 / Demo · Implementation overview
提案型AI が「次のアクション」と「根拠」を提示する
開発事例: data → agent → recommendation → human approval
▶DEMO  — 現場スタッフの受け取り画面
// 実装概要— data → agent → action
INPUT  — AI に与えるデータ
POS 売上(時系列・SKU 粒度) · 在庫数/ 賞味期限· 店舗ルール· 過去販売実績· 天候/ イベント
AI AGENT  — モデル・プロンプト・ツール
売上・在庫・ルールを横断的に解釈→ 事前定義の施策と照合→ 推奨アクション+ 根拠を生成
OUTPUT  — 即実行可能なアクション+ 根拠
商品· 数量· タイミング· 値引き率· 陳列/ 発注対応
Agent として動かす利点
✓定型帳票ではなく、現場が次に取る行動を提示
✓判断理由を同時表示し、納得して実行できる
✓定期実行/ イベント起動で状況変化を検知
✓Human-in-the-loop: AI は提案、実行判断は人が行う
© 2026 Toshiba Tec Corporation


## p.14

// our solution
P.13 / Solution — start with Section B
リテールテックJapanにて展示
// scope: data-rich · revenue-coupled · rule-codifiable · HITL-safe · measurable
© 2026 Toshiba Tec Corporation
東芝テックがAWS のAI エージェントを活用した
店舗運営支援ソリューションを開発
// 2026.02.20  AWSブログ
小売業界の未来を切り拓く：東芝テックがAWSのAI エージェントを活用した店舗運営支援ソリューションを開発| Amazon Web Services ブログ
2026 年3 月
リテールテックJapan


## p.15

// chapter 04 — tech
P.14 / Technology
Technology
// tech:  POS data × AI agents on AWS
© 2026 Toshiba Tec Corporation


## p.16

// RTJ case study
P.15 / Feature 1 · realtime
実装アーキテクチャ概要
RTJ 事例紹介：AI 売場行動提案
© 2026 Toshiba Tec Corporation
Point１：
自律的にデータを監視
Point2：
現場の知見を現場で学ぶ
Point３：
データベース構造の理解


## p.17

// AWS tech point
P.16 / Feature 1 · structure
AWS サービスで実装するAI エージェントの構造
AI エージェント＝1) モデル＋2) ツール＋3) プロンプトの3 要素の組み合わせ
1) モデル/ Model
Amazon Bedrock
Claude 4.5 Sonnet
高度な自然言語処理能力で
エージェントの「頭脳」を担当。
状況を分析し、施策を判断する。
2) ツール/ Tools
AWS Glue Data Catalog
DB へのSQL 実行を行うためにDB の構造
を格納。推奨アクションの登録先は
Amazon DynamoDB。AgentCore Memory 
で対話を記憶。
3) プロンプト/ Prompt
Amazon DynamoDB
ベテランの業務知識をAmazon Bedrock 
がプロンプトへ変換して格納。エー
ジェントが起動時に毎回読み出す。
💡実行基盤：エージェントをAmazon Bedrock AgentCore Runtime にデプロイ。
サーバーレスで安全に運用し、Amazon EventBridge が定期的にエージェントを起動する。
© 2026 Toshiba Tec Corporation


## p.18

// RTJ case study
P.17 / Feature 1 · realtime
Point 1 ：自律的にデータを監視
© 2026 Toshiba Tec Corporation
RTJ 事例紹介：AI 売場行動提案


## p.19

// AWS tech point
P.18 / Feature 1 · realtime
AWS 技術ポイント
// 今年のポイント: LLM application からproduction-minded agent architecture へ
© 2026 Toshiba Tec Corporation
💡従来のバッチ処理（日次）→ 任意のタイミングで定期実行
予め定義したサイクルで、ユーザー指示無しにエージェントがPOS DB に直接SQL を実行。
業務時間中の売れ行きを自律的に分析し、予算と対比した上で、必要なアクションをリコメンドする
等のユースケースに対応した。
Point 1 ：自律的にデータを監視
Amazon Bedrock
AgentCore Runtime
Amazon EventBridge Scheduler
AWS Lambda
POS DB
system 
prompt 取得
Agent 起動
定期実行
AWS Cloud
店舗
POS
Amazon DynamoDB


## p.20

// RTJ case study
P.19 / Feature 1 · realtime
Point 2 ：現場の知見を現場で学ぶ
© 2026 Toshiba Tec Corporation
RTJ 事例紹介：AI 売場行動提案


## p.21

// AWS tech point
P.20 / Feature 2 · veteran
© 2026 Toshiba Tec Corporation
💡自然言語でインプット→ ノーコードでAI エージェントの振る舞いをカスタマイズ
ベテランの業務知識を構造化しプロンプトへ変換し、データベースに格納。
Agent が該当のプロンプトを毎回読み出す構成を取ることで、
店舗ごとの独自判断基準（コンテキスト）を反映。
pos data
１）データ理解
２）プロンプト生成
３）格納
Point 2 ：現場の知見を現場で学ぶ
Amazon Bedrock
AWS Lambda
Amazon DynamoDB
日配品（例：乳飲料）は、夕方になっても動きが鈍
いとその日のうちに売り切るのは難しい。賞味期限
が近いもの優先で、15 時過ぎに反応が薄かったら早
めに値引きをすべき。値引き幅は個店の過去実績か
ら求める・・・
【施策例】
乳製品の午後販売不振
を検知し、適切なタイ
ミングで、値引きを行
う。


## p.22

// RTJ case study
P.21 / Feature 3 · few-shot
Point 3：データベース構造の理解
© 2026 Toshiba Tec Corporation
RTJ 事例紹介：AI 売場行動提案


## p.23

// AWS tech point
P.22 / Feature 3 · few-shot
AWS Glue からスキーマ情報を取得しPOS DB へSQL 発行。
店長知見（施策例）をDynamo から取得し、実行アクションを立案。
// 今年のポイント: LLM application からproduction-minded agent architecture へ
© 2026 Toshiba Tec Corporation
あなたはデータベースを分析し、店舗運営のために推奨する施策
があれば、それを提出するエージェントです。
## 現在日時
{current_time}
## 分析ルール、施策、推奨基準など
{system_prompt}
## 出力方法
あなたの分析結果と推奨施策は、（省略）
## データベース情報
{table_info}
Point 3：データベース構造の理解
Amazon Bedrock
AgentCore Runtime
AWS Glue Data Catalog
Amazon DynamoDB
システム
プロンプト
データベース
スキーマ情報


## p.24

// future architecture
P.23 / Multi-agent vision
将来構想：マルチエージェントAI
今回の開発対象は売場行動サポート。
将来は店長・各主任を支援する複数エージェントへ拡張。
© 2026 Toshiba Tec Corporation
店長Store Manager
全体判断を統合するorchestrator
計画(見積もり)
Planning
· 売上計画
· 需要予測
· 発注数量
割当
Allocation
· 人時配置
現場責任者A
売場A の責任者
製造・売場A 支援agent
現場責任者B
売場B の責任者
値引き・陳列・発注支援agent 
今回の開発対象
現場責任者C
人員の責任者
人員・作業割当支援agent


## p.25

// future architecture · demo
P.24 / Multi-agent demo 
DEMO 日中— Absence-driven reallocation
スタッフ欠勤を受け、バックヤード作業からフロアへ人員再配置を提案
© 2026 Toshiba Tec Corporation
Input
欠勤情報· 現在シフト· 
POS 混雑状況· 作業優先度
Recommendation
レジ応援・品出し・
バックヤード作業の
優先順位を再計算
ピーク時間帯に合わせて
人員を再配置
Evidence
来店ピーク予測
売場欠品リスク
作業締切と人員制約


## p.26

// future architecture
P.25 / Multi-agent architecture
Multi-agent architecture
· 将来構想: 店長agent がorchestrator となり、POS・在庫・人員配置agent を協調させる
© 2026 Toshiba Tec Corporation
// agent topology
店長
Store Manager
Amazon EventBridge
店長エージェント
POSエージェント
在庫エージェント
人材配置エージェント
POS
在庫管理システム
人員/シフトシステム
// Production guardrails — safe by design
Read-only POS  queries only, no writes
Human approval  主任/ 店長が承認して実行
Tool allowlist  tenant / store isolation · evidence logging
Rule versioning  Strands · LangGraph · OpenAI SDK · ...
Amazon Bedrock AgentCore Runtime
定期実行＆エスカレーション
Amazon Bedrock
AgentCore Gateway
店舗/ オン
プレミス/ 
SaaS
AWS Cloud
Tool
Tool
Tool


## p.27

// aws tech point · multi-agent
P.26 / AWS tech — open-to-close support
AWS 技術ポイント— 本番運用を想定したagentic workload
© 2026 Toshiba Tec Corporation
Amazon Bedrock 
AgentCore Runtime
営業時間中ずっと動き続ける
agent を実現
• セッション分離× サーバーレス
• 最大8 時間の長時間セッション
// why us
東芝テックだからできる理由: 
大規模な導入実績に裏付けられた、POS データ構造と店舗業務への深い理解
Amazon Bedrock
AgentCore Gateway
POS DB や在庫システムへの
安全な接続を実現
• ツール接続の一元管理
• 安全な認証認可の管理
• テナント分離


## p.28

// wrap-up & thanks
P.27 / Wrap-up & thank you
まとめ— Key takeaways ＆Thank you, AWS
今回の学びと、AWS との次の一歩！
01
計画から見積もり、実行までを一気通貫に
サポートする事で店舗の効率化を実現
計画や意思決定業務はAI エージェント、実行業務の自動化はHW やIoT も組み合わせて支援
02  POS（売上）データとAIを連携する事で、
プロアクティブな意思決定支援を実現
売上データをベースに店舗の売場アクションをAI がリコメンド
03
AWS との協業でAgile にAI エージェントを構築。
今後はマルチエージェントの本番展開を推進！
Bedrock を中心にサーバレスなアーキテクチャーで実装。
構想から設計、プロトタイピングまでワークショップでAWS チームに伴走頂いた。
感謝！
© 2026 Toshiba Tec Corporation
AWS Discovery Workshop 
POS × Bedrock 連携の実装と検証


## p.29

本セッションのアンケートへ
ご協力をお願いします
Please give us your feedback
Thank you!
IND237
