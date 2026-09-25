---
title: "Kiro と Amazon の文化から学ぶ AI 駆動開発の型"
category: "AWSセッション"
level: "L300"
session_id: "DVT324"
pages: 61
topics: ["AI駆動開発", "組織/内製化"]
services: ["AWS CDK", "AWS Lambda", "AWS Security Hub", "Amazon CloudFront", "Amazon Inspector", "Amazon RDS", "Claude", "Kiro", "MCP"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/AWSセッション/Kiro と Amazon の文化から学ぶ AI 駆動開発の型.pdf"
---
# Kiro と Amazon の文化から学ぶ AI 駆動開発の型


## p.1

DVT324
Kiro とAmazon の文化から学ぶ
AI 駆動開発の型
高野賢司
アマゾンウェブサービスジャパン合同会社


## p.2

東海から西の製造業のお客様を技術的にご支援
AI 駆動開発やInfrastructure as Code (IaC) など
開発者ツールのエキスパート
@konokenj
こうの
けんじ
高野賢司
シニアソリューションアーキテクト@名古屋
アマゾンウェブサービスジャパン合同会社


## p.3

セッション
テーマ
AI 駆動開発に必要なソフトウェアの叡智を
個人がどうやって獲得し、価値に転換するか
以下は話しません
• AI コーディングエージェントの機能詳細
• 誰でも同じ結果が得られるプロンプトや技法
• AI-Driven Development Lifecycle (AI-DLC)
ソフトウェアエンジニア、IT リーダー 向け / L300


## p.4

AI 駆動開発の現在地と課題


## p.5

AI コーディングエージェントは
十分な品質で開発タスクの一部を完遂できる
エンジニアはコードに注意を払いながらも
意図の伝達や設計に関心をシフトしつつある
コードを書く主体は
AI になった
3
4
AI エージェントによる
自律的なコード探索、編集、テスト
AI エージェントによる
長時間の自動運転、人間の意図の補完
実用化済み


## p.6

開発の
自律化
仕様駆動開発
テスト自動化
ブラウザ操作
DB / ログの確認


## p.7

ソフトウェアはいつから本番か？
ユーザーが
生まれたとき
機密データが
入力されたとき
他のソフトウェアに
依存されたとき


## p.8

Dr. Werner Vogels - CTO, Amazon
AWS re:Invent 2025
You build it, 
you own it.


## p.9

ソフトウェアを所有することで発生する責任
正しく動くこと
安全であること
変化に
応え続けられること


## p.10

自律化の進んだAI 駆動開発における課題
チームやプロセスの
ブロッカーを解除
するには？
AI が構築した
ソフトウェアを評価し
所有責任を負うには？
ソフトウェア開発の
能力を自分の価値に転換
するには？


## p.11

Design for Evaluation
AI にタスクを引き渡す前に「評価可能か？」を問い
評価のための設計を完了する「型」


## p.12

叡智のパッケージ
としての型
修練によって
内在化
A
A'
B
主体によって
異なる形で
叡智を活用する
大庭良介, 「型」の再考: 科学から総合学へ - 京都大学学術出版会, 2021 を参考に作成
熟練のエンジニアの思考や動きに含まれる叡智を内在化するための教範
「型」による叡智の伝達と活用


## p.13

叡智の性質に応じて保存・伝達方法を選ぶ
外在化された叡智
自分の外にある叡智を選んで適用する
対象を分析して選択・適用する。
誰が使っても同じ推論が期待される
例
•
デザインやアーキテクチャのパターン
•
プロンプトテンプレートやスキル
•
ライブラリ
•
共通基盤
対象
内在化された叡智（型）
自分の内にある叡智が自ずと現れる
主体を通して自ずと現れる。
使う人や状況によって異なる推論になる
例
•
Design for Evaluation
•
Everything as Code
•
DevOps
•
アジャイル
対象


## p.14

Design for Evaluation
AI にタスクを引き渡す前に
「評価可能か？」を問う
評価基準
観測対象
評価可能
評価手段
評価可能にするための 3 要素
評価可能性の設計という叡智を
個人に内在化させるための型


## p.15

守
型の修得プロセス
破
離
型の想定、動作、姿勢を崩さず、
型を徹底的に守ることで叡智の獲得を目指す
新たな型や、より自分に合った型を模索し
達人を目指す
既存の型に囚われることなく
離れて自在となる
大庭良介, 「型」の再考: 科学から総合学へ - 京都大学学術出版会, 2021 を参考に作成
AI にタスクを引き渡す前に「評価可能か？」と問う


## p.16

AI が構築した
ソフトウェアを評価し
所有責任を負うには？
守破離


## p.17

変更容易性と設計はこちらのセッションを！
CNS449
Day 2 / 14:00-14:40
淡路大輔
シニアソリューションアーキテクト, AWS
AI が開発／運用しやすいクラウド
サーバーレスの視点から考える
設計原則


## p.18

正しく動くこと


## p.19

AI 駆動開発における要求とのずれ
Dev
Biz
AI が十分な品質でコードを書けても…
• ソフトウェアの振る舞いが
ビジネスの要求とずれている
• ソフトウェアの構造や特性が
エンジニアの期待とずれている
と、価値を生まない


## p.20

AI 駆動開発における要求とのずれ
Dev
Biz
意図を評価可能にして
AI と人間の双方が
合意することが重要


## p.21

Bringing
PRECISION
natural
to
language
prompts


## p.22

PROMPT
AMBIG UOUS
[natural language]
OUTPUT
AMBIG UOUS
D E C I S I O N
D
D
D
D
D
D
D
D
D
D
D
D
D
D
D
D
D
D
D
D
D
D
D


## p.23

PROMPT
AMBIG UOUS
[natural language]
OUTPUT
AMBIG UOUS
D E C I S I O N
D
D
D
D
D
D
D
D
D
D
D
D
D
D
D
D
D
D
D
D
D
D
P RECI SE
S P EC
P R EC I SE
D
D
D
D
D


## p.24

仕様駆動開発で正しさを合意する
1
1
Kiro が人間の指示を仕様に変換
Requirements
要求定義 (EARS 記法)
Design
ソフトウェア設計
Tasks
実装タスク
2
2
仕様を介して人間と AI が合意形成
目的は仕様書を作ることではない
3
3
AI が仕様をもとに自律的に実装。
仕様は スーパープロンプト として機能


## p.25

仕様駆動開発
Requirements: 
振る舞いを
評価可能にする
AI が自律的に
振る舞いを評価できるか？
評価基準
Dev
要求定義の受入基準
評価手段
観測対象
ブラウザテストツール
開発環境のソフトウェア
AI
合意
例
ビジネスの言葉で
振る舞いを評価できるか？
評価基準
Dev
ドメインエキスパートの知見
評価手段
観測対象
文書やデモの読み合わせ
requirements.md
Biz
合意
例


## p.26

仕様駆動開発
Design:
構造と特性を
評価可能にする
AI が自律的に構造や
特性を評価できるか？
評価基準
Dev
構造の制約やテストの要件
評価手段
観測対象
Linter やツール、自動テスト
ソースコード
AI
合意
例
ソフトウェアの内部構造や
特性を評価できるか？
評価基準
Dev
シニアエンジニアの知見
評価手段
観測対象
文書や図のレビュー
design.md
合意
例


## p.27

評価者の視点で仕様を作る / 永続化する
Requirements
Design
毎回 / すべて作る必要はない
次のタスクを担当する人が
自由に決められないことを事前に合意する
ソフトウェアの外部的な
振る舞いが変わるとき
ソフトウェアの内部的な
構造や特性が変わるとき
仕様はいつ作るか？
合意の手段としての仕様
機能ベース・時点的な
合意のための仕様から
永続的化すべき情報を
選択的に反映する
README.md
docs/migration.md
design/<domain>/user-story.md
design/<domain>/adr/...
仕様はどのように永続化するか？
仕様書としての仕様
「いつ、誰が評価するか？」


## p.28

評価基準をエンジニアの中で育てる
評価基準
観測対象
評価可能
評価手段
エキスパートとの対話や
ソフトウェアの古典・名著から
エンジニア自身が学ぶ。
経験を圧縮する
アルゴリズムはない
Andy Jassy - CEO, Amazon


## p.29

Kiro IDE
Kiro CLI
「型にはまる」のではなく、型を内在化する
または、
あなたが好きな
ツールや技術で。
良いツールは叡智を含む。
それでも、ツール自体よりも
個人の叡智獲得が重要


## p.30

安全であること


## p.31

SECURE BY DESIGN, AT EVERY LAYER, AT EVERY STAGE
At AWS,
everything starts with
security


## p.32

ソフトウェアの安全性を評価可能にする
評価基準
観測対象
評価可能
評価手段
= フィードバック可能
コード
実行環境
…
インフラからアプリまで、
ソフトウェア全体が観測可能
であることが前提
依存
ライブラリ
CI/CD
パイプライン


## p.33

Everything as Code
... etc.
Infrastructure
as Code
Configuration
as Code
Policy
as Code
Security
as Code
Documentation
as Code
Operation
as Code
Observability
as Code
Database
as Code
• ソフトウェアのあらゆる構成部品を
コードで管理し、変更の追跡やテストを可能にする
• 環境間での差異をなくす
• 人間しか知らない設定やルールをなくす
ソフトウェアのすべての部分を
コードとして管理することは
AI 駆動開発とセキュリティの両方の基礎
https://docs.aws.amazon.com/wellarchitected/latest/devops-guidance/everything-as-code.html


## p.34

AWS Cloud Development Kit (CDK)
使い慣れたプログラミング言語で
クラウドリソースを定義できる
オープンソースのフレームワーク
"Meeting developers where they are"
TypeScript
JavaScript
Python
Java
.NET
Go
https://github.com/aws/aws-cdk
アプリ全体をコードで管理
フィードバックを高速化
型チェックと入力補完
デプロイ前のセキュリティ検査
テストの自動化
アプリと同じ言語で記述
アプリとインフラを
一貫性をもってデプロイ
開発と運用の共通言語になる
認知負荷を軽減
適切なデフォルト値での抽象化
チーム間で構成パターンを共有
最小権限の設定を簡素化


## p.35

『Git リポジトリを見ればすべてわかる』
Git リポジトリ
apps
agents
api
infra
web
design
AGENTS.md
README.md
AWS Lambda
AWS Lambda
Amazon CloudFront
AWS CDK
Policy
as Code
Documentation
as Code
Infrastructure
as Code
アプリからインフラ、運用まで
変更の経緯やポリシーも含め、
AI が全体を把握して変更できる状態
Security
as Code
ネットワークからアプリのビルドやデプロイ、
セキュリティ設定まで AWS CDK で管理


## p.36

Everything as Code で評価の面を広げる
CI/CD パイプライン
SAST / SCA
•
Amazon Inspector
ポリシー検査
•
CloudFormation Guard
•
CDK Nag
コードレビュー
•
Kiro ヘッドレス実行
•
AWS Security Agent
Git リポジトリ
•
コード化により、静的アプリケーションセキュリティテスト (SAST) や
ソフトウェア構成解析 (SCA)、ポリシー検査をインフラからアプリまで適用可能
•
Kiro ヘッドレス実行やAWS Security Agent によるコードレビュー範囲を拡張
本番環境
Dev / AI


## p.37

AI エージェントが安全に探索するための分離
Web ブラウザ
データベース
ログやイベント
評価基準と手段が与えられていれば
AI エージェントは自律的に実装を評価できる
環境
アクセス権
Playwright CLI と
専用のテストユーザーで操作
Amazon RDS Data API で
テスト環境をクエリ
CloudWatch MCP Server や
AWS CLI で読み取り
を分離する
と
IAM Policy Autopilot でアプリの関連リソースに
のみアクセス可能なIAM Policy を定義できる
https://github.com/awslabs/iam-policy-autopilot
Infrastructure as Code で


## p.38

セキュリティ評価は標準から始め、継続する
広く合意された標準や
セキュリティサービスの
評価結果を観察して
何が問題か学ぶことから始める。
一度だけでなく、継続的に評価する
Amazon Inspector
AWS Security Hub CSPM
AWS Security Agent
Code
AWS Resources
Application


## p.39

「評価可能か？」をすべてのレイヤーで問う
仕様駆動開発
app
infra
pipeline
振る舞いと内部構造を、
人間とAI の両方が評価できるか？
Everything as Code
ソフトウェアの全体を観測して
安全性を評価できるか？
正確性
安全性
問いをきっかけに、評価可能性を設計する


## p.40

チームやプロセスの
ブロッカーを解除
するには？
守破離


## p.41

評価可能性が『待ち』を解消する
Code
Evaluate
「AI が評価可能か？」という問いを通して
AI へのフィードバックループを閉じる
評価可能性が AI の自律性を強化
「UI のデザインをかっこよくして」
「コードに問題がないかレビューして」
言語化はされているが、評価基準と手法がない
Code
人間の評価待ちがボトルネックになる


## p.42

ソフトウェア構造の評価と制約
apps
agents
api
web
packages
shared-types
db
理解しにくいコードや、取り除きにくいバグは
不適切な依存関係として現れることが多い
モジュール間の依存グラフなどを評価して
構造を制約する
例
• モノレポで apps のインポートを禁止
• 循環参照の禁止
• リポジトリ層を迂回した DB クライアントの使用を禁止
評価手段の例 1/5


## p.43

テスト容易性の設計
Agent
StoragePort
LocalStorageAdapter
S3StorageAdapter
main
AI エージェント自身がテストを素早く実行
できるよう、あらかじめ構造を設計する
ストレージ操作をポートとアダプターパターンで
抽象化し、ローカルで素早く評価できるようにする
Building hexagonal architectures on AWS
https://docs.aws.amazon.com/prescriptive-guidance/latest/
hexagonal-architectures/welcome.html 
解きたい問題
例
評価手段の例 2/5


## p.44

Generator-Verifier パターン
Multi-agent coordination patterns: Five approaches and when to use them
https://claude.com/blog/multi-agent-coordination-patterns 
自然言語の出力や構造などを
AI エージェントを分離して評価する
適用例
コードやデザインのレビュー
AI エージェントの出力評価
課題
評価基準の構築と
評価基準の評価に専門性が必要
メリット
自然言語で意味の評価ができ、
適用範囲が広い
評価手段の例 3/5
Generator
Verifier


## p.45

セキュリティ評価の自動化:
AWS Security Agent
AWS Security Agent 徹底解説: 自動ペネトレーションテストのためのマルチエージェントアーキテクチャ
https://aws.amazon.com/jp/blogs/news/inside-aws-security-agent-a-multi-agent-architecture-for-automated-penetration-testing/
従来は数週間を要した侵入テストを
マルチエージェント構成で自動化
セキュリティ専門家が記述した自然言語のアサーションを
組み込んだ検証エージェントが検出結果を評価している
評価手段の例 4/5


## p.46

形式検証による制約条件の評価
ネットワークの到達可能性を、設定情報のみで
パケットを実際に送らずに数学的に評価可能
適用例
AI エージェントの出力が
制約条件を満たすか評価する
課題
制約条件の定式化に
形式検証とドメイン両方の専門性が必要
メリット
非決定論的な出力の検証を論理的に行える
AWS の実例: VPC Reachability Analyzer
Reachability analysis for AWS-based networks - Amazon Science 
https://www.amazon.science/publications/reachability-analysis-for-aws-based-networks
評価手段の例 5/5


## p.47

Design for Evaluation で『待ち』を解消する
Plan
Design
Code
Test
Release
Operate
要求や UX を
仕様駆動開発で評価
Biz
コードの正確性を
AI エージェントが実装中に評価
セキュリティや品質を
専門エージェントが評価
コードレビューを
AI エージェントが補助


## p.48

ソフトウェア開発の能力を
自分の価値に転換
するには？
守
破離


## p.49

AI がすぐに実装してくれても、
無駄な機能を作れば負債になる。
効率的な課題解決のエキスパート
としての熟練のエンジニアの叡智が
「作らない」判断を可能にする
AI にコードを
「書かせない」選択肢


## p.50

Customer
Press 
release
Visuals
FAQ
Working 
backwards: 
イノベーションの
ためのメカニズム
どのようにお客様と検証し、
何を成功指標としますか？
Working Backwards には
Design for Evaluation が
組み込まれている


## p.51

佐藤賢太
Solutions Architect, AWS Japan
自分にできることが
小さいと感じるなら、
社会をシステムとして捉え、
問いを立て続けよう


## p.52

システム思考と Working Backwards の往還
お客様と同じ言葉で話し、
抱えている課題と力学を
システム思考で分析し、領域を絞り込む
?
Working Backwards と AI 駆動開発で
プロトタイプを何度も作り、
仮説を洗練させる
意識的にスイッチ


## p.53

ソフトウェアの叡智を
師範として伝える


## p.54

あなたの叡智はどのように使われたいか？
学習者の外にある叡智として、
対象を分析して選択・適用してほしいなら
学習者の内にある叡智として、
主体を通して自ずと現れてほしいなら
外
在化した叡智として切り出す
パターン、ライブラリ、テンプレート
内
在化するための叡智として伝える
型
対象
対象


## p.55

「型」の習得を組織で支える
個人による
発露を広める
価値ある型を
探索する
内在化を
支援する
• 外在化と内在化の使い分けを認識する
• 内在化のための修練と
個人ごとに異なる発露を前提とする
共通認識の醸成
場の提供
• フォーマルな事例、文書、共通化よりも
個人の生の活動から叡智を得る
• 失敗が許容され、多様性を受け入れる
実践者のコミュニティを作る


## p.56

AWS Japan: コミュニティによる体験型の学びを奨励
•
2025 年 3 月に AWS Japan 社内のエンジニアを対象に AI 駆動開発コミュニティを設立
•
多様な考えの共有と「遊び」による体験をベースとする、AI 時代の組織における学びを奨励
•
1,000 名以上が参加し、ライブコーディングや LT 大会などの参加型イベントを定期的に開催
生成 AI の非決定論的な振る舞いと急速な進化は、ビルダーに好奇心と不安の両方を
もたらします。心理的安全性の高いコミュニティでの実験と学びの文化こそが、
この変化を組織の競争優位性に転換するメカニズムなのです。
―― 巨勢泰宏  アマゾンウェブサービスジャパン合同会社 常務執行役員技術統括本部長
•
Play with Tech
•
Every Voice Matters 
•
Learn Through Your Hands
•
At Your Pace
Our Tenets


## p.57

まとめ


## p.58

評価可能性が
AI の自律性を
支える
仕様駆動開発
テスト自動化
ブラウザ操作
DB / ログの確認


## p.59

Design for Evaluation
AI にタスクを引き渡す前に
「評価可能か？」を問う
評価基準
観測対象
評価可能
評価手段
評価可能にするための 3 要素
評価可能性の設計という叡智を
個人に内在化させるための型


## p.60

Ask the Speaker
こちらのRoom 後方の外側にございます、
「Ask the Speaker」カウンターまでお越しください
高野賢司
アマゾンウェブサービスジャパン合同会社
Room


## p.61

本セッションのアンケートへ
ご協力をお願いします
Please give us your feedback
Thank you!
DVT324
