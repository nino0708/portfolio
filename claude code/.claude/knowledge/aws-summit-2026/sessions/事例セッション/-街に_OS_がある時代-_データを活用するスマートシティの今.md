---
title: "－街に OS がある時代－ データを活用するスマートシティの今"
category: "事例セッション"
session_id: "ARC243"
pages: 52
topics: ["その他"]
services: ["AWS Glue", "AWS Lambda", "AWS WAF", "Amazon API Gateway", "Amazon Athena", "Amazon Bedrock", "Amazon CloudWatch", "Amazon EC2", "Amazon ECS", "Amazon ElastiCache", "Amazon Route 53", "Amazon S3", "Amazon SQS"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/事例セッション/－街に OS がある時代－ データを活用するスマートシティの今.pdf"
---
# －街に OS がある時代－ データを活用するスマートシティの今


## p.1

ARC243
－街にOS がある時代－
データを活用するスマートシティの今
飯田嘉一郎
KDDIアジャイル開発センター株式会社
ソフトウェアエンジニア
池田匠
KDDIアジャイル開発センター株式会社
ソフトウェアエンジニア


## p.2

1
KDDI Agile Development Center Corporation 
自己紹介
飯田嘉一郎Kaichiro Iida
所属: 
KDDIアジャイル開発センター株式会社
ビジネスイノベーション開発5部
ソフトウェアエンジニア
担当: 
TAKANAWA GATEWAY URBAN OS の開発担当
(フロントからインフラまでなんでも)
経歴:
大手通信事業者でWeb アプリの開発や新規事業推進を経験し、
2024 年にKDDIアジャイル開発センターに入社
入社時からTAKANAWA GATEWAY URBAN OS を担当


## p.3

2
KDDI Agile Development Center Corporation 
街にOS があったら
どんなことができるようになる？


## p.4

3
KDDI Agile Development Center Corporation 
TAKANAWA GATEWAY CITY
THE LINKPILLAR 1 
NORTH
THE LINKPILLAR 1 
SOUTH
MoN Takanawa:
The Museum of Narratives
高輪ゲートウェイ駅
THE LINKPILLAR 2
TAKANAWA GATEWAY CITY 
RESIDENCE


## p.5

4
KDDI Agile Development Center Corporation 
TAKANAWA GATEWAY CITY
THE LINKPILLAR 1 
SOUTH
THE LINKPILLAR 2
2025/3/27 開業：
オフィス、コンベンション、
カンファレンス、ビジネス創造施設
2025/9/12 開業：商業施設
2025/10/2 開業：ホテル
TAKANAWA GATEWAY CITY 
RESIDENCE
MoN Takanawa:
The Museum of Narratives
THE LINKPILLAR 1 
NORTH
2026/3/28 開業：
オフィス、商業施設、フィットネス、
クリニック、文化創造・発信施設、住居


## p.6

5
KDDI Agile Development Center Corporation 
今日のゴール
ゴール
◦TAKANAWA GATEWAY CITY のデータの流れや仕組みがちょっとわかる
◦スマートシティのデータ蓄積とその利用事例を知る
◦TAKANAWA GATEWAY CITY に行った時の体験がちょっと楽しくなる
想定聴講者
◦スマートシティのサービス企画、開発をしている方、しようとしてる方
◦スマートシティ関連の情報を収集している方


## p.7

6
KDDI Agile Development Center Corporation 
今日の話の地図
AWS
等
TAKANAWA INNOVATION PLATFORM
カメラ分析
イベント情報
位置情報
鉄道データ
天気データ
地図情報
ユーザー嗜好
…
TAKANAWA GATEWAY URBAN OS
データ連携
データ連携
データ連携
  
  
    ー
     
 
 の  を  した 行   
 
  エリア の    による  
          ー 
     の    
        
      ル   に  
 
 の    による     、
マー ティン   
 
 流シ   ーションによる
   画、イベント 画  
                          
 
リアルタイ な の情報通知による
行   、    進


## p.8

7
KDDI Agile Development Center Corporation 
今日の話の地図
AWS
等
TAKANAWA INNOVATION PLATFORM
カメラ分析
イベント情報
位置情報
鉄道データ
天気データ
地図情報
ユーザー嗜好
…
TAKANAWA GATEWAY URBAN OS
データ連携
データ連携
データ連携
  
  
    ー
     
 
 の  を  した 行   
 
  エリア の    による  
          ー 
     の    
        
      ル   に  
 
 の    による     、
マー ティン   
 
 流シ   ーションによる
   画、イベント 画  
                          
 
リアルタイ な の情報通知による
行   、    進


## p.9

8
KDDI Agile Development Center Corporation 
街にOS があったら
どんなことができるようになる？


## p.10

9
KDDI Agile Development Center Corporation 
スマート
シティの中の都市
の中の都市OS
引用: 内閣府スマートシティ
(https://www8.cao.go.jp/cstp/society5_0/smartcity/index.html)


## p.11

10
KDDI Agile Development Center Corporation 
引用: 内閣府スマートシティ
(https://www8.cao.go.jp/cstp/society5_0/smartcity/index.html)


## p.12

11
KDDI Agile Development Center Corporation 
都市OS とは何か？
都市OS を
、
、PC のOS と重ねることで理解しようとしてみる


## p.13

12
KDDI Agile Development Center Corporation 
都市OS とは何か？
都市OSを、PCのOSと重ねることで理解しようとしてみる
街のハードウェア
等で得たデータと
と
ユーザが利用するサービスを
つなぐ
つなぐ
役割を担う
担う


## p.14

13
KDDI Agile Development Center Corporation 
「街にOS がある」という意味
TAKANAWA INNOVATION PLATFORM
カメラ分析
イベント情報
位置情報
鉄道データ
天気データ
地図情報
ユーザー嗜好
…
TAKANAWA GATEWAY URBAN OS
データ連携
データ連携
データ連携
データを統合することで、「街の運営者、来街者、住人」にとって、街を
最適化すること
最適化すること
  
  
    ー
     
 
 の  を  した 行   
 
  エリア の    による  
          ー 
     の    
        
      ル   に  
 
 の    による     、
マー ティン   
 
 流シ   ーションによる
   画、イベント 画  
                          
 
リアルタイ な の情報通知による
行   、    進


## p.15

14
KDDI Agile Development Center Corporation 
ここまでのおさらい
• TAKANAWA GATEWAY CITY はOS が入った街
• 都市OS
◦データを統合することで、街とサービスの間を繋ぎ、街に関わる人を便利にする
• 例: ユーザデータをスマホアプリに提供し、スマホアプリからレコメンド
• 街にOS があると・・・？
◦データの統合ができ、サービスで利用できる！
◦街に来た人は、街のデータを使ったサービスを利用できる！
◦街の運営者はデータを参照しながらまちづくりができる！


## p.16

15
KDDI Agile Development Center Corporation 
都市OS の開発や運用は悩みも多い・・・
どのくらいの
リクエストを
捌けると良いの？
捌けると良いの？
今後のリクエス
ト増を想定して、
想定して、
どのように設計すべき？
すべき？
街にいろんな
データがあるが、
があるが、
それってどう貯めて管理するの？
セキュ
リティは大丈夫？
は大丈夫？
パーソナルな
データって
って
どう管理すべき？


## p.17

16
KDDI Agile Development Center Corporation 
都市OS の裏側の話


## p.18

17
KDDI Agile Development Center Corporation 
数字で見る都市OS
リクエスト
数
数
463
万/月
データ
蓄積数
蓄積数
770
万件
連携アプリ
数
数
15
データ
種類数
種類数
26
カメラ分析
イベント情報
位置情報
鉄道データ
天気データ
地図情報
ユーザー嗜好
…
TAKANAWA GATEWAY URBAN OS
データ連携
データ連携
データ連携


## p.19

18
KDDI Agile Development Center Corporation 
都市OS のアーキテクチャ図
クチャ図(一部)
データベース
データレイク
(パーソナル)
自社クラウド
データレイク
KDDI 同意管理基盤
Kubernetes クラスタ
Amazon Route 53
AWS WAF
Application Load 
Balancer
Amazon EC2
KDDI 認証基盤
Amazon EC2
Notification 用GW
Amazon EC2
Notification 用GW
Amazon EC2
FIWARE-Orion
Amazon EC2
データベース
Amazon EC2
データアクセス
制御
Amazon SQS
Amazon API Gateway
Amazon ECS
Amazon SQS
Amazon ECS
Amazon SQS
Amazon ECS
Amazon SQS
Amazon ECS
Amazon Athena
Amazon S3
AWS Glue


## p.20

19
KDDI Agile Development Center Corporation 
都市OSのアーキテクチャ図
クチャ図(一部)
データベース
データレイク
(パーソナル)
自社クラウド
データレイク
KDDI 同意管理基盤
Kubernetes クラスタ
Amazon Route 53
AWS WAF
Application Load 
Balancer
Amazon EC2
KDDI 認証基盤
Amazon EC2
Notification 用GW
Amazon EC2
Notification 用GW
Amazon EC2
FIWARE-Orion
Amazon EC2
データベース
Amazon EC2
データアクセス
制御
Amazon SQS
Amazon API Gateway
Amazon ECS
Amazon SQS
Amazon ECS
Amazon SQS
Amazon ECS
Amazon SQS
Amazon ECS
Amazon Athena
AWS Glue
Amazon S3
①今のデータを管理
②データの更新を通知
③過去のデータを管理


## p.21

20
KDDI Agile Development Center Corporation 
都市OSのアーキテクチャ図
クチャ図(一部)
データベース
データレイク
(パーソナル)
自社クラウド
データレイク
KDDI 同意管理基盤
Kubernetes クラスタ
Amazon Route 53
AWS WAF
Application Load 
Balancer
Amazon EC2
KDDI 認証基盤
Amazon EC2
Notification 用GW
Amazon EC2
Notification 用GW
Amazon EC2
FIWARE-Orion
Amazon EC2
データベース
Amazon EC2
データアクセス
制御
Amazon SQS
Amazon API Gateway
Amazon ECS
Amazon SQS
Amazon ECS
Amazon SQS
Amazon ECS
Amazon SQS
Amazon ECS
Amazon Athena
AWS Glue
Amazon S3
①今のデータを管理
②データの更新を通知
③過去のデータを管理
FIWARE Orion
•
「今」の状態や
データを管理するOSS
(コンテキストブローカー)
•
データ更新時にサブスクリプ
ション通知も送信可


## p.22

21
KDDI Agile Development Center Corporation 
セキュ
リティの面の課題
の面の課題
データベース
データレイク
(パーソナル)
自社クラウド
データレイク
KDDI 同意管理基盤
Kubernetes クラスタ
Amazon Route 53
AWS WAF
Application Load 
Balancer
Amazon EC2
KDDI 認証基盤
Amazon EC2
Notification 用GW
Amazon EC2
Notification 用GW
Amazon EC2
FIWARE-Orion
Amazon EC2
データベース
Amazon EC2
データアクセス
制御
Amazon SQS
Amazon API Gateway
Amazon ECS
Amazon SQS
Amazon ECS
Amazon SQS
Amazon ECS
Amazon SQS
Amazon ECS
Amazon Athena
AWS Glue
Amazon S3
FIWARE Orion にはセキュリティ面で課題があった
•
API 認証なし
•
レートリミ
ットなし
なし
•
IP フィルタリン
グなし、
グなし、
•
Notification の真正性なし
→FIWARE の設計思想でもプロキシ設置前提
なので、自分たちで実装する必要があった


## p.23

22
KDDI Agile Development Center Corporation 
セキュリティの面の課題
データベ
ース
ース
データレイ
ク
ク
(パーソナル)
自社クラウド
データレイ
ク
ク
KDDI 同意管理基盤
Kubernetes クラスタ
Amazon Route 53
AWS WAF
Application Load 
Balancer
Amazon EC2
KDDI 認証基盤
Amazon EC2
Notification 用GW
Amazon EC2
Notification 用GW
Amazon EC2
FIWARE-Orion
Amazon EC2
データベース
Amazon EC2
データアクセス
制御
Amazon SQS
Amazon API Gateway
Amazon ECS
Amazon SQS
Amazon ECS
Amazon SQS
Amazon ECS
Amazon SQS
Amazon ECS
Amazon Athena
AWS Glue
Amazon S3
• KDDI 認証基盤
•
API 認証
•
レートリミット
•
IP フィルタリング
• データアクセス制御
•
パーソナルデータアクセス制御
•
登録データバリデーション
• Notification 用GW
•
Notification の真正性担保
(HMAC 署名付与)
→KDDI 資産を活用しつつセキュリティ担保


## p.24

23
KDDI Agile Development Center Corporation 
今日の話の地図
AWS
等
TAKANAWA INNOVATION PLATFORM
カメラ分析
イベント情報
位置情報
鉄道データ
天気データ
地図情報
ユーザー嗜好
…
TAKANAWA GATEWAY URBAN OS
データ連携
データ連携
データ連携
  
  
    ー
     
 
 の  を  した 行   
 
  エリア の    による  
          ー 
     の    
        
      ル   に  
 
 の    による     、
マー ティン   
 
 流シ   ーションによる
   画、イベント 画  
                          
 
リアルタイ な の情報通知による
行   、    進


## p.25

24
KDDI Agile Development Center Corporation 
今日の話の地図
AWS
等
TAKANAWA INNOVATION PLATFORM
カメラ分析
イベント情報
位置情報
鉄道データ
天気データ
地図情報
ユーザー嗜好
…
TAKANAWA GATEWAY URBAN OS
  
  
    ー
     
 
 の  を  した 行   
 
  エリア の    による  
          ー 
     の    
        
      ル   に  
 
 の    による     、
マー ティン   
 
 流シ   ーションによる
   画、イベント 画  
                          
データ連携
データ連携
データ連携
ここまでの話
街のデータをどう統合して、都市OS から
どのようにデータを提供するか？
 
リアルタイ な の情報通知による
行   、    進
                        
ここからの話
街に来た人が利用する、
サービスの事例


## p.26

25
KDDI Agile Development Center Corporation 
街とユーザ
ーをつなぐ
つなぐ
「TAKANAWA GATEWAY CITY アプリ
」
」


## p.27

26
KDDI Agile Development Center Corporation 
自己紹介
池田匠Takumi Ikeda
所属: 
KDDIアジャイル開発センター株式会社
ビジネスイノベーション開発5部
ソフトウェアエンジニア
担当: 
TAKANAWA GATEWAY CITY アプリのバックエンド開発担当
（API 開発・インフラの構築・運用）
用）
2025 年にKDDIアジャイル開発センター株式会社に入社


## p.28

27
KDDI Agile Development Center Corporation 
街とユーザ
ーをつなぐ「
つなぐ「TAKANAWA GATEWAY CITY アプリ
」
」
インストール数
約67,000
街で働くワーカーや来街者に
ーや来街者に
“快適さ” を
提供する
提供する


## p.29

28
KDDI Agile Development Center Corporation 
街とユーザ
ーをつなぐ「
つなぐ「TAKANAWA GATEWAY CITY アプリ
」
」
Push 通知
まちマップ
/まちこえ
/経路案内
イベント
一覧
施設一覧
アクション


## p.30

29
KDDI Agile Development Center Corporation 
街の「今」を届ける
届ける
Today’s Pickup
• ユーザーの興味関心ごとに合ったイベント・飲食店をレコメンド
• 一定時間ごとに更新


## p.31

30
KDDI Agile Development Center Corporation 
街の「今」を届ける
届ける
Push 通知
• 改札通過時、Wi-Fi 接続時にPush 通知を送信
◦改札通過時：「タッチトリガー」サービスを用いて、
Suica タッチのタイミングをリアルタイムに連携
• ユーザーの興味関心ごとに合ったイベント・飲食店をレコメンド
※タッチトリガーは、東日本旅客鉄道株式会社が提供するサービスです。


## p.32

31
KDDI Agile Development Center Corporation 
街の「今」を届ける
届ける
イベント
一覧
一覧
•
街で開催されているイベントを一覧で表示
•
イベントのいいね・予約も可能
•
アプリに事前に登録しておいたSuica で
参加可能
◦クラウド型ID 認証ソリューション
「ID-PORT」サービスと連携
※ID-PORT はJR東日本メカトロニクス株式会社の提供するサービスです。


## p.33

32
KDDI Agile Development Center Corporation 
街の空間と声を可視化する
可視化する
まちマップ
/ まちこえ/ 経路案内
• 施設情報や開催中のイベントをマップで表示
• 行きたい場所まで経路案内でスムーズに移動


## p.34

33
KDDI Agile Development Center Corporation 
街の空間と声を可視化する
可視化する
施設一覧
• 街にある施設やサービスを一覧で表示
• ユーザーの興味関心ごとに合ったレストラン・
ショッピング施設をPickup


## p.35

34
KDDI Agile Development Center Corporation 
街での活動を価値に変える
価値に変える
アクション
• 街とつながることでアクションがたまる
• 街ならではの特典に交換
※特典は一例です


## p.36

35
KDDI Agile Development Center Corporation 
試作と
分析を繰り返す先進的な「実験都市」。
繰り返す先進的な「実験都市」。
その特有の課題をどう解決するか。
どう解決するか。


## p.37

36
KDDI Agile Development Center Corporation 
「TAKANAWA GATEWAY CITY アプリ
」開発で直面した
」開発で直面した4 つの課題
1.実験都市のスピード感に耐えうる
アーキテ
クチャ
クチャ
2.街の盛り上がりの動的な可視化
3.来街者へのリ
アルタイムな価値提供
な価値提供
4.複雑なシステムの安定稼働を支える
支える
監視基盤


## p.38

37
KDDI Agile Development Center Corporation 
全体アー
キテクチャ
クチャ


## p.39

38
KDDI Agile Development Center Corporation 
1. 実験都市のスピード感に耐えうる
アーキテクチャ
クチャ
①頻繁な仕様変更や
や
機能追加
②ユーザ
ー数に応じて
ー数に応じて
スケール可能
③多数の外部API 連携


## p.40

39
KDDI Agile Development Center Corporation 
1. 実験都市のスピード感に耐えうる
アーキテクチャ
クチャ
Amazon API Gateway + AWS Lambda を中心とした
サーバーレスアーキテクチャを採用
•
疎結合に構築・運用できる
•
ユーザー数に応じてスケール可能
•
従量課金制
•
接続する外部連携先に適した設定で構築
最大700 rps まで耐えうる堅牢性を実現
実現


## p.41

40
KDDI Agile Development Center Corporation 
2. 街の盛り上がりの動的な可視化（まちこえ）


## p.42

41
KDDI Agile Development Center Corporation 
2.街の盛り上がりの動的な可視化（まちこえ）
Amazon Bedrock を活用して、まちこえを生成
•
生成AI で人手を介さず、継続的な発信が可能
•
既存のAWS プラットフォームとの親和性が高い
•
TAKANAWA GATEWAY CITY 固有の名称でも
チューニングが可能
•
RAG（検索拡張生成）への拡張性


## p.43

42
KDDI Agile Development Center Corporation 
2.街の盛り上がりの動的な可視化
「残り10 日」を「まもなく終了」と誤認するなど、
「まもなく終了」と誤認するなど、
イベント期限の計算でハルシネーション
•
プロンプトで「開催期間を考慮しない」よう指示し、
文字列のバリエーション生成に特化させる対策を実施


## p.44

43
KDDI Agile Development Center Corporation 
3. 来街者へのリ
アルタイムな価値提供
な価値提供
最適なタイミングでイベント・飲食点のレコメ
ンドを行う
行う


## p.45

44
KDDI Agile Development Center Corporation 
3. 来街者へのリ
アルタイムな価値提供
な価値提供
アプリ内で嗜好性登録を行い、
au ID に紐づいた購買データや興味関心データで補強
アカウント作成時に嗜好性登録を行う
•
興味関心のあるキーワード
•
参加してみたいイベント
•
好きな料理のジャンル
•
街に訪れる目的


## p.46

45
KDDI Agile Development Center Corporation 
3. 来街者へのリ
アルタイムな価値提供
な価値提供
外部システムと連携し、リアルタイムで
イベント・飲食店をレコメンド
•
AWS End User Messaging でPush 通知
•
改札通過やWi-Fi 接続で来街検知
•
Amazon ElastiCache でレコメンド結果をキャッシュ
•
Today’s Pickup に同じイベント・飲食店を表示


## p.47

46
KDDI Agile Development Center Corporation 
4. 複雑なシステムの安定稼働を支える監視基盤
支える監視基盤
•
Amazon CloudWatch Logs に出力されたログから、Subscription Filter を用いて個人情報を含まないログの
み監視SaaS に送信
•
Amazon Data Firehose を使った監視SaaS へのログ転送
◦送信失敗時にはAmazon S3 へGzip 形式で保存
監視SaaSへのセキュアなロ
グ転送フロー
ー


## p.48

47
KDDI Agile Development Center Corporation 
クロージング
グ


## p.49

48
KDDI Agile Development Center Corporation 
今日の話の地図
AWS
等
TAKANAWA INNOVATION PLATFORM
カメラ分析
イベント情報
位置情報
鉄道データ
天気データ
地図情報
ユーザー嗜好
…
TAKANAWA GATEWAY URBAN OS
データ連携
データ連携
データ連携
  
  
    ー
     
 
 の  を  した 行   
 
  エリア の    による  
          ー 
     の    
        
      ル   に  
 
 の    による     、
マー ティン   
 
 流シ   ーションによる
   画、イベント 画  
                          
 
リアルタイ な の情報通知による
行   、    進


## p.50

49
KDDI Agile Development Center Corporation 
街にOS があるということ


## p.51

50
KDDI Agile Development Center Corporation 
まとめ
• TAKANAWA GATEWAY CITY のデータの流れや仕組みをご紹介
◦データを都市OS で統合し、アプリで利用する
◦TAKANAWA GATEWAY URBAN OS とTAKANAWA GATEWAY  CITY アプリの
事例を紹介
◦都市OS とアプリを支えるAWS 事例
実際に街に行って、スマー
トシティを体験してみてください！
体験してみてください！


## p.52

本セッションのアンケートへ
ご協力をお願いします
Please give us your feedback
Thank you!
ARC243
