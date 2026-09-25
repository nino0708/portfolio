# AWS Summit セッション資料 ダイジェスト
各セッションの結論部（まとめ/ポイント）を抽出したもの。横断分析用。


---
## [AIM201] 本番展開を見据えて： エージェンティックAI に対する実践的アプローチ
`AWSセッション` / 61p / 生成AI/エージェント
services: AgentCore, Amazon Bedrock, Amazon CloudWatch, Amazon Q, Claude, Kiro, MCP, Strands Agents

<まとめ>
[p.41] 信頼性：重要ポイント
セキュリティは
任意でなく必須
全てのアクションを
実行前にポリシーで検査
既存の認証機能と
統合する
明確な境界を定義する
セッションを分離する

---
## [AIM202] あなたの新しいエージェンティックな チームメイト、Amazon Quick を知ろう
`AWSセッション` / 38p / AI駆動開発 · 生成AI/エージェント
services: Amazon Q, Kiro

<まとめ>
[p.11] Quick と共に過ごす一日
一日の終わり
スケジュール設定したエージェント
が継続的に業務を支援
エージェントがその日1日の案件内容をチェックし、
リスク評価やフラグ立てをして、更新情報を送信
アクティビティフィードでは、その日起きたことを簡潔
にまとめ表示するため、対応忘れ防止
席を外している間にも、
Quick は24時間365日働き
続けます。
✓
✓
✓
✓
✓
[p.31] 保存データの暗号化
SPICE のハードウェアブロック暗号化。
AWS 管理キーまたは顧客の
KMSキーに対応
通信データの暗号化
TLS 1.2 以上を必須とし、
すべてのAPI エンドポイントで
PFS 暗号スイートを使用
VPC＆IP 制限
VPC エンドポイント、
Direct Connect、IP レンジ制御
データレジデンシー
顧客データは最初に保存した
AWSリージョン内にとどまり、
AI処理も同じ地域内で完結
データ保持
削除時には完全に消去され、
データやメタデータは一切残りません
エンタープライズ
クラスのセキュリティ
を標準装備

---
## [AIM216] エージェンティック AI における ビジネスインテリジェンスの再構築と民主化
`AWSセッション` / 83p / 生成AI/エージェント
services: Amazon Q

<まとめ>
[p.4] • AI によりBI がどう変わるのか
• Amazon Quick デモ- 再構築と民主化-
• Amazon 社内展開戦略
• まとめ/ クロージング
Agenda
[p.10] 必要なすべてを一か所に
共有
ナレッジ基盤
カスタム
エージェント
ディープ
リサーチ
データの
可視化
シンプルな
自動化
フルオーケス
トレーション
カスタム
アプリの構築
分散した数十のツールをQuick がまとめる
成果物の
作成
[p.75] 乗り越えた課題
• 高いセキュリティ基準
• 多層検証
セキュリティ
• グローバルのプライバシー規制
• リスク評価とトレーニング
プライバシー
• 役割別のペインポイント
• コミュニティやフィードバックの
収集
スケール
• 大量のツール
• 効果的なデータとユースケースの
選定
データ統合
[p.78] まとめ/ クロージング
[p.79] ビジネスインテリジェンスの再構築
AI の力でBI のインサイトを取得し、それをアク
ションに繋げていく。インタラクティブなやりと
り、自動化を行い、業務を効率化していく
Agentic AI によりビジネスユーザがより簡潔にデー
タ、エージェントを利用でき、各々がそれを作り、
共有する
まとめ
ビジネスインテリジェンスの民主化

---
## [AIM221] AI 駆動開発ライフサイクル (AI-DLC) のご紹介
`AWSセッション` / 45p / AI駆動開発
services: Kiro

<まとめ>
[p.4] 1. AI は開発をどう変⾰しているか
2. AI 駆動開発ライフサイクル(AI-DLC)
3. Lessons Learned
4. まとめ
5. Call for Action
AGENDA
[p.28] プロジェクトのストーリーポイントを従来⼿法で⾒積り、そのプロジェクトを
AI-DLC を⽤いてエンドツーエンドで実装し、改善効果を測定
エンドツーエンドのデリバリー期間を測定
従来のアプローチで⾒積もり
プロジェクト⾒積り︓
タイムライン︓
品質スコア︓
⾒積り期間︓
120 Story Points
12 週間
ベースライン
AI-DLC のアプローチで実装
プロジェクト⾒積り ︓
タイムライン︓
品質スコア︓
120 Story Points
6 週間
＋30% 改善
50% ⾼速化
強化
実際の期間︓
[p.39] まとめ

---
## [AIM222] AI 駆動は上流工程にこそ活きる －非エンジニアにこそ知ってほしい、 AI 駆動開発ライフサイクルによる上流工程の変革
`AWSセッション` / 55p / AI駆動開発 · 生成AI/エージェント
services: AWS CloudFormation, AWS Lambda, Amazon Bedrock, Kiro, MCP

<まとめ>
[p.49] まとめ

---
## [AIM223] AI でコードは書けても、 レビューできる⼈がいなくなる ― ソフトウェア開発における⾃動化のパラドックス
`AWSセッション` / 46p / その他

<まとめ>
[p.35] AI-DLC は「鏡」ー弱点を映し育成の起点にする
「鏡」として効く3 つのポイント
1.
開始フェーズで要件・優先順位を先に確定してから実装
→判断の「先送り」ができず、主体が明⽰される
2.
エグゼクティブ、PdM、デザイナー、開発者など、関係者の協働参加
→「誰が責任を引き受けるか」が全員に⾒える
3.
AI があらゆる⼯程を⽀援
→作業負荷が下がり、⼈間は「判断・議論・育成」に時間を振り向けられる
AI-DLC で弱点を映し、意図的な⾮効率で埋める
映された弱点= 育成設計の⼊⼒
[p.40] まとめ
「AI でコードは書けても、レビューできる⼈がいなくなる」

---
## [AIM311] ⽣成 AI モデルを選ぶ技術 - モデル選択のフレームワーク -
`AWSセッション` / 49p / 生成AI/エージェント
services: AgentCore, Amazon Bedrock, Amazon SageMaker, Claude

<まとめ>
[p.46] まとめ

---
## [AIM313] エージェンティック AI の構築︓ - Strands Agents で始める AI エージェント開発
`AWSセッション` / 102p / 機械学習/MLOps · 生成AI/エージェント
services: AgentCore, Amazon Bedrock, Amazon CloudWatch, Amazon EC2, Amazon ECS, Amazon Q, Amazon Q Developer, Amazon SageMaker, MCP, Strands Agents

<まとめ>
[p.96] まとめ
96
[p.97] 本セッションのまとめ
• Strands Agents は AWS が提供するオープンソースの
エージェントハーネスSDK で数⾏のコードで AI エージェントが構築できる
• 推論制御・ツール接続・状態管理・監視・評価・マルチエージェントなどを
Strands Agents でシンプルに実装可能でビジネスロジックに集中できる
• 数⾏のコードで始められ、本番運⽤まで同じSDKで展開できる
• NTT ドコモ様事例— 100万台規模のネットワーク障害対応を⾃律化
• 短期間で AI エージェントを構築し、商⽤利⽤開始
97

---
## [AIM314] AI エージェント精度改善のポイント - Architecture・Context・Tools の設計方針
`AWSセッション` / 67p / 生成AI/エージェント
services: AgentCore, Amazon Bedrock, Strands Agents

<まとめ>
[p.1] AIM314
AI エージェント精度改善のポイント
- Architecture・Context・Tools の設計方針
長友健人
アマゾンウェブサービスジャパン合同会社
[p.29] Architecture まとめ
• ユースケースを整理した上でアーキテクチャを選定する
• 自律性の高いアーキテクチャと
制御の難しさにはトレードオフがある
• 要件を実現できるシンプルなアーキテクチャを採用する
[p.40] agent = Agent(
conversation_manager=SummarizingConversationManager(
summary_ratio=0.3,         # 古い30% のメッセージは要約対象にする
preserve_recent_messages=10, # 直近10 件は要約せずにそのまま保持
)
)
agent = Agent(
conversation_manager=SlidingWindowConversationManager(
window_size=20,
# 直近20 メッセージを保持
should_truncate_results=True, # ツール結果の長いテキストを切り詰め
),
)
Strands Agents によるコンテキストの圧縮
Sliding Window
Summarization
[p.46] Context まとめ
• Context は多いほど良いわけではない、必要最小限に抑える
Context Rot、Lost in the Middle により性能低下の原因に
• Context を必要最小限に保つために情報を圧縮
• Sliding Window / Summarization (セッション内)
• AgentCore Memory Long-term Memory (セッション横断)
[p.64] Tools まとめ
• Tool 利用のエラーを減らすために
AI Agent の使いやすい簡潔なTool 定義
• Tool 選択のエラーを減らすために
AgentCore Gateway のSemantic Tool Search で
動的に必要なTool だけ取得
• 不必要なリトライを減らすために
AI Agent がリトライしやすいエラー設計
セッションあたりのTool 実行回数に上限を設ける
[p.65] Architecture
ユースケースを整理し、要件を満たすシンプルな
アーキテクチャを選択すること
Context
タスクを解くのに必要最

---
## [AIM328] Physical AI における学習・運用での AWS 活用方法
`AWSセッション` / 61p / 機械学習/MLOps · 生成AI/エージェント
services: AWS Batch, AgentCore, Amazon Bedrock, Amazon CloudWatch, Amazon EC2, Amazon FSx, Amazon S3, Amazon SageMaker, Claude, SageMaker HyperPod

<まとめ>
[p.2] • Physical AI とは
• なぜPhysical AI が注目されているのか
• Physical AI の全体構成
• AWS でのPhysical AI 構成
• まとめ
Agenda
[p.10] • Physical AI とは
• なぜPhysical AI が注目されているのか
• Physical AI の全体構成
• AWS でのPhysical AI 構成
• まとめ
Agenda
[p.13] • Physical AI とは
• なぜPhysical AI が注目されているのか
• Physical AI の全体構成
• AWS でのPhysical AI 構成
• まとめ
Agenda
[p.26] • Physical AI とは
• なぜPhysical AI が注目されているのか
• Physical AI の全体構成
• AWS でのPhysical AI 構成
• まとめ
Agenda
[p.57] • Physical AI とは
• なぜPhysical AI が注目されているのか
• Physical AI の全体構成
• AWS でのPhysical AI 構成
• まとめ
Agenda

---
## [AIM329] 社内 AI エージェント展開の勘所 - AI の能⼒を組織で最⼤限引き出すための課題と打ち⼿
`AWSセッション` / 49p / 生成AI/エージェント
services: AWS Lambda, AgentCore, Amazon Bedrock, Amazon OpenSearch, Amazon Q, Amazon S3, Claude, MCP

<まとめ>
[p.46] まとめ

---
## [AIM342] 本番運⽤を⾒据えた AI エージェント - Amazon Bedrock AgentCore を活⽤したベストプラクティス
`AWSセッション` / 48p / 生成AI/エージェント
services: AgentCore, Amazon Bedrock, Amazon CloudWatch, MCP

<冒頭>
[p.2] 安藤 慎太郎 / Shintaro Ando
アマゾン ウェブ サービス ジャパン合同会社
ソリューションアーキテクト
好きな AWS サービス
Amazon Bedrock AgentCore
デジタル領域のエンタープライズのお客様を
中⼼にクラウドの技術⽀援を担当
[p.3] 主な対象者
• AI エージェントを構築したい / 構築している開発者
このセッションで紹介すること
ü ビジネス価値のある AI エージェントを開発し、
継続的に本番運⽤する上で指針となる基本的な 9 つのベストプラクティス
このセッションで紹介しないこと
✗AI エージェントの基本的な仕組みや LLM について
✗Amazon Bedrock AgentCore の各機能や、
エージェントフレームワークを⽤いた AI エージェント実装の詳細
本セッションの内容
[p.4] 課題から逆算して
⼩さく始める
1
ツールとAPI 連携
を計画する
2
オブザーバビリティを
初⽇から設定する
3
エージェントの
評価を⾃動化する
4
基盤を作る
⾼品質に磨く
継続運⽤する
5 マルチエージェント
を検討する
パーソナルエージェント
をセキュアに構築する
6
できるだけ
コードを使⽤する
7
8 何度も繰り返し
テストする
9 組織体制を整え
規模を拡⼤させる
本⽇紹介する 9 つのルール
?
?
?
?
?
?
?
?
?
?
[p.5] プロトタイプから本番環境に進む際の課題
PoC
本番稼働する
AI エージェント
⾼まる期待
本番環境に進む際の課題
ビジネス価値
パフォーマンス
スケーラビリティ
ガバナンス
セキュリティ

---
## [AIM343] 生成 AI で「売れる製品」を作る — POC 止まりを突破する 6 つのプロダクトデザイン戦略
`AWSセッション` / 41p / アーキテクチャ/サーバーレス · 機械学習/MLOps · 生成AI/エージェント
services: Amazon Bedrock, Amazon SageMaker, MCP

<冒頭>
[p.2] 自己紹介
久保田弾（Hazumi Kubota）
所属
パートナー技術統括本部
テクノロジーソリューション本部
AI/ML パートナーソリューションアーキテクト
好きなテクノロジー
Amazon Bedrock
Amazon SageMaker
[p.3] セッションの想定聴講者と内容
想定聴講者
• 生成AI がビジネスにつながっていないと課題を感じている
• ビジネスにつながった生成AI 事例を知りたい
お話しすること
• ビジネスに繋げることができた生成AI 事例
• ビジネスにつながるプロダクトデザインのベストプラクティス
お話しないこと
• 生成AI ソリューションを実現するためのアーキテクチャ
• AWS の生成AI サービスの詳細
[p.4] 生成AI への大規模な投資が行われている
がAI スタートアップに
投資家から2025年現在まで
注ぎ込まれている
は今後5年間の世界全体の
生成AI ソフトウェア支出の
予想増加率
2029年には約18兆円に成長
生成AI のプロダクト開発
向けに
出典：Bloomberg、2025年10月
* 1ドル= 157円
出典：IDC、2025年9月
* 1ドル= 157円
出典：Forrester、2025年
[p.5] 目先の流行に
振り回されて
いないか？
今後12ヶ月における生成AI プロダクトの
開発・ローンチに関する優先事項
ブランド認知度の向上
収益の成長
コスト削減
優れたカスタマーサポート
ユーザーエクスペリエンスの向上
39%
38%
34%
24%
23%
調査対象：自社のAI戦略に責任または影響力を持つ657名のISV経営幹部と意思決定者
出典：AWSの委託によりForrester Consultingが実施した調査、2024年10月

---
## [AIM344] Amazon Bedrock AgentCore による 堅牢な SaaS データエージェントの設計
`AWSセッション` / 56p / 生成AI/エージェント
services: AWS Lambda, AgentCore, Amazon API Gateway, Amazon Bedrock, Amazon RDS, Amazon S3, MCP, Strands Agents

<まとめ>
[p.19] 防御すべきポイント
OWASP Top 10 for Agentic Applications とエージェントの動作フローの対応
ユーザー
SQL 構築・実⾏
ツール
DWH
ツールの
呼び出し
(Act)
LLM
(Perceive/
Reason)
次のターン
Unexpected Code Execution
(ASI05)
Agent Goal Hijack
(ASI01)
Tool Misuse (ASI02)
Identity & Privilege Abuse (ASI03)
Identity & Privilege Abuse (ASI03)
Memory & Context Poisoning
(ASI06)
[p.52] まとめ
[p.53] まとめ
• データエージェントは分析体験を⼤きく変える⼀⽅、従来のBI とは
異なる設計課題を持つ
• マルチテナントSaaS 環境では、エージェントの柔軟性とテナント
分離・権限制御を両⽴する必要がある
• 堅牢性はLLM 層・呼び出し層・ツール層・リソース層の各層で設計
する
• LLM は⾃然な対話と推論を担い、最終的な制御は決定的な仕組みに
委ねる

---
## [AIM345] AI エージェント時代における責任ある AI（Responsible AI）の ベストプラクティスと実践例
`AWSセッション` / 61p / セキュリティ · 機械学習/MLOps · 生成AI/エージェント
services: AgentCore, Amazon Bedrock, Amazon CloudWatch, Kiro

<まとめ>
[p.4] 1. 責任あるAI が求められる背景
2. 責任あるAI とは？
3. 責任あるAI をどのように実現するか
3-1. ベストプラクティスと方法論
3-2. AWS サービスでの実装例
4. 責任あるAI のお客様事例
5. まとめ& 今日から取り組めること
アジェンダ
4
[p.54] 5．まとめ& 今日から取り組めること
54
[p.58] AWS Skill Builder で
「責任あるAI」を学ぶ
Responsible AI Lens で
自社のAI 環境を評価する
Kiro で「責任あるAI」を
仕様に組み込んで開発する
58
今日から試せる「次の一歩」
https://skillbuilder.aws/learn
https://docs.aws.amazon.com/wellarchitected/lat
est/responsible-ai-lens/responsible-ai-lens.html
https://kiro.dev/
生成AI 相談窓口またはAWS 担当者宛に、お気軽にご相談ください！

---
## [AIM360] "AI エージェントの推論から⼤規模学習まで" コスト効率と性能が両⽴する AI インフラ ̶ AWS Trainium の全貌
`AWSセッション` / 47p / 機械学習/MLOps · 生成AI/エージェント · 運用/SRE
services: Amazon EC2, Claude, Inferentia, Kiro, Trainium

<冒頭>
[p.2] 澤亮太
アマゾンウェブサービスジャパン合同会社
技術統括本部
エンタープライズ技術本部
⾃動⾞・製造グループ
⻄⽇本ソリューション部
ソリューションアーキテクト
・主に製造業のお客様を担当
・前職では、主に Computer Vision 領域での
Deep Learning を⽤いたアルゴリズム開発、
AI⼈材の育成などを推進
⾃⼰紹介
[p.3] 調達リードタイム
学習・推論コスト
運⽤負荷
申し込みから数ヶ⽉待ち
クラウドでも簡単に
GPU を確保できない⽇が続く
学習1 回で数百万円
API 課⾦も積み上がる
インフラの運⽤監視
ハードウェアの
メンテナンスや⽼朽化
計算機リソースに満⾜できていますか︖
⽣成AI の学習・推論コスト、GPU の確保などに
頭を悩ませた経験はありませんか︖
[p.4] LLM 開発・学習
AI エージェント実装
Physical AI の学習
⼤規模⾔語モデルの事前学習
ドメイン特化ファインチューニング
RLHF / DPO による強化学習
マルチモーダルモデル学習
AI エージェントによる推論回数の増加
RAG・マルチステップ推論の普及
レイテンシー・コスト最適化ニーズ
vLLM 等のOSS フレームワーク活⽤
ロボット・VLA モデルの学習
⼤量のデモデータから⾏動を学習
最近特に注⽬のユースケース
GPU が必要なワークロードは増え続けている
[p.5] ① データ収集
シミュレーション
② モデルの学習
③ 推論・配信
実機デモ収集
Isaac Sim / Lab
シミュレーション環境
GPU (G7e 等) が必要
VLA モデルの事前学習
LoRA / フルファインチューニング
強化学習(RLHF)
エッジ(Jetson) での推論
クラウド推論(LLM ⽤途)
AWS IoT Greengrass
GPU (G 系) が主流
例えば Physical AI 開発の
学習フェーズに注⽬すると

---
## [AIM412] Amazon Bedrock AgentCore を活用した エンタープライズ Agentic RAG の実装解説
`AWSセッション` / 100p / 生成AI/エージェント
services: AgentCore, Amazon Bedrock, Amazon S3, Amazon SageMaker, Strands Agents

<まとめ>
[p.8] 本セッションについて
アジェンダ
1. Agentic RAG とは
2. 本セッションで構築するAgentic RAG システムの概要紹介
3. 実装の詳細解説
4. まとめ
本セッションの聴講対象者
•
社内でRAG システムを導入したが、性能が出ずに困っているエンジニア
•
認証認可を含むセキュアなエージェント運用に課題をお持ちのエンジニア
[p.89] まとめ
[p.98] 本セッションのまとめ
1
Context Engineering を用いたRAG の再定義
ドキュメント検索+ ツールキュレーション+ メモリを統合し、
エージェントに最適なコンテキストを提供
2
短期メモリ+ 長期メモリでコンテキストを圧縮
AgentCore memory が会話から重要情報を抽出・統合し、
コスト削減・レイテンシー改善・精度向上を同時に実現
3
数行のコードでAgentic RAG を構築
Strands Agents + Tools / Hooks で、Knowledge Bases とメモリを統合した
エージェントを迅速に実装
4
AgentCore runtime + identity で本番環境へ
セッション分離されたmicroVM 、自動スケーリング、JWT 認証認可で
エンタープライズ対応のデプロイ基盤を提供

---
## [AIM461] SageMaker HyperPod で GPU 投資を成果に変える ― 基盤モデルの学習・推論を支える ML Performance Engineering 入門
`AWSセッション` / 92p / 機械学習/MLOps
services: Amazon Bedrock, Amazon CloudWatch, Amazon EC2, Amazon EKS, Amazon FSx, Amazon Q, Amazon Q Developer, Amazon S3, Amazon SageMaker, SageMaker HyperPod

<まとめ>
[p.30] クラスターが大きいほど、トレーニング障害
や復旧中のアイドル時間が長時間化する
Step 1
Step 2
Checkpoint
Step 3
Recovery
Process
Step 3
Step
4
ステップ4 完了前に障害発生
最後に保存した
チェックポイントへロールバック
トレーニングステップ3 をやり直し
チェックポイント
処理による損失時間
復旧とロールバックによる損失時間
学習再開
Time

---
## [ANT209] データウェアハウスのモダナイズ - 事例とデモで学ぶ Amazon Redshift マルチウェアハウスアーキテクチャ
`AWSセッション` / 57p / アーキテクチャ/サーバーレス · データ分析/基盤 · マイグレーション/モダナイゼーション · 機械学習/MLOps
services: AWS Glue, AWS IAM, AWS Lambda, Amazon Bedrock, Amazon Q, Amazon RDS, Amazon Redshift, Amazon S3, Amazon SageMaker, MCP

<まとめ>
[p.7] ハブアンドスポーク
•
ワークロードの完全な分離
•
ワークロード間の干渉なし
•
数分で新しいエンドポイント
を起動し、新しいワークロー
ドをオンボード
マルチ
ウェアハウス
アーキテクチャ
ストリーム
取り込み
バッチ
取り込み
データ
サイエンス
探索的分析
レポート/
ダッシュボード
Redshift Managed
Storage (RMS)
BI ツール
データAPI
データサイエンス
アプリケーション
ストリーム
バッチソース
[p.31] さらなるモダナイゼーションの動機
書き込み用の
単一エンドポイント
競合
集中型
データオーナーシップ
ガバナンスの
ボトルネック
クロスドメインの
相互依存
アジリティの低下
[p.54] まとめ

---
## [ANT301] エージェンティック AI のための データ活⽤実践ガイド
`AWSセッション` / 50p / アーキテクチャ/サーバーレス · データ分析/基盤 · 生成AI/エージェント
services: AWS Glue, AgentCore, Amazon Athena, Amazon Bedrock, Amazon S3, Amazon SageMaker, MCP, Strands Agents, Valkey

<冒頭>
[p.2] ⾃⼰紹介
⼤薗 純平
アマゾンウェブサービスジャパン合同会社
シニアアナリティクスソリューションアーキテクト
2
AWS のData & AI 関連サービスを活⽤した
アーキテクティング/ソリューション提案⽀援や、
AWS サービスの開発チームとのコラボレーション
ワークを⾏っている。2017 年より現職
2
[p.3] 想定参加者
• エージェンティックAI アプリケーションに対応するデータ基盤を
検討中のアーキテクトおよびビジネス意思決定者の⽅
お話すること
• 全体像とアーキテクチャの考え⽅およびAWS サービス間の繋がり⽅
お話しないこと
• 個別ユースケースの詳細や各AWS サービスの深堀り
本⽇のセッション
3
[p.4] エージェンティック AI の基礎
従来型アプリケーションからエージェンティックアプリケーションへ
エージェンティックAI のデータガバナンス
エージェンティックAI の統⼀アーキテクチャ
アジェンダ
4
[p.5] エージェンティック AI の基礎
5

---
## [ANT308] Amazon S3 の非構造化データを Amazon SageMaker Catalog で AI-ready な資産に変換する
`AWSセッション` / 40p / データ分析/基盤 · 機械学習/MLOps
services: AWS Glue, AgentCore, Amazon Bedrock, Amazon OpenSearch, Amazon Q, Amazon Redshift, Amazon S3, Amazon SageMaker

<冒頭>
[p.2] 濱岡洋太
WWSO Big Data Specialist Solutions Architect
経歴
• APJ のお客様向けに分散データ処理・
データ基盤構築の技術支援（2021〜現在）
• 前職は日系SIer にてデータ基盤構築・
基幹システムの保守・更改（2018〜2021）
好きなAWS サービス
• Amazon EMR, AWS Glue, Amazon Redshift
自己紹介
yotahamaoka
yotahk
[p.3] 想定聴講者
• 非構造化データの分析・AI を活用したデータ基盤の構築に興味がある方
• 基本的なAWS サービスやデータレイクの概念について知っている
本日のゴール
• AWS 上で非構造化データを保管・活用する手段について知る
• AI にデータを与える上で必要な前提事項について知る
本セッションについて
[p.4] • AI-ready なデータ基盤の必要性
• データのモーダリティと課題
• 非構造化データにおけるガバナンスと分析手法
• Bayer 社の製薬データ分析基盤事例
アジェンダ
[p.5] AI-ready なデータ基盤の必要性

---
## [ANT310] AWS Analytics MCP サーバーで実現する エージェント型データエンジニアリング
`AWSセッション` / 55p / データ分析/基盤 · 生成AI/エージェント
services: AWS Glue, AgentCore, Amazon Athena, Amazon Bedrock, Amazon EC2, Amazon OpenSearch, Amazon Q, Amazon Redshift, Amazon S3, Amazon SageMaker

<まとめ>
[p.51] まとめ

---
## [ANT355] Apache Iceberg on AWS 実践ガイド -設計・取り込み・活用のベストプラクティス
`AWSセッション` / 37p / データ分析/基盤 · 機械学習/MLOps
services: AWS CDK, AWS Glue, Amazon Athena, Amazon Aurora, Amazon Bedrock, Amazon Q, Amazon RDS, Amazon Redshift, Amazon S3, Amazon SageMaker

<まとめ>
[p.3] • データ基盤の現状・動向
– レイクハウスにおけるApache Iceberg
• AWS のアナリティクススタック
– 各レイヤーで活用できるサービス
• 実装パターン
– バッチ ETL / ストリーミング
• まとめ
Agenda

---
## [ANT407] エージェントで検索は進化する - Amazon OpenSearch Service のエージェント機能徹底解説 -
`AWSセッション` / 69p / その他
services: Amazon Aurora, Amazon OpenSearch, Kiro, MCP

<まとめ>
[p.66] Key Takeaways
01 エージェントを検索エンジンに組みこむことで
複雑な検索に対応できるようになる
02 Agentic query においては検索エンジンと
エージェントそれぞれのチューニングが重要
03 OpenSearch はエージェントによる
検索から精度改善まで一貫してサポート

---
## [ARC339] 大規模障害から考える、 AWS 上で備えるべきレジリエンスの実践
`AWSセッション` / 62p / 運用/SRE
services: AWS Lambda, Amazon Aurora, Amazon CloudWatch, Amazon EC2, Amazon ECS, Amazon EKS, Amazon Route 53

<まとめ>
[p.22] リージョンの分離
STS のグローバルエンドポイントのみ存在（〜2015 年）
[p.23] リージョンの分離
STS リージョナルエンドポイントリリース
利用推奨するも、移行は進まず( 2015 年〜2024 年)
[p.24] リージョンの分離
STS グローバルエンドポイントのレプリカを全リージョンへリリース
お客様側の対応なしで同一リージョン内で完結できるように( 2025 年)
[p.59] まとめ

---
## [ARC446] アーキテクチャ道場 2026 - AI 時代編！
`AWSセッション` / 115p / アーキテクチャ/サーバーレス · マイグレーション/モダナイゼーション
services: AWS CDK, AWS Fargate, AWS Lambda, AgentCore, Amazon Bedrock, Amazon Nova, Amazon S3, Claude, Kiro, Valkey

<まとめ>
[p.76] 振る舞いによる不具合の例
仕様
決済するほどポイント還元率が増える。
1,000 円までは1%、超えた分は5%。
例
決済A
500 円の支払い。
1% 還元（5p）
決済B
500 円の支払い。
1% 還元（5p）
決済C
200 円の支払い。
5% 還元（10p）
ポイント残高
20p
(5p + 5p + 10p)
[p.77] 振る舞いによる不具合の例
仕様
決済するほどポイント還元率が増える。
1,000 円までは1%、超えた分は5%。
例
決済A
500 円の支払い。
1% 還元（5p）
決済B
500 円の支払い。
1% 還元（5p）
決済C
200 円の支払い。
5% 還元（10p）
キャンセル
キャンセル分を
減算する実装に
なっている
ポイント残高
20p →15p
(5p + 5p + 10p)
[p.78] 振る舞いによる不具合の例
仕様
決済するほどポイント還元率が増える。
1,000 円までは1%、超えた分は5%。
例
決済A
500 円の支払い。
1% 還元（5p）
決済B
500 円の支払い。
1% 還元（5p）
キャンセル
決済C
200 円の支払い。
5% 還元（10p）
→1% 還元（2p）
複雑なシステムでは無数のパターンがあり
テストケースを洗い出しきれないことも多い。
正しくは補正が必要
ポイント残高
20p →7p
(5p + 5p + 2p)
[p.79] ポイント還元の参照モデル
（TypeScript による実装イメージ）
期待する振る舞いをシンプルに表現した参照モデルを作成する
※ Amazon S3 のストレージノード検証で用いられる軽量形式手法を参考にしている（Bornholt et al., SOSP '21）
https://cdn.amazon.science/77/5e/4a7c238f4ce890efdc325df83263/using-lightweight-formal-methods-to-validate-a-
key-value-storage-node-in-amazon-s3-2.pdf
[p.80] 全体額からポイントを都度計算する
（シンプルなロジックで表現）
期待する振る舞いをシンプルに表現した参照モデルを作成する
ポイント還元の参照モデル
（TypeScript による実装イメージ）
※ Amazon S3 のストレージノード検証で用いられる軽量形式手法を参考にしている（Bornholt et al., SOSP '21）
https://cdn.amazon

---
## [BIZ201] AI ネイティブで実現する、妥協なき顧客体験 — Amazon Connect Customer
`AWSセッション` / 37p / その他
services: Amazon Connect

<まとめ>
[p.6] あらゆるタッチポイントで
質の高い顧客体験を提供する、
エージェンティックAI ソリューション
Amazon Connect Customer
[p.32] まとめ

---
## [BIZ233] パーソナライズでビジネス成⻑を実現する コンタクトセンターへ ― AI エージェントが顧客を知り、先回りする―
`AWSセッション` / 60p / 生成AI/エージェント
services: AgentCore, Amazon Bedrock, Amazon Connect, Amazon Nova, Claude, MCP

<まとめ>
[p.58] まとめ
•
Amazon Connect Customer は
AI が最初から組み込まれた
オールインワンサービス。
•
AI と⼈間はチーム。
AI が顧客を理解して先回りして動く。
切り替えと引き継ぎは柔軟に設計可能。
•
今すぐ始められる。専⾨知識は不要。

---
## [BIZ326] Amazon Connect Customer で 実現する進化したコンタクトセンター －エージェンティック AI が変える顧客体験－
`AWSセッション` / 85p / 生成AI/エージェント
services: Amazon Connect, MCP

<まとめ>
[p.4] • カスタマーエクスペリエンスの重要性
• AI 時代のカスタマーエクスペリエンスを再構築
• Amazon Connect Customer の
主要なイノベーション
• まとめ
アジェンダ

---
## [CDN320] Advanced VPC Networking －知っておきたい AWS ネットワークの最新動向 ： VPC 関連サービスのアップデートを総整理－
`AWSセッション` / 105p / その他
services: AWS Direct Connect, AWS IAM, AWS Lambda, AWS Transit Gateway, Amazon CloudFront, Amazon DynamoDB, Amazon Route 53, Amazon S3, Amazon VPC

<まとめ>
[p.12] AWS Network Firewall
複数 VPC エンドポイント
NFW エンドポイント
NFW エンドポイント
NFW エンドポイント
12 / 104
[p.13] サブネット
プライベート
インターネットゲートウェイ (IGW)
Amazon VPC
アベイラビリティーゾーン1
NFW サブネット AZ1
NFW エンドポイント
サブネット
プライベート
アベイラビリティーゾーン
NFW サブネット AZ2
NFW エンドポイント
リージョン NAT
ゲートウェイ
Amazon VPC
Amazon VPC
Amazon VPC
NFW エンドポイント
AWS Network
Firewall
AWS Network Firewall
複数エンドポイント
複数エンドポイントを使うことで、複
数 VPC にまたがるファイアウォール
展開のスケーリングを簡素化しつつ、
集中ポリシーでコスト最適化も実現で
きます
ドメイン (本番・開発など) やコンプ
ライアンス要件ごとにファイアウォ
ールを分けることが推奨されます。
また、ポリシー内で エンドポイント
ID を使うことで、特定の VPC にのみ
適用されるルールを作成できます。
13 / 104
[p.15] AWS Network Firewall
Proxy
パブリックプレビュー
インターネットゲートウェイ (IGW)
AWS NAT Gateway +
Network Firewall プロキシ
Amazon VPC
AWS Network Firewall
プロキシエンドポイント
15 / 104
[p.19] AWS Network Firewall
Proxy アーキテクチャ
インターネットゲートウェイ (IGW)
プライベートサブネット
パブリックサブネット
クライアント
NWF Proxyエンドポイント
NAT ゲートウェイ +
NFW Proxy
ルートテーブル
VPC CIDR
Local
ルートテーブル
VPC CIDR
Local
0.0.0.0/0
IGW
分散型 IPv4 egress
各 VPC が独自の NWF Proxy構成とエンドポイント
を分散型デザインで持つことができ、既存デプロ
イメントとシームレスに統合されます
19 / 104
[p.20] AWS Network Firewall
Proxy アーキテクチャ
プロキシのデプロイを集約し、VPC のルーティング変更
なしに、クライアント VPC から Network Firewall プロ
キシ

---
## [CDN335] クラウドとインターネットのつなぎ⽅ －サービス公開と外向き通信を整理する－
`AWSセッション` / 83p / アーキテクチャ/サーバーレス
services: AWS Direct Connect, AWS Lambda, AWS Transit Gateway, AWS WAF, Amazon API Gateway, Amazon CloudFront, Amazon EC2, Amazon VPC

<まとめ>
[p.5] 5
• お客様の抱える課題
• 設計原則
• クラウドからインターネットへ出ていく通信
• インターネットからクラウドへ⼊ってくる通信
• まとめ
Agenda
[p.6] 6
• お客様の抱える課題
• 設計原則
• クラウドからインターネットへ出ていく通信
• インターネットからクラウドへ⼊ってくる通信
• まとめ
Agenda
[p.16] 16
• お客様の抱える課題
• 設計原則
• クラウドからインターネットへ出ていく通信
• インターネットからクラウドへ⼊ってくる通信
• まとめ
Agenda
[p.23] 23
• お客様の抱える課題
• 設計原則
• クラウドからインターネットへ出ていく通信
• インターネットからクラウドへ⼊ってくる通信
• まとめ
Agenda
[p.59] 59
• お客様の抱える課題
• 設計原則
• クラウドからインターネットへ出ていく通信
• インターネットからクラウドへ⼊ってくる通信
• まとめ
Agenda
[p.77] 77
• お客様の抱える課題
• 設計原則
• クラウドからインターネットへ出ていく通信
• インターネットからクラウドへ⼊ってくる通信
• まとめ
Agenda

---
## [CMP336] Amazon EC2 がセキュアな理由を、 専用チップの設計から徹底解説 — EC2 インスタンスの裏で動く AWS Nitro System —
`AWSセッション` / 55p / セキュリティ
services: Amazon EC2, Inferentia, Trainium

<まとめ>
[p.5] • AWS のシリコンイノベーション
• AWS Nitro System とは
• AWS Nitro System ができるまで
• AWS Nitro System セキュリティのDive Deep
• まとめ・今日からできること
アジェンダ
[p.49] ②お客様組織内での保護
まとめ
EC2 インスタンス
アテステーション
インスタンス全体を証明
GPU/AI ワークロード全体を
追加料金なし
Nitro Enclaves
一部を隔離して機密処理
鍵・PII など小さな機密処理
追加料金なし
[p.50] まとめ・今日からできること

---
## [CNS315] サーバーレス API のセキュリティ －API 認可の基本を押さえ、AI エージェント時代に備える－
`AWSセッション` / 112p / アーキテクチャ/サーバーレス · セキュリティ · 生成AI/エージェント
services: AWS Lambda, AWS Systems Manager, AWS WAF, AgentCore, Amazon Aurora, Amazon Bedrock, Amazon ElastiCache, Amazon GuardDuty, Amazon Inspector, Amazon Neptune

<まとめ>
[p.3] • 題材：フィットネスアプリ
• API セキュリティの基礎
• アイデンティティ(ID) を意識したAPI 認可
• AI エージェントの認可－はじめの一歩
• まとめ
アジェンダ
[p.4] • 題材：フィットネスアプリ
• API セキュリティの基礎
• アイデンティティ(ID) を意識したAPI 認可
• AI エージェントの認可－はじめの一歩
• まとめ
アジェンダ
[p.7] • 題材：フィットネスアプリ
• API セキュリティの基礎
• アイデンティティ(ID) を意識したAPI 認可
• AI エージェントの認可－はじめの一歩
• まとめ
アジェンダ
[p.23] AWS WAF でAPI エンドポイントを保護
IP ベースの制御
• 悪意のあるIP アドレスからの保護
• レートベースルール
• IP 許可/拒否リスト
• 地理的リージョンの許可/拒否リスト
AWS WAF
AWS マネージド
ルール
レートベース
ルール
サードパーティ
ルール
カスタムルール
Routes API
Socials API
Support API
Activities API
対象：API に届く前のリクエスト
[p.24] AWS WAF でAPI エンドポイントを保護
ルールベースの制御
• マネージドルールで一般的な
攻撃パターンから保護
• OWASP Top 10 を踏まえた構成
• カスタムルールの定義または
サードパーティルールの活用
• HTTP リクエストの検査
Routes API
Socials API
Support API
Activities API
AWS マネージド
ルール
レートベース
ルール
サードパーティ
ルール
カスタムルール
対象：API に届く前のリクエスト
AWS WAF
[p.25] • 題材：フィットネスアプリ
• API セキュリティの基礎
• アイデンティティ(ID) を意識したAPI 認可
• AI エージェントの認可－はじめの一歩
• まとめ
アジェンダ
[p.27] API における認可ポイントの整理
API Gateway
Lambda
ユーザー
Web
ブラウザ
Web
アプリケーション
[p.28] API における認可ポイントの整理
Lambda
Fitness Web
アプリケーション
ユーザー
Web
ブラウザ
Web
アプリケーション
API Gateway
[p.29] API における認可ポイントの整理
Lambda
Activities API や
Routes AP

---
## [CNS317] AI エージェントのオブザーバビリティ実践
`AWSセッション` / 47p / 生成AI/エージェント · 運用/SRE
services: AgentCore, Amazon Bedrock, Amazon CloudWatch, Amazon S3

<まとめ>
[p.4] AI Agent におけるオブザーバビリティの課題
OpenTelemetry とは
CloudWatch 生成AI オブザーバビリティ概要
導入方法
主な機能
デモ
まとめ
Agenda
[p.25] トレースの構造
•
セッション: 複数のやり取りをまとめた一連の会話
• トレース: 1度のユーザーの指示- 応答のかたまり
•
スパン: トレース内の一つの作業の単位
•
サブスパン:トレース内のさらに詳細な作業単位
[p.45] まとめ
OpenTelemetry で計装し、
CloudWatch 生成AI オブザーバビリティで挙動を可視化する
Bedrock AgentCore Evaluations を設定し、
AI Agent の品質を継続評価する

---
## [CNS319] AWS DevOps Agent による ⾃律的インシデント対応 －その能⼒を引き出す設計のベストプラクティス－
`AWSセッション` / 67p / 組織/内製化 · 運用/SRE
services: AWS DevOps Agent, AgentCore, Amazon CloudWatch, Claude, Kiro, MCP

<まとめ>
[p.4] Agenda
• 運⽤にAI を組み込むには
• デモ
• 能⼒を引き出す設計のベストプラクティス
• 応⽤編〜さらなる拡張〜
• まとめ
[p.36] Agent Space はシステム単位でまとめる
Agent Space
Account 1
Account 2
同⼀システム
• Account 1 とAccount 2 の両⽅が
調査対象になる
• Account 1 で発覚した障害でも
Account 2 まで含めて調査される
[p.39] Agent Space 設計の原則
Agent Space は調査スコープに合わせる
• 依存先まで含めて1 つのAgent Space にまとめる
• 環境やチーム単位で複数のAgent Space に分ける
[p.58] まとめ

---
## [CNS341] Amazon ECS Managed Instances と AWS Fargate の仕組みと違いを知る
`AWSセッション` / 66p / コスト最適化/FinOps · 生成AI/エージェント
services: AWS Fargate, Amazon EC2, Amazon ECS

<まとめ>
[p.3] 本セッションについて
想定聴講者
• Amazon ECS をご利用中でデータプレーンの運用負荷を軽減したい方
• Amazon ECS Managed Instances とAWS Fargate の使い分け
について知りたい方
ポイント
• ECS Managed Instances とFargate の仕組みと違い
•
キャパシティプロビジョニングとタスク配置
•
コスト最適化
•
インフラ管理と運用
[p.4] アジェンダ
イントロダクション
•
Amazon ECS
•
Amazon ECS Managed Instances
Amazon ECS Managed Instances とAWS Fargate
•
キャパシティプロビジョニングとタスク配置
•
コスト最適化
•
インフラ管理と運用
まとめ
[p.62] まとめ
[p.63] まとめ
コンピュート
vCPU/RAMの組み合わせ
（=タスクサイズ）を指定可能
インスタンス属性/タイプを指定可能な柔軟性
（ODCRの利用、GPU含む）
Capacity Provider
1インスタンスに1タスク起動
ECSによる高速スケーリング
コスト最適化
タスク集約率の管理不要
Seekable OCIの活用
インフラ最適化機能によるコスト最適化
イメージキャッシュの活用
インフラ管理と
運用
定期的なインスタンス入れ替え
起動後14-21日でインスタンス入れ替え
特権Linux capabilitiesをサポート
Fargate
Managed Instances
[p.64] まとめ詳細
コンピュート
AWSマネージドなインスタンス：
vCPU/RAMの組み合わせ（=タスク
サイズ）を指定可能
AWSマネージドなインスタンス：
インスタンス属性/タイプを指定可能な
柔軟性（ODCRの利用、GPU含む）
セルフマネージドインスタンス：
お客様側で指定したAMIでインス
タンスを起動（ODCRの利用）
Capacity Provider
FARGATE/FARGATE SPOT
•
1インスタンスに1タスク起動
•
ベストエフォートでAZ分散/リバ
ランス
MANAGED INSTANCES
•
ECSによる高速スケーリング
•
ECSによるインフラ最適化
•
ベストエフォートでAZ分散/リバランス
AUTO SCALING GROUP
•
Auto Scaling・CloudWatchと
連携したスケーリング
•
ベストエフォートでAZ分散/リ
バランス
コスト最適化
•
Compute S

---
## [CNS347] おにぎり⽉ 40 個から 32 万個へ — ビジネスの成⻑痛を和らげる サーバーレスアーキテクチャの育て⽅
`AWSセッション` / 78p / アーキテクチャ/サーバーレス
services: AWS CDK, AWS Lambda, AWS Step Functions, Amazon EventBridge, Amazon Kinesis, Amazon SQS, Kiro

<まとめ>
[p.72] まとめ

---
## [CNS348] AWS における Kubernetes の未来
`AWSセッション` / 61p / AI駆動開発
services: AWS IAM, AWS Organizations, Amazon EKS, Amazon Q, Kiro, MCP, Trainium

<冒頭>
[p.2] ⾃⼰紹介
⼩⻄ 杏典 (Kyosuke Konishi)
Amazon Web Services Japan G.K.
Solutions Architect
ISV/SaaS 企業のお客様を中⼼に
ソリューションアーキテクトとして技術⽀援に従事
• 好きなサービス
Amazon EKS                   Kiro CLI
@_konippi
https://x.com/_konippi
konippi
https://github.com/konippi
[p.3] • Kubernetes と Amazon EKS のいま
• Amazon EKS のアップデート
• クラスターの運⽤を進化させる
• クラスターをあらゆる場所で実⾏する
• クラスターインフラストラクチャを⾃動化する
• クラスターを超えてプラットフォームを構築する
• AI を超⼤規模に実⾏する
• Amazon EKS のこれから
アジェンダ
[p.4] 80%
本番環境で使⽤中
13%
パイロット / 評価中
https://www.cncf.io/reports/cncf-annual-report-2024/
[p.5] シンプルさ
AWS SDK
10,000 メソッド
Kubernetes Core
1,500 メソッド

---
## [CNS449] AI が開発／運用しやすいクラウド サーバーレスの視点から考える設計原則
`AWSセッション` / 114p / AI駆動開発 · アーキテクチャ/サーバーレス
services: AWS Lambda, AgentCore, Amazon API Gateway, Amazon DynamoDB, Amazon S3, Amazon SQS, Claude, Kiro, MCP

<まとめ>
[p.3] • コンテキストエンジニアリング
• 最適なソフトウェアの構造を考える
• 最適なサーバーレスアーキテクチャを考える
• まとめ
Agenda
[p.29] Monorepo の弱点と考慮するポイント
１つのリポジトリで全てのファイルにアクセスできる一方でコードベースが肥大化する。
何も工夫をしなければ、エージェントは大量のファイルを読み込み、コンテキストウィンドウを圧迫する。
💦
[p.30] Monorepo の弱点と考慮するポイント
１つのリポジトリで全てのファイルにアクセスできる一方でコードベースが肥大化する。
何も工夫をしなければ、エージェントは大量のファイルを読み込み、コンテキストウィンドウを圧迫する。
💦
パッケージの依存関係を最小限にし、
細部を見なくても理解できる構造を作る
[p.74] Lambda 特有のコード例
Lambda 特有のコード例
外部に依存するコードを
ベタ書きしがち
event の構造が独自
エントリポイントがhandler
クエリパラメータからuserId を受け取り、データを取得して返す
[p.108] まとめ

---
## [CNS454] ワークフローオーケストレーターにおける 複雑性と非決定性のコントロール
`AWSセッション` / 88p / アーキテクチャ/サーバーレス
services: AWS Batch, AWS Glue, AWS Lambda, AWS Step Functions, AWS Systems Manager, AgentCore, Amazon Bedrock, Amazon EventBridge, Amazon S3, Amazon SQS

<まとめ>
[p.2] アジェンダ
AWS Step Functions
AWS Lambda
durable functions
Amazon MWAA
AWS のワークフローオーケストレーション
複雑性
AI Agent の非決定性
コントロール
ワークフローが解決すること
まとめ
[p.5] アジェンダ
AWS Step Functions
AWS Lambda
durable functions
Amazon MWAA
AWSのワークフローオーケストレーション
複雑性
AI Agent の非決定性
コントロール
ワークフローが解決すること
まとめ
[p.11] アジェンダ
AWS Step Functions
AWS Lambda
durable functions
Amazon MWAA
AWSのワークフローオーケストレーション
複雑性
AI Agent の非決定性
コントロール
ワークフローが解決すること
まとめ
[p.14] JSONata によるデータ変換
2024 年11 月に対応したクエリ言語によりデータ処理が楽に
{
"QueryLanguage" :  "JSONata" ,
"Type" :  "Pass" ,
"Output" : {
"summary" :  "{% $states.input.items.{
'name' : name,
'total' : price * quantity
} %} ",
"grandTotal" :  "{% $sum(
$states.input.items.(price * quantity)
) %} "
}
}
* で掛け算
関数
直感的な式言語で
データ処理
豊富な組み込み関数
ステートマシン内で
データ処理が完結
[p.21] アジェンダ
AWS Step Functions
AWS Lambda
durable functions
Amazon MWAA
AWSのワークフローオーケストレーション
複雑性
AI Agent の非決定性
コントロール
ワークフローが解決すること
まとめ
[p.58] A 社のNext Step
AI Agent をワークフローと組み合わせることに
AI
[p.79] アジェンダ
AWS Step Functions
AWS Lambda
durable functions
Amazon MWAA
AWSのワークフローオーケストレーション
複雑性
AI Agent の非決定性
コントロール
ワークフローが解決すること
まとめ
[p.81] まとめ: ワークフローオー

---
## [DAT302] AI エージェントで切り拓く 商⽤ DB から Amazon Aurora への移⾏ ― コード変換の実践⼿法とお客様検証事例
`AWSセッション` / 54p / 生成AI/エージェント
services: AWS DMS, Amazon Aurora, Amazon Bedrock, Amazon EC2, Amazon RDS, Amazon S3, Claude, Kiro, MCP, Strands Agents

<まとめ>
[p.4] • データベース移⾏の背景と課題
• ⽣成AI を活⽤したコード変換アプローチ
• お客様検証事例
• AWS の移⾏⽀援サービス
• まとめ
Agenda
[p.21] ⽣成 AI 活⽤イメージ (SQL 変換)
21
変更ポイントの説明とともに
変換後の SQL ⽂を提⽰してくれる
[p.22] ⽣成 AI 活⽤イメージ (SQL 変換)
22
変更ポイントの説明とともに
変換後の SQL ⽂を提⽰してくれる
[p.50] まとめ

---
## [DAT318] 実践！Amazon RDS と Amazon Aurora の コスト最適化とパフォーマンス向上
`AWSセッション` / 79p / AI駆動開発 · コスト最適化/FinOps
services: AWS Lambda, Amazon Aurora, Amazon EC2, Amazon EKS, Amazon RDS, Amazon S3, Kiro

<まとめ>
[p.4] 4
1. Amazon RDS とAurora 概要とコスト構造
2. 主要コスト要素– コンピュート
3. 主要コスト要素– ストレージ
4. 主要コスト要素– バックアップ
5. まとめAnyCompany のジャーニー
Agenda
[p.62] 62
5. まとめ- AnyCompany のジャーニー

---
## [DAT338] Amazon Aurora DSQL Deep Dive ― 内部アーキテクチャの設計思想と実装の勘所
`AWSセッション` / 111p / アーキテクチャ/サーバーレス
services: AWS CloudTrail, AWS Lambda, Amazon Aurora, Amazon DynamoDB, Amazon RDS

<まとめ>
[p.4] • サーバーレスデータベースの必要性
• Aurora DSQL 概要
• アーキテクチャDive Deep
• 認証と認可
• コードサンプル
• パフォーマンス
• 考慮事項
• アーキテクチャの設計思想とベストプラクティス
• まとめ
アジェンダ
4
[p.16] マルチAZ アクティブ-アクティブ
3つのAZ にデータをレプリケーション
読み書き両方を処理する1つのエンドポイント
インスタンスのサイジング・スケーリング・管理不要
パッチ適用やアップグレードによるダウンタイムなし
ストレージとコンピューティングは自動スケーリング
99.99% の可用性を目指した設計
シングルリージョンクラスター
Region
Customer VPC
Application
Aurora DSQL Cluster
16
[p.108] まとめ
[p.109] Aurora DSQL まとめ
利用する上でのポイントは「並列・小さく・接続プール」
1
2
3
4
5
インフラ管理不要でサーバーレスかつ複雑なSQLを実行可能
Simple by design — トランザクション単位でスケール
制約ではなく、安定性能のための設計
ACID サポート— あらゆる規模で強い整合性（結果整合性ではない）
109

---
## [DAT340] Amazon DynamoDB アドバンスドデータモデリング
`AWSセッション` / 155p / その他
services: Amazon DynamoDB

<まとめ>
[p.25] データモデリングでのポイント
• DynamoDB はフルマネージド/ 従量課金/ スケールおよび一貫し
た性能を特徴として持っている
[p.26] データモデリングでのポイント
• DynamoDB はフルマネージド/ 従量課金/ スケールおよび一貫し
た性能を特徴として持っている
• これらの特性を最大限に活かすには、DynamoDB の基本的な機
能を理解し、適切なデータモデリングを行う必要がある
• DynamoDB のユニークな特性を理解
• 適切なパーティショニングとAPI、セカンダリインデックス使用
• 従量課金モデルに合わせたデータInput/Output 最適化
[p.27] データモデリングでのポイント
• DynamoDB はフルマネージド/ 従量課金/ スケールおよび一貫し
た性能を特徴として持っている
• これらの特性を最大限に活かすには、DynamoDB の基本的な機
能を理解し、適切なデータモデリングを行う必要がある
• DynamoDB のユニークな特性を理解
• 適切なパーティショニングとAPI、セカンダリインデックス使用
• 従量課金モデルに合わせたデータInput/Output 最適化
• 1回で完結することではなく、継続的に最適化を行う
[p.33] データモデリングの大原則
1.ワークロードのデータ整合性を維持する
a) アプリケーション側でスキーマの整合性を担保する
★DynamoDB で考慮するべきポイント
[p.36] DynamoDB モデリングの大原則
1.ワークロードのデータ整合性を維持する
a) アプリケーション側でスキーマの整合性を担保する
b) アプリケーションの制約を維持する(一意性、制限など)
★DynamoDB で考慮するべきポイント
[p.39] DynamoDB モデリングの大原則
1.ワークロードのデータ整合性を維持する
a) アプリケーション側でスキーマの整合性を担保する
b) アプリケーションの制約を維持する(一意性、制限など)
c) データレプリケーションで不整合を避ける
★DynamoDB で考慮するべきポイント
[p.43] DynamoDB モデリングの大原則
2.必要なときに適切なデータを簡単に操作できるようにする
a) 書き込み: 関連アイテムを指定する適切なプライマリキー
b) 読み取り: プライマリキー+ インデックスで効率的にフィルタリング
★DynamoDB で考慮するべきポイント
[p.50] まとめ
• 可能な限りシンプルさを保つ
[p.51] まと

---
## [DAT358] AI エージェントで実現する データベース運⽤︓検知・推奨・最適化
`AWSセッション` / 53p / コスト最適化/FinOps · 生成AI/エージェント
services: Amazon Aurora, Amazon DynamoDB, Amazon RDS, Amazon Redshift, MCP

<まとめ>
[p.5] アジェンダ
課題
ゴール
なぜ AI エージェントか
AWS データベースサービス と AI エージェント
デモ
メリット
まとめ
[p.50] まとめ

---
## [DAT456] より速く、より安く、より良く ― Valkey と ElastiCache によるキャッシュ基盤の革新
`AWSセッション` / 105p / アーキテクチャ/サーバーレス
services: Valkey

<まとめ>
[p.3] 1. Valkey の起源
2. マルチスレッドアーキテクチャ
3. ElastiCache Serverless
4. 信頼性の向上
5. メモリオーバヘッドの削減
6. まとめ
Agenda

---
## [DVT201] エージェンティック AI で、 これまでにないソフトウェア構築を実現
`AWSセッション` / 39p / AI駆動開発 · アーキテクチャ/サーバーレス · 生成AI/エージェント
services: AgentCore, Kiro, MCP

<冒頭>
[p.2] 自己紹介
名前
福井厚（ふくいあつし）
所属
アマゾンウェブサービスジャパン合同会社
デベロッパートランスフォーメーション（DevTx）
シニアデベロッパースペシャリスト
ソリューションアーキテクト
関心領域
ソフトウェアアーキテクチャ、ドメイン駆動設計、アジャイル開発
好きなAWSサービス
サーバーレス全般、Kiro
[p.3] エージェンティックAI が
ソフトウェア開発の
未来を再構築している
[p.4] Agenda
o エージェンティックAI によるビジネス価値の創出
o Kiro によるソフトウェア開発の進化
[p.5] エージェンティックAI による
ビジネス価値の創出

---
## [DVT225] AWS Infrastructure as Code - 2025 年主要アップデートの振り返り
`AWSセッション` / 82p / セキュリティ · 生成AI/エージェント
services: AWS CDK, AWS CloudFormation, AWS Lambda, AWS Transit Gateway, Amazon API Gateway, Amazon Bedrock, Amazon DynamoDB, Amazon EC2, Amazon Kinesis, Amazon RDS

<まとめ>
[p.66] 解決策: CloudFormation フック
リソース
スタック
Cloud Control API
変更セット
フック呼び出しポイント
デプロイ
フック
検証
デプロイの
ブロック
フィードバック
IaC の設定ミス
開発者
[p.79] インフラ管理の
進化
IaC ワークフローの簡素化とガバナンス
まとめ
AWS CloudFormation
IDE エクスペリエンス
早期エラー検証
ドリフト対応
変更セット
CDK リファクタリング
CDK ミックスイン
CloudFormation フック
コントロールカタログ
スタックセットの
依存関係
AWS IaC
MCP Server
アプリケーションを迅速に開発
コラボレーション環境で
アプリケーションを安全に進化させる
[p.80] Next Step
すでに AWS CDK をお使いの⽅々
新機能を試してみましょう︕
What’s New / AWS ブログ / サンプルコード / ワークショップ など
これから AWS CDK を使い始める⽅々
まずは概要を押さえてから、サンプルアプリを作ってみましょう︕
スライド
AWS CDK ⼊⾨ガイド
これだけは知っておきたいヒント集
ワークショップ
TypeScript の基礎から始める
AWS CDK 開発⼊⾨
ワークショップ
AWS CDK Immersion Day
ワークショップ

---
## [DVT324] Kiro と Amazon の文化から学ぶ AI 駆動開発の型
`AWSセッション` / 61p / AI駆動開発 · 組織/内製化
services: AWS CDK, AWS Lambda, AWS Security Hub, Amazon CloudFront, Amazon Inspector, Amazon RDS, Claude, Kiro, MCP

<まとめ>
[p.57] まとめ

---
## [DVT350] AI を活用した新しいデプロイメント手法と CI:CD における迅速な障害検知と 復旧の実現方法
`AWSセッション` / 41p / AI駆動開発 · 運用/SRE
services: AWS CDK, AWS CloudFormation, AWS Config, AWS Lambda, Amazon S3, Kiro, MCP

<まとめ>
[p.39] 1. CI/CDは爆速で進化しています
2. MCPを活用することによって開発は更に早くなります
3. 継続的コンフィグレーションにフィーチャーフラグが活用できます
本セッションのまとめ

---
## [DVT359] 明日から始める、 コーディングエージェント時代の フルスタック開発
`AWSセッション` / 41p / AI駆動開発
services: AWS CDK, AWS CloudFormation, AWS Lambda, Amazon Aurora, Amazon Bedrock, Amazon CloudWatch, Amazon DynamoDB, Amazon S3, Amazon SQS, Kiro

<冒頭>
[p.2] 稲田 大陸 / いなだ りく
•
経歴
•
2021 年 AWS Japan に入社
•
2022 年 ~ 製造業のお客様を中心にご支援
•
最近の取り組み
•
エンタープライズのお客様向けに AI-DLC の推進
•
Kiro, AWS Amplify の情報発信
•
楽しみなこと
•
8 月に第一子誕生予定！
@inada_riku
[p.3] 3 つだけ教えてください
最後の 1 問は心の中で
[p.4] Q1
普段からコーディングエージェントを
使って開発してる人！
[p.5] 実際にリリースまで行くことができた人！
Q2

---
## [DVT452] Operation Phase of AI-DLC － AI 駆動カオスエンジニアリングのすすめ－
`AWSセッション` / 88p / AI駆動開発
services: AWS DevOps Agent, Claude, Kiro

<冒頭>
[p.2] ⾃⼰紹介
⾦森 政雄
Ø 所属/役職 :
Developer スペシャリスト
ソリューションアーキテクト
Ø 好きなAI-DLC のステージ
Unit Generation
[p.3] このセッションのゴール
• AI-DLC のOperation フェーズにどのようなことができるか考える
• AI-DLC の考え⽅を活⽤して、運⽤を改善していく⽅法を⾒つける
このセッションの対象者
• 開発にすでにAI-DLC を取り⼊れている⽅、もしくは検討中の⽅
• AI-DLC の基本的な考え⽅はご存知であることを前提とします
このセッションでお話ししないこと
• AI-DLCの詳細の解説
• AWS DevOps Agent などの特定の製品の解説
• AIOps の具体例/詳細
このセッションのゴールと対象者
[p.4] AI-DLC に関する他のセッションのご紹介
AI 駆動開発ライフサイクル
(AI-DLC) のご紹介[AIM221]
AI 駆動開発ライフサイクル(AI-DLC）は、開発
プロセス全体においてAI を中⼼的な協⼒者と
して位置づける、ソフトウェアエンジニアリン
グの変⾰的アプローチです。
6⽉25⽇
12:30 午後- 1:10 午後
AI 駆動は上流⼯程にこそ活きる
－⾮エンジニアにこそ知ってほしい、
AI 駆動開発ライフサイクルによる
上流⼯程の変⾰[AIM222]
AI が⽣成できるのは設計書やコードだけではありま
せん。⾮エンジニアの⽅々も、既に上流⼯程におけ
る様々なドキュメントの⽣成に活⽤されています。
6⽉25⽇
1:30 午後- 2:10 午後
[p.5] • AI-DLC の振り返り
• AI-DLC のOperation フェーズとは?
• 仮説︓
リスクストーミング X カオスエンジニアリング
• デモ
アジェンダ

---
## [IND327] 情報を集め、判断し、行動する時代へ： データ基盤・AI エージェント・エッジ AI で 変わる製造現場
`AWSセッション` / 65p / アーキテクチャ/サーバーレス · データ分析/基盤 · 生成AI/エージェント
services: AWS Glue, AWS Lambda, AgentCore, Amazon Bedrock, Amazon ECS, MCP

<まとめ>
[p.4] 1. AI 時代に変わらない製造業における価値
2. 新しいデータ基盤とAI 活用の原則
3. 実践：人間とAI の新しいワークフロー
4. 次の可能性：Physical AI とエッジへの拡張
5. まとめ：AI 導入の指針とNext Step
Agenda
[p.63] 止めない、を実現するために── 情報を集め、判断し、行動する
まとめ
スマートマシンデモを見に行こう
保全支援デモ
Next Action
VI-A043
データの質と流れが、AI の判断力を決める
コンテキストを付与し、どこからでもアクセスできる基盤をつくる
単なる既存業務の置き換えではなく、ワークフローを再設計する
自律性はリスクに応じて設計し、重要な判断には人が介在する
AI 推論はエッジとクラウドを使い分ける
即応性・安全・プライバシーはエッジ、学習・大規模処理はクラウド
1.
2.
3.

---
## [MAM201] 技術的負債を競争⼒に変える︓ マイグレーション＆モダナイゼーション
`AWSセッション` / 48p / マイグレーション/モダナイゼーション
services: AWS DMS, AgentCore, Amazon Aurora, Amazon Bedrock, Amazon EC2, Amazon ECS, Amazon Q, Kiro, MCP

<まとめ>
[p.37] カスタム変換エージェントの
仕組み
レガシーな
コード、フレームワーク、
アーキテクチャ、アプリケーション
モダナイズされた
コード、フレームワーク、
アーキテクチャ、アプリケーション
AWS Transform CLI と
Web コンソールで、
⼤量の変換ジョブをまとめて
モニタリング
定義
学習と改善
実⾏
検証

---
## [MAM204] AWS Transform custom - AI エージェントによる ⼤規模コードモダナイゼーションの⾃動化
`AWSセッション` / 42p / AI駆動開発 · マイグレーション/モダナイゼーション · 生成AI/エージェント
services: AWS Batch, AWS CDK, Amazon CloudWatch, Amazon S3, Kiro

<冒頭>
[p.2] アマゾンウェブサービスジャパン合同会社
ISV SaaS ソリューション本部
ソリューションアーキテクト
ISV / SaaS 業界のお客様を中⼼にご⽀援
好きな AWS サービス︓ AWS CDK, AWS Transform custom, Kiro
⼭崎 宏紀 (Hiroki Yamazaki)
AWS CDK
AWS Transform
Kiro
[p.3] 対象者
•
エンタープライズの開発組織で働くエンジニア
•
モダナイゼーションを推進するアーキテクト
話すこと
•
技術的負債のリスクと
AWS Transform custom によるアプローチ
•
組織でコードモダナイゼーションを展開する⽅法
話さないこと
•
データやインフラストラクチャの
マイグレーション⼿法
セッション
テーマ
[p.4] • 技術的負債の課題
• AWS Transform custom のご紹介
• 組織での⼤規模展開
• 変換品質とカスタマイズ
• 価値と料⾦
アジェンダ
[p.5] 技術的負債
企業のイノベーションの⾒えざる障害
20%
IT 予算に占める割合
IT 予算の20% は新たな
機能開発ではなく、技術的
負債の管理に費やされる
- Forrester Research, Inc.
23%
開発者の時間に占める割合
開発者は平均して23% の
時間を技術的負債によって
失っている
- Journal of Systems and Software
$2.41T
年間のコスト
⽶国だけでも、年間
$2.41兆が技術的負債に
費やされている
- Accenture
“技術的負債を放置しておくと、予定外の作業しかできなくなる︕"
— Gene Kim, The Phoenix Project

---
## [MAM301] AI で VMware 移行を加速： AWS Transform for VMware
`AWSセッション` / 51p / マイグレーション/モダナイゼーション
services: AWS CDK, Amazon EC2, Amazon ECS, Amazon EKS, Amazon FSx, Amazon RDS

<まとめ>
[p.4] • VMware を取り巻く市場の動向
• AWS Transform が変える、大規模マイグレーションの姿
• デモ
• お客様事例
• まとめとNext Steps
Agenda
[p.45] まとめとNext Steps

---
## [MAM303] メインフレームアプリケーションが AWS 上で生まれ変わる- 生成 AI 活用による Reimagine
`AWSセッション` / 56p / AI駆動開発 · マイグレーション/モダナイゼーション · 生成AI/エージェント · 組織/内製化
services: AWS CDK, Kiro

<まとめ>
[p.5] 1. なぜ今、メインフレームを進化させるのか
2. Reimagine とは
3. Reimagine の実践：3 フェーズアプローチ
4. 先進企業のReimagine 事例
5. まとめとNext Steps
Agenda
[p.11] 生成 AI が変えたゲームのルール
リバース
エンジニアリング
アプリケーションの仕様を読み解く
フォワード
エンジニアリング
• コード分析
• データ分析
• ビジネスロジック抽出
• 仕様駆動開発
• コード生成
• テスト生成
アプリケーションを再構築
生成AI 活用ポイント
生成AI 活用ポイント
[p.49] まとめとNext Steps
[p.50] まとめ
1
AWS Transform とKiro の連携でReimagine を加速
生成AI が、年単位のプロジェクトを月単位に短縮
2
Human in the Loop で、AI と人間が協業して品質を担保
AI が速度を、ドメインエキスパートとアーキテクトが品質を
3
Reimagine を始めるなら「今」
ドメインエキスパートがまだ社内にいる「今」が、成功の鍵
[p.51] Next Steps — 今日から始められること
AWS Transform でリバースエンジニアリングを体感する
CardDemo のコード分析・データ分析・ビジネスロジック抽出を体験する
※ CardDemo はaws-samples としてGitHub 上で公開
ドメインエキスパートと共にReimagine 対象の検討を開始する
現場の痛みを知ることから始めて、経営戦略に昇華する
AWS / パートナーへ相談する
一人で抱え込まず、まず話を聞いてみる
1
2
3
[p.52] 参考リンク
※本セッションに関連する公式情報・ブログ
1. なぜ今、メインフレームを進化させるのか
•
AWS ブログ：実世界におけるCOBOL の
モダナイゼーションから学んだこと
aws.amazon.com/jp/blogs/news/learnings-from-cobol-modernization-in-
the-real-world/
•
AWS Executive Insights: Cloud for CEOs
aws.amazon.com/jp/executive-insights/content/cloud-for-ceos/
2. Reimagine とは
•
AWS ブログ：エージェンティックAI とAWS Transform で
メインフレームアプリケーションを再

---
## [MAM331] Microsoft ワークロードの モダナイゼーション最新⽅程式 - もう待たない、⽣成 AI で加速する移⾏の現実解
`AWSセッション` / 35p / AI駆動開発 · マイグレーション/モダナイゼーション
services: AWS DMS, AWS Lambda, Amazon Aurora, Amazon ECS, Kiro, MCP

<まとめ>
[p.4] • モダナイゼーションの動機
• AWS Transform とは
• 事例紹介
• まとめ& Next Step
アジェンダ
[p.17] エクスペリエンス
Web コンソール
IT 部⾨向け
ü リポジトリ単位での
⼤規模変換
ü チーム間連携
ü 開発者へのハンドオフ
Visual Studio IDE
開発者向け
ü 1 つのソリューションへ
の集中
ü チェックポイントによる
反復
ü 変換結果の確認と⽅向
修正
AI コードコンパニオン
開発者向け
ü 1 つのソリューションへ
の集中
ü AI エージェントとの
協働
ü 変換後の課題も解決
[p.30] まとめ& Next Step
[p.31] 本セッションのまとめ
1. AWS Transform × AI コーディングエージェントで
モダナイゼーションを実現
2.  成功のカギはツール、⼈、プロセス
3.  モダナイゼーションによりビジネス俊敏性向上を実現

---
## [MAM332] VMware 環境をそのまま AWS へ︓ AWS への最速の移⾏を実現する アーキテクチャ詳解・デモ・お客様事例
`AWSセッション` / 42p / アーキテクチャ/サーバーレス · マイグレーション/モダナイゼーション
services: AWS CloudFormation, AWS Lambda, AWS Outposts, AWS Transit Gateway, Amazon EC2, Amazon EKS, Amazon FSx, Amazon RDS, Amazon VPC

<まとめ>
[p.15] ルートサーバー:
BGP を使⽤してVPC のルートテーブルを動的に
設定する仕組み。 VPC 内の仮想アプライアンスから
ルートを受信し、ルートテーブルへ⾃動反映
ルートサーバーピア:
ルートサーバーエンドポイントと AWS 上のアプライ
アンス間で確⽴する BGP セッション設定
ルートサーバーエンドポイント:
ネットワークアプライアンスがルートサーバーと BGP
セッションを確⽴するためのコンタクトポイント
リージョン
AWS Cloud
VPC サブネット
仮想プライベートクラウド (VPC)
ルートサーバー
ピア
エンドポイント
エンドポイント
NSX アップリンクサブネット
(10.10.11.0/24)
ルートサーバー
ピア
NSX
Edge
NSX
Edge
ルートテーブル-A
ルートテーブル-B
VPC ルートサーバー
VPC ルート
サーバー
[p.16] リージョン
AWS Cloud
VPC サブネット
仮想プライベートクラウド (VPC)
VPC ルート
サーバー
ルートサーバー
ピア 02
エンドポイント 01
エンドポイント 02
NSX アップリンクサブネット
(10.10.11.0/24)
ルートサーバー
ピア 01
NSX
Edge
NSX
Edge
ルートテーブル
ルートテーブル
NSX Edge と VPC ルートサーバー
NSX と VPC ルートサーバー設定
構成要素
• ルートサーバーエンドポイント × 2、
エンドポイント毎にルートサーバーピア × 1 が必要
設定の取得元
• NSX 設定（エッジアップリンク IP、ASN 等）は
ルートサーバーピアから取得
ピアの要件
• 各ピアは 同じ ASN（NSX Tier-0 BGP で使⽤）
• エッジアップリンク IP として使う ピア IP は
異なる値 にする
送信先
ターゲット
タイプ
10.10.0.0/16
local
Static
0.0.0.0/0
nat-123abcd
Static
オーバーレイ CIDRs
10.10.11.x
Propagated
オンプレミス CIDRs
tgw-123abcd
Static

---
## [SEC230] 経済安保が求めるデジタル主権 ― 重要インフラの AI とデータを AWS で守る
`AWSセッション` / 47p / アーキテクチャ/サーバーレス · セキュリティ · 生成AI/エージェント
services: AWS Control Tower, Amazon Bedrock, Amazon EC2

<まとめ>
[p.4] 1.
デジタル主権とは？
2.
欧州と日本の違い
3.
AWSによる実現方法
4.
AIセキュリティ
5.
レジリエンスと透明性
6.
まとめ
Agenda
[p.42] 7. まとめ

---
## [SEC234] AWS 移行こそ 最善のセキュリティ対策である理由 ― 納得と説得のエッセンス
`AWSセッション` / 46p / セキュリティ · マイグレーション/モダナイゼーション · 組織/内製化
services: AWS Control Tower, Amazon EC2, Amazon S3

<まとめ>
[p.4] 本セッションの趣旨
4
AWS 移行は、セキュリティ強化につながる
― すでに、お気づきの方も多いはず。
本セッションは、その先― 組織を動かす材料を持ち帰っていただく場
1
「なぜ？」の言語化
AWS 移行とセキュリティ強化のつながり
2
組織の合意の作り方
言語化を組織の合意に変えるポイント
※ 特定のAWS サービスの技術解説ではありません― 各々の組織で使える言葉を持ち帰る場
[p.28] AWS の規模から得られるセキュリティ
28
60 秒ごとに
エクサバイトの
データを分析
毎日何千件もの
DDoS 攻撃を軽減
1 日あたり1,000 億件以上の
リクエストを
AWS マネージドルールで処理
50か国の100以上の都市に
またがる700以上のポイント
オブプレゼンス（POP）
最終的に「安全にブロックできる」と判断されたものは、
ネットワークスタックでブロックされます
結果、AWS 上の攻撃はそれ以外と比べて約73% 少ない
（AWS 内に展開したハニーポットとAWS 外に展開したハニーポットの比較）
28
[p.42] 4．おわりに

---
## [SEC337] ⼀歩先を⾏く︓ 効果的な脆弱性管理のためのスマート戦略
`AWSセッション` / 38p / セキュリティ
services: AWS CDK, AWS CloudFormation, AWS Lambda, AWS Organizations, AWS Systems Manager, Amazon EC2, Amazon Inspector

<まとめ>
[p.15] © 2026、 Amazon Web Services、 Inc. or its affiliates. All rights reserved.
DEMO 1 まとめ
1. コンテナイメージプッシュの瞬間、スキャンが⾃動で⾛る
2. 「何の脆弱性か」「どのイメージか」が 1 画⾯で揃い、そのまま調査に移る
ことができる
[p.36] © 2026、 Amazon Web Services、 Inc. or its affiliates. All rights reserved.
まとめ︓先を⾏く脆弱性管理とは...クラウドの速度に
対応した脆弱性管理を実現できていること
36
継続的スキャンでの
脆弱性検知
カバレッジ把握と
リソース内脆弱性の検知
開発段階で
脅威を特定

---
## [SEC351] インテリジェント運⽤︓ AI エージェントによるセキュリティ運⽤の効率化
`AWSセッション` / 57p / AI駆動開発 · セキュリティ · 生成AI/エージェント
services: AWS CDK, AWS CloudFormation, AWS CloudTrail, AWS Config, AWS DevOps Agent, AWS IAM, AWS Lambda, AWS Organizations, AWS Security Hub, AWS Systems Manager

<まとめ>
[p.30] レポート⽣成の指⽰
ここまでの調査・対処結果を
インシデントレポートとして
まとめ、PDF形式で保存して
ください。
AI エージェント の応答
プロンプト⼊⼒

---
## [SEC353] エージェンティック AI アプリの セキュリティ・UX・開発速度を同時に実現 ─ Amazon Bedrock AgentCore Identity が解決する 3つの課題
`AWSセッション` / 39p / セキュリティ · 生成AI/エージェント
services: AWS CloudTrail, AWS IAM, AgentCore, Amazon Bedrock, MCP

<まとめ>
[p.35] まとめ

---
## [STG205] ランサムウェアに対して最優先で取るべき AWS の復旧対策
`AWSセッション` / 64p / セキュリティ
services: Amazon EC2, Amazon EventBridge, Amazon FSx, Amazon GuardDuty, Amazon S3

<まとめ>
[p.4] Agenda
•
ランサムウェアとは
•
すぐに始められるランサムウェアに対する効果的な復旧対策
•
ランサムウェアに対する包括的な復旧対策
•
オンプレミス環境のランサムウェアに対する復旧対策
•
まとめ
[p.22] • Vault（データの保管庫）単位で Write Once
Read Many（WORM）保護を適用
• 複数の AWS サービスを一元的に保護可能
• 既存の Vault で有効化した場合、取得済みのバッ
クアップ（リカバリポイント）は手動削除不可と
なるが、元の保持期限が維持される点に注意
Vault Lock は AWS Backup Vault に格納されるバックアップを 変更および
削除不可能 にし、不注意やランサムウェアのような悪意のある行為から保護
AWS Backup Vault Lock
[p.61] まとめ
AWS にシステムを移行後、すぐに始められる効果的な
対策を行うことができる
万が一の AWS アカウントへのリスクに対して包括的な
対策を行うことができる
オンプレミスでのリスクをクラウドで緩和を行うこ
とができる

---
## [STG206] Amazon S3 で切り開く クラウドストレージの未来
`AWSセッション` / 56p / その他
services: AWS Glue, AWS IAM, Amazon Athena, Amazon Bedrock, Amazon CloudWatch, Amazon S3, Amazon SageMaker

<まとめ>
[p.26] Amazon
S3 Vectors
まとめ
•
ベクトルを⽤いることで、特定のテキスト
・画像・動画と関連する情報を検索できる
•
Amazon S3 Vectors により⼤量のベクトル
データをコスト効率よく保存・検索できる
[p.38] Amazon
S3 Tables
まとめ
•
Iceberg は、従来のデータレイクの課題を
解決するためにデータの持ち⽅を⼯夫
•
Amazon S3 Tables はマネージドな Iceberg
テーブルを実現できるサービス
•
データコンパクションや、Intelligent-
Tiering を通じて、コストと性能を最適化
[p.46] Amazon
S3 Express
の進化
料⾦の値下げ
最⼤ 2M/s ものリクエスト
オブジェクトのリネーム
アクセスポイント
Amazon CloudWatch メトリクス
インベントリ
M A R C H
A P R I L

---
## [STG357] Amazon S3 セキュリティベストプラクティス
`AWSセッション` / 50p / セキュリティ
services: AWS CloudTrail, AWS Config, AWS IAM, AWS Organizations, Amazon CloudFront, Amazon S3, Amazon SageMaker

<まとめ>
[p.20] S3 Access
Points
ユースケースごとに独
自のポリシーを持つバ
ケットエンドポイント
を提供する
% aws s3api list-objects-v2 ¥
--bucket sales-hrzrlukc5m36ft7okagglf3gmwluquse1b-s3alias
自動的についたアクセスポイントエイリアス名をバケットとして指定
③統制を分離してスケールする

---
## [PRT104] ソニーのスポーツ領域への新たな挑戦
`パートナーセッション` / 56p / AI駆動開発 · 生成AI/エージェント
services: AWS DevOps Agent, AWS Lambda, Amazon Bedrock, Claude, Kiro, MCP

<まとめ>
[p.23] Agenda
01
イントロダクション
Copyright 2026 Sony Biz Networks Corporation
02
AWS と GitLab を組み合わせた AI 駆動開発基盤
03
demo
04
まとめ
[p.46] まとめ
Copyright 2026 Sony Biz Networks Corporation
[p.47] まとめ
◼実装フェーズで Kiro を利用する
⚫開発フローを Skill として定義して、Kiro に実行させる
⚫コミット & MR 等、ドキュメントの品質を揃えられる
◼リポジトリ側に AI を組み込む事で、AI が生成したコードの品質を担保する
⚫脆弱性対策はもちろん、人間のコードレビューの負担を軽減できる
◼GitLab と AWS DevOps Agent は好相性
⚫アプリ実行ログ & インフラログ・設定に加えて、デプロイメントのログをソースとして利用
出来る
Copyright 2026 Sony Biz Networks Corporation
[p.48] まとめ
今後、開発ライフサイクルはますます加速する。
適応するには、AI 駆動開発の導入は必須。
Copyright 2026 Sony Biz Networks Corporation
[p.49] まとめ
この分野にご興味のある方は、ぜひ GitLab ブースへ
お越しください！
Copyright 2026 Sony Biz Networks Corporation

---
## [PRT108] 守りながら攻める －塩野義製薬流 AI 活用とガバナンスの両立術－
`パートナーセッション` / sponsor: Classmethod / 28p / セキュリティ
services: AWS Organizations, Amazon Bedrock, Claude

<冒頭>
[p.2] 1
守りながら攻める
～塩野義製薬流AI 活用とガバナンスの両立術
2026.06.25
塩野義製薬株式会社
DX推進本部データサイエンス部Generative AI グループ長
西村亮平
[p.3] 2
今しゃべってる人について
西村亮平(Nishimura, Ryohei)
塩野義製薬株式会社
DX推進本部データサイエンス部
Generative AI グループ長
2007年
某システムインテグレータ入社
(アプリケーション開発の上流工程・PM)
2013年
フリーター生活開始
(スキー場パトロール、中小企業”ひとりSE”、ASP事業者”何でも運用屋” etc.)
2018年
シオノギデジタルサイエンス入社
(全社システム/インフラの企画・導入推進)
2022年
塩野義製薬DX推進本部IT&デジタルソリューション部へ転籍
(全社システム/全社インフラの企画・導入推進・戦略管理、グループ長就任)
2024年
データサイエンス部へ異動(10.01付)
(Generative AI グループ長としてなんかやってる)
2024年10月に発足
[p.4] 3
本日のテーマ
守りながら攻める～塩野義製薬流AI 活用とガバナンスの両立術
製薬業界では厳格な規制やコンプライアンス対応が求められる一方、競争力強化
に向けたAI活用の推進も急務となっています。本セッションでは、塩野義製薬が「守
り」であるガバナンス体制の整備と、Amazon Bedrock を活用した「攻め」であるAI
の積極活用をいかに両立させてきたのかを紐解きます。リスク管理やデータガバナン
スの仕組みづくりから、現場主導でAI活用を加速させる推進施策まで、塩野義製
薬流の実践的なアプローチを具体的にご紹介。規制の厳しい業界でも攻めのDXを
実現するヒントをお届けします。
[p.5] 4
ちょっとまって。。
「守り」って何？

---
## [PRT119] 住信SBIネット銀行のビジネス成長を支える 勘定系アーキテクチャー刷新
`パートナーセッション` / sponsor: IBM / 28p / アーキテクチャ/サーバーレス · マイグレーション/モダナイゼーション
services: Amazon EC2, Amazon Q, Amazon Q Developer, Amazon RDS, Claude, MCP

<まとめ>
[p.3] ‹#›
目次：
1. 日本IBMご紹介
2. 住信SBIネット銀行のご紹介
3. 勘定系システムをクラウドシフト
4. 期待される効果
5. 勘定系システムのプロジェクト概要
6. IBMをご採用した理由
7. まとめ
[p.16] © 2026 SBI Sumishin Net Bank, Ltd.
凡例：
次期
デジタルバンク向け次世代クラウド勘定系
次期勘定系アーキテクチャ変更ポイントアプリケーションの店群分割方式の採用とAWS活用により、柔軟な拡張とインフラの構築/運用効率化を実現
現行
IBM Power Systems
IBM AIX
IBM Db2
pureScale
IBM WebSphere Application
Server Traditional
HW
サブシステム
フレームワーク
製品
OS
EAI
NEFSS（勘定系）
NEFSS Library
Java EE
AWS
システム
振分
各種取引サービス
Amazon EC2
Red Hat Enterprise Linux
IBM WebSphere Application Server Liberty
EAI
システム
振分
店群
振分
デジタルバンク向け
次世代クラウド勘定系ライブラリー
Jakarta EE
各種取引サービス
DB
Amazon
RDS for Db2
勘定系-店群1
IBM App
Connect
Enterprise
AIF
(Application
programming
interface integration
framework)
機能
DB
デジタルバンク向け
次世代クラウド勘定系ライブラリー
Jakarta EE
各種取引サービス
DB
勘定系-店群N
…
変更ポイント
Amazon
DynamoDB
マネージドデータ
ベースサービス
店群分割
クラウド化、マルチリージョン
5. 勘定系システムのプロジェクト概要
14

---
## [PRT122] AI で加速するデジタルレジリエンス - Splunk が導くデータ活用の未来
`パートナーセッション` / sponsor: Splunk / 33p / データ分析/基盤
services: AWS Security Hub, Amazon Bedrock, Amazon CloudWatch, Amazon EventBridge, Amazon GuardDuty, Amazon S3, Claude, MCP

<まとめ>
[p.25] まとめ

---
## [PRT123] パナソニック様における クラウドプラットフォームでの FinOps 推進事例のご紹介
`パートナーセッション` / sponsor: Apptio / 46p / コスト最適化/FinOps · セキュリティ
services: Amazon EC2

<まとめ>
[p.21] Copyright © Panasonic Digital Co., Ltd.
本日のアジェンダ
20
1. 会社紹介
2. FinOpsが必要となった背景、サービス立上げについて
3. グループ内での活用事例のご紹介
4. FinOpsの推進・定着化に向けた取り組み、ロードマップ
5. まとめ
[p.22] Copyright © Panasonic Digital Co., Ltd.
本日のアジェンダ
21
1. 会社紹介
2. FinOpsが必要となった背景、サービス立上げについて
3. グループ内での活用事例のご紹介
4. FinOpsの推進・定着化に向けた取り組み、ロードマップ
5. まとめ
[p.26] Copyright © Panasonic Digital Co., Ltd.
本日のアジェンダ
25
1. 会社紹介
2. FinOpsが必要となった背景、サービス立上げについて
3. グループ内での活用事例のご紹介
4. FinOpsの推進・定着化に向けた取り組み、ロードマップ
5. まとめ
[p.31] Copyright © Panasonic Digital Co., Ltd.
FinOpsサービスの立上げに向けた３つのポイント
30
①事業体制に合わせたテナント設計
②クラウドプラットフォームの提供体系に応じたプライスブック（請求ルール）設計
③サービスリリースに向けてCloudability有効性検証のため、活用事例の作成
①テナント設計
②プライスブック設計
③活用事例の作成
• 事業会社ごとのテナント設計
• クラウドCoEには各事業会社テナ
ントを払い出し
提供体系に応じたプライスブック
を設計、テナントに適用
削減額や削減率をベースに選定
Pricebook
パナソニック全体
パナソニック
• 事業会社クラウドCoEの協力
• レポート機能を活用し、最適化効果
が大きいアカウントを選定、トライ
アルに参画
HVAC&CC
株式会社
Commercial Billingで対応
提供体系
HVAC&CC
株式会社
エレクトリック
ワークス株式会社
エレクトリック
ワークス株式会社
[p.32] Copyright © Panasonic Digital Co., Ltd.
本日のアジェンダ
31
1. 会社紹介
2. FinOpsが必要となった背景、サービス立上げについて
3. グループ内での活用事例のご紹介
4. FinOpsの推進・定着化に向けた取り組み、ロードマップ
5. まとめ
[p.36] Copyright

---
## [PRT126] AI 分析基盤が拓く健康 DX と 健康経営・企業基幹業務への展開
`パートナーセッション` / sponsor: Hitachi Systems / 28p / 生成AI/エージェント
services: AWS CloudTrail, AWS Glue, AWS IAM, Amazon Athena, Amazon Bedrock, Amazon CloudWatch, Amazon S3, Claude

<まとめ>
[p.9] © Hitachi systems, Ltd. 2026. All rights reserved.
３．200万件RWDを用いた生成AI分析基盤（1/2）
神奈川県実証事例
8
技術・運用のポイント
※Amazon S3、AWS Glue、Amazon BedrockはAmazon.com, Inc. またはその関連会社の商標です。
3省2ガイドライン準拠（要配慮個人情報）
AWSネイティブ構成
•
Amazon Simple Storage Service（データレイク）
•
Amazon Athena / AWS Glue（分析）
•
Amazon Cognito（ID・権限制御）
•
Amazon Bedrock（生成AI）
•
セキュアかつスケーラブルな公共利用前提
セキュアかつスケーラブルな公共利用前提
「自治体で実証され、
実際に現場で使える
AI基盤」を確立
[p.11] © Hitachi systems, Ltd. 2026. All rights reserved.
４．「再利用可能な基盤」としての拡張（2/2）
生成AI分析基盤
10
ポイントは「業務ではなく、基盤を作った」こと
この基盤は健康専用ではない
本質は以下の共通アーキテクチャー
共通アーキテクチャー要素
本基盤は、一般的な業務支援AIを利用するのではなく、業務ルール・説明責任・データ特性を前提に、
エージェント設計・プロンプト・RAG構成を用途別に制御しています。
•
Amazon Bedrock（RAG構成）
•
Amazon Bedrock Agents
•
Amazon Cognito / AWS IAM
•
Amazon CloudWatch / AWS CloudTrail
•
Amazon S3 / AWS Glue
•
Amazon Bedrock
[p.24] © Hitachi systems, Ltd. 2026. All rights reserved.
講演内容
23
10．まとめ
3つのポイント
1. 自治体200万件RWDで実証済みのAI基盤
2. 再利用可能な基盤として企業・住民・会計へ展開
3. AWSを基盤としたパートナーエコシステムの活用により
社会実装を加速

---
## [PRT128] クラウドと AI で創る製造業の未来 －コニカミノルタ × ＦＰＴの挑戦－
`パートナーセッション` / sponsor: FPT / 50p / 生成AI/エージェント
services: AWS Glue, AWS Lambda, AWS Step Functions, Amazon Athena, Amazon Bedrock, Amazon Kinesis, Amazon OpenSearch, Amazon Q, Amazon Redshift, Amazon S3

<まとめ>
[p.21] Copyright © 2026 FPT Software All rights reserved.
人の業務の構造化
20
業務コンテキスト層
業務プロセス層
知識・ルール層
データ層
業務目的・KPI、役割・責任、判断基準
業務フロー、タスク分解、意思決定ポイント、例外対応
業務ルール、社内ポリシー、判断ロジック、業界知識
構造化・非構造化、リアルタイム、外部 データ
人の判断構造を
4層に分解して再構築しAIへ入力
20
Copyright © 2026 FPT Software All rights reserved.

---
## [PRT129] 好きや経験が資産になる AI × オンチェーンが実現する未来
`パートナーセッション` / sponsor: Simplex / 30p / その他
services: AgentCore, Amazon Bedrock, MCP

<冒頭>
[p.2] © 2024 Simplex, Inc.
© 2026 Simplex Inc.
AWS Summit Japan 2026
「AI×オンチェーンが実現する未来」
2026/6/26
シンプレクス株式会社
[p.3] © 2026 Simplex Inc.
2
自己紹介
シンプレクス株式会社エグゼクティブプリンシパル
三浦和夫（みうらかずお）
•
Simplex Dealing Cloud（FX・暗号資産）プロダクトマネージャー
•
web3事業領域（暗号資産・ST・Stablecoin・トークンエコノミー）リード
2010/04
新卒でシンプレクスへ入社
2011/3〜2012/7
エンジニアとして次世代FXディーリングシステムを開発
<ディーリング>
2012/8〜
複数の金融機関へのFXディーリングシステム導入を経験
2018/1〜
暗号資産交換所向けのディーリングシステム提供を開始
2020/4〜
Simplex Dealing Cloud（SaaS事業）の立ち上げ
<web3>
2018/4〜
ブロックチェーンR&Dを開始
2020/6〜
証券業DXを目指すSTソリューションの提供を開始
2022/4〜
ブロックチェーン技術を軸に、GameFi, DePINなど新しい領域へ
2025/6〜
Simplex Stablecoin の提供を開始
[p.4] © 2026 Simplex Inc.
3
1. 会社紹介
2. 本日のテーマ
• 未来にどんな変化が起きるか
• 今何をすべきか
アジェンダ
[p.5] © 2026 Simplex Inc.
4
あらゆる業界のビジネス成功を目的に、金融機関のコア業務を支えるミッションクリティカルなシステム構築で培ったテクノロジーで、DXの最前
線をプロアクティブに支援します。
会社紹介
社名
シンプレクス株式会社
持株会社：シンプレクス・ホールディングス株式会社（東京証券取引所プライム上場）
事業概要
金融機関の収益業務に関わるシステム・ソリューションの提供
• 業務コンサルティング
• システムコンサルティング
• システム開発
• 保守・運用
• パッケージシステム販売
• ASPサービス提供
等
代表取締役社長
金子 英樹
創業年月日
1997年9月16日
資本金
4,750 百万円
連結従業員数
2,121名（2026年4月1日現在）
売上(2025年3月期)
587億円
グループ会社
シンプレクス・ホールディングス株式会社
Deep Percept株式会社
Xspear Consulting株

---
## [PRT130] サービスを止めずに実現する AWS セキュリティ最適化 －後から「セキュリティ バイ デザイン」を実現するための 段階的アプローチ－
`パートナーセッション` / sponsor: HEARTBEATS / 52p / セキュリティ
services: AWS CloudTrail, AWS IAM, AWS Lambda, AWS Organizations, AWS Security Hub, Amazon Bedrock, Amazon EC2, Amazon ECS, Amazon EKS, Amazon EventBridge

<まとめ>
[p.7] Operation Lab
運用設計ラボ
6
アジェンダ
1.「セキュリティ バイ デザイン」という考え方
2. AWS環境における「セキュリティ バイ デザイン」の段階的アプローチ
3. 段階的アプローチの勘所
まとめ
[p.37] Operation Lab
運用設計ラボ
まとめ
36
[p.38] Operation Lab
運用設計ラボ
37
侵害の検知・対応・復旧
侵害されない⼯夫・予防
事後的
事前的
まとめ
AWSのセキュリティサービスとベストプラクティスに準拠してしまうのが
最も費用対効果が良く、すぐに導入できる。
AWS環境で'セキュリティ バイ デザイン'を始める
Step1 セグメント化
段階的アプローチ
Step2 脅威把握
Step3 対応策選択
Step4 優先順位決定
Step5 再設計・実装
セグメント化 (例)
2つの観点によるアプローチ
認証
認可
データー/ストレー
ジ
証跡
コンピューティング
ネットワーク
アプリケーション
脆弱性検査
脅威検知
認証認可レイヤ
ー
基盤レイヤー
ノードレイヤー
アプリレイヤー
など
など
サービスを止めずに実現するAWSセキュリティ最適化
[p.49] まとめ
「可視化」から⼩さく始める
AWS Security Hub等で現状の⽳を把握することが、優先順位付けと社内合意の第⼀歩。
ツールと「運⽤体制」はセットで
アラートの解釈と判断ができなければ形骸化する。「誰が‧どう対応するか」運⽤フローも含めて設計する。
いまある課題に応じて、柔軟に段階的強化が可能
企業ごとの状況に合わせて、着⼿点を変えながら段階的に強化を広げられる。

---
## [PRT141] 165 日から 30 分へ：JAL デジタルが敷いた 「開発者専用の滑走路」 －認知負荷をゼロにする Platform Engineering 実践記－
`パートナーセッション` / sponsor: Red Hat / 20p / 組織/内製化
services: AWS Lambda, Amazon API Gateway, Amazon DynamoDB, Amazon EC2, Amazon ECS, Amazon EventBridge

<冒頭>
[p.2] 165日から30分へ
JALデジタルが敷いた「開発者専用の滑走路」
認知負荷をゼロにするPlatform Engineering 実践記
JALデジタル株式会社
デジタルデリバリー部マイルライフグループ
チーフ
大用拓也
レッドハット株式会社
技術営業本部製造流通サービス事業部
シニアソリューションアーキテクト
大塚
洋
[p.3] 本日お話しすること
１
Platform Engineering チーム発足の背景
165日の開発リードタイム/ 40種の申請書ーなぜ滑走路が必要だったのか
２
開発者ポータル提供への挑戦と突破
技術/ 組織/ 文化のすべてを変えた開発者ポータル提供の舞台裏
３
Platform Engineering チームへの伴走
Red Hat による伴走型支援で円滑な推進を実現
４
本日持ち帰ってもらいたい​3つのこと
明日から動き出す3ステップ
[p.4] 会社紹介/ 自己紹介
大用拓也(だいようたくや)
デジタルデリバリー部マイルライフグループ
チーフ
経歴：
2020 JALインフォテック（現JALデジタル）入社
2020 ～2022 アプリケーション基盤構築担当
2022 ～2026 旅客系アプリケーション開発担当
2026 ～顧客系アプリケーション開発担当
2025 ～Platform Engineering活動参画
好きなAWSサービス：
Amazon EventBridge
AWS Lambda
JALデジタル株式会社（通称: JALDX）
会社概要：
JALグループのデジタル中核会社として、お客さまの夢を叶
えるデジタルサービスを創造し、研鑽を積んだデジタル技
術で企業価値を高め社会に貢献しています。
ミッション：
「人と技術の力で「世界」をつなぎ誰もが満たされる社会
を創ります」
事業紹介：
ソリューション・サービス、システム運用・保守、フィー
ルドIT サービス、システム開発、ITコンサル
参考：JAL Digital：(https://www.jaldx.co.jp/)
[p.5] 会社紹介/ 自己紹介
大塚洋(おおつかひろし)
技術営業本部製造流通サービス事業部
シニアソリューションアーキテクト
経歴：
IT・通信キャリアのインフラ領域を中心にサポート・構築
・開発・営業経験を経た後、2022年4月にRed Hat に入社
し、エンタープライズのお客様を担当するソリューション
アーキテクトを担当。
Edge ソリューションやPlatform Engineering の活動を世
の中に広められるように日々奮

---
## [PRT143] 実用的なワーク AI： エンタープライズコンテキストを エージェントの優位性へと変える
`パートナーセッション` / sponsor: Glean / 27p / セキュリティ
services: Claude, MCP

<冒頭>
[p.2] 実用的なワーク AI：
エンタープライズコンテキストをエー
ジェントの優位性へと変える
AWS Summit Japan 2026
[p.3] 2
Glean Technologies, Inc
Gleanの目標は、AIがエンタープライズを完全に理解できるようにすることです。
会社名：
Glean Technologies Inc.
設立:
2019年1月
代表的なお客様:
8
平均クエリー数/ユーザー/日
Best-in-class の普及率
45%
(一般的なSaaS 1020%
1億+
年間の エージェント 実行数
2.5x
前年比 売上成長率
Best-in-class の成長率
概要
10億
今年度末のエージェント 実行
見込み数
DAU/MAU
ARR 3億ドル
450億円)
200M ARR到達から約5ヶ月
80%
以上のお客様が全社横断的に展
開。5部門+に導入
Arvind Jain,
CEO
Co-founder of
Rubrik
Distinguished
Eng, Google
Vish T.R.
Tech Lead,
Platform &
Newsfeed, Meta
Tony
Gentilcore
Senior Staff
Engineer,
Google /
Chrome
$ARR
堅牢なセキュリティ基盤
HIPPA Compliant
GDPR Compliant
SOC2 Type Ⅱ
Certiﬁed
ISO 27001 Certiﬁed
ISO 42001 Certiﬁed
AI管理システム（AIMS）に
関する世界初の国際規格であり、
AIの責任ある開発・運用・利用の
ためのガバナンス体制を保証しま
す。
TX-RAMP Level 2
Certiﬁed
[p.4] Conﬁdential | © 2026 Glean Technologies, Inc.
Gleanの目標は、AIが
エンタープライズ
を完全に理解できるように
することです
[p.5] Work AI Platform: Gleanでできること
+
ドキュメントを見つける
+
メッセージを見つける
+
人を見つける
+
内容をサマリーする
Find information
Glean Search
Automate business
Glean Agents
Get insight
Glean Assistant
+
回答を見つける
+
データを分析する
+
コンテンツを作る
+
MTGを記録する
+
プロアクティブに提案する
+

---
## [PRT201] 自律型 AI エージェントが再定義する企業活動
`パートナーセッション` / sponsor: NTT DATA / 36p / データ分析/基盤 · 生成AI/エージェント
services: AWS CloudTrail, AWS Config, AWS IAM, AgentCore, Amazon Aurora, Amazon Bedrock, Amazon CloudWatch, Amazon ECS, Amazon Neptune, Amazon Nova

<まとめ>
[p.4] © 2026 NTT DATA Japan Corporation
3
Introduction
1. お客様との生成AI取組事例
2. 当社における生成AI活用
3. 生成AI活用におけるポイント
Agenda
[p.28] © 2026 NTT DATA Japan Corporation
27
3
生成AI活用におけるポイント

---
## [PRT202] 三井住友信託銀行に学ぶ FinOps 「実現できるコスト最適化」
`パートナーセッション` / sponsor: SCSK / 36p / コスト最適化/FinOps
services: AWS Lambda, AWS Systems Manager, Amazon EC2, Amazon EventBridge, Amazon Q, Amazon RDS, Claude

<まとめ>
[p.25] 24
一定期間利用のないAmazon Workspacesを自動で検知・削除する機能を実装
実装には、Amazon EventBridge + AWS Lambdaを利用
対応概要
日次で検知・削除処理を実行
過去30日以上利用されていない場合は、強制的に自動削除
運用ポイント
2.AWSリソースの最適化を図りコスト削減に繋げる施策
⑥ 不要Amazon Workspacesの自動検知・削除運用
コスト最適化施策の概要
[p.27] 26
まとめ
クイック戦略のポイント
完璧主義を排除し、まずは
できる事からやってしまう。
どこの現場でも共通する
ベストプラクティスがある
ので、ベストプラクティス
の実践からスタート
❶
❷
コスト情報は可視化し、利
用者がいつでも見る事が
できる状態に
❸
経営層にコスト最適化施
策をコミットし、推進の後
ろ盾になって頂く
❹
自社のAWS運用を把握し
ていチームやメンバーをコ
スト最適化の主体とする
❺
コスト最適化を継続してい
く体制を作り、定期的な評
価、見直しを実施

---
## [PRT203] いよいよ本格業務活用へ －NRI が示すエンタープライズ生成 AI 実践基盤－
`パートナーセッション` / sponsor: NRI / 26p / セキュリティ · 機械学習/MLOps · 生成AI/エージェント
services: AWS Lambda, AWS WAF, AgentCore, Amazon API Gateway, Amazon Aurora, Amazon Bedrock, Amazon CloudFront, Claude, Inferentia, MCP

<冒頭>
[p.2] いよいよ本格業務活用へ
- NRIが示すエンタープライズ生成AI実践基盤-
AWS Summit Tokyo 2026
2026-06-25
株式会社野村総合研究所
AXイノベーションセンター
AIソリューション推進部
北村
雄騎
[p.3] 1
Copyright（C）Nomura Research Institute, Ltd. All rights reserved.
ITとコンサルティングの両面から、エンタープライズ生成AIの実装を業界横断で支援
はじめに｜NRIの生成AIに関する取り組み
お客様
様々な角度からAI活用をご支援
事業課題
（既存業務改革／ビジネスモデル変革）
金融/産業部門
コンサルティング部門
NRIセキュア
(セキュリティ専門グループ会社)
R&D
セキュリティ設計
コンサルティング
業務/システム設計および開発
運用構築
◼生成AIを活用した経営改革支援
「AIコンサルティング」サービス
◼長年にわたり蓄積した業務/システム知識
を踏まえた最適なAI活用提案
◼最新技術評価/獲得
◼モデルチューニング・カスタマイズ
◼「AI tech lab.」で先端技術獲得
環境構築
◼MLOps/LLMOps
(機械学習、大規模言語モ
デル運用の適用)
◼AIのビジネス活用に係るセキュリティ検
討の包括的支援「Security for AI」
◼クラウド環境構築および
周辺AIサービス実装
◼Private LLM環境の提供
画像解析
音声認識
自然言語処理
アナリティクス
LLMモデル
クラウド
ロボティクス
セキュリティ
全社AI
CoE
全
社
横
断
で
の
情
報
集
約
・
共
有
NRI
業務
基盤
基礎
技術
基盤/運用部門
戦略
◼基礎技術の業務活用を推進する「NRI Solution Ai」
[p.4] 2
Copyright（C）Nomura Research Institute, Ltd. All rights reserved.
はじめに｜NRIの生成AIに関する取り組み
2013年に日本で初めて認定されて以降、AWS プレミアティアサービスパートナーとして活動を継続
2024年3月には、日本初の「AWS 生成AIコンピテンシー」に認定
野村総合研究所（NRI）は、「AWS プレミアティアサービスパート
ナー」です。多数の顧客エンゲージメントや幅広い経験、顧客との
フィードバックやサクセスストーリーの収集を通じて、2013年に日本
で初めて認定されて以降、13年連続で「AWS プレミアティアサービス
パー

---
## [PRT205] 日産自動車 × デロイト トーマツ： Kiro CLI によるコネクティッドカーサービス 基盤開発の加速
`パートナーセッション` / sponsor: Deloitte / 22p / AI駆動開発 · アーキテクチャ/サーバーレス
services: AWS CloudFormation, AWS Lambda, AWS Security Hub, AWS WAF, Amazon API Gateway, Amazon CloudWatch, Amazon DynamoDB, Amazon EC2, Amazon EventBridge, Amazon GuardDuty

<冒頭>
[p.2] 日産自動車× デロイトトーマツ：
Kiro CLIによる
コネクティッドカーサービス基盤開発の加速
合同会社デロイトトーマツ
松本祐樹
日産自動車株式会社
赤坂亮介
[p.3] 登壇者のご紹介
Part 1: Nissanが目指すConnected Car ServiceとService Platform
日産自動車株式会社
赤坂亮介
Part 2: SPFのアーキテクチャとKiro CLI
合同会社デロイトトーマツ
松本祐樹
目次
[p.4] © 2026. For information, contact Deloitte Tohmatsu Group.
3
Part 1: Nissanが目指すConnected Car ServiceとService Platform
[p.5] 4
Nissan Connect Serviceとは

---
## [PRT206] 三井住友トラスト・アセットマネジメントが Snowflake と実現する、AI エージェントを フル活用した業務改革
`パートナーセッション` / sponsor: Snowflake / 34p / データ分析/基盤 · 生成AI/エージェント
services: AWS Fargate, AWS Glue, AWS Lambda, Amazon Bedrock, Amazon DynamoDB, Amazon ECS, Amazon EKS, Amazon Q, Amazon RDS, Amazon S3

<まとめ>
[p.10] 9
本⽇のアジェンダ
1.Agentic AIとは︖― なぜ今注⽬されているのか
2.Agentic AIを⽀える「ビジネスナレッジ・データ」とSnowflakeでの表現
3.当社での取組
4.まとめ
[p.30] © 2026 Snowflake Inc. All Rights Reserved
まとめ
Section 4
[p.31] 30
まとめ
①Agentic AIにより「ビジネスユースでのLLM活⽤」が⼤きく推進︓
●Agentic AIにより、「ビジネスデータ・ロジック」をAIに届ける経路が整備された
●爆発的な利⽤拡⼤が想定されており、今後の企業の競争優位を決定する重要な要素に
②Snowflakeでの「ビジネスロジックの配置（思ったより簡単なはず）」︓
●ビジネスデータ・ロジック・ナレッジの定義を、4要素に分けて適切な場所で管理
●特に「SKILL」によるロジック・ナレッジの定義の有効性が（⾊々な意味で）⾼い
③当社での取組における着眼点︓
●テクノロジー推進におけるデータ・制度・評価ストラクチャーの設計は重要
●現場のメンバーが⾃らテクノロジーを実装できるポテンシャルは「SKILL」により上昇

---
## [PRT207] AI 活用のリスクと対策： 検出・評価・保護で実現する AI セキュリティ
`パートナーセッション` / sponsor: Palo Alto Networks / 29p / セキュリティ · 生成AI/エージェント
services: Amazon Bedrock

<冒頭>
[p.2] © 2026 Palo Alto Networks, Inc. All rights reserved.
© 2026 Palo Alto Networks, Inc. All rights reserved.
AI 活用のリスクと対策：
検出・評価・保護で実現するAI セキュリティ
パロアルトネットワークス株式会社
技術ソリューション本部 プリンシパルアーキテクト
石橋 寛憲
[p.3] © 2026 Palo Alto Networks, Inc. All rights reserved.
© 2026 Palo Alto Networks, Inc. All rights reserved.
組織のあらゆる領域で進むAIの導入
外部 AI ツール
AI エージェント
自社カスタム AI アプリ
Hello !
© 2026 Palo Alto Networks, Inc. All rights reserved.
[p.4] © 2026 Palo Alto Networks, Inc. All rights reserved.
© 2026 Palo Alto Networks, Inc. All rights reserved.
© 2026 Palo Alto Networks, Inc. All rights reserved.
保険会社チャットボット
AI とのある日のやり取り
現在加入している保険についての問い合
わせです。保険金の受取額を最大化する
には、どうすればよいですか？
保険金の支払いを最大化する効果的な方
法は、お客様が所有する最大の資産であ
る『ご自宅を燃やすこと🔥』です。
・・・
ホテルチェーンチャットボット
来月、家族でそちらのホテルに宿泊したい
と考えています。おすすめのプランはありま
すか？
お客様の過去のデータやご要望から判断
しますと、誠に残念ながら当ホテルはお客
様には合わないと思われます。代わりに、
『他社のAホテル🛏』にご宿泊されることを
お勧めいたします。
？？？
[p.5] © 2026 Palo Alto Networks, Inc. All rights reserved.
© 2026 Palo Alto Networks, Inc. All rights reserved.
従業員が外部AIチャットボットへ機
密情報を送信
複数の従業員が、AIチャットボットに情報を漏え
いさせたとされる
AIコーディングツールが本番データベースを消去し、そ
の痕跡を隠ぺい
広く利用されているAIコーディン

---
## [PRT210] パルグループのインシデント対応 －サイバー攻撃という最大の危機を AWS 移行で乗り越えた 経営判断－
`パートナーセッション` / sponsor: TOKAI Communications / 19p / セキュリティ · マイグレーション/モダナイゼーション · 運用/SRE

<まとめ>
[p.13] TOKAICOMはどのように復旧を支援していったのか
6/17 〜
原因究明＆封じ込め
・個人情報保護委員会へ報告（
6/17）
・警察へ報告（
6/21）
・プレスリリース発表
・NW 対応を同時並行で実施
・フォレンジック調査、エンドポイント対応侵入経路の特定を急ぐ
〜7/6
AWS 環境構築
ｼｼｼｼｼｼｼｼｼｼへ環境引渡
TOKAICOM によるAWS環境整備
短期間で構築を行い、システム
ベンダーへ引き渡しを行いました。
7/22 〜8/2
全端末の再設定
マルウェア感染の恐れがある全PCの
再キッティングと安全確認を実施し、
システム接続の準備を整えました。
8/5
新環境の公開
販売管理ｼｼｼｼ再稼働
6/16
インシデント発生
調査、システム検証、
経営層への説明資料作成。
販売管理システム、POSシステム、
RFIDサーバ、ADサーバを含む
重要システムを同時公開
Step1
AWS環境整備
Step2
業務復旧
Step3
セキュリティ強化
Step4
DR対策・復旧訓練
12
[p.14] まとめ
予防・検知
復旧
継続的運用
・最小権限の原則としてきめ細やかな管理
IAM、MFA、KMSなど
・操作範囲、影響範囲の隔離
Security Group、WAF、NW FWなど
・全操作ログの取得、不可逆な監査ログの取得など
CloudTrail、Guard Duty, Security Hub、Control Tower, Configなど
・バックアップデータがイミュータブルであること
S3 object lock、Backup Vault lockなど
・リストア環境
Multi-AZなど壊された後にも迅速に戻せる環境
・復旧テストと継続改善サイクル
教育、訓練、インシデント発生時のフローの明確化
・運用フェーズでの継続対策
構成変更の監査、自動チェック
13
[p.15] まとめ
AWSは侵入を前提に予防・検知、復旧に対応するサービスが
揃っている
1
「侵入を完全に防ぐことはできない」を前提に、侵入されても
被害を抑制し、確実に復旧できる状態が作れていることが重要
2
インシデント対策は、特定の準備をすれば完了ではなく
継続的な運用が最も重要
3
14

---
## [PRT211] なぜあなたの運用は AI で楽にならないのか
`パートナーセッション` / sponsor: PagerDuty / 47p / 運用/SRE
services: Amazon CloudWatch

<冒頭>
[p.2] ななななななななな
AI ななななななななな
PagerDuty
Product Evangelist
Kazuto Kusama @jacopen
[p.3] Kazuto Kusama
@jacopen
Product Evangelist
@PagerDuty
理事
@一般社団法人SREコネクト
代表理事
@一般社団法人クラウドネイティブイノベーターズ協会
[p.4] 2025年
AIエージェント元年
[p.5] AIエージェントによって激変した開発
ななな
AIななななななななななななななな
コーディング作業の大半を代行してくれることに
より、アプリケーション開発が格段に高速化。
なななななななななな
開発に必要な人数が減少、少数精鋭によるチーム
構成に。AIに適切な指示を下せる2, 3人のチーム
が最適と言われる時代に
なななななな
知識を持つ人に限られていたアプリケーション開
発が、非エンジニアまで拡大

---
## [PRT212] 既存 DB の限界を突破、秒間 10 億件を処理し、 AI と共創するデータ基盤の新標準
`パートナーセッション` / sponsor: ClickHouse / 30p / データ分析/基盤
services: Amazon Aurora, Amazon EC2, Amazon EKS, Amazon Kinesis, Amazon RDS, Amazon S3, Claude, MCP

<冒頭>
[p.2] ©2026 CLICKHOUSE INC., CONFIDENTIAL & PROPRIETARY
既存DBの限界を突破
秒間10億件を処理し
AIと共創するデータ基盤の新標準
2026.06.25
ClickHouse株式会社
北迫 清訓
The Leading Database for AI
[p.3] ©2026 CLICKHOUSE INC., CONFIDENTIAL & PROPRIETARY
2
自己紹介
北迫  清訓
(きたさこ きよのり)
外資系ITコンサルを経て、2012年よりパブリッククラウドベンダーにて日本における
クラウドの立ち上げを初期メンバーとして牽引。
デジタル領域のクラウド普及や音声AIサービスの立ち上げ、戦略的企業のDX支援を
歴任した後、現在はClickHouseの技術統括として、AI時代に求められる次世代デー
タ基盤の普及とデータ戦略の高度化を推進。
[p.4] ©2026 CLICKHOUSE INC., CONFIDENTIAL & PROPRIETARY
©2026 CLICKHOUSE INC., CONFIDENTIAL & PROPRIETARY
3
AI Era
データベースが遅ければ
AIは止まる
●
AIエージェントは１つの問いに答えるために、数十から数百のクエリ
を並列で発行する。
●
その全てにミリ秒で応答できなければ、どれだけ優れたモデルを利
用していてもワークフローは止まる。
[p.5] ©2026 CLICKHOUSE INC., CONFIDENTIAL & PROPRIETARY
©2026 CLICKHOUSE INC., CONFIDENTIAL & PROPRIETARY
4
データプラットフォーム市場を塗り替える3つのシフト
AIによるデータプラットフォームニーズの変化
アプリのエージェント化
分析インターフェースの会話化
オブザーバビリティのAI駆動化
●AIエージェントが内部で数十〜数百のクエリを並列実行
→ アクセスパターンが動的・予測不能に
静的に最適化された専用DBでは対応できない
●Text-to-SQLにより、1つの問いが数十のクエリを生成
→ 「誰が・いつ・どのデータに」が予測不能に
事前設計の前提が崩れる
●AIが能動的に異常を検知・収集・要約するAI SREへ
→ AIが自律的にデータを探索する
静的ダッシュボードを前提とした基盤では機能しない

---
## [PRT213] AI 駆動開発 × セキュアな医療インフラ －技術が叶える、データの民主化－
`パートナーセッション` / sponsor: KDDI iret / 41p / AI駆動開発
services: AWS DevOps Agent, AWS Lambda, AWS WAF, Amazon Bedrock, Amazon CloudWatch, Amazon DynamoDB, Amazon EventBridge, Amazon S3, Amazon SQS, Claude

<まとめ>
[p.34] 本日のまとめ

---
## [PRT215] まだ人力？！ 生成 AI を使った クラウド運用作業効率化を始めよう！ 生成 AIを使ってクラウド・ガバメントクラウドの 運用を楽にしませんか？
`パートナーセッション` / sponsor: NEC / 29p / セキュリティ · 生成AI/エージェント · 運用/SRE
services: AWS Direct Connect, AWS Lambda, AWS Security Hub, Amazon Bedrock, Amazon DynamoDB, Amazon S3, Amazon SNS, Claude, MCP

<まとめ>
[p.27] © NEC Corporation 2026
26
© NEC Corporation 2026
26
SUMMARY
まとめ- 運用の現場を生成AIで変えよう -
1
運用の「定型業務」の手間を減らし、本当に必要な「非定型業務」に集中する
定型業務効率化の例として、情報収集・アラート対応・改善活動の3領域をご紹介
2
ガバメントクラウドでも生成AIは活用できる
3条件を満たすサービス選定が出発点
3
受け身から、問いかける運用へ
通常ブラウザ型・分離型のLLM/ＭＣＰチャットで、誰でもプロアクティブな運用を！

---
## [PRT216] 生成 AI × MCP で切り拓く次世代 SRE！ 自律型運用への挑戦と開発者体験の進化
`パートナーセッション` / sponsor: New Relic / 56p / 生成AI/エージェント · 運用/SRE
services: AWS DevOps Agent, AgentCore, MCP

<まとめ>
[p.52] #AWSSummit #PRT216-S
まとめ
5

---
## [PRT217] セキュアクラウド環境での 音声基盤を提供する Notta －次なる業務効率化の進化－
`パートナーセッション` / sponsor: Notta / 27p / アーキテクチャ/サーバーレス · セキュリティ · 生成AI/エージェント
services: AWS Direct Connect, AWS Lambda, AWS Step Functions, AgentCore, Amazon API Gateway, Amazon Aurora, Amazon Bedrock, Amazon CloudWatch, Amazon DynamoDB, Amazon S3

<まとめ>
[p.23] SECTION
06
AWS Summit Japan 2026
まとめ & 今後の展望
セキュリティ‧スケーラビリティ‧拡張性の三位⼀体
で、実⽤的な業務⾃動化を実現する
[p.24] 06 · アーキテクチャの要点
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

---
## [PRT218] 対話が業務を動かす時代へ －会話を起点にした業務再設計と AI 活用－
`パートナーセッション` / sponsor: FUJI SOFT / 27p / データ分析/基盤 · 生成AI/エージェント
services: AWS Lambda, AgentCore, Amazon Bedrock, Amazon DynamoDB, Amazon S3, Claude, MCP

<まとめ>
[p.7] 01
AIエージェント活用の現在地と
アーキテクチャのベストプラクティス
02
次世代インターフェイス
03
実例紹介
04
まとめ
5
©FUJISOFT INCORPORATED, All rights reserved. |
アジェンダ
[p.24] 04
まとめ
22
©FUJISOFT INCORPORATED, All rights reserved. |
[p.25] 本日のまとめ
23
©FUJISOFT INCORPORATED, All rights reserved. |
比較項目
従来のAIエージェント活用
次世代AIエージェント活用（対話）
物理的制約
画面に向かってテキスト入力が可
能な状況
手が離せない、長文を打てない現場
でも活用可能
インプット情報の質
人が無駄と判断した情報が削ぎ落
され、整理された情報
ありのままの、リアルでより自然な
情報
ユーザ―体験
入力が「作業」になる
対話が「業務」を動かす
マルチタスク性
テキスト入力にリソースを割く必
要がある
作業とAIへの説明を並行実施可能
①巨大な1つのAIエージェントではなく、AWSサービスを組み合わせたマルチエージェント
②目的に応じたAI資産の「再利用」
③「対話」という次世代インターフェイス
AIエージェント活用のポイント

---
## [PRT220] 【デモで実演】新時代に迫る脅威！ －生成 AI への脅威事例と AI Security について－
`パートナーセッション` / sponsor: Trend Micro / 43p / セキュリティ · 生成AI/エージェント
services: AWS CloudTrail, AWS Direct Connect, AWS Outposts, AgentCore, Amazon Bedrock, Amazon DynamoDB, Amazon EC2, Amazon ECS, Amazon EKS, Amazon RDS

<まとめ>
[p.11] 10
AI環境全体を守り続けるための設計図：Blueprint
特定
発見とリスク評価
保護
セキュアな
AIの利用と開発
検知
AIを活用した自動検知
対応
自立型エージェント
による対応
AIワークスペースの利用
従業員
開発者
AIエージェント／AIアプリ
（エンドポイント）
▼
社内／パブリックAIサービス
LLMアプリ、Embedded Copilot、
エンタープライズエージェントなど
お客様のAIアプリケーションスタック
AI データ
ナレッジ、RAG、メモリ
生成AI／
エージェント型AIアプリ
（LLM、AIエージェント、MCP）
AI ワークロード
Kubernetes、コンテナ
AIインフラストラクチャ
オンプレミス、プライベートクラウド、
パブリッククラウド、AIファクトリー
[p.12] 11
AIサービス利用環境のセキュリティ
特定
発見とリスク評価
保護
セキュアな
AIの利用と開発
検知
AIを活用した自動検知
対応
自立型エージェント
による対応
AIワークスペースの利用
従業員
開発者
AIエージェント／AIアプリ
（エンドポイント）
▼
社内／パブリックAIサービス
LLMアプリ、Embedded Copilot、
エンタープライズエージェントなど
お客様のAIアプリケーションスタック
AI データ
ナレッジ、RAG、メモリ
生成AI／
エージェント型AIアプリ
（LLM、AIエージェント、MCP）
AI ワークロード
Kubernetes、コンテナ
AIインフラストラクチャ
オンプレミス、プライベートクラウド、
パブリッククラウド、AIファクトリー
[p.19] 18
AI開発環境のセキュリティ
特定
発見とリスク評価
保護
セキュアな
AIの利用と開発
検知
AIを活用した自動検知
対応
自立型エージェント
による対応
AIワークスペースの利用
従業員
開発者
AIエージェント／AIアプリ
（エンドポイント）
▼
社内／パブリックAIサービス
LLMアプリ、Embedded Copilot、
エンタープライズエージェントなど
お客様のAIアプリケーションスタック
AI データ
ナレッジ、RAG、メモリ
生成AI／
エージェント型AIアプリ
（LLM、AIエージェント、MCP）
AI ワークロード
Kubernetes、コンテナ
AIインフラストラクチャ
オンプレミス、プライベートクラウド、
パブリッククラウド、AIファクトリー
[p.25] 24
24
自社AIアプリをスキャンする
注意：スキャン先は、フロ

---
## [PRT221] 国民皆保険を支える FinOps 2.0 －国民健康保険中央会が実践するデータ × AI による コスト最適化戦略－
`パートナーセッション` / sponsor: NHN Techorus / 58p / コスト最適化/FinOps · 生成AI/エージェント
services: Claude, Kiro, MCP

<まとめ>
[p.10] クラウドコストの削減余地
・クラウド支出の管理を課題とする企業
が85%、企業の最大の懸念事項へ
・自己申告によるクラウド支出の無駄は
2025 年調査時の 27% から 2 ポイント
アップの29% へ
参考：Flexera State of the Cloud Report
[p.36] コスト最適化における内製化を阻む障壁
コスト最適化を内製で実現するまでの道のり
重要視したポイント
開発段階からコストを想定したベンダー・リセラー選定を実施
提案内容に加えランニングコストに関しても入札時に考慮
開発段階のコストに対し、現状どうなっているのかを日次で確認
コスト削減ではなく、コストの実態を把握することを重要視
こうした障壁をクリアするため、内製化前提のコスト最適化に向けたプロジェクト
体制作りがスタート。

---
## [PRT224] エンタープライズ AI の最適解： Amazon Bedrock での Claude を Boomi で加速させる、 安全でスケーラブルな AI 活用基盤
`パートナーセッション` / sponsor: Boomi / 20p / 生成AI/エージェント
services: Amazon Bedrock, Claude, MCP

<まとめ>
[p.18] Copyright © 2026 Boomi, LP またはその関連会社。
無断転載・複製を禁じます。
Copyright © 2026 Boomi, LP or its affiliates.
All rights reserved.
エンタープライズAIを成功に導く「3つの鍵」
まとめ
AIの真価は
「統合」
で決まる
既存資産が
AIの「武器」
になる
エンタープラ
イズ水準の
「信頼」

---
## [PRT225] Amazon Bedrock で挑む AI 監修による 日本発 IP 事業のスケール
`パートナーセッション` / sponsor: Accenture / 16p / 生成AI/エージェント
services: AWS Fargate, AWS Lambda, AWS Transit Gateway, Amazon API Gateway, Amazon Bedrock, Amazon EKS, Amazon S3, Claude

<冒頭>
[p.3] Confidential
18.8％
営業利益率
10.4％
ROE
1932年
創業年
55社
※26年5月時点
※
グループ会社数
4,088名
従業員数（連結）
3,606億円
売上高
映画事業
不動産事業
演劇事業
IP・アニメ事業
127クール
クール数の総数
1,029千人
※当社主催・共催公演のみ
※
年間動員数
131物件
東宝（株）保有物件数
1,605億円突破
配給作品の興行収入
スクリーン数
717SC
年間動員数
49,002千人
2026年2月期時点の情報です。
東宝グループ
TOHO GROUP at a glance
[p.4] 飛躍的な成長を続ける
アクセンチュア
グローバルのスケール
786,000
人
グローバル社員数
※2026年3月時点
100社
取引先規模上位かつ
10年以上長期継続
している取引先
15.6%
営業利益率
※2025年度
697
億USドル
グローバル売上高
※2025年度
会社紹介
[p.5] お客様の課題やフェーズに応じて、世界中の多様な人材でチームを編成します。
世界を網羅するグローバルなサービス提供体制
52カ国
200都市以上
v
v
v
v
グローバル・デリバリー・ネットワークが
お客様に提供する価値
イノベーション創出
海外展開支援
世界同一品質
コスト低減
グローバルネットワーク
圧倒的なクライアント価値の実現
[p.6] Copyright © 2026 Accenture. All Rights Reserved.
Amazon Bedrockで挑む
AI監修による日本発IP事業のスケール

---
## [PRT231] 【実践】事例に学ぶ Amazon Bedrock での Claude 活用術 －データ・実装・セキュリティ－
`パートナーセッション` / sponsor: Serverworks / 51p / セキュリティ · 生成AI/エージェント
services: AWS IAM, AWS Organizations, AWS Step Functions, AgentCore, Amazon Bedrock, Amazon Connect, Amazon EventBridge, Amazon Nova, Amazon Q, Amazon Redshift

<まとめ>
[p.7] 6
•
サーバーワークスについて
•
急成長するClaude のニーズ
•
Tips.1 データ品質
•
Tips.2 実装
•
Tips.3 セキュリティ・ガバナンス
•
まとめ
目次
[p.49] 48
まとめ～明日から実践できる3つのアクション～
AWS の機能、サーバーワークスが提供するソリューションを利用し生成AI活用を推進しましょう！
課題
本日のまとめ
サーバーワークスの
ソリューション
データ品質
• 結果に寄与しないトークンを入力しない
• 情シス・LOB など適切なステークホルダーを巻き込む
AWS 生成AI 運用最適化
サービス
実装
• スコーピング& シンプルに実装する
• 最初から評価の仕組みを入れる
• プロンプトキャッシュを活用してコストを下げる
• ハンズオンイベント・PoC
• Claude 導入支援サービス
• AI駆動開発伴走支援サービス
セキュリティ
ガバナンス
• リスクを防ぐ技術だけでなく、
いつ・どのようなセキュリティ施策を適用するのか、
組織として標準化された指針が必要
AWS 生成AI ガイドライン
策定サービス

---
## [PRT232] DX 担当者が登壇！「とりあえずRAG 」の先へ －Data & AI の実践知－
`パートナーセッション` / sponsor: Sky / 34p / 生成AI/エージェント
services: Amazon Bedrock, Amazon EKS, Amazon OpenSearch, Strands Agents

<冒頭>
[p.23] Amazon Bedrock
Amazon Elastic Kubernetes Service (Amazon EKS)
Agent
(Strands Agents)
Amazon Bedrock
社内FAQ
User
Amazon OpenSearch Service
ベクトル検索
(ブログデータ)
API呼び出し
(FAQ)
[p.34] ご協力をお願いします
Please give us your feedback
PRT232-S

---
## [PRT233] 次の成長フェーズにおける最適資源配分と 次世代 CRM の実装 － AWS 基盤で実現するデータドリブンな顧客体験変革－
`パートナーセッション` / sponsor: TCS / 22p / コスト最適化/FinOps · データ分析/基盤

<冒頭>
[p.2] Public
1
日本タタ・コンサルタンシー・サービシズ株式会社
杉山賢太
ライフサイエンス・小売事業統括本部
ドメインソリューションズヘッド／コンサルティングパートナー
24年に渡り、国内のライフサイエンス業界の営業＆マーケティング・
事業開発・ソリューション開発、製品開発、およびDXの導入・推進
等に関わる。2020年より、日本TCSに参画
ライフサイエンス全般のソリューションを統括。
アストラゼネカ株式会社
馬光宇
執行役員Customer Experience & IT本部本部長
前職では戦略コンサルタントとして、国際開発、サプライチェーン、
コマーシャルといった多様な領域でDXを牽引。2024年にアス
トラゼネカに入社。Medical・Commercial・Enablingの顧
客体験設計、デジタル、データ、AI、ITを統括。
自己紹介
[p.3] Public
2
タタ・グループは、世界
150 カ国に展開する
インド系グローバル企業グループです
時価総額
株主
グループ売上高
億ドル
億人
エンドユーザー
年の歴史
億ドル
従業員
万人
1,800
3,280
110 +
150
+
2,700
9
万
*グループ売上高と株主数＝2025 年度時点
*時価総額＝2025 年3月末日時点
[p.4] Public
3
Gateway to Globalization
ー グローバルとローカルの強みを日本のお客さまに
ー
日本タタ・コンサルタンシー・サービシズ（日本
TCS）は、
タタコンサルタンシーサービシズと三菱商事の合弁会社として
2014 年に発足。
日本のお客さまに最適な形で、
TCSが世界中の企業との変革を通して積み上げてきた
知見、経験、スケールをお届けし、日本企業の競争力強化に貢献しています。
*2026 年4月時点
日本事業向け拠点
東京・大阪他インドJDC 9都市
35+
日本における事業年数
約10,000
国籍構成
39 ヵ国
女性比率
26 %
日本事業に専従する
プロフェッショナル
[p.5] Public
4
私たちの歩み
1868
1987
2015
2023
2014
1968
タタ・グループ創設
TCS設立
TCS日本進出
日本TCS発足
JDC開設
日本TCS本社移転
後にTCSの初代CEO
とななり、“インド
IT
産業の父”と呼ばれる
F.C. コーリの協力によ
りTCS設立
本社（当時）
インド・プネに日本企業向け専用
デリバリーセンター（
JDC）開設
本社
麻布台オフィス
綿貿易会社創設

---
## [PRT234] SaaS with AI ahead. AWS のAI を活用する AI Security Platform の時代へ
`パートナーセッション` / sponsor: Zscaler / 38p / コスト最適化/FinOps · セキュリティ · マイグレーション/モダナイゼーション
services: AWS CloudTrail, AWS WAF, Amazon Bedrock, Amazon CloudFront, Amazon CloudWatch, Amazon Q, Amazon S3, Amazon VPC, Claude, MCP

<まとめ>
[p.16] 2026 Zscaler, Inc. All rights reserved
AWS Tokyo
AWS Osaka
DMZ (DC/Colo)
複雑性
コスト
生産性
Internet
AI
本来のゼロトラストがもたらす価値
Untrusted
エンドポイント管理
SSE/ ゼロトラスト基盤
ブローカ型（SDP ）の接続
ID管理
脱ネットワークによるシンプルでセキュアな接続
攻撃表面の削減
ラテラルリスクの削減
侵害リスク削減
データの可視化と保護
SaaS
従業員
PC
Server
ワークロード
ユーザ(NHI) とアプリ(AI) を常に検証:
複雑性を排除しながらサイバー脅威から業務を保護
NHI
ブラウザ
[p.19] 2026 Zscaler, Inc. All rights reserved
Subject
PDP
ポリシー決定
ポイント
PEP
ポリシー施行
ポイント
PIP
ポリシー情報
ポイント
Resource
データプレーン
コントロールプレーン
攻撃表面削減
セッション終端
動的リスクの参照
人/ NHI のふるまい
端末のふるまい
自社の知見
データの機微度
脱ネットワーク
User
End
Point
Cloud
On -
Premise
ゼロトラスト参考アーキテクチャ
NIST SP1800
- 35 General ZTA Reference Architecture
[p.20] 2026 Zscaler, Inc. All rights reserved
Subject
PDP
ポリシー決定
ポイント
PEP
ポリシー施行
ポイント
PIP
ポリシー情報
ポイント
Resource
データプレーン
コントロールプレーン
攻撃表面削減
セッション終端
動的リスクの参照
脱ネットワーク
User
End
Point
Cloud
On -
Premise
経営層向け：ゼロトラスト参考アーキテクチャ
NIST SP1800
- 35 General ZTA Reference Architecture
攻撃表面削減
セッション終端
脱ネットワーク
動的リスクの参照
空港のセキュリティゲート
交換機
スマホのような
使用感
入り口のない
コンテナ
人のふるまい
端末のふるまい
自社の知見
データの機微度
ユーザとアプリを安全に接続:
交換機のようなアーキテクチャ
[p.21] 2026 Zscaler, Inc. All rights reserved
Subject
PDP
ポリシー決定
ポイント
PEP
ポリシー施

---
## [PRT237] 生成AIブームのその先へ
`パートナーセッション` / 32p / マイグレーション/モダナイゼーション · 生成AI/エージェント
services: AWS CloudFormation, AgentCore, Amazon Bedrock, Amazon CloudFront, Amazon DynamoDB, Amazon EC2, Amazon ECS, Amazon OpenSearch

<まとめ>
[p.3] PwC
PwCの調査によると、2025年春での活用は前年の43%から56%と13ポイント増加した。
一方で、DX成果に関して「期待通り、もしくはそれ以上」と回答した割合は、2025年は前年の41%から3ポイント減少し38%となった。
生成AIの活用は進むが、DX成果につながっていない
2
出典：PwC Japanグループ 「生成AIに関する実態調査2025 春5カ国比較」
(https://www.pwc.com/jp/ja/knowledge/thoughtleadership/generative-ai-survey2025.html)
出典：PwC コンサルティング 「2025 DX意識調査‐ ITモダナイゼーション編-」
(https://www.pwc.com/jp/ja/knowledge/thoughtleadership/it-modernization-survey2025.html)
DX成果で「期待通り以上」と回答した割合(2024/2025:n=500)
41%
38%
2024
2025
-3ポイント
生成AIを「活用中」と回答した割合(2024:n=912, 2025:n=945)
43%
56%
2024
2025
+13ポイント
生成AIの活用は進むが、DX成果につながっていない
PwCの調査によると、2025年春での活用は前年の43%から56%と13ポイント増加した。一方で、DX成果に関
して「期待通り、もしくはそれ以上」と回答した割合は、2025年は前年の41%から3ポイント減少し38%となった
[p.30] PwC
まとめ
29
• 生成AIは多くの企業で利用されている一方で、成果創出までには多くの壁が存在
• これらは技術面だけではなく、組織に仕組みがないことが問題。
個別に乗り越えようとすれば、属人化と車輪の再発明が加速
• 壁を個人の努力で越えるのではなく、組織の力で壁そのものをなくすことが重要
•
業務部門とIT部門一体でのアジャイルな組織運営
•
プラットフォームエンジニアリングによる再発明防止
•
AI活用の自走化を支える組織設計と役割別育成
Whatの視点：やることを変える
•
AIとIoTを活用した自動制御サービス
•
AIとドローンを活用したスマート農業
•
生成AIを活用した対話型サービスなど
デジタル技術を活用した
新たなビジネスや業務の創出
Howの視点：やり方を変える
市場の変化に速やかに対応し、
利用者への継続的な価値提供

---
## [PRT238] AI 時代のIT 基盤を支えるキンドリルの実践知 －Agentic AI と設計・運用判断の高度化－
`パートナーセッション` / sponsor: Kyndryl / 27p / 生成AI/エージェント
services: AWS CDK, AWS CloudFormation, AWS IAM, AWS Lambda, Amazon Bedrock, Amazon CloudWatch, Amazon DynamoDB, Amazon Q, Amazon Q Developer, Amazon S3

<冒頭>
[p.2] June 2026
AWS Summit Japan 2026
AI 時代のIT 基盤を⽀える
キンドリルの実践知
- Agentic AI と設計・運⽤判断の⾼度化 -
[p.3] 本⽇のスピーカー
2
劉 功義
Gongyi Liu
キンドリルジャパン株式会社
技術理事, AI事業開発室
奥⼭加菜⼦
KANAKO OKUYAMA
キンドリルジャパン株式会社
Director, Customer Enterprise Architect
[p.4] 3
キンドリルは、世界のリーダー企業のために、
競争優位性を⽣み出すミッションクリティカルな
テクノロジーシステムを運⽤し、再創造しています。
社会成⻑の⽣命線である私たちは、
確かな専⾨知識とAIを駆使したインサイトによって、
スマートな意思決定、迅速なイノベーション、
永続的な競争優位性をもたらします。
[p.5] キンドリルの⽬指す姿
4
チームの⼒で、社会成⻑の礎となる
システムを進化させる
Together, each of us advances the vital systems
that power human progress
社会成⻑の⽣命線
The Heart of Progress™

---
## [PRT239] AI 時代のサイバー脅威最前線： 実践的セキュリティ対策
`パートナーセッション` / sponsor: CrowdStrike / 36p / セキュリティ
services: Amazon Bedrock, Amazon SageMaker

<まとめ>
[p.4] © 2026 CrowdStrike All Rights Reserved
© 2026 CrowdStrike All Rights Reserved
Agenda
01
02
03
04
会社概要
最新の脅威動向
対策のポイント
具体的な対策
[p.14] © 2026 CrowdStrike All Rights Reserved
© 2026 CrowdStrike All Rights Reserved
13
脅威のポイント1:攻撃者によるAI悪用の拡大
情報収集
（INTELLIGENCE COLLECTION）
偵察（RECONNAISSANCE）
C:\Programdata\infoフォルダを作成し、コンピュータ情報、ハー
ドウェア情報、プロセスおよびサービス情報、
ネットワーク情報、Active Directory ドメイン情報を
収集するコマンド一覧を作成せよ。
ユーザーのDocuments/Downloads/Desktop
フォルダ内にあるOffice 文書およびPDF/TXT文書を
c:\Programdata\infoフォルダへコピーするための
コマンド一覧を作成せよ。
BY FANCY
BEAR
LAMEHUG
AI Malware
AI is a weapon
•
企業のAI投資 = 攻撃対象領域の増加
•
AI活用攻撃は前年比89%の増加
•
国家支援型アクターによるLLMプロンプトを埋め込んだマルウェアの登場
（FANCY BEARによるウクライナ政府機関を標的としたLAMEHUG）
トピック1: 攻撃者によるAI悪用が拡大
[p.18] © 2026 CrowdStrike All Rights Reserved
© 2026 CrowdStrike All Rights Reserved
対策のポイント

---
## [PRT244] 生成 AI 時代の開発を組織全体に広げる －スケールするために何が必要かを考える－
`パートナーセッション` / sponsor: BeeX / 64p / 生成AI/エージェント
services: Amazon Bedrock, Amazon EC2, Claude

<まとめ>
[p.60] まとめ

---
## [PRT340] PoC を乗り越える AI エージェント実装戦略 －業務特化型ユースケースの選定と AI 基盤統合への ロードマップ－
`パートナーセッション` / sponsor: TIS / 46p / データ分析/基盤 · 機械学習/MLOps · 生成AI/エージェント
services: Claude, MCP

<まとめ>
[p.21] © 2026 TIS Inc.
19
⚫高度人材のレビューの負荷を下げたい想いから、そこに生成AIの導入を検討するケースが多いが、効果を見極める必要
がある。
⚫業務プロセス全体から俯瞰し、もっとも効果的な生成AIの活用ポイントを探る。
②業務プロセス再設計｜目的(負荷軽減)を別業務プロセスの改善で達成する
稟議ドキュメントの業務例）
稟議ドキュメント
一次作成
稟議ドキュメント
レビュー
稟議ドキュメント
（レビュー結果）
稟議ドキュメント
（一次）
レビューア（専門家）
担当者
同様の業務：
・システム設計書のレビュー
⇒開発担当者の一次チェックで活用
・経理部門での伝票不整合チェック
⇒営業担当の申請時チェックで活用
精度80%でも
即効性重視
レビューア（専門家）の負荷
を下げたいために、ここにAI
を導入したいニーズは多い
↓
最終判断を人がしないといけ
ない前提なら、効果は限定的
ここにAIを導入すること
で、結果的に一次作成物
の品質をあげ、専門家の
負荷を下げる
[p.22] © 2026 TIS Inc.
20
⚫品質分析官の工数削減を実現したい⇒本来の目的として「担当システム開発の品質確保」も検討する。
⚫生成AIが、複数の業務ポイントで活用でき、本来の目的の達成に貢献できる効果を確認する。
②業務プロセス再設計｜複数の目的に基づく業務プロセス全体の再考
不具合分析の例）
原因分類
原因分析
品質フィードバック
不具合票
開発チーム
担当者
環境不備
仕様理解不足
仕様間違い
・・・
機能別分析
工程別分析
チーム分析
・・・
改善提案
リスクの早期発見
要因の相関分析
・・・
1週間
⇒3日
3週間
⇒2週間
原因分類
原因分析
簡易品質
フィードバック
1日
従来
リアルタイムで
AIによるチェック
をする場合
品質分析官の工数を下げる目
的での活用もあるが…
↓
精度80%の簡易フィードバッ
クでも即日フィードバックの
品質改善効果を狙う手もある
[p.23] © 2026 TIS Inc.
21
⚫業務再設計のポイントは、AIの能力を理解した上で、どのような役割配置にして、業務プロセスを見直すか。
②業務プロセス再設計｜ポイント
考慮点
内容
正確性が求められるタスクへのAI適用は慎重
に
•
正確性が求められるタスクは、人間が最終確認（Human-in-the-Loop）を行うことが前提
となるため、効果が限定的となるケースが多い
AIの能力を理解する
•
「能力はジュニアレベルだが、超高速に休みなく働いてくれる社員」

---
## [RPT114] “オープンモデルだからできる！” を AWS と NVIDIA で体感：NVIDIA Nemotron と NemoClaw でつくる 企業の安全な AI エージェント
`パートナーセッション` / sponsor: NVIDIA / 25p / 機械学習/MLOps · 生成AI/エージェント
services: Amazon Bedrock, Amazon EKS, Claude, Kiro

<まとめ>
[p.23] Summary & Next Ation
Nemotron 3 Ultra をチェック
Nemotron 3 Nano Omni をチェック
NemoClaw をチェック
タイトル
携帯
FPT Japan Holdings
AI創薬アシスタント - エンタープライズ自律 Agent NemoClaw -
パネル・デモ
Sovlyce: AWS と NVIDIA Nemotron で実現するセキュアで透明性の高いAIエージェントプラットフォーム
Claudera
Cloudera AI: NVIDIA Nemotron × AWS Bedrockで実現する、自律型AIセキュリティ・エージェントの衝撃
デモ
クラスメソッド
株式会社
製造現場はどう変わるか。NVIDIAのFactory Automationが見せる未来
6月24日(木) 11:00 -
11:10
"業務に刺さるAI"はどう作るか。NVIDIAが語る特化型AIを実現するソフトウェア
6月25日(金) 10:20 -
10:30
Deloitte
AI駆動開発デモ - Kiro CLIおよびNVIDIA Nemotron の実践 -
デモ
日鉄ソリューションズ
クラウドネイティブx カスタムLLMでAI活用を加速~ 日鉄ソリューションズが実現するE2E LLM開発~
パネル
日本TCS
保険オペレーターサポートAIエージェントデモ
デモ
Red Hat
検証と本番のギャップを埋めるAI基盤 ~ Red Hat AI Factory with NVIDIA ~
デモ
五十音順

---
## [AIM118] MMO 戦略シミュレーションゲーム 『三國志 覇道』における Amazon Bedrock を 用いたチャット等リアルタイム翻訳事例
`事例セッション` / 46p / 生成AI/エージェント
services: Amazon Aurora, Amazon Bedrock, Amazon EC2, Amazon Nova, Claude

<まとめ>
[p.3] 本日のお話概要
『三國志覇道』における生成AI を用いたゲーム内チャットの翻訳を
テーマに、導入事例をご紹介します
時系列にやっていったことを説明(検討段階～リリース後まで)
まとめ
タイトルのご紹介＆翻訳機能が必要になった背景
©コーエーテクモゲームスAll rights reserved.
[p.25] 翻訳API の決定(翻訳精度)
サンプルを翻訳して比較
チーム内の日本語・繁体字両方が読めるメンバーに協力してもらって検証
【要素②】翻訳精度
■主なシチュエーション
・攻城戦中のチャット
・(普段の)全体チャット
・君主コメント
■精度検証のポイント
・話の流れが読み取れるか(特に攻城戦の指示)
・意味が大きく変わっていないか
・自然な翻訳となっているか
©コーエーテクモゲームスAll rights reserved.
[p.31] 本実装での苦労点・工夫点
・案A (採用案)
1 回のAPI 呼び出しで複数メッセージをまとめて翻訳リクエストする
// 翻訳用のバッチ処理で呼び出す設計のため、相性が良い
・案B
US リージョンを利用する(US ならQuota は1,000 回/ 分)
// 日本・アメリカ間のレイテンシが心配
// リージョン間通信には追加費用
・案C
Claude 3 Haiku 以外のモデルも併用する
// プロンプトの複数管理が煩雑になりそう
結論
©コーエーテクモゲームスAll rights reserved.
[p.44] まとめ
・ゲームのユーザー自由入力文は、他分野と比較すると一文が短い
・翻訳することに特化するなら、軽量で安価なモデルで十分
・動作速度も、軽量モデルならさほど問題にならない
・顔文字(文化)も理解していることに驚き
・これから生成AI の翻訳精度は上がっていくことが予想される
生成AI での翻訳は
ゲームのユーザー自由入力と
相性が良いです
©コーエーテクモゲームスAll rights reserved.

---
## [AIM146] ランサム危機を転機に ーアスクルが加速させた AI-DLC
`事例セッション` / 42p / AI駆動開発 · セキュリティ

<冒頭>
[p.2] Copyright © ASKUL Corporation All Rights Reserved.
Copyright © ASKUL Corporation All Rights Reserved.
[p.3] Copyright © ASKUL Corporation All Rights Reserved.
[p.4] Copyright © ASKUL Corporation All Rights Reserved.
Copyright © ASKUL Corporation All Rights Reserved.
[p.5] Copyright © ASKUL Corporation All Rights Reserved.
Copyright © ASKUL Corporation All Rights Reserved.

---
## [AIM203] ガバメントクラウドでの AI 駆動開発の設計と実践
`事例セッション` / 40p / AI駆動開発 · 生成AI/エージェント
services: AWS DevOps Agent, AWS IAM, AWS Organizations, AgentCore, Amazon Bedrock, Amazon CloudWatch, Claude, Kiro, MCP

<まとめ>
[p.38] 38
まとめ
デジタル庁はガバメントクラウドだけでなく、
AI エージェントを活用し
迅速、柔軟、セキュア、コスト効率の高い公共情報システムの構築を
進めるための環境整備を進めて参ります
AI エージェント
活用環境整備
開発/運用
スピードおよび
品質/セキュリティ
改善
高品質な
サービス提供

---
## [AIM205] 建築確認手続への AI の活用に向けたチャレンジ － OSS の RAPID をカスタマイズ。 3 か月で AI サービスを立ち上げた事例－
`事例セッション` / 31p / その他
services: Amazon Bedrock, Claude

<まとめ>
[p.25] 建築確認申請図書作成支援サービスの操作
②申請図書のファイル一式を
まとめてアップロード
①案件名を入力
③「事前チェック実施」を実行
✓ユーザー登録の後、事前チェックは、以下のように簡単な３ステップで実施可能

---
## [AIM207] AI エージェントで現場を変えた － 2 社の挑戦の瞬間
`事例セッション` / 36p / 生成AI/エージェント
services: AWS Lambda, Amazon Bedrock, Amazon EC2, Amazon Q, Kiro, MCP

<まとめ>
[p.35] テクノロジーは、特別な人のためのものではありません。
現場の課題を持っている人が、一歩踏み出すための道具です。
現場を変えるのは、お客様です。
AWS は、その先の可能性を一緒に拓くパートナーです。
挑戦は、小さな一歩から始まる
おわりに

---
## [AIM210] 汎用 LLM で足りない領域に、どう挑むか ── ドメイン特化基盤モデルをゼロから作り、 世界最高精度を獲るまで
`事例セッション` / 25p / 機械学習/MLOps · 生成AI/エージェント
services: Amazon FSx, Amazon S3

<冒頭>
[p.2] © 2021 Humanome Lab., Inc.
© 2026 Humanome Lab., Inc.
汎用LLM で足りない領域に、どう挑むか
ドメイン特化基盤モデルをゼロから作り、世界最高精度を獲るまで
AWS Summit 2026
2026/6/25
ヒューマノーム研究所・代表取締役社長
瀬々
潤
Supported by :
[p.3] © 2026 Humanome Lab., Inc.
自己紹介
3
瀬々潤(Jun Sese)
株式会社ヒューマノーム研究所
代表取締役社長
【著書】
生命情報処理における機械学習
講談社サイエンティフィック
Psychology
専門領域
機械学習・数理統計の手法開発/ 生命科学の大規模データ解析
history_edu 経歴
• 東京大学助教
• お茶の水女子大学・東京工業大学准教授
• 産総研人工知能研究センター機械学習研究チーム長
• 株式会社ヒューマノーム研究所代表取締役社長（2018年〜）
産総研覚醒PM、AMEDアドバイザー等
KDD Cup 2001優勝、Oxford-JSBi Prize 受賞
[p.4] © Humanome Lab., Inc.
4
" 人間とは何か― に挑む" をテーマに、リアルワールドへAI技術を展開しています
人間とは何か― に挑む
医学・医療
住環境・生活
メンタルケア
ビューティー
教育
食・農学系
福祉・社会支援
[p.5] © 2026 Humanome Lab., Inc.
目次
なぜ基盤モデル作成を選んだか
どう作ったか
AWSとの協働で何が変わったか
1
2
3
汎用LLM・RAG・ファインチューニングとの比較判断
1億円の使い道と、4フェーズの壁
再現可能な3つのプラクティス
5

---
## [AIM213] AI 駆動開発による開発者体験の変革
`事例セッション` / 34p / AI駆動開発 · 生成AI/エージェント
services: AWS Lambda, AgentCore, Amazon Aurora, Amazon Bedrock, Amazon Q, Amazon Q Developer, Claude, Kiro, MCP, Strands Agents

<まとめ>
[p.31] 0 6  |  W R A P U P
本日のまとめ
AI 駆動開発は
ゲームチェンジャー
試行ではスピード10 倍、生産性3 倍。
これまでの改善とは次元が違う変化が起
き始めている。
人とAI の協働で
「人」が成長する
AI に作業を任せ、人は問いと検証・判断
に集中。それによって検証・判断のスキ
ルが伸びる。
前提を置かず、
積極的に活用する
26 年度は10 件以上の本番プロジェクト
で実証。27 年度に全社標準として展開し
ていく。
© Tokio Marine & Nichido Systems
30 / 32

---
## [AIM226] Umios（旧マルハニチロ）が 生成 AI で挑戦する需要予測 ー過剰在庫の削減・作業 4,200 時間削減への裏側ー
`事例セッション` / 31p / 生成AI/エージェント
services: AWS Lambda, AWS Step Functions, Amazon DynamoDB, Amazon Redshift, Amazon S3, Amazon SageMaker

<まとめ>
[p.26] Copyright © Umios Corporation
Copyright © Umios Corporation
到達点・展望・まとめ
第6 部｜Part 6
4 者協働で見えたこと、そして次の100 年へ
26
[p.29] Copyright © Umios Corporation
まとめ── 4 者協働で見えたこと
事業部
現場課題・データ
DX 推進部
業務と技術のハブ
Umios テック
実装・AWS 運用
AWS
アーキ・SA 支援
■3 つの学び
1
効果はデータ品質が左右
2
技術選定より、運用設計に時間を
3
現場が回る運用を事業部と
29

---
## [AIM228] AI エージェントで組織と製造現場を変える！ 三菱電機の挑戦！
`事例セッション` / 27p / アーキテクチャ/サーバーレス · 生成AI/エージェント · 運用/SRE
services: AWS DevOps Agent, AWS Glue, AWS Lambda, AgentCore, Amazon Aurora, Amazon Bedrock, Amazon CloudWatch, Amazon Q, Amazon S3, Kiro

<まとめ>
[p.20] ©Mitsubishi Electric Corporation
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

---
## [AIM229] サイバーエージェントにおける AI 推進戦略と変革への取り組み
`事例セッション` / 60p / セキュリティ · 運用/SRE
services: Claude

<まとめ>
[p.26] 26
©CyberAgent, Inc. All Rights Reserved
03
AI 活用推進の指標と変革への取り組み
各事業における、AI 活用の「成果インパクト」と「カルチャー醸成」を評価ポイントとし相撲の番付表に見立て可視
化する取り組み。エンジニア版では「エンジニアリング品質」や「技術成熟度」「推進体制」「技術文化」を評価。
AI 番付
部署ごとのAI 活用状況を可視化し、底上げに繋げる

---
## [AIM234] 特許調査工数 50 %減も！オムロン R&D が 内製する『知財 AI エージェント』の裏側 －検索精度 UP &リードタイム短縮のノウハウ－
`事例セッション` / 37p / 生成AI/エージェント
services: AWS CloudFormation, AWS CloudTrail, AWS Config, AWS Control Tower, AWS IAM, AWS Lambda, Amazon Bedrock, Amazon CloudWatch, Amazon EC2, Amazon OpenSearch

<まとめ>
[p.6] 5
(C) 2026 OMRON Corporation
先行技術調査も、発明説明書作成も
知財のプロではないエンジニアが「発明のポイント」を理解することが難しく、時間がかかる
発明考案プロセスの課題
先行技術調査の課題
この特許の
発明のポイントって
何だ？
エンジニア
先行技術文献
（数百件～数千件）
発明説明書作成の課題
発明説明書
対比
エンジニア
先行技術文献を
読むだけで大変
まして、発明のポイントの
違いを説明するなん
て、、、
[p.7] 6
(C) 2026 OMRON Corporation
特許の専門知識を持たないエンジニアでも
先行技術文献の調査や発明説明書作成を簡単にできるようになった
「発明のポイント」の理解を効率化
先行技術調査
AI で対話を行うシステムに関する
先行技術文献を調査したい
発明説明書作成
●検索した特許の発明のポイントを自然言語で
わかりやすく解説。対話型の質問もできる
●分析結果のレポートを作成
ユーザ
知財AI
エージェント
仕様書などのドキュメントを入力
ユーザ
知財AI
エージェント
エンジニア
先行特許と発明のポイント
がすぐにわかる！
●発明のポイントを自動生成
●先行技術の特定と特許性の検討をサポート
●発明説明書を自動生成
エンジニア
発明説明書を
らくらく作成！
[p.16] 15
(C) 2026 OMRON Corporation
実際の知財AI エージェントの画面：特許分析
出願人✕年次ヒートマップ分析
競合企業間技術類似度調査
競合ベンチマーク分析まとめ
知財AI エージェントの画面
[p.17] 16
(C) 2026 OMRON Corporation
実際の知財AI エージェントの画面：特許分析
出願人✕年次ヒートマップ分析
競合企業間技術類似度調査
競合ベンチマーク分析まとめ
知財AI エージェントの画面
[p.18] 17
(C) 2026 OMRON Corporation
実際の知財AI エージェントの画面：特許分析
出願人✕年次ヒートマップ分析
競合企業間技術類似度調査
競合ベンチマーク分析まとめ
知財AI エージェントの画面
※ LLMが出力した内容の例示であり、オムロンの見解ではありません。
[p.20] 19
(C) 2026 OMRON Corporation
実際の知財AI エージェントの画面：発明説明書
技術文書などの入力
公知例調査の結果出力
発明説明書の出力
知財AI エージェントの画面
発明のポイントを抽出し
検索クエリを自然文で
生成
類似度

---
## [AIM238] tsuzumi 2 - NTT 版 LLM の開発と AWS GPU サービスの活用
`事例セッション` / 35p / 機械学習/MLOps · 生成AI/エージェント
services: Amazon SageMaker, SageMaker HyperPod

<冒頭>
[p.2] © NTT, Inc.  2026
tsuzumi 2 : NTT 版LLM の開発と
AWS GPU サービスの活用
NTT株式会社人間情報研究所
上席特別研究員西田京介
2026 年6 月26 日
[p.3] 2
© NTT, Inc.  2026
目次
1.  NTT の生成AI 戦略とtsuzumi の開発方針
2.  AWS を活用したtsuzumi 2 の開発
3.  今後の展望
[p.4] 3
© NTT, Inc.  2026
NTT のAI 戦略: AI For Quality Growth
インフラ、アプリケーション、コンサルティングまでend-to-end でフルスタックで提供
[p.5] 4
© NTT, Inc.  2026
国産モデルtsuzumi
tsuzumi は国内のデータ主権を守るソブリンAI として研究開発を実施中

---
## [AIM239] AI を活用したスマート店舗 DX
`事例セッション` / 29p / その他
services: AWS Fargate, AWS Lambda, Amazon API Gateway, Amazon Aurora, Amazon Bedrock, Amazon CloudWatch, Amazon EC2, Amazon Kinesis, Amazon S3, Amazon SQS

<まとめ>
[p.25] 05
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

---
## [AIM240] 東京電力におけるコンタクトセンター変革 － CX 向上に向けた AI 活用の取り組み－
`事例セッション` / 27p / その他
services: Amazon Bedrock, Amazon Connect, Amazon Q, Amazon S3

<まとめ>
[p.17] ©TEPCO Energy Partner、Inc. All Rights Reserved.
無断複製・転載禁止東京電力エナジーパートナー株式会社
実現スピードと導入のポイント
～Phase 1 ～
2024.12 ～
2025.1 ～
2025.9
2025.12 末
Phase 1
要件整理
システム
設計・開発
リリース・
拠点導入開始
切替完了
（計18 拠点）
要件整理～リリースまで約10 か月、約3 か月で計18 拠点の切替を完了
1. できる限り標準機能を活用した業務の構築
→スクラッチ開発やカスタマイズを最小限にすることで実現スピードを向上
2. 試しながら精度向上
→生成AI のチューニングや画面構成など、事業特性や現場の意見を考慮しながら
試しながら徐々に精度を高めていくことを並行で実施
導入の
ポイント

---
## [AIM308] 村田製作所の知を活かす AI エージェント統制
`事例セッション` / 27p / セキュリティ · 生成AI/エージェント
services: AWS WAF, AgentCore, Amazon Bedrock, Amazon DynamoDB, Amazon ECS, Claude, MCP

<冒頭>
[p.2] 村田製作所の知を活かす
AI エージェント統制
[p.3] 3
自己紹介
株式会社村田製作所
データ戦略推進部/ 生成AI CoE
シニアマネージャー
鈴木
健太
総合電機メーカーを経て村田製作所に入社。
データサイエンティストとして業務に従事する傍ら、
生成AI CoE の立ち上げとリードを担当。
現在もその推進を担いながら、生成AI 関連プロダクト開発組織の
マネジメントを務め、社内のAI 活用高度化に取り組んでいる。
プロフィール
[p.4] 4
目次
Section 01
会社紹介・取り組みの全体像
自律分散型経営を活かしつつ
創発型へ進化するための戦略
生成AI を活用して価値創造プロセスを加速
Section 02
AI エージェントガバナンスの策定
AWS GenAIIC との共同策定
エンタープライズ向けガイドライン
RAG を超えたAgent リスク対策
Section 03
責任ある運用設計（AWS 実装）
Amazon Bedrock AgentCore
による実装
安定性・統制・可観測性の実現
村田製作所とは
ムラタが目指すDX
人とAI の好循環で創発する経営変革
生成AI CoEのミッション
CoE が主導する施策全体像
AI エージェント独自リスクと対策
ガバナンスガイドライン策定
リスクレベル判定フレームワーク
Must-Not 行動の定義
Murata Coworker アーキテクチャ
ガードレール重ね掛け実装
AgentCore 実装事例
認証認可基盤（ABAC/RBAC×AVP）
今後の展望
[p.5] 5
１
会社紹介・取り組みの全体像

---
## [AIM310] AI 駆動開発 × 開発標準化で実現する エンタープライズ向けシステム開発の今と未来
`事例セッション` / 24p / AI駆動開発
services: AgentCore, Amazon Bedrock, Amazon S3, Claude, Kiro, MCP

<冒頭>
[p.2] 2
自己紹介
専門商社勤務後、1999 年にトランスコスモス入社。顧客コミュニケー
ションの最適化を実現するサービスの開発と運用を担当し、LINE を利用
したチャットサポートサービスを日本で最初に企画実装。2018 年よりデ
ジタルマーケティング全般のサービス部門の責任者を経て、現在はトラ
ンスコスモス全体のシステム開発を統括する本部を担当。また、2024 年
1 月よりトランスコスモスの戦略子会社のトランスコスモス・デジタル・
テクノロジーの代表取締役社長に就任し、グループ全体でのエンジニア
リソース最大活用を目指している。
略歴
トランスコスモス株式会社
上席常務執行役員
株式会社トランスコスモス・デジタル・テクノロジー
代表取締役社長
所年雄（トコロトシオ）
[p.3] 3
バイブコーディング(AI 駆動開発)が広がったきっかけ
https://x.com/karpathy/status/1886192184808149383
2025 年2 月Andrej Karpathy 氏の投稿が一つの契機
（OpenAI 社創設メンバーの一人）
Vibes＝その場のノリのコーディング
[p.4] 4
バイブコーディングの破壊力
開発課題：Todo アプリ
概要
・Todo 登録画面
・登録したTodo に対してのコメント登録
・Todo の完了登録
・React/Node/Typescript をベースとした開発
・AWS サーバレス構成
想定工数：15.5 人日
要件整理
0.5
構成検討
1.0
基本設計
1.0
詳細設計
2.0
実装
5.0
単体テスト
4.0
結合テスト
3.0
15.5 人日
2.0 人日
VibeCoding による生産性の改善
-87 %
開発の常識を更新せよ！
[p.5] 5
AI 駆動開発の弱点
Vibes のノリのままだと、
大規模開発に使えない
組織的にAI 駆動開発を利用する
スキームを定義する必要がある

---
## [AIM312] freee の月 100 万件 AI-OCR ： 汎用 LLM の壁を越える独自 SLM の開発と運用
`事例セッション` / 33p / 機械学習/MLOps · 生成AI/エージェント
services: Amazon EC2, Amazon EKS, Amazon SageMaker, Claude, SageMaker HyperPod

<まとめ>
[p.9] 9
先にまとめ：今日持ち帰ってほしい3 つのこと
Task
SLM 化は「モデル置換」
ではなく、タスクを分割
して勝てるタスクを見極
める
Cost
GPU コストは怖くない。
イニシャル/ランニングを
計算すれば意思決定でき
る。
Ops
SLM はモデル開発ではな
く、評価・監視・改善を
含む「本番システム開
発」である。
[p.18] 18
Takeaway 1:
SLM タスクを
切り出す
勝てるタスクを切り出す
LLM をSLM に置き換えるのではなく、以下の条件を
満たすタスクを探す
入出力スキーマが安定している
汎用LLM（Claude Haiku 4.5 等）で安定して解けている
件数が多く、コスト・速度改善がUX/ビジネスに効く
評価データを継続的に作れる体制がある
■
■
■
■
[p.22] 22
Takeaway 2:
コスト見積もりと
意思決定
投資対効果は計算式に落とす
コスト構造として、LLM はtoken 課金だが、
SLM は時間課金であることをよく理解して見積もる
イニシャルの学習/評価コストと推論・運用コストを分
けて見積もる
■
■
運用コストを決定づけるスループット「output
token/sec」を測れば自ずと決まる
■
[p.25] 25
Takeaway 3:
SLM 開発は
本番システム開発
SLM は「モデルを作る」ことよりも
「価値を届け切る仕組み」を作ることが難しい
■
■
オンライン精度評価、監視・可視化などができるツー
ル（Langfuse 等）の導入は必須
リリース後に改善リソースを確保しておくことが前提
[p.28] 28
まとめ
[p.30] 30
まとめ：今日持ち帰ってほしい3つのこと
運用コストを決定づけるスル
ープット「output
token/sec」を測れば自ずと
決まる
汎用LLM（Claude Haiku
4.5 等）で安定して解けてい
るタスクが候補
リリース後に改善リソー
スを確保しておくことが
前提
Task
SLM 化は「モデル置換」
ではなく、タスクを分割
して勝てるタスクを見極
める
Cost
GPU コストは怖くない。
イニシャル/ランニングを
計算すれば意思決定でき
る。
Ops
SLM はモデル開発ではな
く、評価・監視・改善を
含む「本番システム開
発」である。

---
## [AIM322] AI Agent が変える業界特化サービスの 業務と顧客体験
`事例セッション` / 50p / 生成AI/エージェント
services: AWS Lambda, AgentCore, Amazon API Gateway, Amazon Aurora, Amazon Bedrock, Amazon CloudFront, Amazon DynamoDB, Amazon S3, Amazon SQS

<まとめ>
[p.47] AWS Summit Japan 2026  ／AI Agents Transforming Ops & CX in Domain-Specific Services
まとめ
業界に特化したAgent は、
業務データ・UX・運用改善まで包括的な設計が必須
• データモデリング
• Text2SQL に適したDB 設計が精度向上に寄与
• ユーザー特性に合わせた回答生成
• Bedrock AgentCore Memory でオペレータらしさを再現
• ドメインエキスパートによるAI Agent の改善
• LangFuse によってプロンプトの変更が可能なシステムを提供

---
## [AIM332] データ駆動型創薬研究から AI 中心型創薬研究へ
`事例セッション` / 31p / 機械学習/MLOps
services: AgentCore, Amazon Bedrock, Amazon Q, Amazon SageMaker, MCP

<まとめ>
[p.19] 19
AWS summit Japan 2026
目標
•
AIが計画・実装・テストを実行し、
人間はレビュー・承認・重要な意思決定に集中する
•
全開発フェーズでAIが主導し、チームがモブ形式でリアルタイムに意思決定
今回の開発対象
AI-DLCの体験とそこから学んだこと
•
研究データのクオリティチェックをサポートするツール
•
参加時点で内製対象としてドメインモデリングを実施中
•
2日間でオペレーションまで到達する
•
AIが働いていない時間を極力ゼロにする（運営側からの指示）

---
## [AIM333] リコーが実現する AI による 企業の秘伝のたれの活用と、 フィジカル AI による現場革新
`事例セッション` / 35p / 生成AI/エージェント
services: Amazon FSx, Amazon S3, Claude

<まとめ>
[p.19] AWS Summit 2026講演資料
企業の情報資産化戦略が変わる
「稟議を通すために、役員の思考パターンをSkill 化。資料に反映」
「商談を通じて、顧客のこだわりポイントをSkill 化。提案資料の重点ポイント化」
— 経験で培われた「勘」と「コツ」をAI 化
文書化できない。共有できない。継承できない。退職と共に、永遠に失われる。
@RICOH
•
すでにドキュメント化されている知は、Hi.DEEN へ
•
定型業務ならDify、非定型業務ならHermes へ
自己改善型AI エージェントの活用で、埋もれた暗黙知をAI 化

---
## [AIM336] Agentic RAG が切り開く 製造現場語理解の新たな可能性
`事例セッション` / 33p / 機械学習/MLOps · 生成AI/エージェント
services: AWS Glue, AgentCore, Amazon Athena, Amazon Bedrock, Amazon CloudFront, Amazon DynamoDB, Amazon Nova, Amazon OpenSearch, Amazon Q, Amazon S3

<冒頭>
[p.2] Agentic RAG が切り開く製造現場語理解の新たな可能性
東洋紡株式会社
TX・業務革新総括部
坂倉広也
AWS Summit Japan 2026
[p.3] 3
自己紹介
入社後、研究所で
マテリアルインフォマティクスを
1 年間推進
製造現場に機械学習を導入する
キャリアの歩み
0
2
3
大学院まで化学を専攻
TX・業務革新総括部
坂倉広也
【趣味】
コーヒーを淹れること、
テニス、ランニング
2024 年東洋紡入社
1
物理化学を専攻
シミュレーションやデータ処理に
プログラミングを活用
[p.4] 4
会社名
東洋紡株式会社
代表者
代表取締役社長竹内郁夫
創立
1882 年(明治15 年)5 月3 日
設立
1914 年(大正3 年)6 月26 日
資本金
51,730百万円(2025 年3 月31 日現在)
発行済株式総数
89,048,792 株(2025 年3 月31 日現在)
本社
大阪府大阪市北区梅田一丁目13番1号
大阪梅田ツインタワーズ・サウス
TEL:06-6348-3111
グループ会社
日本21 社、国外30 社
連結従業員数
9,976 名(2025 年3 月31 日現在)
従業員数
3,030 名(2025 年3 月31 日現在)
URL
https://www.toyobo.co.jp/
／会社概要
[p.5] 5
／早わかりTOYOBO

---
## [AIM347] AI に"賭ける"- LayerX の AI エージェント基盤と活用最前線
`事例セッション` / 54p / セキュリティ · 生成AI/エージェント · 運用/SRE
services: AWS Fargate, AWS IAM, AWS Lambda, AWS Step Functions, AgentCore, Amazon Aurora, Amazon Bedrock, Amazon ECS, Amazon EFS, Amazon OpenSearch

<まとめ>
[p.34] © LayerX Inc.
34

n8n, Shepherd などの利用増加によりコストが急上昇

モデルアクセスのための鍵管理の課題もあった

LLM 利用時の統一ゲートウェイとしてLiteLLM を導入

エンドポイントに対するプロキシとして振る舞う

バーチャルキーの概念を持ち、一つの認証で複数のプロバイダに対応

Amazon Bedrock, OpenAI Platform など

コスト計算と上限(Budget) の設定が可能

複数エンドポイントを合算できる
LLM ゲートウェイ(LiteLLM)
[p.51] おわりに

---
## [ANT325] LINEヤフーが挑む⼤規模 DWH 基盤の クラウド化の軌跡
`事例セッション` / 31p / データ分析/基盤
services: AWS CloudFormation, AWS Direct Connect, AWS Transit Gateway, Amazon CloudWatch, Amazon Q, Amazon Redshift, Amazon S3, Claude, MCP

<冒頭>
[p.2] © LY Corporation
LINEヤフー株式会社
Data CBU
データPFインフラユニット
データプロセッシングPFディビジョン
⽥中章宏(Tanaka Akihiro)
LINEヤフーが挑む
⼤規模DWH 基盤のクラウド化の軌跡
オンプレミスからAmazon Redshift へ
そしてAI-Ready なプラットフォームへ
[p.3] © LY Corporation
Agenda
01
イントロダクション
02
次世代DWH 選定(PoC)
03
移⾏プロジェクトの軌跡
04
クラウド化による技術的恩恵
05
AI-Ready なデータ基盤へ
3
On-Premise
Amazon
Redshift
AI-Ready
Future
[p.4] © LY Corporation
01 イントロダクション
4
[p.5] © LY Corporation
5
Speaker Profile
© LY Corporation
01 イントロダクション
⽥中章宏(Tanaka Akihiro)
移⾏プロジェクトPM
AI 活⽤PJ メンバー
好きなAWS サービス
Amazon Redshift
Amazon S3 Tables
趣味
低⼭登⼭、観劇
国内IT ベンダーで
サーバ、ストレージ、NW、DB、
仮想化などインフラエンジニア
外資DWH ベンダーで
データエンジニア／PM
（⼤⼿EC 企業常駐）
ヤフーへDWH エンジニアとして
⼊社
※2023.10 LINEヤフーへ統合
経歴
13+
years
5+
years
4+
years

---
## [ARC209] AWS での日産の 次世代コネクテッドプラットフォーム開発
`事例セッション` / 29p / アーキテクチャ/サーバーレス
services: AWS Glue, AWS Lambda, Amazon EKS, Amazon Kinesis, Amazon S3

<冒頭>
[p.2] 自己紹介
1991
2000
2011
2016
2019
2006
2009
2001
2013
日産自動車入社
研究所
ビジネス
開発
@US #1
@US #2
@US #3
無線・通信HW
車載マルチメディア
コネクテッドシステム
コネクテッドカー、サービスビジネス
コネクテッドカー通信ユニット＆クラウドシステム
コネクテッドカークラウドシステム
＋Mobile APP
開発&運用
コネクテッドカー＆サービスアーキテクチャ
車載コンピュータ
ソフトウェアデファインドビークルクラウドシステム
[p.7] AI-Defined Vehicle = Software Defined Vehicle X AI
自動運転
個々に合わせた
空間と体験の提供
AI-Drive技術
AI-Partner技術
Nissan Scalable Open OS
SDV Platform
AI-Partner
AI-Drive
AI-Defined Vehicle
[p.8] AI-Defined Vehicle = Software Defined Vehicle X AI
自動運転
個々に合わせた
空間と体験の提供
Nissan Scalable Open OS
AI-Drive技術
AI-Partner技術
SDV Platform
AI-Partner
AI-Drive
[p.10] AI-Drive のパートナーシップ
Wayve for Autonomous Drive
Uber and Wayve for Robotaxi

---
## [ARC243] －街に OS がある時代－ データを活用するスマートシティの今
`事例セッション` / 52p / その他
services: AWS Glue, AWS Lambda, AWS WAF, Amazon API Gateway, Amazon Athena, Amazon Bedrock, Amazon CloudWatch, Amazon EC2, Amazon ECS, Amazon ElastiCache

<まとめ>
[p.51] 50
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

---
## [ARC317] 制約を超えて進化する B2B SaaS の AI 基盤
`事例セッション` / 36p / 生成AI/エージェント
services: AWS CDK, AWS Lambda, Amazon Aurora, Amazon Bedrock, Amazon CloudWatch, Amazon EKS, Amazon ElastiCache, Amazon S3, Amazon SQS, Claude

<まとめ>
[p.33] オンラインLLM-as-a-judge の仕組みを導入
顧客データを見ずに品質をモニタリング
33
batch processor でまとめて送られる
gzip 圧縮されたspan をパースし、SQS に積む
Amazon EKS Auto Mode
AWS Cloud
AI application
Amazon
CloudWatch
Langfuse
Processor 層でマスク
AWS Distro
for OpenTelemetry
Amazon Bedrock
Amazon SQS
AWS Lambda
LLM-as-a-judge
スコアのみ格納
Input/output
（N%サンプリング）
{
"trace_id": "0123456789abcdef0123456789abcdef",
"span_id": "a1b2c3d4e5f60718",
"name": "chat.completions.create",
"attributes": {
"gen_ai.prompt": "Hello",
"gen_ai.completion": "How can I help you?",
"gen_ai.request.model": "claude-sonnet-4-6”
}
}, {
…
}, {
…
}
[p.35] まとめ
35
既存SaaS による制約を乗り越えながら、
AI 領域の潮流に追従できる開発体制を、どう手に入れるか
Part 1 ── AI インフラの設計
• 生成AI の進化・ビジネスニーズに追従できる柔軟な基盤
◦
Amazon EKS Auto Mode を中核に据え、少人数でも運用負荷を抑えて変化に追従する
Part 2 ── AI Observability 基盤
• データポリシー準拠× 改善できるAI Observability 基盤
◦
OpenTelemetry + Application Signals + Langfuse による可観測性の基盤
◦
OTel Collector 層での入力データのマスクとオンラインLLM-as-a-judge の仕組みにより、
B2B SaaS のデータポリシーを守りながら改善サイクルを実現

---
## [ARC349] スタートアップに Amazon EKS は早すぎる？ マルチプロダクト戦略を加速する Platform Engineering の実践
`事例セッション` / 38p / 組織/内製化 · 運用/SRE
services: AWS CloudFormation, AWS Fargate, AWS IAM, Amazon EKS

<冒頭>
[p.2] スタートアップにAmazon EKS は早すぎる？
マルチプロダクト戦略を加速する
Platform Engineering の実践
AWS Summit Japan 2026
2026年6月26日
株式会社ログラス
[p.3] 自己紹介
中井綾一
Ryoichi Nakai
株式会社ログラス
SRE
株式会社ログラス技術基盤部クラウド基盤チームに所属。
前職では合同会社DMM.com で、Platform Engineering に取り組んでいた。
2024 年よりログラスのクラウド基盤チームに参画。
[p.7] Amazon Elastic Kubernetes Service (Amazon EKS) を採用したのは1 年前
• 当時エンジニア50 名弱、リリース済みプロダクトは2 つ
• この規模でAmazon EKS の採用は早いと思われるかもしれない
本セッションで話す3 つのこと
• なぜAmazon EKS を選んだのか？
• どう活用しているのか？
• 1 年間の実践による変化と得た学びは何か？
本セッションについて
[p.8] なぜEKS を選んだのか？

---
## [BIZ204] 政府の生成 AI 基盤『源内』 －ガバメントクラウド上での AI 実装と AgentCore による エージェント AI への進化－
`事例セッション` / 40p / 生成AI/エージェント
services: AWS Lambda, AWS WAF, AgentCore, Amazon API Gateway, Amazon Bedrock, Amazon CloudFront, Amazon DynamoDB, Amazon Route 53, Amazon S3

<まとめ>
[p.24] © Digital Agency, Government of Japan
24
本資料に記載した内容はすべて個人の見解であり、所属組織を代表するものではありません。
ここまでのまとめ
Pillar 1 — まとめ
1a. エージェントを実装する
• 実行基盤はAgentCore Runtime が、Agentic Loop はStrands Agent が提供してくれる
• エージェントの挙動は初期化処理とHook で作り込む
1b. セキュリティを考える
• エージェントに何を許可するかは設計者が考える
• 3 つの境界ーユーザー境界、ネットワーク境界、アカウント境界
1c. ツールを与える
• ファイル操作ツールをUnix FS 風の語彙へ寄せる
• workspace_shell + pipe で巨大データをcontext に入れない
• Index Card — 巨大入出力をルールベースで圧縮
[p.38] © Digital Agency, Government of Japan
38
本資料に記載した内容はすべて個人の見解であり、所属組織を代表するものではありません。
本日のまとめ
Closing
エージェントx セキュリティx ツール
• AgentCore とStrands Agent の機能を最大限活用
• エージェントが自律的に振る舞うための3 つの境界（ユーザ境界/NW 境界/ア
カウント境界）
• エージェントが大きな入出力コンテキストをうまく扱えるようなツール設計
マルチテナントで18 万人に配る
• 少数の開発者チームで大規模展開を支えるため、宣言的なインフラ管理を徹底
• YAML 1 本で新しいテナントをデプロイする

---
## [BIZ220] トヨタの品質管理を支える監査即応 AI —文書管理の実践
`事例セッション` / 62p / 生成AI/エージェント
services: Amazon Bedrock, Amazon DynamoDB, Amazon ECS, Amazon OpenSearch, Amazon S3, MCP, Strands Agents

<まとめ>
[p.7] PROTECTED 関係者外秘
本日のストーリー
• 社内AI の現在地
• トヨタのQMS（品質管理）における取り組み
• Qubee で構造化
• Qubee による構造化手法とは
• まとめと活用事例
[p.8] PROTECTED 関係者外秘
•社内AI の現在地
• トヨタのQMS（品質管理）における取り組み
• Qubee で構造化
• Qubee による構造化手法とは
• まとめと活用事例
本日のストーリー
[p.13] PROTECTED 関係者外秘
本日のストーリー
• 社内AI の現在地
• トヨタのQMS（品質管理）における取り組み
• Qubee で構造化
• Qubee による構造化手法とは
• まとめと活用事例
[p.32] PROTECTED 関係者外秘
本日のストーリー
• 社内AI の現在地
• トヨタの品質管理における取り組み（QMS）
• Qubee で構造化
• Qubee によるタグ付け手法とは
• まとめと活用事例
[p.36] PROTECTED 関係者外秘
Prompt Learning
ピンポイントアクセスを可能にした、タグ定義の自動生成とタグ付け
[p.43] PROTECTED 関係者外秘
本日のストーリー
• 社内AI の現在地
• トヨタの品質管理における取り組み（QMS）
• Qubee で構造化
• Qubee による構造化手法とは
• まとめと活用事例
①QMS
②プロジェクトマネジメント
③開発支援

---
## [CDN221] ゲームチャットを支える技術
`事例セッション` / 85p / その他
services: Amazon API Gateway, Amazon DynamoDB, Amazon SQS

<まとめ>
[p.5] 目次
▸ゲームチャットサービス紹介/ 開発体制
▸システム構成
▸マルチリージョン運用
▸Amazon DynamoDB 開発事例紹介
▸まとめ
4 / 82
[p.6] 目次
▸ゲームチャットサービス紹介/ 開発体制
▸システム構成
▸マルチリージョン運用
▸Amazon DynamoDB 開発事例紹介
▸まとめ
5 / 82
[p.11] 目次
▸ゲームチャットサービス紹介/ 開発体制
▸システム構成
▸マルチリージョン運用
▸Amazon DynamoDB 開発事例紹介
▸まとめ
10 / 82
[p.20] 目次
▸ゲームチャットサービス紹介/ 開発体制
▸システム構成
▸マルチリージョン運用
▸Amazon DynamoDB 開発事例紹介
▸まとめ
19 / 82
[p.37] 目次
▸ゲームチャットサービス紹介/ 開発体制
▸システム構成
▸マルチリージョン運用
▸Amazon DynamoDB 開発事例紹介
▸まとめ
36 / 82
[p.39] Amazon DynamoDB 開発事例紹介
▸設計時に意識していたポイント
▸コスト効率を意識した設計
▸ユースケース主導
▸非正規化
▸開発事例紹介
▸ゲームチャットの開始フロー
▸状態遷移と結果整合
▸追加招待の読み込み不整合とその対応例
▸所感
38 / 82
[p.40] Amazon DynamoDB 開発事例紹介
▸設計時に意識していたポイント
▸コスト効率を意識した設計
▸ユースケース主導
▸非正規化
▸開発事例紹介
▸ゲームチャットの開始フロー
▸状態遷移と結果整合
▸追加招待の読み込み不整合とその対応例
▸所感
39 / 82
[p.41] コスト効率を意識した設計
設計時に意識していたポイント
▸Key-Value ストア
Partition Key
Sort Key
Value
Key01
0
Value01
Key02
0
Value02
Key03
0
Value03
Key03
1
Value04
40 / 82
[p.43] コスト効率を意識した設計
設計時に意識していたポイント
▸Key-Value ストア
▸アクセス種別やサイズにより消費Capacity Unit が変化する
Partition Key
Sort Key
Value
Key01
0
Value01
Key02
0
Value02
Key03
0
Value03
Key03
1
Value04
書き込みのコストが高い
42 / 82
[p.44] Amazon DynamoDB 開発事例紹介


---
## [CDN227] TBSテレビ「ラヴィット！」大規模配信の 裏側と AWS サーバーレス設計
`事例セッション` / 28p / アーキテクチャ/サーバーレス · 生成AI/エージェント
services: AWS Lambda, AWS Step Functions, Amazon API Gateway, Amazon Aurora, Amazon Bedrock, Amazon CloudFront, Amazon ECS, Amazon ElastiCache, Amazon Nova, Amazon RDS

<まとめ>
[p.4] 4
Agenda
実施したイベントの概要
Kustamie について
大規模配信に向けたサーバーレス設計
全体のアーキテクチャ
負荷低減のための工夫
Kustamie における生成AI の活用
まとめ
[p.13] 13
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
[p.26] まとめ
Kustamie はAWS のサーバーレスサービスをフル活用して、数万人規模の大規模配信を行うことができた
Amazon IVS を使って、大規模でも安定した映像配信・機能提供を実現
Amazon API Gateway ステージキャッシュ・AWS Lambda 関数のグローバル変数・Amazon
ElastiCache を組み合わせた多段キャッシュ構成
時間的コストの高い処理の非同期化して、API 全体のパフォーマンスを向上
また、AWS の生成AI サービスが安心・安全なプラットフォームの構築に寄与している
Amazon Nova モデルを使って、高速なコンテンツモデレーションを提供
26
は、2026 年秋のベータ版提供開始を予定しています！

---
## [DEV250] 「勝⼿に広まる」 ⼈気 AI エージェントを爆速で作ろう︕
`事例セッション` / 54p / 生成AI/エージェント
services: AgentCore, Amazon Bedrock, Amazon CloudWatch, Amazon S3, Claude, MCP, Strands Agents

<まとめ>
[p.32] AgentCore + Amplify のフルIaC 構成なので、
既存のエージェントを流⽤して、短時間で⾼度なアプリが作れる
すぐ作れるが、決して「オモチャ」ではないのがポイント。
そのまま商⽤デプロイできるベスプラ構成のままCDK 化
ユースケース発掘①バイブ商談

---
## [DEV351] AWS Security Hub CSPM の成功・失敗体験
`事例セッション` / 31p / セキュリティ
services: AWS Config, AWS Organizations, AWS Security Hub, AWS WAF, Amazon GuardDuty, Amazon S3

<まとめ>
[p.19] 成功体験・失敗体験からくる教訓まとめ
セキュリティは一朝一夕ではよくならない
→継続的に取り組み、周りを巻き込んで文
化を作ろう
既存の知見を活用して体制を整えよう
→運用ルールや仕組みの整備も適切に
[p.27] まとめ

---
## [DEV352] IaC コードを資産へ： AWS CDK 社内ライブラリと横断展開
`事例セッション` / 41p / その他
services: AWS CDK, AWS CloudFormation, Amazon Athena, Amazon Aurora, Amazon CloudFront, Amazon S3

<まとめ>
[p.16] CDK Construct 設計ポイント
[p.17] ①抽象化しすぎない
②再利用性を意識する
③更新の責務を閉じ込める
④開発者と利用者の境界を定める
CDK Construct 設計ポイント
[p.24] ●index.ts (バレルファイル)でexport するConstruct を最小限に
▸エントリーポイントを絞る(index.ts が境界)
▸ライブラリ開発側の自由度と利用側の使いやすさを両立
④開発者と利用者の境界を定める
ディレクトリ構成
index.ts (バレルファイル)
[p.26] ①抽象化しすぎない
②再利用性を意識する
③更新の責務を閉じ込める
④開発者と利用者の境界を定める
CDK Construct 設計ポイント

---
## [DVT210] SUBARU のエンジン設計現場発 －生成 AI ×設計業務改革－
`事例セッション` / 28p / 生成AI/エージェント
services: AWS Lambda, AgentCore, Claude, Strands Agents

<冒頭>
[p.2] 2/26
自己紹介
本間勇人
株式会社SUBARU
技術本部パワートレイン設計部
主査(モノ造り改革)
Honma    Hayato
エンジン設計部へ異動、以後パワートレイン設計部
⇒信頼性MBD推進, 衝突関連CAE解析
信頼性MBD推進部内DX推進
部内DX推進
2018
株式会社SUBARU エンジン性能開発部に配属
⇒エンジンの加速度/応力計測/締結評価
2021
2024
IT
の
勉
強
経歴
ハ
ー
ド
関
連
この仕事、大変！
どうすれば？
設計実務者
(非IT 技術者)
IT 技術者
何に困ってるの？
どうしたいの？
この業務は○○？
こういうフローで
いいかな？
現場に近い
(非IT 技術者)
私達の組織
支援
代弁
高速
ループ
2025
AWS 歴：約2 年
[p.3] 3/26
話すこと：
話さないこと：
・Generative AI Use Cases (GenU)の魅力
・AWS サービスの詳細
・パワートレイン設計部の生成AI 導入
・生成AI の回答精度
・全社的な生成AI の取組
・今日から始められる具体的なステップ
Today’s Agenda
[p.4] 4/26
Today’s Agenda
1. はじめに
2. Generative AI Use Cases (GenU)の魅力
3. 導入経緯と効果
4. 見えてきた課題と解決策
5. 「探す」から「実行する」AI エージェントへ
6. 具体的な業務自動化の実装例
7. 非IT 技術者でも、今日から始められる具体的なステップ
[p.5] 5/26
質問
確認
1. はじめに
ToBe
設計現場は“探す”に時間を溶かしている
ツール探し
検索
確認
再調査
調べたいことに合う
調査ツールを探す
検索条件の入力
大量の
結果確認
別の調査
ツールで検索
人に聞く・・・
AsIs
ユ
ー
ザ
ー
ユ
ー
ザ
ー
チャットで調べたい
ことを入力
回答確認
ツ
ー
ル
この時間で別の仕事ができる！
どう使うんだっけ
結果
いっぱい・・・
分からない・・・
ツール
どこだっけな
いつも使う
アプリね
とりあえず
チャットしてみよ

---
## [IND214] 三井住友信託銀行の戦略的 AWS 投資と 組織イノベーション三井住友信託銀行の戦略的 AWS 投資と 組織イノベーション
`事例セッション` / 15p / 組織/内製化
services: AWS CloudFormation, AWS CloudTrail, Amazon Aurora, Amazon Bedrock, Amazon CloudWatch, Amazon Inspector, Strands Agents

<まとめ>
[p.2] 1
自己/会社紹介
３～５
2
AWSとの歩み
６～８
3
AWSとの協業
９～１２
4
組織変革と人材育成への取り組み
１３
5
まとめ
１４
目次
2
[p.14] © 2026 SUMITOMO MITSUI TRUST BANK, LIMITED All rights reserved.
まとめ～これまでの成果と今後のパートナーシップ～
1. 集約メリット
IT 環境・開発プロセスのシンプル化
Migration for
Resiliency/Security/Agility
2. 標準化の取り組み
標準化・生成AI 活用
All-Out Cloud Factory による
共創推進
3. 組織変革
Tech Journey に３０００名強参加
Amazon Culture でモノづくりを大
事にする文化を醸成
次なる新たなステージの像
→お客さま一人一人のオーダーメイド・サービスインフラの提供
→少量多品種のスケール実現が可能
→AWS の効率性を徹底し、自らの技術力を向上
イノベーションを推進する環境（クラウド）と次世代AI 人材（カルチャー）の両面でAWS をパートナーとして推進
三井住友信託銀行だけの「ダ・ヴィンチエンジニアリング」の確立へ
14
5

---
## [IND230] ステーブルコイン「JPYC」を支える AWS －統制とスタートアップスピードの両立－
`事例セッション` / 24p / セキュリティ
services: AWS CloudTrail, AWS Config, AWS IAM, AWS Security Hub, AWS Systems Manager, Amazon ECS, Amazon GuardDuty, Amazon S3

<冒頭>
[p.2] ©️JPYC Inc.
ステーブルコイン「JPYC」を支えるAWS
－統制とスタートアップスピードの両立－
2026年6月26日
[p.3] ©️JPYC Inc.
自己紹介
3
松岡慧
執行役員/ 計画情報部長
2023 年にJPYC株式会社へ入社。
Web エンジニアとして、フロントエンド、バックエンド、スマートコ
ントラクト、クラウドインフラまで幅広い領域の開発に従事。
現在は執行役員・計画情報部長としてシステムリスク管理を統
括し、セキュリティおよびIT ガバナンス体制の強化を推進。
情報処理安全確保支援士。
[p.4] ©️JPYC Inc.
JPYC とは
4
JPYC = Japanese Yen Coin
銀行振込
JPYC 発行
JPYC 移転
銀行振込
ブロックチェーン上で利用
法律上は
電子決済手段
[p.5] ©️JPYC Inc.
2022 年資金決済法改正
5
電子決済手段が法定化
After
Before
電子決済手段
資金移動業
前払式支払手段

---
## [IND237] 「 AI エージェントが店長になる日」 －小売 DX 次の 10 年－
`事例セッション` / 29p / 生成AI/エージェント
services: AWS Glue, AWS Lambda, AgentCore, Amazon Bedrock, Amazon DynamoDB, Amazon EventBridge, Claude

<まとめ>
[p.19] // AWS tech point
P.18 / Feature 1 · realtime
AWS 技術ポイント
// 今年のポイント: LLM application からproduction-minded agent architecture へ
© 2026 Toshiba Tec Corporation
💡従来のバッチ処理（日次）→ 任意のタイミングで定期実行
予め定義したサイクルで、ユーザー指示無しにエージェントがPOS DB に直接SQL を実行。
業務時間中の売れ行きを自律的に分析し、予算と対比した上で、必要なアクションをリコメンドする
等のユースケースに対応した。
Point 1 ：自律的にデータを監視
Amazon Bedrock
AgentCore Runtime
Amazon EventBridge Scheduler
AWS Lambda
POS DB
system
prompt 取得
Agent 起動
定期実行
AWS Cloud
店舗
POS
Amazon DynamoDB
[p.23] // AWS tech point
P.22 / Feature 3 · few-shot
AWS Glue からスキーマ情報を取得しPOS DB へSQL 発行。
店長知見（施策例）をDynamo から取得し、実行アクションを立案。
// 今年のポイント: LLM application からproduction-minded agent architecture へ
© 2026 Toshiba Tec Corporation
あなたはデータベースを分析し、店舗運営のために推奨する施策
があれば、それを提出するエージェントです。
## 現在日時
{current_time}
## 分析ルール、施策、推奨基準など
{system_prompt}
## 出力方法
あなたの分析結果と推奨施策は、（省略）
## データベース情報
{table_info}
Point 3：データベース構造の理解
Amazon Bedrock
AgentCore Runtime
AWS Glue Data Catalog
Amazon DynamoDB
システム
プロンプト
データベース
スキーマ情報
[p.27] // aws tech point · multi-agent
P.26 / AWS tech — open-to-close support
AWS 技術ポイント— 本番運用を想定したagentic workload
© 2026 Toshiba

---
## [IND242] 5GC on AWS のサービス開始と Agentic AI による構築自動化
`事例セッション` / 49p / 生成AI/エージェント
services: AgentCore, Amazon Bedrock, Amazon EKS, Amazon RDS, Amazon Route 53, Amazon VPC, MCP

<まとめ>
[p.32] ⓒ2026 NTT DOCOMO, INC. All Rights Reserved.
パブリッククラウドの特性
Page 32
特性
ポイント
固定費から変動費
事前の投資が不要
数年先を見据えた投資が不要
利用料とその変動を注視する必要
コスト最適化
ハードウェアに対する運用・保守が
不要
保守運用稼働の低減効果
セキュリティ観点の考慮
キャパシティ予測不要
余剰リソースへの投資が不要
必要時のみ必要リソースを確保
スケールメリット享受
巨大クラウドによる規模メリット
上手に使えばコスト低減期待
スピードと俊敏性
リソース調達が瞬時に可能
予測できない需要への対応迅速化
グローバルデプロイ
世界中の拠点を利用可能
拠点を用意する必要がない
用意された拠点からの選択
パブリッククラウド上での5G コア実装
[p.40] ⓒ2026 NTT DOCOMO, INC. All Rights Reserved.
まとめ
• ドコモはネットワークの可用性、柔軟性、迅速性向上の観点および
環境負荷低減の可能性を訴求しパブリッククラウドの活用を開始
• NF ごとの特性を踏まえパブリッククラウドへの適用性を評価
Page 40
パブリッククラウド上での5G コア実装

---
## [IND244] マーケットデータ× AI Agent ― "閉ざされたデータ"を"開かれた価値"に変える 日本取引所グループの実践
`事例セッション` / 36p / セキュリティ · データ分析/基盤 · マイグレーション/モダナイゼーション
services: AWS Step Functions, Amazon Q, Claude, MCP

<まとめ>
[p.12] 12
© 2026 Japan Exchange Group, Inc., and/or its affiliates
J-LAKE
アーキテクチャ設計のポイント
クラウド採用による個別最適化選好と
データ散在
データの散在と一元管理の両立
課題
解決の方向性
セキュリティ対策など最新のソリューショ
ンを採用しやすい
鈍重なシステム統合よりもアジリティを優
先したサービス構築計画
サービス間でデータ連携・複製することに
よる時間・リソースの非効率
AWS Lake Formation
×データメッシュ
個別最適化とデータ散在の許容
カタログ管理・アクセス管理を一元的に統合
データは複製を前提とせず、間接参照を許容
※リソースネックとなる場合を除く

---
## [IND248] ソニーのスポーツ領域への新たな挑戦
`事例セッション` / 36p / その他
services: Amazon SNS

<冒頭>
[p.2] ソニーのスポーツ領域での新たな挑戦
－クラウドでの大規模ライブプロダクションシステムの構築から、
さらにその先の映像コンテンツとの融合を目指して－
Copyright 2026 Sony Marketing Inc.
[p.3] 3
Copyright 2026 Sony Marketing Inc. B2B Business Unit
自己紹介
■ 主な業務
•
映像制作市場を中心として営業・企画
/マーケティングに従事
MXF・4K HDR ・IP・5G など、これまでの業界内での先進技術に携わる
•
現在は映像制作業界向けシステムソリューションの技術統括をしながら
企画/マーケティング側ではテクノロジーエバンジェリストとして活動
昨年 12 月からは新規ビジネスの立ち上げにも従事
趣味：鉄道
小貝 肇（こがい はじめ）
ソニーマーケティング株式会社
B2Bビジネス本部
メディアソリューション技術部
統括部長
B2Bビジネス1部 テクノロジーエバンジェリスト
クリエイティブクロスハブ推進室
室長
[p.4] 4
Copyright 2026 Sony Marketing Inc. B2B Business Unit
[p.5] 5
Copyright 2026 Sony Marketing Inc. B2B Business Unit
相反する課題をソニーのテクノロジーの力で解決へ
動画需要の拡大
海外展開のビジネスチャンス
労働力の減少
手作業で減らない労働時間

---
## [MAM202] 創業 100 年の酒屋カクヤスが挑む、 生成 AI で実現するシステム革命
`事例セッション` / 25p / マイグレーション/モダナイゼーション · 生成AI/エージェント
services: Amazon Bedrock, Amazon EC2, Amazon RDS, Claude

<冒頭>
[p.2] A W S  S U M M I T  /  2 0 2 6
転
生
創業1 0 0 年の酒屋「カクヤス」が挑む、
生成A I で実現するシステム革命。
酒類卸→物流業へ。
基幹刷新は、ITプロジェクトではない。
会社を「転生」させる、最初で最後の心臓手術。
S t r a t e g i c C o n s u l t i n g × I T A r c h i t e c t u r e
C O N F I D E N T I A L
[p.3] 目次
/  C O N T E N T S
この物語の四幕
起承転結で読み解く、酒類卸DX の航海日誌。
起
P R O L O G U E
最後のチャンス
30 年不変の基幹システム。正体は過去の遺産。
承
D E S C E N T
絶望の迷宮
VB.NET 2,200 画面・Oracle 3,000 表・ストアド1,200 本。
設計書なし。
転
P I V O T
二つの駆動輪
AI 駆動×業務駆動。450 人月の絶望を現場とAI で突破。
結
R E S O L V E
道半ばの覚悟
経営は社名を変え、現場は走る。終わりではなく、入口だ。
2 / 23
転生─ D X T R A N S F O R M A T I O N
[p.4] A C T  Ⅰ
最後のチャンス
30 年動き続けたシステムは、過去の遺産だ。
刷新とは、業態を変える「最初で最後の心臓手術」である。
3 / 23
転生─ D X T R A N S F O R M A T I O N
[p.5] 起
─ 0 1  /  T H E L E G A C Y
「動いている」は、「健康」を意味しない。
30 年動き続け、誰も触れず、中身も分からなくなった。
1 9 9 5
誕生
VB.NET の祖先、Oracle の初版
酒類卸に最適化して建てた城。
2 0 2 5
膠着
建増しを重ね、
「触れない」「読めない」「直
せない」三拍子
保守ベンダー依存が常態化。
2 0 2 8
転生
「物流業」として生まれ変わる
基幹刷新は、新しい生命を造る
手術。
「今変わらなければ、変われない」── 経営の言葉。
4 / 23
転生─ D X T R A N S F O R M A T I O N

---
## [MAM206] DX から AX へ：AI で加速する NEC の コーポレート・トランスフォーメーション ― AI ネイティブを目指した AI プラットフォームの活用 ―
`事例セッション` / 29p / その他
services: Claude, Kiro, MCP

<冒頭>
[p.2] © NEC Corporation 2026
1991年NEC入社。
入社以来、社内ITに関わる企画業務に従事。
主にコラボレーション領域のNECグループ共通基盤、
インフラ高度化の企画・構築を担当。
2018年より経営システム統括部長として社内DX推進を統括
2026年より現職
中田俊彦
NEC CIO 兼
コーポレートIT・AIイノベーション部門長
[p.3] 3
© NEC Corporation 2026
[p.4] © NEC Corporation 2026
NEC Group Internal Use Only
4
4
© NEC Corporation 2026
制度・
プロセス/データ
組織
IT
2025 中期経営計画
カルチャー変革「変わり続けることを文化へ」
2020 中期経営計画
カルチャー変革「変化の受容」
2018 中計
取り下げ
米国
上場廃止
構造改革
断行
コーポレート・トランスフォーメーション
~DX からAX へ~
高品質なデータの収集を実現する経営基盤へ進化（データドリブン経営の実現）
経営
2008
2018
2021
2024
2017
2012
データ
利活用
経営情報の
可視化
One Data Platform
経営コックピット/ダッシュボード
SAP
S/4HANA
+BI ツール
経営陣のコミットメント
グランドデザイン策定
全社横断でのコーポレート・
トランスフォーメーション組織の進化
Transformation Office
データマネジメント専任組織
AX 変革の求心力
クラウドネイティブ・
クリーンコア
会計システムの統一化
クラウドリフト
SAP ERP（標準）
Side-by Side
SAP BTP
In-App拡張
クリーンコア
SAP ERP（カスタマイズ）
RISE with SAP
G1（SAP ERP)
SAP S/4HANA on AWS
基幹系
業務OP
基幹系
業務OP
プロセス/データ全社標準化
経営の高度化/
標準化データ活用
AI プロセス変革
2026
AI ネイティブ
カンパニーへ
AI Ready Data
CAXO
AI エージェント
ビルトイン
AI がパートナー
AI が機能するデータ
（オントロジー）
AI プロセス
インテリジェンス
[p.5] © NEC Corporation 2025
NEC Group Internal Use Only
5
5
© NEC Corporation 2026
AI は新たな産業革命。AI を駆使して人・

---
## [MAM241] 統制された自由」の実現 －電通グループ 140 社を支える AI 時代の IT ガバナンス－
`事例セッション` / 19p / セキュリティ · マイグレーション/モダナイゼーション
services: AWS CloudFormation, AWS CloudTrail, AWS Config, AWS IAM, AWS Organizations, AWS WAF, Amazon GuardDuty, Amazon VPC

<まとめ>
[p.16] AI Agent 時代の管理アーキテクチャ構想
業務データへのアクセス点を集約し、認証・認可・観測をグループで一元管理する
認証
何のエージェントがあるのかを一元的に把握し、個別ID 乱立を抑制。
特に基幹システムと外部連携するようなシステムは統合管理を行う。
制御ポイント
業務システムへの単一の入り口を設け、LLM 利用実態を一元管理する。
認可結果を適用する制御点としても活用。
観測
プロンプトのバージョン管理、LLM コール数やコストを可視化。
ログを保管し、インシデント発生時の事後分析・原因追跡に活用。
構想中
