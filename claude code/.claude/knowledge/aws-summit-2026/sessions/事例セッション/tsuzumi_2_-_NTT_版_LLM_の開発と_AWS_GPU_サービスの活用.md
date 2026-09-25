---
title: "tsuzumi 2 - NTT 版 LLM の開発と AWS GPU サービスの活用"
category: "事例セッション"
session_id: "AIM238"
pages: 35
topics: ["機械学習/MLOps", "生成AI/エージェント"]
services: ["Amazon SageMaker", "SageMaker HyperPod"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/事例セッション/tsuzumi 2 - NTT 版 LLM の開発と AWS GPU サービスの活用.pdf"
---
# tsuzumi 2 - NTT 版 LLM の開発と AWS GPU サービスの活用


## p.1

AIM238
tsuzumi 2 : NTT 版LLM の開発と
AWS GPU サービスの活用
西田京介
NTT株式会社
人間情報研究所上席特別研究員


## p.2

© NTT, Inc.  2026
tsuzumi 2 : NTT 版LLM の開発と
AWS GPU サービスの活用
NTT株式会社人間情報研究所
上席特別研究員西田京介
2026 年6 月26 日


## p.3

2
© NTT, Inc.  2026
目次
1.  NTT の生成AI 戦略とtsuzumi の開発方針
2.  AWS を活用したtsuzumi 2 の開発
3.  今後の展望


## p.4

3
© NTT, Inc.  2026
NTT のAI 戦略: AI For Quality Growth
インフラ、アプリケーション、コンサルティングまでend-to-end でフルスタックで提供


## p.5

4
© NTT, Inc.  2026
国産モデルtsuzumi
tsuzumi は国内のデータ主権を守るソブリンAI として研究開発を実施中


## p.6

5
© NTT, Inc.  2026
tsuzumi 2 アップデート版リリース
NTT では2023 年より大規模言語モデルの開発に取り組んでおります。
2025/10/20 にtsuzumi 2 を提供開始し、2026/05/19 にはアップデート版を発表しました。


## p.7

6
© NTT, Inc.  2026
2018 年10 月末
Google「BERT」、抽出型の読解で人間越え
2021 年1 月
視覚読解モデルを発表、InfoVQA にて2 位
2019 年1 月
生成型の読解モデルを発表、MS MARCO にて首位
2019 年9 月
日本語で当時最大(1.6B) の対話モデルを公開
自然言語処理の研究開始
1980 年
NTT のLLM への挑戦
VisualMRC [Tanaka & Nishida, AAAI’21; cited by 180]
Q. What percentage is roman 
catholic in cape verde?
A. 77.3%


## p.8

7
© NTT, Inc.  2026
2022 年11 月末
OpenAI 「ChatGPT」リリース
2018 年10 月末
Google「BERT」、抽出型の読解で人間越え
2021 年1 月
視覚読解モデルを発表、InfoVQA にて2 位
2019 年1 月
生成型の読解モデルを発表、MS MARCO にて首位
2019 年9 月
日本語で当時最大(1.6B) の対話モデルを公開
2023 年11 月
商用開始
2024 年3 月
2025 年10 月
NTT 版LLM
発表
NTT 版LLM
2 商用開始
自然言語処理の研究開始
1980 年
NTT のLLM への挑戦


## p.9

8
© NTT, Inc.  2026
tsuzumi 2 が目指す個性
日本の産業を支えるソブリンAI となることを目指して研究開発しています
日本の産業を支える
ソブリンAI
①スクラッチから作る
②小型でしっかり学習
④ヒト・AI との協調
③日本語への強み


## p.10

9
© NTT, Inc.  2026
モデルサイズ
GPU 1 枚で動作するパラメータ数として280 億（＝28Billions）を選択
tsuzumi 2
(28B)
tsuzumi 1
(7B)
MoE (Mixture Of Experts):
推論時にモデルの一部を利用
Dense:
推論時に全パラメータを利用
最新モデルの
パラメータ数
推論時のパラメータ数
トータルパラメータ数
1 兆
1,000 億
100 億
10 億
100 億
200 億
300 億
400 億
0


## p.11

10
© NTT, Inc.  2026
トークナイザ
同じ文字列を少ないトークン数で表現し、学習・生成の計算コストを抑える
翌日は何事もなかったかのように
彼はいつものカフェでコーヒーを注文した。
tsuzumi 2 （語彙数128k）で分割
翌日は何事もなかったかのように
彼はいつものカフェでコーヒーを注文した。
GPT-5（語彙数200k）で分割
翌日は何事もなかったかのように
彼はいつものカフェでコー■■ーを注文した。
NTT の形態素解析ノウハウを用いて
日本語文法を考慮した分割
凡例: ■(モデル名)-(語彙サイズ)
日・英・24 言語平均の1 トークンあたりの文字数
(M-)RewardBench「prompt+¥n¥n+chosen」にて測定
0
1
2
3
4
日本語
英語
24言語平均
tsuzumi2-128k
llmjp3-100k
OpenAI-o200k
Llama4-200k
Llama3-128k
Gemma3-256k
Qwen3-152k


## p.12

11
© NTT, Inc.  2026
事前学習コーパス
日本語、英語、コード、数学、多言語などを含む10T トークンを事前学習
自分たちでLLM が学習するデータを把握・コントロール
8.0
9.8
10.0
10.0
14.0
18.0
36.0
0
5
10
15
20
25
30
35
40
Mistral-3-
Small-24B
Phi-4
-14B
tsuzumi-2
-28B
Nemotron-
nano-12B
Gemma-3
-27b
Qwen2.5-
32B
Qwen3-
32B
[Mistral] https://venturebeat.com/ai/mistral-small-3-brings-open-source-ai-to-the-masses-smaller-faster-and-cheaper
tsuzumi 2
学習トークン数[Billion]


## p.13

12
© NTT, Inc.  2026
事後学習: 指示遂行
日本語ではgpt-5 に次ぐスコア、他言語でも高い水準
0
0.2
0.4
0.6
0.8
1
日本語
英語
フランス語
スペイン語
tsuzumi-2
gemma-3-27b-it
Qwen3-32B
gpt-oss-20b
gpt-oss-120b
gpt-4o
gpt-5
Instruction/Prompt-Strict/Looseの平均。全モデルデフォルト生成パラメータにて測定
M-ifeval


## p.14

13
© NTT, Inc.  2026
ニュースリリース文章の改善
AI 技術に関する専門的なニュースリリースの文章をLLMにより修正提案を行うタスク
[ニュースリリース文面(3,747 文字)]
---
このプレスリリースの概要を表にして整理してください。
プレスリリースの対象読者について、読者像を明らかにしてください。
その次に、プレスリリースの技術説明（背景～今後の展開）の内容に関して、アピー
リングか否か、の観点で良い点と改善点を詳細に示してください。
見つかった改善点については、セクション名、原文、修正文章、修正文の解説、要修
正度（5段階を★の個数で表現）を階層的なリスト形式で詳細に示してください。
最後に、「発表のポイント」の3項目について、原文を示した後で、さらにアピーリン
グな3 項目（ですます調）にするとともに、このポイントを踏まえて具体的なネクス
トアクションを考えてください。
LLM へのプロンプト（指示）


## p.15

14
© NTT, Inc.  2026
ニュースリリース文章の改善(応答の比較)
指示：セクション名、原文、修正文章、修正文の解説、要修正度（5段階を★の個数で表現）を階層的なリスト形式で詳細に示して
gpt-oss-20b
tsuzumi 2
・指示を守らず表で整理、
・原文から情報が多めに欠落
・指示通りリストで整理
・原文で伝えたいことを維持
しながら、わかりやすく修正


## p.16

15
© NTT, Inc.  2026
目次
1.  NTT の生成AI 戦略とtsuzumi の開発方針
2.  AWS を活用したtsuzumi 2 の開発
3.  今後の展望


## p.17

16
© NTT, Inc.  2026
これまでの主なAWS の利用
tsuzumi の研究開発において、複数回にわたってAWS を活用しております。
特に、AWS Japan の支援プログラムにより研究開発を大きくサポート頂きました
2023年
2024年
2025年
2026年
tsuzumi の事前学習に向けた利用
• P5 インスタンス（H100 GPU 搭載）を使い、短期間で集中的にモデル学習を実施
• AWS LLM 開発支援プログラムによる、コスト・技術面でのサポート
tsuzumi 2 の事後学習に向けた利用
• P5en インスタンス（H200 GPU 搭載）を使い、短期間で集中的にモデルをチューニング
• AWS 生成AI 実用化推進プログラムによる、コスト・技術面でのサポート
• AWS ParallelCluster に加え、Amazon SageMaker HyperPod を活用


## p.18

17
© NTT, Inc.  2026
AWS LLM 開発支援プログラム(2023)
tsuzumi の事前学習に向けてGPU クラスタをAWS にて調達して活用させて頂きました。
https://aws.amazon.com/jp/blogs/news/llm-development-support-program-launch/
2024/01/31 報告会資料


## p.19

18
© NTT, Inc.  2026
テクニカルサポートの充実
2023 年当時、発表直後のH100 GPUs を用いたクラスタの利用に関して、Specialist Team の皆様に学習ラ
イブラリの動作検証や、新規GPU に伴うデバイスドライバの問題の検証を迅速に解決いただきました。
GPU クラスタを用いたLLM 学習には予想も付かないトラブルが発生しますが、AWS の担当チームメン
バーが支援を越えて伴走頂いたお陰でLLM 開発がスムーズに進みました。


## p.20

19
© NTT, Inc.  2026
AWS 生成AI 実用化推進プログラム(2025)
「モデルカスタマイズコース」にて計算リソースの迅速な調達とクラスタの構築を支援頂きました。
特に、事後学習に関する環境として活用させて頂きました。
推進プログラム概要
• GPU 等コンピューティングリソースの
調達支援
• 分散トレーニング環境構築支援
• 計算機リソースの費用に充てられる
AWS クレジットの提供
• 各種AWS イベントへの出展や講演機会
の提供
• AWS Marketplace を通じたモデルの
GTM の支援
• etc.


## p.21

20
© NTT, Inc.  2026
事後学習の改善サイクル
教師あり学習・アラインメント学習・評価をトータル数百回実施して、性能改善の試行錯誤を行うため
にAWS 環境をフル活用。オンデマンドに発生する部分も多く、迅速な環境調達が鍵となった。
Alignment
モデル
SFT モデル
Alignment
モデル
SFT モデル
Alignment
モデル
SFT モデル
Alignment
モデル
SFT モデル
データ・
設定の調整
教師有
学習
評価
アライン
メント


## p.22

21
© NTT, Inc.  2026
迅速なGPU 調達
「モデルカスタマイズコース」にて計算リソースの迅速な調達とクラスタの構築を支援頂きました。


## p.23

22
© NTT, Inc.  2026
Amazon SageMaker HyperPod
最新のAWS利用時はHyperPod を導入してGPU クラスタを構築しました


## p.24

23
© NTT, Inc.  2026
LLM 学習の難しさ
GPU クラスタを用いたLLM の長期間学習では、故障やプログラムの異常終了は避けられず、時には大
変なトラブルも発生してしまう
ステップ数
とある環境での学習の様子
色分け＝ジョブ再起動を意味する
損失関数


## p.25

24
© NTT, Inc.  2026
目次
1.  NTT の生成AI 戦略とtsuzumi の開発方針
2.  AWS を活用したtsuzumi 2 の開発
3.  今後の展望


## p.26

25
© NTT, Inc.  2025
今後の方向性
あらゆる環境で、人と自然に共生可能な汎用AI の思考エンジンを創り、
人々のwell-being を実現したい
計算機の中のコラボレーターとして，
人と協動できるソフトウェアロボット
人生のパートナーとして，
人と一緒に成長するロボット


## p.27

26
© NTT, Inc.  2025
今後の方向性
tsuzumi はどう進化するべきか？
1
2
人と共に日々成長するAIへ
社会に自然に受けいられるAIへ


## p.28

27
© NTT, Inc.  2025
社会に自然に受け入れられるために
言語モデルを中心に、Agentic Loop を構築し人に寄り添う知能体系へ
世界
認知
行動
知覚
触覚、嗅覚、etc…
ロボティクス
PC 操作・ツール呼出
言語・画像・音声生成
音声、動画
画像
他者理解
世界モデル


## p.29

28
© NTT, Inc.  2025
VDocRAG [Tanaka (NTT) +, CVPR’25]
スライドや文書を画像のまま検索・理解して応答する
質問をすると、関連する文書画像を発見
文書と質問を与え、回答を生成
Ryota Tanaka, Taichi Iki, Taku Hasegawa, Kyosuke Nishida, Kuniko Saito, Jun Suzuki:
VDocRAG: Retrieval-Augmented Generation over Visually-Rich Documents. CVPR 2025: 24827-24837


## p.30

29
© NTT, Inc.  2025
ToMATO [Shinoda (NTT) +, AAAI’25]
相手の気持ちが分かる「心の理論」のベンチマークの作成およびLLMの評価
可視化されたA とB の対話
B が考える
A が心の中で考えている事
A が心の中で考えている事
Kazutoshi Shinoda, Nobukatsu Hojo, Kyosuke Nishida, Saki Mizuno, Keita Suzuki, Ryo Masumura, Hiroaki Sugiyama, Kuniko Saito: 
ToMATO: Verbalizing the Mental States of Role-Playing LLMs for Benchmarking Theory of Mind. AAAI 2025: 1520-1528


## p.31

30
© NTT, Inc.  2025
人と共に成長するために
日々変動していくビジネス情報にどう適応するか
RAG:
参考文書を
準備
外部知識の参照
プロンプト
チューニング:
プロンプトを
調整
参照
継続
事前学習:
大量のコー
パスを準備
モデルパラメータの更新
ファイン
チューニング:
学習データを
準備
学習
LLM
最新/専門知識の不足
事前学習で獲得した
知識には限りがある
モデルの大規模化
学習に要する費用・
時間が膨大
LLMの更新に関する課題
学習コストの軽減が必要


## p.32

31
© NTT, Inc.  2025
Portable Reward Tuning
異なるモデルで再利用（ポータブル）可能な「報酬モデル」のチューニング法
[Chijiwa＆
Hasegawa(NTT)+,ICML’25]
基盤モデル
Ver. 1
基盤モデル
Ver. 2
①各ドメイン・タスクに
特化した「報酬モデル」
を学習
②基盤モデルの更新
●知識の修正
●バイアスの修正
●脆弱性の修正
●異なるサイズ・構造
※語彙(トークナイザ)
は共有
③報酬モデルを
再利用
追加学習は不要
Daiki Chijiwa, Taku Hasegawa, Kyosuke Nishida, Kuniko Saito, Susumu Takeuchi:
Portable Reward Tuning: Towards Reusable Fine-Tuning across Different Pretrained Models. ICML 2025


## p.33

32
© NTT, Inc.  2025
ウェーブレット位置符号化
「短く学習・長く生成」を可能にする新手法の提案、事前学習コストを低減
Yui Oka, Taku Hasegawa, Kyosuke Nishida, Kuniko Saito:
Wavelet-based Positional Representation for Long Context. ICLR 2025
[Oka (NTT)+, ICLR’25]


## p.34

33
© NTT, Inc.  2025
1. 日本の産業を支えるソブリンAI を目指してLLM
の研究開発を進めています。
2. AWS の強みを生かして、tsuzumi 2 の研究開発
に活用しています。
3. 社会に受け入れられる、人と共に成長するAIの
実現を目指して、今後も挑戦していきます。
おわりに


## p.35

本セッションのアンケートへ
ご協力をお願いします
Please give us your feedback
Thank you!
AIM238
