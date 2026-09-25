---
title: "大規模障害から考える、 AWS 上で備えるべきレジリエンスの実践"
category: "AWSセッション"
session_id: "ARC339"
pages: 62
topics: ["運用/SRE"]
services: ["AWS Lambda", "Amazon Aurora", "Amazon CloudWatch", "Amazon EC2", "Amazon ECS", "Amazon EKS", "Amazon Route 53"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/AWSセッション/大規模障害から考える、 AWS 上で備えるべきレジリエンスの実践.pdf"
---
# 大規模障害から考える、 AWS 上で備えるべきレジリエンスの実践


## p.1

ARC339
大規模障害から考える、
AWS 上で備えるべきレジリエンスの実践
猪又赳彦
アマゾンウェブサービスジャパン合同会社


## p.2

自己紹介
名前：猪又赳彦
所属：エンタープライズサポート
役職：シニアテクニカルアカウントマネージャー
経歴：日系企業のインフラ部門にて、設計・開発
等に従事


## p.3

本セッションの対象者とゴール
対象者
• リージョン、アベイラビリティゾーン、Amazon CloudWatch などの
基本的な知識をお持ちの方
• AWS 上でシステムの可用性・耐障害性の設計や運用に携わる方
• 障害対応プロセスの改善やレジリエンス戦略の強化を検討されている方
ゴール
• 実際の障害発生時のAWS の障害対応プロセスを理解し、自社の障害対応に活かす
• AWS の可用性の基本原則（Availability Axioms ）と実践ツールを学ぶ


## p.4

皆さんは、障害が起きたとき、どう対応していますか？
いざという時の備えは、できていますか？
AWS も20 年、大規模障害と向き合ってきました。
その経験をもとに、多くの教訓をプロセスと原則に変えてきました。
本日は、その実践をご紹介します。


## p.5

アジェンダ
1.  障害が起きた時、AWS は何をしているのか？
2.  Availability Axioms — 障害から生まれた4 つの原則
3.  Fidelity の実践— 9 分で2,000 アプリを切り替えた話


## p.6

障害が起きた時、
AWS は何をしているのか？


## p.7

フェーズ1: 検出と軽減策の実施


## p.8

サービス側からの検出
• メトリクス
• 合成監視
• 集約アラーム
お客様側からの検出
• トラフィック異常
• サポートケースの急増
検出
AWS トップレベルダッシュボード


## p.9

軽減策の実施
シフトアウェイ
ロールバック
再起動
スケールアップ
ロールフォワード


## p.10

フェーズ2: 振り返りと計画


## p.11

何を振り返るか
• インパクトサマリー
• 根本原因（Five Whys）
• 教訓
• アクションアイテム
振り返り: COE (Correction of Error)


## p.12

よく誤解される— やってはいけないこと
• 5 回で止める
• 量より質が重要
• 直線的な分析に限定する
• 複数の要因によって引き起こされることが多いため、問い
を分岐させて考えることが重要
振り返り: Five Whys


## p.13

1.
なぜAPI コールが失敗したのか？
フリート内の1 台のホストが5xx エラーを返していた
2.
なぜホストは5xx エラーを返したのか？
ホストがストレージボリュームに書き込めなかった
3.
なぜストレージボリュームに書き込めなかったのか？
EBS ボリュームが応答していなかった
4.
なぜEBS ボリュームに問題があったのか？
euw2-az1 の一部に影響するイベントが進行中だった
5.
なぜ…
振り返り: Five Whys （悪い例）


## p.14

なぜAPI コールの3% が45 分間失敗したのか?
フリート内の100 台中1 台のホストが5xx エラーを返していた
1.1 なぜそのホストは5xx エラーを返したのか？
ホストがストレージボリュームに書き込めなかった
1.2 なぜストレージボリュームに書き込めなかったのか？
EBS ボリュームが応答していなかった
2.1 なぜヘルスチェックで障害ホストが除外されなかったのか？
ヘルスチェックロジックの設定ミスでTCP ヘルスチェックのみ使用
2.2 なぜヘルスチェックが誤設定されていたのか？
サービステンプレートにバグがあった
3.1 なぜ問題は45 分間継続したのか？
オペレーターが最初の30 分間対応していなかった
3.2 なぜオペレーターが対応していなかったのか？
アラーム閾値が5% の障害率に設定されていた
3.3 …
振り返り: Five Whys （改善版）


## p.15

フェーズ3: 学習とスケーリング


## p.16

スケーリング
チーム教育
お客様側で対応する
変更
AWS 側で完結する
変更


## p.17

Availability Axioms 
障害から生まれた4 つの原則


## p.18

AZ 障害への
自動対応
リージョンの分離
厳密なテスト
過負荷からの保護
可用性の基本原則(Availability Axioms)


## p.19

リージョンの分離
可用性の基本原則(Availability Axioms)


## p.20

AWS Security 
Token Service 
(STS)


## p.21

リージョンの分離
全世界のSTS リクエストはどこへ向かう？( 2011 年〜)


## p.22

リージョンの分離
STS のグローバルエンドポイントのみ存在（〜2015 年）


## p.23

リージョンの分離
STS リージョナルエンドポイントリリース
利用推奨するも、移行は進まず( 2015 年〜2024 年)


## p.24

リージョンの分離
STS グローバルエンドポイントのレプリカを全リージョンへリリース
お客様側の対応なしで同一リージョン内で完結できるように( 2025 年)


## p.25

AZ 障害への
自動対応
可用性の基本原則(Availability Axioms)


## p.26

AWS Lambda


## p.27

99.99 % の可用性


## p.28

グレー障害への対応：ヘルスチェックの設計
浅い（Shallow）
深い（Deep）
正しく実装するのは
非常に難しい
予算化
非バイナリ比較
過敏
鈍感


## p.29

Fleet Health Service を構築
ログ
Amazon CloudWatch
Contributor Insights
SetInstanceHealth
Alarm
{
…
“AZ-ID”: “use-az1”,
“HttpStatusCode”: 500,
“Latency”: 100,
“InstanceId”: “XXX”,
“Faults”: 1,
”Success”: 0,
…
}
(INSIGHT_RULE_METRIC(…, “MaxContributorValue”)/
INSIGHT_RULE_METRIC(…, “Sum")) > 0.66
1 台で全エラーの66% 以上を占めるときに検知
Error count
Time
Errors per instance


## p.30

Zonal Event Detector
Availability Zone 1
Availability Zone 2
Availability Zone 3
接続エラー
パケットロス
DNS 解決
ホスト数
到達可能性
欠落メトリクス
接続エラー
パケットロス
DNS 解決
ホスト数
到達可能性
欠落メトリクス
接続エラー
パケットロス
DNS 解決
ホスト数
到達可能性
欠落メトリクス


## p.31

Zonal Event Detector
Availability Zone 3
接続エラー
パケットロス
DNS 解決
ホスト数
到達可能性
欠落メトリクス


## p.32

ゾーナルシフト(Zonal Shift)
Availability 
Zone
Availability 
Zone
Availability 
Zone
Elastic Load Balancing
Amazon EC2 Auto Scaling group
Amazon Elastic Kubernetes (EKS) cluster


## p.33

Availability 
Zone
Availability 
Zone
Elastic Load Balancing
Amazon EC2 Auto Scaling group
Amazon Elastic Kubernetes (EKS) cluster
ゾーナルシフト(Zonal Shift)


## p.34

ゾーナルオートシフト(Zonal AutoShift)
Availability 
Zone
Availability 
Zone
Availability 
Zone
AWS サービス
顧客アプリケーション
Zonal Event Detector


## p.35

Availability 
Zone
Availability 
Zone
AWS サービス
顧客アプリケーション
Zonal Event Detector
ゾーナルオートシフト(Zonal AutoShift)


## p.36

可用性の基本原則(Availability Axioms)
厳密なテスト


## p.37

AWS テストリージョン
商用パーティションの
新リージョン
お客様なし
ゲームデーイベントを
継続的に実行
テスト専用に構築された完全なAWS リージョン


## p.38

何のテストをするか?
AZ 電源断と
シフト
依存関係の利用不可
サービス再起動


## p.39

過負荷からの保護
可用性の基本原則(Availability Axioms)


## p.40

準安定障害(Metastable Failure)
安定
脆弱
準安定
負荷の増加
トリガー
1
2
3
リカバリ
持続効果
4
5


## p.41

キューにおける準安定性
通常の状態


## p.42

キューにおける準安定性
突然の負荷スパイクが発生
誰にも届かない処理！
新規リクエスト！


## p.43

キューにおける準安定性
キューが増え続ける
新規リクエスト！
リトライ！
誰にも届かない処理が積み重なり、
システムが回復不能に


## p.44

転換点の発見
統計モデル
シミュレーション
エミュレーション
テスト
def program():
api = {'insert': Work(10, [])}
server = Server('simple', api,
qsize=150, thread_pool=1)
src = Source('client', 'insert’, 
rate=5, timeout=5, retries=5)
p = Program('SimpleService’)
p.add_server(server)
p.add_source(src)
return p.connect('client', 'simple')
実環境の再現度
労力と時間


## p.45

Metafor
サーバーシステムにおける準安定性の分析
安定領域
障害の
可能性あり
転換点
Metafor
Github
Research 
paper


## p.46

STS リージョン
分離
リージョンの分離
AWS のレジリエンス強化の取り組み
AZ 障害への
自動対応
厳密なテスト
AWS テスト
リージョン
過負荷からの保護
準安定障害解析
Fleet Health Service と
Zonal Event Detector


## p.47

Fidelity の実践
9 分で2,000 アプリを切り替えた話


## p.48

2025 年10 月20 日
US East 1 — DynamoDB DNS 障害発生
DNS が有効なIP を返さなくなり、お客様はDynamoDB に接続不能に。
DynamoDB に依存するAWS サービスに影響が連鎖。
Amazon ストアだけでPrime Day に1 億5,100 万リクエスト/秒を処理する規模の
基盤サービスが停止した。


## p.49

Fidelity のクラウド活用
1900+
AWS アカウント
8500+
アプリケーション
（パブリッククラウド）
9
年間
（パブリッククラウド利用歴）
75%
クラウド上のアプリ
6000+
データベースインスタンス
40% がパブリッククラウド


## p.50

レジリエンステスト
インフラストラクチャレベル
フェイルオーバー& テスト
アプリケーションレベル
障害テスト
クロスアプリケーションレベル
アプリ横断テスト
自動化レベル
auto スコアリング
自動アプリ横断レジリエンススコアリング
時系列改善ダッシュボード
メリット
インフラストラクチャレジリエンス
Region / zone / オンプレミス& CSP 障害
アプリケーション& インフラストラクチャテスト
アプリケーションリカバリテスト
実際の顧客体験テスト
アプリ横断依存関係分析
Fidelity Investments


## p.51

83%
リカバリ時間改善
21 ビジネスユニットで3,000 アプリを
テスト
依存プラットフォームとアプリを含む
レジリエンステスト
レジリエンステストの
実績


## p.52

レジリエンステスト
フェイルオーバーの実践
2,000 個のアプリのフェイルオーバー
に成功
10 月20 日US-East-1 イベント
主な学び
・サードパーティSaaS との協調テスト
・安定確認まで切り替え先に留まる判断
・リージョナルイベントは複雑、依存関係
を踏まえた順序立ったリカバリーが必要
9
分
障害検知から
切り替え完了まで


## p.53

AWS Fault Injection 
Service
Amazon Application 
Recovery Controller 
Region switch
マルチリージョン
リカバリ
AWS のツール
レジリエンステスト


## p.54

マルチリージョンリカバリ
Amazon Application 
Recovery Controller 
(ARC) 
Region switch
マルチリージョンのリカバリを一括管理する
フルマネージドサービス
繰り返し可能なリカバリプランを作成
依存アプリケーション間のリカバリを調整
ポートフォリオ全体と個別実行レベルでリカバリ
を監視


## p.55

Region switch プラン
リカバリプロセスのブループリント
各プランは単一のマルチリージョンサービス
またはアプリケーション用
ネストされたプラン（親子関係）をサポート
他のアカウントとプランを共有


## p.56

実行ブロック
Region switch 
アクション
手動承認
カスタムアクション
（Lambda）
Region switch 
プラン
ネットワーキング
データベース
リカバリ
Amazon Aurora
Global Database
コンピュート
スケーリング
Amazon EC2
Auto Scaling
Amazon ECS
Amazon EKS
ARC
Routing control
Amazon Route 53
health check
Amazon DocumentDB


## p.57

プラン評価（組み込みの準備チェック）
プラン変更後
検証チェック
IAM 権限
リソース設定
稼働キャパシティ
警告
AWS
コンソール
Amazon 
EventBridge
AWS
API
30 分ごと


## p.58

テストを実行してリカバリ
テストを開始
定義したメトリクス
/アラームで障害を
検出
リカバリ手順を
実行
アプリケーション
のリカバリを検証
検出時間とリカバリ
時間をレビュー
テスト目標と比較


## p.59

まとめ


## p.60

• 障害対応のプロセスは、
検出と軽減策の実施→振り返り→学習とスケーリング
• 障害から生まれた可用性の基本原則- Availability Axioms
（リージョンの分離／AZ 障害への自動対応／厳密なテスト／過負
荷からの保護）
• Fidelity は9 分で2,000 アプリを切り替え。日常的なテストが重要
• AWS Fault Injection Service で障害を注入、Application Recovery 
Controller Region switch で復旧をオーケストレーション
本セッションのまとめ


## p.61

Ask the Speaker
こちらのRoom 後方の外側にございます、
「Ask the Speaker」カウンターまでお越しください
猪又赳彦
アマゾンウェブサービスジャパン合同会社
Room


## p.62

本セッションのアンケートへ
ご協力をお願いします
Please give us your feedback
Thank you!
ARC339
