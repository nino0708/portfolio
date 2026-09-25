---
title: "【実践】事例に学ぶ Amazon Bedrock での Claude 活用術 －データ・実装・セキュリティ－"
category: "パートナーセッション"
sponsor: "Serverworks"
session_id: "PRT231"
pages: 51
topics: ["セキュリティ", "生成AI/エージェント"]
services: ["AWS IAM", "AWS Organizations", "AWS Step Functions", "AgentCore", "Amazon Bedrock", "Amazon Connect", "Amazon EventBridge", "Amazon Nova", "Amazon Q", "Amazon Redshift", "Amazon S3", "Amazon SageMaker", "Claude", "MCP"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/パートナーセッション/【実践】事例に学ぶ Amazon Bedrock での Claude 活用術 －データ・実装・セキュリティ－ (sponsored by Serverworks).pdf"
---
# 【実践】事例に学ぶ Amazon Bedrock での Claude 活用術 －データ・実装・セキュリティ－


## p.1

PRT231-S
【実践】事例に学ぶAmazon Bedrock での
Claude 活用術－データ・実装・セキュリティ－
(sponsored by Serverworks)
村上博哉
株式会社サーバーワークス
クロスインダストリー第2本部
AI推進課課長


## p.2

事例に学ぶAmazon Bedrock での
Claude 活用術
～データ・実装・セキュリティ～
【実践】


## p.3

生成AI の普及から4 年...


## p.4

3
生成AI の習熟度は組織によって千差万別になった
※ Amazon Nova Canvas で生成
Chat AI
RAG
Coding
Agentic AI
← Innovators
Laggards →


## p.5

4
AI 導入の課題も千差万別になった
Gartner®, Press Release, 2025年6月30日「Gartner Survey Finds 45% of Organizations With High AI Maturity Keep AI Projects Operational for at Least Three Years」
https://www.gartner.com/en/newsroom/press-releases/2025-06-30-gartner-survey-finds-forty-five-percent-of-organizations-with-high-artificial-intelligence-maturity-keep-artificial-intelligence-
projects-operational-for-at-least-three-years
GARTNER is a trademark of Gartner, Inc. and its affiliates.
AI に精通していない組織の課題
1. ユースケースが分からない
2. データの可用性と品質の課題
3. AI 人材の確保
AI に精通している組織の課題
1. セキュリティ
2. データの可用性と品質の課題
3. 他システムへの統合
4. 技術的な実装


## p.6

本日は、
データの品質、実装、セキュリティ/ガバナンス
という3 つのテーマで、弊社の事例を交え、
Claude 活用術をお話させていただきます


## p.7

6
•
サーバーワークスについて
•
急成長するClaude のニーズ
•
Tips.1 データ品質
•
Tips.2 実装
•
Tips.3 セキュリティ・ガバナンス
•
まとめ
目次


## p.8

サーバーワークスについて


## p.9

8
サーバーワークスについて
サーバーワークスは、AWSの専業クラウドインテグレーター
「構築と移行、運用のプロフェッショナル」です
本社所在地
〒162-0824 東京都新宿区揚場町1-21
代表者
大石良
設立
2000年2月21日
資本金
3,270,337,821円※2025年2月末日現在
従業員数
441名(単体) ※2026年2月末日現在
事業内容
AWS専業のクラウドインテグレーター
営業所
大阪・仙台・福岡
資格等
AWS Premier Tier Services Partner
AWS Managed Service Provider Partner
AWS Migration Services Competency Partner
ISO /IEC 27001（JIS Q 27001）
主な株主
弊社役員、株式会社テラスカイ
エヌ・ティ・ティ・ドコモビジネス株式会社、
株式会社エヌ・ティ・ティ・データ
関連会社
株式会社G-gen（東京都新宿区）
パーソル＆サーバーワークス株式会社（東京都千代田区）
富士フイルムクラウド株式会社（神奈川県横浜市）
株式会社サーバーワークス・キャピタル（東京都新宿区）
株式会社サーバーワークス・スマートオペレーションズ（新潟県新潟市）
主な拠点
エンジニア
営業・バックオフィス
東京の他、大阪・仙台・福岡現在はリモートワークを
基本として日本全国からお客様をサポート


## p.10

9
表彰履歴と認定
12年継続
AWS プレミアティアサービスパートナーに、
して認定されています
2014
2015
2016
2017
2018
2019
2020
2021
2022
2023
2024
2025
アマゾンウェブサービス（AWS）パートナーの中でもトップの
AWS AI コンピテンシーパートナー
AWS マネージドサービスプロバイダー
AWS デジタルワークプレイスコンピテンシー
AWS 移行コンピテンシー
AWS Well-Architected パートナー
AWS 公共部門パートナー
SMB コンピテンシー
Amazon Connect サービスデリバリープログラム
Amazon Redshift サービスデリバリープログラム
受賞歴
パートナーアワード(2013)
パートナーアワード事例部門（2014）
APN Customer Success of the Year 2017 – Japan (2017)
多くの認定を獲得


## p.11

10
Anthropic社とリセラー契約を締結
2026年2月、「Amazon Bedrock」を通じて高性能AIモデル「Claude」の提供を開始
正規商流による安定したライセンス提供
• 正規商流でClaudeを提供することで、ライセンス違反のリス
ク回避、長期的に安定した利用が可能に
Claude in Bedrock, powered by Anthropicの迅速な実装
• AWSが提供するフルマネージドサービスAmazon Bedrock
を活用し、インフラ構築からアプリケーション開発まで
スピーディに支援
エンタープライズレベルのガバナンス対応
• 透明性の高い運用体制を提供。利用状況の可視化やアクセス
制御を行うことでシャドーITを防ぎコンプライアンスを遵守
コスト管理の最適化
• 既存のAWS請求と一本化。複雑な個別契約なしで即導入可能
Anthropic
AWS
Anthropic認定リセラー× AWSプレミアティアパートナー
お客様
モデル提供契約
Claude in Bedrock
powered by Anthropic
AWS利用
AWS、Claude in Bedrockの提供
RAG構築、業務アプリ構築、
既存システム連携、
ガバナンス対応
等


## p.12

11
自己紹介
村上博哉
株式会社サーバーワークス
クロスインダストリー第2本部AI推進課課長
保有資格など:
2024 - 2026 Japan AWS Top Engineers（AI/ML Data Engineer）
Japan Claude on AWS Champion
Generative AI Developer - Professional 
JDLA Deep Learning for Engineer など


## p.13

急成長するClaude のニーズ


## p.14

13
Claude の利用は増えている
Datadog, "State of AI Engineering 2026"（2026年）https://www.datadoghq.com/state-of-ai-engineering/
Claudeに年間10万ドル以上を費やす顧客数は1年で7倍に増加（Anthropic 公式発表2026.2 ）
2025年3月から1年間で+23%の利用増（Datadog LLM Observability 利用組織）


## p.15

14
AWS × Claude 頻繁なアップデート
2
8
8
6
8
5
0
1
2
3
4
5
6
7
8
9
2025
1-3月
2025
4-6月
2025
7-9月
2025
10-12月
2026
1-3月
2026
4-5月
アップデート数
Claude 3.7 Sonnet GA
Claude Opus / Sonnet 4 GA
プロンプトキャッシュGA
Claude Sonnet 4.5 GA
Claude Haiku / Opus 4.5 GA
Claude Sonnet / Opus 4.6 GA
プロンプトキャッシュTTL 1時間サポート
Claude Platform on AWS GA
Claude Opus 4.8 GA
※アップデート数は当社調べ


## p.16

Tips.1 データの品質


## p.17

16
データは生成AI の差別化要因
データへの取り組みが進むほど、AI 活用の競争優位は高まる
AI を使えない
活用に踏み出せていない
STEP 1
AI を使える
汎用的なAI を利用
STEP 2
自社データを
AI に入力できる
自社の情報を活かせる
STEP 3
品質の高い自社データを
AI に入力できる
精緻化したデータで
有用な出力を得る
STEP 4


## p.18

17
なぜAI-Readyなデータを準備するのが難しいか
多様なデータ形式
FORMAT
テキスト・画像・音声・動画
形式が多岐にわたる
構造化データから非構造化データ
まで形式が多岐にわたり、それぞれ
前処理や取り扱い方法が異なる。
形式ごとに適切なパイプラインを
設計する必要がある。
データの更新頻度
UPDATE
日々増減・更新されるデータの
変更に追従する
データは継続的に追加・更新・削除
される。最新の状態を保ち続ける
同期や再インデックスの仕組みが
不可欠。
データの内容
CONTENT
個人情報やノイズなど生成AIに
とって不適切なデータ
個人情報や、古い・不正確な情報など、
LLMに入力すべきでないデータの混
入を防ぐ仕組みが必要。


## p.19

18
AI-Readyなデータを準備すると精度があがる
プロンプトを書く技術だけではなく、モデルが見るもの全体を設計する技術が重要
①ノイズを消す
DISTILL
結果に寄与しないトークンを入力
しない
優れたコンテキストエンジニアリ
ングとは、望ましい結果が得られ
る可能性を最大化する、ハイシグ
ナルなトークンの最小セットを見
つけることを意味する。
②意味をもたせる
PRESERVE
追加の文脈やメタデータを付与し、
価値と検索性を向上
フォルダの階層構造、命名規則、
およびタイムスタンプは、いずれも
人間とエージェントの両方が、情
報をいつ、どのように活用すべき
かを理解するのに役立つ重要な手
がかりとなります。
③構造化
STRUCTURE
生成AI が解釈しやすい形式に
整える
プロンプトは明確なセクションに
分けて構成し、XMLタグや
Markdownヘッダーなどの手法を
使用して各セクションを区切る
ことをお勧めします。
Anthropic：「Effective context engineering for AI agents」より
AI-Ready なデータの主な要素


## p.20

19
導入の成果
お客様の課題
月間数万件におよぶお問合せ電話をサービス
改善に活かしきれていない
⚫通話の全件自動処理、人手依存から脱却
⚫問合せ種別や商品カテゴリなど、カスタマイズ
可能な分析軸で通話をJSONに構造化
Claude を活用し非構造化データを構造化
リーズナブルなデータ処理パイプラインを約3か月で構築
月間数万件におよぶ通話音声データ分析基盤の構築
株式会社ハルメクホールディングス様


## p.21

20
データ処理パイプラインの概要
⚫約1,000件/日の通話音声ファイルをトピックごとに構造化されたJSONに変換
短い通話等
の除去
Amazon S3
Amazon S3
Amazon S3
Amazon Bedrock
（Claude）
Amazon SageMaker AI
AWS Step Functions
Amazon EventBridge
日次処理
深夜帯に起動
推論エンドポイント
音声の文字おこし
複数の推論ステップ
PII のマスク、トピック分類、
要約など


## p.22

21
AI-Ready なデータにするための工夫
“望ましい結果が得られる可能性を最大化する、ハイシグナルなトークンの最小セット”にするため、
ノイズの除去やメタデータの付与を実施
短い通話等
の除去
Amazon S3
Amazon S3
Amazon S3
Amazon Bedrock
Amazon SageMaker AI
AWS Step Functions
Amazon EventBridge
①ノイズの除去
インサイトを含まない
通話をフィルタ
①ノイズの除去
通話内容の要約
トピックごとの分割
③構造化
システムプロンプトの
XML構造化
②メタデータの付与
通話・商品のカテゴリ
ラベルを付与


## p.23

22
3つの成功要因その1: コスト最適化
Amazon SageMaker AI を採用
•
Amazon Transcribe
•
フルマネージド・高品質な文字おこし
•
音声1 分あたりの課金
•
Amazon SageMaker AI
•
モデルホスティングはユーザーが実施
•
推論インスタンスの起動時間で課金
処理数が多いバッチ処理のため後者を選択
プロンプトキャッシュの活用
•
繰り返し使用するコンテキストをキャッ
シュに追加し、トークンの再計算をス
キップすることでコストを削減できる
•
キャッシュのTTL は5分間
今回のケースでは...
リアルタイム要件なし/ 処理件数が膨大
⇒ プロンプトキャッシュのメリット大
コスト約80% 減
コスト約80% 減


## p.24

23
3つの成功要因その2: JSON 出力
⚫通話音声をJSON 形式に変換して保存する要件
⚫Claude の出力をJSON にする方法は以下の3 つ
推奨：Structured Output
定義したJSON スキーマに準拠
することを保証する機能
プロジェクト時の2026年2月時点で、
AWS Step Functions からの
Converse API 呼び出しに
OutputConfig パラメータを指定できず、
不採用に。
Get validated JSON results from models
Prefill + Stop Sequense
アシスタントメッセージの事前入
力に「```json」、
ストップシーケンスに「```」を
設定する手法
Claude Opus / Sonnet 4.6 以降では
Prefill はサポートされず、エラーを
返すように仕様変更。不採用に。
Tool Use
ツールの使用を強制し、ツールに
入力するJSON を返させる
商品カテゴリなどの抽出したい情報を
入力パラメータに持つツールを定義。
Claude がこのツールを呼び出すことで
JSON が出力される。
⇒ 本プロジェクトではこれを採用


## p.25

24
3つの成功要因その3: LOB のプロジェクト参加
本プロジェクト最大の成功要因
⚫PJ 開始当初から事業部の方々が参加し、
Claude がどのような出力をすればビジネス価値が高いか
ご意見をいただけた。
⚫運用フェーズでもサーバーワークスが支援に入り、
処理パイプラインの改善、Claude の出力評価を実施
②意味をもたせる
PRESERVE
追加の文脈やメタデータを付与し、
価値と検索性を向上
フォルダの階層構造、命名規則、
およびタイムスタンプは、いずれ
も人間とエージェントの両方が、
情報をいつ、どのように活用すべ
きかを理解するのに役立つ重要な
手がかりとなります。


## p.26

25
当社の担当エンジニアが生成AI 活用をサポート
生成AI 運用のお悩みを解決します
AWS 生成AI 運用最適化サービスの紹介
モニタリング基盤の構築運用
MONITOR
・コスト管理
・RAG やエージェント評価
ダッシュボードで可視化。
生成AI システムの品質・予算管理
を実現
環境のチューニング
TUNE
可視化・評価した結果をもとに
生成AI をより良く使っていただ
くための活動
継続的な伴走・ナレッジ提供
SUPPORT
•
継続的なご支援
•
生成AI のアップデートに基づく
ご提案
•
体系的なトレーニング
など
ご要望に応じたご支援をご提供


## p.27

26
Tips: Claude のプロンプトキャッシュ
プロンプトキャッシュを活用できていない場合、10倍損をする
参考：Claude のプロンプトキャッシュの勘所と実プロジェクトでのコスト削減効果
リクエスト
１回目
ツール定義
システム
プロンプト
ユーザー
プロンプト
キャッシュ
チェックポイント
キャッシュ書き込み
（1.25 倍の料金）
通常のInput Token 料金
リクエスト
2回目
ツール定義
システム
プロンプト
ユーザー
プロンプト
キャッシュ
チェックポイント
キャッシュ読み込み
（1/10 の料金）
通常のInput Token 料金
トークン種別
料金
(USD/100万トークン)
通常・キャッシュなし
3.00
キャッシュ書き込み
（5分）
3.75
キャッシュ書き込み
（1時間）
6.00
キャッシュ読み込み
0.30
出力
15.00
Claude Sonnet 4.6 の料金


## p.28

Tips.2 実装


## p.29

28
最初のステップ：スコーピング
Well-Architected Generative AI Lens における生成AI のライフサイクル
1. スコーピング
a. 課題に対して生成AI が適切な解決策か？
b. 業務プロセスのどこに生成AI を活用できる？
c.
目標と成功指標は？
2.
モデル選択
3.
モデルカスタマイズ
4.
開発と統合
5.
デプロイ
6.
継続的な改善


## p.30

29
スモールスタートで成功体験を積む
⚫実現可能性がありハイインパクトな機能に限定しリリースする
⚫モニタリングし、評価する仕組みを最初から導入する
用途を定める
FOCUS
ハイインパクトで実現可能な
ユースケースを見極める
影響力が大きく実現可能なアプリ
ケーションを特定し、ステークホ
ルダーをプロジェクトの目標に整
合させ、成功の測定基準を定める
ことで、開発プロセスの基盤が築
かれます。
AWS Well-Architected Framework Gen AI Lens
Generative AI lifecycle
Day 1 から測る
MEASURE
継続的な改善
LOOP
測定できないものは改善できない
チームがオブザーバビリティに関
して犯しがちな最も重大な間違い
の1 つは、それを「後から追加す
ればよいもの」として扱ってしま
うことです。
AWS Blog:  AI agents in enterprises: Best 
practices with Amazon Bedrock AgentCore
体系的なフィードバックループの
構築
優れた成功基準とは、
1. 具体的であること
2. 測定可能であること
3. ビジネス目標と整合していること
4.  期限が定められていること
である
Anthropic: Building trusted AI in the enterprise


## p.31

30
実装方針：ワークフローかエージェントか？
ワークフロー
決定論的な処理なら、
ワークフロー
ワークフローとは、LLM とツールが
事前に定義されたコードパスを通じて
連携して動作するシステム
エージェント
自律的な判断が必要なら、
エージェント
処理
LLM
処理
LLM
ツール
Anthropic: Building Effective Agents
Anthropic: Building Effective Agents
エージェントとは、LLM がプロセスや
ツールの使用を動的に制御し、タスク
の遂行方法を自ら管理するシステム


## p.32

31
実装方針：ワークフローかエージェントか？
ハルメクHD 様の事例
ワークフロー
⇒シンプル・処理が一貫している
製造業のお客様の事例
エージェント
⇒柔軟な意思決定ができる
LLM
社内ナレッジ
文字おこし
LLM / 分類
LLM / 要約
LLM / 要約
ウェブ検索


## p.33

32
Tips: Adaptive thinking とEffort レベルの概要
⚫Claude Sonnet 4.6 / Opus 4.6 以降のモデルが対象
⚫Adaptive thinking : タスクに対しどれだけ思考するか決定
⚫Interleaved thinking : Tool 呼び出し間など任意のタイミングで思考できる
⚫Effort レベル: 思考の深さを調整できる
Effort
特徴
max
最難関タスクで品質向上が期待できるが、トークン使用量も最大
High
（デフォルト）
トークン消費と知性のバランスが良い
medium
コスト重視。少し知性を妥協して高速化
low
最も速く・低コスト。


## p.34

33
Tips: Effort レベルが変える評価とモデル選択戦略
⚫Effort レベルの登場によって設定のバリエーションが増え、評価の重要性が増した
⚫さらに、アドバイザー戦略によって複数のモデルを組み合わせる手法も登場した
⚫参考: The advisor strategy: Give agents an intelligence boost
Opus
Sonnet
リクエスト
アドバイザー
コスト
実行者
タスク
達成度
: Opus
: Sonnet
赤: high
緑: medium
青: low
費用対効果の高い
スイートスポットを見つける


## p.35

34
サーバーワークスが提供するClaude 活用支援
Claudeの活用をすべてのフェーズでサポート
検討・検証
導入
運用
イベント／ウェビナー
Claude / Amazon Quick など
生成AI をテーマにした
ハンズオンイベント
Claude PoC 支援
評価指標の策定から実現可能
性の検証までトータルで伴走
AWS 生成AI ガイドライン策定
/ 統合管理基盤
個人利用から組織的な活用へ。
生成AI 利用ルールと基盤を
整備
Claude 導入支援
豊富な知見を活かし、お客様の
業務プロセスへClaude を導入
AWS 生成AI 運用最適化サービス
生成AI の運用・コスト管理な
ど、進化の早い生成AI 領域で
継続的に伴走支援
34


## p.36

35
サーバーワークスが提供するClaude 活用支援
ハンズオンイベント
Claude Code on Amazon Bedrock
✓
ハンズオン兼プロトタイピングイベント
✓
Amazon Quick, Dify, Amazon Bedrock など
様々なテーマで実施
✓
80 %以上の参加者が「期待以上」と評価
⇒ スムーズなPoC プロジェクトの開始が可能
✓
スモールスタートでClaude Code を始められる
✓
AWS IAM など既存AWS サービスと統合できる
✓
国内リージョンに閉じて推論できる
⇒ AI 駆動開発の伴走支援も可能


## p.37

Tips.3 セキュリティ・ガバナンス


## p.38

37
セキュリティ対策の大原則は昨年と変わらず
1. 一般的なアプリケーションの
セキュリティ対策の実施
2. スコーピング
3.
OWASP Top 10などのフレーム
ワーク等を活用しリスクを特定
4.
特定したリスクに対し、
セキュリティ施策の実施
AWS Summit 2025: 生成AI 活用で見えてきた3 つの課題～精度・セキュリティ・推進体制～（AP-36）


## p.39

38
セキュリティ対策の大原則は昨年と変わらず
AWS Summit 2025: 生成AI 活用で見えてきた3 つの課題～精度・セキュリティ・推進体制～（AP-36）
1.
一般的なアプリケーションの
セキュリティ対策の実施
2.
スコーピング
3. OWASP Top 10などのフレーム
ワーク等を活用しリスクを特定
4. 特定したリスクに対し、
セキュリティ施策の実施


## p.40

39
増加する生成AI システムの統制をどう効かせるか
カスタマーサポート部
営業部
人事部
QAチャットボット
FAQ 自動生成AI
提案書作成
エージェント
採用面接
エージェント
商談ロープレ
エージェント
社内問合せAI
各部門が独自に生成AI システムを導入・拡大し、全社的な把握が困難に


## p.41

40
増加するAWS アカウントにはどう対応したか？
Security OU
Workloads OU
Infrastructure OU
Log archive
Security tooling
Prod
Network
Test
Shared infra
Management Account
AWS Organizations
AWS ガイドラインと統合管理基盤でマルチアカウント環境下での統制を実現した


## p.42

41
当社では多くのお客様にガイドラインと統合管理基盤を提供


## p.43

42
概要
ビジネスの課題
• 生成AI モデルの選定方針
• Amazon Bedrock の閉域利用
などの方針・環境がない
概要
ソリューション
概要
導入効果
• 既存の統合管理基盤の設計を
守りながら、生成AI の利用
方針を策定
• 閉域網内での生成AI 利用・
ログ保全・運用手順書まで
一体で整備
• 組織が許可した生成AI モデル
の利用制御
• Amazon Bedrock の閉域利用
などセキュリティを重視した
構成を約3か月で展開
建設業のお客様：セキュアな生成AI 基盤の構築
AWS 上でClaude をセキュアに利用可能に
ガバナンスを重視した生成AI 利用環境を約3か月で実現


## p.44

43
生成AI ガイドラインの必要性
（再掲）Gartner®, Press Release, 2025年6月30日「Gartner Survey Finds 45% of Organizations With High AI Maturity Keep AI Projects Operational for at Least Three Years」
https://www.gartner.com/en/newsroom/press-releases/2025-06-30-gartner-survey-finds-forty-five-percent-of-organizations-with-high-artificial-intelligence-maturity-keep-artificial-intelligence-
projects-operational-for-at-least-three-years
GARTNER is a trademark of Gartner, Inc. and its affiliates.
AI に精通している組織の課題
1. セキュリティ
...
8. AI ガバナンス
生成AI を安全に利用するには
• リスクを防ぐ技術
• 組織として標準化する仕組み
が必要


## p.45

44
どのような施策を適用するか組織として標準化する
XX 部
YY 部
ZZ 部
生成AI ガイドライン
生成AI ガイドラインで指針を定め、指針に従いセキュリティ施策を実施していく体制が必要


## p.46

45
AWS 生成AI ガイドライン策定サービスのご紹介
AWS環境に最適化された生成AIガイドラインを導入します
新規作成だけでなく、既存のAWS
ガイドラインとの統合もご依頼可
能です。
POINT
ノウハウ
AWS Well-Architected Generative AI Lens と弊社の豊富な実装ノウハウ
スピード
最短1ヵ月のスピード導入を支援
認定
AWS AIコンピテンシー認定パートナーによる伴奏支援


## p.47

46
ガイドライン項目サンプル（抜粋）
AWS 生成AI ガイドライン策定サービスのご紹介
論点カテゴリ
内容
１
ガバナンス(AI-GV)
全社共通の生成AI利用ルールを定義し、利用状況の透明性と統制を高めます
2
セキュリティ(AI-SEC)
生成AI基盤の権限・防御策を定義し、不正アクセスや攻撃から守ります
3
データアーキテクチャ(AI-DA)
生成AIで扱うデータの分類・利用可否・保管・削除など、データ利用の設計
時ルールをを定義し、機密情報の流出を防ぎます
4
生成AIアプリ開発(AI-APP)
アーキテクチャ設計・実装方針と性能・信頼性・品質基準を定義し、高品質
かつスピーディーなアプリ開発を促進します
5
運用・監視(AI-OPS)
稼働後の生成AI利用を監視・改善するプロセスを定義し、品質と信頼性を維
持します
6
コスト(AI-COST)
生成AI利用中のコストを可視化・制御する施策を定義し、予算超過を防ぎます


## p.48

47
生成AI ガイドラインを定めた方が良いかもしれないお客様の例
AI チャットボット作ったんだけど、
ログは残すべき？
⋯
生成AI の入出力がAWS に保存されても良いか決まっていない
例1
このMCPサーバーって
使ってもいい？
⋯
MCP サーバーの利用基準が決まっていない
例2


## p.49

48
まとめ～明日から実践できる3つのアクション～
AWS の機能、サーバーワークスが提供するソリューションを利用し生成AI活用を推進しましょう！
課題
本日のまとめ
サーバーワークスの
ソリューション
データ品質
• 結果に寄与しないトークンを入力しない
• 情シス・LOB など適切なステークホルダーを巻き込む
AWS 生成AI 運用最適化
サービス
実装
• スコーピング& シンプルに実装する
• 最初から評価の仕組みを入れる
• プロンプトキャッシュを活用してコストを下げる
• ハンズオンイベント・PoC
• Claude 導入支援サービス
• AI駆動開発伴走支援サービス
セキュリティ
ガバナンス
• リスクを防ぐ技術だけでなく、
いつ・どのようなセキュリティ施策を適用するのか、
組織として標準化された指針が必要
AWS 生成AI ガイドライン
策定サービス


## p.51

本セッションのアンケートへ
ご協力をお願いします
Please give us your feedback
Thank you!
PRT231-S
