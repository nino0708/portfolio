---
title: "AI が開発／運用しやすいクラウド サーバーレスの視点から考える設計原則"
category: "AWSセッション"
session_id: "CNS449"
pages: 114
topics: ["AI駆動開発", "アーキテクチャ/サーバーレス"]
services: ["AWS Lambda", "AgentCore", "Amazon API Gateway", "Amazon DynamoDB", "Amazon S3", "Amazon SQS", "Claude", "Kiro", "MCP"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/AWSセッション/AI が開発／運用しやすいクラウド サーバーレスの視点から考える設計原則.pdf"
---
# AI が開発／運用しやすいクラウド サーバーレスの視点から考える設計原則


## p.1

CNS449
AI が開発／運用しやすいクラウド
サーバーレスの視点から考える設計原則
淡路大輔
アマゾンウェブサービスジャパン合同会社


## p.2

コーディングエージェントは使っていますか？
Kiro, Claude Code, Cline etc…


## p.3

• コンテキストエンジニアリング
• 最適なソフトウェアの構造を考える
• 最適なサーバーレスアーキテクチャを考える
• まとめ
Agenda


## p.4

Daisuke Awaji
4
@gee0awa
Serverless, Generative AI, Frontend ❤️
Amazon Web Services Japan
Solutions Architect


## p.5

ソフトウェア開発・運用をAI に委譲できるか
AWS Cloud（A省Xシステム）
GitHub
開発者
開発エージェント
AWS Cloud
CI/CD
バックログ管理
要件定義
エンドユーザー
ヒアリング
・・・
GitHub Issue / PR
（機能追加リクエスト）
実装・テスト
運用エージェント
異常検知
セキュリティ
レビュー
是正措置
ログ・メトリクス・アラート
傾向分析
GitHub Issue / Pull Request 起票
本番環境
テスト環境
原因特定


## p.6

ソフトウェア開発・運用をAI に委譲できるか
AWS Cloud（A省Xシステム）
AWS Cloud
AI エージェントにとって開発・運用しやすくするには
クラウドの構成やソフトウェアをどう設計すべきか？


## p.7

Multi-agent Orchestration Chat on AgentCore
Bedrock AgentCore で稼働するAI エージェントのOSS サンプル– 通称MOCA
プロンプトやツールをカスタマイズし、コーディングエージェントや運用エージェントも作れる
パソコンでもスマホでも
（モバイルフレンドリーなチャットUIのサンプルとして）
AI エージェントを作る
（システムプロンプト・ツールを組み合わせて）
https://github.com/aws-samples/sample-multi-agent-orchestration-chat-on-agentcore


## p.8

Multi-agent Orchestration Chat on AgentCore
Bedrock AgentCore で稼働するAI エージェントのOSS サンプル– 通称MOCA
プロンプトやツールをカスタマイズし、コーディングエージェントや運用エージェントも作れる
パソコンでもスマホでも
（モバイルフレンドリーなチャットUIのサンプルとして）
AI エージェントを作る
（システムプロンプト・ツールを組み合わせて）
https://github.com/aws-samples/sample-multi-agent-orchestration-chat-on-agentcore


## p.9

コーディングエージェントを使っていて
性能が悪化したと感じたことはありませんか？


## p.10

コンテキストロット（腐敗）
すべてのLLM は入力長・プロンプト長に応じて性能が劣化する
出典: Chroma Research (2025) — 18 frontier models evaluation
18 モデル全てで劣化を確認
Claude Sonnet 4, GPT-4.1, 
Gemini 2.5 Flash, Qwen3-32B を含む
問題は容量ではなく、ノイズの蓄積
T
ウィンドウに余裕がある場合でも
早い段階から劣化が始まる


## p.11

何トークンから精度の壁を感じますか？
AWS Japan のSA ロールを対象にアンケートを実施
0
2
4
6
8
10
12
14
16
~100K
100K~200K
200~300K
300K~400K
400K~500K
500K~600K
劣化を感じない
Opus 4.7
Opus 4.6
※ Opus 4.7, 4.6 の最大コンテキストウィンドウ: 1M Token
※ このアンケートは体感ベースで、ベンチマーク値ではありません。


## p.12

何トークンから精度の壁を感じますか？
AWS Japan のSA ロールを対象にアンケートを実施
0
2
4
6
8
10
12
14
16
~100K
100K~200K
200~300K
300K~400K
400K~500K
500K~600K
劣化を感じない
Opus 4.7
Opus 4.6
400K トークン
程度でも劣化を感じる
※ Opus 4.7, 4.6 の最大コンテキストウィンドウ: 1M Token
※ このアンケートは体感ベースで、ベンチマーク値ではありません。


## p.13

コーディングエージェントの振る舞い


## p.14

System Prompt
AGENTS.md
Builtin Tools
MCP Tools
User message
Read ()
Search ()
Read ()
Assistant message
User message
Write ()
Lint ()
Test ()
…
コンテキストウィンドウ
セッションの初期化
実装計画を立てました
◯◯機能を
実装する計画を立てて
ソースコード
src/
model
view
controller
infrastructure
docs/
README.md
AGENTS.md
skills/
実装を開始して！！


## p.15

System Prompt
AGENTS.md
Builtin Tools
MCP Tools
User message
Assistant message
コンテキストウィンドウ
Smart Zone
精度良くコーディングできる領域
Dumb Zone
精度が劣化する領域
400 K token（経験則、目安）


## p.16

User message
Assistant message
System Prompt
AGENTS.md
Builtin Tools
MCP Tools
コンテキストウィンドウ
不要なノイズとならない
コンテキスト管理を心がける
400 K token（経験則、目安）
Smart Zone
精度良くコーディングできる領域
Dumb Zone
精度が劣化する領域


## p.17

• コードベースの調査において読み込んだファイル
• Lint, Build, Test, Deploy の実行ログ
• 実装したソフトウェアの起動・実行・操作ログ
• MCPサーバーから提供されるツールの結果（ウェブ検索など）
ノイズとして取り込まれる要素の例
コンテキストウィンドウに含まれる要素はソースコードだけではない


## p.18

System Prompt
AGENTS.md
Builtin Tools
MCP Tools
User message
Assistant message
コンテキストウィンドウ
調査した結果や実装計画
圧縮したドキュメント
Assistant message
System Prompt
AGENTS.md
Builtin Tools
MCP Tools
User message
新しいセッション
調査した結果や実装計画
圧縮したドキュメント
このやり方では
上手くいかなかったから
こう実装して
セッションを要約して切り替える


## p.19

セッションのコンパクション（圧縮）
コンテキストウィンドウの限界に近づいた会話を要約し、新しいウィンドウで再開する
実装計画を立て、要件を整理した計画書を引き継ぎ、新しいセッションを始める
か
カオスな会話履歴
探索のノイズ
ノイズの
フィルタリング
圧縮された
ドキュメント・実装計画書
Build, Lint, Test…
grep, find…
edit_file(…)
read_file(…)
web_search(…)
Compacted Documents


## p.20

コンテキストエンジニアリング


## p.21

• コンテキストウィンドウは貴重で有限なリソース
• 多くの情報を詰め込むだけでは、ノイズになる
• 必要最小限の高品質な情報を厳選する
コンテキストエンジニアリング
1M のコンテキストウィンドウがあるからといってすべて精度良く読めるわけではない。
コンテキストウィンドウ
1M
= 1000K Token
〜400K
Token
ノイズが溜まり性能劣化を感じ始める（経験則）


## p.22

主要なシステムのコード量
小規模
中規模
大規模
1 LOC（行数）= 10 Token 程度ではあるが、実際には１万行程度でもコンテキストに収まりずらい
〜１万行
部門内の小さなウェブシステムや
単機能のWeb API
１万〜１０万行
一般的な部門業務システム
基幹系の１サブシステム
１０万行〜
典型的な業務システム本体
（受発注、在庫、販売管理など）
出典：IPA「ソフトウェア開発分析データ集」に基づく概算


## p.23

主要なシステムのコード量
1 LOC（行数）= 10 Token 程度ではあるが、実際には１万行程度でもコンテキストに収まりずらい
１万行のコードベースですら
完全に意図通りにAI はコーディングできない
ことを前提においた戦略が必要


## p.24

最適なソフトウェアの構造を考える


## p.25

• ソースコード
• IaC (Infrastructure as Code) のソースコード
• 設定ファイル
• 設計ドキュメント
• エージェントのステアリングファイル
など
全てのコンテキストを凝集する
コーディングエージェントが効果的に計画・実装するには
全てのコンテキストを１つのリポジトリに凝集することが理想的


## p.26

Monorepo による解決策の例
インフラ定義、各種バックエンド、共有ライブラリ、テスト、CI/CD までを１つのリポジトリで管理します。
規模やフェーズに応じて判断が必要です。開発初期においては特にモノレポが見通しが良い場合があります。
Service B repo
Service A repo
Shared Library
Service B repo
Service A repo
Shared 
Library
Polyrepo
Monorepo
サービスごとに
リポジトリを分割して管理する
関連するソースコードを１つの
リポジトリに閉じ込める、まとめて管理する
※ AI エージェントから見て『近接して読める』ことが重要です。
Polyrepo でも、明示的なクロスリポインデックスで実現できます。


## p.27

Monorepo におけるディレクトリ構成の例
skills/
docs/
README.md
AGENTS.md
リポジトリの全体像
エージェント向けのステアリングファイル
packages/
libs/
frontend/
backend/
Infra/
典型的なウェブアプリの場合（TypeScript を想定）
エージェント向けのSkills （ステアリングファイルとスクリプト）
設計、特にソフトウェア構造上の意図を残す
👍


## p.28

Monorepo におけるディレクトリ構成の例
skills/
docs/
README.md
AGENTS.md
リポジトリの全体像
エージェント向けのステアリングファイル
packages/
libs/
frontend/
backend/
Infra/
典型的なウェブアプリの場合（TypeScript を想定）
エージェント向けのSkills （ステアリングファイルとスクリプト）
設計、特にソフトウェア構造上の意図を残す
共通的なライブラリ
フロントエンド
バックエンド（さらに複数のサービスに分割しても良い）
Infrastructure as Code のソースコードと設定ファイル
👍


## p.29

Monorepo の弱点と考慮するポイント
１つのリポジトリで全てのファイルにアクセスできる一方でコードベースが肥大化する。
何も工夫をしなければ、エージェントは大量のファイルを読み込み、コンテキストウィンドウを圧迫する。
💦


## p.30

Monorepo の弱点と考慮するポイント
１つのリポジトリで全てのファイルにアクセスできる一方でコードベースが肥大化する。
何も工夫をしなければ、エージェントは大量のファイルを読み込み、コンテキストウィンドウを圧迫する。
💦
パッケージの依存関係を最小限にし、
細部を見なくても理解できる構造を作る


## p.31

実装の細部を読まずとも理解できる状態を作る
Repository
Package
Package
Package
Package
Directory
File


## p.32

実装の細部を読まずとも理解できる状態を作る
Repository
Package
Package
Package
Package
Directory
File
ドキュメント
ドキュメントを詳細に記述し、AI に理解させることはできないか？


## p.33

実装の細部を読まずとも理解できる状態を作る
Repository
Package
Directory
File
AI が読んだドキュメント
ドキュメント
ドキュメントを詳細に記述し、AI に理解させることはできないか？
実装に必要な領域だけ
参照することができる


## p.34

実装
（動くコード）
コード
コメント
ドキュメント
仕様書


## p.35

実装
（動くコード）
コード
コメント
ドキュメント
仕様書
実装とのズレ
ハルシネーションの数


## p.36

ドキュメントは腐る、実装と乖離が進む
実装
（動くコード）
コード
コメント
ドキュメント
仕様書
実装とのズレ
ハルシネーションの数


## p.37

ドキュメントは腐る、実装と乖離が進む
実装
（動くコード）
コード
コメント
ドキュメント
仕様書
実装とのズレ
ハルシネーションの数
ドキュメントだけに頼らない
ソフトウェアの構造において工夫が必要
※ドキュメント管理を完全に否定するものではありません。補完的な仕組みが必要です。


## p.38

AI が開発しやすいソフトウェアの構造を考える
packages/backend


## p.39

AI が開発しやすいソフトウェアの構造を考える
packages/backend
複雑に絡み合った
依存関係


## p.40

AI が開発しやすいソフトウェアの構造を考える
packages/backend
過度にMock 化された
テストコードが生成される
複雑に絡み合った
依存関係


## p.41

John Ousterhout
A Philosophy of Software Design, 2nd Edition – ソフトウェア設計の哲学-
インターフェースはシンプルに、
機能は深く（複雑な処理を内部に隠蔽する）
設計することで、全体の複雑性を減らす


## p.42

Shallow Module とDeep Module
優れたモジュールはシンプルなインターフェースと深い機能をもつ（複雑な処理を内部に隠蔽している）
インターフェース（薄く）
実装（深く）
Shallow Module
Deep Module


## p.43

Shallow Module とDeep Module
優れたモジュールはシンプルなインターフェースと深い機能をもつ（複雑な処理を内部に隠蔽している）
インターフェース（薄く）
実装（深く）
Shallow Module
Deep Module
コーディングエージェントが
インターフェースだけを読んで
意思決定できる状態を目指す


## p.44

Deep Module の良い例– Unix File I/O
適切に抽象化されたインターフェースは利用者の認知負荷が低く、複雑性の低いモジュール
ファイルパス
どのファイルシステムかは気にしなくて良い
フラグ
READ/WRITE を指定
※ mode オプションは省略しています。


## p.45

モジュール境界を意識して設計する
packages/backend


## p.46

モジュール境界を意識して設計する
packages/backend


## p.47

モジュール境界を意識して設計する
packages/backend


## p.48

モジュール境界を意識して設計する
packages/backend
最小限の依存関係


## p.49

モジュール境界を意識して設計する
packages/backend
最小限の依存関係


## p.50

モジュール境界を意識して設計する
packages/backend
適切なモジュール境界で
凝集された機能に対して
テストコードを実装する
最小限の依存関係


## p.51

アーキテクチャの不変条件を強制する
Handler
Service
Config
Repository
インターフェース/ 型定義だけでは強制できない
構造的なルールに対して制約を設ける
制約はドキュメントではなく、
リンターや構造テストによって機械的に適用する
例）
Node.js eslint-plugin-boundaries
Java ArchUnit など
依存できる
データベースや外部のAPI には
Repository から接続する
❌


## p.52

サービスクラスのインターフェースの例
このインターフェースを読めば、実装の振る舞いが伝わるでしょうか？
問題


## p.53

サービスクラスのインターフェースの例
このインターフェースを読めば、実装の振る舞いが伝わるでしょうか？
問題


## p.54

サービスクラスのインターフェースの例
このインターフェースを読めば、実装の振る舞いが伝わるでしょうか？
問題
ユーザーのid を指定して、
ユーザーを１件取得する・・・？


## p.55

サービスクラスのインターフェースの例
このインターフェースを読めば、実装の振る舞いが伝わるでしょうか？
型レベルで
警告が出ない
問題
ユーザーのid を指定して、
ユーザーを１件取得する・・・？


## p.56

型表現の強化（TypeScript の場合）
オブジェクト指向プログラミングにおけるValue Object でも良い。
「ただのstring ではなく、検証済みのUserId だ」と型レベルでコーディングエージェントに伝える


## p.57

サービスクラスのインターフェースの例
Before
After （型表現の強化）
実装時に型レベルで
警告が出る状態を目指し、
AI にフィードバックする
強化された型表現
〜〜〜〜〜〜〜


## p.58

インターフェースの境界は
パッケージやクラス、関数だけでしょうか？


## p.59

Web API としてのインターフェース
Web API
Client
Backend
Web API = Web Application Programming “Interface”


## p.60

Web API におけるDeep Module の例– S3
適切に抽象化されたインターフェースは、認知負荷の低い複雑性の低いモジュール
s3.put_object(
Bucket=“yourbucket”, 
Key=“key”, 
Body=data
)
認証+ TLS 終端
ルーティング+ ロードバランシング
データ分割、整合性検証
暗号化（SSE）
複製、耐久性保証
メタデータの更新
イベント発火
など
S3 API


## p.61

OpenAPI Specification
REST 形式のAPI 仕様を定義する標準的な規格
JSON/YAML 形式のファイルから、API ドキュメントや、クライアントコード、
バリデーション用のサーバーサイドコードを生成することも可能に


## p.62

Git 管理するドキュメントには何を書くべきか？
ソフトウェアの構造を工夫して、AI の可読性を向上させる。
特に、読んでわからない文脈や意思決定の背景をドキュメントに残す。
情報の種類
Source of Truth
WHAT
現在の振る舞い
型・API・スキーマ・テーブル定義
インターフェース、型、
OpenAPI Spec、テストコード
HOW
どう動くか
アルゴリズム・実装の詳細
コード
WHEN, WHO
いつ誰が
変更の事実
Git のログ
WHY, WHY NOT
なぜそうなっているか
意思決定の文脈、棄却された選択肢
コードコメント、ドキュメント
（特にアーキテクチャ決定レコードなど）


## p.63

インターフェースは
最大のコンパクション（圧縮）
コンテキストの圧縮を、ドキュメントではなく、インターフェースで表現する


## p.64

関数
クラス
モジュール
Web API
命令と手続き
状態と振る舞い
内部実装と依存
プロセス・言語・インフラストラクチャ
インターフェースは「認知できて、制御できる」境界
各インターフェースで隠蔽してきたもの


## p.65

関数
クラス
モジュール
Web API
命令と手続き
状態と振る舞い
内部実装と依存
プロセス・言語・インフラストラクチャ
インターフェースは「認知できて、制御できる」境界
各インターフェースで隠蔽してきたもの
サーバーレスは
AI の認知的な資源“コンテキスト” を
本質的な設計判断に使わせる


## p.66

• “薄い”インターフェースと、”深い”実装
適切なモジュール境界を見極めて分割する。
ドキュメントにはWHY, WHY NOT を記す。
• モジュール単位に機能凝集されたテストコード
不必要なモックを避け、外部依存度の低いロジックをテストする。
• 決定論的な仕掛けでAI にフィードバックする
アーキテクチャの不変条件、依存の向き、強化された型情報を検証する。
各パッケージにおいて考慮するポイント
ここまでのまとめ– “インターフェースは最大のコンパクション”


## p.67

最適なサーバーレスアーキテクチャを考える


## p.68

①依存関係のあるコード・パッケージが適切に分割されていること
②ローカル環境での動作確認、テストが素早く実行できること
③インフラをコードとして管理し、デプロイができること
AI エージェントから見た開発者体験の要件
AI が「自律的にフィードバックループを回せるか」を起点に考える


## p.69

サーバーレスの開発者体験を考える
Amazon API Gateway
AWS Lambda
Amazon DynamoDB


## p.70

サーバーレスの開発者体験を考える
Amazon API Gateway
AWS Lambda
Amazon DynamoDB
単一のLambda Function には
どれくらいのコード量を載せるべきか


## p.71

サーバーレスの開発者体験を考える
Amazon API Gateway
AWS Lambda
Amazon DynamoDB
単一のLambda Function には
どれくらいのコード量を載せるべきか
handler 関数をどのようにテストするか？
event


## p.72

サーバーレスの開発者体験を考える
Amazon API Gateway
AWS Lambda
Amazon DynamoDB
単一のLambda Function には
どれくらいのコード量を載せるべきか
外部依存するコードは
どうユニットテストするか？
handler 関数をどのようにテストするか？
event


## p.73

Lambda 特有のコード例
Lambda 特有のコード例
クエリパラメータからuserId を受け取り、データを取得して返す


## p.74

Lambda 特有のコード例
Lambda 特有のコード例
外部に依存するコードを
ベタ書きしがち
event の構造が独自
エントリポイントがhandler
クエリパラメータからuserId を受け取り、データを取得して返す


## p.75

テストコードはどうなるか？
Lambda 特有のコード例


## p.76

テストコードはどうなるか？
Lambda 特有のコード例
APIGatewayProxyEvent を
丸ごと手組みしなければいけない
関心度のあるプロパティに絞りたい
文字列を再度
パースしなければいけない
DynamoDB クライアントのモック


## p.77

Lambda 固有の記法を減らし、
ローカルで高速に開発・テストを行いたい


## p.78

Lambda Web Adapter
Lambda でWeb アプリを実行するためのOSS ツール、Rust 製のLambda Extension 
2026/03/28 にv1.0.0 がリリース
https://github.com/awslabs/aws-lambda-web-adapter
event
http
Lambda Web Adapter
• Lambda ランタイムAPI の汎用アダプター
• 関数本体コードの依存関係はない
• あらゆるWeb フレームワークをサポート
• あらゆるプログラミング言語をサポート
• 既存のツールを使用して
• ローカルで開発
• ローカルでテスト


## p.79

Node.js アプリでの使用例
Lambda Web Adapter をインストールするにはDockerfile に１行追加するだけ
コンテナイメージはLambda 以外の環境でもそのまま利用できる
https://github.com/aws/aws-lambda-web-adapter
Install lambda web adapter を追加するだけ！
※ Docker 形式に限らず、Zip 形式のアップロードでもLambda Web Adapter を使用できます。


## p.80

• エミュレータ不要のローカル起動
ホットリロードもフレームワークの仕組みで自由に構築できる
• テスト生成・実行
HTTP リクエストを介するテストフレームワークが採用できる
Node.js ならsupertest, 人が実行するならPostman など
• イテレーションの自律化
ローカル起動、リクエスト送信、結果確認のループをエージェントが単独で回せる
フロントエンドもローカルで起動すればUI の操作を含めてエージェントに委譲できる
フィードバックループを高速化するLWA
コーディングエージェントはLambda を意識する必要がなくなり、ビジネスロジックの実装に集中できます。
（Lambda 特有のevent, context など）
※ 小さなコードや軽量な処理、関数単位にデプロイしたい場合、ウェブフレームワークに対する依存を嫌う場合はLWA は推奨しません。
AWS SAM Local なども併用して軽量な構成で実装しても同様の開発しやすい構造が手に入ります。全てはトレードオフ、私はAWS SAM が大好きです。


## p.81

• エミュレータ不要のローカル起動
ホットリロードもフレームワークの仕組みで自由に構築できる
• テスト生成・実行
HTTP リクエストを介するテストフレームワークが採用できる
Node.js ならsupertest, 人が実行するならPostman など
• イテレーションの自律化
ローカル起動、リクエスト送信、結果確認のループをエージェントが単独で回せる
フロントエンドもローカルで起動すればUI の操作を含めてエージェントに委譲できる
フィードバックループを高速化するLWA
コーディングエージェントはLambda を意識する必要がなくなり、ビジネスロジックの実装に集中できます。
（Lambda 特有のevent, context など）
※ 小さなコードや軽量な処理、関数単位にデプロイしたい場合、ウェブフレームワークに対する依存を嫌う場合はLWA は推奨しません。
AWS SAM Local なども併用して軽量な構成で実装しても同様の開発しやすい構造が手に入ります。全てはトレードオフ、私はAWS SAM が大好きです。


## p.82

Lambda 関数には
どの程度のコード量を凝集すべきか


## p.83

Lambda 関数に何を含めるべきか
“Lambda-lith”
API Gateway
DynamoDB
/getuser
/getusers
/getproduct
/getproducts
/createuser
/createproduct
/updateuser
/updatepoduct
/deleteuser
/deleteproduct
Client
Routing logic 
in function
/*


## p.84

Lambda 関数に何を含めるべきか
“Lambda-lith”
API Gateway
DynamoDB
/getuser
/getusers
/getproduct
/getproducts
/createuser
/createproduct
/updateuser
/updatepoduct
/deleteuser
/deleteproduct
Client
Routing logic 
in function
/*
DynamoDB
/getuser
/getusers
/getproduct
/getproducts
/createuser
/createproduct
/updateuser
/updateproduct
/deleteuser
/deleteproduct
API Gateway
Client
“Micro Lambda”


## p.85

• 境界付けられたコンテキスト
• 開発組織の構造
• IAMパーミッションのスコープ
• 共通的なコードの依存関係
• 配下のリソースとの依存関係
• 初期化時間とコールドスタート
• メモリ割り当て
/getproduct
/getproducts
/createproduct
/updateproduct
/deleteproduct
/getuser
/getusers
/createuser
/updateuser
/deleteuser
Lambda 関数に何を含めるべきか
API Gateway
Client
DynamoDB
（User）
“Pragmatic Lambda”
グループ化の例
※境界づけられたコンテキストで分割した例
DynamoDB
（Product）


## p.86

Monorepo のpackage 単位でデプロイする
README.md / AGENTS.md
src/
index.ts etc..
types/
libs/
・・・
packages/
user-service/
src/
index.ts etc..
product-service/
/getproduct
/getproducts
/createproduct
/updateproduct
/deleteproduct
/getuser
/getusers
/createuser
/updateuser
/deleteuser
DynamoDB
（User）
DynamoDB
（Product）


## p.87

Monorepo のpackage 単位でデプロイする
README.md / AGENTS.md
src/
index.ts etc..
types/
libs/
・・・
packages/
user-service/
src/
index.ts etc..
product-service/
/getproduct
/getproducts
/createproduct
/updateproduct
/deleteproduct
/getuser
/getusers
/createuser
/updateuser
/deleteuser
import
Deploy
マイクロサービスとして
独立したデプロイできる
DynamoDB
（User）
DynamoDB
（Product）


## p.88

Monorepo のpackage 単位でデプロイする
README.md / AGENTS.md
src/
index.ts etc..
types/
libs/
・・・
packages/
user-service/
src/
index.ts etc..
product-service/
/getproduct
/getproducts
/createproduct
/updateproduct
/deleteproduct
/getuser
/getusers
/createuser
/updateuser
/deleteuser
import
Deploy
Deploy
モノレポの利点を活かす
インターフェースや共通処理を
参照して実装可能
マイクロサービスとして
独立したデプロイできる
DynamoDB
（User）
DynamoDB
（Product）


## p.89

HTTP 以外のトリガーにも対応
Lambda Web Adapter は、SQS、SNS、S3、DynamoDB、Kinesis、Kafka、EventBridge など、
HTTP 以外のすべてのイベントトリガーをサポートしています。
Amazon SQS
AWS Lambda
event
環境変数
AWS_LWA_PASS_THROUGH_PATH=/events
Amazon S3
AWS Lambda
event
HTTP POSTリクエストを使用して、設定可能なパス（デフォルト/events）に
生のイベントペイロードをWebアプリケーションに転送します。
AWS Lambda
event
Amazon DynamoDB


## p.90

DynamoDB などの外部依存するコードは
どうテストするか？


## p.91

DynamoDB Local
Docker やJVM で起動するDynamoDB のローカルエミュレータ
ロジックの検証はDynamoDB Local で高速にテストする。
IAM 認可など、統合テストはクラウド環境のDynamoDB も併用する。
Amazon DynamoDB Local
（ローカル環境）
アプリケーション
（ローカル環境）
const client = new DynamoDBClient({
endpoint: "http://localhost:8000",
…
});
例）http://localhost:8000 で起動
https://hub.docker.com/r/amazon/dynamodb-local
クラウドのDynamoDB にアクセスせずに
ローカル/ CI環境で高速にテスト可能に


## p.92

サーバーレスの開発者体験を考える
Amazon API Gateway
AWS Lambda
Amazon DynamoDB
外部依存するコードは
どうユニットテストするか？
handler 関数をどのようにテストするか？
LWA でWeb フレームワークと
同様のテスト戦略を適用する
DynamoDB Local で
モックテストの乱立を防ぐ
単一のLambda Function には
どれくらいのコード量を載せるべきか
“Pragmatic Lambda”
コンテキスト境界やリソース権限など


## p.93

クラウドを運用する
AI エージェントの視点


## p.94

クラウドを運用するAI エージェント
従来の運用自動化（Runbook や監視ツール）を超えて、
自律的に観測・判断・実行・学習し、運用業務を担う
観測
判断
実行
学習
クラウドリソースの
テレメトリの収集
仮説生成と検証
根本原因の特定
インフラ設定の変更
コードの修正
過去のインシデント
対処履歴


## p.95

機械的な運用と、自律的な運用
考えなくても即座に反応すべき事はクラウドネイティブな仕組みに任せ、
運用エージェントは「人間の判断が必要な領域を、人間より先に準備する」
担当
動作
例
機械的運用
クラウドの
マネージドサービス
決定論的
即時反応
オートスケーリング、
フェイルオーバー、
レート制限など
自律的運用
運用エージェント
推論的
人間の介在を求める
ログ、メトリクスなど
の各種テレメトリを観
測、判断し、設定変更
のPull Request を起票
する


## p.96

日次運用レポートと、GitHub Issueへの起票例
毎日自動的に
運用エージェントが起動
異常を検知すると
根本原因を調査して
GitHub Issue に起票


## p.97

運用エージェントが必要とするコンテキスト
AWS Cloud（A省Xシステム）
AWS Cloud
運用エージェント
異常検知
ログ・メトリクス・アラート
原因特定
傾向分析
• ランタイムテレメトリ
ログ・メトリクス・トレース・アラート
• アーキテクチャ情報
サービス境界・依存関係・IaC（CDK）
• 設計意図
SLO・アラートの閾値・リトライ戦略
• 運用の記憶
過去のインシデント履歴・ランブック


## p.98

現実世界のサーバーレスアーキテクチャ
Amazon API Gateway
AWS Lambda
Amazon DynamoDB
Amazon S3
Amazon SQS
AWS Lambda
AWS Lambda
運用エージェント


## p.99

現実世界のサーバーレスアーキテクチャ
Amazon API Gateway
AWS Lambda
Amazon DynamoDB
Amazon S3
Amazon SQS
CloudWatch 
Logs/Metrics
AWS Lambda
AWS Lambda
CloudWatch 
Logs/Metrics
CloudWatch 
Logs/Metrics
CloudWatch 
Logs/Metrics
CloudWatch 
Logs/Metrics
CloudWatch 
Logs/Metrics
💦
分散されたログが
トレースできない
サービスの境界は
どこ？
全てのテレメトリを
調査するとコンテキスト
ウィンドウが足りない
Lambda の言語が違うと
ログの構造もバラバラに
運用エージェント


## p.100

運用エージェントが必要とするコンテキスト
AWS Cloud（A省Xシステム）
AWS Cloud
運用エージェント
異常検知
ログ・メトリクス・アラート
原因特定
傾向分析
• ランタイムテレメトリ
ログ・メトリクス・トレース・アラート
• アーキテクチャ情報
サービス境界・依存関係・IaC（CDK）
• 設計意図
SLO・アラートの閾値・リトライ戦略
• 運用の記憶
過去のインシデント履歴・ランブック


## p.101

運用エージェントが必要とするコンテキスト
AWS Cloud（A省Xシステム）
AWS Cloud
運用エージェント
異常検知
ログ・メトリクス・アラート
原因特定
傾向分析
• ランタイムテレメトリ
ログ・メトリクス・トレース・アラート
• アーキテクチャ情報
サービス境界・依存関係・IaC（CDK）
• 設計意図
SLO・アラートの閾値・リトライ戦略
• 運用の記憶
過去のインシデント履歴・ランブック
運用しやすい構造や
仕組みを整える必要がある


## p.102

エージェントから見た運用しやすい構造
依存関係のある
全てのログ、メトリクスが
探索可能であること
サービス間の
アーキテクチャ境界が
明確であること
コンテキストロット
しない領域（トークン数）
で作業ができること


## p.103

サーバーレスにおける可観測性の勘所
Logs / Metrics / Traces をトレースID でつなぐ
Metrics をビジネス指標に
CloudWatch 標準メトリクスに加えて、
EMF（Embedded Metric Format）でビジネス的なKPI も出力する
Traces でボトルネックを可視化
分散されたコンポーネントをトレースし、コールドスタート、スロットリング、
ダウンストリームのレイテンシのボトルネックを特定する
（CloudWatch / AWS X-Ray の機能を集約したCloudWatch Application Signals などを活用）
Logs を構造化して相関ID でつなぐ
サービス境界ごとにCloudWatch Log グループを分離する
JSON 形式に構造化し、トレースID、ユーザーIDを含める


## p.104

• JSON 形式の
構造化されたログ
• AWS X-Ray 統合による
分散トレース
• コンテキスト情報を持つ
カスタムメトリクス
Lambda Powertools によるメトリクス収集


## p.105

Lambda Powertools によるメトリクス収集
サービス境界を明示する
• JSON 形式の
構造化されたログ
• AWS X-Ray 統合による
分散トレース
• コンテキスト情報を持つ
カスタムメトリクス


## p.106

運用エージェントが調査しやすいログの例


## p.107

運用エージェントが調査しやすいログの例
トレーサビリティ
ビジネスロジックのコンテキスト
エラー情報
メタデータ
サービス境界の明示


## p.108

まとめ


## p.109

ソフトウェア開発・運用をAI に委譲できるか
AWS Cloud（A省Xシステム）
GitHub
開発者
開発エージェント
AWS Cloud
CI/CD
バックログ管理
要件定義
エンドユーザー
ヒアリング
・・・
GitHub Issue / PR
（機能追加リクエスト）
実装・テスト
運用エージェント
異常検知
セキュリティ
レビュー
是正措置
ログ・メトリクス・アラート
傾向分析
GitHub Issue / Pull Request 起票
本番環境
テスト環境
原因特定


## p.110

• コンテキストロット
ノイズの蓄積により精度は落ちる前提を受け入れる
• Pragmatic Lambda / Architecture
Package やLambda を実用的でAI が管理可能な粒度で分割する
• インターフェース・コンパクション
サービス間の境界をインターフェースだけを読めばわかる状態を設計する
• エージェント・オブザーバビリティ
運用エージェントの目線でログ・メトリクスのサービス境界を設計する
Key Takeaway - コンテキストの圧縮を、ドキュメントだけでなく、アーキテクチャで実現する
AI が開発／運用しやすいクラウドの設計原則


## p.111

• コンテキストロット
ノイズの蓄積により精度は落ちる前提を受け入れる
• Pragmatic Lambda / Architecture
Package やLambda を実用的でAI が管理可能な粒度で分割する
• インターフェース・コンパクション
サービス間の境界をインターフェースだけを読めばわかる状態を設計する
• エージェント・オブザーバビリティ
運用エージェントの目線でログ・メトリクスのサービス境界を設計する
Key Takeaway - コンテキストの圧縮を、ドキュメントだけでなく、アーキテクチャで実現する
AI が開発／運用しやすいクラウドの設計原則


## p.112

• コンテキストロット
ノイズの蓄積により精度は落ちる前提を受け入れる
• Pragmatic Lambda / Architecture
Package やLambda を実用的でAI が管理可能な粒度で分割する
• インターフェース・コンパクション
サービス間の境界をインターフェースだけを読めばわかる状態を設計する
• エージェント・オブザーバビリティ
運用エージェントの目線でログ・メトリクスのサービス境界を設計する
Key Takeaway - コンテキストの圧縮を、ドキュメントだけでなく、アーキテクチャで実現する
AI が開発／運用しやすいクラウドの設計原則


## p.113

Ask the Speaker
こちらのRoom 後方の外側にございます、
「Ask the Speaker」カウンターまでお越しください
淡路大輔
アマゾンウェブサービスジャパン合同会社
Room


## p.114

本セッションのアンケートへ
ご協力をお願いします
Please give us your feedback
Thank you!
CNS449
