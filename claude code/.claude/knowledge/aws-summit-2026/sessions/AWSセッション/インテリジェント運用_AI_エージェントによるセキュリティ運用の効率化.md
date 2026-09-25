---
title: "インテリジェント運⽤︓ AI エージェントによるセキュリティ運⽤の効率化"
category: "AWSセッション"
session_id: "SEC351"
pages: 57
topics: ["AI駆動開発", "セキュリティ", "生成AI/エージェント"]
services: ["AWS CDK", "AWS CloudFormation", "AWS CloudTrail", "AWS Config", "AWS DevOps Agent", "AWS IAM", "AWS Lambda", "AWS Organizations", "AWS Security Hub", "AWS Systems Manager", "AWS WAF", "Amazon EC2", "Amazon EventBridge", "Amazon GuardDuty", "Amazon Inspector", "Amazon S3", "Kiro", "MCP"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/AWSセッション/インテリジェント運⽤︓ AI エージェントによるセキュリティ運⽤の効率化.pdf"
---
# インテリジェント運⽤︓ AI エージェントによるセキュリティ運⽤の効率化


## p.1

SEC351
インテリジェント運⽤︓
AI エージェントによるセキュリティ運⽤の効率化
保⾥善太
アマゾンウェブサービスジャパン合同会社


## p.2

Speaker
保⾥ 善太 (ほり ぜんた)
シニアセキュリティソリューションアーキテクト
•
所属
アマゾン ウェブ サービス ジャパン 合同会社 
技術統括本部
•
モットー
差別化されない重労働は全て AI エージェントにやらせよう
•
好きな AWS サービス
Zenta Hori
zenthori@amazon.co.jp
@HoriZenta
AWS Security Agent
AWS Continuum
AWS Lambda
Kiro


## p.3

本セッションについて
対象者
•
SOC/CSIRT の運⽤を効率化したいセキュリティエンジニア
•
セキュリティ運⽤の体制ができていないと悩む開発リーダー・ビジ
ネス担当者
ゴール
1. AI エージェントを活⽤した効率的なセキュリティ運⽤とインシデン
ト対応の⽅法を知る
2. コンテキストとルールを考慮したより厳密な運⽤を理解する
3. 安全に AI エージェントを活⽤する⽅法を知る
4. 今からすぐにできるセキュリティ対策を始める


## p.4

• セキュリティ運⽤の課題と AI エージェントの活⽤
• 基礎編︓セキュリティ運⽤への AI エージェント活⽤例
• 発展編︓コンテキストとルールを定めた運⽤
• AI エージェントを安全に活⽤するために
• 最後に
Agenda


## p.5

セキュリティ運⽤の課題と AI エージェントの活⽤


## p.6

セキュリティ運⽤の課題
どの様に取り組めばよいのか、
全体像がわからない
セキュリティ運⽤ができる
体制の強化が思うように進ま
ない、⼈がいない
莫⼤なログやアラートにどう対処
したらいいかわからない
限られたリソースでも素早く対応し、
ビジネス影響を最⼩限に抑えたい
（ダメージコントロール）


## p.7

セキュリティ運⽤の課題
どの様に取り組めばよいのか、
全体像がわからない
セキュリティ運⽤ができる
体制の強化が思うように進ま
ない、⼈がいない
莫⼤なログやアラートにどう対処
したらいいかわからない
限られたリソースでも素早く対応し、
ビジネス影響を最⼩限に抑えたい
（ダメージコントロール）
→ AI エージェントを活⽤してこれらの課題を改善


## p.8

AI エージェントによる運⽤のモダナイズ
⼿動による運⽤課題
AI エージェントによる解決
AWS コマンドやサービスの知
識が必要不可⽋
コマンド知識不要で⾃然⾔語によ
る指⽰
分散したサービスやリソースを⼀元
的に分析可能
脅威分析と対応に時間を要する
AI 駆動の脅威検出と対応により時
間の短縮化
スキルを必要とする属⼈的な
仕事
セキュリティエンジニアの不⾜
複数のサービスやリソースを⾏
き来する横断的な分析が必要
学習コストを⼤幅に下げ属⼈性
を排除
⼈材不⾜の解消


## p.9

開発のための AI コーディングから
サーバー運⽤まで幅広く利⽤可能な
汎⽤型 AI エージェント
開発・運⽤者向け AI エージェント
⾃律的インシデント対応
運⽤の卓越性を実現する⾃律型 AI 
エージェントサービス
サーバー運⽤の効率化をもたらすAI エージェント


## p.10

開発・運⽤者向け AI エージェント
⾃律的インシデント対応
運⽤の卓越性を実現する⾃律型 AI 
エージェントサービス
開発のためのAI コーディングから
サーバー運⽤まで幅広く利⽤可能な
汎⽤型AI エージェント
サーバー運⽤の効率化をもたらすAI エージェント


## p.11

AWS DevOps Agent の特徴
⾃律的インシデント対応
プロアクティブなインシデン
ト予防
オンデマンド SRE タスク
• AWS、マルチクラウド、オンプレミス環境
のインシデントを解決し、プロアクティブ
に予防
• イベント駆動型のインシデントに特化した⾃
律的エージェント
• 主にサービス障害などの可⽤性に関わる障害
対応に最適
• セキュリティインシデント対応までを網羅的
にカバーしているわけではない
• インシデント発⽣後はテレメトリ、コード、
デプロイデータを相関分析し根本原因を特定
• 修復の実⾏はユーザーが責任を持って⾏う
• 本⽇ご紹介する Kiro によるセキュリティ運
⽤と補完的に活⽤できる


## p.12

開発のための AI コーディングから
サーバー運⽤まで幅広く利⽤可能な
汎⽤型 AI エージェント
開発・運⽤者向け AI エージェント
⾃律的インシデント対応
運⽤の卓越性を実現する⾃律型 AI 
エージェントサービス
本⽇の主役
サーバー運⽤の効率化をもたらすAI エージェント


## p.13

Kiro の利⽤形態
ソフトウェア開発から運⽤全般において IDE と CLI を提供
Kiro IDE
Kiro CLI
Pro ユーザー
Kiro 機能
AI 開発エージェントを搭載した 
IDE アプリケーション
CLI から Kiro に開発指⽰をだせる
コマンドラインアプリケーション
Free ユーザー


## p.14

Kiro による AWS 環境操作の仕組み
Kiro IDE / Kiro CLI
実⾏
AWS Cloud
リモート AWS MCP Server
(AWS Managed Server)
AWS API Services
Kiro 組み込みツール
use_aws / 
execute_bash
ローカル
AWS MCP Server
(プロセス間通信)
AWS Tools
and SDKs
AWS CLI
HTTP + SigV4
ルート１
ルート２
ルート３
クライアント
MCP Proxy for 
AWS


## p.15

• ⽇常的なセキュリティ運⽤からインシデント対応までカバー
• 分析と修正⽅法の提案までにとどまらず⼈によるレビューを
経て対応まで実施させることができる
• 各社のセキュリティガイドラインに則ったカスタマイズされ
たインシデント対応やセキュリティ運⽤が可能
• 全ての AWS リソースを Kiro という単⼀チャネルで⼀元管理
できる
• AWS DevOps Agent をも包含した運⽤が⼀元的に⾏える
Kiro を運⽤に活⽤する利点


## p.16

基礎編︓
セキュリティ運⽤への AI エージェント活⽤例


## p.17

活⽤例1: 定期的なセキュリティチェック
Amazon Inspector
AWS Security Hub
AWS Config
Kiro CLI
AWS 環境の重要なセキュリティ
検知項⽬と対応⽅法を教えて。
セキュリティガイドライン違反も
教えて。
AI エージェントを活⽤して普段か
ら定期的にセキュリティをチェック
Patch 
Manager
AWS Identity and Access 
Management (IAM)
AWS Systems 
Manager


## p.18

活⽤例1: 定期的なセキュリティチェック
Inspector
Security Hub
AWS Config
Kiro CLI
Patch 
Manager
AWS IAM
AI エージェントを活⽤して普段か
ら定期的にセキュリティをチェック
・・・・省略・・・・
即時推奨アクション（優先度順）
1. 🔴即時: ルートアカウントにハードウェアMFAを設定
2. 🔴即時: launch-wizard系SG (sg-070xxxxxxxx等) のSSH 
0.0.0.0/0を削除
3. 🔴即時: sg-f5xxxxxx の全ポート公開ルールを内部CIDR
制限に変更
4. 🟡今週: EBSデフォルト暗号化を有効化
5. 🟡今週: 残り3名のIAMユーザーにMFA設定
6. 🟡今⽉: 未使⽤Security Groupの棚卸し・削除（60件の
レビュー）


## p.19

活⽤例2: AWS WAF ルールの分析・最適化
• WAF ログの分析と誤検知パターンの特定
• ルールの優先順位最適化
• カスタムルールの⾃動⽣成
• レート制限の適切な閾値提案
• Bot 対策ルールの推奨
⼿動対応: WAF 専⾨知識+ ログ分析に数⽇
AI エージェント: ⾃然⾔語で問い合わせ→
数分で最適化提案
AWS WAF
Web ACL / Rules
Amazon 
CloudFront
Amazon 
CloudWatch
Protect
Kiro CLI
分析/提案
Amazon EC2
Web App


## p.20

現状 WAF の設定はどうなって
いますか︖
### 基本情報
- **名前:** vulnerable-resources-waf
- **リージョン:** us-east-1
- **デフォルトアクション:** **Allow** (すべて許可)
- **容量使⽤:** 902 WCU
### ⚠ 重⼤な問題
**すべてのルールがCOUNTモード（監視のみ）で動作していま
す:**
#### ルール1: AWSManagedRulesCommonRuleSet
- **優先度:** 1
- **タイプ:** AWS管理ルール（⼀般的な脅威）
- **アクション:** **Count** ❌（ブロックしない）
- **メトリクス:** 有効
・・・・・・・(省略) ・・・・・・・・
プロンプト⼊⼒
WAF の設定の分析


## p.21

WAF ログから攻撃パターンを
⾒つけて分析してください
WAFログから攻撃パターンを分析します。
### 🚨 検出された攻撃パターン
#### 1. **DoS攻撃（サービス拒否攻撃）**
- **レート制限違反:** 115件検出
- **攻撃期間:** 約10分間継続
- **特徴:** ⾼頻度リクエスト（平均1.54秒間隔）
#### 2. **⾃動化攻撃**
- **User-Agent:** `python-urllib3/1.26.19` (100%)
- **証拠:** Pythonスクリプトによる⾃動化
- **最⼩間隔:** 0.00秒（⼈間では不可能）
・・・・・・・(省略) ・・・・・・・・
### 💡 推奨される対応
**緊急対応:**
1. WAFルールをBLOCKモードに変更
2. 攻撃元IP `98.91.29.100` を即座にブロック
3. レート制限を5-10リクエスト/60秒に強化
・・・・・・・(省略) ・・・・・・・・
プロンプト⼊⼒
WAF の設定の分析


## p.22

活⽤例3: セキュリティインシデントレスポンスの効率化
Amazon 
GuardDuty
AWS Security Hub
検出結果の統合
AWS 
CloudTrail
Amazon 
Detective
Kiro CLI
GuardDuty で IAM 認
証情報の侵害が検知
されました。原因を
調査してください。
AI エージェントによる分析、調査、トリアージ、封じ込め
AWS IAM
インシデント
発⽣
IAM アクセスキーの漏洩


## p.23

NIST インシデント レスポンス プロセス
NIST SP800-61r2 Computer Security Incident Handling Guide
https://csrc.nist.gov/pubs/sp/800/61/r2/final
AWS Security Incident Response テクニカルガイド
https://docs.aws.amazon.com/ja_jp/security-ir/latest/userguide/security-incident-response-guide.html
封じ込め/根絶/復旧
事後対応
• 隔離・証拠保全
• フォレンジック・原因特定
• 原因除去と回復
• 対応のふりかえり・分析
• 組織・プロセス改善
• 追加セキュリティ対策
検知と分析
• 兆候把握
• 分析
• 優先順位付け
準備
• 組織・プロセス整備
• セキュリティ対策の実施
オペレーション


## p.24

セキュリティインシデントレスポンスの効率化 - ⼿動 vs AI
セキュリティインシデント
対応プロセス
⼿動による対応
複数の画⾯の⾏き来や
コマンド実⾏が必要
AI エージェント (Kiro)
による対応
⾃然⾔語で1プロンプト
指⽰するだけで⾃動実⾏
検知と分析
(GuardDuty / Security Hub
IAM / CloudTrail / Detective)
• 各サービスを横断的に⼀つ⼀
つ個別実⾏して地道に調査
• ログを⼿動で突合・分析 
1プロンプトで全サービス横断
分析
封じ込め
(キー無効化+ Denyポリシー)
AWS IAM を使ったGUI/CLI操作
を順次実⾏
1プロンプトで実⾏指⽰
影響範囲の確認
(不正リソースの特定・停⽌)
CloudTrail 検索により不正リ
ソースの特定・停⽌操作など複
数の操作が必要
1プロンプトで実⾏指⽰
根絶/復旧
(キーローテーション)
AWS IAM を使ったGUI/CLI操作
を順次実⾏
1プロンプトで実⾏指⽰
事後対応
(レポート作成)
⼿作業でレポート作成
1プロンプトでレポートの⾃動
⽣成


## p.25

GuardDuty で IAM 認証情報の
侵害が検知されました。どう
やってインシデント対応をし
たらいいですか︖
対策を相談
プロンプト⼊⼒
対応フロー
1. 検知内容の確認
まずGuardDutyのFindingから以下を特定します︓
 aws guardduty list-findings --detector-id $DETECTOR_ID 
--region ap-northeast-1 ¥
   --finding-criteria '{"Criterion":{"severity":{"Gte":4}}}' --
query 'FindingIds' --output json
・・・・・・・・・(省略) ・・・・・・・・・ 
6. 再発防⽌
- git-secrets / gitleaks の導⼊
- IAM Access Analyzer の有効化
- アクセスキーの定期ローテーション（Config Rules）
- GuardDuty → EventBridge → SNS でアラート通知設定
AI エージェント の応答


## p.26

検知と分析
🔍調査結果レポート
GuardDuty Findings（3件検出）:
IAM権限: CompromisedUser にReadOnlyAccess がア
タッチ。アクセスキーAKIAIOSFODNN7EXAMPLE 
(Active)
所⾒: カスタム脅威リストのIP 198.51.100.0 から偵察活
動と不正アクセスが検出されています。封じ込めを推奨
します。
AI エージェント の応答
Finding Type
Severity
Source IP
Recon:IAMUser/Mali
ciousIPCaller.Custo
m
5.0 (Medium)
198.51.100.0
UnauthorizedAccess:
IAMUser/MaliciousIP
Caller.Custom
5.0 (Medium)
198.51.100.0
Discovery:IAMUser/
AnomalousBehavior
2.0 (Low)
198.51.100.0
提案していただいた内容で調
査をお願いします。封じ込め
アクション以降はまだ実⾏し
ないでください。
プロンプト⼊⼒


## p.27

封じ込め
調査結果を確認しました。以下の封じ込め
を実施してください︓
1. CompromisedUser のアクセスキーを全
て無効化（Inactive）してください
2. CompromisedUser に全アクション拒否
のインラインポリシー「DenyAll-
IncidentResponse」を適⽤してくださ
い
3. コンソールパスワードが設定されてい
れば無効化してください
4. 実施した内容を報告してください
• 🔒封じ込め実⾏結果
• ✓アクセスキー無効
化: AKIAIOSFODNN7EXAMPLE → Status: Inactive
• ✓拒否ポリシー適⽤: DenyAll-IncidentResponse
（Effect:Deny, Action:*, Resource:*）
• ✓コンソールパスワード: 設定されていないため
対応不要
• 結果: CompromisedUser は全てのAWS操作が即座
に拒否される状態になりました。攻撃者が窃取し
た認証情報は無効化されています。
AI エージェント の応答
プロンプト⼊⼒


## p.28

CloudTrailのログから、CompromisedUser 
が作成・変更したリソースを全て特定して
ください。特に以下に注⽬してくださ
い︓
- 新規作成されたIAMユーザー/ロール/ア
クセスキー
- 起動されたEC2インスタンス
- 変更されたS3バケットポリシー
- 作成されたLambda関数
攻撃者が残した可能性のあるバックドアが
あれば報告してください。
影響範囲の確認
🔍影響範囲分析結果
CloudTrailでCompromisedUserによる
Create/Run/Put/Attach系イベントを検索しました。
結果: 不正なリソース作成・変更は確認されません
でした。
所⾒: 攻撃者は偵察活動（Describe/List系API）のみ
を実⾏しており、リソースの作成・変更・バックド
アの設置は確認されませんでした。早期の封じ込め
が奏功したと考えられます。
AI エージェント の応答
新規IAMユーザー/ロール/アクセスキー
なし✓
EC2インスタンスの起動
なし✓
S3バケットポリシーの変更
なし✓
Lambda関数の作成
なし✓
セキュリティグループの変更
なし✓
プロンプト⼊⼒


## p.29

安全が確認できたので、復旧作業を実施し
てください︓
1.
CompromisedUser の無効化したアク
セスキーを削除し、新しいアクセス
キーを発⾏してください
2.
封じ込めで適⽤した拒否ポリシー
「DenyAll-IncidentResponse」を解除
してください
3.
GuardDutyが引き続き有効であること
を確認してください
4.
復旧結果を報告してください。
復旧の指⽰
🔄復旧実⾏結果
✓旧アクセスキー削除: AKIAI44QH8DHBEXAMPLE 
を削除
✓新アクセスキー発⾏: AKIAIX3IZLWEXAMPLE01 
(Active)
✓拒否ポリシー解除: DenyAll-IncidentResponse を
削除
✓監視確認: GuardDuty = ENABLED
結果: CompromisedUser は新しいアクセスキー
AKIAIX3IZLWEXAMPLE01 で正常に動作可能な状態
に復旧しました。旧キーは完全に削除されており、
攻撃者による再利⽤はできません。
AI エージェント の応答
プロンプト⼊⼒


## p.30

レポート⽣成の指⽰
ここまでの調査・対処結果を
インシデントレポートとして
まとめ、PDF形式で保存して
ください。
AI エージェント の応答
プロンプト⼊⼒


## p.31

•
必要なセキュリティログを収集し、脆弱性検知、設定監査、変
更記録、セキュリティ脅威検知サービスを有効化する
•
いくら⽣成 AI で効率化しても重要なログの取得がされていな
かったり検知機能が有効になっていなければ意味がない
AI 活⽤の前に Observability の確保が⼤前提
AWS Security 
Hub
Amazon 
Inspector
AWS Config
Amazon GuardDuty
AWS CloudTrail
これらは有効化されていますか︖適切にログは取得できていますか︖
通知は有効化されていますか︖


## p.32

発展編︓コンテキストとルールを定めた運⽤


## p.33

• AI エージェントは確率論的に振る舞うので毎回⽅法論も
出⼒結果もフォーマットも同⼀とは限らない
• 統⼀的な運⽤に限界がある
• 毎回同じようなプロンプトを⼊⼒する必要がある
• セッション終了時にコンテキストが失われるので、毎回
実⾏時に必要な事前情報をプロンプトで⼊⼒し直す必要
がある
• 社内の運⽤ルールやセキュリティガイドラインなどに
則った厳密な運⽤が難しい
AI エージェントのアドホックなチャット運⽤の限界


## p.34

Kiro のコンテキストの永続化/⼿順のルール化
プロジェクト全体を⽀える永続的な仕組み
Agent Steering
プロジェクトの技術スタック・
規約・構造を永続的にAI に伝達
毎回説明し直す必要なし
Agent Skills
指⽰・スクリプト・テンプレー
トのポータブルパッケージ
Anthropic オープン標準
Kiro Powers
ドメイン専⾨知識とMCP 接続を
動的にロード
必要な知識を必要な時に


## p.35

Kiro のコンテキストの永続化/⼿順のルール化
プロジェクト全体を⽀える永続的な仕組み
Agent Steering
プロジェクトの技術スタック・
規約・構造を永続的にAI に伝達
毎回説明し直す必要なし
Agent Skills
指⽰・スクリプト・テンプレー
トのポータブルパッケージ
Anthropic オープン標準
Kiro Powers
ドメイン専⾨知識とMCP 接続を
動的にロード
必要な知識を必要な時に
エージェント⾃体の動作を規制
する共通ルールとガードレール
再利⽤可能なワークフロー定義
ドキュメント+ MCP + Steering 
をバンドルしたパッケージ


## p.36

Kiro のコンテキストの永続化/⼿順のルール化
プロジェクト全体を⽀える永続的な仕組み
Agent Steering
プロジェクトの技術スタック・
規約・構造を永続的にAI に伝達
毎回説明し直す必要なし
Agent Skills
指⽰・スクリプト・テンプレー
トのポータブルパッケージ
Anthropic オープン標準
Kiro Powers
ドメイン専⾨知識とMCP 接続を
動的にロード
必要な知識を必要な時に
エージェント⾃体の動作を規制
する共通ルールとガードレール
再利⽤可能なワークフロー定義
ドキュメント+ MCP + Steering 
をバンドルしたパッケージ


## p.37

ルールに則ったセキュリティチェック
Kiro CLI
セキュリティチェックを
ルール化してより厳格化
Agent Steering (安全ルール事前定義)
脆弱性管理 Skill
設定監査 Skill
Inspector
Security Hub
AWS Config
Patch 
Manager
AWS IAM
Amazon EventBridge
Event
Scheduler
アドホック実⾏
定期実⾏
イベント発
⽣時に実⾏
セキュリティガイドライン 
Skill


## p.38

Kiro CLI
Agent Steering (安全ルール事前定義)
脆弱性管理 Skill
設定監査 Skill
Inspector
Security Hub
AWS Config
Patch 
Manager
AWS IAM
Amazon EventBridge
Event
Scheduler
アドホック実⾏
定期実⾏
イベント発
⽣時に実⾏
セキュリティガイドライン 
Skill
各セキュリティチェック
のワークフローの定義
エージェント⾃体の
動作を制限する
ガードレールを定義
セキュリティチェックを
ルール化してより厳格化
ルールに則ったセキュリティチェック


## p.39

Kiro CLI
Agent Steering (安全ルール事前定義)
脆弱性管理 Skill
設定監査 Skill
Inspector
Security Hub
AWS Config
Patch 
Manager
AWS IAM
Amazon EventBridge
Event
Scheduler
アドホック実⾏
定期実⾏
イベント発
⽣時に実⾏
セキュリティガイドライン 
Skill
これらの定義ファイ
ルも Kiro と対話し
ながら作成可能
セキュリティチェックを
ルール化してより厳格化
ルールに則ったセキュリティチェック


## p.40

Kiro CLI
セキュリティチェックを
ルール化してより厳格化
Agent Steering (安全ルール事前定義)
脆弱性管理 Skill
設定監査 Skill
Inspector
Security Hub
AWS Config
Patch 
Manager
AWS IAM
Amazon EventBridge
Event
Scheduler
アドホック実⾏
定期実⾏
イベント発
⽣時に実⾏
セキュリティガイドライン 
Skill
ルールに則ったセキュリティチェック


## p.41

1.AWS Systems Manager Patch 
Manager 管理インスタンスの
パッチ適⽤状態を確認
2.Amazon Inspector の Findings 
を取得
3.Patch Manager + Inspector の脆
弱性結果を相関分析、重複排除
4.優先度分類
5.重要度の⾼い Findings について
エスカレーション
脆弱性管理 Skill で⼿順のルール化 (例)
## Workflow
### Step 1: マネージドインスタンス⼀覧の取得
```
aws ssm describe-instance-information でマネージドインスタ
ンス⼀覧を取得。
PingStatus が"Online" のもののみを対象とする。
```
### Step 2: パッチコンプライアンス状態の確認
```
aws ssm describe-instance-patch-states で各インスタンスのコ
ンプライアンス状態を取得。
以下を確認:
- InstalledCount: 適⽤済みパッチ数
- MissingCount: 未適⽤パッチ数
- FailedCount: 適⽤失敗パッチ数
-
InstalledPendingRebootCount: 再起動待ちパッチ数
・・・・(省略) ・・・・
サンプル: .kiro/skills/patch-compliance.md


## p.42

Kiro CLI
セキュリティチェックを
ルール化してより厳格化
Steering (安全ルール事前定義)
脆弱性管理 Skill
設定監査 Skill
Inspector
Security Hub
AWS Config
Patch 
Manager
AWS IAM
Amazon EventBridge
Event
Scheduler
アドホック実⾏
定期実⾏
イベント発
⽣時に実⾏
セキュリティガイドライン 
Skill
ルールに則ったセキュリティチェック


## p.43

1.
下記サービスから設定情報について収集
•
AWS Security Hub
•
AWS Config
•
IAM Access Analyzer 
•
Amazon S3 パブリックアクセス
•
危険な Security Group ルール
•
AWS IAM セキュリティ状態を横断
チェック
2.
Severity 別に集計し、前回レポートとの差
分を検出
3. トレンド分析付きの統合レポートを⽣成
4. Critical/High があればアクションプラン付き
でエスカレーション
設定監査 Skill で⼿順のルール化 (例)
## Workflow
### Step 1: Security Hub Findings の確認
```
aws securityhub get-findings で以下の条件のFindingsを取得:
- RecordState: ACTIVE
- WorkflowStatus: NEW またはNOTIFIED
- SeverityLabel: CRITICAL またはHIGH
- 直近7⽇間に更新されたもの
取得後、以下で分類:
- GeneratorId別にグルーピング（どのチェックで検出されたか）
- リソースタイプ別にグルーピング
```
### Step 2: AWS Config ⾮準拠ルールの確認
```
aws configservice describe-compliance-by-config-rule で⾮準拠
ルールを取得。
NON_COMPLIANT のルールについて:
aws configservice get-compliance-details-by-config-rule で対象
リソースを特定。
・・・・(省略) ・・・・
サンプル: .kiro/skills/security-audit.md


## p.44

Kiro CLI
セキュリティチェックを
ルール化してより厳格化
Steering (安全ルール事前定義)
脆弱性管理 Skill
設定監査 Skill
Inspector
Security Hub
AWS Config
Patch 
Manager
AWS IAM
Amazon EventBridge
Event
Scheduler
アドホック実⾏
定期実⾏
イベント発
⽣時に実⾏
セキュリティガイドライン 
Skill
ルールに則ったセキュリティチェック


## p.45

下記３つのセキュリティフレーム
ワークを使⽤した ギャップ分析、
レポート⽣成
1.Well-Architected Security Pillar 
2.CIS Benchmarks（Security Hub
経由で FAILED を取得）
3.NIST CSF 2.0 の6機能にマッピ
ングし成熟度を5段階評価
セキュリティガイドラインチェック Skill (例)
## Workflow
### Step 1: Well-Architected Security Pillar チェック
```
以下のベストプラクティスに対するAWS環境の準拠状況を確認:
SEC01 - セキュアな運⽤:
- AWS Organizations 有効化確認
- CloudTrail 全リージョン有効化確認
- GuardDuty 有効化確認
- Security Hub 有効化+ セキュリティ標準有効化確認
- Config 有効化確認
- アカウントレベルのS3 Public Access Block確認
SEC02 - ID管理:
- IAM Identity Center 利⽤有無
- ルートユーザーMFA設定確認
- ルートアクセスキー無効化確認
- IAMユーザー直接利⽤の有無（Identity Center推奨）
SEC03 - 権限管理:
-
IAM Access Analyzer 有効化確認
・・・・(省略) ・・・・
サンプル: .kiro/skills/framework-compliance.md


## p.46

Kiro CLI
セキュリティチェックを
ルール化してより厳格化
Steering (安全ルール事前定義)
脆弱性管理 Skill
設定監査 Skill
Inspector
Security Hub
AWS Config
Patch 
Manager
AWS IAM
Amazon EventBridge
Event
Scheduler
アドホック実⾏
定期実⾏
イベント発
⽣時に実⾏
セキュリティガイドライン 
Skill
Steering の設定について
は次のパートで話します
ルールに則ったセキュリティチェック


## p.47

AI エージェントを安全に活⽤するために


## p.48

Kiro を安全に活⽤するために
セキュリティを強化するAI エージェントが事故を起こしたら元も⼦もない
AI は提案まで、判断と実⾏は⼈間が責任を持つ
機密情報をエージェント
に渡さない
シークレットは環境変数/ AWS 
Secrets Manager
プロンプトに直接書かない
最⼩権限で動かす
ReadOnly プロファイルで起動。
Write 権限は別セッション・別
承認フローで
AI の出⼒は必ずレビュー
してから適⽤する
allow once を選択し出⼒を
必ずレビュー。
最終判断と実⾏は⼈間が⾏
う (Human in the Loop)
Steering でガードレール
を事前に定義する
禁⽌事項・対象環境・
エスカレーション基準を明⽰
インフラ変更などの破壊
的操作の実⾏は慎重に
denyByDefault: true に設定。
allowedCommands でホワイト
リスト化
調査と対処を分離し
段階的に実⾏する
Read で調査→レビュー→
別プロンプトで対処
•
[参考] https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/


## p.49

インフラ変更などの破壊的操作の実⾏は慎重に
例えば、本番環境の修正や変更などインパクトの⼤きい処理は AI エージェント
に直接実⾏させず、IaC やコードなどの決定論的なロジックを挟んで実⾏する
出⼒形式
• ⼿順書 (Runbook)
• スクリプト
• 実⾏コード
• IaC (Infra as Code)
決定論的⼿法で実⾏
• AWS Systems Manager
• AWS CloudFormation
⼈によるレビュー/承認
AWS 
Systems Manager
Automation
AWS Lambda
AWS 
CloudFormation
AWS 
Cloud 
Development Kit 
(AWS CDK)
Kiro による提案/出⼒
⼈ / Kiro による実⾏
書き込み/変更/削除 などの破壊的操作
(例)
⾃動修復アクション
・EC2 インスタンスの隔離
・IAM クレデンシャル無効化
証拠保全
・スナップショット作成
・ログ収集とアーカイブ


## p.50

Steering でガードレールを事前定義する
---
inclusion: always
---
# AWS Security Operations - Steering Rules
## A. 認証情報・権限
- ReadOnly / 最⼩権限の認証情報をデフォルトで使⽤すること
- Admin認証情報で起動しないこと
- 権限昇格が必要な場合は別セッション・別プロファイルで実施すること
## B. 本番環境の保護
- 本番か不明なリソースは本番と仮定し、最⼤限の注意を払うこと
- 本番リソースの変更・削除は明⽰的なユーザー指⽰なしに実⾏しないこと
- 安全保護機能（Termination Protection, MFA Delete, Versioning, Backup 
Retention等）を無効化しないこと
## C. 操作ルール
- ⾮破壊的操作を優先すること（read/describe/list > modify/update/delete）
- 破壊的操作（Delete, Terminate, Modify）の前に必ず確認を求め、影響を説明
すること
- 調査（Read）と対処（Write）は別プロンプトで分離すること
- パッチ適⽤（ssm:SendCommand）等の実⾏系操作は提案のみ⾏い、実⾏は⼈
間が承認後に別途⾏うこと
- 変更前に必ずdiff を表⽰して確認を求めること
・・・・(省略) ・・・・
サンプル: .kiro/steering/production-safety.md
まずは、設定しなくても実⾏環境の IAM を
最⼩権限にしてスモールスタートで Kiro を
使うことも可能
1.
認証情報・権限
•
ReadOnly/最⼩権限を優先する
•
権限昇格は別セッション・別プロファ
イルで実施
2.
本番環境の保護
•
本番リソースの削除は明⽰的指⽰なし
に実⾏しない
•
本番か不明な場合は本番と仮定する
3.
 操作ルール
•
⾮破壊的操作(Read) を優先
•
破壊的操作前に確認と影響説明を必須
•
変更前に必ず diff を表⽰して確認


## p.51

最後に


## p.52

•
必要なセキュリティログを収集し、脆弱性検知、設定監査、変
更記録、セキュリティ脅威検知サービスを有効化する
•
いくら⽣成 AI で効率化しても重要なログの取得がされていな
かったり検知機能が有効になっていなければ意味がない
[再掲] AI 活⽤の前に Observability の確保が⼤前提
AWS Security 
Hub
Amazon 
Inspector
AWS Config
Amazon GuardDuty
AWS CloudTrail
これらは有効化されていますか︖適切にログは取得できていますか︖
通知は有効化されていますか︖


## p.53

1. まずは必要な検知サービスを有効化、必要なログを収集
する
• CloudTrail, VPC Flow Logs, GuardDuty を有効化
• Security Hub でセキュリティ基準を有効化
• → これがAI 活⽤の前提条件
2. Kiro などのAI エージェントをインストールして試す
• 今⽇お⾒せした事例はすべてKiro で試せます
• → まずはReadOnly 権限で始めてみましょう
今からすぐにできること


## p.54

• AI エージェントを活⽤した効率的なセキュリティ運⽤と
インシデント対応の⽅法について説明
• アドホックなプロンプトによるチャット運⽤では統⼀的運
⽤に限界があるのでコンテキストとルールを考慮したより
厳密な運⽤について説明
• AI はセキュリティエンジニアの代替ではなく補完であり、
⼈間のレビュー・判断は不可⽋
• 次のアクションとして今すぐ始められる対策を実施する 
• 可視化/ログ収集+ Kiro インストール
まとめ


## p.55

Exhibition Booth Information
展⽰ブースのご案内
A106
ブースにてKiro によるセキュリティインシデント
レスポンスのデモを展⽰中︕個別相談も承ります︕
AIがセキュリティ運⽤を変える
AWS Village①


## p.56

Ask the Speaker
こちらのRoom 後⽅の外側にございます、
「Ask the Speaker」カウンターまでお越しください
保⾥善太
アマゾンウェブサービスジャパン合同会社
Room


## p.57

本セッションのアンケートへ
ご協⼒をお願いします
Please give us your feedback
Thank you!
SEC351
