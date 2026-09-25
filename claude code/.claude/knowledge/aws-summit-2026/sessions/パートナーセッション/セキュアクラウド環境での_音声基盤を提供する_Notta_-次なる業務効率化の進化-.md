---
title: "セキュアクラウド環境での 音声基盤を提供する Notta －次なる業務効率化の進化－"
category: "パートナーセッション"
sponsor: "Notta"
session_id: "PRT217"
pages: 27
topics: ["アーキテクチャ/サーバーレス", "セキュリティ", "生成AI/エージェント"]
services: ["AWS Direct Connect", "AWS Lambda", "AWS Step Functions", "AgentCore", "Amazon API Gateway", "Amazon Aurora", "Amazon Bedrock", "Amazon CloudWatch", "Amazon DynamoDB", "Amazon S3", "Amazon VPC", "Claude"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/パートナーセッション/セキュアクラウド環境での 音声基盤を提供する Notta －次なる業務効率化の進化－ (sponsored by Notta).pdf"
---
# セキュアクラウド環境での 音声基盤を提供する Notta －次なる業務効率化の進化－


## p.1

PRT217-S
河野秀彰
Nｏｔｔａ株式会社
フォワード・デプロイド・コンサルタント
セキュアクラウド環境での
音声基盤を提供するNotta
－次なる業務効率化の進化－(sponsored by Notta)
華逸東
Nｏｔｔａ株式会社
フォワード・デプロイド・エンジニア


## p.2

VOICE
×
AI
セキュアクラウド環境での
⾳声基盤を提供する
⸺次なる業務効率化の進化
Notta: Providing a Secure Cloud-Based Voice Platform — 
The Next Evolution in Business Eﬃciency
 河野 秀彰 (Hideaki Kawano) / FDC / Forward Deployed Consultant
 華 逸東 (Yidong Hua) / FDE / Forward Deployed Engineer 
2026年6⽉25⽇ ｜ AWS Summit Japan 2026


## p.3

本⽇のアジェンダ
セキュアな⾳声基盤と、その先のLLM業務⾃動化をご紹介します
01
Notta サービス紹介
3 min
河野
02
エンタープライズが求めるセキュリティ要件
2 min
河野
03
AWS を活⽤したセキュアな⾳声基盤アーキテクチャ
13 min
河野
04
LLM × ⾳声⼊⼒による業務⾃動化の新アプローチ
5 min
華
05
ライブデモ：⾳声起点の業務⾃動化Agent
9 min
華
06
まとめと今後の展望
5 min
河野


## p.4

SECTION
01
 AWS Summit Japan 2026
Nottaサービス紹介
58 ⾔語対応のリアルタイム⽂字起こしと、AI要約で
会議後の業務を⾃動化するプラットフォーム


## p.5

› CURRENT STATE
現状課題 ― 会議後の⼿作業がコストの温床
「会議そのもの」ではなく、会議が終わった後の⾒えない後処理が⼤きなコストに
会議
メモ作成
30分
タスク⼿動登録
15分
レポート⼿動作成
10分
共有メール送信
5分
すべて⼈⼿‧属⼈的に実施 ―― 担当者ごとに品質と所要時間がばらつく
⼯数の流出
会議1本あたり〇〇分の後処理。会議件数に⽐
例して、⾒えないコストが積み上がる。
品質の属⼈化
議事録の粒度‧タスクの抜け漏れが担当者依
存。レビュー⼯数も発⽣する。
⼀次情報が残らない
会話の⽣データ（⼀次情報）が組織に蓄積され
ず、ナレッジが個⼈に滞留する。


## p.6

01 · Notta サービス紹介
58⾔語のリアルタイム⽂字起こしと、AI 要約で
会議後の業務を⾃動化します
リアルタイム⽂字起こし
58⾔語に対応。Web 会議‧対⾯いずれも⾼精度に⽂字起こし。話
者識別にも対応。 
AI 要約‧翻訳の⾃動⽣成
会議終了後、要点‧アクション‧決定事項を⾃動要約。
42⾔語間の翻訳も即時⽣成。 
マルチプラットフォーム対応
 Web / iOS / Android / Chrome 拡張 / API /
 Zoom‧Teams‧Meet‧Webex に Botが⾃動⼊室 
エンタープライズ品質の信頼性
SOC 2 Type II / ISO 27001 / HIPAA取得済み。
 ⼤⼿企業での⼤規模導⼊実績多数。 
Notta — AI⽂字起こし‧要約プラットフォーム


## p.7

01 · Notta サービス紹介
プロダクト導⼊ではなく、業務への実装
Notta — AI⽂字起こし‧要約プラットフォーム
FDEが現場に⼊り、貴社の業務に合わせて作り込みます
現場の⾳声で検証する
導⼊前に貴社の実会議でPoCを実施。専⾨⽤語を辞書登録し、誤認識率を〇〇%
→〇〇%へ低減。
出⼝から逆算して設計する
業務の最終アウトプットを起点に、要約テンプレート‧⾃動化ルールを設計。⼿
戻りを防⽌。
監査に耐える前提で選ぶ
SOC 2 Type II / ISO 27001 / HIPAA を取得済み。セキュリティ要件を初⽇から織
り込む。
設計の順序
出⼝から逆算するから、作り直しが起きない
①
出⼝の定義
CRM‧通知先など、届け先を最初に決める
②
要約テンプレート設計
貴社の議事録帳票に出⼒を固定する
③
収録トリガー設定
収録完了を起点に⾃動処理を起動する


## p.8

SECTION
02
AWS Summit Japan 2026
エンタープライズが求
めるセキュリティ要件
⾳声データ活⽤の加速と、業界固有のコンプライ
アンス要求が「便利さとセキュリティの両⽴」を
必須にしている


## p.9

なぜ⾳声基盤にセキュリティが求められるのか
⾳声データ活⽤の加速と、業界固有のコンプライアンス要求が
「便利さとセキュリティの両⽴」を必須にしている
DRIVERS
⾳声データ活⽤の加速
1
ハイブリッドワークの定着によるWeb会議の常態化
2
議事録‧商談記録のデジタル化ニーズが急拡⼤
3
⾳声データ × AIで意思決定を⾼速化する潮流
COMPLIANCE MATRIX
業界別コンプライアンス要件
⾦融機関
FISC 安全対策基準
官公庁
政府統⼀基準群（ISMAP）
医療機関
HIPAA準拠
⼀般企業
社内情報の外部流出防⽌
課題：「便利さ」と「セキュリティ」の両⽴


## p.10

SECTION
03
AWS Summit Japan 2026
⾳声基盤
アーキテクチャ
東京リージョン完結 · 多層暗号化 · N+1 冗⻑ · 
SLA99% — エンタープライズ基盤を4つのレイヤーで
構築


## p.11

03 · AWS セキュリティ基盤
AWS 上に構築された Notta のセキュアインフラ
東京リージョン完結‧多層暗号化‧N+1 冗⻑で
SLA 99% を実現するエンタープライズ基盤
コンピューティング
 ‧N+1 冗⻑構成 / SLA99%
 ‧AWS東京リージョン
 ‧⽇本国内DCでデータ主権を確保 
データ保管
 ‧⾳声‧録画 → Amazon S3（SSE）
 ‧構造化データ → Amazon Aurora
 ‧鍵管理 → AWS Key Management Service
通信の暗号化
 ‧HTTPS / TLS 暗号化
   +AES-128 ⼆次暗号化
 ‧scram-sha-256 ハッシュ 
バックアップ
 ‧RPO：1 ⽇前時点まで復旧
 ‧保存期間：半年間
 ‧世代管理：35 世代


## p.12

03 · データ⾮保持パイプライン
メモリバッファ処理 — エンジン側にデータは残らない
⾳声認識はメモリ上で処理‧即削除。AI要約も
Amazon Bedrock経由でデータ学習‧保管なし
STEP 01
録⾳
利⽤者操作
STEP 02
SSL送信
暗号化通信
STEP 03
⽂字起こし
メモリ即削除
STEP 04
Amazon S3保存
専⽤領域
STEP 05
AI要約
学習なし
STEP 06
Amazon S3保存
専⽤領域
★ 推奨
AI学習なし
データ完全⾮保持。エンタープライズ環境に最適。
 ⾳声認識精度は Notta全体モデルで担保。 
AI学習あり
 ⼀部データをランダム抽出し、精度向上に活⽤。
 エンタープライズではオフ推奨。


## p.13

03 · AWC VPCと AWS PrivateLink
リファレンスアーキテクチャ: Amazon VPCとAWS PrivateLink による閉域接続パターン
⾳声データとAI処理の通信経路をパブリック経路から分離する、
閉域接続の設計パターン
お客様環境
 ‧オンプレミスサーバー
 ‧社内端末
 ‧AWS Direct Connect / VPN 
Amazon VPC
 ‧Private Subnet
 ‧VPC Endpoint (bedrock-runtime)
 ‧Security Group + NACLs
 ‧AWS Key Management Service 
AWSサービス群
 ‧Amazon Bedrock (Claude)
 ‧Amazon S3
 ‧Amazon Aurora
 ‧AWS PrivateLink(構成例)
 ‧IAM エンドポイントポリシーによる InvokeModel / InvokeModelWithResponseStreamの制御
 ‧アプリ改修なしでAPI呼び出しを閉域化(プライベートDNS)
 ‧Amazon Bedrock AgentCore Runtime / Browser / Code InterpreterもVPC接続対応（東京リージョン）
 ※閉域化の対象はAPI‧⾳声データの通信経路。Web会議Bot等の外部SaaS連携はTLS暗号化+IPアドレス制限により統制


## p.14

03 · SSO / IP 制限 / 監査ログ
多層的なセキュリティ — SSO‧IP 制限‧監査ログ
既存のID基盤と統合し、アクセス制御‧操作追跡‧
権限管理をワンストップで実現
SSO連携
●
SAML SSO対応
●
Entra ID / Okta / OneLoginなど主要IdPと
統合
●
アカウント管理の⼀元化で運⽤負荷を削
減
IPアドレス制限
管理‧監査機能
お客様 IT 基盤（IdP + NW）
Notta（認証‧制御）
AWS（国内 DC）
●
指定グローバルIPのみアクセス許可
●
VPN併⽤でリモート対応
●
Enterpriseプランで最⼤1,000IP登録可
●
操作ログ（ログイン /ノート操作 / DL履
歴）
●
外部共有制御
●
4段階の権限管理
●
利⽤状況レポート


## p.15

⼊⼒から出⼒まで — シームレスなデータ活⽤
会議収録からCRM‧ドキュメント‧通知まで、
既存の業務ツールにワンストップで連携
会議プラットフォーム
Zoom / Teams / Google Meet / Webex
スケジュール連携:
Googleカレンダー / Outlookカレンダー
▶
Notta AI処理
⾃動⽂字起こし → AI要約⽣成 → 翻訳
⾃動化ルール: 収録完了で⾃動トリガー
▼
外部サービス連携
CRM: Salesforce / HubSpot ｜ ドキュメント: Google Docs / Notion ｜ ストレージ: Google Drive ｜ 
通知: Slack ｜ その他: Zapier経由 など


## p.16

SECTION
04
AWS Summit Japan 2026
LLM × ⾳声⼊⼒で
業務を駆動する
セキュアな基盤の上に蓄積された⾳声データを、
LLM で「業務アクション」に変換する


## p.17

04 · ワークフロー再設計
⾳声を起点とした次世代業務⾃動化
セキュアな基盤の上に蓄積された⾳声データを、
LLMで「業務アクション」に変換する
BEFORE
会議
⼿動メモ
タスク⼿動登録
レポート⼿動作成
共有メール送信
AFTER
会議
Notta ⾃動⽂字起こし
LLM が分析‧判断
タスク‧議事録‧通知を⾃動⽣成
実装SLO 会議終了から 3分以内 に
⼀次アウトプット（タスク‧議事録‧通知）を⾃動送付
80%削減
後処理⼯数
テンプレで統制
品質ブレ


## p.18

04 ·AWS Bedrock AgentsとNotta
Amazon Bedrock AgentsとNottaで構築する業務⾃動化基盤
6層構成のサーバーレスアーキテクチャで、
⾳声⼊⼒からタスク実⾏まで完全⾃動化
1
⾳声⼊⼒層
Notta（⽂字起こし＋要約）
2
AI処理層
Amazon Bedrock Agents(Claude) / Amazon Bedrock 
Knowledge Bases (RAG)
3
実⾏層
AWS Lambda（ツール関数）/ AWS Step Functions（ワークフ
ロー）
4
データ層
Amazon S3 ∕ Amazon DynamoDB
5
接続層
Amazon API Gateway / Amazon Simple Queue Service (SQS)
6
監視層
Amazon CloudWatch
› 設計判断のポイント
全層マネージド∕サーバーレス
固定費を最⼩化。ランニングは利⽤量連動で、運⽤⼈員
の常駐が不要。
層を分離する理由
障害の切り分けと、部分的な差し替え（モデル‧ツール）
を容易にする。
Agent設計の肝はツール定義
Action Groups は「1ツール1責務」。粒度設計と⼊出⼒
スキーマが精度を決める。


## p.19

04 · ReAct パターン
Amazon Bedrock Agents — ⾃律的なタスク実⾏の仕組み
ReActパターンによる推論とツール呼び出しで、
会議内容から業務タスクを⾃律的に実⾏
STEP 
01
① ⼊⼒受信
Notta → Agent
② 推論
ReActパターン
③ ツール呼出
Action Groups
STEP 
04
④ 結果統合
応答返却
タスク⽣成ツール
ToDoリスト⾃動作成 / 担当者‧期限を⾃動割り当て
レポート⽣成ツール
議事録サマリー⾃動⽣成 / 決定事項⼀覧
通知ツール
Slack / メール⾃動通知 / 関係者への⾃動共有
カレンダー登録ツール
次回会議⽇程の⾃動提案 / スケジュール⾃動登録


## p.20

SECTION
05
AWS Summit Japan 2026
ライブデモ
模擬会議の⾳声を Notta で⽂字起こしし、Amazon 
Bedrock Agentsが4つのアクションを⾃動実⾏します


## p.21

05 · デモ
ライブデモ — 「会議から業務が⾃動で動き出す」
模擬会議の⾳声を Notta で⽂字起こしし、
Amazon Bedrock Agentsが4つのアクションを⾃動実⾏
1
Notta で模擬会議を⽂字起こし
リアルタイムで⾳声をテキスト化
2
Amazon Bedrock Agentsに⽂字起こし結果を⼊⼒
Agent が会議内容を分析‧推論
3
Agentが4つのアクションを⾃動実⾏
タスク登録 ∕ 議事録⽣成 ∕ Slack 通知 ∕ 次回会議提案
4
実⾏結果をリアルタイムで確認
各ツールの処理状況を画⾯上で可視化


## p.22

LIVE DEMO


## p.23

SECTION
06
AWS Summit Japan 2026
まとめ & 今後の展望
セキュリティ‧スケーラビリティ‧拡張性の三位⼀体
で、実⽤的な業務⾃動化を実現する


## p.24

06 · アーキテクチャの要点
デモで⾒たアーキテクチャのポイント
セキュリティ‧スケーラビリティ‧拡張性の三位⼀体で、
実⽤的な業務⾃動化を実現
セキュリティ
 ‧AWS VPCとAWS PrivateLinkによる閉域処理
 ‧⽇本国内AWSリージョンにデータ保管
 ‧AI学習なし設定でデータ⾮保持を徹底 
スケーラビリティ
 ‧AWS Lambdaによるサーバーレス実⾏で
     ⾃動スケール
 ‧AWS Step Functionsで複雑な WF 管理
 ‧Amazon Simple Queue Serviceで⾮同期処   
理を安定化 
拡張性
 ‧新しいAction Group（ツール）の
     追加が容易
 ‧Bedrock Knowledge Bases拡充で       
Agent 精度を継続向上
 ‧外部SaaSへの横展開 
セキュリティ ・ スケール ・ 拡張


## p.25

06 · 業界別ユースケース
業界別ユースケースと展開可能性
⾦融‧官公庁‧製造‧医療 ⸺
業界固有の要件に対応したセキュア⾳声基盤を展開
⾦融機関
 ‧コンプライアンス対応の会議記録管理
 ‧閉域網内での⾳声データ処理
 ‧監査ログの⾃動保存‧⻑期アーカイブ 
官公庁‧⾃治体
 ‧議会‧審議会の議事録⾃動作成
 ‧ISMAP対応のセキュア環境
 ‧多⾔語対応（外国⼈住⺠サービス） 
製造業
 ‧設計レビュー会議のナレッジベース化
 ‧品質会議からの不具合管理⾃動化
 ‧技術知⾒の組織横断的な蓄積 
医療機関
 ‧HIPAA準拠の医療カンファレンス記録
 ‧患者情報を含む⾳声データのセキュア処理
 ‧診療記録の効率化


## p.26

THANK YOU
ご清聴
ありがとう
ございました
 河野 秀彰 / Hideaki Kawano · FDC
 華 逸東 / Yidong Hua · FDE 
AWS Summit Japan 2026 · 2026.06.25
VISIT US
展⽰ブースで、Nottaを体験。
デモ体験‧個別相談を承ります。お気軽にお⽴ち寄りください。
ブース番号
P064
デモ体験
個別相談承ります
OFFICIAL SITE
公式サイト


## p.27

本セッションのアンケートへ
ご協力をお願いします
Please give us your feedback
Thank you!
PRT217-S
