---
title: "AI エージェント精度改善のポイント - Architecture・Context・Tools の設計方針"
category: "AWSセッション"
level: "L300"
session_id: "AIM314"
pages: 67
topics: ["生成AI/エージェント"]
services: ["AgentCore", "Amazon Bedrock", "Strands Agents"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/AWSセッション/AI エージェント精度改善のポイント - Architecture・Context・Tools の設計方針.pdf"
---
# AI エージェント精度改善のポイント - Architecture・Context・Tools の設計方針


## p.1

AIM314
AI エージェント精度改善のポイント
- Architecture・Context・Tools の設計方針
長友健人
アマゾンウェブサービスジャパン合同会社


## p.2

アマゾンウェブサービスジャパン合同会社
ソリューションアーキテクト
人材、不動産、E コマース、ニュースなど
IT を本業とするお客様を担当
AI Agent アプリの本番導入を複数支援
長友健人


## p.3

本セッションについて
想定聴講者(L300)
• 開発したAI Agent アプリの
挙動の不安定さに課題を感じるエンジニア
ゴール
• AI Agent の挙動が不安定になる原因を理解し、
Architecture・Context・Tools の設計で
対処できるようになること


## p.4

こんな経験ありませんか？
会話ターンが進むにつれ
回答品質が低下
複雑なタスクになると
回答の誤りが増える
リトライを繰り返し
レイテンシとコスト増加


## p.5

エンジニアは課題にどう対処するべきか
Agent が使いやすい
Tools
になっているか？
Context
が肥大化してないか？
正しい
Architecture
を選べているか？


## p.6

AI Agent 開発で設計する3 つの要素
Context


## p.7

AI Agent 開発で設計する3 つの要素
Context
①LLM に情報を入力
②入力からタスクの
解法・行動を計画
LLM


## p.8

AI Agent 開発で設計する3 つの要素
Context
①LLM に情報を入力
②入力からタスクの
解法・行動を計画
LLM
Tools
③Tool を用いて外部から
情報を取得


## p.9

AI Agent 開発で設計する3 つの要素
Tools
LLM
Context
①LLM に情報を入力
②入力からタスクの
解法・行動を計画
③Tool を用いて外部から
情報を取得
④解がでるまで1~3 を繰り返す


## p.10

AI Agent 開発で設計する3 つの要素
Tools
LLM
Context
Architecture
①LLM に情報を入力
②入力からタスクの
解法・行動を計画
③Tool を用いて外部から
情報を取得
④解がでるまで1~3 を繰り返す


## p.11

本日のAgenda
1. ユースケースに応じた最適なArchitecture の選択方法
2.  回答品質劣化を防ぐContext の設計・管理方法
3. LLM が使いやすいTools の設計方法


## p.12

ユースケースに最適なArchitecture の選び方


## p.13

AI Agent アーキテクチャの選択肢
Single Agent
Graph
Agents as Tools
Swarm
Orchestrator
Tools
Context
LLM
Tools
処理の順番を事前定義し
Agent を連結
Orchestrator が処理を決定
Tool としてAgent を利用
Agent 同士が議論し
処理内容を決定


## p.14

よくあるご相談: データ分析Agent を作りたい！
売上DB
データ分析Agent
②SQL を生成し実行
SELECT branch_name,SUM(amount)
FROM sales
WHERE …
①“幕張店で6 月
よく売れてる商品”
④“ 6 月幕張店で
売れてる商品はxxxx”
③データを返却
どのようなアーキテクチャで実現しますか？


## p.15

少数ドメインのデータ分析の場合(Single Agent)
売上DB
データ分析Agent
②SQL を生成し実行
SELECT branch_name,SUM(amount)
FROM sales
WHERE …
①“幕張店で6 月
よく売れてる商品”
④“ 6 月幕張店で
売れてる商品はxxxx”
③データを返却


## p.16

複数のドメインにまたがる分析をしたい場合
売上DB
顧客DB
在庫DB
よく売れているが
在庫が余ってる商品と
それを買ってない顧客リスト
売り上げ
Context 
売り上げ
Tools
在庫
Context 
在庫
Tools
顧客
Context 
顧客
Tools


## p.17

複数のドメインにまたがる分析で起こる問題
ドメイン知識が混ざり、クエリ生成に失敗するなど挙動が不安定に
よく売れているが
在庫が余ってる商品と
それを買ってない顧客リスト
売り上げ
Context 
売り上げ
Tools
在庫
Context 
在庫
Tools
顧客
Context 
顧客
Tools
売上DB
顧客DB
在庫DB


## p.18

Multi-Agent 化によるContext とTools の分離
Single Agent
Multi-Agent
売上
Context 
売上
Tools
在庫
Context 
顧客
Context 
在庫
Tools
顧客
Tools
売上
Context 
売上
Tools
在庫
Context 
在庫
Tools
顧客
Context 
顧客
Tools
Context・Tools を分離し情報の混入を防ぐ
データ分析Agent
売上Agent
在庫Agent
顧客Agent


## p.19

分析フローを事前定義可能なケース(Graph)
売上Agent
在庫Agent
顧客Agent
(Step 1) よく売れてるけど
(Step 2) 在庫が余ってる商品と
(Step 3) それを買ってない顧客リスト
売上DB
Step 1
Step 2
Step 3
Agent 毎に関心事を分離、アーキテクチャレベルでフローを制御
顧客DB
在庫DB


## p.20

固定フローで分岐がある場合(Graph)
ユーザーの問い合わせに応じて分岐が発生するケース
問い合わせ分析
売上分析
在庫分析
条件分岐
レポート作成


## p.21

分析内容・手順が不定なケース(Agents as tools)
顧客Agent
残った在庫
どうやって捌く？
顧客DB
自律性を確保しつつ、Agent 毎に関心ごとを分離
Orchestrator が専門Agent をTool として利用しタスクを解く
在庫Agent
在庫DB
売上Agent
売上DB
Orchestrator
Tool
Tool
Tool


## p.22

分析内容・手順が不定で
Agent に議論させ回答を得たいケース(Swarm)
売上Agent
在庫Agent (Entrypoint)
顧客Agent
残った在庫
どうやって捌く？
議論
Orchestrator は存在せず、Agent 同士が直接議論し解を導き出す


## p.23

Strands Agents によるマルチエージェント実装
graph = GraphBuilder()
graph.add_node(sales, "sales")
graph.add_node(inventory, "inventory")
graph.add_node(customer, "customer")
graph.add_edge("sales", "inventory")
graph.add_edge("inventory", "customer")
swarm = Swarm(
nodes=[sales, inventory, customer],
entry_point=sales,
)
orchestrator = Agent(
system_prompt="xxx",
tools=[sales, inventory, customer],
)
Agent as Tools
Swarm
Graph
Agent 定義
sales
= Agent(
system_prompt="xxx",
tools=[yyy]
)
inventory = Agent(...)
customer = Agent(...)


## p.24

AI Agent Architecture の特徴と使いどころ
Single Agent
特徴
単一Agent で完結
向くケース
少数ドメインのタスク
考慮事項
対象ドメイン増加で
Context とTools 肥大化
挙動不安定に


## p.25

AI Agent Architecture の特徴と使いどころ
Graph
特徴
処理手順を
事前定義
向くケース
処理手順が
固定のタスク
考慮事項
事前定義外の
タスクに
対応しづらい


## p.26

AI Agent Architecture の特徴と使いどころ
Agents as Tools
特徴
Orchestrator が
処理手順を判断
向くケース
フローが不定な
複数ドメインのタスク
考慮事項
挙動の安定性は
Orchestrator に
強く依存する


## p.27

AI Agent Architecture の特徴と使いどころ
Swarm
特徴
Agent 同士で協調し
処理手順を判断
向くケース
Agent 間の議論が
必要なタスク
考慮事項
処理手順の
判断主体が分散
制御・デバッグが困難


## p.28

AI Agent Architecture の特徴と使いどころ
Single Agent
Graph
Agents as Tools
Swarm
特徴
単一Agent で完結
処理手順を
事前定義
Orchestrator が
処理手順を判断
Agent 同士で協調し
処理手順を判断
向くケース
少数ドメインのタスク
処理手順が
固定のタスク
フローが不定な
複数ドメインのタスク
Agent 間の議論が
必要なタスク
考慮事項
対象ドメイン増加で
Context とTools 肥大化
挙動不安定に
事前定義外の
タスクに
対応しづらい
挙動の安定性は
Orchestrator に
強く依存する
処理手順の
判断主体が分散
制御・デバッグが困難
自律性
低
高
制御難易度


## p.29

Architecture まとめ
• ユースケースを整理した上でアーキテクチャを選定する
• 自律性の高いアーキテクチャと
制御の難しさにはトレードオフがある
• 要件を実現できるシンプルなアーキテクチャを採用する


## p.30

回答品質劣化を防ぐContext の設計・管理方法
Context


## p.31

コンテキスト増やすとAI Agent は賢くなるのか？


## p.32

データ分析Agent のコンテキスト肥大化
System Prompt
Tools 定義
System Prompt
Tools 定義
User Message
AI Response
System Prompt
Tools 定義
User Message
AI Response
DB 検索結果
DB 検索結果
ステップ1
ステップ2
ステップN
User Message
分析ステップが増えるごとにDB 検索結果が肥大化


## p.33

Context Rot (コンテキストの腐敗)
Context 肥大化による性能劣化
• 矛盾する情報が混在することにより回答が曖昧に
• 重要な情報が埋もれて回答品質低下
入力長
ス
コ
ア


## p.34

Lost in the Middle
Lost in the Middle
中間の情報は無視されやすい
重要な情報を見落とすリスク
Context Window
Primacy Bias
先頭の情報は注視しやすい
Recency Bias
末尾の情報は注視しやすい


## p.35

Context の課題と解決アプローチ
• 課題
• Context 肥大化による性能劣化


## p.36

Context の課題と解決アプローチ
• 課題
• Context 肥大化による性能劣化
• 解決アプローチ
• 古い情報は切り捨て・要約し
Context を圧縮し、必要最小限の情報に保つ
• 重要な情報は圧縮し外部に永続化
必要な時に必要な情報を取得する


## p.37

Context の課題と解決アプローチ
• 課題
• Context 肥大化による性能劣化
• 解決アプローチ
• 古い情報は切り捨て・要約し
Context を圧縮し、必要最小限の情報に保つ


## p.38

Window (N=5)
増加するContext を圧縮する方法
過去の情報は切り捨て
Sliding Window


## p.39

Window (N=5)
Amazon Bedrock
増加するContext を圧縮する方法
過去の情報は切り捨て
過去情報を要約し圧縮
Sliding Window
Summarization


## p.40

agent = Agent(
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


## p.41

Context の課題と解決アプローチ
• 課題
• Context 肥大化による性能劣化
• 解決アプローチ
• 重要な情報は圧縮し外部に永続化
必要な時に必要な情報を取得する


## p.42

•
ユーザーは幕張店の売上
レポートを月次で作成する
•
商品A、B に関しては詳細な
レポートを作る。
分析手順は…
長期記憶によるコンテキストの圧縮・保存
今月の売上レポート作って
幕張店
AgentCore memory
(Long-term Memory)
(Stores Memory)
どちらの店舗でしょうか？
商品A、B に関しては詳細に
重要な情報のみを抽出・保存


## p.43

•
ユーザーは幕張店の売上
レポートを月次で作成する
•
商品A、B に関しては詳細な
レポートを作る。
分析手順は…
長期記憶によるコンテキストの圧縮
今月の売上レポート作って
幕張店のレポートですね！
幕張店
AgentCore memory
(Long-term Memory)
売上レポート作って
(Stores Memory)
どちらの店舗でしょうか？
翌月
商品A、B に関しては詳細に
商品A、B は…..
過去のやり取りから必要な情報のみを取得


## p.44

関連性の高い長期記憶のみ取得
AgentCore memory: Semantic Search
AgentCore
memory
長期記憶の一覧要求
保存されたすべての長期記憶を返却
100 個の長期記憶
Long-term 
Memory
Semantic 検索なし


## p.45

関連性の高い長期記憶のみ取得
AgentCore
memory
検索: 「売上レポートを作成する」
長期記憶の一覧要求
最も関連性の高い4 つの長期記憶を取得
保存されたすべての長期記憶を返却
100 個の長期記憶
Semantic 検索なし
Semantic 検索あり
Long-term 
Memory
AgentCore memory: Semantic Search


## p.46

Context まとめ
• Context は多いほど良いわけではない、必要最小限に抑える
Context Rot、Lost in the Middle により性能低下の原因に
• Context を必要最小限に保つために情報を圧縮
• Sliding Window / Summarization (セッション内)
• AgentCore Memory Long-term Memory (セッション横断)


## p.47

LLM が使いやすいTools の設計方法
Tools


## p.48

Tool を増やすと万能なAI Agent が作れるのか？


## p.49

Tool 増加/ 定義の曖昧さが引き起こすエラー
売上Agent
search
売上DB
今月いくら儲かった？
get_sales
get_revenue


## p.50

Tool 増加/ 定義の曖昧さが引き起こすエラー
売上Agent
search
売上DB
今月いくら儲かった？
get_sales
get_revenue
どのTool を使うべきなんだ….


## p.51

Tool の不必要なリトライ
売上Agent
Tool
誤ったTool の選択/ 利用によりタスク終了に至らずリトライを続ける
コスト増加、応答速度低下を引き起こす
Call
Error
売上DB


## p.52

Tools で起こる課題と解決策
• 課題
•
Tool 定義の曖昧さによるTool 利用のミス
•
Tool 数増加によるTool 選択のミス
•
Tool の不必要なリトライによる応答速度低下・コスト増


## p.53

Tools で起こる課題と解決策
• 課題
•
Tool 定義の曖昧さによるTool 利用のミス
•
Tool 数増加によるTool 選択のミス
•
Tool の不必要なリトライによる応答速度低下・コスト増
• 解決アプローチ
•
AI Agent が利用しやすいTool の設計
•
必要な時に必要なTool をロード/ 実行
•
AI Agent がリトライしやすいTool 設計
•
Tool リトライ制御レイヤーの追加


## p.54

Tools で起こる課題と解決策
• 課題
•
Tool 定義の曖昧さによるTool 利用のミス
• 解決アプローチ
•
AI Agent が利用しやすいTool の設計


## p.55

AI Agent が使いやすいTool のデザイン
{
"name": "search",
"description": "データベースからデータを検索",
"parameters": {
"query": {
"type": "string",
"description": "検索クエリ"
}
}
}
汎用的で
使いどころが曖昧
Bad


## p.56

AI Agent が使いやすいTool のデザイン
Bad
Good
{
"name": "get_sales_by_branch",
"description": "売上DB から指定した店舗期間の
売上データを取得する",
"parameters": {
"branch_name": {
"type": "string",
"description": "店舗名(例: '幕張店', '渋谷店‘)"
},
…..
}
{
"name": "search",
"description": "データベースからデータを検索",
"parameters": {
"query": {
"type": "string",
"description": "検索クエリ"
}
}
}
具体的で
いつ・どう使うかが明確
汎用的で
使いどころが曖昧


## p.57

Tools で起こる課題と解決策
• 課題
•
Tool 数増加によるTool 選択のミス
• 解決アプローチ
•
必要な時に必要なTool をロード


## p.58

必要なツールのみローディング
AgentCore
gateway
Tool  の一覧要求
300 以上のツールすべてが返却
150 Tools
100 Tools
70 Tools
Tools 検索なし
AgentCore gateway: Semantic Search


## p.59

必要なツールのみローディング
AgentCore
gateway
検索: 「売上レポートを作成する」
Tool  の一覧要求
最も関連性の高い4 つのツールを返却
300 以上のツールすべてが返却
150 Tools
100 Tools
70 Tools
Tools 検索なし
Tools 検索あり
AgentCore gateway: Semantic Search


## p.60

Tools で起こる課題と解決策
• 課題
•
不必要なTool リトライによる応答速度低下・コスト増
• 解決アプローチ
•
AI Agent がリトライしやすいTool 設計
•
Tool リトライ制御レイヤーの追加


## p.61

AI Agent がリトライしやすいエラーのデザイン
Bad
"Error: Invalid input" 
# リトライのための情報が少なすぎる
{"traceback": "File "tmp/hoge/fuga … , requests.exceptions. ….
# 情報が多すぎて多くのToken を消費


## p.62

AI Agent がリトライしやすいエラーのデザイン
Bad
Good
{
"status": "error",
"error": "Invalid input",
"received": "2024/13/45",
"expected_format": "YYYY-MM-DD",
"example": "2024-03-15",
}
"Error: Invalid input"
# リトライのための情報が少なすぎる
{"traceback": "File "tmp/hoge/fuga … , requests.exceptions. ….
# 情報が多すぎて多くのToken を消費
# リトライのための情報が簡潔に記載


## p.63

Tool のレートリミット
データ分析Agent
Tool A
DB
Counter
Fail
No
Yes
コードレベルで余計なリトライを制御
セッションあたり
Tool A 実行回数10 回以下


## p.64

Tools まとめ
• Tool 利用のエラーを減らすために
AI Agent の使いやすい簡潔なTool 定義
• Tool 選択のエラーを減らすために
AgentCore Gateway のSemantic Tool Search で
動的に必要なTool だけ取得
• 不必要なリトライを減らすために
AI Agent がリトライしやすいエラー設計
セッションあたりのTool 実行回数に上限を設ける


## p.65

Architecture
ユースケースを整理し、要件を満たすシンプルな
アーキテクチャを選択すること
Context
タスクを解くのに必要最小限の情報を設計すること
Tools
AI Agent が理解しやすい簡潔な定義にし
Tool 数を最小限に抑えること
本セッションのまとめ


## p.66

Ask the Speaker
こちらのRoom 後方の外側にございます、
「Ask the Speaker」カウンターまでお越しください
長友健人
アマゾンウェブサービスジャパン合同会社
Room


## p.67

本セッションのアンケートへ
ご協力をお願いします
Please give us your feedback
Thank you!
AIM314
