---
title: "日産自動車 × デロイト トーマツ： Kiro CLI によるコネクティッドカーサービス 基盤開発の加速"
category: "パートナーセッション"
sponsor: "Deloitte"
session_id: "PRT205"
pages: 22
topics: ["AI駆動開発", "アーキテクチャ/サーバーレス"]
services: ["AWS CloudFormation", "AWS Lambda", "AWS Security Hub", "AWS WAF", "Amazon API Gateway", "Amazon CloudWatch", "Amazon DynamoDB", "Amazon EC2", "Amazon EventBridge", "Amazon GuardDuty", "Amazon Inspector", "Amazon RDS", "Amazon Route 53", "Amazon S3", "Amazon SNS", "Amazon SQS", "Kiro"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/パートナーセッション/日産自動車 × デロイト トーマツ： Kiro CLI によるコネクティッドカーサービス 基盤開発の加速 (sponsored by Deloitte).pdf"
---
# 日産自動車 × デロイト トーマツ： Kiro CLI によるコネクティッドカーサービス 基盤開発の加速


## p.1

PRT205-S
赤坂亮介
日産自動車株式会社
モノづくりシステムソリューション本部
エンジニアリング＆デザインシステム部・主担
Senior Manager
日産自動車× デロイトトーマツ：
Kiro CLI によるコネクティッドカーサービス
基盤開発の加速(sponsored by Deloitte)
松本祐樹
合同会社デロイトトーマツ
Senior Specialist Lead


## p.2

日産自動車× デロイトトーマツ：
Kiro CLIによる
コネクティッドカーサービス基盤開発の加速
合同会社デロイトトーマツ
松本祐樹
日産自動車株式会社
赤坂亮介


## p.3

登壇者のご紹介
Part 1: Nissanが目指すConnected Car ServiceとService Platform
日産自動車株式会社
赤坂亮介
Part 2: SPFのアーキテクチャとKiro CLI
合同会社デロイトトーマツ
松本祐樹
目次


## p.4

© 2026. For information, contact Deloitte Tohmatsu Group.
3
Part 1: Nissanが目指すConnected Car ServiceとService Platform


## p.5

4
Nissan Connect Serviceとは


## p.6

5
モビリティサービスは、継続的に進化する時代へ
◼「つながるクルマ」を起点に、価値は“継続的に追加”される
つながるクルマ
クルマが最高の相棒に
サービスは、次々に追加され続ける
一度作って終わりという前提が、もはや成り立たない
◼サービスの起点
◼そこから広がるサービス


## p.7

6
サービス増加は、全体の制御を困難にする
◼依存関係が増えるほど、変更の影響は全体に広がる
◼サービスが少ない状態
◼サービスが増え続ける状態
やがて、全体は制御できなくなる
Services
Platforms
Vehicles
A’
B’
C’
A
B
C
New
…
Services
Platforms
Vehicles
A’
B’
✓
依存関係はシンプル
✓
変更の影響は局所に留まる
✓
全体を把握できる
A
B
×
依存関係が複雑に絡み合う
×
変更の影響が予測できない
×
全体の整合性が崩れる


## p.8

7
目指すのは、サービス全体の一貫性
◼すべてのサービスを、一つの体験として提供する
どのサービスでも、同じ顧客IDで“同じ体験”を届ける
既存サービスへの影響ゼロで、新サービスを追加できる
顧客・契約・請求・車両管理を、一か所で管理する
1
2
3
顧客
A
B
Z
・・・
共通プラットフォーム
・顧客管理
・契約請求管理
・車両管理
1
2
3
契約登録
請求・回収
契約登録/解約
サービス群
車両利用
共通IDを使用した顧客管理


## p.9

8
構造を維持するには、分離が必要
◼サービスが増え続けると、共通部分が混ざり、変更の影響が広がる
契約管理
請求管理
車両管理
サービスA
サービスB
サービスZ
・・・
個別機能
個別機能
個別機能
個別機能
個別機能
個別機能
価値（サービス内）
共通（サービス外）
顧客管理
サービスを追加しても、崩れにくい構造を作る
価値はサービスに、共通部分はサービスの外側へ


## p.10

9
分離するだけでは、構造は崩れていく
◼理想と現実のギャップが、構造を壊し始めた
◼理想
✓共通機能と価値創造を分離する
✓サービスは独立して進化できる
✓全体としてシンプルな構造になる
◼現実
× 境界は、開発の都合で簡単に超えられる
➢例外対応が“最短”として積み重なる
➢標準が壊れ、構造が徐々に崩れていく
必要だったのは、
「使われ続ける設計」
設計しただけでは、維持できない
※例外が増えるほど、“本来の構造”を維持できなくな
る
構造は、放っておくと必ず崩れる
理想は、そのままでは維持できない


## p.11

10
「使われ続ける設計」とは何か
◼構造を作るだけでは足りない、「使われ続ける前提」まで設計する
◼従来の設計
✓機能をどこに置くか決める
✓システムとしての構造を設計する
✓正しい構造をつくることを重視する
◼私たちの設計
✓使われ方（運用・拡張）まで前提にする
✓判断基準やルールも含めて設計する
✓構造が維持され続けることを重視する
NissanConnectの継続的進化を支えるために、AIを活用したService Platform （SPF）を構築
• 例外は増え続け、変化は止まらない
• 人の判断や運用だけでは、維持しきれない
➢判断と適応を継続的に回し続ける仕組みが必要
➢人の力だけでスケールさせるのは現実的ではない


## p.12

© 2026. For information, contact Deloitte Tohmatsu Group.
11
Part 2: SPFのアーキテクチャとKiro CLI


## p.13

© 2026. For information, contact Deloitte Tohmatsu Group.
12
AWS Cloud
SaaS
/外部システム
Amazon DynamoDB
AWS Lambda 
(顧客管理ドメイン)
Virtual private cloud (VPC) 
(マルチAZ)
Private subnet
Public subnet
Internet
Amazon S3
Amazon API Gateway
AWS WAF
Amazon Cognito
Private subnet
NAT gateway
AWS Network Firewall
AWS Transfer Family
Amazon SNS
Amazon EventBridge
AWS X-Ray
AWS Secrets Manager
AWS Security Hub
Amazon GuardDuty
Amazon Inspector
AWS CodeBuild
AWS CodeCommit
(モノリポジトリ)
AWS CodePipeline
Amazon CloudWatch
AWS CloudFormation
Amazon AppFlow
AWS Lambda 
(請求管理ドメイン)
AWS Lambda 
(車両管理ドメイン)
外部
システム
Amazon Route 53
AWS Lambda
(ファイル処理)
AWS Lambda
(パイプライン起動用)
Amazon ECR
Amazon EventBridge
AWS Lambda
(バッチ処理)
Internet
Amazon SES
AWS Step 
Functions 
workflow
Amazon S3
(データ連携)
Alarm
運用保守担当
Amazon SQS
AWS Lambda
(キュー処理)
開発担当


## p.14

© 2026. For information, contact Deloitte Tohmatsu Group.
13
SPFのアーキテクチャの特徴 (1/2)
SPFは3つの業務ドメインに分かれたサーバレスアーキテクチャを採用しており、AWSサービスをフル
活用しております。メンテナンス負荷を最小限に抑え、追加開発に注力しております
◼サーバレスアーキテクチャの採用
➢サービスのプラットフォームであり、今後も拡張を予定している
➢メンテナンス負荷をできる限り下げて、追加開発に注力したい
➢Amazon EC2やAmazon RDSを利用せず、サーバレスアーキテクチャを採用した
• 様々な制約に注意
−AWS Lambdaの同期呼び出しの上限 6MB -> 大きなリストを返却する場合は、ページング処理を入れる
−コンテナLambdaを数週間起動しないとInactiveになる -> Provisioned Concurrencyの導入 or 毎日Lambdaを起動
−Amazon DynamoDB GSIのパーティションあたりのRCU上限 3,000 -> スパースインデックスとして設計
➢最も判断が難しかったところはDynamoDBの可否
• 本当にGSIで検索機能を作り切れるのか、追加要件が出てきても耐えられるのか
−GSIのデフォルトクォータは20個
−検索のユースケースを整理して必要なGSIの数を把握
−最大でGSIが8個必要なテーブルがあった。
RDSの利用も検討したが、メンテナンス負荷低減のメリットの方が大きいと判断して、DynamoDBを利用


## p.15

© 2026. For information, contact Deloitte Tohmatsu Group.
14
SPFのアーキテクチャの特徴 (2/2)
SPFは3つの業務ドメインに分かれたサーバレスアーキテクチャを採用しており、AWSサービスをフル
活用しております。メンテナンス負荷を最小限に抑え、追加開発に注力しております
◼業務ドメインによる分類
➢顧客管理、請求管理、車両管理の３つのドメインに分かれている
• AWSだけでなくSaaSも利用。AWSはSaaSへのオーケストレータでもある
• SaaSで満たせない要件はAWSで実現
➢それぞれでLambdaをプロビジョニングしており、Serverless Expressを利用したLambdalith構成になっている
• 多くのパスがあるため、Lambdaの大量構築を避けたい
• Lambdaで実装しきれなかったら、ECS Fargateに置き換えることも検討しようと考えていた
◼AWSサービスのフル活用
➢セキュリティ：GuardDuty、Secuirty Hub、Amazon Inspector
➢CICD：CodeCommit、CodeBuild、CodePipeline
• EventBridgeとLambdaを活用し、モノリポジトリ構成にしている
• 結果的にKiro CLIで扱いやすい構成になっている
➢IaCツール：SAM、CloudFormation
• ドリフト検知のために、親スタック配下の子スタック全てに対して実行するように作り込む
➢SaaS連携：AppFlow


## p.16

© 2026. For information, contact Deloitte Tohmatsu Group.
15
Kiro CLIの活用
追加開発でKiro CLIを導入しました。実装・UTに関わる工数が40%低減しておりました。
追加開発・運用保守でも確かな生産性向上の効果があります
仕様変更
実装・UT
仕様変更
影響調査
ツール作成
障害調査
テストデータ作成
見積工数と実際の工数
見積工数(人時)
実際の工数(人時)
47%
33%
70%
40%
42%
◼実装に関わる作業工数が低減しているこ
とが確認でき、40%の工数削減効果が
あった
◼特に効果が高かったタスクは以下の四つ
➢単体テストコード作成
➢ツール作成
➢簡易的な現状調査
➢バグ調査
◼特に運用保守業務を自動化するツール
作成は、ツール作成工数低減以上に自
動化による工数削減効果ある


## p.17

© 2026. For information, contact Deloitte Tohmatsu Group.
16
Kiro CLIによるアラートのトリアージ
運用保守ではKiro CLIを活用しております。CloudWatch Alarmを精査するAgent Skillsを作成
し、アラームのトリアージを行なうことで運用効率が向上しております
Alarm
Logs
Kiro CLI
トリアージ
レポート
重要度判断基準
ドキュメント
アラート発生元
アラート発生日時
アラート対象ログ
トリアージ結果
根拠
顧客管理ドメイン
Lambda
2026/06/25
16:00 - 16:05
Error: XXXXXXX
Low
重要度判断基
準のXXに該当
請求管理ドメイン
Lambda
2026/06/25
17:10 - 17:15
Error: YYYYYYY
Low
重要度判断基
準のYYに該当
車両管理ドメイン
Lambda
2026/06/25
19:40 - 19:45
Error: ZZZZZZZZ
Medium
重要度判断基
準のZZに該当
︙
︙
︙
︙
︙
◼アラートやログの調べ方に対して、属人化を排除
◼最終的には人がトリアージ結果を判断することで、誤検知を回避する
◼Agent Skillsで実行するスクリプトもKiro CLIに作成してもらう
日々の運用から重要なエラー・アラートを
ドキュメントとして整理している
アラーム
取得
ログ
取得
トリアージ
根拠取得
レポート
作成
Agent
Skills


## p.18

© 2026. For information, contact Deloitte Tohmatsu Group.
17
複数SaaSのテストデータ作成
AWSに加えて複数のSaaSを利用しており、テストデータ作成が複雑なタスクでした。Kiro CLIと
対話しながらテストデータ作成するコードを作成し、整合性のあるデータを作成しております
Kiro CLI
SaaS A
SaaS B
シニア開発者
対話
テストデータ作成
コード
Amazon DynamoDB
契約ユーザー
支払方法
契約日
契約形態
...
XXXXXX
クレジットカード
2026-06-25
月次
...
︙
︙
︙
︙
︙
テストデータ作成
テストデータ作成
テストデータ作成
◼結合テストを実施する際に、複数のSaaSや
DynamoDBにシステム的に整合したデータを作成する
必要がある
➢全てを熟知しているシニア開発者の負荷が大きい
◼シニア開発者がKiro CLIと対話しながらテストデータ作
成コードを作成
➢手作業で作成した場合、2週間かかる想定だった
が、4時間で完成
➢テストデータ作成負荷が劇的に低下した
◼次は、結合テストの自動化を目指したい


## p.19

© 2026. For information, contact Deloitte Tohmatsu Group.
18
CI/CDパイプラインの自動障害調査
CI/CDパイプラインが失敗した際の調査にもKiro CLIを活用しております。エラーログをKiro CLIが
参照し、原因と解決策を提示してもらう。今後パイプラインに組み込むことを検討しております
Kiro CLI
ソースコード取得
AWS CodeBuild
AWS CodeCommit
AWS CodePipeline
AWS Lambda
Logs
デプロイ
オーケストレーション
CodeBuildでビルドが失敗
ソースコード取得
エラーログ確認
原因と対策を
連絡
開発者
◼CI/CDパイプラインでエラーが発生した
時にKiro CLIでエラー原因を調査し
てもらい、解決策を提示するカスタム
エージェントとAgent Skillsを作成
◼CodeCommitとも連携し、どのコミッ
トで入り込んでいるのかも調査
◼Kiro CLI 2.0で、ヘッドレスモードがリ
リースされたので、今後CI/CDパイプ
ラインに組み込むことを検討


## p.20

© 2026. For information, contact Deloitte Tohmatsu Group.
19
仕様駆動開発の導入
追加開発では仕様駆動開発を導入し、Kiroによる開発工程全体のAI駆動化を進めます
設計書
要件定義書から生成
既存設計書のAIネイティブ化
ソースコード
要件定義書・設計書から生成
既存コードから詳細設計書リバース
要件定義書
マークダウン・HTMLで要件定義書を作成
◼Kiroによる開発工程全体のAI駆動化
◼新しい機能を追加する時は仕様駆動
開発で開発
◼既存機能も適宜AIネイティブ化


## p.21

Member of
Deloitte Touche Tohmatsu Limited
© 2026. For information, contact Deloitte Tohmatsu Group.
デロイトトーマツグループは、日本におけるデロイトアジアパシフィックリミテッドおよびデロイトネットワークのメンバーであるデロイトトーマツ合同会社ならびにそのグループ法人（有限責任監査法人トーマツ、デロイトトーマツリスクア
ドバイザリー合同会社、デロイトトーマツコンサルティング合同会社、デロイトトーマツファイナンシャルアドバイザリー合同会社、デロイトトーマツ税理士法人、DT弁護士法人およびデロイトトーマツグループ合同会社を含む）の総
称です。デロイトトーマツグループは、日本で最大級のプロフェッショナルグループのひとつであり、各法人がそれぞれの適用法令に従い、監査・保証業務、リスクアドバイザリー、コンサルティング、ファイナンシャルアドバイザリー、税
務、法務等を提供しています。また、国内約30都市に約2万人の専門家を擁し、多国籍企業や主要な日本企業をクライアントとしています。詳細はデロイトトーマツグループWebサイト、 www.deloitte.com/jpをご覧ください。
Deloitte（デロイト）とは、デロイトトウシュトーマツリミテッド（“DTTL”）、そのグローバルネットワーク組織を構成するメンバーファームおよびそれらの関係法人（総称して“デロイトネットワーク”）のひとつまたは複数を指します。
DTTL（または“Deloitte Global”）ならびに各メンバーファームおよび関係法人はそれぞれ法的に独立した別個の組織体であり、第三者に関して相互に義務を課しまたは拘束させることはありません。DTTLおよびDTTLの各メン
バーファームならびに関係法人は、自らの作為および不作為についてのみ責任を負い、互いに他のファームまたは関係法人の作為および不作為について責任を負うものではありません。DTTLはクライアントへのサービス提供を行い
ません。詳細は www.deloitte.com/jp/aboutをご覧ください。
デロイトアジアパシフィックリミテッドはDTTLのメンバーファームであり、保証有限責任会社です。デロイトアジアパシフィックリミテッドのメンバーおよびそれらの関係法人は、それぞれ法的に独立した別個の組織体であり、アジアパ
シフィックにおける100を超える都市（オークランド、バンコク、北京、ベンガルール、ハノイ、香港、ジャカルタ、クアラルンプール、マニラ、メルボルン、ムンバイ、ニューデリー、大阪、ソウル、上海、シンガポール、シドニー、台北、東京を
含む）にてサービスを提供しています。
Deloitte（デロイト）は、監査・保証業務、コンサルティング、ファイナンシャルアドバイザリー、リスクアドバイザリー、税務・法務などに関連する最先端のサービスを、Fortune Global 500®の約9割の企業や多数のプライベート（非
公開）企業を含むクライアントに提供しています。デロイトは、資本市場に対する社会的な信頼を高め、クライアントの変革と繁栄を促し、より豊かな経済、公正な社会、持続可能な世界の実現に向けて自ら率先して取り組
むことを通じて、計測可能で継続性のある成果をもたらすプロフェッショナルの集団です。デロイトは、創設以来175年余りの歴史を有し、150を超える国・地域にわたって活動を展開しています。“Making an impact that 
matters”をパーパス（存在理由）として標榜するデロイトの45万人超の人材の活動の詳細については、 www.deloitte.comをご覧ください。
本資料は皆様への情報提供として一般的な情報を掲載するのみであり、デロイトトウシュトーマツリミテッド（“DTTL”）、そのグローバルネットワーク組織を構成するメンバーファームおよびそれらの関係法人が本資料をもって専門
的な助言やサービスを提供するものではありません。皆様の財務または事業に影響を与えるような意思決定または行動をされる前に、適切な専門家にご相談ください。本資料における情報の正確性や完全性に関して、いかな
る表明、保証または確約（明示・黙示を問いません）をするものではありません。またDTTL、そのメンバーファーム、関係法人、社員・職員または代理人のいずれも、本資料に依拠した人に関係して直接または間接に発生した
いかなる損失および損害に対して責任を負いません。DTTLならびに各メンバーファームおよび関係法人はそれぞれ法的に独立した別個の組織体です。
IS/BCMSそれぞれの認証範囲はこちらをご覧ください
http://www.bsigroup.com/clientDirectory


## p.22

本セッションのアンケートへ
ご協力をお願いします
Please give us your feedback
Thank you!
PRT205-S
