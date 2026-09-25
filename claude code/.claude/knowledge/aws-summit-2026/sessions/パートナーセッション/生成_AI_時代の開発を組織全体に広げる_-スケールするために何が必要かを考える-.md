---
title: "生成 AI 時代の開発を組織全体に広げる －スケールするために何が必要かを考える－"
category: "パートナーセッション"
sponsor: "BeeX"
session_id: "PRT244"
pages: 64
topics: ["生成AI/エージェント"]
services: ["Amazon Bedrock", "Amazon EC2", "Claude"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/パートナーセッション/生成 AI 時代の開発を組織全体に広げる －スケールするために何が必要かを考える－ (sponsored by BeeX).pdf"
---
# 生成 AI 時代の開発を組織全体に広げる －スケールするために何が必要かを考える－


## p.1

PRT244-S
齊藤祐也
日本経済新聞社
情報サービス部門
情報サービスユニット副ユニット長
生成AI 時代の開発を組織全体に広げる
－スケールするために何が必要かを考える－
(sponsored by BeeX)
浅野佑貴
株式会社ＢｅｅＸ
事業開発部副部長


## p.2

生成AI 時代の開発を組織全体に広げる
－スケールするために何が必要かを考える－
AWS Summit Japan
Yuki Asano
株式会社BeeX


## p.3

Copyright © 2026 BeeX Inc. All Rights Reserved.
2
Who Are You？
Yuki Asano
現在
 ：事業開発部/株式会社 BeeX 
〜2023年
:クラウドサービスプロバイダー
•
Senior Solution Architect
•
製造業のお客様を中心とした技術支援
〜 2016年
：国内SIer
•
AWS クラウド関連事業の立ち上げ/導入支援
•
第2回AWSウルトラクイズチャンピオン


## p.4

Copyright © 2026 BeeX Inc. All Rights Reserved.
3
What is BeeX?
設立：2016年
日本で15社目の
「AWS プレミアティアサービスパートナー」
•
AWS マネージドサービスプロバイダー（MSP）プログラム
•
Amazon EC2 for Windows Serverパートナー
•
AWS 公共部門ソリューションプロバイダー
•
AWS ソリューションプロバイダープログラム
•
AWS SAPサービスコンピテンシー
•
AWS 移行コンピテンシープログラム
•
AWS Well-Architectedパートナープログラム
•
内製化支援推進AWSパートナー


## p.5

Copyright © 2026 BeeX Inc. All Rights Reserved.
4
Anthropic Authorized Reseller Program for 
Amazon Bedrock を締結
基幹データ活用の知見と「Claude」の
高度な知性を掛け合わせ、AI駆動型開
発から、組織全体のAIトランスフォー
メーションを包括的に支援します。
1.「SAP on AWS」の高度なデータ活用
2. Claude Code によるAI駆動型開発
3. 包括的な伴走支援


## p.6

Copyright © 2026 BeeX Inc. All Rights Reserved.
5
生成AI による
コーディングやエージェント活用に
取り組まれてますか？


## p.7

Copyright © 2026 BeeX Inc. All Rights Reserved.
6
技術の進化
-2024
2025
2026
コーディング
アシスタント
エージェント
コーディング
自立型
人が作成
AIが提案
AI が作成
人が検証
AIが提案・判断
人が方向づけ・検証


## p.8

Copyright © 2026 BeeX Inc. All Rights Reserved.
7
何が複雑になっているか – ３つの軸
個人で見えている難しさだけが、難しさではない
ツール
自律度
プロセス
etc…
何を選ぶか？
どう組み合わせるか？
何を、どこまで
監督できるか？
自律度が上がるほど、
人に求められるスキルも
AIの監督方法も変わる
何が、どこまで
影響を受けるか？
AIの能力を活かした開発ス
タイルに変化
開発プロセス自体が変わる


## p.9

Copyright © 2026 BeeX Inc. All Rights Reserved.
8
よくある現場での”つまずき”
属人化
使いこなせる人
VS
使いこなせない人
再利用しにくい
昨日までのプラクティス
VS
今日からのプラクティス
組織学習が起きない
設計に至った背景は？
実装に至った背景は？


## p.10

Copyright © 2026 BeeX Inc. All Rights Reserved.
9
実際には何が起きるのか？
複雑な技術状況の中で、
組織に広げようとした時


## p.11

AWS Summit Tokyo 2026
生成AI時代の開発を 組織全体に広げる
齊藤 祐也


## p.12

キャリア
担当サービス


## p.13

個人はもう使えている。 
なぜ、組織の力にならないのか。


## p.14

A C T I — 状況設定
これは「便利な使い方」
の話ではない


## p.15

ACT I
AIがコードを書く。 
個人レベルでは、強力な加速装置だ。
間違っていない


## p.16

個人では再現できる。
組織では再現できない。


## p.17

ACT I
本当の問題は、奥に隠れている
隠れている問題
•
一度の発見が、次の実装で活かせているか


## p.18

ACT I
個人の成功は、
そのままでは 組織の能力にならない
本人の中にとどまっている


## p.19

SU B P L OT I — チームでの観察
私たちのチームで
何が起きたか


## p.20

SUBPLOT I
便利さはすぐに分かった。
でも、その違いを比べられなかった。


## p.21

SUBPLOT I
注目したのは、 
最終的なコードではなかった
本当に見るべきもの
判断


## p.22

SUBPLOT I
チームの会話が変わった
→
今
他の人にも共有できるか


## p.23

SUBPLOT I
たたき台が簡単に作れるようになり、 
会話の重心が深い問いへ動いた
入口


## p.24

成果物が正しく見えることは、 
意図が共有された証明にはならない。


## p.25

SU B P L OT I I — 意図が希少になる
レビューの対象を、
見直す


## p.26

SUBPLOT II
ここで言う「レビュー」とは、 判断を共有する仕組み全般


## p.27

SUBPLOT II
既存のプラクティスは、今も有効
十分でない部分


## p.28

SUBPLOT II
固定された標準は、
この領域ではすぐに古くなる
週単位で変わる


## p.29

SUBPLOT II — 一つの場面
エージェントが30分で書いたPRが
上がってきた
✓
✓
✓


## p.30

SUBPLOT II
レビュアーは、コードは読める。
でも、意図は読めない。
?
?
?


## p.31

AIコーディングアシスタントは、 
間違ったものも、驚くほど速く作れる。


## p.32

SUBPLOT II
向かう先が違っていたら、 
速さは「気づく時間」を奪う
後ろへ押し出す


## p.33

SUBPLOT II
だから、意図の価値が上がる


## p.34

SUBPLOT II
実装の「前」に、3つの視点を持つ
プロダクト
何を作るのか
開発
どう作るのか
QA
何が壊れうるのか


## p.35

SUBPLOT II
判断を、PRの最後ではなく
最初に前へ出す
もう遅い


## p.36

SUBPLOT II
そもそも、コードはもう
希少な資源ではない
結果 
なぜその結果に至ったか


## p.37

コードのコストが下がるほど、 
意図が希少資源になる。


## p.38

“
Dave Mosher — Principal Consultant, Test Double
“AI lowers the cost of outputs, which dramatically increases 
the cost of being wrong. ”
だからこそ、間違えたときのコストが劇的に上がる。


## p.39

SUBPLOT II
レビューで問うべきことが変わる
正しいか、最適か
→
これから
意図は何か
判断の過程を追えるか


## p.40

SU B P L OT I I I — 意図とフローの共有
意図とフローを共有するとは、 
具体的に何をすることか


## p.41

SUBPLOT III
エージェントの使い方の流れを、 
記録して共有する
同じ判断の構造


## p.42

SUBPLOT III
最初の一歩は、小さくていい
1
PRの説明欄に3行書く
2
完璧な記録でなくていい


## p.43

SUBPLOT III — 私たちの実践
Axon：差分が生まれるまでの会話を、PRに添える
01
02
統一フォーマットに変換する
03


## p.44

SUBPLOT III
フローは標準ではない。試行の記録。
試行の記録
積み重なる。
構造は残る


## p.45

作るべきは 
フィードバックループ。


## p.46

SUBPLOT III
発見を、次の一手に戻す
01
エージェントとの やり取り
→
02
レビュー
→
03
何が足りなかったかを 見つける
↺ 次に戻す


## p.47

SUBPLOT III
1回の学びが、その人の経験で
終わらなくなる


## p.48

C L OSI N G
レビューの再定義は、
組織の学び方を変えること


## p.49

CLOSING
半年後、改善できる対象が変わる
判断の構造を比較できる組織
どの判断が効いたか、
どこで危なかったかを見直し、 次に活かす。


## p.50

“
W. Edwards Deming — 品質管理の第一人者 / トヨタ生産方式に影響
“Every system is 
perfectly designed to get the results it gets.”
レビューがコードの正しさだけを見ているなら、意図が失われるのは設計通りだ。


## p.51

CLOSING — 実践
人に対してやってきたことを、 
エージェントにも
同じはず


## p.52

CLOSING — 実践
エージェントを動かす前に
Why
なぜやるのか
Guard
何を守るのか
Done
どうなったら 完了と言えるか
既存の認証フローは変えず、
エラー時の導線を改善する。
完了条件は、失敗理由が分かり、再試行でき、既存の監査ログが壊れないこと。


## p.53

来週のレビューで、コードの正しさだけでなく 
「なぜこの判断をしたのか」 
を、 1つだけ聞いてみてください。


## p.54

BeeXにおける
ご支援アプローチ


## p.55

Copyright © 2026 BeeX Inc. All Rights Reserved.
54
AI開発における誤解
誰でもコードを生成できる≠ 品質を満たしたシステム開発ができる
DevOpsプラクティス/自動化の知識・技術・環境すらも不要


## p.56

Copyright © 2026 BeeX Inc. All Rights Reserved.
55
AI-Driven Development Lifecycle
Agentic Codingに対するアプローチの１つ
•
仕様駆動(Spec-driven) を用いた開発スタイル
•
要件・設計・システム特性を事前ドキュメント化
•
構造化された仕様書に基づいてAIがコードを生成する
•
AWSが提唱するAI Codingに対するアプロー
チ方法の１つ
•
AI主導の開発ワークフロー
•
AIの成果物のレビューに人間は徹する
https://prod.d13rzhkk8cj2z0.amplifyapp.com/


## p.57

Copyright © 2026 BeeX Inc. All Rights Reserved.
56
エンタープライズ企業での
AI開発導入の3つのハードル
ツール選定
開発環境整備
開発経験自体の不足
導入効果が
予想し辛い


## p.58

Copyright © 2026 BeeX Inc. All Rights Reserved.
57
BeeX AI Journey 支援 〜AI開発体験プログラム
AI-Driven Development Lifecycle (AI-DLC)を体験する為のサポートプログラム
すぐに使える開発環境
Agentic Coding
実装事例
ドキュメント
エンジニアによる
QAサポート


## p.59

Copyright © 2026 BeeX Inc. All Rights Reserved.
58
内製化支援コンサルティング
〜AIを活用する為にも基礎的な技術力を向上させる
• アプリケーション設計支援
• モダンアプリケーションを実現する為のアプリケーション設計支援
• アーキテクチャ設計支援
• 既存/構想システムに活用するクラウドサービスに関する技術情報提供
• アーキテクチャレビュー
• 技術QAサポート
• 利用するシステムを想定した実装方針/サンプルコード提供
• ベストエフォートでの技術相談サポート(相談範囲の制限無し)
• 技術調査支援
• 利用するシステムを想定した技術動向・新サービス調査
• 活用ユースケース検討
• 自動化支援
•
Serverless技術を利用した運用業務の自動化支援
担当エンジニアが貴社システム/プロジェクトの技術力向上をご支援します
担当エンジニア
貴社
メンバー
貴社プロジェクト
担当エンジニア
貴社メンバー
貴社プロジェクト
SIer
レビュー/QA
レビュー/QA


## p.60

まとめ


## p.61

Copyright © 2026 BeeX Inc. All Rights Reserved.
60
これから始める方
皆様の組織は
何が課題で、
どこから始めますか？
すでに取り組まれている方
いま何が起きてますか？
最初の一歩を、
BeeXがご一緒できます
課題感を
ぜひお聞かせください


## p.62

61
お客様の成長と変革に貢献する
先進テクノロジー情報を発信しています！
ニュース
詳細はこちら
Techブログ
詳細はこちら
ブログ
詳細はこちら


## p.64

本セッションのアンケートへ
ご協力をお願いします
Please give us your feedback
Thank you!
PRT244-S
