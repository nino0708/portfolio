---
title: "Amazon Bedrock AgentCore を活用した エンタープライズ Agentic RAG の実装解説"
category: "AWSセッション"
session_id: "AIM412"
pages: 100
topics: ["生成AI/エージェント"]
services: ["AgentCore", "Amazon Bedrock", "Amazon S3", "Amazon SageMaker", "Strands Agents"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/AWSセッション/Amazon Bedrock AgentCore を活用した エンタープライズ Agentic RAG の実装解説.pdf"
---
# Amazon Bedrock AgentCore を活用した エンタープライズ Agentic RAG の実装解説


## p.1

AIM412
Amazon Bedrock AgentCore を活用した
エンタープライズAgentic RAG の実装解説
辻浩季
アマゾンウェブサービスジャパン合同会社


## p.2

よくある課題
AI エージェント/ RAG システムの現場
こんな課題、
抱えていませんか？


## p.3

よくある課題
AI エージェント/ RAG システムの現場
こんな課題、
抱えていませんか？
的外れな回答
ナレッジベースから検索しても、ユーザーの意図や
文脈を理解できず関連性の低い情報を返してしまう


## p.4

よくある課題
AI エージェント/ RAG システムの現場
こんな課題、
抱えていませんか？
的外れな回答
ナレッジベースから検索しても、ユーザーの意図や
文脈を理解できず関連性の低い情報を返してしまう
コストとレイテンシーの増大
会話履歴をすべてコンテキストに含めると
トークン数が膨大になり、コスト増・応答
遅延・精度低下を招く


## p.5

よくある課題
AI エージェント/ RAG システムの現場
こんな課題、
抱えていませんか？
的外れな回答
ナレッジベースから検索しても、ユーザーの意図や
文脈を理解できず関連性の低い情報を返してしまう
コストとレイテンシーの増大
会話履歴をすべてコンテキストに含めると
トークン数が膨大になり、コスト増・応答
遅延・精度低下を招く
本番環境環境への展開
PoC でエージェントがうまく動作することが
わかっても、エンタープライズ環境へ
展開することができない


## p.6

よくある課題
AI エージェント/ RAG システムの現場
こんな課題、
抱えていませんか？
的外れな回答
ナレッジベースから検索しても、ユーザーの意図や
文脈を理解できず関連性の低い情報を返してしまう
会話を覚えていない
エージェントはステートレス。昨日の
会話やユーザーの好みを記憶できず、
毎回ゼロからのやり取りになる
コストとレイテンシーの増大
会話履歴をすべてコンテキストに含めると
トークン数が膨大になり、コスト増・応答
遅延・精度低下を招く
従来のRAG では解決できない課題に対し、
Agentic RAG を構築することで
新しいアプローチを提供


## p.7

自己紹介
辻浩季
つじ
ひろき
ソリューションアーキテクト
技術統括本部
ストラテジックエンタープライズ本部
自動車・製造第一ソリューション部
アマゾンウェブサービスジャパン合同会社
得意領域
好きなAWS サービス
時系列予測、生成AI
Amazon Bedrock AgentCore, Amazon SageMaker AI
前職では総合電機メーカーで機器の異常検知システムの
設計・開発業務に従事


## p.8

本セッションについて
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


## p.9

本セッションで構築するAgentic RAG システム
GitHub にて公開しています
QRコード


## p.10

Agentic RAG とは


## p.11

生成
Generate
応答
Response
質問
Query
拡張
Augment
検索
Retrieve
RAG (Retrieval-Augmented Generation) とは


## p.12

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
Context Engineering
検索
Retrieve
3
https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
「コンテキストロット」
大規模言語モデルは
コンテキストウィンドウに
含まれるトークン数が増えるほど
情報を正確に想起する能力が
低下していく


## p.13

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
Context Engineering
検索
Retrieve
3
https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
本当に必要な情報を
最小限に集めたトークンセット


## p.14

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
Context Engineering
検索
Retrieve
3
https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
最小限の高シグナル
トークンセット
コンテキストは貴重で有限なリソースなので
多くの情報を詰め込めば良いわけではなく、
最小限の高品質な情報を選別することが
エージェントのパフォーマンスを最大化させる


## p.15

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
Context Engineering
検索
Retrieve
3
https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
最小限の高シグナル
トークンセット


## p.16

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
Context Engineering
検索
Retrieve
3
https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
ツール


## p.17

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
Context Engineering
検索
Retrieve
3
https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
メモリ


## p.18

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
Agentic RAG
検索
Retrieve
生成
Generate
応答
Response
質問
Query
拡張
Augment
3


## p.19

本セッションで構築する
Agentic RAG システムの
概要紹介


## p.20

AWSome Summit Agent
金曜日の生成AIセッション
は何がありますか？
私におすすめの
セッションは？
AIエージェントのセキュリティについて
学ぶのに良いセッションはどれですか？
前回話したセッション
はどれでしたか？
エージェント
AWS Summit 2026 のセッションに関する問い合わせエージェント


## p.21

AWSome Summit Agent
呼び出し
会話履歴と
ユーザー設定の
保存と取得
Amazon Cognito
イベント情報
の検索
アプリケーション
レスポンス
ログイン
エージェント
メモリ
Memory
ユーザー
対話
イベント
情報
RAG
AWS Summit 2026 のセッションに関する問い合わせエージェント


## p.22

AWSome Event Agent のアーキテクチャ
Agent 呼び出し
メッセージの
保存or 取得
AgentCore runtime
セッションA
セッションB
メモリの取得
AgentCore
identity
Amazon Cognito
AgentCore memory 
Actor A
セッション
トークンの検証
Actor A 
ユーザー設定
長期メモリ
メモリ
Agent Endpoint
Amazon Bedrock
Knowledge Bases
イベント
情報の取得
Application
Agent から返答
Log in
Strands Agent
短期メモリ
セッション
A1


## p.23

実装の詳細解説


## p.24

構築の流れ
Step 1 : エージェントの構築
Strands Agent
利用するサービス


## p.25

構築の流れ
Step 1 : エージェントの構築
Step 2 : Knowledge Bases の構築
Amazon Bedrock 
Knowledge Bases
Strands Agent
利用するサービス


## p.26

構築の流れ
Step 1 : エージェントの構築
Step 2 : Knowledge Bases の構築
Step 3 : メモリコンポーネントの構築
Amazon Bedrock 
AgentCore memory
Amazon Bedrock 
Knowledge Bases
Strands Agent
利用するサービス


## p.27

構築の流れ
Step 1 : エージェントの構築
Step 2 : Knowledge Bases の構築
Step 3 : メモリコンポーネントの構築
Step４: Runtime へのデプロイ
Amazon Bedrock 
AgentCore runtime
Amazon Bedrock 
AgentCore memory
Amazon Bedrock 
Knowledge Bases
Strands Agent
利用するサービス


## p.28

構築の流れ
Step 1 : エージェントの構築
Step 2 : Knowledge Bases の構築
Step 3 : メモリコンポーネントの構築
Step４: Runtime へのデプロイ
Step 5 : 認証認可機能の追加
Amazon Bedrock 
AgentCore identity
Amazon Bedrock 
AgentCore runtime
Amazon Bedrock 
AgentCore memory
Amazon Bedrock 
Knowledge Bases
Strands Agent
利用するサービス


## p.29

Step 1 : エージェントの構築


## p.30

Strands Agents を用いた
シンプルなエージェントの構築
モデル駆動型アプローチを採用したオープンソースAI エージェント開発用SDK
わずか数行のコードでAI エージェントを実装
•
MODEL_ID を変更するだけで
Bedrock で利用可能な基盤モデルを
柔軟に変更可能
•
OpenAI のほか、Anthropic, LiteLLM, 
Lllama, Ollama, Gemini, Writer など
主要なプロバイダー各社の
API  呼び出しをサポート
•
23 の組み込みツール以外にも
カスタムツールを@tool デコレータの
使用で簡単にツール化できる


## p.32

Step 1 で構築した内容
Agent 呼び出し
Application
Agent から返答
Strands Agent
Strands Agent を用いて
エージェントを構築


## p.33

構築の流れ
Step 1 : エージェントの構築
Step 2 : Knowledge Bases の構築
Step 3 : メモリコンポーネントの構築
Step４: Runtime へのデプロイ
Step 5 : 認証認可機能の追加
Amazon Bedrock 
AgentCore identity
Amazon Bedrock 
AgentCore runtime
Amazon Bedrock 
AgentCore memory
Amazon Bedrock 
Knowledge Bases
Strands Agent
利用するサービス


## p.34

Step２: Knowledge Base の構築


## p.35

Amazon Bedrock Knowledge Bases 
を用いたインデックス作成
インデックス
作成
埋め込み
ソースデータ
チャンキング
テキスト抽出


## p.36

Amazon Bedrock Knowledge Bases 
を用いたインデックス作成
インデックス
作成
埋め込み
ソースデータ
チャンキング
テキスト抽出
Amazon S3 に
AWS Summit 2026 
セッション情報を格納
ベクトルストアには
あらかじめ作成しておいた
Amazon S3 Vector を使用


## p.37

Step 2.7


## p.38

エージェントとナレッジベースの統合
「あなたはAWS Summit 2026 のイベント情報が格納された
ナレッジベースにアクセスできる優秀なイベントアシスタントです」
@tool
セッション
データの検索
Strands Agent
Amazon Bedrock 
Knowledge Base
Documents
S3 Buckets
Amazon S3 
Vectors Index
コンテキスト
検索
Amazon Bedrock Knowledge Base
ツール
呼び出し
フィード
検索
Strands Agents の@tool デコレータを用いて、Amazon Bedrock Knowledge Base に
アクセスするtool を設定し、エージェントとナレッジベースを統合


## p.39

Step 2.8


## p.40

ナレッジベースの統合
from strands import Agent, tool
# Create your tool
@tool
def search_summit_sessions():
…code to call Knowledge Base… 
# Create an agent with the tool
agent = Agent(
tools=[search_summit_sessions]
)
# Ask the agent a question
agent("AI Agentsとセキュリティに関する
セッションはありまsか?")
Response
: AWS Summit 2026 において
おすすめのAI Agents とセキュリティに
関するセッションを紹介します。・・・


## p.41

Step 2 で構築した内容
Agent 呼び出し
Amazon Bedrock
Knowledge Bases
イベント
情報の取得
Application
Agent から返答
Strands Agent
エージェントと
Knowledge Bases を統合


## p.42

構築の流れ
Step 1 : エージェントの構築
Step 2 : Knowledge Bases の構築
Step 3 : メモリコンポーネントの構築
Step４: Runtime へのデプロイ
Step 5 : 認証認可機能の追加
Amazon Bedrock 
AgentCore identity
Amazon Bedrock 
AgentCore runtime
Amazon Bedrock 
AgentCore memory
Amazon Bedrock 
Knowledge Bases
Strands Agent
利用するサービス


## p.43

Step 3: メモリコンポーネントの構築


## p.44

エージェント会話の永続化
AgentCore memory 
生イベント
同期
Strands Agent
1
ユーザ
対話
Amazon Bedrock AgentCore memory により
Agentic Memory の実装を数行で実現


## p.45

エージェント会話の永続化
AgentCore memory 
短期メモリ
生イベント
同期
Strands Agent
1
ユーザ
対話
Amazon Bedrock AgentCore memory により
Agentic Memory の実装を数行で実現
• チャット内容
• セッション状態


## p.46

エージェント会話の永続化
AgentCore memory 
短期メモリ
長期メモリ
生イベント
同期
Strands Agent
1
ユーザ
対話
Amazon Bedrock AgentCore memory により
Agentic Memory の実装を数行で実現
• セマンティック
• ユーザー設定
• 要約
• エピソード記憶
• チャット内容
• セッション状態


## p.47

エージェント会話の永続化
AgentCore memory 
短期メモリ
長期メモリ
自動メモリ
抽出モジュール
メッセージ
メモリ
生イベント
同期
Strands Agent
1
2
3 
4
ユーザ
対話
非同期
Amazon Bedrock AgentCore memory により
Agentic Memory の実装を数行で実現
• セマンティック
• ユーザー設定
• 要約
• エピソード記憶
• チャット内容
• セッション状態


## p.48

エージェント会話の永続化
AgentCore memory 
短期メモリ
長期メモリ
自動メモリ
抽出モジュール
メッセージ
メモリ
生イベント
イベントと
メモリ
同期
Strands Agent
1
2
3 
4
5
ユーザ
対話
非同期
Amazon Bedrock AgentCore memory により
Agentic Memory の実装を数行で実現
• セマンティック
• ユーザー設定
• 要約
• エピソード記憶
• チャット内容
• セッション状態
メモリは
アクターID とセッションID で
論理的に分離される


## p.49

Step 3.1


## p.50

メモリリソースの作成
memory_manager = MemoryManager(region_name=REGION)
memory = memory_manager.get_or_create_memory(
name = "EventAgentMemory",
strategies=[
{
StrategyType.USER_PREFERENCE.value: {
"name": "UserPreferences",
"namespaces": ["/users/{actorId}/preferences"],   
"description": "Captures customer preferences and behavior"
}
}
],
description="Memory for Event Agent with user preferences",
event_expiry_days=30
)


## p.51

エージェントライフサイクルの制御– Strands Hooks


## p.52

エージェントライフサイクルの制御– Strands Hooks
エージェント初期化
AgentInitialized
Event


## p.53

エージェントライフサイクルの制御– Strands Hooks
リクエスト
開始イベント
BeforeInvocation
Event
MessageAdded
Event
エージェント初期化
AgentInitialized
Event


## p.54

エージェントライフサイクルの制御– Strands Hooks
リクエスト
開始イベント
モデルイベント
BeforeInvocation
Event
MessageAdded
Event
BeforeModel
CallEvent
AfterModelCall
Event
MessageAdded
Event
エージェント初期化
AgentInitialized
Event


## p.55

エージェントライフサイクルの制御– Strands Hooks
リクエスト
開始イベント
モデルイベント
ツールイベント
BeforeInvocation
Event
MessageAdded
Event
BeforeModel
CallEvent
AfterModelCall
Event
MessageAdded
Event
BeforeToolCall
Event
AfterToolCall
Event
MessageAdded
Event
エージェント初期化
AgentInitialized
Event


## p.56

エージェントライフサイクルの制御– Strands Hooks
リクエスト
開始イベント
モデルイベント
ツールイベント
リクエスト終了
イベント
BeforeInvocation
Event
MessageAdded
Event
BeforeModel
CallEvent
AfterModelCall
Event
MessageAdded
Event
BeforeToolCall
Event
AfterToolCall
Event
MessageAdded
Event
AfterInvocation
Event
エージェント初期化
AgentInitialized
Event


## p.57

リクエスト
開始イベント
モデルイベント
ツールイベント
リクエスト終了
イベント
BeforeInvocation
Event
MessageAdded
Event
BeforeModel
CallEvent
AfterModelCall
Event
MessageAdded
Event
BeforeToolCall
Event
AfterToolCall
Event
MessageAdded
Event
AfterInvocation
Event
エージェント初期化
AgentInitialized
Event
エージェントライフサイクルの制御– Strands Hooks


## p.58

リクエスト
開始イベント
モデルイベント
ツールイベント
リクエスト終了
イベント
BeforeInvocation
Event
MessageAdded
Event
BeforeModel
CallEvent
AfterModelCall
Event
MessageAdded
Event
BeforeToolCall
Event
AfterToolCall
Event
MessageAdded
Event
AfterInvocation
Event
エージェント初期化
AgentInitialized
Event
エージェントライフサイクルの制御– Strands Hooks


## p.59

AgentCore memory を呼び出すタイミング
AgentCore memory 
Actor A
短期メモリ
セッション
セッションA1
アクターA  ユーザー設定
長期メモリ
メモリ
Strands Agent
ユーザー設定
を取得
Amazon Bedrock Knowledge Bases
AgentInitialized
Event
ツール
AWS Summit 
セッション情報の検索
イベント情報
の検索


## p.60

AgentCore memory を呼び出すタイミング
AgentCore memory 
Actor A
短期メモリ
セッション
セッションA1
アクターA  ユーザー設定
長期メモリ
メモリ
Strands Agent
メッセージ
を保存
ユーザー設定
を取得
Amazon Bedrock Knowledge Bases
AgentInitialized
Event
MessageAdded
Event
ツール
AWS Summit 
セッション情報の検索
イベント情報
の検索


## p.61

AgentCore memory を呼び出すタイミング
AgentCore memory 
Actor A
短期メモリ
セッション
セッションA1
アクターA  ユーザー設定
長期メモリ
メモリ
モデルが
レスポンスを生成
Strands Agent
メッセージ
を保存
ユーザー設定
を取得
ツール
AWS Summit 
セッション情報の検索
Amazon Bedrock Knowledge Bases
イベント情報
の検索
AgentInitialized
Event
MessageAdded
Event


## p.62

AgentCore memory を呼び出すタイミング
AgentCore memory 
Actor A
短期メモリ
セッション
セッションA1
アクターA  ユーザー設定
長期メモリ
メモリ
モデルが
レスポンスを生成
Strands Agent
メッセージ
を保存
メッセージ
を保存
ユーザー設定
を取得
ツール
AWS Summit 
セッション情報の検索
Amazon Bedrock Knowledge Bases
イベント情報
の検索
AgentInitialized
Event
MessageAdded
Event
MessageAdded
Event


## p.63

Step 3.2


## p.68

メモリを呼び出すタイミングの決定
class MemoryHookProvider(HookProvider):
def __init__(self):
def on_agent_initialized(self, event: 
AgentInitializedEvent): Call LTM
def on_message_added(self, event: 
MessageAddedEvent):
def register_hooks(self, registry: 
HookRegistry):
memory_hook = MemoryHookProvider()
# Create an agent with the tool and 
memory hook
agent = Agent(
hooks=[memory_hook],
tools=[search_reinvent_sessions]
)


## p.69

AWSome Event Agent のアーキテクチャ
Agent 呼び出し
メッセージの
保存or 取得
メモリの取得
AgentCore memory 
Actor A
セッション
Actor A 
ユーザー設定
長期メモリ
メモリ
Amazon Bedrock
Knowledge Bases
イベント
情報の取得
Application
Agent から返答
Strands Agent
短期メモリ
セッション
A1
メモリコンポーネントを
構築し、エージェントと
連携


## p.70

構築の流れ
Step 1 : エージェントの構築
Step 2 : Knowledge Bases の構築
Step 3 : メモリコンポーネントの構築
Step４: Runtime へのデプロイ
Step 5 : 認証認可機能の追加
Amazon Bedrock 
AgentCore identity
Amazon Bedrock 
AgentCore runtime
Amazon Bedrock 
AgentCore memory
Amazon Bedrock 
Knowledge Bases
Strands Agent
利用するサービス


## p.71

Step 4: Runtime へのデプロイ


## p.72

エージェントを安全かつスケーラブルにホスト
任意のモデル
任意の
フレームワーク
ローカルで
エージェントを構築
/ping
/invocations
requirements.txt
+
1
エージェント
Amazon Bedrock AgentCore runtime
で動作するために必要なコードを追加


## p.73

エージェントを安全かつスケーラブルにホスト
任意のモデル
任意の
フレームワーク
ローカルで
エージェントを構築
/ping
/invocations
requirements.txt
+
1
エージェント
コードを
ECR にプッシュ
2
Amazon Elastic 
Container Registry
コンテナイメージを
Amazon ECR に直接
またはAgentCore CLI 経由で
ビルド＆プッシュ


## p.74

エージェントを安全かつスケーラブルにホスト
任意のモデル
任意の
フレームワーク
ローカルで
エージェントを構築
/ping
/invocations
requirements.txt
+
1
エージェント
コードを
ECR にプッシュ
2
AgentCore
runtime
エージェント
を作成
3
ランタイムエージェント
コンテナ
イメージ
プロトコル
設定
ネットワーク
設定
Amazon Elastic 
Container Registry
コンテナイメージを指定し、
オプションで追加設定を行い、
AgentCore CLI を使用して
エージェントを安全かつ
スケーラブルにデプロイ


## p.75

エージェントを安全かつスケーラブルにホスト
任意のモデル
任意の
フレームワーク
ローカルで
エージェントを構築
/ping
/invocations
requirements.txt
+
1
エージェント
コードを
ECR にプッシュ
2
AgentCore
Runtime
ランタイムエージェント
エージェント
エンドポイント
コンテナ
イメージ
プロトコル
設定
ネットワーク
設定
セッションA
セッションB
AgentCore
runtime
セッションC
エンドポイント
を作成
4
Amazon Elastic 
Container Registry
エージェント
を作成
3
ローカルで
エージェントを構築
1
エージェント
コードを
ECR にプッシュ
2
ランタイムエージェントの
エンドポイントを作成。
各セッションは分離された
microVM上で実行され、
セッション終了後に削除される


## p.76

エージェントを安全かつスケーラブルにホスト
任意のモデル
任意の
フレームワーク
ローカルで
エージェントを構築
/ping
/invocations
requirements.txt
+
1
エージェント
コードを
ECR にプッシュ
2
AgentCore
runtime
ランタイムエージェント
エージェント
エンドポイント
コンテナ
イメージ
プロトコル
設定
ネットワーク
設定
セッションA
セッションB
AgentCore
runtime
アプリ
セッションC
エンドポイント
を作成
4
呼び出し
5
Amazon Elastic 
Container Registry
エージェント
を作成
3


## p.80

AWSome Event Agent のアーキテクチャ
Agent 呼び出し
メッセージの
保存or 取得
AgentCore runtime
セッションA
セッションB
メモリの取得
AgentCore Memory 
Actor A
セッション
Actor A 
ユーザー設定
長期メモリ
メモリ
Agent Endpoint
Amazon Bedrock
Knowledge Bases
イベント
情報の取得
Application
Agent から返答
Strands Agent
短期メモリ
セッション
A1
Amazon Bedrock 
AgentCore runtime 
にエージェントをデプロイ


## p.81

構築の流れ
Step 1 : エージェントの構築
Step 2 : Knowledge Bases の構築
Step 3 : メモリコンポーネントの構築
Step４: Runtime へのデプロイ
Step 5 : 認証認可機能の追加
Amazon Bedrock 
AgentCore identity
Amazon Bedrock 
AgentCore runtime
Amazon Bedrock 
AgentCore memory
Amazon Bedrock 
Knowledge Bases
Strands Agent
利用するサービス


## p.82

Step 5: 認証認可機能の追加


## p.83

Amazon Bedrock AgentCore identiy
を用いたインバウンド認証の実装
エージェント
ユーザー
対話
アプリケーション
IdPトークンを渡して呼び出し
AgentCore identity
IdP
ログイン情報
IdP
トークン
IdPトークンでユーザーを検証
AgentCore runtime
IdPトークンの
検証をリクエスト
AWS Workload 
Access Token を返却
エージェント
トークン交換
ユーザー検証レスポンス
1
2
3
5
4
6
実行


## p.84

Amazon Bedrock AgentCore identiy
を用いたインバウンド認証の実装
エージェント
ユーザー
対話
アプリケーション
IdPトークンを渡して呼び出し
AgentCore identity
IDP
ログイン情報
IdP
トークン
IdPトークンでユーザーを検証
AgentCore runtime
IdPトークンの
検証をリクエスト
AWS Workload 
Access Token を返却
エージェント
トークン交換
ユーザー検証レスポンス
1
2
3
5
4
6
実行
今回はIdP として
あらかじめ作成した
Amazon Cognito を使用


## p.88

Step 5 で構築した内容
Agent 呼び出し
メッセージの
保存or 取得
AgentCore runtime
セッションA
セッションB
メモリの取得
AgentCore
identity
Amazon Cognito
AgentCore memory 
Actor A
セッション
トークンの検証
Actor A 
ユーザー設定
長期メモリ
メモリ
Agent Endpoint
Amazon Bedrock
Knowledge Bases
イベント
情報の取得
Application
Agent から返答
Log in
Strands Agent
短期メモリ
セッション
A1
Amazon Bedrock AgentCore identity
を利用して認証認可機能を追加


## p.89

まとめ


## p.90

AWSome Event Agent のアーキテクチャ
Agent 呼び出し
メッセージの
保存or 取得
AgentCore runtime
セッションA
セッションB
メモリの取得
AgentCore
identity
Amazon Cognito
AgentCore memory 
Actor A
セッション
トークンの検証
Actor A 
ユーザー設定
長期メモリ
メモリ
Agent Endpoint
Amazon Bedrock
Knowledge Bases
イベント
情報の取得
Application
Agent から返答
Log in
Strands Agent
短期メモリ
セッション
A1


## p.91

よくある課題
的外れな回答
ナレッジベースから検索しても、ユーザーの意図や
文脈を理解できず関連性の低い情報を返してしまう


## p.92

よくある課題
的外れな回答
ナレッジベースから検索しても、ユーザーの意図や
文脈を理解できず関連性の低い情報を返してしまう
Amazon Bedrock 
Knowledge Bases と
Amazon Bedrock 
AgentCore memory を組み合わせ
Agentic RAG を構築可能


## p.93

よくある課題
的外れな回答
ナレッジベースから検索しても、ユーザーの意図や
文脈を理解できず関連性の低い情報を返してしまう
コストとレイテンシーの増大
会話履歴をすべてコンテキストに含めると
トークン数が膨大になり、コスト増・応答
遅延・精度低下を招く
Amazon Bedrock 
Knowledge Bases と
Amazon Bedrock 
AgentCore memory を組み合わせ
Agentic RAG を構築可能


## p.94

よくある課題
的外れな回答
ナレッジベースから検索しても、ユーザーの意図や
文脈を理解できず関連性の低い情報を返してしまう
コストとレイテンシーの増大
会話履歴をすべてコンテキストに含めると
トークン数が膨大になり、コスト増・応答
遅延・精度低下を招く
Amazon Bedrock 
Knowledge Bases と
Amazon Bedrock 
AgentCore memory を組み合わせ
Agentic RAG を構築可能
AgentCore memory の
長期メモリ戦略を
利用して効率よく必要な情報を
コンテキストに入れ込められる


## p.95

よくある課題
的外れな回答
ナレッジベースから検索しても、ユーザーの意図や
文脈を理解できず関連性の低い情報を返してしまう
コストとレイテンシーの増大
会話履歴をすべてコンテキストに含めると
トークン数が膨大になり、コスト増・応答
遅延・精度低下を招く
本番環境環境への展開
PoC でエージェントがうまく動作することが
わかっても、エンタープライズ環境へ
展開することができない
Amazon Bedrock 
Knowledge Bases と
Amazon Bedrock 
AgentCore memory を組み合わせ
Agentic RAG を構築可能
AgentCore memory の
長期メモリ戦略を
利用して効率よく必要な情報を
コンテキストに入れ込められる


## p.96

よくある課題
的外れな回答
ナレッジベースから検索しても、ユーザーの意図や
文脈を理解できず関連性の低い情報を返してしまう
コストとレイテンシーの増大
会話履歴をすべてコンテキストに含めると
トークン数が膨大になり、コスト増・応答
遅延・精度低下を招く
本番環境環境への展開
PoC でエージェントがうまく動作することが
わかっても、エンタープライズ環境へ
展開することができない
Amazon Bedrock 
Knowledge Bases と
Amazon Bedrock 
AgentCore memory を組み合わせ
Agentic RAG を構築可能
AgentCore memory の
長期メモリ戦略を
利用して効率よく必要な情報を
コンテキストに入れ込められる
AgentCore identity を用いて
容易に認証認可機能を追加できる


## p.97

本セッションで構築するAgentic RAG システム
GitHub にて公開しています


## p.98

本セッションのまとめ
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


## p.99

Ask the Speaker
こちらのRoom 後方の外側にございます、
「Ask the Speaker」カウンターまでお越しください
辻浩季
アマゾンウェブサービスジャパン合同会社
Room


## p.100

本セッションのアンケートへ
ご協力をお願いします
Please give us your feedback
Thank you!
AIM412
