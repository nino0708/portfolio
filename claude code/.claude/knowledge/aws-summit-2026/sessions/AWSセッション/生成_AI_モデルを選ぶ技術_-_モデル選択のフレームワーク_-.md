---
title: "⽣成 AI モデルを選ぶ技術 - モデル選択のフレームワーク -"
category: "AWSセッション"
session_id: "AIM311"
pages: 49
topics: ["生成AI/エージェント"]
services: ["AgentCore", "Amazon Bedrock", "Amazon SageMaker", "Claude"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/AWSセッション/⽣成 AI モデルを選ぶ技術 - モデル選択のフレームワーク -.pdf"
---
# ⽣成 AI モデルを選ぶ技術 - モデル選択のフレームワーク -


## p.1

AIM311
⽣成AI モデルを選ぶ技術
- モデル選択のフレームワーク-
⼩林⼤樹
アマゾンウェブサービスジャパン合同会社


## p.2

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
⾃⼰紹介
⼩林⼤樹/ Kobayashi Daiki
アマゾン ウェブ サービス ジャパン合同会社
ソリューションアーキテクト
好きな AWS サービス
・お客様のクラウド活⽤/ ⽣成 AI 活⽤の技術⽀援
担当業務:
・Amazon Bedrock AgentCore


## p.3

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
本セッションについて
アジェンダ
1. モデル選択のフレームワークがなぜ必要か
2. Identify - モデルを特定する
3. Evaluate – モデルを評価する
4. Optimize – モデルを最適化する
5. まとめ
本セッションの聴講対象者
•
どの⽣成 AI のモデルを利⽤するか、選択肢の多さに迷われている⽅
•
アプリケーションに⽣成 AI を組み込む際、どう評価するか困っている⽅


## p.4

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
モデル選択のフレームワークが
なぜ必要か


## p.5

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
285万+
現時点で利⽤可能な公開モデル数
* Hugging Face Hub, 2026年5⽉
~4,000
1⽇あたりの新規モデルリリース数
** ⽇次リリース数の平均, 2026年3~5⽉
モデル選択肢のスケール
開発者は前例のない量とスピードの選択肢に直⾯しています


## p.6

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
多すぎる
選択肢が多すぎて、絞れない
数百万のモデルから、⾃社のユースケ
ースで利⽤するモデルをどう選べばい
いのか。選ぶためにはどのようなフレ
ームワークを利⽤すればいいのかわか
らない。
最適なモデル選択が、かつてなく難しい
速すぎる
数ヶ⽉単位で新モデル登場
ひとつのモデルの検証が終わったと思
えば、また新しいモデルが登場する。
ひとつひとつテストしていてはスピー
ド感が間に合わない。


## p.7

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
最適なモデルを選択
コスト、レイテンシー
精度を最適化
⾃社データで安全にカス
タマイズ
エージェントのデ
プロイと運⽤
安全性と責任ある AI の
チェックを適⽤
⽣成 AI アプリケーションの構
築・デプロイ・スケールに必
要なすべてを備えたサービス


## p.8

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
Amazon Bedrock
15
基盤モデルの選択は AMAZON BEDROCK の要です
主要なモデル
プロバイダから選択
幅広いフルマネー
ジドモデルの中か
ら、⽤途に合うも
のを選ぶ
評価ツールを活⽤
候補を客観的な指
標で⽐較し、意思
決定を⽀える
⾃前のモデルを
インポート
独⾃にカスタマイズ
したモデルを持ち込
んで運⽤する


## p.9

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
モデル選択フレームワーク
18
候補モデルを
特定
Identify
⾃社データで
モデルを評価
Evaluate
本番環境向けに
モデルを最適化
Optimize
数ある選択肢から要
件に合う候補を絞り
込む
候補を⾃社のデータ
と指標で客観的に⽐
較する
カスタマイズや推論
の⼯夫で最適化する


## p.10

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
お客様のユースケース
ビジネス課題
不正取引だと疑われる取引について、システム
からアラートが出される。お客様の企業の担当
アナリストは、不正疑いのフラグがついた取引
について、膨⼤なトランザクションデータとド
キュメントを確認し、⼿作業でレビューしてい
た。担当アナリストはこの作業に多くの時間を
費やしており、ビジネスがスケールする中でな
んとか効率化を⾏う必要があった。
要件
• 構造化・⾮構造化テキストを処理できる
• 正確かつ簡潔な調査サマリーを⽣成できる
• 1 ⽇ 50 億トークン規模の処理のコストを最
適化できる
不正取引調査エージェント
お客様のゴール
• 上記要件を満たしつつ、調査業務を 
20% 効率化する


## p.11

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
Identify – モデルを特定する
数ある選択肢から、要件に合う候補を絞り込む


## p.12

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
モデル選択フレームワーク
26
候補モデルを
特定
Identify
⾃社データで
モデルを評価
Evaluate
本番環境向けに
モデルを最適化
Optimize
数ある選択肢から要
件に合う候補を絞り
込む
候補を⾃社のデータ
と指標で客観的に⽐
較する
カスタマイズや推論
の⼯夫で最適化する


## p.13

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
Identify
数ある選択肢から、要件に合う
候補モデルを絞り込む
候補モデルをモダリティで絞り込む
サードパーティのベンチマークを参照
モデル固有の強みを検討する


## p.14

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
モダリティ＝モデルが扱う⼊⼒と出⼒
モダリティとは
INPUT · ⼊⼒
テキスト
画像
→
基盤モデル
→
OUTPUT · 出⼒
ユースケースに必要な⼊⼒と出⼒の組み合わせで、まず候補モデルを絞り込む。
⾳声
動画
テキスト
画像
⾳声
動画


## p.15

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
サードパーティのリソース
モデル⽐較ツールを活⽤する
Artificial Analysis
https://artificialanalysis.ai/
知能・速度・価格
などの軸でモデル
を横断的に素早く
⽐較することがで
きる


## p.16

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
サードパーティのリソース
汎⽤ベンチマークではなく、⽤途に近い指標を⾒る
モデルの⻑⽂読解⼒を⾒る
エージェントの業務対応⼒を⾒る


## p.17

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
サードパーティのリソース
モデル固有
モダリティ・ベンチマークで絞った先の最後の観点 （モデル固有の強み）を
⽤途に合わせる。
⾃律的に動ける
複雑な推論を⾏い、ツールを使い分
けてタスクを完遂する
Agentic なタスクに強い、Reasoning 機能
があるなど、複雑な推論ができる
カスタマイズできる
⾃社データでファインチューニング
し、固有タスクの精度を⾼める
ファインチューニングや蒸留といった⼿法
で、オープンウェイトモデルに⾃社の知識
を取り込む


## p.18

不正取引調査エージェント
不正取引調査エージェントのモデル選定に、Identify の 3 つの観点を当てはめる
1
モダリティで絞り込み
ドキュメント分析・要約のみ⾏う 
→ Text to Text モデル
ベンチマークを参照
要約品質・事実正確性・推論能⼒で上位を確認
モデル固有の強み
Agentic なタスクに強いこと、⾃社タスクへの
ファインチューニングができること
候補に残ったモデル
Claude Sonnet 4.5
OpenAI gpt-oss 20b
DeepSeek V3.1
お客様ユースケース
２
3


## p.19

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
Evaluate – モデルを評価する


## p.20

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
モデル選択フレームワーク
44
候補モデルを
特定
Identify
⾃社データで
モデルを評価
Evaluate
本番環境向けに
モデルを最適化
Optimize
数ある選択肢から要
件に合う候補を絞り
込む
候補を⾃社のデータ
と指標で客観的に⽐
較する
カスタマイズや推論
の⼯夫で最適化する


## p.21

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
Evaluate
顧客データでモデル
を評価
ゴールデンデータセットを作成する  
特定のユースケースで性能を評価する
モデル性能を継続的に検証する


## p.22

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
ゴールデンデータセットのサンプル
“prompt”: “ある顧客が新規⼝座を開設し、初回⼊⾦として5 万円を預け⼊れた。その
後30 ⽇間にわたり、雇⽤主から2~3万円の定期⼊⾦があり、⾃宅住所近辺のATM で
現⾦引き出しを⾏っている。この取引パターンは不審か︖", 
テスト⽤プロンプト
“referenceResponse”: “この取引パターンは不審ではない。当該⼝座は正常な挙動を
⽰している。控えめな初回⼊⾦、給与所得と整合する定期的な⼊⾦、そして顧客の登
録住所近辺のATM での現⾦引き出し。これらはいずれも、マネーロンダリングや詐
欺の兆候が⾒られない、正当な個⼈の銀⾏取引に典型的な特徴である",
これが正解、と⼈間が保証した評価基準のデータセット
正解の回答データ


## p.23

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
データセットの
作成は時間がか
かる
エッジケースを網羅するのは難しい
網羅的にワークフローを作成するのが困難
無意識に似たパターンになる
多様性のないデータセットになってしまう
細部の事実確認に時間がかかる
マニュアルや⼿順書を⼈間がすべて確認するの
は⾮効率
課題


## p.24

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
エージェントを活⽤したゴールデンデータセットのスケール 
ユーザーシミュレーター
エージェント
Agents
Agents
タスクエージェント
<Mission>
顧客の取引を調査したい。 
<Persona>
私はの調査員です。取引を精査し、取引が
不審かどうかを判断するのが仕事です…
<Example questions>
どの取引が異常に⾒えますか︖
<Mission>
複数のデータソースに基づき不正取引リス
クを要約する。 
<Persona>
私は⾼度なスキルを持つアナリストです。
異常な取引の発⾒や、データセットを横断
したパターン検出に⻑けています…
<Actions>
db_search()
get_transaction_log()
Agents
批評エージェント
<Mission>
tool calling の正確性および最終回答につ
いて、Task Agent からの応答を採点する
<Persona>
あなたはアナリストのための専⾨教師です
。どの回答でも評価・採点することができ
ます。 
<Actions>
grade_relevance()
grade_recommendation()
grade_comparison()
⼈間が評価基準を作り、エージェントがデータセットを作る


## p.25

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
エージェントを活⽤したゴールデンデータセットのスケール 
ユーザー
シミュレーター
Agents
Agents
タスク
エージェント
Agents
批評
エージェント
採点基準を満たすま
で反復。満たすとゴ
ールデンデータセッ
トを更新
エージェントの
やり取りを観察
評価担当者
採点基準
マニュアル
ゴールデン
データセット
承認された回答
をゴールデン
データセットと
して書き込む
採点基準を
更新
⼈間が評価基準を作り、エージェントがデータセットを作る


## p.26

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
ゴールデンデータセットを作成する
ゴールデンデータセットで、何を測るのか
システムが回るか
運⽤メトリクス
本番で動かしたときの基本性能。モデ
ルの賢さとは異なる軸。
どれだけ良い答えを返すか
包括的な評価メトリクス
モデルの回答そのものの質を測る指標


## p.27

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
コスト
レイテンシー
運⽤メトリクス
トークン単価や、プロン
プトキャッシングやバッ
チ処理によるコスト最適
化の余地があるかを確認
する
ユーザー体験に直結。異
なるコンテキスト⻑にお
けるレイテンシーの分布
はどうなっているか確認
する
スケーラビリティ
さまざまな負荷下でのス
ループットとエラー率。
ピーク負荷でもスループ
ットを維持できるか、エ
ラー率は許容範囲かを確
認する
システムが回るか


## p.28

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
ゴールデンデータセットを作成する
ゴールデンデータセットで、何を測るのか
システムが回るか
運⽤メトリクス
本番で動かしたときの基本性能。モデ
ルの賢さとは異なる軸。
どれだけ良い答えを返すか
包括的な評価メトリクス
モデルの回答そのものの質を測る指標


## p.29

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
回答の質を測る
包括的な評価メトリクス
品質・正確性
回答が事実と合っているか、抜け漏
れなく答えているか、聞かれたこと
に答えているか
スタイル
指⽰通りのフォーマットで、読みや
すく、業務で使える⽂体になってい
るか
責任あるAI
有害な回答や偏⾒、差別的な表現が
含まれていないか
カスタムメトリクス
⾃社KPI に直結する独⾃の指標。例
えば、調査時間の短縮率、ツール呼
び出しの正確性など


## p.30

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
プログラマティック
⼈間による評価
メトリクスの評価⼿法
アルゴリズムで採点
する。完全⼀致など
決定的な指標で⾃動
採点できる、明確な
正誤や定量的なメト
リクスに適する
ドメイン固有のテス
トや主観的評価に⼈
間の専⾨知識を活⽤
する
LLM-as-a-Judge
強⼒な LLM を採点
者として使い、⼈間
の判断に近い質を保
ちつつ、⼤量の処理
を⾏う


## p.31

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
Amazon Bedrock model evaluation
プログラマティック評価
LLM-AS-
JUDGE
⼈間による評価
アルゴリズム
LLM 推論
評価⼿法
カスタム評価メトリクス
正確性
堅牢性 
有害性
正答性 
網羅性 
有⽤性
関連性
⼀貫性
可読性
創造性 
スタイル
トーン
正確性
⼀貫性
ブランド
ボイス
BERTスコア |  分類精度 | 
F1スコア  | 
実世界知識スコア
Good/Bad 評価| 順位づけ | 
５段階リッカート尺度 
多段推論|
専⾨家評価との相関
複雑な実装なしで、必要な評価をひととおり実⾏できる


## p.32

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
LLM-as-a-judge の仕組み
Prompt:
⼊⼒例
平均引き出し額 3 万円の⼝
座から、500万円の引き出し
がありました。不審ですか︖
referenceResponse:
不正取引の可能性が
⾼いです
Model response:
これは通常の取引ではあり
ません
あなたは親切なアシスタントです…
あなたには、質問、参照回答（正解）、 LLM の回答が与えられます。
あなたのタスクは、LLM の回答が参照回答と⽐較して正しいかどうかを確認す
ることです…
実際のタスクは以下の通りです:
質問:  {prompt}
参照回答: {referenceResponse} 
LLM の回答: {Model response}
実際のタスクは以下の通りです。 referenceResponse と Model response を
⽐較し、採点してください。
0) 不正解
1) 部分的に正解
2) 正解
JUDGE PROMPT


## p.33

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
モデル評価レポート
⼊⼒した
プロンプト
⽣成された
回答
正解データとして
⽤意した回答
判定
結果


## p.34

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
課題: エージェントの振るまいは正しいか︖
取引履歴を取得
顧客情報を取得
社内 DB 検索
結論: 怪しい
取引履歴を取得
顧客情報を取得
確認をスキップ
結論: 怪しい
A: 正しくエージェントが動いたケース
B: エージェントが⼀部作業をスキップしてしまったケース
出⼒だけ⾒ると正解だが、エージェントが作業を⾶ばしている


## p.35

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
ゴールデンデータセットにデータを追加
“prompt”: “ある顧客の送⾦取引について、過去の取引履歴・顧客
情報を調査し、社内データベースの情報と照合。マネーロンダリン
グの疑いがあるか判定してください。" 
テスト⽤プロンプト
正解データ
“referenceResponse”: “この取引は不審です。短期間に複
数の⾼額送⾦が集中し、受取⼈が社内データベースの要注
意取引先リストに記載があります。",
エージェントがどのようにツールを呼び出すべきかを「期待する⼿順」として
定義しておく
期待する⼿順
“expectedTrajectory”: 
“[取引履歴取得]” -> “[顧客情報取得]” -> “[社内DB検索]”


## p.36

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
実環境のデータによって、エージェ
ントの品質とパフォーマンスを改善
する機能
Amazon Bedrock 
AgentCore evaluations


## p.37

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
AgentCore Evaluations でエージェントを評価
エージェントが動いた軌跡(trajectory) をコンソールで可視化。評価 API でスコ
アを判定することができる。
{
"Builtin.TrajectoryExactOrderMatch": {
    "value": 0.0,
    "label": "No",
    "explanation": 
 
"Expected [..., search_internal_db], 
 
but got 2 tools ̶
 
 
'search_internal_db' is missing"
  }
}
社内DB 検索(search_internal_db) が
呼ばれていない
社内DB 検索ツールが呼ばれていないため
失敗(No)と評価
評価 
API
①エージェントの軌跡をトレース
②オンデマンド評価 API で挙動を検証
顧客情報取得
トランザクション取得


## p.38

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
不正取引調査エージェント
不正取引調査エージェントのモデル選定に、Evaluate の観点を当てはめる
1
ゴールデンデータセットを作成
不正取引の調査タスクから正解付きデータを⽤意
品質を評価
要約品質・事実正確性をLLM-as-a-judge で
採点し、候補を 2 モデルに絞り込む
モデル性能の継続的な検証
運⽤メトリクスを継続的に監視し、レイテンシーや
パフォーマンスの低下が起きていないかを確認
候補に残ったモデル
Claude Sonnet 4.5
OpenAI gpt-oss 20b
お客様ユースケース
２
3


## p.39

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
Optimize – モデルを最適化する


## p.40

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
モデル選択フレームワーク
113
候補モデルを
特定
Identify
⾃社データでモ
デルを評価
Evaluate
本番環境向けに
モデルを最適化
Optimize
数ある選択肢から要
件に合う候補を絞り
込む
候補を⾃社のデータ
と指標で客観的に⽐
較する
カスタマイズや推論
の⼯夫で最適化する


## p.41

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
Optimize
本番環境向けに
モデルを最適化
ファインチューニングや蒸留でモデルの能⼒
を引き上げる
プロンプトを再利⽤し、レイテンシや
コストを削減する
ワークロードに応じた推論階層で性能と
コストを最適化する


## p.42

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
モデルカスタマイズ
⾃社データでモデルをファインチューニングする
FINE-TUNE
Amazon SageMaker AI で
ファインチューニング
集めた⾃社データを元に、オープン
ウェイトモデルのファインチューニ
ングを⾏う。ファインチューニング
を⾏うことで、固有タスクの精度を
⾼めることができる。
Custom 
Model 
Import
Amazon Bedrock の 
Custom Model Import
ファインチューニングしたモデルを 
Bedrock に取り込むことができ、
GPU を常時起動することなく、フ
ルマネージド・サーバーレスに推論
を実⾏することができる
DEPLOY
モデルのファインチューニングを⾏い、Bedrock の Custom Model Import で推論する


## p.43

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
推論最適化
プロンプトキャッシングを利⽤する
⻑いシステムプロンプトやドキュメント、ツールの定義など毎回同じコンテキ
ストをキャッシュすることで再計算をスキップする
推論1回⽬ キャッシュ書き込み
コンテキストを計算し、キャッシュに保
存する。キャッシュ書き込み時には書き
込みコストが発⽣する。
推論2回⽬ キャッシュ読み込み
キャッシュを利⽤して再計算をスキップ
することで、キャッシュ分はコスト 
90% オフで推論を⾼速化することがで
きる


## p.44

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
推論最適化
サービス階層を利⽤する
アーキテクチャを変えずに service_tier パラメータを切り替えることで、応答速度とコストの
バランスを最適化する。通販の配送オプションのようなイメージ。
PRIORITY
推論料⾦に +75%のプレミアムを⽀払い、最速の応答を提供
STANDARD
デフォルトの推論階層。⽇常的なタスク向け。
FLEX
遅延を許容し、推論料⾦50% オフで利⽤することができる


## p.45

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
不正取引調査エージェント
不正取引調査エージェントのモデル選定に、Optimize の観点を当てはめる
モデルカスタマイズ
オープンウェイトを不正取引調査⽤語、実際のケースでファ
インチューニングすることで、固有タスクの精度を向上
推論を最適化
繰り返しの分析にプロンプトキャッシング。遅延が許容で
きる処理は FLEX サービス階層での推論でコストを削減。
お客様ユースケース
1
2
結果
20%
調査効率化ゴール達成
80%
1⽇5億トークンから、50億
トークンへスケールしながら本
番コストを想定より 80 %削減
することに成功


## p.46

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
まとめ


## p.47

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
候補モデルの特定
候補モデルや
組み合わせを評価
本番環境向けにモデルを最適化
モデル評価
カスタマイズした
モデル
ゴールデンデータセット
メトリクスをモニタリング
リアルタイムフィードバックによる改善
ファイン
チューニング
プロンプト
キャッシュ
サービス
階層
まとめ: モデル選定フレームワークの振り返り


## p.48

Ask the Speaker
こちらのRoom 後⽅の外側にございます、
「Ask the Speaker」カウンターまでお越しください
⼩林⼤樹
アマゾンウェブサービスジャパン合同会社
Room


## p.49

本セッションのアンケートへ
ご協⼒をお願いします
Please give us your feedback
Thank you!
AIM311
