---
title: "AI エージェントのオブザーバビリティ実践"
category: "AWSセッション"
session_id: "CNS317"
pages: 47
topics: ["生成AI/エージェント", "運用/SRE"]
services: ["AgentCore", "Amazon Bedrock", "Amazon CloudWatch", "Amazon S3"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/AWSセッション/AI エージェントのオブザーバビリティ実践.pdf"
---
# AI エージェントのオブザーバビリティ実践


## p.1

CNS317
AI エージェントのオブザーバビリティ実践
大石美緒
アマゾンウェブサービスジャパン合同会社


## p.2

自己紹介
大石
美緒
Mio Oishi
アマゾンウェブサービスジャパン
ソリューションアーキテクト
製造業のお客様を中心にご支援しています
好きなAWS サービス: Amazon CloudWatch


## p.3

想定聴講者
• AI Agent の開発に取り組んでおり、本番運用に向けてオブザーバビリティの
導入を検討している方
• メトリクス・ログ・トレースといったオブザーバビリティの基礎は
把握しているが、OpenTelemetry の実装経験はない方
ゴール
• AI Agent のオブザーバビリティにおける課題と、その解決アプローチを
理解すること
• CloudWatch 生成AI オブザーバビリティの導入方法と主な機能を理解する
こと
想定聴講者とゴール


## p.4

AI Agent におけるオブザーバビリティの課題
OpenTelemetry とは
CloudWatch 生成AI オブザーバビリティ概要
導入方法
主な機能
デモ
まとめ
Agenda


## p.5

生成AI
アシスタント
生成AI エージェント
エージェンティックAI
システム
ルールに従った動作
反復タスクの自動化
単一目標の達成
より幅広いタスクへの対応
ワークフロー全体の自動化
完全自律
マルチエージェントシステム
人間の論理・推論の模倣
より多くの
人間の
監視
より少ない
人間の
監視
エージェンティックAI への進化


## p.6

オブザーバビリティ
3つの主要なシグナル
メトリクス
Amazon 
CloudWatch
トレース
ログ


## p.7

生成AI におけるオブザーバビリティ
ログ
メトリクス
トレース
“ユーザーの入力プロンプトと、モデルの出力は…”
“トークン消費量が15% 増加した” 
“エージェントアプリ全体の処理時間の分布は?”
呼び出し数, 呼び出しレイテンシ, 
呼び出しスロットリング, 入力トークン数などを計測
モデル呼び出しの入出力を記録
ユーザーの指示から応答までの流れを追跡


## p.8

生成AI オブザーバビリティ
特有の課題とは？
AI Agent はモデルの推論に基づき
同じ入力でも毎回異なる動きをする
複雑に連鎖する呼び出しの中から根本原因を
追わなければならない
生成AI 呼び出しの
収集と分析をする必要がある
パフォーマンスだけでなく
応答の品質まで含めて
システムの健全性を評価する必要がある
1
2
3
4


## p.9

OpenTelemetry とは


## p.10

OpenTelemetry (OTel) とは
• テレメトリデータを収集するためのオープンソースフレームワーク
• テレメトリデータの作成と送信の標準仕様と実装(ライブラリ群とエージェント)
を提供する
• 仕様を作成し、仕様に基づいて各言語向け/各バックエンド向けの
ライブラリやエージェントが実装される
• ベンダーに依存しないデータモデル、処理方式を提供
10


## p.11

OpenTelemetry のスコープ
計装、収集、送信
コンポーネント
入力
出力
計装
送信
保存
可視化
収集
OpenTelemetry のスコープ
OpenTelemetry のスコープ外


## p.12

AWS が提供するサポートとメンテナンス
AWS のセキュリティ基準への準拠
AWS サービスとOpenTelemetry エコシステムを活⽤可能
可能
AWS 環境でのパフォーマンス最適化AWS サービスでの簡
易なデプロイ
AWS がサポートする
安全で本番利用可能な
オープンソース
ディストリビューション
AWS Distro for 
OpenTelemetry
( ADOT )


## p.13

テレメトリーデータ収集における課題
コンポーネントA
(AWS、Pythonで実装)
計装
送信
保存
収集
可視化
コンポーネントB
（他クラウド、Javaで実装）
コンポーネントC
（オンプレ、.NETで実装）
計装
計装
他クラウド用の
計装ツール
OSSの
計装ツール


## p.14

OpenTelemetry による解決
コンポーネントA
(AWS、Pythonで実装)
計装
送信
保存
収集
可視化
コンポーネントB
（他クラウド、Javaで実装）
コンポーネントC
（オンプレ、.NETで実装）
計装
計装
OpenTelemetry のスコープ
OpenTelemetry のスコープ外


## p.15

Amazon CloudWatch 
生成AI オブザーバビリティ


## p.16

End-to-end のプロンプトトレーシング
Amazon CloudWatch 
生成AI オブザーバビリティ
エージェントワークフローの360° ビュー
シンプルな計装
機密データのマスキング
Amazon Bedrock AgentCore Evaluations 
(応答品質の評価)


## p.17

Amazon CloudWatch 
生成AI オブザーバビリティ
導入方法


## p.18

Amazon Bedrock AgentCore
Agent Runtime
AgentCore Identity
CloudWatch 生成AI オブザーバビリティ
AgentCore Memory
AgentCore Gateway
AgentCore Browser
AgentCore Code Interpreter 
Client
Agent instruction
Agent local tools
Agent context
フレームワーク
任意のmodel


## p.19

エージェントの実行環境に依存しない
Bedrock AgentCore
runtime 以外に
デプロイされた
エージェント
(例Lambda, EC2, EKS, オ
ンプレミス,他のクラウド
プロバイダー)
Non-AgentCore
Amazon Bedrock
Bedrock AgentCore
Runtimeに
デプロイされた
エージェント
AgentCore
CloudWatch 
生成AI 
オブザーバビリティ
Observability dashboards


## p.20

Amazon CloudWatch 
生成AI オブザーバビリティ
主な機能


## p.21

トークン使用量
レイテンシ
リクエストから応答
までの所要時間
スロットリング
上限TPS を超えた
リクエスト数
エラー
システム側とユーザー
側のエラー数
生成AI の
モニタリングにおける
重要なメトリクス
入力と出力の
トークン数
コスト予測に使用


## p.22

レイテンシ、トークン数、スロットル、
エラー数などの主要メトリクス
時刻、ツール使用、ナレッジ検索など
でフィルタ可能
CloudWatch のアラーム/ メトリクス
機能と完全統合
Model invocations ダッシュボード


## p.23

生成AI のログ
Amazon Bedrock
Amazon S3
Amazon CloudWatch
Invocation 
Logs
Logs
Bedrock AgentCore
Agent logs


## p.24

トレース内の顧客機密情報を
検出してマスク
IAM によるきめ細かな
アクセス制御で
機微データの参照範囲を限定
機微データの検出箇所を記録した
監査レポートを自動生成
機密データの保護


## p.25

トレースの構造
•
セッション: 複数のやり取りをまとめた一連の会話
• トレース: 1度のユーザーの指示- 応答のかたまり
•
スパン: トレース内の一つの作業の単位
•
サブスパン:トレース内のさらに詳細な作業単位


## p.26

End-to-end のトレース
即座に可視化
スパンの処理時間
エラー発生箇所の切り分け
カスタム属性


## p.27

AI Agent のための
フルマネージドで継続的な品質評価
•
リアルタイムの品質モニタリングと自動リスク評価に
より、信頼性の高いエージェントをより速くデプロイ
•
正確性・有用性・ステレオタイプなど、特定の品質基
準でエージェントの挙動を分析
•
14 種類の組み込みEvaluator により、数か月分の工数
とインフラ管理を不要に
•
カスタムEvaluator により、お好みのプロンプトとモ
デルを使った独自の品質評価を作成
•
結果はAmazon CloudWatch 経由でAgentCore
Observability に統合され、一元的にモニタリング可能
※ 2026 年6 月10 日時点


## p.28

情報への忠実さ
Amazon Bedrock 
AgentCore
Evaluations
主な
評価観点
与えられた情報と
コンテキストから
逸脱せずに
応答しているか
指示への忠実さ
明示的な指示にすべて
従っているか
有用性
明示的・暗黙的な
期待に応えているか
回答の的確さ
元の質問に
直接的かつ的確に
応答しているか


## p.29

© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
生成AI オブザーバビリティ
Demo


## p.45

まとめ
OpenTelemetry で計装し、
CloudWatch 生成AI オブザーバビリティで挙動を可視化する
Bedrock AgentCore Evaluations を設定し、
AI Agent の品質を継続評価する


## p.46

Ask the Speaker
こちらのRoom 後方の外側にございます、
「Ask the Speaker」カウンターまでお越しください
大石美緒
アマゾンウェブサービスジャパン合同会社
Room


## p.47

本セッションのアンケートへ
ご協力をお願いします
Please give us your feedback
Thank you!
CNS317
