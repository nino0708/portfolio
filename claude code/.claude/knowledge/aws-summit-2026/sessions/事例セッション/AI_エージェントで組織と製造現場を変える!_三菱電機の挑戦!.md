---
title: "AI エージェントで組織と製造現場を変える！ 三菱電機の挑戦！"
category: "事例セッション"
session_id: "AIM228"
pages: 27
topics: ["アーキテクチャ/サーバーレス", "生成AI/エージェント", "運用/SRE"]
services: ["AWS DevOps Agent", "AWS Glue", "AWS Lambda", "AgentCore", "Amazon Aurora", "Amazon Bedrock", "Amazon CloudWatch", "Amazon Q", "Amazon S3", "Kiro", "MCP", "Strands Agents"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/事例セッション/AI エージェントで組織と製造現場を変える！ 三菱電機の挑戦！.pdf"
---
# AI エージェントで組織と製造現場を変える！ 三菱電機の挑戦！


## p.1

AIM228
AI エージェントで組織と製造現場を変える！
三菱電機の挑戦！
石原鑑
三菱電機株式会社
リビング・デジタルメディア事業本部
Principal Expert／博士（工学）
小川雄喜
三菱電機株式会社
IoT・ライフソリューション新事業推進センター
テックリード


## p.2

©Mitsubishi Electric Corporation
組織ご紹介


## p.3

©Mitsubishi Electric Corporation
3
スピーカー紹介
石原鑑
いしはら
あきら
【所属＆経歴】
1 9 9 3 ～2 0 0 2
三菱電機
中央研究所（現・先端技術総合研究所）
•
S / W 生産性向上の研究、W e b 版監視制御システム、自治体C A L S 、
卸電力取引所、F A エンジ、B M S ( F a c i m a , E c o - s e r v e r ) など開発
•
海外研究所にも長期滞在しA I エージェントを開発、アジャイルに遭遇
2 0 1 0 ～2 0 1 5
神戸製作所
開発部副課長
•
監視制御プラットフォームのモダナイズ
2 0 1 5 ～2 0 1 8
先端技術総合研究所
映像P F 部部長→戦略部長
•
I o T プラットフォームの先行開発を企画
2 0 1 8 ～2 0 2 1
北米ボストン研究所E V P & C F O
•
A I 、ロボティクス、最適化技術のR & D
2 0 2 1 ～2 0 2 3
情報技術総合研究所
情報技術部門統括
•
クラウド化推進、クラウドリファレンスアーキテクチャ
2 0 2 3 ～2 0 2 6
I o T ・ライフソリューション新事業推進センター
2 0 2 6 . 4 ～
リビング・デジタルメディア事業本部P r i n c i p a l E x p e r t
工学博士
エコーネットコンソーシアム代表理事
認定スクラムマスター、登録プロダクトオーナー、
登録Scrum@Scale Practitioner


## p.4

©Mitsubishi Electric Corporation
4
三菱電機
ライフビジネスエリア
新中期事業戦略
※三菱電機IR Day 2026（ライフビジネスエリア）より抜粋、文言とデザインのみ一部改変
従来の個別事業ごとのコンポーネントを柱としたビジネスから、
快適で安心・安全な環境を創造し、維持・向上し続けるビジネスへと成長
重点施策
戦略ターゲットへの取込み強化・拡大
• データセンターソリューション（IT Cooling 分野）への取組み強化
• ビルソリューション分野の拡大
• AI 活用によるデジタル・ドリブンな保守・運用ソリューションの推進
戦略ターゲットへの取込み強化・拡大
• アプライド空調領域におけるグローバルなバリューチェーンの拡大
• 昇降機事業における保守・リニューアル基盤の強化
• 空調冷熱事業におけるエリア別開発・生産体制の整備
売上高
調整後
営業利益率
ライフ
ビジネスエリア
2.8 兆円
12 %
ビルシステム
事業
0.8 兆円
12 %
空調・
家電事業
2.0 兆円
12 %
30 年度財務目標


## p.5

©Mitsubishi Electric Corporation
5
空調・家電事業の課題：モノうりからコトうりへ
社会システム
エネルギー
システム
空調・家電
セミコンダクター
・デバイス
防衛・宇宙
システム
ビルシステム
FA
システム
デジタル
イノベーション
モビリティ
価値創出を支えるクラウド・AI


## p.6

©Mitsubishi Electric Corporation
外部サービス
連携
6
IoT ソリューションを支えるプラットフォーム
当社製品
プロトコル変換器（オープン化）
IoT アダプター
電力サービス
公共サービス
家庭サービス
ビルサービス
外部サービス
Web サイト
修理
サービス
ECHONET Lite*1機器
（他社機器*2・センサーなど）
機器接続レイヤー
ビジネスロジック
共通Web API
データベース
ライフサイクル
安全・安心＆快適
グリーンエナジー
家電統合アプリMyMU
データマート
データウェアハウス
データレイク
データ分析基盤KOTOLiA
IoT プラットフォームLinova
共創による新サービス創出
*1: ECHONET Lite は、一般社団法人エコーネットコンソーシアムの登録商標
*2: 蓄電池、太陽光発電システムなど
グループ内
IT システム
との連携
顧客インサイト・
ニーズの理解
連携制御・
自動化の実現


## p.7

©Mitsubishi Electric Corporation
組織の強み
を提供
新たな価値
を還元
コア事業領域と戦略事業領域を異なる行動原理・組織マネージメントで運営
組織課題
AI ネイティブ組織に向け、
AICoE(AI Center of Excellence)を設置
プロダクト課題
AI Ready プラットフォームとして、
空調保守AI エージェントを開発
次なる進化：シンの価値創出に向けて
コア事業領域
バリューストリーム
に沿った
既存事業の深化
要件定義・開発販売
における定石がある領域
戦略事業領域
保守・メンテナンス
中心の
ソリューション事業
イノベーション原則に基づく
不確実性の高い領域
AI ネイティブ
組織への進化
組織アジャイル
推進
EAT
EMS
Amazon Quick
SCRUM
@SCALE
Kiro


## p.8

©Mitsubishi Electric Corporation
空調保守の現場課題と
AIエージェントに賭ける理由
～現場ナレッジをエージェント化～


## p.9

©Mitsubishi Electric Corporation
9
スピーカー紹介
小川雄喜
おがわ
ゆうき
• AWS Community Builders 
2025/2026
• Japan All AWS Certifications 
Engineers 2025/2026
• Japan AWS Top Engineers 
2025/2026
【所属＆経歴】
2 0 1 0 ～2 0 1 9
三菱電機
住環境研究開発センター
•
家庭用分電盤での電力情報から高齢者見守りシステムの研究
•
天気予報をもとにした太陽光発電システムとエコキュートを連携による
電力を有効活用する「お天気リンクA I / E Z 」の研究・実証試験
2 0 1 9 ～2 0 2 0
北米空調エンジニアリングセンター
•
ビル用空調の遠隔監視クラウド” K e n z a C l o u d ” 開発
2 0 2 0 ～2 0 2 6
I o T ・ライフソリューション新事業推進センター
プラットフォーム開発グループ
•
I o T 共通プラットフォーム” L i n o v a ” 開発
•
家電統合アプリ” M y M U ” における全館空調アプリ開発
•
A I 空調保守エージェントプロジェクトのアーキテクト担当
2 0 2 6 . 4 ～
I o T ・ライフソリューション新事業推進センター
プラットフォームエンジニアリングプロジェクトグループ
•
C C o E / A I C o E として組織へのクラウド/ A I スキルの浸透
エコキュートは関西電力の登録商標です


## p.10

©Mitsubishi Electric Corporation
10
一般的な空調保守事業の業務分析
お客様から受信
コール
センター
サポート
センター
管理者
フィールド
技術者
技術者派遣検討
出動前準備
現地調査・手配・作業・報告
• コール内容をシステ
ムに入力
• 派遣するエンジニア
を検討
• 注意内容や速報事象
の確認
• 現地調査後に部品手配
• 修理交換作業後、報告書作成
• 受付時の情報入力
に時間がかかる
• 工程見える化不足の
ため、調整に時間が
かかる
• コールから事前判断
は、個人の経験と知
識に依存
• 部品交換方法など、個人の現場経
験と知識に依存
• お客様、社内向けと報告書作成業
務が多い
個人の経験と知識への依存解消や報告書作成負荷の軽減が重要
業
務
の
流
れ
困
り
ご
と


## p.11

©Mitsubishi Electric Corporation
11
現場の経験と知識をベースにしたAI エージェント
• 現場の状況から、過去の関連情報を検索
• 事象に関連した情報を提示し、報告書の作成も支援
Before
After
お客様からのコール
マニュアルなどで
事前調査
現場作業
報告書作成
報告書データベース
お客様からのコール
現場判断の支援
現場作業の支援
報告書自動化
報告書データベース
コール内容から
幅広い関連情報を抽出
関連情報を使って
アドバイスと参照リンク
現場での実施内容から
報告書を支援
時短
時短
時短


## p.12

©Mitsubishi Electric Corporation
12
AI エージェントサービス
AWS アーキテクチャ
Amazon
CloudFront
Amazon
API Gateway
AWS Glue
Amazon
OpenSearch Service
Amazon CloudWatch
Amazon 
Simple Storage Service
（Amazon S3）
ユーザー認証
静的Webサイト
フロントエンド
AWS Lambda
Amazon S3
Amazon S3
AWS DevOps Agent
Amazon Bedrock 
AgentCore
Gateway
Runtime
現場知見
元データ
数十～数百万件の
現場知見のRAG
AWS Lambda
Amazon Aurora
製品情報
AWS Lambda
クレンジング
製品マニュアルのRAG
AWS Lambda
AWS Lambda Amazon Aurora
製品マニュアル
リンク一覧
ログ/メトリクス
/アラート
アラートの
一次調査
Amazon Bedrock
Knowledge Bases
ユーザー
ナレッジ
Amazon
Cognito
Amazon S3
新製品知識のRAG


## p.13

©Mitsubishi Electric Corporation
13
AI エージェントサービス
AWS アーキテクチャ
Amazon
CloudFront
Amazon
API Gateway
AWS Glue
Amazon
OpenSearch Service
Amazon CloudWatch
Amazon 
Simple Storage Service
（Amazon S3）
ユーザー認証
静的Webサイト
フロントエンド
AWS Lambda
Amazon S3
Amazon S3
AWS DevOps Agent
Amazon Bedrock 
AgentCore
Gateway
Runtime
現場知見
元データ
数十～数百万件の
現場知見のRAG
AWS Lambda
Amazon Aurora
製品情報
AWS Lambda
クレンジング
製品マニュアルのRAG
AWS Lambda
AWS Lambda Amazon Aurora
製品マニュアル
リンク一覧
ログ/メトリクス
/アラート
アラートの
一次調査
Amazon Bedrock
Knowledge Bases
ユーザー
ナレッジ
Amazon
Cognito
Amazon S3
新製品知識のRAG
Amazon Bedrock AgentCore により、
業務実行するAI エージェントの土台を簡単に素早く構築
Amazon Bedrock
AgentCore Runtime
Amazon Bedrock
AgentCore Gateway
• エージェントをサーバーレス実行
• Strands Agents で
エージェントを少ない行数で構築
• API、Lambda をMCP 互換ツールに変換
• API やRAG が増えても管理しやすい


## p.14

©Mitsubishi Electric Corporation
14
AI エージェントサービス
AWS アーキテクチャ
Amazon
CloudFront
Amazon
API Gateway
AWS Glue
Amazon
OpenSearch Service
Amazon CloudWatch
Amazon 
Simple Storage Service
（Amazon S3）
ユーザー認証
静的Webサイト
フロントエンド
AWS Lambda
Amazon S3
Amazon S3
AWS DevOps Agent
Amazon Bedrock 
AgentCore
Gateway
Runtime
現場知見
元データ
数十～数百万件の
現場知見のRAG
AWS Lambda
Amazon Aurora
製品情報
AWS Lambda
クレンジング
製品マニュアルのRAG
AWS Lambda
AWS Lambda Amazon Aurora
製品マニュアル
リンク一覧
ログ/メトリクス
/アラート
アラートの
一次調査
Amazon Bedrock
Knowledge Bases
ユーザー
ナレッジ
Amazon
Cognito
Amazon S3
新製品知識のRAG
報告書ナレッジやマニュアルを
ナレッジベース化してシステムに接続
• 知見の文書は
データクレンジング後にRAG 化
• 情報ごとにナレッジベースを分離
• 表示用のマニュアルPDF リンクを保存


## p.15

©Mitsubishi Electric Corporation
15
AI エージェント導入による業務インパクト
PoC評価開始から約2 か月で、試使用ユーザー1,000名突破
Before
After
ベテラン
エンジニア
若手
エンジニア
現場経験が少なく判定に不安
多数のナレッジを共有でき、不安を解消
迷ってもその場で
相談・確認できる相手がいない
その場で確認でき、作業が滞らない
文字入力して報告書を書くので
時間がかかる
報告書が自動作成されるので、
現場で素早く仕上げられる
相談対応で自分の作業が中断される
作業中断が減り、自分の業務に集中できる
最新機種のトレンドは
自分でも時間がかかる
最新機種のトレンドもすぐに検索対象になる


## p.16

©Mitsubishi Electric Corporation
16
AI エージェントの精度改善の課題
各LLM 工程で評価試験を実施
• 各工程ごとに評価指標を定義
人による評価とLLM as a Judge を組み合わせていく
現状
評価の仕組みを段階的に導入
• AWS サービスによる評価
• 専門家によるQA 評価セット
QA評価セット整備の範囲と運用
• QA 評価セットの網羅性とLLM による評価
今後に向けた課題
ハルシネーション抑制の設計
• コンテキスト量調整：
SKILLS、inclusion によるトリガー設定
利用するLLM の進化やRAG データの増大への対応
現場業務への落とし込み
• ユーザーによるフィードバック評価サイクル
オブザーバビリティ・運用
• AWS DevOps Agent による
エラー時自動調査


## p.17

©Mitsubishi Electric Corporation
17
チームとしての進化：Vibe から仕様駆動開発（SDD ）への転換
スピード優先でのMVP 開発
• 短時間で動き、素早い検証
• 再現性低く、個人依存
Step1：Vibe コーディング
Vibe で見えた本質的な問い
• 「動く」だけでなく「保守できる」
• チームでレビュー・引継ぎ
仕様駆動によるチーム変化
• 個人依存からチーム共有へ
• レビュー品質の向上
若手エンジニアが中心で開発経験がほぼない状態からスタート
ルールやツールも整備
• 各ステップで人によるレビュー・承認を実施
• ステアリングで、設計方針や技術選定
Step2：仕様駆動開発（SDD）
仕様へ落とす難しさやレビュー負荷には、今後も対応していく


## p.18

©Mitsubishi Electric Corporation
AICoE 発信の知見を
組織資産に


## p.19

©Mitsubishi Electric Corporation
19
先行知見を組織資産に
先行開発チーム
• 先進サービスに取り組む
• Vibe → SDD への学習
先駆けての実践経験
AICoE
• 先行チームの加速支援
• テンプレートや勉強会で展開
プラットフォーム/ハーネス
組織/全社展開
• ガイドライン・運用
• 共通基盤の継続改善
共通基盤＆個別対応
先行開発チーム⇔ AICoE ⇔ 全社展開のスケール戦略
AICoE がAI 開発ユースケースを展開して、開発を爆速化


## p.20

©Mitsubishi Electric Corporation
4
5
3
2
1
20
AICoE 運営のポイント
トップエンジニア編成
• 複数グループ横断の人材
• 実効性のある事例を共有
組織トップと方針合意
• AI 予算と体制の早期確保
• スピード感のある施策導入
寄り添う勉強会・ハンズオン
• 地域別・レベル別で複数開催
• 置いてきぼりを作らない
人材ローテーション
• 各組織にAI ネイティブ人材を配置
• CoEから組織の新陳代謝
外部コミュニティとの対話
• 他社/自社の比較による視野&視座
• マインドセット醸成、最新技術取入れ
技術起点× トップダウン× 現場密着を同時に成立させる


## p.21

©Mitsubishi Electric Corporation
21
SECI モデル：知識創造スパイラル
スパイラルを回すのがCoE の役割- 組織の知識を継続的に拡張
経験を共有して
暗黙知を伝える
暗黙知を
言語化・図解する
形式知を実践し、
自分の暗黙知に
形式知を組み合わせて
新しい知に
共同化
表出化
内面化
連結化
• ペア開発・現場同行で経験を共有
• Vibe コーディングを共体験
• アーキテクチャのドキュメント化
• ステアリングをチームで作成
• イネイブリングでの組織展開
• 各事業部での実践と習得
• AICoE によるプラットフォーム
• ステアリングなどのハーネス化
暗黙知
形式知
暗
黙
知
形
式
知
対話場
システム場
創発場
実践場


## p.22

©Mitsubishi Electric Corporation
22
AICoE / CCoE としての実績
ワークショップ回数
総参加者数
13 回
373 人
• 初心者、中級などレベル別で開催
• 横浜・京都・静岡と複数拠点で開催
• 管理職はほぼ全員参加済み
• 関連部門の多くからも参加
レベル別・複数拠点でAI・ツールのワークショップを開催
ワークショップ結果
• 参加者の８１.6 %※ が
自分でAI を使えるまで理解
• アイデア壁打ち、レポート作成
など様々なユースケースに期待
• 他利用者の活用事例共有や、
AI-DLCなどへの期待も高い
エンジニアもバックオフィスもAI 活用できる環境を提供していく
※n=98、理解度で5段階中4以上（他人に頼らずに自分でKiroを操作できる状態に達した）の割合


## p.23

©Mitsubishi Electric Corporation
空調からその先へ、
A2A でまるごとソリューションへ


## p.24

©Mitsubishi Electric Corporation
24
空調・家電事業の課題：モノうりからコトうりへ
社会システム
エネルギー
システム
空調・家電
セミコンダクター
・デバイス
防衛・宇宙
システム
ビルシステム
FA
システム
デジタル
イノベーション
モビリティ
価値創出を支えるクラウド・AI


## p.25

©Mitsubishi Electric Corporation
25
空調事業から他事業へ
社会システム
エネルギー
システム
空調・家電
セミコンダクター
・デバイス
防衛・宇宙
システム
ビルシステム
FA
システム
デジタル
イノベーション
モビリティ
デジタル基盤
Serendie


## p.27

本セッションのアンケートへ
ご協力をお願いします
Please give us your feedback
Thank you!
AIM228
