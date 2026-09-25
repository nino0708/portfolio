---
title: "Amazon Bedrock AgentCore による 堅牢な SaaS データエージェントの設計"
category: "AWSセッション"
session_id: "AIM344"
pages: 56
topics: ["生成AI/エージェント"]
services: ["AWS Lambda", "AgentCore", "Amazon API Gateway", "Amazon Bedrock", "Amazon RDS", "Amazon S3", "MCP", "Strands Agents"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/AWSセッション/Amazon Bedrock AgentCore による 堅牢な SaaS データエージェントの設計.pdf"
---
# Amazon Bedrock AgentCore による 堅牢な SaaS データエージェントの設計


## p.1

AIM344
Amazon Bedrock AgentCore による
堅牢なSaaS データエージェントの設計
伊勢⽥氷琴
アマゾンウェブサービスジャパン合同会社


## p.2

⾃⼰紹介
伊勢⽥氷琴(イセダヒコト)
• 所属
§ 広域事業統括本部
テクニカルソリューション部
§ ソリューションアーキテクト
• 好きな AWS サービス
§ Amazon Bedrock
• 専⾨領域
§ AWS の⽣成AI / AI エージェントサービス


## p.3

セッションの対象者と注意事項
対象者
• SaaS の実装に関わるアーキテクト、エンジニア
• データエージェントの設計に関⼼を持つアーキテクト、エンジニア
注意事項
• Python やSQL などコードを含むスライドが登場します
• 基本的なAWS のAI サービスやAI エージェントに関する知識を
前提としています
⽬標
• 堅牢なデータエージェントを構築するための設計⽅針を理解する


## p.4

アジェンダ
1. データエージェントとその課題
2.４つのレイヤーで考えるデータエージェントの堅牢な設計
3. 各レイヤーの実装
4. リファレンスアーキテクチャ
5. デモ


## p.5

データエージェントとその課題


## p.6

データ分析⼿段の変遷
レポート、ダッシュボードからデータエージェントへ
定型レポートを
エンジニアに
依頼して取得
キーワード:
DWH
ダッシュボード
構築を開発者に
依頼
キーワード:
可視化
インタラクション
セマンティック
レイヤーの整備、
⾃然⾔語による
クエリ
キーワード:
セマンティック
レイヤー
NLQ (Natural 
Language Query)
AI エージェントが
⾃律的に分析を遂⾏
キーワード:
データエージェント
分析者が⾃ら
ダッシュボードを
構築
キーワード:
セルフサービスBI


## p.7

データエージェントとBI の違い
開発者が事前に検証した固定のSQL ⽂を発⾏するBI ツールと異なり、
データエージェントはユーザーからの指⽰に従って動的にデータを取得・解析する
BI ツール
DWH
DWH
ユーザー
クエリ
ツール
LLM
SELECT xxx FROM ...
WHERE ...
データ
エンジニア
SQL・ダッシュボードの
設計・構築
検証済みSQL ⽂
BI ツール
データエージェント
データ


## p.8

最もプリミティブなデータエージェントの実装


## p.9

脆弱なエージェントのデモ１- PII 漏洩
個⼈情報


## p.10

脆弱なエージェントのデモ２- テナント越境
異なるテナントのデータ


## p.11

脆弱なエージェントのデモ３- 業務外の話題


## p.12

脆弱なエージェントのデモ４- ⾮効率なクエリ
LIMITのないクエリを実⾏


## p.13

データエージェント実装上の課題
AI が⾮効率なクエリを書いたら︖
DB 権限の制御が不⼗分だったら︖
偽のtenant_id を注⼊されたら︖
プロンプトインジェクション
対策は︖


## p.14

データエージェント実装上の課題
⾏動統制の不⾜
LLM が⽣成する SQL を
制御する仕組みがない
認可レイヤーの不在
ツール呼び出しの認可が
 LLM 任せになる
テナント越境
LLM への WHERE 句指⽰
のみではテナント分離は
守られない


## p.15

４つのレイヤーで考える
堅牢なデータエージェントの設計⽅針


## p.16

OWASP Top 10 for Agentic Applications
カテゴリ
内容
ASI01
Agent Goal Hijack
プロンプト操作で⽬的を改竄
ASI02
Tool Misuse
正規ツールを意図しない⽅法で
悪⽤
ASI03
Identity & Privilege Abuse
権限委譲・認証情報の悪⽤
ASI04
Agentic Supply Chain
サードパーティモデル、
プラグインの汚染
ASI05
Unexpected Code Execution
⽣成コード・外部コードの
意図しない実⾏
ASI06
Memory & Context Poisoning
メモリー・RAG の汚染
ASI07
Insecure Inter-Agent Communication
エージェント間通信の改竄
ASI08
Cascading Failures
障害の伝播・増幅
ASI09
Human-Agent Trust Exploitation
エージェント出⼒への過信
ASI10
Rogue Agents
認可範囲を逸脱した⾏動
ref. https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/


## p.17

データエージェントの動作モデル
エージェントはPerceive (観察)、Reason (推論)、Act (⾏動) の３つのステップを
ループすることで動作する
メモリー
ユーザー
エージェントシステム
Perceive
Reason
Act
LLM
ツール
次のターン
取り込み
呼び出し
レスポンス
DWH
⽂書検索
システム
プロンプト


## p.18

データエージェントの動作フロー
LLM がツールを呼び出し、実際にツールがパラメータを受け取って動作し、
結果に応じて追加の推論が実施される
ユーザー
SQL 構築・実⾏
ツール
DWH
ツールの
呼び出し
(Act)
LLM
(Perceive / 
Reason)
次のターン
メモリー
システム
プロンプト
⽂書検索
ツール
仕様
ツール
リソース


## p.19

防御すべきポイント
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


## p.20

４つのレイヤーで捉える
データエージェントの脆弱性から４つのレイヤーで防御点を捉える
ユーザー
ツール実⾏
DWH
ツールの
呼び出し
(Act)
LLM
(Perceive/ 
Reason)
次のターン
メモリー
システム
プロンプト
⽂書検索
ツール
仕様
SQL 構築・実⾏
ツール
リソース
レイヤー１
LLM 層
レイヤー２
呼び出し層
レイヤー３
ツール層
レイヤー４
リソース層


## p.21

４つのレイヤーの詳細
LLM 層
呼び出し層
ツール層
リソース層
内容
OWASP 分類
LLM への⼊出⼒をどう制御するか
ツールを呼ぶ際に何を検証するか
ツールの中で何を守るか
データアクセスをどう統制するか
Agent Goal Hijack
(ASI01)
Tool Misuse (ASI02)
Identity & Privilege Abuse (ASI03)
Unexpected Code Execution
(ASI05)
Identity & Privilege Abuse (ASI03)
Memory & Context Poisoning (ASI06)


## p.22

各レイヤーの対策⼀覧
LLM 層
呼び出し層
ツール層
リソース層
守る対象
対策の原則
プロンプト、コンテキスト上の脅威
ツールの呼び出し可否
ツールのパラメータ
ツール実装の安全性
DB、ナレッジベース、メモリー
⼊出⼒の制限と適切な
コンテキストの注⼊
ツール呼び出し時の引数や
認可情報を検証する
ツール内部の安全性をコードで
保証する
最終的なリソースへのアクセス
制御を実装する


## p.23

各レイヤーの実装


## p.24

[再掲] ４つのレイヤー
ツール実⾏
DWH
ツールの
呼び出し
(Act)
LLM
(Perceive/ 
Reason)
次のターン
メモリー
⽂書検索
リソース
レイヤー１
LLM 層
レイヤー２
呼び出し層
レイヤー３
ツール層
レイヤー４
リソース層
SQL 構築・実⾏
ツール
システム
プロンプト
ユーザー


## p.25

レイヤー１︓LLM 層の対策
ツール実⾏
DWH
ツールの
呼び出し
(Act)
LLM
(Perceive/ 
Reason)
次のターン
メモリー
⽂書検索
リソース
レイヤー１
LLM 層
レイヤー２
呼び出し層
レイヤー３
ツール層
レイヤー４
リソース層
SQL 構築・実⾏
ツール
システム
プロンプト
ユーザー


## p.26

レイヤー１︓LLM 層の対策例
ツールの
呼び出し
LLM
レイヤー１
LLM 層
レイヤー２
呼び出し層
ガードレールの
整備
システムプロンプトの整備
ユーザー


## p.27

L1 LLM 層ーガードレール
業務外のトピック、プロンプトインジェクションなどをブロックする
Amazon Bedrock Guardrails による実装例
業務範囲外の会話を
Block
プロンプト
インジェクションのBlock


## p.28

L1 LLM 層ーシステムプロンプトの整備
システムプロンプトをStrands Agents で設定する例
禁⽌事項や⾏動ルールをシステムプロンプトに記述し、振る舞いを抑制する


## p.29

ユーザー
システム
プロンプト
レイヤー２︓呼び出し層の対策
ツール実⾏
DWH
ツールの
呼び出し
(Act)
LLM
(Perceive/ 
Reason)
次のターン
メモリー
⽂書検索
リソース
レイヤー１
LLM 層
レイヤー２
呼び出し層
レイヤー３
ツール層
レイヤー４
リソース層
SQL 構築・実⾏
ツール
ツール
仕様


## p.30

L2 呼び出し層ーBedrock AgentCore による実装
AgentCore
gateway
エージェント
システム
LLM
Lambda function
Gateway
Policy
Gateway
Interceptor
宣⾔的・静的な
判定
⼿続き的・動的な
判定
Amazon Bedrock AgentCore gateway を⽤いると、ツール( Lambda 関数など) を
実⾏する前に各種検証を差し込むことが可能
API Gateway 
Target
OpenAPI Target
AWS Lambda 
Target
MCP Server 
Target
MCP サーバー
Amazon API Gateway
REST API


## p.31

ツール呼び出しの静的検証
エージェントがツールを呼び出す権限を持っているか等を確認する宣⾔的な検証
Amazon Bedrock AgentCore gateway の場合、Cedar Policy によって実装可能
Cedar Policy による実装例
危険ツールは明⽰的に
拒否
テナントID を持っている場合
のみツール利⽤を許可
使⽤可能なツールは
明⽰的に許可


## p.32

ツール呼び出しの動的検証
ツール呼び出し時のパラメータ検証やレート制限などを実装する
Gateway interceptor を利⽤するとカスタム Lambda 関数で 動的判定を実装可能
カスタムLambda 関数の実装例
引数の妥当性の確認
ツールが許可リストに
あるかの確認
呼び出し主体の認可


## p.33

ユーザー
システム
プロンプト
レイヤー３︓ツール層の対策
ツール実⾏
DWH
ツールの
呼び出し
(Act)
LLM
(Perceive/ 
Reason)
次のターン
メモリー
⽂書検索
リソース
レイヤー１
LLM 層
レイヤー２
呼び出し層
レイヤー３
ツール層
レイヤー４
リソース層
ツール


## p.34

L3 ツール層︓データアクセスの２つの戦略
LLM がSQL 全体を⽣成
SQL ⾃動⽣成
関数型ツール
LLM はパラメータを
⽣成するのみ
堅牢
柔軟


## p.35

L3 ツール層︓SQL ⽣成のツール実装
堅牢
柔軟
完全⾃由⽣成
⼊⼒安全化
スコープ制限
対策なし
読み取り専⽤ロール
クエリ時間制限
実⾏前構⽂検証
許可外テーブルの拒否
読み取り専⽤ロール
クエリ時間制限
実⾏前構⽂検証


## p.36

L3 ツール層︓関数型ツールの実装
SQL ⾃動⽣成
関数型ツール経由
LLM がSQL全体を⽣成
エージェントの⾏動統制のためには関数型ツールを作成し、LLM にパラメータ
のみを⽣成させる⽅式がより堅牢
テナントID は実⾏コンテキストから
取得して埋め込む
• プロンプトインジェクションを防⽌
• JOIN / WHERE / カラム選択を全て
正確に記述可能


## p.37

L3 ツール層︓ツールの中で実装すべき統制
ツールに⼊ってくる
ものを制限
⼊⼒境界
実⾏制約
出⼒境界
横断
何を守るか
具体策
実⾏時のリソースと
権限を制限
ツールから出ていく
ものを制限
全操作を記録
SQL 識別⼦の許可リスト、引数の検証、
JWT claim からテナントID を埋め込む
読み取り専⽤ロール、LIMIT、タイムアウト、
パラメータバインド
PII 列除外、エラーマスキング、
出⼒結果サニタイズ
監査ログ(tool / tenant / user / 
operation / row_count)


## p.38

ユーザー
システム
プロンプト
レイヤー４︓リソース層の対策
ツール実⾏
DWH
ツールの
呼び出し
(Act)
LLM
(Perceive/ 
Reason)
次のターン
メモリー
⽂書検索
リソース
レイヤー１
LLM 層
レイヤー２
呼び出し層
レイヤー３
ツール層
レイヤー４
リソース層
SQL 構築・実⾏
ツール


## p.39

アイデンティティの伝播
マルチテナントSaaS におけるアイデンティティの伝播経路
ユーザー
JWT
Backend Server
エージェント
ランタイム
認証プロバイダ
LLM
SQL 構築・
実⾏ツール
DWH
tenant_id
tenant_id
メモリー
⽂書検索
tenant_id


## p.40

テナントレベルでデータを分離する
JWT から claim を取り出し、tenant_id を LLM の推論を挟むことなく機械的に
伝播させる
ユーザー
JWT
Backend Server
エージェント
ランタイム
認証プロバイダ
LLM
SQL 構築・
実⾏ツール
DWH
tenant_id
tenant_id
伝播されるアイデンティティを
リソースの制御に利⽤する
メモリー
⽂書検索


## p.41

L4 リソース層の防御︓テナントのアクセス制御
PostgreSQL でのRLS 設定例
プールモデルのSaaS の場合、RLS（Row Level Security）適⽤や、テナントごとに
View を⽤意するといった実装を⾏う
どんなSQL が来ても
指定したテナントしか
⾒えない
テナントA
tenant_id
user_id
Name
tenant_A
001
Bob
tenant_B
002
Alice
tenant_A
003
Eve
テナントB
※RLS がネイティブにサポートされていないDB も存在します


## p.42

L4 リソース層の防御︓メモリーの分離
メモリー機能は、Bedrock AgentCore memory で実装可能
namespace とIAM によって厳密にテナントを分離する
AgentCore memory のnamespace 例
複合キーによるAgentCore memory の
テナント分離実装の例
IAM Policy でテナントID の付与を強制する


## p.43

L4 リソース層の防御︓ナレッジベースの分離
Amazon S3 にテナントごとに分離したフォルダを構成、テナント別ファイルを配置
metadata にtenant_id を挿⼊し、これを⽤いてフィルタリングを実装
Amazon S3 への⽂書配置例
Amazon Bedrock Knowledge Bases 
でのRetrieve コード例
直接埋め込む


## p.44

リファレンスアーキテクチャ


## p.45

アーキテクチャ
AWS Cloud
AgentCore 
runtime
AgentCore 
memory
AgentCore
gateway
Amazon Bedrock 
Knowledge Bases
Amazon Cognito
Amazon S3
ユーザー
JWT
Role
Amazon RDS
(PostgreSQL)
Role
AWS Lambda


## p.46

アイデンティティの伝播
AWS Cloud
AgentCore 
memory
AgentCore
gateway
Amazon Bedrock 
Knowledge Bases
Amazon S3
ユーザー
JWT
Role
AWS Lambda
Amazon Cognito
JWT からテナントID を
抽出
テナントID を、LLM の推論を経由せずに
リソースまで伝播する
Amazon RDS
(PostgreSQL)
AgentCore 
runtime


## p.47

ツールの多重防御の実装
AWS Cloud
AgentCore 
memory
AgentCore
gateway
Amazon Cognito
ユーザー
JWT
Role
Amazon RDS
(PostgreSQL)
Role
AWS Lambda
ツールの呼び出し検証
RLS の実装とIAM Policy による強制
AgentCore 
runtime


## p.48

レイヤーと攻撃防御
レイヤー１
LLM 層
レイヤー２
呼び出し層
レイヤー３
ツール層
レイヤー４
リソース層
プロンプトによる
攻撃
テナント越境
PII 漏洩
⾮効率なクエリ
停⽌
部分軽減
停⽌
停⽌
停⽌
部分軽減
部分軽減


## p.49

デモ- プロンプトインジェクション防⽌
ガードレールでプロンプト
インジェクションを検出、
回答を抑制


## p.50

デモ– 業務外の話題の禁⽌
ガードレールで
業務外の話題を検出、
回答を抑制


## p.51

デモ– ⾮効率クエリの防⽌
検証済みクエリを実⾏することで
⾮効率クエリの⽣成を防⽌


## p.52

まとめ


## p.53

まとめ
• データエージェントは分析体験を⼤きく変える⼀⽅、従来のBI とは
異なる設計課題を持つ
• マルチテナントSaaS 環境では、エージェントの柔軟性とテナント
分離・権限制御を両⽴する必要がある
• 堅牢性はLLM 層・呼び出し層・ツール層・リソース層の各層で設計
する
• LLM は⾃然な対話と推論を担い、最終的な制御は決定的な仕組みに
委ねる


## p.54

Ask the Speaker
こちらの Room 後⽅の外側にございます、
「Ask the Speaker」カウンターまでお越しください
伊勢⽥ 氷琴
アマゾン ウェブサービス ジャパン合同会社
Room


## p.55

参考情報
[AWS Blog] Amazon Bedrock 
AgentCore でマルチテナント
エージェントを構築する
[AWS Prescriptive Guidance] 
AWS SRA for AI
OWASP Top 10 for Agentic 
Applications for 2026
[AWS Prescriptive Guidance] 
Foundations of 
agentic AI on AWS
Generative AI Lens - AWS 
Well-Architected Framework
[AWS Prescriptive Guidance]
Security for agentic AI 
on AWS
[Workshop]
マルチテナントAI 
エージェント with 
Amazon Bedrock AgentCore


## p.56

本セッションのアンケートへ
ご協⼒をお願いします
Please give us your feedback
Thank you!
AIM344
