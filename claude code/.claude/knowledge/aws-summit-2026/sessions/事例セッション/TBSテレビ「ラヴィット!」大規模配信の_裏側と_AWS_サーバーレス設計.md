---
title: "TBSテレビ「ラヴィット！」大規模配信の 裏側と AWS サーバーレス設計"
category: "事例セッション"
session_id: "CDN227"
pages: 28
topics: ["アーキテクチャ/サーバーレス", "生成AI/エージェント"]
services: ["AWS Lambda", "AWS Step Functions", "Amazon API Gateway", "Amazon Aurora", "Amazon Bedrock", "Amazon CloudFront", "Amazon ECS", "Amazon ElastiCache", "Amazon Nova", "Amazon RDS", "Amazon SQS", "Claude", "Valkey"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/事例セッション/TBSテレビ「ラヴィット！」大規模配信の 裏側と AWS サーバーレス設計.pdf"
---
# TBSテレビ「ラヴィット！」大規模配信の 裏側と AWS サーバーレス設計


## p.1

CDN227
TBSテレビ「ラヴィット！」大規模配信の
裏側とAWS サーバーレス設計
亀田遼
株式会社TBSテレビ
メディアテクノロジー局未来技術革新事業部
テクニカルプロダクトリード


## p.2

（株）TBSテレビメディアテクノロジー局未来技術革新事業部
テクニカルプロダクトリード
亀田遼
TBSテレビ「ラヴィット！」
大規模配信の裏側と
AWSサーバーレス設計
AWS Summit Japan 2026
ブレイクアウトセッション（CDN227）
2026/6/25


## p.3

3
自己紹介
亀田遼@ry_km_u_u
（株）TBSテレビメディアテクノロジー局未来技術革新事業部
テクニカルプロダクトリード
2023/4 TBSテレビ新卒入社、未来技術設計部に配属

超低遅延映像伝送ソフトウェア「Live Multi Studio」の開発

インタラクティブ配信アプリ「Kustamie」の開発リーダー

リモートプロダクション技術の研究、生成AIの利活用

番組向けの各種ツール開発
2025/7 未来技術革新事業部に名称変更
新規開発したアセットをビジネス化していくフェーズへ
https://github.com/ryokm-221
https://zenn.dev/ry_km


## p.4

4
Agenda
実施したイベントの概要
Kustamie について
大規模配信に向けたサーバーレス設計
全体のアーキテクチャ
負荷低減のための工夫
Kustamie における生成AI の活用
まとめ


## p.5

5
実施したイベントの概要
ラヴィット！忘年会’25
実施形態
ライブ＋見逃し配信
想定視聴者数
6 万人
配信プラットフォーム
Kustamie
このセッションでは、この数万人向けの大規模配信を行った中で、
主に技術面の裏側や生成AI を使った機能面をご紹介いたします


## p.6

6
Kustamie は、生放送やイベント配信など単方向になりがちな環境で、
出演者と参加者の双方向なやりとりを充実させ、
「参加感」を向上させられるカスタマイズ可能なプラットフォームです。


## p.7

7
UI


## p.8

8
ユースケース
オンライン配信、会場参加型、ハイブリッド型イベントの全ての形態で利用可能！
eSports イベント
社員集会
現地観戦スポーツ
フェスティバル
採用イベント
ファンミーティング
スポーツ大会
トークショー
会場参加型イベント
オンラインイベント
ハイブリッド型イベント


## p.9

Kustamie のアーキテクチャ


## p.10

10
Kustamie のアーキテクチャ（概要）
Kustamie の通信は主に、「イベント情報取得」と「映像音声・リアルタイムデータ」の2つ
イベント情報
Amazon ECS + Amazon RDS（Amazon Aurora Serverless v2）でデータ管理、
Amazon API Gateway + AWS Lambda でクライアントAPI を提供
映像音声・リアルタイムデータ
Amazon Interactive Video Service（IVS）を利用


## p.11

11
Amazon IVS とは？
Amazon Interactive Video Service（IVS）
世界中の視聴者が低レイテンシーまたはリアルタイムの動画を利用できるようにするマネージドライブ
ストリーミングソリューション
Low Latency
Realtime
入力プロトコル
RTMP(S)・SRT
RTMP(S)・WHIP (WebRTC)
出力プロトコル
HLS
WebRTC
遅延量
3〜5 秒
300 ミリ秒未満
最大入力解像度
ビットレート
1920x1080（フルHD）
8.5 Mbps
1280x720（HD）
8.5 Mbps (6 Mbpsが推奨)
最大視聴者数
数百万
25,000（緩和可能）
プライベート配信
可能（視聴トークン発行は任意）
強制（視聴トークン発行は必須）
特徴
画質を担保しつつ、可能な限り低遅延で配信可能
ビデオ会議並みの遅延量で、特にスマホ視聴であれば
許容される画質を提供

画質と遅延量はトレードオフの関係にあるが、なるべく画質寄りに提供できるのがRealtime モードの特徴

映像はグローバルリージョンで展開されるため、視聴者の地理に影響されにくい

マネージドサービスのため、キャパシティを気にしなくて良い


## p.12

大規模配信に向けたサーバーレス設計


## p.13

13
問題点
大規模配信を行う上で、クライアントAPI の従来構成では以下の問題点があった
キャッシュを前提とした構成となっていないため、高負荷に耐えられない
Amazon API Gateway のエンドポイントタイプは「リージョンタイプ」で作っている
（本来は「エッジ最適化タイプ」の方がベター）
配信参加時のAPI レスポンスに最長で12 秒程度かかってしまい、パフォーマンスが最適化できていなかった
多数の内部API コールがあり、サーバー間通信のオーバーヘッドが大きかった
今まで負荷テストを実施していなかったので、高負荷時の挙動が不明だった
（参考）Amazon API Gateway のエンドポイントタイプ（パブリックアクセスのみ）
エッジ最適化タイプ
AWS リージョン全体からのクライアントアクセスを
容易にするために、Amazon CloudFront の
PoP からディストリビュートする方法
リージョンタイプ
指定されたリージョンにデプロイされ、
リージョンごとに異なるドメインを発行する方法
https://docs.aws.amazon.com/ja_jp/apigateway/latest/developerguide/api-gateway-api-endpoint-types.html


## p.14

Amazon API Gateway + AWS Lambda の負荷指標
Amazon API Gateway
Throttle Rate
秒間リクエスト数の制限（リージョンレベル）
デフォルト：10,000 req/s
AWS Lambda
Concurrent executions（同時実行数）
リクエスト数ではなく、実際に稼働しているコンピューティング環境数（関数ごと）
同時実行数＝1 秒あたりのリクエスト数× 1 リクエストの所要時間(秒)
デフォルト：1,000
Scaling Rate
コンピューティング環境が新規にデプロイされるレート
10 秒ごとに1,000 インスタンス（もしくは10,000 req/s）
同時実行数の10 倍に自動設定
https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/lambda-concurrency.html


## p.15

（参考）AWS Lambda のスケーリング
短時間で終了するリクエストを多数受け取る場合、スケーリングレートに注意が必要
（例）同時実行数のクオータが1,000 の場合
関数実行時間0.1秒、秒間リクエスト数10,000 の場合
同時実行数＝10,000 (req) x 0.1 (s) = 1,000
→ OK
スケーリングレート：10,000 req/s
→ OK
関数実行時間0.05 秒、秒間リクエスト数20,000 の場合
同時実行数＝20,000 (req) x 0.05 (s) = 1,000
→ OK
スケーリングレート：20,000 req/s
→ NG
短時間で終了する関数に多数のリクエストを実行する場合、スケーリングレートが原因でThrottling する可能性がある
ので注意が必要
同時実行数はデフォルトでOK
同時実行数を2000 に緩和する
参考：https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/lambda-concurrency.html#concurrency-vs-requests-per-second
15


## p.16

16
負荷試験の方法
オープンソースの負荷試験ツール「k6」を利用*
負荷テストのシナリオをJavaScript (TypeScript) を使って記述可能
テストの実施方法**

中規模（100〜5,000 VU）
→ ローカルPC で実施

大規模（5,000〜60,000 VU）
→ インスタンスを立ち上げて実施
* AWS 規範ガイダンスに負荷テストの推奨ツールとして記載がある
https://docs.aws.amazon.com/ja_jp/prescriptive-guidance/latest/load-testing/tools.html
** VU (Virtual User) ：負荷テストにおけるクライアント単位
k6 公式ドキュメントを参考に、1 インスタンスあたりのVU 数が30000 以内に収まるように、大規模テストでは複数台のインスタンスを利用した
https://grafana.com/docs/k6/latest/testing-guides/running-large-tests/
テストの結果表示例


## p.17

17
シナリオ負荷試験
実際にユーザーが利用するときを想定して、VU 数が変化するシナリオを用意した
最大VU
t
アクセス数
待機配信前
待機配信中
（30 分間）
本編配信中
最大VU の10 %
•
待機配信開始時に、最大VU 数の10 %が参加する
•
その後は開始時間前に参加数が急増するように、VU 数が指数的に増加する
•
この傾向は、過去に実施した類似イベントのデータをもとに作成した


## p.18

18
負荷試験と上限緩和
Amazon API Gateway とAWS Lambda を組み合わせたE2Eの負荷試験

Amazon API Gateway 標準クオータ
10,000 RPS
毎分600,000 リクエスト（平均10,000 RPS）を超えた時点で
400 番台エラーが増えた
統合先のAWS Lambda 関数にエラーは観測されなかったため、
Amazon API Gateway レベルでスロットリングが発生していると判断*
*Amazon API Gateway の標準メトリクスでは、400 番台のエラーが発生していることしか
わからないため、AWS Lambda 側のエラーではないことの確認が必要
API 負荷テストの結果
呼び出し回数とエラーの増分が一致している
赤線
API 呼び出し回数（分間）
オレンジ線
平均RPS
紫線
400 番台エラー
上限緩和したクオータ（一部）
•
Amazon API Gateway Throttle Rate
30,000 RPS
•
AWS Lambda Concurrent Executions 50,000


## p.19

19
API のパフォーマンス改善：多段キャッシュの利用
API の各所にキャッシュを設定することで、関数実行・後段のAPI コールを省略できるようにした
①Amazon API Gateway ステージキャッシュをつけることで、Amazon API Gateway から直接レスポンス（GET 系のみ）
②AWS Lambda 関数のグローバル変数は、ホットスタート時に再利用される*
③Amazon ECS にAmazon ElastiCache（Valkey）を併用することで、Amazon RDS よりも応答性能がよくなる
①
②
③
*参考：https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/lambda-runtime-environment.html#static-initialization


## p.20

20
API のパフォーマンス改善：非同期化
アクセスが集中した時でもLambda の実行時間を短くするため、後回しできる処理をAmazon SQS で分けた
同期処理（〜100 ms）
非同期処理（〜10000 ms）
従来
最大12000 ms
更新後
平均150 ms 程度
これらの最適化を実施したことによる、レスポンスタイムの改善
*高負荷が予想される場合、IVS Realtime Token はAPI をコールする代わりに、アプリケーション側でキーペアを用意して発行することもできる
https://docs.aws.amazon.com/ja_jp/ivs/latest/RealTimeUserGuide/getting-started-distribute-tokens.html
IVS Realtime Token は、AWS Lambda 関数で直接発行*して実行時間を短縮する
IVS のAPI コールレート
50 TPS（緩和不可）
AWS Step Functions はExpress ワークフローを利用
ワークフロー同時実行数
6,000
この上限に達した場合に備えて、Invoke するLambda 側でリトライ処理を実装


## p.21

Kustamie における生成AI活用


## p.22

Kustamie におけるAI 活用
チャットモデレーションの自動化
配信中に投稿されるチャットの内容を効率的にチェックするため、Amazon Nova Micro モデルを活用
22


## p.23

Amazon Nova を使った高速モデレーション
Amazon Nova Micro を使って、多言語対応の高速モデレーションを実現
[
{
"message_id": "78b8ce4c-482e-f297-234d-0242e2a8d62c",
"content": "質問があります。今後の展望はどのようにする予定でしょうか？"
},
{
"message_id": "29d57349-dd52-07be-99d5-cf27d433ed63",
"content": "とても良いアイディアですね！！"
},
{
"message_id": "071a87c3-2ba0-78ac-1fb9-ccdadd6a14cc",
"content": "逆に考えるとそういう手段もあるのか..."
},
{
"message_id": "4daf1db5-4929-e6d6-9526-6b366a8a6bb2",
"content": "死んでください"
},
{
"message_id": "272235c2-d4df-9aca-5643-51a248c8b716",
"content": "パチパチ🫶"
}
]
ペルソナ：
あなたは、与えられた文章が
有害なコンテンツではないかを確認する
プロです...
[
{
"categories": [],
"language": "ja"
},
{
"categories": [],
"language": "ja"
},
{
"categories": [],
"language": "ja"
},
{
"categories": ["self-harm"],
"language": "ja"
},
{
"categories": [],
"language": "ja"
}
]
Amazon Bedrock
(Nova Micro)
レイテンシー1.6 秒
23


## p.24

他サービスとの比較
実装時に他サービスとの比較を行ったが、応答速度と柔軟性の面からAmazon Nova Micro を選択した
24
候補①：Amazon Comprehend - Trust and Safety
•
与えられた文章が不適切なコンテンツではないか、複数観点で
確認する
•
学習済みのデータを用いるためレスポンスが早い
•
対応言語が英語のみ（2025/10 現在）
候補②：Amazon Bedrock (Serverless Third Party Models)
•
生成AI を使って、不適切なコンテンツの確認を行う
•
多言語対応
•
Anthropic Claude などのサードパーティモデルを使うと、
レスポンスが遅い（検証実施当時）
Amazon Nova Micro
•
サードパーティモデルと比べてレスポンス速度が
速い
•
学習済みでない不適切な単語でも識別可能
•
200 以上の言語に対応


## p.25

映像モデレーションの構想
チャットモデレーションと同様に、配信映像の自動チェックを行いたい
25
（生成AIで作成した画像）
遊びに来てくれてありがとうございます！
手に汗握るギリギリの攻防戦！表彰台の頂点を目指して全力で走ります！
初見さんも大歓迎ですので、ぜひ気軽にコメントしていってくださいね！
{
"categories": []
}
ペルソナ：
あなたは映像配信サービスで配信されている映像を
逐次確認して、有害なコンテンツが配信されて
いないかを確認するプロです...
Amazon Bedrock
(Nova Lite)
Amazon IVS
スナップショット
IVS で配信されている映像のスナップショットをNova Lite に与える
Nova Lite は不適切なスナップショットではないかを判断し、場合によって配信主催者に通知する


## p.26

まとめ
Kustamie はAWS のサーバーレスサービスをフル活用して、数万人規模の大規模配信を行うことができた
Amazon IVS を使って、大規模でも安定した映像配信・機能提供を実現
Amazon API Gateway ステージキャッシュ・AWS Lambda 関数のグローバル変数・Amazon 
ElastiCache を組み合わせた多段キャッシュ構成
時間的コストの高い処理の非同期化して、API 全体のパフォーマンスを向上
また、AWS の生成AI サービスが安心・安全なプラットフォームの構築に寄与している
Amazon Nova モデルを使って、高速なコンテンツモデレーションを提供
26
は、2026 年秋のベータ版提供開始を予定しています！


## p.27

本発表内容は個人の見解であり、社を代表するものではありません。
© 2026 TBS Television Inc,


## p.28

本セッションのアンケートへ
ご協力をお願いします
Please give us your feedback
Thank you!
CDN227
