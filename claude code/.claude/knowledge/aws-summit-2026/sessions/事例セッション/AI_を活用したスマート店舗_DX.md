---
title: "AI を活用したスマート店舗 DX"
category: "事例セッション"
session_id: "AIM239"
pages: 29
topics: ["その他"]
services: ["AWS Fargate", "AWS Lambda", "Amazon API Gateway", "Amazon Aurora", "Amazon Bedrock", "Amazon CloudWatch", "Amazon EC2", "Amazon Kinesis", "Amazon S3", "Amazon SQS", "Amazon SageMaker"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/事例セッション/AI を活用したスマート店舗 DX.pdf"
---
# AI を活用したスマート店舗 DX


## p.1

AIM239
AI を活用したスマート店舗DX
野村拓史
株式会社USEN
開発統括部統括部長


## p.2

AWS SUMMIT 2026


## p.3

AWS SUMMIT 2026
AIを活用したスマート店舗DX
飲食店特化型AIが創出する「売上向上」に直接貢献する次世代スマート店舗DX
AI POWERED SMART STORE  DX


## p.4

01
USEN 店舗DX を支えるAWS マイクロサービス基盤
02
AI 時代に店舗DX が向かうべき方向性
03
AI を活用したスマート店舗DX 事例
①エッジAI カメラでのドリンク残量検知
②USEN AI 店長
04
AI 活用の民主化に向けたコスト抑制の3 ステップ
05
最後に〜AWS との共創と今後の期待
Agenda
AWS SUMMIT 2026
AI POWERED SMART STORE  DX


## p.5

01
FOUNDATION  /  OUTLINE
AWS SUMMIT 2026
POSレジ・勤怠
予約・決済
オーダーソリューション
通信・Wi-Fi               
監視カメラ
BGM/BGV 音楽エンタメ
サイネージ
EDGE DEVICE /  STORES SERVICE
全国100 万店舗とつながるUSEN の店舗DX サービス


## p.6

01
FOUNDATION  /  MICRO SERVICE ARCHITECTURE
AWS SUMMIT 2026
EDGE DEVICE /  STORES SERVICE
AWS マイクロサービス基盤でつながりあうUSEN の店舗DX
AWS CLOUD / MICRO SERVICE
クラウドカメラ
サイネージCMS
音楽エンタメ配信
予約システム
ユーザー認証基盤
アクティベーション情報基盤
POS レジ／会計
商品＆オーダー管理
GRS／SGS／UDS
契約情報
IoT デバイス管理基盤
分析／CRM
勤怠管理


## p.7

01
FOUNDATION  /  WHY?  “AWS MICRO SERVICES “
「AWS マイクロサービス」の利点
01
店舗の多様性に迅速に対応
業種・契約サービスが多岐にわたることから、各サービスごと
のアップデート時に独立デプロイが可能。
02
柔軟なスケーラビリティ
03
サービス障害の波及を防げる
決済系の障害がBGM を止めることがあってはならない。マイクロ
サービス化することで、障害リスクを最小限に止める。
04
新サービスの追加時の開発効率性
契約情報連携、認証基盤、デバイス管理基盤をAPI 連携で共通化する
ことで、各新サービス追加開発時の効率化とスピード化を実現。
ビジネス成長に合わせて各サービス機能単位で、柔軟なスケー
リングが可能。事業初期段階での原価抑制が可能となります。
AWS SUMMIT 2026


## p.8

01
Case Study  / Development Challenge Solutions with USEN Camera
参考事例：USEN Camera 開発課題に対するAWS での打ち手
①クラウド録画用ストリーミング・アプリケーション開発には膨大な工数がかかる
→→→
KVS Camera SDK で大幅工数削減
②サーバ負荷を気にせずに大量のカメラをリアルタイムでリモート制御したい
→→→
AWS IoT Core を使うことでクリア
③ライヴ映像を低遅延で視聴したい
→→→
KVS WebRTC シグナリングとWebRTC P2P メディア通信を活用することでクリア
AWS IoT SDK
Amazon 
Elastic Container Service
with AWS Fargate
AWS IoT Core
Amazon Kinesis
Video Streams
USEN Camera Cloud  (Back-End)
Amazon 
API Gateway
USEN Camera 
ベースユニット
店内のLIVE 映像送信
デバイス認証／情報連携
USEN Camera 
ユーザー・ダッシュボード
カメラ・ビューア
KVS Camera SDK
WEB RTC SDK
店内カメラ
P2P 通信
AWS SUMMIT 2026


## p.9

02
WHY AI / DX CHALLENGES
As-is →To-be  AI 時代に店舗DX が向かうべき方向性
As-is これまでの店舗DX
「省人化」に貢献
セルフレジ・モバイルオーダーで人件費圧縮
配膳ロボットで運搬業務を代替
クラウドPOS で点検・締め作業を自動化
コスト最適化には一定貢献したものの…
「ホスピタリティの低下」「機会損失」は？
To-be これからの店舗DX
「売上最大化」に貢献
失われがちなホスピタリティをAI 活用することで補填
現場のクリエイティビティを引き出す経営支援
機会損失を可視化し、即時アクションを誘導
AI 時代の店舗DX のあるべき方向性→
AI 活用による「売上最大化」をテーマに進化
AWS SUMMIT 2026


## p.10

AWS SUMMIT 2026
2026.05
おかわりタイミングを逃さない
エッジAI カメラによるドリンク残量検知
AWS SUMMIT 2026
03
CASE STUDY 01  /  AI CAMERA × ROBOT × POS  
AI POWERED SMART STORE DX
CASE STUDY 1


## p.11

2026.05
▶VIDEO
03
CASE STUDY 01  /  AI CAMERA × ROBOT × POS  
AWS SUMMIT 2026


## p.12

03
CASE STUDY 01  /  AI CAMERA × ROBOT × POS   OUTLINE
AWS SUMMIT 2026


## p.13

03
CASE STUDY 01  /  AI CAMERA × ROBOT × POS   POC RESULT
居酒屋実店舗でのPOC で「売上貢献」を実証
AI センサーカメラによるドリンク残量検知サービスの効果を、実店舗で効果測定
AI センサーカメラが検知するドリンク残量
ドリンク残量検知サービス
導入有無での比較
比較項目
導入無
導入有
1 組あたり
平均注文数（回）
7.0 回
8.2 回
1 組あたり
平均単価（円）
¥ 8,542
¥ 9,174
1 組あたり平均単価
＋約600円
¥ 8,542 → ¥ 9,174
1組あたり平均注文数
＋1.2 回
7.0  →  8.2
※ 実証実験（PoC）概要── 実施店舗：かまどか秋葉原店様／実施期間：2026 年3 月1 日〜3 月31 日
隣接する同タイプの半個室を用い、ドリンク残量検知システムの「導入有／無」で比較測定した結果
AWS SUMMIT 2026


## p.14

03
CASE STUDY 01  /  AI CAMERA × ROBOT × POS
ARCHITECTURE
POSターミナル
MQTT
・POS 管理
・メニュー管理
・デバイス管理
MQTT＆TCP
TCP
AWS CLOUD / MICROSERVICE
EDGE DEVICE /  STORES SERVICE
NPU 搭載エッジデバイスに残量検知に特化した画像分析
が可能なローカルで稼働するSLM AI を搭載
POS レジターミナルを中央司令塔に検知通知を
受信後、各連携サービスに表示反映
・AI モデル学習
・AI SDK 管理
AWS SUMMIT 2026


## p.15

2026.05
03
CASE STUDY 02  /  AI MANAGERs × POS  
AWS SUMMIT 2026
AI POWERED SMART STORE DX
CASE STUDY 2
24 時間頼れる経営パートナー


## p.16

2026.05
03
CASE STUDY 02  /  KEY FEATURES OF THE AI MANAGER
AWS SUMMIT 2026
優秀な店長のノウハウを学習した
飲食店特化型のSLM AI を独自開発
POS レジの定期（日週月）分析レポートと
売上アップに向けたサジェストを自動生成
『USEN AI 店長』の特徴


## p.17

01 チャット機能（店長以上）
売上動向や店舗運営上の疑問や相談を会話形
式で回答。飲食店の基本知識を身に付けたAI
店長が、さらにPOS データ・店舗情報・周辺
情報を掛け合わせて改善提案を助言。
02
03
04
アシスタント機能
厚生労働省ガイドラインなど飲食業の専門知
識を学習。新人スタッフの「わからない」を
即時解消。
05
マニュアル管理機能
店舗独自マニュアル/レジ操作マニュアルを
管理。追加したマニュアルはチャット機能に
も活用。
06
周辺イベント&店舗情報
周辺の地域情報や新店舗情報を表示。日々の
運営判断や販促検討の参考に。
管理者向けに、チャット利用傾向を週次・月
次で分析。現場スタッフの課題やコンディシ
ョンを定量的なデータで把握。
チャット分析機能
チャット機能（スタッフ）
スタッフの日々の業務上の疑問を会話形式で
相談。飲食店の基本知識を身に付けたAI 店
長が、さらに独自の店舗情報・マニュアルを
読み込んで自動回答。
『USEN AI 店長』その他の機能
経営層から現場スタッフまで— 飲食特化型AI が、運営の隅々まで支援
03
CASE STUDY 02  /  AI MANAGERs × POS  
AWS SUMMIT 2026


## p.18

EDGE DEVICE
STORES SERVICE
AWS CLOUD / MICRO SERVICE
03
CASE STUDY 02  /  USEN AI 店長
ARCHITECTURE
AWS SUMMIT 2026
POS レジ・決済
予約・勤怠
分析データマート
EXTERNAL GPU 
AI 店長バックエンド
飲食店特化SLM
総合分析サービス
USEN AI 店長
データ連携
データ連携
システム連携
予約管理
USEN スタッフシフト
勤怠管理
フェーズ1.0 では、コストパフ
ォーマンスの点で優れた外部
GPU を採用。
フェーズ２.0 以降では、さらに
今回開発したSLM を、店内のエ
ッジデバイス上のNPU で実行
させることで、フィジカルなオ
ペレーションへの司令塔機能へ
の進化を予定。
AI 利用の従量課金が不要となり
汎用LLM の1/50 の運用コスト
でAI の利活用が可能
AI 店長コア


## p.19

04
HIGHLIGHT  /  COST EVOLUTION
AI 活用の民主化に向けた
コスト抑制の3ステップ
STEP 1
汎用LLM
から
専用SLMへ
店舗あたり推論コストを
抜本的に圧縮
STEP 2
AWS
×
外部GPU
ハイブリッド設計で
マネージドと低コストを両立
STEP 3 Features
NPU
エッジデバイスでの
ローカル実行
店舗側のエッジデバイスで推論完結
通信なしでも動くフィジカルAI 化
AWS SUMMIT 2026


## p.20

普及における課題
04
STEP 1 /  LLM → SLM
汎用LLM から専用SLM へ
課題：「使うほど高くなる」汎用LLM を使ったサービス設計では、小規模経営の飲食店舗への普及は難しい
汎用LLM (従量課金)
使うほど高くなる>>>>
店舗専用SLM
固定費化
<<<< 大幅コスト削減
店舗DX においてAI 活用サービスの導入コストが高ければ
、現在の飲食店経営のコスト感では普及は難しい。
WHY IT WORKS
飲食店業務は『狭く深い』
求められる回答は飲食業界特化の範囲
ナレッジは「自店のデータ」が中心
汎用知識への依存度は低い
→ パラメータ数を絞っても精度は十分
飲食店業務に特化し軽量化した「SLM」が最適解
AWS SUMMIT 2026


## p.21

SLM の３つの優位性— 研究の裏付け
NVIDIA Research が示す、エージェントAI におけるSLM の3 つの優位性
V1
十分な能力
Capable Enough
SLM は多くのエージェントタスクで十分
な能力を持つ。Phi-2 (2.7B) が30B 級モデ
ルと同等の性能を示すケースも。
汎用性は全て活用しきれない＝Over Spec
V2
運用適合性
Operationally Suitable
低レイテンシー・高スループット・エッ
ジ展開が可能。小規模ゆえ迅速に微調整
でき、要件変更に素早く対応。
実装の柔軟性が高い
V3
経済性
Economical
エージェント利用の大部分で経済的。推
論コストを大幅削減し、一般的なタスク
は数GPU 時間で微調整可能。
推論コストを抜本的に圧縮
出典: NVIDIA Research 「Small Language Models are the Future of Agentic AI」
AWS SUMMIT 2026
04
STEP 1 /  LLM → SLM (ACADEMIC BACKING)


## p.22

クラウドLLM vs ローカルLLM vs SLM
エージェントタスク領域での処理適性の評価◎向く△条件付き× 不向き
観点
クラウドでの汎用LLM
ローカルでの汎用LLM
SLM
推論コスト
×
クラウド依存＋従量課金で高額
△
HW 投資が必要
◎
軽量で低コスト
レイテンシー
遅延大(通信／ユーザー混雑)
△
デバイス性能依存
◎
高速応答が可能
プライバシー
×
他社とデータ混在
△
自社管理可能だが制限有り
スケーラビリティ
△
高スケールだが高コスト
△
拡張性に限界
◎
分散展開が容易
システム堅牢性
◎
自社管理が可能
△
AWS SUMMIT 2026
汎用
飲食店用途では過剰
特化
用途やタスク特化に最適
適用範囲
◎
自社SLA での対障害設計が可能
×
障害リスクがベストエフォート
△
デバイス性能に依存
04
STEP 1 /  LLM → SLM   COMPARISON
汎用
飲食店用途では過剰


## p.23

04
STEP 2 /  HYBRID INFERENCE   ARCHITECTURE
AWS × 外部GPU ハイブリッド構成
EXTERNAL GPU
Small Language Model AI
専用GPU × API でのリアルタイム・チャット推論
専用GPU ×定期バッチによるレポート作成用推論
AWS SUMMIT 2026
AWS SIDE
Managed Services
Amazon S3 / AWS Lambda / 
Amazon Aurora / AWS Fargate etc.
共通認証
システム・ログ監視
システム間連携
AI モデルの継続的なアップデート更新
Amazon SageMaker AI
Amazon Cognito
Amazon API Gateway / AWS Lambda
分析データレイク
AI モデル学習構築
Amazon CloudWatch
ユーザー向けWEB アプリケーション
Amazon API Gateway / Amazon EC2 / Amazon 
RDS / Amazon S3 / Amazon SQS


## p.24

04
STEP 3 /  NPU LOCAL
Feature NPU ローカル実行— 店舗端末がAI ノードへ
将来は、店舗内のPOS ターミナルPC 自体がSLM AI の推論ノードに。より店舗で実用可能なSLA とBCP を兼ね備えた完成形へ。
CLOUD SIDE
モデル構築/ ナレッジ更新/ 本部での総合分析
· 新しい技術を駆使しモデルを定期アップデート構築
· 業界知識・本部マニュアルの更新
· 全店データを集約した経営分析
STORE = EDGE SIDE
チャットでの即時回答/ オペレーション指示
· 店舗内のPOS ターミナルPC 自体でAI 推論を可能に→ 推論コスト無料化
· 通信障害時も店舗内でAI が動作→ BCP
· 推論データが店舗外に出ない→ セキュア
アップデート更新
AWS SUMMIT 2026


## p.25

05
TOGETHER  /  AWS ＆USEN STORE DX
AWSとの共創ポイントのまとめ
飲食店リテール× AI 実装のリファレンス・モデルへ
01 マイクロサービス基盤での店舗DX 展開
店舗業界向けリファレンスアーキテクチャとして、
業種・業態を超えて再利用できる設計を共創。
02
03
エッジ⇄クラウド統合管理基盤
AWS でのPOC 開発環境と、本番用の外部GPU やデバイ
ス側のNPU とを統合管理する運用モデル。コスト・デ
ータ統治・SLA の最適点を探る。
04
IoT デバイス制御
20 万台以上にもなる各種エッジデバイスのリアルタイ
ム遠隔管理（アプリ配信・監視）の基盤として活用。
エッジ推論エンジンの最適化
Feature
進化版AWS IoT Greengrass によるエッジ向け軽量化エ
ンコード。オフライン動作耐性、ハイレスポンス、推
論コストの無料化の実現へ。
AWS SUMMIT 2026


## p.26

05
TOGETHER  /  FUTURE EXPECTATIONS FOR AWS
SLM ×エッジAI 時代に向けたAWS への期待
常時接続を前提としないエッジでのAI 活用を見据えたクラウド
&エッジ協調型アーキテクチャへの発展
ハイブリッド思想への転換
AWS SUMMIT 2026
エッジ対応SLM 管理基盤
AWS IoT Greengrass とAWS IoT Core を中心に、エッジ向けSLM
の配信・更新・運用管理を統合的に実現するサービスの拡充
SLM 推論学習の仕組み化
Amazon Bedrock とAmazon SageMaker を活用し、用途特化型SLM
の生成・育成・運用を自動化するマネージドサービスの提供


## p.27

AWS SUMMIT 2026
2026.05
AWS SUMMIT 2026
AI 活用の民主化に向けて、
AWS の進化がさらに加速し続けることを期待して


## p.28

AWS SUMMIT 2026
2026.05
ご清聴ありがとうございました
Thank You ♪
AWS SUMMIT 2026
AI POWERED SMART STORE  DX


## p.29

本セッションのアンケートへ
ご協力をお願いします
Please give us your feedback
Thank you!
AIM239
