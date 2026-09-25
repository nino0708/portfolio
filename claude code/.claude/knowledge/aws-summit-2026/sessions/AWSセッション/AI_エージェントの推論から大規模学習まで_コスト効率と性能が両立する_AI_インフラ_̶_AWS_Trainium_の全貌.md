---
title: "\"AI エージェントの推論から⼤規模学習まで\" コスト効率と性能が両⽴する AI インフラ ̶ AWS Trainium の全貌"
category: "AWSセッション"
session_id: "AIM360"
pages: 47
topics: ["機械学習/MLOps", "生成AI/エージェント", "運用/SRE"]
services: ["Amazon EC2", "Claude", "Inferentia", "Kiro", "Trainium"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/AWSセッション/\"AI エージェントの推論から⼤規模学習まで\" コスト効率と性能が両⽴する AI インフラ ̶ AWS Trainium の全貌.pdf"
---
# "AI エージェントの推論から⼤規模学習まで" コスト効率と性能が両⽴する AI インフラ ̶ AWS Trainium の全貌


## p.1

AIM360
"AI エージェントの推論から⼤規模学習まで" 
コスト効率と性能が両⽴する AI インフラ ̶
 AWS Trainium の全貌
澤亮太
アマゾンウェブサービスジャパン合同会社


## p.2

澤亮太
アマゾンウェブサービスジャパン合同会社
技術統括本部
エンタープライズ技術本部
⾃動⾞・製造グループ
⻄⽇本ソリューション部
ソリューションアーキテクト
・主に製造業のお客様を担当
・前職では、主に Computer Vision 領域での
    Deep Learning を⽤いたアルゴリズム開発、
    AI⼈材の育成などを推進
⾃⼰紹介


## p.3

調達リードタイム
学習・推論コスト
運⽤負荷
申し込みから数ヶ⽉待ち
クラウドでも簡単に
GPU を確保できない⽇が続く
学習1 回で数百万円
API 課⾦も積み上がる
インフラの運⽤監視
ハードウェアの
メンテナンスや⽼朽化
計算機リソースに満⾜できていますか︖
⽣成AI の学習・推論コスト、GPU の確保などに
頭を悩ませた経験はありませんか︖


## p.4

LLM 開発・学習
AI エージェント実装
Physical AI の学習
⼤規模⾔語モデルの事前学習
ドメイン特化ファインチューニング
RLHF / DPO による強化学習
マルチモーダルモデル学習
AI エージェントによる推論回数の増加
RAG・マルチステップ推論の普及
レイテンシー・コスト最適化ニーズ
vLLM 等のOSS フレームワーク活⽤
ロボット・VLA モデルの学習
⼤量のデモデータから⾏動を学習
最近特に注⽬のユースケース
GPU が必要なワークロードは増え続けている


## p.5

① データ収集
シミュレーション
② モデルの学習
③ 推論・配信
実機デモ収集
Isaac Sim / Lab
シミュレーション環境
GPU (G7e 等) が必要
VLA モデルの事前学習
LoRA / フルファインチューニング
強化学習(RLHF)
エッジ(Jetson) での推論
クラウド推論(LLM ⽤途)
AWS IoT Greengrass
GPU (G 系) が主流
例えば Physical AI 開発の
学習フェーズに注⽬すると


## p.6

① データ収集
シミュレーション
② モデルの学習
③ 推論・配信
実機デモ収集
Isaac Sim / Lab
シミュレーション環境
GPU (G7e 等) が必要
VLA モデルの事前学習
LoRA / フルファインチューニング
強化学習(RLHF)
エッジ(Jetson) での推論
クラウド推論(LLM ⽤途)
AWS IoT Greengrass
GPU (G 系) が主流
例えば Physical AI 開発の
学習フェーズに注⽬すると
学習フェーズのコストや確保が問題に…
AWS で解決する術はあるのか︖


## p.7

① データ収集
シミュレーション
② モデルの学習
③ 推論・配信
実機デモ収集
Isaac Sim / Lab
シミュレーション環境
GPU (G7e 等) が必要
VLA モデルの事前学習
LoRA / フルファインチューニング
強化学習(RLHF)
エッジ(Jetson) での推論
クラウド推論(LLM ⽤途)
AWS IoT Greengrass
GPU (G 系) が主流
例えば Physical AI 開発の
学習フェーズに注⽬すると
学習フェーズのコストや確保が問題に…
AWS で解決する術はあるのか︖
AWS Trainium が解決に導く


## p.8

・AWS が提供する独⾃シリコンとは
・よくあるTrainium の使い⽅
・何から始められるか︖
アジェンダ


## p.9

AWS が提供する独⾃シリコンとは


## p.10

AWS は独⾃のシリコンを設計・製造しています
GRAVITON
GRAVITON2 GRAVITON3
GRAVITON4
AWS Graviton 
• ARM コア搭載プロセッサ
• クラウドネイティブなワークロードに最適化
2018
GRAVITON5
INFERENTIA
TRAINIUM
TRAINIUM2
AWS Trainium / Inferentia 
• 機械学習向けアクセラレータ
• 低コスト、⾼い電⼒効率、持続可能な AI 基盤を実現
2019
TRAINIUM3
NITRO
NITRO v2
NITRO v6
AWS Nitro System
• Amazon EC2 独⾃の仮想化基盤
• 共通処理を専⽤ハードウェアに
オフロード
2013
NITRO v4
NITRO v3
NITRO v5
2024
2025
2025


## p.11

• インフラをチップレベルから設計することで、性能、コスト、電⼒効率を最適化
• 仕様策定から導⼊までのスピード向上、市場のニーズに柔軟に対応
• 独⾃の半導体開発により、さらなるイノベーションが可能に
なぜ独⾃シリコンへの投資を続けるのか︖
性能
コスト
可⽤性
電⼒効率
使いやすさ
「モデルの開発には数週間から数ヶ⽉かかる」
「開発したいがコストが・・・」
「計算リソースはすぐに確保できる︖」
「演算性能が増⼤し、消費電⼒も深刻に」


## p.12

⾃社設計 AI アクセラレータの歴史
推論専⽤アクセラレータ
としてリリース
Amazon Alexa 等で活⽤
2019
Inferentia
⼤規模⾔語モデルの分散
学習、分散推論環境を低
価格で実現
Inferentia と⽐較し 5倍
のトランジスタ、HBM
メモリ搭載
2021
Trainium /
Inferentia2
Trainium と⽐較して、
4倍の性能、3倍のメモ
リ容量、2倍の電⼒効率
を実現
2023
Trainium2
初の 3nmプロセス採⽤
1.5倍のメモリ容量、
1.7倍の帯域幅
MXFP8 およびMXFP4
データタイプに対応
2025
Trainium3
Trainium2 以降は学習・推論の両⽅に対応


## p.13

AWS Trainium を
使ったことがありますか︖


## p.14

Anthropic to secure up to 5 gigawatts of 
Trainium capacity through AWS infrastructure
https://www.aboutamazon.com/news/company-news/amazon-invests-additional-5-billion-anthropic-ai
April 20, 2026


## p.15

OpenAI to consume 2 gigawatts of Trainium capacity 
through AWS infrastructure
https://www.aboutamazon.com/news/aws/amazon-open-ai-strategic-partnership-investment
February 27, 2026


## p.16

PROJECT RAINIER
2025年、
1,000,000 over
のチップが導⼊完了
世界最⼤規模の
AI コンピュート
クラスタ


## p.17

記録的なペースで Trainium2 を展開
3x
AWS 生成 AI キャパシティ
4x
より速いキャパシティの拡⼤
時間
Amazon EC2 Trn2
これまでの AWS AI 向けインスタンス
より多くのキャパシティ


## p.18

Trn2 は Claude Sonnet 4.5 で
最も⾼い Output Tokens Per Second を提供
Trn2 は
Claude Sonnet 4.5 で
平均的に⾼い 
OTPS を実現
(出⼒トークン毎秒)
0
10
20
30
40
50
60
70
80
90
100
Vision / single
image
Medium / coding
100 input tokens
1k input tokens
10k input tokens
100k input tokens
Claude Sonnet 4.5 (reasoning) OTPS
Other Hyperscaler
Amazon


## p.19

AWS が⾃社開発した第 3 世代の⽣成AI / ML アクセラレータ
2024 年⼀般提供開始
HBM 容量
HBM 帯域幅
Dense / Sparse compute
Trn2 : Trainium2 搭載インスタンス
•
最大 16 個のTrainium2 を搭載 (Trn2.48xlarge)
•
同等のインスタンスと⽐較し
30%-40% ⾼いコスト性能を実現
•
最⼤ 1.5 TB の⾼速HBM3 メモリ搭載
•
3,200 Gbps のネットワーク帯域に対応
•
Anthropic社 Claude モデルは Trainium2 上にデプロイ
AWS Trainium2


## p.20

AWS が⾃社開発した第 4 世代の⽣成AI / ML アクセラレータ
AWS Trainium3
2025 年⼀般提供開始
HBM 容量
HBM 帯域幅
MXFP8 compute
次世代のエージェント型 AI、推論、
動画⽣成アプリケーションに
最⾼のトークンエコノミクスを実現する


## p.21

調達リードタイム
学習・推論コスト
運⽤負荷
申し込みから数ヶ⽉待ち
クラウドでも簡単に
GPU を確保できない⽇が続く
学習1 回で数百万円
API 課⾦も積み上がる
インフラの運⽤監視
ハードウェアの
メンテナンスや⽼朽化
計算機リソースに満⾜できていますか︖
⽣成AI の学習・推論コスト、GPU の確保などに
頭を悩ませた経験はありませんか︖
再掲


## p.22

調達リードタイム
学習・推論コスト
運⽤負荷
キャパシティの強化
コスト効率と性能を求めた
独⾃シリコンの開発
インフラ運⽤の⼤部分を
AWS に任せられる


## p.23

調達リードタイム
学習・推論コスト
運⽤負荷
キャパシティの強化
コスト効率と性能を求めた
独⾃シリコンの開発
インフラ運⽤の⼤部分を
AWS に任せられる


## p.24

よくある Trainium の使い⽅


## p.25

あなたはどれが当てはまりますか︖
よくある Trainium の使い⽅
Native PyTorch
コードはそのままで
学習コストは下げたい
⼤規模モデルを
分散学習したい
パフォーマンスを
最⼤限引き出したい
カーネルレベルで
最適化したい
Neuron Kernel Interface (NKI)
+ Neuron Explorer
vLLM on Trainium
推論コストを
固定にしたい
“簡単に” Trainium 上へ
モデルをデプロイしたい


## p.26

Native PyTorch
[ Beta ]
•
既存GPU コードをそのまま動かせる
•
PrivateUse1 デバイスバックエンド
経由の統合
•
オープンソース実装
•
簡単なデバイス切り替え
典型的な GPU 向け PyTorch コード
デバイス名を neuron にアップデート
TorchNeuron
コードはそのままで学習コストは下げたい


## p.27

torch.accelerator を使⽤するモダンなアプ
ローチは、Neuron 上でそのまま動作可能
Native PyTorch
[ Beta ]
TorchNeuron
コードはそのままで学習コストは下げたい
•
既存GPU コードをそのまま動かせる
•
PrivateUse1 デバイスバックエンド
経由の統合
•
オープンソース実装
•
簡単なデバイス切り替え


## p.28

分散処理 API（torch.distributed）
• FSDP (Fully Sharded Data Parallel)
• DTensor (Distributed Tensor)
• DDP (Distributed Data Parallel)
torch.compile
• JIT コンパイルによる性能向上
TorchTitan 
• PyTorchの分散学習フレームワーク
• ⼤規模モデルの学習に最適化
PyTorch 標準 API の
ネイティブサポート
Native PyTorch
[ Beta ]
TorchNeuron
⼤規模モデルを分散学習したい


## p.30

性能を最適化したい
Neuron Kernel 
Interface (NKI)
•
Python ベースのプログラミングイン
ターフェース
•
PyTorch、JAX で利⽤可能な最適化済
みのオープンソースカーネル
•
AWS Trainium ハードウェア
命令セットへの直接アクセスにより、
最適化された AI カーネルの記述が可能


## p.31

性能を最適化したい
Neuron 
Explorer
•
パフォーマンス最適化と
デバッグのワークフロー全体
を⽀援するツール群
•
Widgetベースのレイアウトにより
操作性と視認性が向上
•
Webアプリケーション、
またはVSCodeから利⽤可能


## p.32

Neuron Explorer でボトルネックを⾒つけ、
NKI で速くする
Qwen3-235B-A22B モデルのトークン⽣成部分を Nueron Explorer で精査
アノテーション機能を⽤いて
対象区間を計測
アテンションブロックの
実⾏が 117μs と判明
NKI によるFlash Attention 
カーネルの利⽤を決断


## p.33

Neuron Explorer でボトルネックを⾒つけ、
NKI で速くする
117µs から 76µs に短縮
Qwen3-235B-A22B / 
2 番⽬のアテンションブロックの実⾏時間が
なし
あり
NKI によるFlash Attention カーネル利⽤ 
NKI なし
NKI あり


## p.34

性能を最適化したい
Neuron Agentic
Development
NKI 開発をAI エージェントで加速する
オープンソースツールキット
•
NKI カーネルの作成・デバッグ・
プロファイリングを⾃動化
•
PyTorch / NumPy / ⾃然⾔語から 
NKI カーネルを⽣成
•
コンパイルエラーの⾃律的な分析と修正
•
Kiro / Claude Code にデプロイ可能
Agents
neuron-nki-agent
NKI 開発の全サイクルを統合管理
neuron-nki-writer-agent
カーネル作成・修正の⾃動化
neuron-nki-debugger-agent
コンパイルエラーの⾃律デバッグ
neuron-nki-profile-analysis-agent
プロファイル取得と性能分析
Skills
neuron-nki-writing
カーネル新規作成・編集
neuron-nki-debugging
コンパイルエラーのデバッグ
neuron-nki-profiling
ハードウェア上の性能プロファイル
neuron-nki-docs
NKI ドキュメント検索・API 参照
neuron-nki-profile-querying
プロファイルデータのSQL 分析
https://github.com/aws-neuron/neuron-agentic-development
https://aws.amazon.com/blogs/machine-learning/stop-hand-tuning-kernels-how-neuron-agentic-
development-accelerates-aws-trainium-optimizations/


## p.36

vLLM Neuron Inference
推論コストを固定にしたい
•
Trainium 上でモデルを稼働し
⼤きなワークロードでも
固定コストで推論が可能に
vLLM on 
Trainium


## p.38

あなたはどれが当てはまりますか︖
よくある Trainium の使い⽅
再掲
Native PyTorch
コードはそのままで
学習コストは下げたい
⼤規模モデルを
分散学習したい
パフォーマンスを
最⼤限引き出したい
カーネルレベルで
最適化したい
Neuron Kernel Interface (NKI)
+ Neuron Explorer
vLLM on Trainium
推論コストを
固定にしたい
“簡単に” Trainium 上へ
モデルをデプロイしたい


## p.39

何から始められるか︖


## p.40

Amazon EC2 にて
Capacity Blocks for ML または Spot Intances で提供中
 
まずは Trn2 インスタンスをお試し下さい︕
インスタンス
タイプ
スペック
対応リージョン
料⾦ / 時間
Trainium2
HBM3
EFA 帯域
Capacity Blocks
Spot
Trn2.3xlarge
1
96 GB
-
MEL (ap-southeast-4) 
$2.235
$6.1818
GRU (sa-east-1) 
-
$0.9026
Trn2.48xlarge
16
1.5 TB
3,200 Gbps
CMH (us-east-2) 
$35.76
$8.5964
※ 2026 年 5 ⽉時点の価格 - 需要と供給の傾向に基づいて定期的に更新
🔰 初期 PoC に最適
Spot にも対応 !
Capacity Blocks for ML ‥ 必要なキャパシティを将来の⽇付で⼀定期間、低コストで確保するための仕組み
Spot Intances ‥予備の EC2 キャパシティを活⽤し、中断の可能性はあるがオンデマンド⽐最⼤ 90% 割引で利⽤可能。


## p.41

2023  - 「AWS LLM 開発⽀援プログラム」にて Trainium を活⽤し、
         Llama2 70B をベースとしたモデル「KARAKURI LM」を開発
            ・本プログラムでは成功裏に完了した 15 社中 12 社が Trainium を活⽤
2024  -  Mixtral 8x7B MoE、Qwen2.5-VL へ早々に独⾃対応し
              世界で初めて Trainium で MoE モデルを学習した「KARAKURI LM 8x7B Chat v0.1」を公開
2025  -  ⽇本企業初の Computer-Using Agent (CUA)「KARAKURI VL」を Trainium2 で開発・公開
2026  -  経産省「GENIAC」第 3 期で CUA モデル「KARAKURI VL2」を Trainium2 で開発・公開
Trainium のノウハウも「AWS Trainium 50 本ノック」として blog で公開されています︕
https://zenn.dev/karakuri_blog/articles/77d93c40b27b60
カラクリ社での Trainium 活⽤事例


## p.42

re:Invent 2025 Keynote 
独⾃半導体開発への投資は継続


## p.43

GPU が必要なワークロードは増え続けている
• AWS は独⾃のシリコンを設計・製造している
• AWS Trainium はAI 基盤の新しい選択肢に
Trainium は、さまざまなシーンで使える
• Native PyTorch で既存GPU コードをそのまま実⾏できる
• vLLM on Trainium で推論コストを固定に
など
まずは Spot Intances で提供中の
trn2.3xlarge からPoC を始めてみて下さい︕
まとめ


## p.44

https://aws.amazon.com/jp/blogs/news/neuron-community-day-one/
https://aws.amazon.com/jp/blogs/news/neuron-community-vol-2/
https://discord.gg/DUx4g3Z3pq
コミュニティへの
参加はこちらから
Neuron Community


## p.45

Exhibition Booth Information
展⽰ブースのご案内
A125
⽣成AI を⽀えるインフラ技術
AWS Village①


## p.46

Ask the Speaker
こちらのRoom 後⽅の外側にございます、
「Ask the Speaker」カウンターまでお越しください
澤亮太
アマゾンウェブサービスジャパン合同会社
Room


## p.47

本セッションのアンケートへ
ご協⼒をお願いします
Please give us your feedback
Thank you!
AIM360
