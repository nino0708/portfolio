---
title: "AI Agent が変える業界特化サービスの 業務と顧客体験"
category: "事例セッション"
session_id: "AIM322"
pages: 50
topics: ["生成AI/エージェント"]
services: ["AWS Lambda", "AgentCore", "Amazon API Gateway", "Amazon Aurora", "Amazon Bedrock", "Amazon CloudFront", "Amazon DynamoDB", "Amazon S3", "Amazon SQS"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/事例セッション/AI Agent が変える業界特化サービスの 業務と顧客体験.pdf"
---
# AI Agent が変える業界特化サービスの 業務と顧客体験


## p.1

AIM322
AI Agent が変える業界特化サービスの
業務と顧客体験
墨幹
株式会社ウェザーニューズ
航海気象事業部AIエージェント開発リーダー


## p.2

AWS Summit Japan 2026  ／AI Agents Transforming Ops & CX in Domain-Specific Services
AWS Summit Japan 2026 – Customer Session [AIM322]
墨幹/  Motoki Sumi
株式会社ウェザーニューズ
航海気象事業部
AI Agent 開発リーダー
AI Agent が変える
業界特化サービスの業務と顧客体験
AI Agent Transforming Ops & CX in domain-specific services


## p.3

AWS Summit Japan 2026  ／AI Agents Transforming Ops & CX in Domain-Specific Services
自己紹介
墨
幹（すみ
もとき）
• 株式会社ウェザーニューズ
(2021 年入社– 6 年目)
• 航海気象事業部AI Agent 開発チーム
• 担当業務
• 社内業務の自動化
• 顧客向けサービスへAI Agent の導入を推進


## p.4

AWS Summit Japan 2026  ／AI Agents Transforming Ops & CX in Domain-Specific Services
本日お話しすること
• 高度な専門性が必要とされる業務をAI Agent でどのように効率化したのか
• 航海気象サービスSaaS にAI Agent を導入、どのように開発したのか
• 社内のスペシャリストとどのように協力しサービスの改善を進めているのか


## p.5

船乗りの命を守りたい。
1970 年1 月、福島県いわき市。小名浜港を襲った爆弾低気圧により、
貨物船が沈没。15 名の尊い命が奪われました。
「本当に役立つ気象情報があれば、
この事故は防げたかもしれない」
創業者の石橋は、この事故をきっかけに気象の世界に進み、
1986 年にウェザーニューズを設立しました
。


## p.6

AWS Summit Japan 2026  ／AI Agents Transforming Ops & CX in Domain-Specific Services
ウェザーニューズの事業領域
個人向け・特定業界向けを含む気象情報・業務支援サービスを提供
Environment
Climate
Mobile Internet
Broadcast
Sports
Sea
Sky
Land


## p.7

AWS Summit Japan 2026  ／AI Agents Transforming Ops & CX in Domain-Specific Services
ウェザーニューズの事業領域
個人向け・特定業界向けを含む気象情報・業務支援サービスを提供
Environment
Climate
Mobile Internet
Broadcast
Sports
航海気象部門
Sky
Land


## p.8

AWS Summit Japan 2026  ／AI Agents Transforming Ops & CX in Domain-Specific Services
SeaNavigator
海運事業者向けの気象情報をワンストップで提供する統合型の航海気象サービス
荒天影響のモニタリング
SeaNavigator
最適な航路や船速の提案
CO2 排出量や燃料実績
座礁リスク把握


## p.9

AWS Summit Japan 2026  ／AI Agents Transforming Ops & CX in Domain-Specific Services
航海気象部門の業務例
海運事業者の
陸上スタッフ
船長
ウェザーニューズ
オペレーター
システムだけで対応できない情報は
メールや電話で個別にやり取り
SeaNavigator とオペレーターによる詳細な情報提供の組み合わせで対応
SeaNavigator
最新情報を
確認


## p.10

AWS Summit Japan 2026  ／AI Agents Transforming Ops & CX in Domain-Specific Services
調査した結果、地点C の方向が…
航海気象部門の業務例– オペレーター
発生した荒天の影響を受ける
自社の船舶は？
荒天が迫っている！
航路をどう変更すべきか？
調査した結果、船A と船B が…
この事業者の船舶の一覧と航路、
予想される荒天の影響期間を組み合わせて…
オペレーターは予報データや船舶データを分析し、回答
海運事業者の
陸上スタッフ
ウェザーニューズ
オペレーター
ウェザーニューズ
オペレーター
船長
この船の現在の位置と熱帯低気圧の進路予測
を組み合わせて…


## p.11

AWS Summit Japan 2026  ／AI Agents Transforming Ops & CX in Domain-Specific Services
航海気象部門の業務課題
海運事業者の
陸上スタッフ
船長
ウェザーニューズ
オペレーター
荒天や災害など緊急時の問い合わせ急増・顧客拡大への対応が必要
SeaNavigator
最新情報を
確認
荒天
問い合わせ数増加
荒天
至急確認が必要
分析数の増加
回答の遅延


## p.12

AWS Summit Japan 2026  ／AI Agents Transforming Ops & CX in Domain-Specific Services
航海気象部門の業務課題
海運事業者の
陸上スタッフ
船長
ウェザーニューズ
オペレーター
荒天や災害など緊急時の問い合わせ急増・顧客拡大への対応が必要
SeaNavigator
最新情報を
確認
荒天
問い合わせ数増加
荒天
至急確認が必要
分析数の増加
回答の遅延
SeaNavigator で
より柔軟に情報を提供し
問い合わせを減らせないか？
オペレーターの分析時間を
短縮できないか？


## p.13

AWS Summit Japan 2026  ／AI Agents Transforming Ops & CX in Domain-Specific Services
AI Agent とText2SQL による分析・回答自動化
海運事業者の
陸上スタッフ
船長
ウェザーニューズ
オペレーター
システムだけで対応できない情報は
メールや電話で個別にやり取り
動的な分析を行うエージェントを顧客・オペレーター双方に提供
SeaNavigator
最新情報を
確認
AI Agent
Text2SQL
オペレーターの
分析業務を
効率化
従来より多くの
問い合わせを
システムで完結


## p.14

AWS Summit Japan 2026  ／AI Agents Transforming Ops & CX in Domain-Specific Services
SeaNavigator AI Agent


## p.15

AWS Summit Japan 2026  ／AI Agents Transforming Ops & CX in Domain-Specific Services
SeaNavigator AI Agent の詳細


## p.16

AWS Summit Japan 2026  ／AI Agents Transforming Ops & CX in Domain-Specific Services
システム構成
Amazon CloudFront
Amazon API Gateway
AWS Lambda
(SeaNavigator AI Agent)
Amazon Bedrock 
AgentCore Memory
Amazon Bedrock
Amazon Aurora
PostgreSQL
Amazon DynamoDB
Amazon SQS
AWS Lambda
AWS Lambda
AWS Lambda
Amazon Simple Storage 
Service (S3)
AWS Lambda
外部API
検索基盤・データソース
AI Agent
Langfuse
AI Agent


## p.17

AWS Summit Japan 2026  ／AI Agents Transforming Ops & CX in Domain-Specific Services
システム構成
Amazon CloudFront
Amazon API Gateway
AWS Lambda
(SeaNavigator AI Agent)
Amazon Bedrock 
AgentCore Memory
Amazon Bedrock
Amazon Aurora
PostgreSQL
Amazon DynamoDB
Amazon SQS
AWS Lambda
AWS Lambda
AWS Lambda
Amazon Simple Storage 
Service (S3)
AWS Lambda
外部API
検索基盤・データソース
AI Agent
Langfuse
AI Agent のトレース情報を保存
評価・分析し、改善に活用
ユーザーと会話
問い合わせ内容を理解
SQL を生成
会話内容を保存
ユーザーの特徴など
重要情報は長期記憶に保存


## p.18

AWS Summit Japan 2026  ／AI Agents Transforming Ops & CX in Domain-Specific Services
システム構成
Amazon CloudFront
Amazon API Gateway
AWS Lambda
(SeaNavigator AI Agent)
Amazon Bedrock 
AgentCore Memory
Amazon Bedrock
Amazon Aurora
PostgreSQL
Amazon DynamoDB
Amazon SQS
AWS Lambda
AWS Lambda
AWS Lambda
Amazon Simple Storage 
Service (S3)
AWS Lambda
外部API
検索基盤・データソース
AI Agent
Langfuse
AI Agent がツールを通してSQL を実行


## p.19

AWS Summit Japan 2026  ／AI Agents Transforming Ops & CX in Domain-Specific Services
システム構成
Amazon CloudFront
Amazon API Gateway
AWS Lambda
(SeaNavigator AI Agent)
Amazon Bedrock 
AgentCore Memory
Amazon Bedrock
Amazon Aurora
PostgreSQL
Amazon DynamoDB
Amazon SQS
AWS Lambda
AWS Lambda
AWS Lambda
Amazon Simple Storage 
Service (S3)
AWS Lambda
外部API
検索基盤・データソース
AI Agent
Langfuse
DynamoDB・S3・外部API・Event など
オペレーターが参照している情報を
Aurora PostgreSQL に統合


## p.20

AWS Summit Japan 2026  ／AI Agents Transforming Ops & CX in Domain-Specific Services
SeaNavigator AI Agent の工夫点
Amazon CloudFront
Amazon API Gateway
AWS Lambda
(SeaNavigator AI Agent)
Amazon Bedrock 
AgentCore Memory
Amazon Bedrock
Amazon Aurora
PostgreSQL
Amazon DynamoDB
Amazon SQS
AWS Lambda
AWS Lambda
AWS Lambda
Amazon Simple Storage 
Service (S3)
AWS Lambda
外部API
検索基盤・データソース
AI Agent
Langfuse
①AI Agent がText2SQL しやすい
データモデリング
②オペレーターのような
ユーザー特性を理解した回答
③オペレーター自身が
AI Agent を改善できる仕組み


## p.21

AWS Summit Japan 2026  ／AI Agents Transforming Ops & CX in Domain-Specific Services
①AI Agent がText2SQLしやすい
データモデリング


## p.22

AWS Summit Japan 2026  ／AI Agents Transforming Ops & CX in Domain-Specific Services
SeaNavigator AI Agent の工夫点
Amazon CloudFront
Amazon API Gateway
AWS Lambda
(SeaNavigator AI Agent)
Amazon Bedrock 
AgentCore Memory
Amazon Bedrock
Amazon Aurora
PostgreSQL
Amazon DynamoDB
Amazon SQS
AWS Lambda
AWS Lambda
AWS Lambda
Amazon Simple Storage 
Service (S3)
AWS Lambda
外部API
検索基盤・データソース
AI Agent
Langfuse
①AI Agent がText2SQL しやすい
データモデリング


## p.23

AWS Summit Japan 2026  ／AI Agents Transforming Ops & CX in Domain-Specific Services
オペレーターのデータ分析要件
オペレーター用
サービスA
オペレーター用
サービスB
オペレーター用
サービスC
ウェザーニューズ
オペレーター
船長
Amazon DynamoDB
Amazon S3
外部API
船長からの問い合わせを理解、複数サービスから情報を集め、分析・回答
→ 適切なデータソースを選択しクエリ生成・データ抽出・JOIN ・分析・回答
荒天の影響を
受けそう？
調査します！


## p.24

AWS Summit Japan 2026  ／AI Agents Transforming Ops & CX in Domain-Specific Services
AI Agent のデータ分析(Text2SQL) 要件
問い合わせに対して適切なデータソースを選択・クエリ生成・JOIN ・分析・回答
→ AI Agent のText2SQL に適したデータモデルは？
オペレーター用
サービスA
オペレーター用
サービスB
オペレーター用
サービスC
船長
Amazon DynamoDB
Amazon S3
外部API
AI Agent
荒天の影響を
受けそう？
調査します！


## p.25

AWS Summit Japan 2026  ／AI Agents Transforming Ops & CX in Domain-Specific Services
Text2SQL が失敗する要因
https://arxiv.org/pdf/2304.11015
Schema Linking
37%
JOIN
21%
GROUP-BY
13%
Nested
13%
Other
13%
Invalid
3%
問い合わせに対する適切な
DB/Table/Column の選択誤り
結合パスやJOIN 条件の誤り


## p.26

AWS Summit Japan 2026  ／AI Agents Transforming Ops & CX in Domain-Specific Services
Text2SQL が失敗する要因
https://arxiv.org/pdf/2304.11015
Schema Linking
37%
JOIN
21%
GROUP-BY
13%
Nested
13%
Other
13%
Invalid
3%
問い合わせに対する適切な
DB/Table/Column の選択誤り
単一DB にデータを集約し
AI Agent が探索する対象を絞る
結合パスやJOIN 条件の誤り
JOIN の単純化のために
スタースキーマを採用


## p.27

AWS Summit Japan 2026  ／AI Agents Transforming Ops & CX in Domain-Specific Services
Text2SQL の失敗を予防するデータモデリング
Amazon DynamoDB
Amazon SQS
Amazon S3
外部API
分散するデータソースを1 つのデータベースに統合


## p.28

AWS Summit Japan 2026  ／AI Agents Transforming Ops & CX in Domain-Specific Services
Text2SQL の失敗を予防するデータモデリング
Amazon DynamoDB
Amazon SQS
Amazon S3
外部API
データベースは何を使うべきか？


## p.29

AWS Summit Japan 2026  ／AI Agents Transforming Ops & CX in Domain-Specific Services
データベースの要件
•
レスポンスタイム
•
分析クエリだが対話しながら分析したい
• ユーザー体験を考慮し1 回の分析で最大10 秒以内
• 想定負荷
• ピーク時リクエスト数30 リクエスト/秒
• 顧客ごとに取得できる情報の限定
• 行レベルセキュリティ(RLS) を備えていること


## p.30

AWS Summit Japan 2026  ／AI Agents Transforming Ops & CX in Domain-Specific Services
データベースの要件
•
レスポンスタイム
•
分析クエリだが対話しながら分析したい
• ユーザー体験を考慮し1回の分析で最大10 秒以内
• 想定負荷
• ピーク時リクエスト数30 リクエスト/秒
• 顧客ごとに取得できる情報の限定
• 行レベルセキュリティ(RLS) を備えていること
低レイテンシ・高同時実行性と
標準でRLSを備えるAurora PostgreSQL を採用


## p.31

AWS Summit Japan 2026  ／AI Agents Transforming Ops & CX in Domain-Specific Services
Text2SQL の失敗を予防するデータモデリング
Amazon DynamoDB
Amazon SQS
Amazon S3
外部API
Aurora PostgreSQL の採用を決定
Amazon Aurora
PostgreSQL


## p.32

AWS Summit Japan 2026  ／AI Agents Transforming Ops & CX in Domain-Specific Services
②オペレーターのような
ユーザー特性を理解した回答


## p.33

AWS Summit Japan 2026  ／AI Agents Transforming Ops & CX in Domain-Specific Services
SeaNavigator AI Agent の工夫点
Amazon CloudFront
Amazon API Gateway
AWS Lambda
(SeaNavigator AI Agent)
Amazon Bedrock 
AgentCore Memory
Amazon Bedrock
Amazon Aurora
PostgreSQL
Amazon DynamoDB
Amazon SQS
AWS Lambda
AWS Lambda
AWS Lambda
Amazon Simple Storage 
Service (S3)
AWS Lambda
外部API
検索基盤・データソース
AI Agent
Langfuse
②ユーザー特性を理解した回答


## p.34

AWS Summit Japan 2026  ／AI Agents Transforming Ops & CX in Domain-Specific Services
AI Agent で提供したいユーザー体験
陸上管理者は複数の船を担当
ユーザーの特性
継続した問い合わせ
異なる種類の船を担当
タンカーは環境規制、コンテ
ナ船は定時性を重視した回答
好まれる回答
担当している船全体の情報を
まとめた回答
過去の文脈や問い合わせ内容
を考慮した回答


## p.35

AWS Summit Japan 2026  ／AI Agents Transforming Ops & CX in Domain-Specific Services
• 短期記憶
• ユーザーの入力、Agent の実行・会話履歴など生データを保存
• AI Agent が直近の会話の流れを踏まえて回答
• 長期記憶
• 短期記憶からユーザーの特性を抽出し保存
• AI Agent がユーザー特性を踏まえて回答
Amazon Bedrock AgentCore Memory


## p.36

AWS Summit Japan 2026  ／AI Agents Transforming Ops & CX in Domain-Specific Services
ユーザー特性を考慮した回答
AgentCore Memory の長期記憶によってユーザーの傾向を保存
Amazon Bedrock 
AgentCore
(Long-term Memory)
Semantic Memory Strategy
User Preference Memory Strategy
Summary Memory Strategy
「ユーザーはコンテナ船の
ステータスを監視している」
「日本語での情報提供を好む」
「先週は台風〇〇の
リスク監視を継続」
いつもの船の状況は？
コンテナ船のステータスで
すね。先週の台風〇〇は航
路から離れましたが、台風
△△が…


## p.37

AWS Summit Japan 2026  ／AI Agents Transforming Ops & CX in Domain-Specific Services
③オペレーター自身が
AI Agent を改善できる仕組み


## p.38

AWS Summit Japan 2026  ／AI Agents Transforming Ops & CX in Domain-Specific Services
SeaNavigator AI Agent の工夫点
Amazon CloudFront
Amazon API Gateway
AWS Lambda
(SeaNavigator AI Agent)
Amazon Bedrock 
AgentCore Memory
Amazon Bedrock
Amazon Aurora
PostgreSQL
Amazon DynamoDB
Amazon SQS
AWS Lambda
AWS Lambda
AWS Lambda
Amazon Simple Storage 
Service (S3)
AWS Lambda
外部API
検索基盤・データソース
AI Agent
Langfuse
③オペレーター自身が
AI Agent を改善できる仕組み


## p.39

AWS Summit Japan 2026  ／AI Agents Transforming Ops & CX in Domain-Specific Services
AI Agent の回答品質は、誰が改善できるのか？
回答の良し悪しを判断できるのは、気象・海運の専門知識を持つオペレーター
ウェザーニューズ
オペレーター
修正を依頼
課題発見
ウェザーニューズ
エンジニア
修正しデプロイ
SeaNavigator
AI Agent
オペレーターの要望に応えるには専門知識が必要
理解に時間がかかり修正が遅れる


## p.40

AWS Summit Japan 2026  ／AI Agents Transforming Ops & CX in Domain-Specific Services
AI Agent の回答品質は、誰が改善できるのか？
回答の良し悪しを判断できるのは、気象・海運の専門知識を持つオペレーター
ウェザーニューズ
オペレーター
修正を依頼
課題発見
ウェザーニューズ
エンジニア
修正しデプロイ
SeaNavigator
AI Agent
専門知識のあるオペレーターが直接プロンプトを改善することで
修正のリードタイムを短縮


## p.41

AWS Summit Japan 2026  ／AI Agents Transforming Ops & CX in Domain-Specific Services
課題に気づく仕組み: LangFuse に会話ログを集約・評価
AI Agent の会話一覧
会話内容の数値的な評価


## p.42

AWS Summit Japan 2026  ／AI Agents Transforming Ops & CX in Domain-Specific Services
AI Agent の回答品質を自動評価するパイプラインを実装
Task Completion
依頼されたタスクを完遂できたか
Tool Usage Appropriateness
文脈に対し適切なツールを選び使ったか
Instruction Adherence
指示・制約をどれだけ守ったか
Conversation Quality
会話の流れ・対話全体の品質
Coherence
応答の一貫性・論理的整合
Hallucination Detected
誤情報・根拠のない情報が出てないか
実際の会話ログ
３モデルの判定は一致したか？
各モデルが６指標を採点
一致度が高い
→評価を信頼
一致度が低い
→内容要確認
LLM Model 1
LLM Model 2
LLM Model 3


## p.43

AWS Summit Japan 2026  ／AI Agents Transforming Ops & CX in Domain-Specific Services
プロンプトをLangfuse で管理- オペレータも編集可能
プレイグラウンド環境でプロンプトを
編集しながら試す
Langfuse
AWS Lambda
(SeaNavigator AI Agent)
ウェザーニューズ
オペレーター
改善したプロンプトを
本番環境に反映
エンジニア
エンジニアが介入せずに
改善サイクルを回せる


## p.44

AWS Summit Japan 2026  ／AI Agents Transforming Ops & CX in Domain-Specific Services
本番導入に向けての道のり


## p.45

AWS Summit Japan 2026  ／AI Agents Transforming Ops & CX in Domain-Specific Services
本番導入までの道のり
STEP 1
社内検証(PoC)
STEP 2
限定パイロット運用
営業やオペレーター経由で興味を持つ顧客から限定公開
フィードバックや懸念点をヒアリング・解消
本番リリース
お客様と一緒にサービスを改善しながらAI Agent を運用
評価データセットを作成( 88 件)
- 実際のマルチターンの応答例
- プロンプトインジェクション対策
全評価セットで期待した回答品質になるまで改善


## p.46

AWS Summit Japan 2026  ／AI Agents Transforming Ops & CX in Domain-Specific Services
導入効果
• 問い合わせ数削減
• 2026 年6 月1 日台風6 号の接近時には
問い合わせの16 % をAI Agent が回答
• 分析時間短縮
• 今まで最大2 週間かかる分析業務を
最短15 分で完了させたケースを確認


## p.47

AWS Summit Japan 2026  ／AI Agents Transforming Ops & CX in Domain-Specific Services
まとめ
業界に特化したAgent は、
業務データ・UX・運用改善まで包括的な設計が必須
• データモデリング
• Text2SQL に適したDB 設計が精度向上に寄与
• ユーザー特性に合わせた回答生成
• Bedrock AgentCore Memory でオペレータらしさを再現
• ドメインエキスパートによるAI Agent の改善
• LangFuse によってプロンプトの変更が可能なシステムを提供


## p.48

AWS Summit Japan 2026  ／AI Agents Transforming Ops & CX in Domain-Specific Services
Thank you!


## p.49

Exhibition Booth Information
展示ブースのご案内
A118
株式会社ウェザーニューズ
AWS Village①


## p.50

本セッションのアンケートへ
ご協力をお願いします
Please give us your feedback
Thank you!
AIM322
