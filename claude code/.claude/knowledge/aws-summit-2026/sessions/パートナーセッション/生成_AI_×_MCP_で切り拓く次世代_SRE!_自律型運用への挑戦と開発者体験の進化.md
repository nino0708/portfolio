---
title: "生成 AI × MCP で切り拓く次世代 SRE！ 自律型運用への挑戦と開発者体験の進化"
category: "パートナーセッション"
sponsor: "New Relic"
session_id: "PRT216"
pages: 56
topics: ["生成AI/エージェント", "運用/SRE"]
services: ["AWS DevOps Agent", "AgentCore", "MCP"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/パートナーセッション/生成 AI × MCP で切り拓く次世代 SRE！ 自律型運用への挑戦と開発者体験の進化 (sponsored by New Relic).pdf"
---
# 生成 AI × MCP で切り拓く次世代 SRE！ 自律型運用への挑戦と開発者体験の進化


## p.1

PRT216-S
粟田啓介
KINTO テクノロジーズ株式会社
DBRE/SRE Group Manager, Principal DBRE Engineer, 
Principal Project Manager, Platform 開発部DBRE/SRE Group
生成AI × MCP で切り拓く次世代SRE！
自律型運用への挑戦と開発者体験の進化
(sponsored by New Relic)
福井健二
New Relic株式会社
エンタープライズ第二グループ部長


## p.2

生成 AI × MCP で切り拓く
次世代 SRE！
自律型運用への挑戦と開発者体験の進化
SPEAKER NAME
Speaker Title, Company
NEW RELIC
Kenji Fukui
エンタープライズ第二グループ
営業部長


## p.3

© 2026 NEW RELIC, INC. ALL RIGHTS RESERVED. CONFIDENTIAL AND PROPRIETARY. FOR INTERNAL USE ONLY, NOT FOR EXTERNAL DISTRIBUTION.
SAFE HARBOR
This presentation and the information herein (including any information 
that may be incorporated by reference) is provided for informational 
purposes only and should not be constructed as an offer, commitment, 
promise or obligation on behalf of New Relic, Inc. (“New Relic”) to 
sell securities or deliver any product, material, code, functionality to 
New Relic and may not be replicated or disclosed without New Relicʼs 
express written permission.


## p.4

© 2026 NEW RELIC, INC. ALL RIGHTS RESERVED. CONFIDENTIAL AND PROPRIETARY. FOR INTERNAL USE ONLY, NOT FOR EXTERNAL DISTRIBUTION.
自己紹介
Kenji Fukui - 福井 健二
エンタープライズ第二グループ
営業部長
2019 - 
営業職としてデジタルビジネスの成長を
支えるオブザーバビリティの提案に従事。
ベンチャー
コンサル企業
2008 - 2019
エンタープライズ企業に対して基幹系の
システム案件を中心に支援。


## p.5

© 2026 NEW RELIC, INC. ALL RIGHTS RESERVED. CONFIDENTIAL AND PROPRIETARY. FOR INTERNAL USE ONLY, NOT FOR EXTERNAL DISTRIBUTION.
New Relic 会社概要
日本法人
設立
シェア
本社
事業内容
創業者
CEO
設立
従業員数
顧客数
New Relic 株式会社
2018年8月
国内オブザーバビリティ市場シェア No.1*
New Relic, Inc. （HQ サンフランシスコ、USA）
オブザーバビリティ・プラットフォームの提供
Lew Cirne
Ashan Willy
2008年
約2,400人
16,000 以上
*出典：株式会社テクノ・システム・リサーチ
出典：株式会社テクノ・システム・リサーチ (2025年10月発行)
ベンダー売上シェア
（SaaS）
2024年
国内市場実績
（SaaS提供型）
国内オブザーバビリティ市場で
7年連続売上シェアNo.1を獲得
- Application Performance Managementの世界的権威


## p.6

© 2026 NEW RELIC, INC. ALL RIGHTS RESERVED. CONFIDENTIAL AND PROPRIETARY. FOR INTERNAL USE ONLY, NOT FOR EXTERNAL DISTRIBUTION.
デジタルサービスがビジネスのコアに
業務効率化・自動化
事業創造
業務効率化
自動化/情報分析
事業創造
メールやドキュメントなど
インターネット検索やeコマース
デジタルサービス
システム＝ビジネス
デジタルがビジネスの中核に
1980年〜
2000年〜
2015年〜
オープン化
サーバー仮想化
クラウド / SaaS


## p.7

© 2026 NEW RELIC, INC. ALL RIGHTS RESERVED. CONFIDENTIAL AND PROPRIETARY. FOR INTERNAL USE ONLY, NOT FOR EXTERNAL DISTRIBUTION.
デジタルサービスや AI がビジネスコアに
業務効率化
自動化/情報分析
事業創造
メールやドキュメントなど
インターネット検索やeコマース
デジタルサービス
1980年〜
2000年〜
2015年〜
2023年〜
オープン化
サーバー仮想化
クラウド / SaaS
生成AI / AIエージェント
業務効率化・自動化
事業創造
共創・自律化
知的生産性革新
AIとの共創による意思決定
AIの自律化と
人との共創
デジタルが
ビジネスの中核に


## p.8

人間の限界を超え、AIと共に進化する
SUPERHUMAN 時
代


## p.9

1.0
OBSERVABILITY History
2020年頃


## p.10

© 2026 NEW RELIC, INC. ALL RIGHTS RESERVED. CONFIDENTIAL AND PROPRIETARY. FOR INTERNAL USE ONLY, NOT FOR EXTERNAL DISTRIBUTION.
フルスタック全方位に情報を取得し事象を捉える
ログ＋リソース監視
これまでの監視
物理・仮想化環境
OS
ミドル
アプリ・API
Web / Mobile
ログ
ログ
メトリクス
CPU/Memory/Disk/
Process
ログ
ログから
推し測る


## p.11

© 2026 NEW RELIC, INC. ALL RIGHTS RESERVED. CONFIDENTIAL AND PROPRIETARY. FOR INTERNAL USE ONLY, NOT FOR EXTERNAL DISTRIBUTION.
フルスタック全方位に情報を取得し事象を捉える
物理・仮想化環境
OS
ミドル
アプリ・API
Web / Mobile
ログ
ログ
メトリクス
CPU/Memory/Disk/
Process
ログ
ログ＋リソース監視
メトリクス・イベント・トレース・ログ
これまでの監視
オブザーバビリティ
ログから
推し測る
物理・仮想化環境
OS
ミドル
アプリ・API
Web / Mobile
メトリクス
イベント
トレース
ログ
事象を直接
捉える
メトリクス
トレース
ログ
メトリクス
トレース
ログ
メトリクス
ログ
メトリクス
ログ
メトリクス
ログ


## p.12

© 2026 NEW RELIC, INC. ALL RIGHTS RESERVED. CONFIDENTIAL AND PROPRIETARY. FOR INTERNAL USE ONLY, NOT FOR EXTERNAL DISTRIBUTION.
MTTRの劇的な短縮 と ビジネス影響の見える化
WEB
Micro
Service
API
APP
Micro
Service
API
DB
LB
Browser
Synthetic Monitoring
Backend
複数アプリにまたがるトランザ
クションをつなげて追跡
システム全体の処理/
連携プロセスを可視化
ソースコードやDBクエリレベル
まで即座にボトルネックを特定
クラウドやオンプレを問わ
ずインフラ状況を計測
Mobile
ブラウザやモバイルの
ユーザー体験を計測
サービス動作を常時シ
ミュレートしてテスト


## p.13

2.0
1.0
OBSERVABILITY History


## p.14

© 2026 NEW RELIC, INC. ALL RIGHTS RESERVED. CONFIDENTIAL AND PROPRIETARY. FOR INTERNAL USE ONLY, NOT FOR EXTERNAL DISTRIBUTION.
デジタル競争力向上そのものに貢献


## p.15

EVOLUTION TO INTELLIGENT OBSERVABILITY


## p.16

© 2026 NEW RELIC, INC. ALL RIGHTS RESERVED. CONFIDENTIAL AND PROPRIETARY. FOR INTERNAL USE ONLY, NOT FOR EXTERNAL DISTRIBUTION.
業務プロセス全体を変革
NEW RELIC INTELLIGENCE
FOR SAP APPLICATIONS
AGENTIC INTEGRATIONS 
FOR JIRA SERVICE MGMT
NEW RELIC MCP SERVER
FOR AWS DEVOPS AGENT
FOR AZURE SRE AGENT
FOR SERVICENOW NOWASSIST
FOR GITHUB COPILOT


## p.17

© 2026 NEW RELIC, INC. ALL RIGHTS RESERVED. CONFIDENTIAL AND PROPRIETARY. FOR INTERNAL USE ONLY, NOT FOR EXTERNAL DISTRIBUTION.
AIとエコシステムの組み合わせで新たな世界へ


## p.18

© 2026 NEW RELIC, INC. ALL RIGHTS RESERVED. CONFIDENTIAL AND PROPRIETARY. FOR INTERNAL USE ONLY, NOT FOR EXTERNAL DISTRIBUTION.
出典：【AIOps完全ガイド】オブザーバビリティとAIの融合がかたちづくる「AIOps」の新たな潮流
https://b-library.impress.co.jp/ud/product/code/WD-2026-0011


## p.19

© 2026 NEW RELIC, INC. ALL RIGHTS RESERVED. CONFIDENTIAL AND PROPRIETARY. FOR INTERNAL USE ONLY, NOT FOR EXTERNAL DISTRIBUTION.
THANK YOU
NEWRELIC.COM


## p.20

#AWSSummit #PRT216-S
生成 AI × MCP で切り拓く次世代 SRE！
自律型運用への挑戦と開発者体験の進化
Keisuke.Awata
KINTO Technologies, Inc. xRE Group


## p.21

#AWSSummit #PRT216-S
自己紹介
mysql > SELECT * FROM me \G
*************** 1. row ***************
name: 粟田 啓介
nickname: あわっち
         X: @_awache
company: KINTO テクノロジーズ株式会社
role: DBRE/SRE MGR
favorite: Aurora MySQL, Trusted Advisor
1 rows in set (0.00 sec)


## p.22

#AWSSummit #PRT216-S
KINTO テクノロジーズ株式会社 (KTC) について
2021年04月設立
2019年01月設立


## p.23

#AWSSummit #PRT216-S
KTC における SRE/DBRE の立ち位置
⚫従業員数: 約400名
アプリケーション開発組織
•
KINTOサービス開発
•
決済/ID基盤開発
•
バックオフィスシステム開発
•
モバイルアプリ開発etc...
プラットフォーム開発部
•
Cloud Infrastructure
•
Cloud Security
•
xRE (SRE: 2名/ DBRE: 5名)
•
MSP (24×365保守運用)
•
Platform Engineering
アプリケーション
開発組織
アプリケーション
開発組織
アプリケーション
開発組織
アプリケーション
開発組織
…
プラットフォーム開発部
Cloud Security
Cloud 
Infrastructure
xRE
(SRE / DBRE)
MSP
Platform
Engineering


## p.24

#AWSSummit #PRT216-S
KTC SRE のミッション・ビジョン
Mission
Vision
信頼性の高い価値あるプロダクトを最速で提供できるようにする
サービスレベルに基づいた開発と運用のバランスが取れた組織の実現
役割が細分化された組織の中で、SRE としての立ち位置を定義し、サービスレベルを共通言語に開発と運用をつなぐ
「何を信頼性と呼び、どこに価値を置くか」をチームで言語化したことが、このミッション・ビジョンに込めた想い


## p.25

#AWSSummit #PRT216-S
KTC SRE のアプローチ
Figure III-1. Service Reliability Hierarchy
サービス信頼性ヒエラルキー
愚直に下から積み上げる
SRE 活動を支える Observability Platform
ヒエラルキーの各レイヤーを下支えするのが Observability
New Relic は「ツール」ではなく SRE 活動を支えるプラットフォームとして
活用し、計測・分析・改善のサイクルを回す強力なパートナー


## p.26

#AWSSummit #PRT216-S
本日のお話
AI が SRE を「置き換える」話ではない
AI という新しい武器を使って、SRE の打ち手をどう進化させられるか
Enabling
開発者の自走支援
ガイドや知見の提供を AI が補助し、
開発チームが自分で信頼性を扱える
ように
Observability
可観測性
膨大なテレメトリを AI が要約・相関
づけし、見るべき兆候を素早く浮か
び上がらせる
障害対応
Incident Response
検知から原因究明・対応までを AI が
支援し、復旧までの時間を短縮する
AI は SRE の仕事を「置き換える」のではなく、「増幅する」
人がやるべき判断に集中するために使う


## p.27

#AWSSummit #PRT216-S
KTC SRE としてやるべきこと
信頼性と開発速度を両立する
変わらないこと
障害を減らす
可観測性を高める
運用負荷を下げる
開発者が価値提供に集中できるようにする
変わったこと
── 周囲の環境
システムの複雑化
マイクロサービス
SaaS
クラウドネイティブ
AI
やるべきことは変わらない。変わったのは環境。だからこそ、AI という新しい武器を取り入れる。


## p.28

#AWSSummit #PRT216-S
SRE に新しい武器が増えた
AI は目的ではなくSRE の新しい武器である
これまで
Monitoring
Automation
IaC
Platform Engineering
これから
LLM
MCP
Agent
重要なのは、AI で「何を実現するか」
武器があっても、使われなければ意味がない
まずは Observability から


## p.29

#AWSSummit #PRT216-S
New Relic 導入状況
1


## p.30

#AWSSummit #PRT216-S
過去のObservability スタック
課題
⚫
データがバラバラに管理され、障害時は複数ツールを横断して確認
⚫
o11y 文化が根付かず、トレース・メトリクスは活用されずログだけで障害対応
⚫
SRE がダッシュボードを提供しても、学習コストの高さから開発者の自走につながらない
⚫ログ
：OpenSearch
⚫トレース
：X-Ray
⚫メトリクス：Prometheus, Grafana


## p.31

#AWSSummit #PRT216-S
New Relic 導入
⚫2024月04月頃からNew Relic が社内で使えるように
⚫ログ、トレース、メトリクスが一つの場所に集約されて関連づいている
⚫導入するだけで見える情報が多く、初期学習コストが低い
Figure III-1. Service Reliability Hierarchy


## p.32

#AWSSummit #PRT216-S
New Relic 導入の現状
⚫2026年現在KINTO に関するサービスは New Relic をほぼ全て導入している
⚫KINTO ONE
⚫KINTO ONE 中古車
⚫TOYOTA UPGRADE FACTORY
⚫など23サービス
New Relic を導入したからといっていきなり活用が定着するわけではない


## p.33

#AWSSummit #PRT216-S
New Relic 活用の壁
2


## p.34

#AWSSummit #PRT216-S
導入 ≠ 活用
New Relic を布教しようとする人と開発者とのギャップ
New Relic 推進者 (SRE)
開発者
推進のために機能を理解している
どんな機能があるか分からない
SRE の思想をベースとした活用方法が分かる
障害発生時に使うツールという認識
o11y は最優先で取り組むべき領域だと感じる
開発タスク優先で関心が向けられない
ログ・トレース・メトリクスを見て根本原因を追う
まずはログを見て、原因が分かれば十分
ダッシュボードや SLO を継続的に運用したい
一度設定したら、あとは開発に戻りたい
SRE としては導入だけではなく、活用 (Enabling) も支援していかないといけない


## p.35

#AWSSummit #PRT216-S
Enabling 活動の例
やったこと
そこで見えたギャップ
1
ドキュメント作成
New Relic の機能紹介や導入方法を社内の技術スタック
に合わせて記載
⚫
あまり読まれない
⚫
SRE の負荷を軽減するものであって、あるからといって活
用が進むわけではない
2
開発チームとの定例
プロダクトに合わせた New Relic 活用を一緒に推進
⚫
開発側に New Relicを 活用するモチベーションのある人が
いると一定の効果が出る
⚫
プロダクトにマッチした活用方法の提案が難しく、段々
と頭打ちに
3
アラート移行の支援
アラート設計を行い、IaC 化して開発チームが管理で
きるようにする
⚫
関心は向くものの、やらないといけないものにフォーカ
スしてその先の活用に繋がらない
⚫
期限もあるので設計方針が立てられるSREが作業の大半を
肩代わり
学習型のコンテンツは相手に時間を割いてもらうことが前提
開発者の業務に根差したアプローチをとっていくべきでは？


## p.36

#AWSSummit #PRT216-S
現状の New Relic の利用シーンを考える
課題
⚫KTC はエラーログをトリガーにアラートを発報するアプリが多く、発生時は New Relic で調査している
⚫調査は個人のNew Relic 活用スキルに依存
⚫人によって時間も正確さも大きく変わる／複数人で重複した調査を行い非効率になる場合もある
試行
New Relic の使い方の勉強会
⚫根本的な障害対応のスキル差は埋まらない
⚫複数人での重複調査も解消されない
打ち手
調査そのものを自動化するツールを作る
「いっそ自動でまとめてくれればいい」── その実現手段として生成 AI を活用


## p.37

#AWSSummit #PRT216-S
生成AI を使ったEnabling
3


## p.38

#AWSSummit #PRT216-S
New Relic Analyzer の開発
⚫New Relic Analyzer
⚫アラートをトリガーに New Relic から関連するログやトレースを収集して要約を Slack に共有
Figure III-1. Service Reliability Hierarchy


## p.39

#AWSSummit #PRT216-S
New Relic Analyzer の仕組み
⚫Java Agent を使ってログにトレース情報を付与しており、fluentbit によって New Relic に送信している
⚫
NEW_RELIC_APPLICATION_LOGGING_LOCAL_DECORATING_ENABLED = true
⚫New Relic のアラートはログレベルが ERROR を検出して発報
⚫
SELECT count(*) FROM Log FACET trace.id WHERE entity.name = 'app-name' AND level = 'ERROR'
⚫trace.id で facet することで、Slack に通知する際のメッセージにトレースID を含めることができる
⚫
{{tag.trace.id}}
⚫導入は Slack App を対象のチャンネルに追加するだけ
⚫16進数 32文字を含む文字列があった場合に後続の処理を実行し、要約をスレッドに返信


## p.40

#AWSSummit #PRT216-S
New Relic Analyzer の効果
把握までの時間が大幅短縮
約20〜30分
1分
Analyzer の効果
⚫要約が Slack に返信され、複数人の重複調査がなくなる
⚫共通のコンテキストを持って次の対応に入れる
⚫客観的な記述で、エンジニア以外にも分かる粒度
一方で、残る領域
特定リクエストの解析ツールのため、人間の調査・判断が残る部分はまだある
根本原因の分析
影響範囲の特定
リカバリの要否
初動の「把握」は AI が肩代わり。── 人は「判断」に集中できるようになった。


## p.41

#AWSSummit #PRT216-S
New Relic MCP
の活用


## p.42

#AWSSummit #PRT216-S
2025年11月 New Relic MCP が登場
AI エージェントが New Relic のデータにアクセス・分析するための公式 MCP サーバー
36 のツールを 6 カテゴリ に整理
tag: discovery
エンティティや構成を探して把握する
tag: data-access
NRQL や自然言語でデータを取得する
tag: alerting
アラートポリシーや条件を確認する
tag: incident-response
インシデントの状況把握と対応を助ける
tag: performance-analytics
性能やゴールデンメトリクスを分析する
tag: advanced-analysis
デプロイ影響など踏み込んだ分析をする
ツール名やパラメータを覚える必要はない ── 「知りたいこと」を自然言語で書くだけ
※ https://docs.newrelic.com/jp/docs/agentic-ai/mcp/tool-reference/ より


## p.43

#AWSSummit #PRT216-S
New Relic Analyzer の拡張
① Slack でメンション
@New Relic Analyzer に質問すると、
解析とは別ルートで MCP 経由の情報収集
を実行
② スレッドに返信
収集した結果を要約し、
同じ Slack スレッドにレスポンスを返す
③ 会話を記憶
同一スレッドのやり取りを 
Bedrock AgentCore のメモリに保存し、
前の会話を踏まえて深掘り
New Relic MCP をいち早く取り入れ、New Relic Analyzer に組み込み


## p.44

#AWSSummit #PRT216-S
New Relic Analyzer x New Relic MCP
⚫アラートメッセージで New Relic Analyzer を直接メンション
⚫エラーログのトレース ID を起点にユーザーの行動までを一度に調査可能に


## p.45

#AWSSummit #PRT216-S
New Relic Analyzer x New Relic MCP
⚫根本原因特定にも利用可能に
⚫ECS タスクが落ちていた原因を 3回のやり取りで特定
⚫Slack をインターフェースとして間接的に New Relic が活用できている状態へ
Figure III-1. Service Reliability Hierarchy


## p.46

#AWSSummit #PRT216-S
New Relic Analyzer x New Relic MCP
⚫日頃の運用にも活用
⚫Botで定時にNew Relic Analyzerにメンションして各環境の前日のエラーログを報告
⚫ダッシュボードの定点観測としても活用


## p.47

#AWSSummit #PRT216-S
New Relic MCP で変わった世界
これまで
⚫
アラートが鳴るたび、人が調査
⚫
調査スキルは属人的、複数人で重複
⚫
対応手法を「学んでもらう」しかなかった
New Relic MCP と組み合わせることにより
➢
初動の「把握」は Analyzer が自動でこなす
➢
Slack で AI にメンションし、対話で深掘り
➢
会話を記憶し、文脈を踏まえた調査が可能に
ツールを「プロダクトエンジニアに教える」から、AI と「一緒に調べる」へ。
人は把握作業から解放され、判断と改善に集中できる世界になった。
アラート
AI が把握
Slack で対話
人が判断


## p.48

#AWSSummit #PRT216-S
僕たちの開発者体験はどう変わってきているか
本質① 体験が変わる
ツールを「使う」体験
価値へ「アクセスする」体験
本質② Observability の民主化
Observability
AI
全開発者へ
一部の専門家のものだった可観測性が、
AI を介して全員の手に
観点
Before
After
開発者の問い
「New Relic の使い方どうだっけ？」
「何が起きてる？」と聞くだけ
必要なスキル
ツールの習熟が前提
知りたいことを言葉にするだけ
向き合う相手
ログ・トレースの画面
会話する AI


## p.49

#AWSSummit #PRT216-S
自律型運用への挑戦
4


## p.50

#AWSSummit #PRT216-S
Agentic SRE 成熟度マトリクス
Level
Monitoring
Incident
Response
Postmortem / 
Root Cause Analytics
Testing /
Release
Capacity
Planning
Development
Product
Lv1
観測
メトリクス/ログ/ト
レース収集
インシデント情報を
収集
障害情報・時系列を
収集
リリース影響を観測
使用量・負荷を継続
観測
CI/CD・変更履歴を観
測
SLO/UX/事業指標を観
測
Lv2
判断
正常から逸脱を判断
対応優先度と方針を
判断
原因と再発傾向を分
析
異常と失敗兆候を判
断
将来負荷とボトル
ネックを分析
信頼性リスクの高い
変更を分析
ユーザー価値への影
響を分析
Lv3
実行
アラート調整
ダッシュボード生成
障害対応を実行
ポストモーテム作
成・改善実行
安全なリリース制御
を実行
キャパシティ調整を
実行
信頼性向上の変更を
実行
信頼性とUXを考慮し
制御
= New Relic Analyzer の現在のカバー範囲
Monitoring・Incident Response・Postmortem を Lv2（判断）をカバー


## p.51

#AWSSummit #PRT216-S
Agentic SRE の成熟ステップ
観測 → 判断 → 実行
レベルが上がるほど人の手は減り、AI が担う範囲が広がる
Level 1
観測
AI が情報を収集
Level 2
判断
AI が要約・判断
Level 3
実行
AI が提案・実行
New Relic Analyzer の現在地
Human in the Loop
リスク判断
ビジネス判断
信頼性戦略
改善ループを回す


## p.52

#AWSSummit #PRT216-S
まとめ
5


## p.53

#AWSSummit #PRT216-S
生成 AI × MCP で切り拓く、次世代 SRE！
〜自立型運用への挑戦と開発者体験の進化〜
次世代 SRE
AI を新しい武器に、
SRE の打ち手そのものを進化
自律型運用への挑戦
観測・判断を AI が担う
Agentic SRE が現実になり始めた
開発者体験の進化
Observability を民主化し、
誰もが価値にアクセス
SRE のミッションは変わらない。
変わったのは、それを実現する「武器」── 次の道を、AI とともに進化させていく


## p.54

#AWSSummit #PRT216-S
mysql > SELECT QUESTIONS FROM you;


## p.55

#AWSSummit #PRT216-S
mysql > SELECT ‘THANK YOU’ FROM me;


## p.56

本セッションのアンケートへ
ご協力をお願いします
Please give us your feedback
Thank you!
PRT216-S
