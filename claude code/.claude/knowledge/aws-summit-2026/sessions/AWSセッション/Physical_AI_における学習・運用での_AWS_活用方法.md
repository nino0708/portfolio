---
title: "Physical AI における学習・運用での AWS 活用方法"
category: "AWSセッション"
session_id: "AIM328"
pages: 61
topics: ["機械学習/MLOps", "生成AI/エージェント"]
services: ["AWS Batch", "AgentCore", "Amazon Bedrock", "Amazon CloudWatch", "Amazon EC2", "Amazon FSx", "Amazon S3", "Amazon SageMaker", "Claude", "SageMaker HyperPod", "Strands Agents"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/AWSセッション/Physical AI における学習・運用での AWS 活用方法.pdf"
---
# Physical AI における学習・運用での AWS 活用方法


## p.1

AIM328
Physical AI における学習・運用での
AWS 活用方法
大前遼
アマゾンウェブサービスジャパン合同会社


## p.2

• Physical AI とは
• なぜPhysical AI が注目されているのか
• Physical AI の全体構成
• AWS でのPhysical AI 構成
• まとめ
Agenda


## p.3

自己紹介
大前遼(おおまえりょう)
ソリューションアーキテクト
技術統括本部ストラテジックエンタープライズ本部
自動車・製造第二ソリューション部
アマゾンウェブサービスジャパン合同会社
強化学習による半導体結晶の自動操業、計算論的神経科学
得意領域: 機械学習・生成AI 
好きなAWS サービス
Amazon SageMaker
Amazon Bedrock


## p.4

ターゲット
• Physical AI に興味があり、具体的に何ができるのか、自分たちの業務に
どう活用できるのかを知りたい方。
• Physical AI を利用したプロダクトの開発者
ゴール
• Physical AI が実現できること、および、どのように実現するのかを
知っていただく。
• AWS を利用して、Physical AI を実現する方法を知っていただく。
ターゲット・ゴール


## p.5

「物理世界を知覚し、推論し、学習しながら、自律的に行動するシステム」
これまで自動化が難しかった領域で活用が期待されている
Physical AI とは
[IMAGE: Agility Robotics Digit が
倉庫でトートを運んでいる写真]
Agility Robotics
倉庫でのヒューマノイド活用
人と協働可能なヒューマノイドロ
ボットを開発し、倉庫で商用デプ
ロイしている[1]。
Diligent Robotics
自律ロボットでの医薬品配送
病院内での自立配送ロボット
25 以上の病院で100 万件超の
自律デリバリーを実施した[2]。
Amazon Robotics
物流で大規模フリートを運用
100 万台以上のロボットを展開し
在庫処理速度最大75% 向上、
注文処理時間最大25% 短縮[3]。
[1] https://aws.amazon.com/startups/learn/how-agility-robotics-scales-ai-model-training-for-next-generation-humanoid-robots-using-aws
[2] https://aws.amazon.com/jp/blogs/news/physical-ai-building-the-next-foundation-in-autonomous-intelligence/
[3] https://www.aboutamazon.jp/news/delivery-and-logistics/amazon-million-robots-ai-foundation-model


## p.6

ヒューマノイドによるパルクール: 
障害物を乗り越える方法を自ら考え、
行動できる[5]
Amazon におけるPhysical AI の最先端事例
Vulcan (Amazon Robotics): 
触覚センサーを備え、最適な箇所に
物品を搬入するための基盤モデル[4]
[4] Amazon Robotics, https://www.aboutamazon.com/news/operations/amazon-vulcan-robot-pick-stow-touch
[5] Amazon FAR, https://youtu.be/IjeBnbm9sto


## p.7

現在の産業ロボット
• 座標や動作を人が指示
• 高精度・高速・安定
• 定型作業を得意とする
Physical AI と現在のロボットとの違い
Physical AI を利用することで、より柔軟かつ自律的な動きを実現可能
Physical AI を備えたロボット
• 学習データに基づく適応的動作
• 大量データからのパターン学習
• 汎用的なタスクに流用可能
• 環境変化への適用性


## p.8

Physical AI の適用領域マップ
構造化環境での適応(例: AMR 群制御)
高度な自律性が必要(例: 介護ロボット)
決定論的自動化(例: 部品溶接など)
遠隔操作型ロボット(例: 手術支援)
ロボットの適応的判断が必要なタスク
人間により定義可能なタスク
固定された環境
変動する環境


## p.9

Physical AI の適用領域マップ
構造化環境での適応(例: AMR 群制御)
高度な自律性が必要(例: 介護ロボット)
決定論的自動化(例: 部品溶接など)
遠隔操作型ロボット(例: 手術支援)
ロボットの適応的判断が必要なタスク
人間により定義可能なタスク
固定された環境
変動する環境
特にPhysical AI が要求される領域


## p.10

• Physical AI とは
• なぜPhysical AI が注目されているのか
• Physical AI の全体構成
• AWS でのPhysical AI 構成
• まとめ
Agenda


## p.11

なぜPhysical AI なのか
生産年齢人口の急減
• 2030年までに約400万人減少予測
ロボット導入を後押しする技術革新
• コストの低下:直近10 年で価格が約50% 低下
• 相互接続性の向上: ROS2 をはじめとした
標準化への対応が進展
• 機械学習技術の発展: ロボットビジョン・ロ
ボット基盤モデルなどの技術発展
参考1 : 厚生労働省「我が国の人口について」
https://www.mhlw.go.jp/stf/newpage_21481.html
参考2 : ARK Invest「BIG IDEAS 2019」レポート
https://research.ark-
invest.com/hubfs/1_Download_Files_ARK-
Invest/White_Papers/Big-Ideas-2019-ARKInvest.pdf


## p.12

なぜ今Physical AI に取り組むべきなのか
1
市場の成長性
AI Robots 市場は2034 年までに$124.26B（約18 兆円）規模へ成長予測
2
高い導入効果
Amazon 自社サプライチェーン: 25% の効率向上
組み立て製造企業: 製造デプロイ時間40% 短縮
ヘルスケア: AI 支援手術で合併症30% 減少、手術時間25% 短縮
3
データ・ノウハウ蓄積の先行優位性
運用データ→モデル改善→性能向上→さらに良いデータの自己強化サイクル
早期投資= データ蓄積の先行者優位


## p.13

• Physical AI とは
• なぜPhysical AI が注目されているのか
• Physical AI の全体構成
• AWS でのPhysical AI 構成
• まとめ
Agenda


## p.14

エージェンティックAI 
目的や情報をもとに推論し、
何をどうやって実行するか
計画を立案する
Physical AI の全体像
全体を統括する低速なエージェンティックAI と、高速(数十Hz) なロボット基盤モデルを
組み合わせて、高度なタスクを実現する
ロボット基盤モデル
指示やセンサーデータを知覚し、
制御や動作を生成する


## p.15

エージェンティックAI 
目的や情報をもとに推論し、
何をどうやって実行するか
計画を立案する
Physical AI の全体像
全体を統括する低速なエージェンティックAI と、高速(数十Hz) なロボット基盤モデルを
組み合わせて、高度なタスクを実現する
ロボット基盤モデル
指示やセンサーデータを知覚し、
制御や動作を生成する
リクエスト: 
コーヒーが飲みたい


## p.16

エージェンティックAI 
目的や情報をもとに推論し、
何をどうやって実行するか
計画を立案する
Physical AI の全体像
全体を統括する低速なエージェンティックAI と、高速(数十Hz) なロボット基盤モデルを
組み合わせて、高度なタスクを実現する
ロボット基盤モデル
指示やセンサーデータを知覚し、
制御や動作を生成する
依頼達成のためには、
コーヒーマシンでカップに
淹れて、ユーザーに手渡そ
う


## p.17

エージェンティックAI 
目的や情報をもとに推論し、
何をどうやって実行するか
計画を立案する
Physical AI の全体像
全体を統括する低速なエージェンティックAI と、高速(数十Hz) なロボット基盤モデルを
組み合わせて、高度なタスクを実現する
ロボット基盤モデル
指示やセンサーデータを知覚し、
制御や動作を生成する
ロボットA は
コーヒーカップを掴ん
でマシンにセットして


## p.18

エージェンティックAI 
目的や情報をもとに推論し、
何をどうやって実行するか
計画を立案する
Physical AI の全体像
全体を統括する低速なエージェンティックAI と、高速(数十Hz) なロボット基盤モデルを
組み合わせて、高度なタスクを実現する
ロボット基盤モデル
指示やセンサーデータを知覚し、
制御や動作を生成する
5 秒でx,y,z まで動かし、
ハンドを閉じて...


## p.19

エージェンティックAI 
目的や情報をもとに推論し、
何をどうやって実行するか
計画を立案する
Physical AI の全体像
全体を統括する低速なエージェンティックAI と、高速(数十Hz) なロボット基盤モデルを
組み合わせて、高度なタスクを実現する
ロボット基盤モデル
指示やセンサーデータを知覚し、
制御や動作を生成する
リクエスト完了
ロボットB は
コーヒーマシンか
らカップを取って
ユーザーに渡して


## p.20

エージェンティックAI 
目的や情報をもとに推論し、
何をどうやって実行するか
計画を立案する
Physical AI の全体像
全体を統括する低速なエージェンティックAI と、高速(数十Hz) なロボット基盤モデルを
組み合わせて、高度なタスクを実現する
ロボット基盤モデル
指示やセンサーデータを知覚し、
制御や動作を生成する
カップが座標x,y にあるか
らアームを伸ばして掴んで
運ぼう


## p.21

ロボット基盤モデルとは
物理世界のセンサー入力と指示をもとに、ロボットを制御するAI モデル
Vision Language Action Model (VLA) が代表的
ロボット
基盤モデル


## p.22

ロボット基盤モデルとは
ロボット
基盤モデル
センサー入力
(画像、関節角、触覚センサーなど)
物理世界のセンサー入力と指示をもとに、ロボットを制御するAI モデル
Vision Language Action Model (VLA) が代表的
センサー
トークン


## p.23

ロボット基盤モデルとは
ロボット
基盤モデル
センサー入力
(画像、関節角、触覚センサーなど)
物理世界のセンサー入力と指示をもとに、ロボットを制御するAI モデル
Vision Language Action Model (VLA) が代表的
センサー
トークン
“パーツを掴んで”
タスク指示


## p.24

ロボット基盤モデルとは
ロボット
基盤モデル
センサー入力
(画像、関節角、触覚センサーなど)
物理世界のセンサー入力と指示をもとに、ロボットを制御するAI モデル
Vision Language Action Model (VLA) が代表的
センサー
トークン
“パーツを掴んで”
タスク指示
座標の目標位置など
[[0.3, 0.4, ..., 0.2],... ,[0.1, 
..., 0.1]]
自動車
ロボット


## p.25

ロボット基盤モデルとは
ロボット
基盤モデル
センサー入力
(画像、関節角、触覚センサーなど)
物理世界のセンサー入力と指示をもとに、ロボットを制御するAI モデル
Vision Language Action Model (VLA) が代表的
センサー
トークン
“パーツを掴んで”
タスク指示
座標の目標位置など
[[0.3, 0.4, ..., 0.2],... ,[0.1, 
..., 0.1]]
自動車
ロボット
”お手本”となるアクションや映像のデータをもとに、
複数の状況において最適な動き方ができるように学習する


## p.26

• Physical AI とは
• なぜPhysical AI が注目されているのか
• Physical AI の全体構成
• AWS でのPhysical AI 構成
• まとめ
Agenda


## p.27

Physical AI を構築するステップ
1
2
3
4
5
データ
収集・生成
学習
シミュレー
ション
Sim2Real 
エージェンテ
ィックAI
高品質な
データセットを
膨大に用意する
ファインチュー
ニングと強化学
習による物理法
則と運動スキル
の習得
物理ベースの
ロボット学習と
テストのための
仮想環境
ギャップの橋渡
し:学習済みモデ
ルの実世界テス
トとフィード
バックの取得
知的システム
どうしを協調し
て行動するAI
ロボット基盤モデルの構築
エージェンティックAI 
との統合


## p.28

Physical AI 全体構成
Edge Autonomy Loop
Cloud Training Loop
シミュレー
ション
ロボット
モデル
配信
モデル学習
フィードバックの収集
Data Ingestion
[0,1,0,0,1...]
ロボット
データ
保存・整理
モデル推論・
制御
稼働データ収集
エージェント
オーケストレーション
1
2
3
5
Sim2
Real
4
動画
データ収集


## p.29

Physical AI 全体構成
Edge Autonomy Loop
Cloud Training Loop
シミュレー
ション
ロボット
モデル
配信
モデル学習
フィードバックの収集
Data Ingestion
[0,1,0,0,1...]
ロボット
データ
保存・整理
モデル推論・
制御
稼働データ収集
エージェント
オーケストレーション
1
2
3
5
Sim2
Real
4
動画
データ収集


## p.30

Physical AI 全体構成
Edge Autonomy Loop
Cloud Training Loop
シミュレー
ション
ロボット
モデル
配信
モデル学習
フィードバックの収集
Data Ingestion
[0,1,0,0,1...]
ロボット
データ
保存・整理
モデル推論・
制御
稼働データ収集
エージェント
オーケストレーション
1
2
3
5
Sim2
Real
4
動画
データ収集


## p.31

Physical AI 全体構成
Edge Autonomy Loop
Cloud Training Loop
シミュレー
ション
ロボット
モデル
配信
モデル学習
フィードバックの収集
Data Ingestion
[0,1,0,0,1...]
ロボット
データ
保存・整理
モデル推論・
制御
稼働データ収集
エージェント
オーケストレーション
1
2
3
5
Sim2
Real
4
動画
データ収集


## p.32

Physical AI 全体構成
Edge Autonomy Loop
Cloud Training Loop
シミュレー
ション
ロボット
モデル
配信
モデル学習
フィードバックの収集
Data Ingestion
[0,1,0,0,1...]
ロボット
データ
保存・整理
モデル推論・
制御
稼働データ収集
エージェント
オーケストレーション
1
2
3
5
Sim2
Real
4
動画
データ収集


## p.33

Physical AI 全体構成
Edge Autonomy Loop
Cloud Training Loop
シミュレー
ション
ロボット
モデル
配信
モデル学習
フィードバックの収集
Data Ingestion
[0,1,0,0,1...]
ロボット
データ
保存・整理
モデル推論・
制御
稼働データ収集
エージェント
オーケストレーション
1
2
3
5
Sim2
Real
4
動画
データ収集


## p.34

テレオペレーションでの行動系列データの取得
1. データ収集・生成
基盤モデル構築に必要な、動きのお手本となるデータを収集・生成します
収集したデータ
World Model (動画生成モデル) による
データの水増し


## p.35

• 数千時間という膨大な学習データを収集・保存することが必要。
• 生のデータをスクリーニングする必要がある
• エッジからセンサーデータをストリームで収集したい
1. データ収集・生成における課題


## p.36

• 数千時間という膨大な学習データを収集・保存することが必要。
• 生のデータをスクリーニングする必要がある
• エッジからセンサーデータをストリームで収集したい
1. データ収集・生成における課題
→Amazon S3 の活用
→AWS IoT Greengrass ・AWS IoT Core による
エッジからのデータ収集


## p.37

ストリーム処理
および取り込み
AWS 
IoT
Core
バッチ
処理
1. データ収集の考え方
Amazon S3
生データスト
レージ
Amazon 
Kinesis
Video 
Streams
AWS Cloud
検証
AWS
Glue
Amazon 
SageMaker AI
特徴量計算および
保存
データ
収集
データ
クリーニング
特徴量
エンジニアリング
ランタイム| SDK | 
エージェント
AWS IoT 
Greengrass
AWS Edge 
トレーニング
データの収集・クリーニング・学習の一連のプロセスを構築します


## p.38

AWS IoT Greengrass 
エッジデバイスソフトウェアの構築・デプロイ・管理を行う
エッジランタイム＆クラウドサービス
ソフトウエアの
管理
• フリート全体で
ソフトウェアを管理
• OTA でのアップ
デートが可能
• AWSサービスへの
アクセスも可能
エッジでの
基盤モデル活用
• エッジでのML 推論を
使用して予測を実行
デバイスの
遠隔操作
• IoT デバイスを
ローカル、または
クラウドから接続し
て管理
メッセージング
• 分散デバイスデータの
収集
• フィルタリング、集約
• 関連データのみを
クラウドに送信


## p.39

Physical AI 全体像
Edge Autonomy Loop
Cloud Training Loop
シミュレー
ション
ロボット
モデル
配信
モデル学習
フィードバックの収集
Data Ingestion
[0,1,0,0,1...]
ロボット
データ
保存・整理
モデル推論・
制御
稼働データ収集
エージェント
オーケストレーション
1
2
3
5
Sim2
Real
4
動画
データ収集


## p.40

2,3 : モデルの学習・シミュレーション
シミュレーション環境を利用して学習を行なっていきます。
強化学習
シミュレーション環境上で
トライアルを繰り返し、
最適な動作を生成するための
方策を学習します。
模倣学習
人間が与えた特定の動きを
模倣するように方策を
学習します。


## p.41

• 学習に必要な環境の構築が大変
• 学習したモデルのバージョン管理が必要
• 学習が終了した後は環境を消しておき、コスト最適化したい
• シミュレーションの環境を大規模に起動したい
モデルの学習における課題


## p.42

• 学習に必要な環境の構築が大変
• 学習したモデルのバージョン管理が必要
• 学習が終了した後は環境を消しておき、コスト最適化したい
• シミュレーションの環境を大規模に起動したい
モデルの学習における課題
→Amazon SageMaker AI によるモデルデプロイ・
学習データ管理
→AWS Batch を利用した、シミュレーション環境の構築


## p.43

Amazon SageMaker AI 
AI や機械学習モデルの開発から運用までを一元管理できる統合開発環境
準備
構築
学習
デプロイ
MLOps / Governance
Feature Store
Data Wrangler
Studio
JumpStart
Canvas
Notebooks
Code Editor
Model Training
MLflow
HyperPod
Model 
Deployment
Endpoint
Pipelines
Model Registry
データ準備から本番運用まで、ML ライフサイクル全体をカバー


## p.44

Physical AI に特に役立つ3 つの機能
SageMaker Training
学習・推論
基盤モデルの学習・推論に
必要な環境をすぐに構築す
ることができます。
Managed MLflow Apps
実験管理
モデルのパラメータ・メト
リクス・データリネージ・
などの情報を一元管理
できます。
Model Registry
モデル管理
MLflow と連携して、
モデルバージョン管理・
承認・CI/CD 連携などの
ワークフローを管理できま
す。


## p.45

SageMaker Training 
コンテナベースのML モデル学習環境
データとスクリプトを用意すれば利用可能
学習スクリプト
DL / ML
実行環境
学習データ
Amazon SageMaker
Amazon ECR
Amazon S3
…


## p.46

MLflow・Model Registryを使用した実験管理
57
インフラメンテナスゼロ
データサイエンス環境の構築にかかる
時間とコストを節約
ロボット基盤モデルを使った実験
MLflow を使用してメトリクスと実験を管理
実験から本番環境への加速
モデルアーティファクトの再パッケージ化なしで
Mlflow に登録されたモデルをSageMaker にデプロイ
オープンソースコミュニテイを活用
AWS が提供するインフラ管理でオープンソースの
イノベーションを教授


## p.47

3 : シミュレーション
Isaac Sim やMuJoCo などの物理シミュレーション環境上で、
AI を利用したロボットの動作を確認可能


## p.48

3: AWS Batch での大規模並列処理の実行
Virtual private cloud (VPC)
Availability Zone
Private subnet
Amazon EC2
Availability Zone
Private subnet
Amazon EC2
AWS Batch
Amazon Elastic File 
System
Amazon Elastic 
Container Service
Amazon CloudWatch
NVIDIA Isaac Lab and 
GR00T FM on AWS
数十から数千大規模での大規模シミュレーションを実施可能


## p.49

Physical AI 全体像
Edge Autonomy Loop
Cloud Training Loop
シミュレー
ション
ロボット
モデル
配信
モデル学習
フィードバックの収集
Data Ingestion
[0,1,0,0,1...]
ロボット
データ
保存・整理
モデル推論・
制御
稼働データ収集
エージェント
オーケストレーション
1
2
3
5
Sim2
Real
4
動画
データ収集


## p.50

シミュレーション
大量の動作を並列で実施し、
最適な動作ポリシーを学習
実環境でのデプロイ
実世界でモデルを利用し、
シミュレーション環境との
差異を特定する
4. Sim2Real
シミュレーションと実環境との間には“リアリティギャップ” が存在する。
実環境からのフィードバックを踏まえて再学習していくことが重要となる


## p.51

Deploy Robots with IoT 
Greengrass 2.0
Customer Site
Intelligent 
Sensor(s)
Robot
NVIDIA Jeston 
Thor
Physical Devices
AWS IoT 
Greengrass 2.0
AWS IoT 
Greengrass 2.0
Amazon Simple 
Storage Service
Amazon SageMaker 
Model Registry
AWS IoT Core
Amazon Simple 
Storage Service
Deployment Status
Component Deployment
4. AWS IoT Greengrass 2.0 によるモデルデプロイ


## p.52

Physical AI 全体像
Edge Autonomy Loop
Cloud Training Loop
シミュレー
ション
ロボット
モデル
配信
モデル学習
フィードバックの収集
Data Ingestion
[0,1,0,0,1...]
ロボット
データ
保存・整理
モデル推論・
制御
稼働データ収集
エージェント
オーケストレーション
1
2
3
5
Sim2
Real
4
動画
データ収集


## p.53

ゴール理解
推論と
ワールドモデリン
グ
計画立案と
タスク分解
意思決定と適応
5.Agentic AI によるタスク指示


## p.54

•
Robot やVLA をTool として定義可能
5. Strands Agents との連携
Strands Agents で、ロボットとAgentic AI・VLA との連携を数行で実装可能
@tool
def execute_manipulation(instruction: str) -> str: 
while not task_complete:
observation = robot.get_observation() # Camera + joint positions
action = vla.get_action(observation, instruction) #VLA での推論
robot.apply_action(action) # Execute joint movements
return f"Completed: {instruction}"
robot_agent = Agent(
model=edge_model,
tools=[execute_manipulation],
system_prompt="You control a robotic arm. Use the manipulation 
tool to complete physical tasks."
)
result = robot_agent("place the apple in the basket.")
https://aws.amazon.com/jp/blogs/news/building-intelligent-physical-ai-from-edge-to-cloud-with-strands-agents-bedrock-agentcore-claude-4-5-nvidia-gr00t-and-hugging-face-lerobot/


## p.55

Physical AI リファレンスアーキテクチャ


## p.56

SageMaker HyperPod (slrum) + Enroot を利用して
Docker コンテナでVLA (NVIDIA GR00T, Physical 
Intelligence openpi π0) のファインチューニングを
行うサンプル
GitHub: https://github.com/aws-samples/sample-physical-ai-scaffolding-kit
Physical AI Scaffolding Kit (PASK) by PACE
69
AWS Cloud
SMHP 
(Slurm)
Amazon FSx
for Lustre
Amazon S3
Developer


## p.57

• Physical AI とは
• なぜPhysical AI が注目されているのか
• Physical AI の全体構成
• AWS でのPhysical AI 構成
• まとめ
Agenda


## p.58

• Physical AI によって、より柔軟に課題に対処することが可能なように
なり、これまで導入が難しかった領域でロボットを導入することが可能とな
ります。
• AI の特性を理解した上で、自社に合わせて使いこなすことのできる
体制やデータを蓄積することが重要となります。
• AWS では、リファレンスアーキテクチャやサンプルプログラムなどを
用意しており、Physical AI を実現するための学習基盤・データ基盤をすぐ
に構築いただくことが可能です。
まとめ


## p.59

Exhibition Booth Information
展示ブースのご案内
A157
Physical AI 
- 見て、考えて、動かす
AI エージェントとロボット
が自律的に協調する世界
AWS Village②
A077
面倒なことはPhysical AI にやらせよう！
〜家のお片付けロボット〜
AWS Builders’ Fair


## p.60

Ask the Speaker
こちらのRoom 後方の外側にございます、
「Ask the Speaker」カウンターまでお越しください
大前遼
アマゾンウェブサービスジャパン合同会社
Room


## p.61

本セッションのアンケートへ
ご協力をお願いします
Please give us your feedback
Thank you!
AIM328
