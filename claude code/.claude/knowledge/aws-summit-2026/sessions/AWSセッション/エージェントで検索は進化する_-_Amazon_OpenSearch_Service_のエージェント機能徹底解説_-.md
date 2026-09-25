---
title: "エージェントで検索は進化する - Amazon OpenSearch Service のエージェント機能徹底解説 -"
category: "AWSセッション"
session_id: "ANT407"
pages: 69
topics: ["その他"]
services: ["Amazon Aurora", "Amazon OpenSearch", "Kiro", "MCP"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/AWSセッション/エージェントで検索は進化する - Amazon OpenSearch Service のエージェント機能徹底解説 -.pdf"
---
# エージェントで検索は進化する - Amazon OpenSearch Service のエージェント機能徹底解説 -


## p.1

ANT407
エージェントで検索は進化する
- Amazon OpenSearch Service のエージェント機能徹底解説-
榎本貴之
アマゾンウェブサービスジャパン合同会社


## p.2

榎本
貴之
(えのもと
たかゆき)
シニアアナリティクスソリューションアーキテクト
• Amazon OpenSearch Service の導入支援から
運用相談まで、検索基盤に関する課題をサポート
• OpenSearch ユーザーグループを運営
• 好きなOSS
OpenSearch, Apache Kafka
自己紹介


## p.3

本セッションについて
お話しすること
01 従来検索技術のおさらい
02 エージェント型検索の概要と内部実装
03 エージェントによる検索精度改善
想定聴講者
•
検索エンジンの利用経験がある方、興味がある方
•
検索の改善を検討されている方


## p.4

従来検索技術のおさらい


## p.5

デモケース- AnyCompany
• アパレルから食品まで扱う
総合EC サイトを運営
• 商品検索の精度が売り上げに直
結するため、検索基盤を内製で
運用している
• 検索の改善を継続的に進めて
おり、次の打ち手を模索中


## p.6

AnyCompany のこれまでの取り組み
01
RDBMS の利用
LIKE による
部分一致検索
精度・機能面で課題
02
検索エンジンの
導入
柔軟な全文検索、
絞り込み検索の
実現
03
ベクトル検索の
導入
全文検索との
組み合わせによる
精度向上


## p.7

• RDBMS で商品情報、在庫管理、検索をすべて担当
• 検索精度、機能拡充、パフォーマンス改善のために、検索エンジンを導入
RDBMS における課題
レトロなバッグ
Amazon Aurora
PostgreSQL
検索精度改善
機能拡充
パフォーマンス改善


## p.8

• 全文検索、ベクトル検索、エージェント型検索など、
様々な検索をシングルプラットフォームで提供
• ペタバイトスケール、ミリ秒クラスの応答性能。
数十億規模以上のベクトル検索に対応
• API コネクターやMCP による機能拡張、マネージドパイプラインによる
RDBMS とのリアルタイムデータ連携をサポート
Amazon OpenSearch Service
Amazon Aurora
PostgreSQL
Amazon OpenSearch
Ingestion
Amazon OpenSearch
Service


## p.9

🔍レトロなバッグ
PostgreSQL
OpenSearch


## p.10

🔍レトロなバッグ


## p.11

OpenSearch の全文検索クエリ
{
"query": {
"multi_match": "レトロなバッグ",
"fields": ["name_ja^4", "description_ja"],
"operator": "and"
}
}
重みづけ条件


## p.12

以下のような機能も提供可能に
オートコンプリート
ファセット
ハイライト
類似商品検索


## p.13

意味の近さによる検索への対応
• 全文検索は厳密な一致による
結果を返すことが得意
• クエリの内容が曖昧であるほど
マッチしないためアイテムが
ヒットしない
• “軽い素材のトップス”に対して
リネンシャツを返すなど、
意味的に近いアイテムを
検索結果として提示したい


## p.14

• 同一のベクトル空間内に配置されたベクトルと、クエリのベクトルとの
類似性を計算することで、意味的に近いデータを取得する手法
• クエリや検索対象のデータ(テキスト、画像、音声など)から
埋め込みモデルによってベクトルを生成することで実現可能
ベクトル検索
[1.23, 0.21, 0.08, -1.21, …, 4.23]
クエリのドキュメント
例) 犬
検索対象データのベクトル
猫
チワワ
人間
ビル
車
カンガルー
クエリのベクトル


## p.15

•
外部のモデルを登録し、データ格納・検索時にパイプライン経由で呼び出す
•
パイプラインに備わっているビルトインの変換機能と組み合わせることで、
OpenSearch 単体でベクトル生成からハイブリッド検索まで完結可能
ML 連携機能によるベクトル検索の実装
画像
文書
音声


## p.16

•
外部のモデルを登録し、データ格納・検索時にパイプライン経由で呼び出す
•
パイプラインに備わっているビルトインの変換機能と組み合わせることで、
OpenSearch 単体でベクトル生成からハイブリッド検索まで完結可能
ML 連携機能によるベクトル検索の実装
画像
文書
音声
Indexing
Pipeline
+Connector
•
データ分類、メタデータ検出
•
ベクトル生成、テキスト翻訳


## p.17

•
外部のモデルを登録し、データ格納・検索時にパイプライン経由で呼び出す
•
パイプラインに備わっているビルトインの変換機能と組み合わせることで、
OpenSearch 単体でベクトル生成からハイブリッド検索まで完結可能
ML 連携機能によるベクトル検索の実装
画像
文書
音声
Indexing
Pipeline
+Connector
•
データ分類、メタデータ検出
•
ベクトル生成、テキスト翻訳
Embeddings 1 0 0.9 001.0 00 0…
チャンク1
チャンク2
チャンク3
Embeddings 2 0 0.9 001.0 00 0…
Embeddings 3 0 0.9 001.0 00 0…
ベクトル
インデックス
Embeddings 1 0 0.9 001.0 00 0…
テキスト
属性1
属性2
Embeddings 1 0 0.9 001.0 00 0…
Embeddings 1 0 0.9 001.0 00 0…
テキスト
インデックス


## p.18

•
外部のモデルを登録し、データ格納・検索時にパイプライン経由で呼び出す
•
パイプラインに備わっているビルトインの変換機能と組み合わせることで、
OpenSearch 単体でベクトル生成からハイブリッド検索まで完結可能
ML 連携機能によるベクトル検索の実装
画像
文書
音声
Embeddings 1 0 0.9 001.0 00 0…
チャンク1
チャンク2
チャンク3
Embeddings 2 0 0.9 001.0 00 0…
Embeddings 3 0 0.9 001.0 00 0…
ベクトル
インデックス
Embeddings 1 0 0.9 001.0 00 0…
テキスト
属性1
属性2
Embeddings 1 0 0.9 001.0 00 0…
Embeddings 1 0 0.9 001.0 00 0…
テキスト
インデックス
Indexing
Pipeline
+Connector
Search
Pipeline
+Connector
検索結果の結合
(ハイブリッド検索)
•
データ分類、メタデータ検出
•
ベクトル生成、テキスト翻訳
•
再ランキング
•
LLM による回答生成


## p.19

🔍軽い素材のトップス
全文検索
ハイブリッド検索


## p.20

🔍軽い素材のトップス
全文検索
ハイブリッド検索


## p.21

ハイブリッド検索クエリ
{
"query": {
"hybrid": {
"queries": [
{
"multi_match": {
"query": "軽い素材のトップス",
"fields": ["name_ja^2", "description_ja"],
"operator": "and"
}
},
{
"neural": {
"description_ja": {
"query_text": "軽い素材のトップス",
"k": 10
}
}
}
]
}
},
全文検索
裏側で
ベクトル化して
ベクトル検索
複数の検索結果を
統合


## p.22

ハイブリッド検索クエリ
{
"query": {
"hybrid": {
"queries": [
{
"multi_match": {
"query": "軽い素材のトップス",
"fields": ["name_ja^2", "description_ja"],
"operator": "and"
}
},
{
"neural": {
"description_ja": {
"query_text": "軽い素材のトップス",
"k": 10
}
}
}
]
}
},
"search_pipeline" : {
"phase_results_processors": [
{
"score-ranker-processor": {
"combination": {
"technique": "rrf"
}
}
}
]
}
}
＋
全文検索、ベクトル検索の順位を
元にハイブリッド検索の順位を調整


## p.23

エージェント型検索


## p.24

ハイブリッド検索でも解けない課題
より複雑なリクエストへの対応
“20,000 円以下のA 社の防水ジャケット“
•
クエリ内に含まれるフィルタ条件を
抽出し、クエリに落とし込みたい
•
クエリの内容によって全文検索と
ベクトル検索を使い分けたい
•
機械学習モデルによるフィルタ条件の
抽出は効果的だが導入ハードルが高い
対話的な検索
"もう少し安いの"
“前回と同じメーカー"
"今度は赤いので"
•
対話的に条件を絞り込めるようにしたい
•
以前の問い合わせを元に、ユーザーごとに
最適な商品の提示を行いたい


## p.25

エージェントによるクエリ生成
“防水ジャケット
20,000 円以下で”
•
購買履歴
•
閲覧履歴
•
ユーザー属性
Context


## p.26

エージェントによるクエリ生成
“防水ジャケット
20,000 円以下で”
AI Agent
Memory
Web Search
Runtime
MCP
•
購買履歴
•
閲覧履歴
•
ユーザー属性
Context


## p.27

エージェントによるクエリ生成
“防水ジャケット
20,000 円以下で”
AI Agent
Memory
Web Search
Runtime
MCP
•
購買履歴
•
閲覧履歴
•
ユーザー属性
Context
Query
全文検索
防水ジャケット/撥水
/レインジャケット/アウター
ベクトル検索
防水ジャケット
フィルタ
price ≤ 20,000


## p.28

Agentic query
powered by OpenSearch
クエリ
エージェント
インデックス
一覧取得
Web 検索
MCP
データ1
リランク
結果
コンテキ
スト収集
クエリ
計画
クエリ
検証
データ2
データN
ツール
検索
訓練済みのクエリプランナー:
専門的なOpenSearch に関するプロンプトを搭載。
複雑な問い合わせからQuery DSL を生成
ツールによる拡張:
エージェントが最適なツールを自律的に選択。
MCP やWeb Search を組み合わせることで、
より高精度なクエリを生成するためのデータを収集
カスタマイズ:
クエリテンプレートやプロンプトを組み合わせて
専門的なニーズに対応
オールインワン:  OpenSearch 内部で全て完結


## p.29

Agentic query による検索の流れ
“防水ジャケット
20,000 円以下で”
OpenSearch


## p.30

Agentic query による検索の流れ
“防水ジャケット
20,000 円以下で”
Agentic Query
Translator Processor
Request Processors
Search Pipeline
OpenSearch


## p.31

Agentic query による検索の流れ
“防水ジャケット
20,000 円以下で”
Agentic Query
Translator Processor
Request Processors
Search Pipeline
OpenSearch
エージェント
メモリ
コネクター
LLM
MCP
Web
API
①クエリ変換を実行


## p.32

Agentic query による検索の流れ
“防水ジャケット
20,000 円以下で”
Agentic Query
Translator Processor
Request Processors
Search Pipeline
OpenSearch
エージェント
メモリ
コネクター
LLM
MCP
Web
API
①クエリ変換を実行
検索インデックス
(テキスト、ベクトル)
②変換後のクエリで
検索を実行


## p.33

Agentic query による検索の流れ
“防水ジャケット
20,000 円以下で”
Agentic Query
Translator Processor
Request Processors
Search Pipeline
OpenSearch
エージェント
メモリ
コネクター
LLM
MCP
Web
API
①クエリ変換を実行
検索インデックス
(テキスト、ベクトル)
②変換後のクエリで
検索を実行
パイプライン
コンテキスト
③エージェントの思考過程、
変換されたクエリ、メモリID を保存


## p.34

Agentic query による検索の流れ
“防水ジャケット
20,000 円以下で”
Agentic Query
Translator Processor
Request Processors
Search Pipeline
OpenSearch
エージェント
メモリ
コネクター
LLM
MCP
Web
API
検索インデックス
(テキスト、ベクトル)
パイプライン
コンテキスト
Agentic Context 
Processor
Response Processors
④検索結果を取得


## p.35

Agentic query による検索の流れ
“防水ジャケット
20,000 円以下で”
Agentic Query
Translator Processor
Request Processors
Search Pipeline
OpenSearch
エージェント
メモリ
コネクター
LLM
MCP
Web
API
検索インデックス
(テキスト、ベクトル)
パイプライン
コンテキスト
Agentic Context 
Processor
Response Processors
④検索結果を取得
⑤エージェントの思考過程、
変換されたクエリ、メモリID を取得


## p.36

Agentic query による検索の流れ
“防水ジャケット
20,000 円以下で”
Agentic Query
Translator Processor
Request Processors
Search Pipeline
OpenSearch
エージェント
メモリ
コネクター
LLM
MCP
Web
API
検索インデックス
(テキスト、ベクトル)
パイプライン
コンテキスト
Agentic Context 
Processor
Response Processors
④検索結果を取得
⑤エージェントの思考過程、
変換されたクエリ、メモリID を取得
④と⑤の結果を
合わせて返却


## p.37

• Flow Agent はシンプルなクエリ変換をサポート。要インデックス指定
• Conversational Agent はメモリと複数のツールを使用可能。Web Search、
MCP など外部と連携した複雑な処理を実現
• 両エージェントとも、クエリ変換にはQuery Planning Tool を使う
二つのエージェント
LLM
Remote
MCP Server
Web
Query Planning Tool
インデックス取得
マッピング取得
Web 検索
MCP
Query Planning Tool
LLM
メモリー
Single call
N calls
Flow Agent
Conversational Agent


## p.38

エージェントから与えられた情報に加えて、ツール内で取得した情報や
カスタムプロンプトを加えてLLM を呼び出し、クエリを生成するツール
Query Planning Tool
クエリ
テンプレート
(オプション)
スキーマ
サンプル
ドキュメント
カスタム
プロンプト
(オプション)
Agent
Query Planning Tool
ユーザー
リクエスト
インデックス
名
メモリー
ツール情報
(MCP、Web)
標準
プロンプト
LLM


## p.39

• OpenSearch の専門知識を注入するためのデフォルトプロンプトを用意
• クエリの構造ルールや、用途に応じたクエリサンプルを持っている
• デフォルトプロンプトの内容は公開リポジトリから確認可能
標準プロンプト
NEURAL / SEMANTIC SEARCH
When to use:
- The intent is conceptual/semantic (“about”, “similar to”, long 
phrases, synonyms, multilingual, ambiguous), and the mapping has:
• type: "semantic", or
• type: "knn_vector".
https://github.com/opensearch-project/ml-commons/blob/main/ml-
algorithms/src/main/java/org/opensearch/ml/engine/tools/QueryPlanningPromptT
emplate.java
プロンプトの抜粋- 意図が曖昧な時にベクトル検索を使うよう指示


## p.40

🔍二万円以下の防水ジャケット
Agentic query
ハイブリッド検索


## p.41

🔍二万円以下の防水ジャケット
Agentic query
ハイブリッド検索


## p.42

🔍二万円以下の防水ジャケット
Agentic query
ハイブリッド検索


## p.43

{
"query": {
"agentic": {
"query_text": "二万円以下の防水ジャケット",
"memory_id": "<optional>"
}
}
}
Agentic query


## p.44

"query": {
"hybrid": {
"pagination_depth": 50,
"queries": [
{
"multi_match": {
"query": "防水ジャケット撥水レインジャケットアウター",
"fields": ["name_ja^2", "description_ja"],
"minimum_should_match": "2<75%"
}
},
{
"neural": {
"description_ja": {"query_text": "防水ジャケット", "k": 20}
}
}
],
"filter": {
"range": {"price_jpy": {"lte": 20000}
}
}
}
}
全文検索
ベクトル検索
フィルタ


## p.45

エージェントの思考(防水のジャケットで～)
AGENT STEPS (日本語訳。実際は英語)
このインデックスには以下のフィールドがあります：
- description_ja — セマンティックフィールド。日本
語のセマンティック検索に最適です。
- price_jpy — JPY 価格でフィルタリングするための
integer フィールド
- category / category_ja — カテゴリーでのフィルタ
リング用。
これからQuery Planning Tool に対して、セマン
ティック検索と価格フィルタを指定した、日本語の文
脈で完結する自然言語の質問を投げます(…)


## p.46

メモリによる絞り込み(あと3000円安いもの)
AGENT STEPS (日本語訳。実際は英語)
(…) 
ユーザーは前回のクエリの価格フィルタ（20,000円以
下）より3,000円安い商品を求めているため、新しい
価格上限は17,000円（20,000 − 3,000）になります。
(…)
商品の文脈（防水ジャケット）は引き続き同じです。
まずインデックスマッピングを確認してフィールド名
を検証し、その後Query Planning Tool を呼び出しま
す。
(…)


## p.47

Agentic query を最大限活用するには


## p.48

Pros
• 複雑な自然言語による
問い合わせも対応可能
• メモリを活用した対話型、
パーソナライズされた検索
体験を提供可能
• 既存インデックスを
活用可能
Pros/Cons を理解して使用する
Cons
• レイテンシが増加する
• LLM 呼び出しコスト
• 生成される結果の不一致
• レイテンシとコストとのトレードオフ
• 対話型エージェントチャットからの利用など、
ユーザーを秒単位で待たせておけるユース
ケースでの利用を推奨


## p.49

• 依然としてスキーマ設計は重要
• カテゴリ、ブランド、価格や色、在庫、人気度といった情報が豊富に
揃っていれば、エージェントはより複雑なクエリを組み立てられる
フィールドを充実させる
{
"id": {"type": "keyword"},
"name": {"type": "text"},
"description": {"type": "text"},
"category": {"type": "keyword"},
"style": {"type": "keyword"},
"price": {"type": "float"},
"current_stock": {"type": "integer"}
}
{
"name": {"type": "text"},
"description": {"type": "text"}
}
Good
Bad


## p.50

• Mustache 形式のクエリテンプレートをエージェントに与える
ことで、生成されるクエリの安定性が向上。
• 複数テンプレートがある場合は適切なものをエージェントが選択。該当
するものが無ければ使われない
• テンプレート選択に伴うLLM 呼び出し回数の増加に注意
クエリテンプレートを活用する
{
"script": {
"lang": "mustache",
"source": {
"size": 0,
"query": { "term": { "address.city": "{{city}}" } },
(…)


## p.51

• Agentic query はフィールド名と型、先頭1 件のドキュメントをコンテキ
ストとしてクエリを組み立てる
• カテゴリなどのフィルタ要素については全ての値を知りえないため、
代表値をプロンプトに含めることでエラークエリーを削減できる
サンプルデータをプロンプトで明示する
==== FIELD VALUE HINTS (DOMAIN-SPECIFIC) ====
Some keyword fields have a fixed enum of allowed values.
ALWAYS map user wording to one of these exact values; never invent values.
- category_ja (keyword) allowed values:
["家具", "衣料品", "キッチン用品", "アクセサリー", "電化製品", "本"]
Mapping hints:
user "shoes / footwear / sneakers" →"衣料品"
user "microwave / fridge / appliance" →"電化製品"
user "kitchenware / cookware / pan" →"キッチン用品"
(...)


## p.52

• Few-shot を用いることで精度が向上する場合もあれば、過剰適合となる
場合もある。モデルとの組み合わせに応じてショット数を調整する必要
あり
• 高度なモデルほどショット数が多いと精度が逆に低下する傾向あり
モデルに応じてカスタムプロンプトを調整
## Example 1 (single filter) Question: "1万円以下のアウトドア用品" Output: 
{"size":10,"query":{"hybrid":{"pagination_depth":50,"queries":[ 
{"multi_match":{"query":"アウトドア用品キャンプ登山
","fields":["name_ja^2","description_ja"],"minimum_should_match":"2<75%"}}, 
{"neural":{"description_ja":{"query_text":"アウトドア用品","k":20}}} 
],"filter":{"range":{"price_jpy":{"lte":10000}}}}}}


## p.53

エージェントが生成するクエリが正しく
機能するには、検索エンジンの精度が重要
改善サイクル
1. 計測: クリック率や購入率、ゼロ件ヒット
2. 分析: 課題を特定し、改善案を作成
3. 評価: 改善案の効果を検証
4. 適用: A/B テストを通じてサービス適用
検索エンジンの精度を高める


## p.54

OpenSearch は検索精度の
改善を行う仕組みを提供
• User Behavior Insights
• Search Relevance Workbench
• Learning to Rank
OpenSearch の検索精度改善ツール


## p.55

User Behavior Insights
• OpenSearch が定めるユーザー
行動ログの標準スキーマ
• 検索品質の評価・改善サイクル
を回すための基盤
• クエリログとイベントログの二
つのログを同じフォーマットで
記録。クエリID による
相関分析が可能


## p.56

クエリセット、正解リスト、検索設定の3つを組み合わせて、改善効果を測
定。LLM もしくはUBI で集めた情報を元にした正解判定が可能
Search Relevance Workbench
Query Set
評価対象クエリ群
Judgments
クエリ× 商品の正解
Search Config
全文/ハイブリッド/…
比較対象の検索設定


## p.57

•
特徴量を機械学習でランキング関数に組み上げるアプローチ
•
クエリに対する検索結果に加えて、ビジネス要件やユーザーの属性など検索エンジンが
持っていない特徴量も学習に使用することで、柔軟なランキングを実現
•
UBI で集めたユーザー行動、SRW で作成した正解リストなどを学習に転用可能
Learning to Rank
OpenSearch
Learning to Rank
特徴量
正解リスト
トレーニングデータ
検索結果
機械学習
モデル
XGBoost, RankLib
クエリ
リランキング
結果
🔍二万円以下の
防水ジャケット


## p.58

人間による分析は負荷が高い
• 複数のツールを横断的に見る必要があり、認知負荷が高い
• 仮説を立て、検証するサイクルを回す人間がボトルネックになる


## p.59

エージェントを活用した検索精度の改善


## p.60

エージェントによる精度改善のサポート
• エージェントがUBI、SRW と連携し分析から提案まで実行
• OpenSearch MCP をエージェントに組み込むことで利用可能
OpenSearch
MCP Server
エージェント
(Strands,
Kiroなど)
Search Relevance
Tools
OpenSearch
UBI ログ
SRW
(API、データ)


## p.61

OpenSearch Official MCP 組み込み
{
"mcpServers": {
"opensearch": {
"command": "uvx",
"args": ["opensearch-mcp-server-py"],
"env": {
"OPENSEARCH_URL": "https://...",
"OPENSEARCH_ENABLED_CATEGORIES": "search_relevance",
"AWS_REGION": "us-east-1"
},
"autoApprove": [ "Get*", "Search*"]
}
}
}
明示的な有効化が
必要


## p.62

実行例– 問題点の抽出
キーワード検索より
ハイブリッド検索が負けてる
クエリは？
生活雑貨
−0.680
照明
−0.260
通勤に使えるバッグ
−0.240
白シャツ
−0.230
夏でも涼しいシャツ
−0.190
考察:
短いカテゴリ語と「色+ 品名」でBM25 が強い
質問
回答


## p.63

実行例– 改善案の相談
質問
機械学習(LTR) で弱点を
埋めるなら、どんな特徴を
使うべき？3 つ提案して。
- 名前と観点
- 先の弱点クエリで例示
- 互いに違う観点を測ること
回答
①category_exact_match
カテゴリの厳密な一致
e.g.「生活雑貨」「照明」
②color_name_match
色とアイテム名の一致
e.g. 「白シャツ」「黒スニーカー」
③semantic_similarity
曖昧検索の一致度
e.g. 「リビングに置けるおしゃれな椅子」


## p.64

(Work in progress) Relevance Agent
https://www.youtube.com/watch?v=N5BL_iaKpJQ


## p.65

(Work in progress) Agent Health


## p.66

Key Takeaways
01 エージェントを検索エンジンに組みこむことで
複雑な検索に対応できるようになる
02 Agentic query においては検索エンジンと
エージェントそれぞれのチューニングが重要
03 OpenSearch はエージェントによる
検索から精度改善まで一貫してサポート


## p.67

デモアプリの検索結果比較機能を使うことで、AnyCompany が体験した全
文検索、ハイブリッド、エージェント検索の導入による検索体験の改善、
UBI、SRW、LTR による精度測定と改善を追体験いただけます
EC サイト検索ワークショップのご紹介


## p.68

Ask the Speaker
こちらのRoom 後方の外側にございます、
「Ask the Speaker」カウンターまでお越しください
榎本貴之
アマゾンウェブサービスジャパン合同会社
Room


## p.69

本セッションのアンケートへ
ご協力をお願いします
Please give us your feedback
Thank you!
ANT407
