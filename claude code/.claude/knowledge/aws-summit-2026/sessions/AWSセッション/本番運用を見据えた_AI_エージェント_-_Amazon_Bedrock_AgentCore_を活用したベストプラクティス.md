---
title: "本番運⽤を⾒据えた AI エージェント - Amazon Bedrock AgentCore を活⽤したベストプラクティス"
category: "AWSセッション"
session_id: "AIM342"
pages: 48
topics: ["生成AI/エージェント"]
services: ["AgentCore", "Amazon Bedrock", "Amazon CloudWatch", "MCP"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/AWSセッション/本番運⽤を⾒据えた AI エージェント - Amazon Bedrock AgentCore を活⽤したベストプラクティス.pdf"
---
# 本番運⽤を⾒据えた AI エージェント - Amazon Bedrock AgentCore を活⽤したベストプラクティス


## p.1

AIM342
本番運⽤を⾒据えたAI エージェント
- Amazon Bedrock AgentCore を活⽤したベストプラクティス
安藤慎太郎
アマゾンウェブサービスジャパン合同会社


## p.2

安藤 慎太郎 / Shintaro Ando
アマゾン ウェブ サービス ジャパン合同会社
ソリューションアーキテクト
好きな AWS サービス
Amazon Bedrock AgentCore 
デジタル領域のエンタープライズのお客様を
中⼼にクラウドの技術⽀援を担当


## p.3

主な対象者
• AI エージェントを構築したい / 構築している開発者
このセッションで紹介すること
ü ビジネス価値のある AI エージェントを開発し、
継続的に本番運⽤する上で指針となる基本的な 9 つのベストプラクティス 
このセッションで紹介しないこと
✗AI エージェントの基本的な仕組みや LLM について
✗Amazon Bedrock AgentCore の各機能や、
エージェントフレームワークを⽤いた AI エージェント実装の詳細
本セッションの内容


## p.4

課題から逆算して
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


## p.5

プロトタイプから本番環境に進む際の課題
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


## p.6

Amazon Bedrock AgentCore で
⼤規模にAI エージェントを本番運⽤
アプリケーション
任意のモデル
コンテキスト
任意の
フレームワーク
runtime
identity
observability
gateway
browser
code interpreter
memory
evaluations
policy
ツール
任意のIdP
OTEL
A2A
任意の
エージェント
MCP
ツール
プロンプト


## p.7

課題から逆算して
⼩さく始める
1
エージェントの
評価を⾃動化する
4
基盤を作る
?
?
本⽇紹介する 9 つのルール (再掲)
ツールとAPI 連携
を計画する
2
オブザーバビリティを
初⽇から設定する
3
?
?


## p.8

ユースケースと
期待される成果物を定義し、
PoC でアイデアを検証する
課題から逆算して
⼩さく始める
ルール#1
エージェントがすること・
しないことを明確に定義
トーン、挨拶、ブランディングを設定
明確で完全な定義を使⽤し、
曖昧さを避ける
期待されるやり取りの正解データを定義


## p.9

財務分析エージェントの例
財務分析エージェント
レポート
⽣成
データ
アクセス
Web
検索
データ
分析
複数ユーザーへの対応
ジョン
エージェント開発者
アンナ
財務アナリスト (利⽤者)
マイケル
AI プラットフォームエンジニア
ルール#1


## p.10

ジョンの
給与は︖
2025 年上半期の
総利益は ?
エージェント
2025 年上半期の総利益は 、
XXX 円でした。内訳は …
エージェント
申し訳ありません、
社内の報酬に関する質問には
お答えできません
ルール#1
利⽤者


## p.11

エージェントにツールを
直接追加もできるが、
エージェント間での
⾞輪の再発明は避ける
ツールと
API 連携を
計画する
ルール#2
明瞭かつ網羅的にツールの説明をパラメータ含めて定義
機能の曖昧さを避け、⼊出⼒フォーマットを⽂書化
明確なエラー処理ガイドラインを設定し、
組織で事前承認されたツールカタログを⽤意
既存MCP サーバーを再利⽤し、新規作成ツールも MCP で公開
コードサンプルで連携パターンを⽰す
プラットフォームエンジニア
の出番です


## p.12

初⽇から検証⽤クエリも準備し、
デバッグが⾏える状態を整える
オブザーバビリティを
初⽇から設定する
ルール#3
フレームワークやサービスが
出⼒するOTEL トレースを活⽤
トレースレベルの
デバッグ機能を有効化
ダッシュボードを活⽤
ルール#3


## p.13

オブザーバビリティは
エージェントの動作を理解し、
監査するのに役⽴ちます。
• デバッグ
• 品質監査
• 問題の検出
• パフォーマンストレンド
などの把握に重要です。
エージェント開発の初⽇から
オブザーバビリティの
パイプラインを設定しましょう。
⾼レイテンシーの原因は ? 
ハルシネーション起きてない ?
このターンでは
どのツールが使⽤された ?
各チームの利⽤コストは︖
それぞれのエージェントは
どういう挙動をする ?
エージェントX が失敗した時
何が起きてた ?
ルール#3
開発者
プラットフォーム


## p.14

開発の早い段階で
技術・ビジネス⾯のメトリクスと
ベンチマークを定める
エージェントの
評価を⾃動化する
ルール#4
エージェントの評価プロセスに
業務部⾨が早期から参加
様々な尋ね⽅をする同⼀内容の質問で
想定回答 (Ground Truth) を定義
様々なユーザーの意図やシナリオを
カバーする多様な例を収集
評価セットに
エージェントの誤⽤例を含める
技術・ビジネス⾯のメトリクスの
両⽅を考慮


## p.15

エージェントに
聞く予定の質問と期待する回答は
…
です。
素晴らしい、それを
エージェントの会話として構造化しますね︕
⼀貫した動作を確認するために
バリエーションも作ります。
ルール#4
開発者
利⽤者


## p.16

「良い回答」とは何だと思いますか ? どう評価しますか ?
既存のドキュメントに基づいた事実ベースの回答が欲しいです。
また、正確性は⾮常に重要です。
誤った情報は、経営層に完全に間違った提⾔をしてしまいます。
あと、でっち上げはしないでほしいです。
間違った答えよりも「その情報はありません」と⾔ってほしい。
引⽤、正確性、ハルシネーションのメトリクスですね。
回答までの時間やコストなどの
アプリケーションメトリクスも考慮すべきですよね︖
お願いします︕
ルール#4
開発者
利⽤者


## p.18

AgentCore runtime
Amazon Bedrock 
AgentCore
identity
エージェント
LLM 推論


## p.19

AgentCore runtime
Amazon Bedrock 
AgentCore
identity
ユーザー
エージェント
React
⼊⼒
応答
⼊⼒
応答
LLM 推論


## p.20

AgentCore runtime
Amazon Bedrock 
AgentCore 
code interpreter
AgentCore
identity
code interpreter にデータを読み込み
code interpreter でデータ分析
ユーザー
エージェント
React
タスク
タスク
⼊⼒
応答
⼊⼒
応答
LLM 推論


## p.21

AgentCore runtime
Amazon Bedrock 
AgentCore 
code interpreter
AgentCore
identity
AgentCore
gateway
タスク
code interpreter にデータを読み込み
code interpreter でデータ分析
ユーザー
エージェント
React
認証
タスク
タスク
⼊⼒
応答
⼊⼒
応答
LLM 推論
プロジェクト⼀覧取得
プロジェクト取得


## p.22

AgentCore runtime
Amazon Bedrock 
AgentCore 
code interpreter
AgentCore
identity
AgentCore
gateway
タスク
code interpreter にデータを読み込み
code interpreter でデータ分析
AgentCore observability
ユーザー
エージェント
React
認証
タスク
タスク
⼊⼒
応答
⼊⼒
応答
LLM 推論
プロジェクト⼀覧取得
プロジェクト取得


## p.23

AgentCore runtime
Amazon Bedrock 
AgentCore 
code interpreter
AgentCore
identity
AgentCore
gateway
タスク
code interpreter にデータを読み込み
code interpreter でデータ分析
AgentCore observability
ユーザー
エージェント
React
認証
タスク
タスク
⼊⼒
応答
⼊⼒
応答
LLM 推論
AgentCore evaluations
プロジェクト⼀覧取得
プロジェクト取得


## p.24

イベント
フロー図
メタデータなど


## p.25

Amazon CloudWatch の
アラームを設定
各評価の統計やグラフ


## p.26

各トレースやセッション単位の評価
スコアの説明


## p.27

課題から逆算して
⼩さく始める
1
エージェントの
評価を⾃動化する
4
基盤を作る
本⽇紹介する 9 つのルール (再掲)
ツールとAPI 連携
を計画する
2
オブザーバビリティを
初⽇から設定する
3


## p.28

⾼品質に磨く
5 マルチエージェント
を検討する
パーソナルエージェント
をセキュアに構築する
6
できるだけ
コードを使⽤する
7
?
?
?
本⽇紹介する 9 つのルール (再掲)
?


## p.29

複数の特化型エージェントの
オーケストレーションで
拡張性を持たせる
マルチエージェント
を検討する
ルール#5
エージェントに明確な役割と
責任を定義
適切なオーケストレーションの
パターンを使⽤
共有コンテキストとメモリを設定
エージェント間の
インタラクションを監視・最適化


## p.30

fetch_api_data()
query_sql_database()
read_excel_ﬁle()
search_documents()
calculate_statistics()
detect_anomaly()
エージェント
generate_forcast()
compare_trends()
create_visualization()
draft_report()
ルール#5
単独のエージェントで
⼩さく動かし始めることは
⼤事です。
ただし、
そのまま拡張しすぎると…


## p.31

query_sql_database()
fetch_api_data()
read_excel_ﬁle()
search_documents()
calculate_statistics()
detect_anomaly()
generate_forcast()
compare_trends()
create_visualization()
draft_report()
単独のエージェントで
⼩さく動かし始めることは
⼤事です。
ただし、
そのまま拡張しすぎると…
コードが複雑になる
エージェントが混乱する
エージェントが遅く、
⾼コストになる
エージェント
ルール#5


## p.32

マルチエージェント連携により
特化型・モジュール型の
専⾨領域の分割・整理を実現
エージェントのコードが
簡潔で再利⽤可能に
⽬的特化型のエージェント
コスト効率⾼く、より⾼速
エージェント
データ取得
エージェント
レポーティング
エージェント
分析エージェント
ルール#5


## p.33

短期・⻑期メモリを活⽤し
ユーザー体験を個⼈に最適化
パーソナルエージェント
をセキュアに構築する
ルール#6
ユーザーコンテキストと
セッションを分離
ユーザー固有の
⻑期・短期メモリを設定
セキュリティポリシーと
ガードレールを適⽤
本番環境でのすべてのエージェントの
アクションを監視・追跡
エージェントとツールを別々にホスト


## p.34

AgentCore runtime
Amazon Bedrock 
AgentCore 
code interpreter
AgentCore
identity
AgentCore
gateway
タスク
AgentCore observability
AgentCore evaluations
ユーザー
エージェント
React
認証
タスク
タスク
⼊⼒
応答
⼊⼒
応答
LLM 推論
プロジェクト⼀覧取得
プロジェクト取得
code interpreter にデータを読み込み
code interpreter でデータ分析


## p.35

AgentCore runtime
Amazon Bedrock 
AgentCore 
code interpreter
AgentCore
identity
AgentCore
gateway
タスク
AgentCore observability
AgentCore evaluations
ユーザー
エージェント
React
認証
タスク
タスク
⼊⼒
応答
⼊⼒
応答
LLM 推論
プロジェクト⼀覧取得
プロジェクト取得
code interpreter にデータを読み込み
code interpreter でデータ分析
部⾨プロジェクト⼀覧取得
プロジェクト状態⼀覧取得
予算別プロジェクト取得


## p.36

AgentCore runtime
Amazon Bedrock 
AgentCore 
code interpreter
AgentCore
identity
AgentCore
gateway
タスク
PM エージェント
財務エージェント
AgentCore observability
AgentCore evaluations
ユーザー
エージェント
React
認証
タスク
タスク
タスク
⼊⼒
応答
⼊⼒
応答
LLM 推論
プロジェクト⼀覧取得
プロジェクト取得
code interpreter にデータを読み込み
code interpreter でデータ分析
部⾨プロジェクト⼀覧取得
プロジェクト状態⼀覧取得
予算別プロジェクト取得


## p.37

AgentCore runtime
Amazon Bedrock 
AgentCore 
code interpreter
AgentCore
identity
AgentCore
gateway
タスク
AgentCore
memory
PM エージェント
財務エージェント
AgentCore observability
AgentCore evaluations
ユーザー
エージェント
React
認証
コンテキスト
タスク
タスク
タスク
⼊⼒
応答
⼊⼒
応答
LLM 推論
code interpreter にデータを読み込み
code interpreter でデータ分析
プロジェクト⼀覧取得
プロジェクト取得
部⾨プロジェクト⼀覧取得
プロジェクト状態⼀覧取得
予算別プロジェクト取得


## p.38

コードは LLM の推論と⽐較して
より⾼速、低コスト、確実
できるだけ
コードを使⽤する
ルール #7
推論が必要なタスクにのみ
エージェントを利⽤
計算、検証、ルールベースのロジック
には確定的なコードを使⽤する
エージェントにはコードを
オーケストレーションさせ、
従来のコードを代⾏させない
従来のコードが確実に動くなら、
費⽤対効果が⾼いコードを使い続ける


## p.39

確定的なタスクにはコードを使⽤する
認証情報をランタイムに伝搬させ、
属性情報からコードで権限を判断
順番や分岐が確定済みの
ツール呼び出し
ユーザーの
ツール利⽤の認可
コード内分岐で処理
ルール#7
レポート作成時に
“⽇付” 属性が空の場合、
現在⽇ツールを呼び出し
財務部⾨のみ
会計の MCP ツールが使える
例
例


## p.40

継続運⽤する
8 何度も繰り返し
テストする
9 組織体制を整え
規模を拡⼤させる
?
?
本⽇紹介する 9 つのルール (再掲)


## p.41

デプロイ後も
エージェントの動作を監視し、
⼤規模にテストを実⾏する
何度も繰り返し
テストする
ルール #8
エージェントの更新のたびに実⾏される
継続的テストのパイプラインを構築
本番環境で A/B テストを使⽤して
エージェントのバージョンを⽐較
エージェントの動作とモデルの
パフォーマンスの経時変化を監視
本番環境でのすべてのエージェントの
アクションを監視・トレース
品質閾値を下回った場合の
⾃動ロールバック機構を整備


## p.42

エージェントの
本番環境デプロイは
最初の⼀歩
組織体制を整え
規模を拡⼤させる
ルール #9
ユーザーの⾏動パターン・
フィードバックを継続的に収集・分析
想定回答データセットを
観測された本番データで拡張
エージェント開発の標準を定める
プラットフォームチームを組成
全てのエージェントに対して
モニタリングを中央集約
チーム間の⾞輪の再発明を避けるため
チーム横断の活動を促進


## p.43

AI エージェント開発に関わる組織体制
• プレイグラウンド
• モデルの選択
• ツールの選択
• フレームワークの選択
• MCP サーバーの選択
• 既存エージェントの選択
• アクセス制御
• データ前処理
• ツール
• マルチエージェント統合
• MCP クライアントとサーバー
• アイデンティティ伝播
• セッション管理
• モデル評価
• エージェント評価
• 回帰テスト
• 統合セッション
• システムテスト
• エージェントのデプロイ
• ツール/MCP のデプロイ
• オブザーバビリティ
• エージェント監視
• バージョン管理
• ⾃動ビルド
• ⾃動デプロイパイプライン
• データセットの特定
• モデルの探索
• フレームワークの選択
• ユースケースの検証
• アプリケーションの構築
• 精度のテスト
• コーディングアシスタント
• システム評価
• ガードレール
• 品質保証
• 本番環境での
エージェント監視
開発
テスト
本番
プラットフォームチーム
DevOps
ユースケースチーム
ルール#9


## p.44

課題から逆算して
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
まとめ - 本⽇紹介した 9 つのルール


## p.45

今⽇から使えるリソース
Amazon Bedrock
AgentCore
公式ドキュメント
ワークショップ
サンプルリポジトリ
awslabs/agentcore-samples


## p.46

Exhibition Booth Information
展⽰ブースのご案内
A105
AI エージェント/ Agentic AI
AWS Village①


## p.47

Ask the Speaker
こちらのRoom 後⽅の外側にございます、
「Ask the Speaker」カウンターまでお越しください
安藤慎太郎
アマゾンウェブサービスジャパン合同会社
Room


## p.48

本セッションのアンケートへ
ご協⼒をお願いします
Please give us your feedback
Thank you!
AIM342
