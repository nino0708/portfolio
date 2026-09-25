---
title: "制約を超えて進化する B2B SaaS の AI 基盤"
category: "事例セッション"
session_id: "ARC317"
pages: 36
topics: ["生成AI/エージェント"]
services: ["AWS CDK", "AWS Lambda", "Amazon Aurora", "Amazon Bedrock", "Amazon CloudWatch", "Amazon EKS", "Amazon ElastiCache", "Amazon S3", "Amazon SQS", "Claude", "MCP"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/事例セッション/制約を超えて進化する B2B SaaS の AI 基盤.pdf"
---
# 制約を超えて進化する B2B SaaS の AI 基盤


## p.1

ARC317
制約を超えて進化するB2B SaaS のAI 基盤
立山尚樹
サイボウズ株式会社
開発本部kintoneプラットフォーム生成AIチーム
Engineering Manager


## p.2

制約を超えて進化する
B2B SaaS のAI 基盤
AWS Summit Japan 2026
サイボウズ株式会社
開発本部kintone プラットフォーム生成AI チーム
2


## p.3

変化の激しいAI 領域で
B2B SaaS はどう適応し続けるか
3


## p.4

現場の人がノーコードで、
業務アプリを作れるプラットフォーム
プログラミング知識がなくても、
ブラウザ上で業務アプリを組み立てられる
約40,000 社に導入
kintone とは
4


## p.5

kintone のAI でできること
5
kintone 上のデータを使って、RAG がノーコードで作れる
業務で蓄積されたFAQ アプリなどを使ったチャットボットが作れる
• ノーコードで設定
検索対象のアプリ・フィールドを選ぶだけ
• 自然文でのアプリの情報を検索
複数アプリを横断して回答を生成
• アクセス権を考慮可能
権限のないデータは検索結果に含まれない


## p.6

AI 機能のラインナップ
6
kintone の業務をAI で広く支える機能を提供中
他、複数提供中
検索AI
蓄積データを自然文で横断検索
アプリ作成AI
チャットからアプリを生成
レコード一覧分析AI
蓄積データをその場で分析


## p.7

AI 機能を、プロダクトとして運用し続ける難しさ
7
難しいのは「作ること」ではなく、変わり続ける“正解”に追従し続けること
1 安定運用・可観測性
障害検知、稼働率、
性能監視
2 品質の改善
プロンプト改善、
出力品質の継続的な改善
3 LLM のスケーリング
スループット、コスト、
トークン管理
→今良いと思って取り組んだことが将来不要になるかもしれない不確実性
PoC からProduction へ
?


## p.8

8
制約条件・複雑性
SaaS としての難しさ
既存SaaS の価値を守りながら、AI 基盤を進化させ続ける必要がある
•
顧客のデータ・業務
•
エコシステム
•
安定稼働
SaaS として守るべき価値
•
技術の進歩への追従
•
ビジネスニーズへの対応
AI 基盤としての進化


## p.9

変化の激しいAI 領域でB2B SaaS はどう適応し続けるか
9
AI 領域の日々変わる個別のプラクティスを単に追い求めるのではなく
既存SaaS による制約を乗り超えながら、
AI 領域の潮流に追従できる開発体制を、どう手に入れるか
Part 1
AI インフラの設計
AWS Lambda + Amazon Bedrock で始めた初期実装を、
Amazon EKS Auto Mode へと作り変えた設計判断
Part 2
AI Observability
計装と可視化の設計とデータポリシーの両立という
B2B SaaS 固有の課題


## p.10

©️Cybozu, Inc.
Part 1
AI インフラの設計
AWS Lambda + Amazon Bedrock の初期実装から、Amazon EKS Auto Mode へ
10


## p.11

kintone のAI 機能が開発初期に置かれていた状況
11
1
4 万社の業務を支える
kintone 本体に影響を与えない
•
自社DC の障害につながるような
負荷をかけない構成
•
Server-Sent Event のような
ロングコネクションを持たない設計
2
少人数でAI 領域全体を
カバーする必要がある
•
発足時は4 人でスタート
•
フロントエンドからインフラまで
幅広く担当


## p.12

価値を検証するフェーズでは、AWS Lambda でRAG を構築
•
スピード感重視── ミニマムに価値を届ける
•
インフラ運用負荷を最小限に抑えながらAI 機能を提供できる構成
•
kintone 本体への影響リスクを下げるため、ポーリングで生成結果を取得する設計
kintone での初期実装(2024 年当時)
12
Amazon ElastiCache
Amazon Bedrock
AWS Lambda
AWS Lambda
④結果を取得
③結果を逐次保存
②推論
①Job
AWS Cloud
自社DC
チャット質問
& ポーリング
Amazon 
CloudFront


## p.13

①技術進化への追従
kintone での初期実装の限界
13
AI 領域の潮流が速い
• MCP / AI Agent フレームワーク/ A2A / AG-UI など、新しい技術標準が続々と出る
• コールドスタート対策など、AWS Lambda 固有のワークアラウンドが足枷に
②ビジネスニーズへの対応
アプリケーション以外のAI 用周辺コンポーネントが必要に
• テナント／機能／ライセンスごとのクオータ（使用量上限）管理
• 今後も要求が増える想定（課金対応、監査・利用ログ出力など）
→構成管理の複雑化


## p.14

AI 機能を運用する基盤に求められること
14
→ これらを同時に満たす実行基盤として、Amazon EKS Auto Mode を採用
•
既存サービスを守りつつ、技術的制約を
超えられる実装の柔軟性
•
限られた人員で、運用負荷を抱え込まずに
済む
SaaS として守るべき価値
•
新しい標準やOSS を、インフラ固有の
工夫に頼らず取り込める
•
構成管理の容易性を保ちながら、
ビジネスニーズへ素早く応える
AI 基盤としての進化


## p.15

EKS の運用負担をAWS 側に寄せた、マネージドモードのEKS
主な特徴
Amazon EKS Auto Mode とは
15
ノード管理をAWS に委譲
プロビジョニング・スケール・
OS パッチをマネージド化
（内部でKarpenter / 
Bottlerocket を採用）
コアAdd-on が組み込み済み
標準的に必要になる、基盤的な
Add-on 群のバージョン管理を
委譲
VPC CNI plugin / kube-proxy 
/ EBS CSI driver / AWS Load 
Balancer Controller など
Kubernetes API はそのまま
Pod・Deployment・CRD な
ど、標準のK8s リソースで
AI ワークロードを表現


## p.16

運用負荷を圧縮し、AI 基盤の本質的な業務に集中できる
Amazon EKS Auto Mode が適した理由
16
Kubernetes の学習コストは必要
マニフェスト・ネットワークなど、チームでの理解とキャッチアップが前提
少人数運用との両立
Amazon EKS Auto Mode（ノード/ アドオン）+ EKS Capabilities Argo CD 
Amazon Managed Grafana / Amazon Managed Service for Prometheus
技術進化への追従
Kubernetes は常駐・ステートフルな処理を素直に表現できる
ビジネスニーズへの対応
コンポーネントをPod として並列に立てやすく、追加コストが小さい


## p.17

柔軟性と規律を両立する宣言的な構成管理
IaC による構成とガバナンスの実現
17
IaC: Infrastructure as Code
+α AI コーディングとの相性
AWS CDK / cdk8s は型定義によって、AI による補完・自動化が効きやすい
構成イメージ
AWS Cloud
dev
AWS Cloud
staging
AWS Cloud
prod
EKS Capabilities Argo CD
Amazon EKS Auto Mode
CDK
cdk8s
•
AWS リソース：AWS CDK
•
Kubernetes マニフェスト：cdk8s
TypeScript でマニフェストを記述・生成できる
•
環境をdev / staging / prod の
AWS アカウントレベルで分離


## p.18

Amazon EKS Auto Mode で実現した開発体制
18
K8s の柔軟性を活かしつつ、少人数でAI 領域の変化に追従できる開発体制
SaaS としての制約と、AI 領域からの要求の両方にこたえる構成
•
既存サービスを守りつつ、技術的制約を
超えられる実装の柔軟性
→Kubernetes の標準リソースで表現
•
限られた人員で、運用負荷を抱え込まずに
済む
→マネージドなNode ・Add-on
・関連サービスに任せる
SaaS として守るべき価値
•
新しい標準やOSS を、インフラ固有の
工夫に頼らず取り込める
→Kubernetes の標準リソースで表現
•
構成管理の容易性を保ちながら、
ビジネスニーズへ素早く応える
→IaC による構成と環境の分離で実現
AI 基盤としての進化


## p.19

©️Cybozu, Inc.
Part 2
AI Observability
計装と可視化の設計、データポリシーとの両立というB2B SaaS 固有の課題
19


## p.20

AI Observability の重要性
20
1 可観測性をいかに実現するか
2 AI 機能の改善にどうつなげるか
通常のWeb サービス監視とは異なる、AI 特有の不確実性
• 出力の揺らぎ── 同じ入力でも出力が変わる
• 根本原因の切り分けの難しさ── プロンプト/ モデル/ インフラ、どれが原因か見えづらい
• テナント別トークン消費の把握── 誰がどれだけ使ったか、細かく見ないと分からない


## p.21

可観測性をいかに実現するか
21
OpenTelemetry + Application Signals で、
システムの可観測性を実現
実現できること
• 障害調査
分散トレースを辿って、サービス間の異常を切り分け
• SLO 監視
レイテンシー・エラー率・可用性をSLO として
計測し、サービス健全性を追跡
AWS Cloud
AI application
AWS Distro 
for OpenTelemetry
Amazon EKS Auto Mode
Amazon CloudWatch
Amazon Managed Service
for Prometheus
metrics
traces


## p.22

LLM の振る舞いを観るには、汎用ツールだけでは不足
LLM 特化のObservability ツールの必要性
22
•
サービス間のレイテンシ・失敗率、
SLO 監視
Application Signals が得意なこと
•
AI Agent の動きをSession ごと、
ステップごとに追いたい
•
トークン消費・コストをAI 機能の
ドメインに特化した形で分析したい
AI 機能運用で追加で必要なもの


## p.23

Langfuse の導入
23
LLM 特化トレースを、
セルフホスト構成で運用
Langfuse で得られる可視化
• 障害調査
ステップ単位でトレースを
階層表示し、原因を切り分け
• コスト可視化
モデル別・機能別・テナント別の
トークン消費量を集計
• レイテンシー可視化
呼び出しごとの応答時間分布から
遅延要因を分析
ClickHouse
(self-host)
Amazon S3
Amazon Aurora
langfuse-web
Amazon ElastiCache
Langfuse
langfuse-worker
Amazon EKS Auto Mode
AWS Cloud
AI application
zookeeper
AWS Distro 
for OpenTelemetry


## p.24

AI Observability の基本: 入力・出力を見て仮説を立てながら改善
AI 機能の改善にどうつなげるか
24
期待外れの応答
・ハルシネーション
入力・出力を見て
仮説を立てる
調整
本番適用
•
プロンプト
•
コンテキスト
•
生成結果
見るもの
•
プロンプト改善
•
情報のランキングの調整
•
モデル選択
調整方法
など


## p.25

Langfuse を用いた生成結果の評価
• OTel Collector を経由し、入出力データを取得・記録
• Langfuse 上で、入出力データを見て改善
AI 機能の改善にどうつなげるか
25
Amazon EKS Auto Mode
AWS Cloud
AI application
AWS Distro 
for OpenTelemetry
Langfuse
データポリシーにより、
顧客の入出力データは閲覧できない


## p.26

データポリシー(B2B SaaS)
入力データ（厳格保護・監査対象）
•
お客様が業務利用のためにアップロードしたデータ
•
開発者でも見られない。ISMAP / SOC 監査対象
利用状況データ（運用に必要な範囲で扱える）
•
お客様および利用ユーザーが本サービスを
いつどのように利用しているかに関するデータ
•
サービスの提供、維持、保護、改善に活用
顧客入力データは見られない
26
例：検索AI（RAG）の場合
ユーザーの質問文
入力データ
検索結果（レコード情報）
入力データ
LLM 生成結果
入力データ
同時に記録される情報
input tokens / output tokens
latency / model
利用状況
データ
※ https://cybozu.co.jp/privacy/cloud-data-policy/
→ AI Observability で本来見たいデータが、見てはいけない側にある


## p.27

B2B SaaS のAI Observability に求められること
27
顧客のデータを閲覧せずに、AI 特有の不確実を捉え、改善サイクルを回す
•
顧客データポリシーの遵守
•
監査要件を満たすこと
SaaS として守るべき価値
•
AI 特有の不確実性を可観測にする
•
プロンプト改善など、生成性能の改善が
行える
AI 基盤としての進化


## p.28

入出力データを見えなくする
入出力データを見られなくする方法:
データポリシーの遵守
28
Amazon EKS Auto Mode
AWS Cloud
AI application
AWS Distro 
for OpenTelemetry
Amazon
CloudWatch
Langfuse
1 アプリケーション層
アプリケーション外に
データを出さない
2 OpenTelemetry 層
各サービスにトレースを
送信する前に浄化


## p.29

入力データの浄化をOTel パイプライン層で実施
• OTel Collector のProcessor 層で浄化
◦
アプリ側で個別実装する必要がない
• 顧客データを含むattribute をマスク
◦
GenAI 向けsemantics を中心にマスク
• 通常attribute は素通り
◦
DB / HTTP クライアントが出す
通常attribute は届くため可観測性は損なわない
顧客データを見られなくする工夫
29
Amazon EKS Auto Mode
AWS Cloud
AI application
AWS Distro 
for OpenTelemetry
Langfuse
Processor 層でマスク
Amazon
CloudWatch


## p.30

入力データの浄化をOTel パイプライン層で実施
顧客データを見られなくする工夫
30
processors:
attributes/genai-strip-sensitive:
actions:
- key: gen_ai.prompt
action: delete
- key: gen_ai.completion
action: delete
- key: gen_ai.input.messages
action: delete
- key: gen_ai.output.messages
action: delete
. . .
マスク用Processor の設定例
Amazon EKS Auto Mode
AWS Cloud
AI application
AWS Distro 
for OpenTelemetry
Langfuse
Processor 層でマスク
Amazon
CloudWatch


## p.31

顧客データを見られない環境の実現と課題
31
期待外れの応答
・ハルシネーション
入力・出力を見て
仮説を立てる
調整
本番適用
•
プロンプト
•
コンテキスト
•
生成結果
見るもの
•
プロンプト改善
•
情報のランキングの調整
•
モデル選択
調整方法
など
OTel Collector によって
顧客データを見られない環境を実現
→開発者は安心してログ調査を行える
入力・出力を見ないだけでは、AI 機能の改善をかけることに限界がある


## p.32

オンラインLLM-as-a-judge の仕組みを導入
開発者は一切中身を見ずに生成性能を評価
•
Processor / Exporter 層でスパン抽出、
AWS Lambda に送信
•
生成の過程で生じた入出力を、
LLM-as-a-judge で評価
•
スコアのみをLangfuse に格納
（Trace ID で紐付く）
顧客データを見ずに品質をモニタリング
32
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


## p.33

オンラインLLM-as-a-judge の仕組みを導入
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


## p.34

顧客データを見ずに改善をかけるサイクルを実現
34
期待外れの応答
・ハルシネーション
LLM-as-a-judge
評価から仮説を立てる
調整
本番適用
•
プロンプト
•
コンテキスト
•
生成結果
•
LLM-as-a-judge の評価
見るもの
•
プロンプト改善
•
情報のランキングの調整
•
モデル選択
調整方法
など
スコアリング項目に基づき仮説検証が行える
→顧客データを直接見ることなく改善サイクルを回せる


## p.35

まとめ
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


## p.36

本セッションのアンケートへ
ご協力をお願いします
Please give us your feedback
Thank you!
ARC317
