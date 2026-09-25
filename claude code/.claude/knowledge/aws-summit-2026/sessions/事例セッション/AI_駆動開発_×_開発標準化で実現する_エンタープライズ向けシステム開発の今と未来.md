---
title: "AI 駆動開発 × 開発標準化で実現する エンタープライズ向けシステム開発の今と未来"
category: "事例セッション"
session_id: "AIM310"
pages: 24
topics: ["AI駆動開発"]
services: ["AgentCore", "Amazon Bedrock", "Amazon S3", "Claude", "Kiro", "MCP"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/事例セッション/AI 駆動開発 × 開発標準化で実現する エンタープライズ向けシステム開発の今と未来.pdf"
---
# AI 駆動開発 × 開発標準化で実現する エンタープライズ向けシステム開発の今と未来


## p.1

AIM310
AI 駆動開発× 開発標準化で実現する
エンタープライズ向けシステム開発の今と未来
所年雄
トランスコスモス株式会社
上席常務執行役員エンジニアリング統括本部長


## p.2

2
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


## p.3

3
バイブコーディング(AI 駆動開発)が広がったきっかけ
https://x.com/karpathy/status/1886192184808149383
2025 年2 月Andrej Karpathy 氏の投稿が一つの契機
（OpenAI 社創設メンバーの一人）
Vibes＝その場のノリのコーディング


## p.4

4
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


## p.5

5
AI 駆動開発の弱点
Vibes のノリのままだと、
大規模開発に使えない
組織的にAI 駆動開発を利用する
スキームを定義する必要がある


## p.6

6
Vibes のコーディングから進化したAI 利用の開発環境「Waterfall Boost」
Vibes のノリを取り除いて企業ユースに耐えられる
AI を利用したシステム開発環境
Waterfall Boost


## p.7

7
Vibes のコーディングから進化したAI 利用の開発環境「Waterfall Boost」
Waterfall Boost は、AI が開発をリードする「Procedural Agent」、
AI がドキュメントを評価する「QA Agent」、AI が生成するソースコードを制御する「Coding Agent」の
3 つのAgent 群により構成
要件定義書
詳細設計書/
設定ファイル
実装コード/
Pull Request
テスト結果/
品質レポート
リリースノート/
デプロイ記録
改善PR/
運用ドキュメント
基本設計/ADR
七賢者の
ドキュメントレビュー
自社
開発ポリシーの反映
Phase 1
要件定義
Phase 2
基本設計
Phase 3
詳細設計
Phase 5
結合テスト
Phase 7
保守運用
Phase 4
反復開発・実装
Procedural Agent が実行タスクと成果物を理解して人間をリードする
Phase 6
本番リリース
Waterfall Boost
①Procedural Agent (AI が開発をリード)
②QA Agent (AI が品質を担保)
③Coding Agent (AI が開発標準化を推進)


## p.8

8
各Agent は、自身の作業に必要な情報や、次の手順の確認をするために、
「Agent Knowledge Base」にアクセスし、決められたルールに従って開発作業を進行する。
「Waterfall Boost」は、ノウハウやルールを必ず遵守する仕組み
①Procedural Agent (AI が開発をリード)
②QA Agent (AI が品質を担保)
③Coding Agent (AI が開発標準化を推進)
Waterfall Boost
Agent Knowledge Base
MCP
Agent Knowledge Base には、これまで当社
が開発業務の中で培って来たルールや規約、
知財が登録されており、そこにルールがある
限り、Agent はエンジニアの指示より、
Knowledge Base の情報に必ず従う。
AI 開発IDE
+
AI Coding Agent
• kiro
• VSCode
• Eclipse
• IntelliJ IDEA
…etc
＋
• Claude code
• Github Copilot


## p.9

9
各Agent は、自身の作業に必要な情報や、次の手順の確認をするために、
「Agent Knowledge Base」にアクセスし、決められたルールに従って開発作業を進行する。
「Waterfall Boost」は、ノウハウやルールを必ず遵守する仕組み
Waterfall Boost
Agent Knowledge Base
Agent Knowledge Base には、これまで当社
が開発業務の中で培って来たルールや規約、
知財が登録されており、そこにルールがある
限り、Agent はエンジニアの指示より、
Knowledge Base の情報に必ず従う。
AWS プロフェッショナルサービスに
ご支援いただいた範囲
Cognito×GitHub 認証によってGitHub Enterprise を利用可能な
エンジニアからのMCP サーバアクセスに限定。
Amazon Bedrock × Amazon S3 Vectors・Index 構成のナレッジ
ベースを参照。
Amazon Bedrock AgentCore Gateway を介してAmazon S3 上の
ナレッジベースに格納されたトランスコスモスの開発ナレッジや
標準開発規約を参照したり、GitHub 内に格納された標準コンポー
ネント情報をAgent が参照。
エンジニアが過去の知財や事例を意識的に検索することなくMCP
経由でナレッジベースから開発に必要なナレッジを参照すること
が可能。


## p.10

10
AWS re:Invent 2025 でのあるセッション
AI 駆動開発のセッションの殆どが抽象的な内容の中、1 社だけ当社と同様な考え方で環境構築
AWS re:Invent2025
DVT217:Generative AI, agents, MCP, and the future of AI-powered software development より引用


## p.11

11
Waterfall Boost は、AI が開発をリードする「Procedural Agent」、
AI がドキュメントを評価する「QA Agent」、AI が生成するソースコードを制御する「Coding Agent」の
3 つのAgent 群により構成
Vibes のコーディングから進化したAI 利用の開発環境「Waterfall Boost」
要件定義書
詳細設計書/
設定ファイル
実装コード/
Pull Request
テスト結果/
品質レポート
リリースノート/
デプロイ記録
改善PR/
運用ドキュメント
基本設計/ADR
七賢者の
ドキュメントレビュー
自社
開発ポリシーの反映
Phase 1
要件定義
Phase 2
基本設計
Phase 3
詳細設計
Phase 5
結合テスト
Phase 7
保守運用
Phase 4
反復開発・実装
Procedural Agent が実行タスクと成果物を理解して人間をリードする
Phase 6
本番リリース
Waterfall Boost
①Procedural Agent (AI が開発をリード)
②QA Agent (AIが品質を担保)
③Coding Agent (AIが開発標準化を推進)


## p.12

12
Procedural Agent が実行タスクを理解して人間をリードする
Phase 1
要件定義
Phase 2
基本設計
Phase 3
詳細設計
Phase 5
結合テスト
Phase 6
本番リリース
Phase 7
保守運用
Phase 4
反復開発・実装
開発プロジェクトをリードして人の怠けを許さない「Procedural Agent」
ビジネス要件
機能要件
非機能要件定義
Architecture 設計
技術スタック選定
ADR 作成
API/Data Model/
インフラの設計
PJ 本体のSetup
Epic/User Storyの
Issue 作成→TDD→
実装→Code Review
→ CI/CD・マージ
統合テスト
E2E テスト
負荷テスト
リリース作成
承認フロー
本番デプロイ
監視・アラート
バグ修正
機能改善
ドキュメント保守
詳細設計書/
設定ファイル
実装コード
Pull Request
テスト結果
品質レポート
リリースノート
デプロイ記録
改善PR
運用ドキュメント
   
       
    
    
       
     
 
   
  
 
  
   
 
 
 
 
     
 
  
 
 
 
  
 
 
    
 
  
 
 
 
  
 
 
 
  
    
 
 
 
       
      
     
    
   
        
           
        
 
       
 
     
                   
 
 
AI が各Phase で設定された実行タスクをリードし、人と会話しながら開発を進行
開発工程
実行
タスク
中間
成果物
要件定義書
基本設計書/ADR
次Phase で
参照
生成される
中間成果物
人がやること
①Procedural Agent (AI が開発をリード)


## p.13

13
AI がやるべき仕事、人がやるべき仕事を明確化
Phase 1
要件定義
Phase 2
基本設計
Phase 3
詳細設計
Phase 4
反復開発
Phase 5
結合テスト
Phase 6
本番リリース
Phase 7
保守運用
①Procedural Agent
Task
Output
• ビジネス要件
• 機能要件
• 非機能要件の定義
• アーキテクチャ設計
• 技術スタック選定
• ADR 作成
• API、データモデル、インフラの設計
• プロジェクト本体のセットアップ
• Epic/User Story のIssue 作成
→TDD→実装→コードレビュー
→ CI/CD・マージ
• 統合テスト
• E2E テスト
• 負荷テスト
• リリース作成
• 承認フロー
• 本番デプロイ
• 監視・アラート
• バグ修正、機能改善
• ドキュメント保守
• 要件定義書
• 基本設計書/ADR
• 詳細設計書
• 設定ファイル
• 実装コード
• Pull Request
• テスト結果
• 品質レポート
• リリースノート
• デプロイ記録
• 改善Pull Request
• 運用ドキュメント
AI(Agent)がやること
人がやること
• 設計書草案生成とそれに必要な質問
• 設計書作成
• 既存コード解析・説明
• 要件定義草案作成とそれに必要な質問
• 要件定義書作成
• 設計方針決定
• 質問への回答
• 設計草案レビュー
• 整合性確認
• 設計書の修正
• 開発方針の伝達
• 質問への回答
• 要件定義書草案レビュー
• 整合性確認
• 要件定義書の修正
• タスク優先度決定
• リソース計画
• 実行計画承認
• Issue 内容確認・修正
• PR 内容レビュー
• 成果物の動作確認
• IaC ベースの設定内容確認
• パイプライン検証
• セキュリティ確認
• タスク分解支援
• テスト方針提案
• 実行計画案作成
• Issue 自動生成、登録
• Coding Agent による実装・単体テスト自動生成・実行
• CI/CD 設定ファイル生成
• パイプライン最適化提案
• IaC コード・設定ドキュメント生成
• テストケース生成
• テストコード生成
• バグ分析・修正提案
• テスト観点とケースレビュー
• テスト実施・確認
• 品質基準判定
• 移行スクリプト生成
• データ変換支援
• 環境設定ファイル作成
• データ移行計画
• 本番環境承認
• セキュリティ確認
• モニタリング設定
• 障害分析支援
• 改善提案・実装支援
• リリース判断
• 運用体制構築
• 最終意思決定


## p.14

14
Vibes のコーディングから進化したAI 利用の開発環境「Waterfall Boost」
人が要件定義書のレビューをして
承認した後に次Phase に進行


## p.15

15
AI が生成した成果物を7 人のペルソナAI がチェックする「QA Agent」
Waterfall Boost は、AIが開発をリードする「Procedural Agent」、
AIがドキュメントを評価する「QA Agent」、AIが生成するソースコードを制御する「Coding Agent」の
3 つのAgent 群により構成
七賢者の
ドキュメントレビュー
Waterfall Boost
QA Agent は上流工程の品質課題を解決
ウォーターフォール型開発では、
ドキュメントの精度が悪いと
成果物の品質も劣化するという課題を、
マルチLLM で7 人のペルソナが
7 つの観点からチェックして課題があれば
改善点をフィードバック
②QA Agent (AI が品質を担保)


## p.16

16
既存開発手法でもAI を活用したシステムドキュメントの品質管理を実施
レビューと工程管理による品質管理とともに、そのルールを徹底させるために、開発工程ごとにAI が成果物の
チェックをし、それをもとにしたテストで合格判定がされない限りリリースできない仕組み。
AI が成果物をチェック
AI がテスト結果を評価
AI がテスト計画書を自動生成
AI が実装・コードレビュー
開発の各工程の成果物をAI がチェックし、テスト計画書をAI が自動生成して、テスト結果をAI が判定する。


## p.17

17
AI による実装をコントロールしリスクのないコードを生成する「Coding Agent」
Waterfall Boost は、AIが開発をリードする「Procedural Agent」、
AIがドキュメントを評価する「QA Agent」、AIが生成するソースコードを制御する「Coding Agent」の
3 つのAgent 群により構成
Waterfall Boost
自社
開発ポリシーの反映
Coding Agent はソースコードの
品質課題を解決
AI が生成したソースコードが
ブラックボックス化して著作権や
脆弱性の課題が発生するのを防ぐ、
自社ポリシーに則ったコーディングや、
既存知財の再利用を促進
③Coding Agent (AI が開発標準化を推進)


## p.18

18
AI による実装をコントロールし、開発標準化を実現するCoding Agent
開発ノウハウが蓄積されたナレッジへアクセスして生産性を向上するとともに、
標準化された設計書に基づくドキュメント作成や、開発済みのUI 、コンポーネントが実装され、
AI の実装をコントロール
トランスコスモス社内に蓄積された開発資産の活用
コーディングルール・ドキュメントテンプレート
UI コンポーネント集/プロジェクトノウハウ
エンジニアに意識をさせない開発標準化を実現


## p.19

19
コンポーザブルアーキテクチャによるAI 駆動開発の効率最大化
AI 駆動開発によってコンポーネントの大量開発が可能となり、さらなる開発工数の圧縮、開発効率の最大化が可能。
コンポーネントライブラリ
直接組み込みコンポーネント
API 利用コンポーネント
コンポーネント
①
コンポーネント
③
コンポーネント
②
コンポーネント
④
コンポーネント
⑤
コンポーネント
⑦
コンポーネント
⑥
コンポーネント
⑧
API Gateway
Data Storage
独自UI/ロジック開発
(オリジナルUI/ロジック実装)
オーケストレーションプラットフォーム
汎用UI/ロジック提供
(ノンカスタマイズ)
利用ユーザー(クライアント/エンドユーザー)
etc.
Infrastructure
コンポーネント
コンポーネント
実装時に直接組み込み
Platform
Layer
Business
Capability
Layer
Application
Layer
AI
駆
動
開
発
コ
ン
ポ
ー
ネ
ン
ト
の
AI
駆
動
開
発
①コンポーネント
情報の共有
③コンポーネントを
利用した実装
②コンポーネント情報の
問い合わせ
③Coding Agent (AI が開発標準化を推進)


## p.20

20
Vibes のコーディングから進化したAI 利用の開発環境「Waterfall Boost」
Waterfall Boost は、AI が開発をリードする「Procedural Agent」、
AI がドキュメントを評価する「QA Agent」、AI が生成するソースコードを制御する「Coding Agent」の
3 つのAgent 群により構成
要件定義書
詳細設計書/
設定ファイル
実装コード/
Pull Request
テスト結果/
品質レポート
リリースノート/
デプロイ記録
改善PR/
運用ドキュメント
基本設計/ADR
七賢者の
ドキュメントレビュー
自社
開発ポリシーの反映
Phase 1
要件定義
Phase 2
基本設計
Phase 3
詳細設計
Phase 5
結合テスト
Phase 7
保守運用
Phase 4
反復開発・実装
Procedural Agent が実行タスクと成果物を理解して人間をリードする
Phase 6
本番リリース
Waterfall Boost
①Procedural Agent (AIが開発をリード)
②QA Agent (AIが品質を担保)
③Coding Agent (AIが開発標準化を推進)
Vibes のノリを取り除いて企業ユースに耐えられる
AI を利用したシステム開発環境
Waterfall Boost
再現性のある、AI を利用したシステム開発環境で、
エンタープライズ企業向けのシステム開発にも利用可能な、
「AI 駆動開発(AI Driven Development)」を提供いたします。


## p.21

21
AI 利用の開発環境「Waterfall Boost」により実現される開発効率化
Phase 1
要件定義
Phase 2
基本設計
Phase 3
詳細設計
Phase 5
結合テスト
Phase 7
保守運用
Phase 4
反復開発・実装
Phase 6
本番リリース
従来開発
Waterfall
Boost で
開発した場合
トータル工数
3.5 人月×3 ヶ月=1,680h
10 ％〜32 ％の工数削減
従来開発工数：3,680h に対して、
1,200h
55 %〜75 ％の
工数削減
800h
38 %〜55 ％の
工数削減
弊社におけるWaterfall Boost を利用した開発実績を元にした工数削減の例
※要件の具体性や技術スタック等の条件により上記試算の範囲外となる場合があります。
最大工数
：2,548h
工数削減率：30.76 ％
最小工数
：1,802h
工数削減率：51.02 ％〜


## p.22

22
AI 駆動開発環境を必要とするクライアントの内製開発チームやSIer に提供
クライアント(内製開発/SIer)
Forward
Deployed
Engineer
AI 駆動開発環境の提供
＋
FDE の常駐
現場の改善要望の持ち帰り
Component
Knowledge
UI Template
Waterfall Boost
Component
Knowledge
UI Template
Waterfall Boost
自社プロダクトのアップデート
内製開発チームやパートナー企業にWaterfall Boost 環境を提供
自社のFDE を通じて、より良いAI駆動開発環境へ進化させる
トランスコスモス
1
次世代AI 駆動開発PF の開発
2
要望を機能アップデートに反映
3
現場知をプロダクト価値に転換
1 AI 駆動開発環境の導入支援
2 AI 活用の啓蒙・利用促進
3 導入効果の計測と改善
4 現場の改善要望の回収
FDE
Forward
Deployed Engineer
①Procedural Agent
②QA Agent
③Coding Agent
①Procedural Agent
②QA Agent
③Coding Agent


## p.23

23
完全自律型システム開発AI エージェントの実現に向けて挑戦開始
PHASE 1
要件抽出/ タスク化
1
人間がクライアントとMTG し
た録音データを音声のまま
AI に投入→ 議事録化
2
AI が議事録からシステム開発に
必要な機能要件・作業をタスク
に自動分解して整理
3
整理済みタスクをAI が人間に
提示→ 人間が確認
PHASE 2
仕様化/ QA ループ
4
開発に必要な既存仕様書・設計
書等ををAI が作成
5
AI が仕様や解釈の不明点を自ら
QA 化して人間に質問
6
QA に対する人間の回答でAI は
自身の理解度を深め、設計書等
に齟齬がないかを再確認
PHASE 3
開発/ モック/ デプロイ
7
最終設計書をもとにAI が開発作
業を開始
8
開発環境でモックを生成
→ 人間が確認
9
問題なければAI が本番環境でシ
ステムを完成させ、リリース
これからのエンジニア(人間)は、クライアントが作りたいシステムの情報を聞いてくる係。
過不足があればQA 担当のAI エージェントが人間に質問してくれるので、必要に応じてクライアントに再質問して情報を補足。
議事録からTask 化
PJ 全体管理
仕様書作成
Check/QA
実装
クライアントと
会話したデータを格納
不明点は質問
最終レビュー


## p.24

本セッションのアンケートへ
ご協力をお願いします
Please give us your feedback
Thank you!
AIM310
