---
title: "メインフレームアプリケーションが AWS 上で生まれ変わる- 生成 AI 活用による Reimagine"
category: "AWSセッション"
session_id: "MAM303"
pages: 56
topics: ["AI駆動開発", "マイグレーション/モダナイゼーション", "生成AI/エージェント", "組織/内製化"]
services: ["AWS CDK", "Kiro"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/AWSセッション/メインフレームアプリケーションが AWS 上で生まれ変わる- 生成 AI 活用による Reimagine.pdf"
---
# メインフレームアプリケーションが AWS 上で生まれ変わる- 生成 AI 活用による Reimagine


## p.1

MAM303
メインフレームアプリケーションが
AWS 上で生まれ変わる: 
生成AI 活用によるReimagine
山下大介
アマゾンウェブサービスジャパン合同会社


## p.2

自己紹介
山下
大介
アマゾンウェブサービスジャパン
技術統括本部カスタマーソリューションマネージメント本部
シニアテクニカルカスタマーソリューションマネージャー
メインフレームのインフラ・開発エンジニア・プロジェクトマネージャの
バックグラウンドを持ち、エンタープライズのお客様向けにクラウド活用
における戦略立案、施策推進を支援
得意分野
クラウド活用戦略、クラウド移行戦略、プログラムマネジメント
2


## p.3

このセッションで話すこと/ 話さないこと
想定する聴講者
• メインフレームのAWS 移行を検討しているエンジニア
• メインフレームの AWS 移行を上層部へ提案したいマネジメント層
• メインフレームのビジネス価値をAWS で進化させたい全ての人
話すこと
• メインフレームの移行パターンであるReimagine の進め方
• AWS Transform for mainframe とKiro を活用したReimagine の手法
話さないこと
• AWS Transform for mainframe とKiro のReimagine 以外で使用する機能
• Reimagine を実現するための組織変革アプローチ


## p.4

今日、覚えて帰っていただきたいこと
Reimagine
メインフレームの AWS 移行パターンの一つで、
「メインフレームアプリケーションを、
クラウドネイティブなアーキテクチャで再構築する」こと
AI エージェントの登場によって、
これまで以上に現実的な選択肢となった


## p.5

1. なぜ今、メインフレームを進化させるのか
2. Reimagine とは
3. Reimagine の実践：3 フェーズアプローチ
4. 先進企業のReimagine 事例
5. まとめとNext Steps
Agenda


## p.6

なぜ今、メインフレームを進化させるのか


## p.7

メインフレームが築いてきた価値
何十年もの間、企業の基幹業務を支え続けてきた
ビジネスロジックという「知的資産」
このビジネスロジックこそが、企業の競争力の源泉
87%
のクレジットカード取引
500 億件/ 日
以上のトランザクション
$8 兆/ 年
の決済を処理


## p.8

構造的課題
1
ブラックボックス化の加速
2
運用・保守コストの増大
3
長年の改修によるシステムの複雑化
課題と向き合い、ビジネスロジックを進化させる
属人化とドキュメントの未整備に、人材の退職が重なる
新規投資への余力が低下し、攻めのIT 投資ができない
システム改修に時間がかかり、ビジネスのスピードに対応できない


## p.9

ビジネスロジック進化における2 つの挑戦
リバース
エンジニアリング
アプリケーションの仕様を読み解く
フォワード
エンジニアリング
• 数百万行のコード
• ブラックボックス化したビジネス
ロジック
• ドキュメント不足
• 業務プロセスの見直し
• マイクロサービス、モジュラーモノリス化
• クラウドネイティブ実装
アプリケーションを再構築
超えるべきハードル
超えるべきハードル


## p.10

ビジネスロジック進化における2 つの挑戦
リバース
エンジニアリング
アプリケーションの仕様を読み解く
フォワード
エンジニアリング
• 数百万行のコード
• ブラックボックス化したビジネス
ロジック
• ドキュメント不足
•
業務プロセスの見直し
•
マイクロサービス、モジュラーモノリス化
•
クラウドネイティブ実装
アプリケーションを再構築
メインフレーム開発者
による人海戦術
モダンアプリケーション開発者
による人海戦術
異なる専門家による人海戦術→ 年単位のプロジェクト
超えるべきハードル
超えるべきハードル


## p.11

生成 AI が変えたゲームのルール
リバース
エンジニアリング
アプリケーションの仕様を読み解く
フォワード
エンジニアリング
• コード分析
• データ分析
• ビジネスロジック抽出
• 仕様駆動開発
• コード生成
• テスト生成
アプリケーションを再構築
生成AI 活用ポイント
生成AI 活用ポイント


## p.12

生成 AI が変えたゲームのルール
リバース
エンジニアリング
アプリケーションの仕様を読み解く
フォワード
エンジニアリング
• コード分析
• データ分析
• ビジネスロジック抽出
• 仕様駆動開発
• コード生成
• テスト生成
アプリケーションを再構築
生成AI 出力結果を専門家がレビュー→ 月単位のプロジェクトへ
メインフレーム開発者
によるレビュー
モダンアプリケーション開発者、
メインフレーム技術者
によるレビュー
生成AI 活用ポイント
生成AI 活用ポイント


## p.13

Reimagine とは


## p.14

メインフレームの8 つの移行パターン
移行戦略
移行パターン
ビジネスロジックを進化
Refactor
Reimagine
最小限の変更で移行
Replicate and leverage data
パッケージ製品へ置き換え
Repurchase
移行しない
Replatform
Rehost
Retain
Retire


## p.15

ビジネスロジックを進化させる移行戦略
起点はビジネス目標と解決したい課題
Refactor
既存のビジネスロジックを維持したまま、
コード変換とクラウド移行により進化
Reimagine
既存のビジネスロジックを再設計し、
クラウドネイティブなアーキテクチャへ進化
• IT 運用コスト削減
• 人材リスク対応 (COBOL →Java)
• インフラのスケーラビリティ獲得
• 業務プロセスを変革したい
• モダンUI ・リアルタイム化したい
• モノリスをマイクロサービスに分割したい
ビジネス目標に応じて、Refactor とReimagine を
組み合わせた意思決定を行う


## p.16

メインフレームのワークロードを
大規模にモダナイズするための
エージェンティックAI サービス
Reimagine を支えるAWS の生成AI
AWS Transform
for mainframe
Kiro
エージェンティック
コーディングサービス
AWS の19 年の移行経験を学習した
AI エージェント群
自然言語による対話を通じて
AI と人が協働してコードを生成
役割の異なる2 つの生成AI の連携がReimagine を加速


## p.17

フェーズ1
既存のコードを
読み解く
Reimagine とは– 3 フェーズアプローチ
リバース
エンジニアリング
フェーズ2
フォワード
エンジニアリング
フェーズ3
デプロイ＆
テスト
新しいコードを
生成する
クラウドへ
デプロイしてテスト
Reimagine 対象の
メインフレームアプリケーション
モダンアプリケーション
仕様駆動開発の手法を用いて、
開発サイクルを繰り返す


## p.18

Human in the Loop – AI と人間の協業
ドメインエキスパート
(= メインフレーム開発者など)
• 業務知識を提供する有識者
• メインフレームのビジネスルール、
データ構造を熟知
• Phase 1 〜3 を通じて業務観点
でレビュー
アーキテクト
(= モダンアプリケーション開発者など)
• 設計判断をリードする実装担当
• モダンアプリケーション設計を熟知
• Phase 1 〜3 を通じて技術観点
でレビュー
AI が速度を、人間が品質を担保


## p.19

Reimagine 対象システムの特定
現場の痛み
経営戦略
成長(Growth)
新規事業・新チャネルで成長を加速
競争優位(Competitive Advantage)
データを活かした迅速・正確な意思決定
アジリティ(Agility)
迅速なサービスリリースで顧客体験
を継続的に向上
現場の痛みを経営戦略に昇華し、Reimagine を戦略的投資として意思決定する
• 既存システムの拡張が難しい
• 新チャネル対応ができない
• データがサイロ化している
• データ抽出・集計に時間がかかる
• リリースサイクルが長い
• 変更の影響範囲が大きい
昇華
昇華
昇華


## p.20

Reimagine の実践：3 フェーズアプローチ
※ AWS が公開している、CardDemo (クレジットカード管理アプリケーション) の一部である、
顧客管理機能をマイクロサービス化した実践例を使用


## p.21

アプリケーションの仕様を読み解き、ブラックボックスを開ける
入力
メインフレーム資産
(コードベース)
社内専門用語
AWS Transform for mainframe
コード分析
データ分析
出力
コード分析結果
データ分析結果
ビジネスロジック
フェーズ 1: リバースエンジニアリング
ビジネス
ロジック抽出
コードベースを把握
データの依存関係と構造を文書化
業務機能とビジネスルールを抽出


## p.22

AWS Transform との対話
チャット欄にプロンプトを入力


## p.23

AWS Transform との対話イメージ
AWS Transform と対話(Human in the Loop) しながら進める
コード分析、データ分析、ビジネスロジック抽出がしたい
ご希望の機能はこちらになります。コード分析、データ分
析、ビジネスロジック抽出を進めてよろしいでしょうか？
はい
計画が作成されました。ジョブパネルで計画を確認してく
ださい。この計画で進めてよろしいですか？


## p.24

コード分析の開始


## p.25

コードベースを把握
1
2
3
4
1
2
3
4
出力ファイル
Missing files
AI による分析内容
•
コードベースの中から不足して
いるメインフレーム資産を特定
人間による対応
Identically named
•
同名のファイル名を持つ
メインフレーム資産を特定
Duplicated IDs
•
同名のプログラムID を持つ
COBOL を特定
Codebase Issues
•
解決すべきコードの問題や
サポート対象外のコードを特定
•
不足ファイルの特定と収集
•
同名ファイルの中身を比較して
要・不要を判断
•
正しいプログラムを分析して
いるかどうかを確認
•
コード修正やコード調査
コード分析


## p.26

不足ファイルの特定と収集
ダウンロードしたMissing files 例
ファイル名、ファイル種別を特定
呼び出し元、呼び出し元との関連性を特定
コードの完全性を向上させることで、
後続のビジネスロジック抽出の精度を高める
コード分析


## p.27

データ分析の開始


## p.28

データの関係と構造を文書化
1
2
1
2
データリネージュ
•
JCL・プログラムのデータアクセス
パターンを分析
•
データの「使用法と依存関係」を
一覧化
•
データの項目定義(Copybook、
Db2 テーブルなど) を分析
•
データの「構造と意味」を一覧化
データディクショナリ
データ分析


## p.29

データの流れと意味を理解
出力内容
データリネージュ
データ分析の課題
•
データの流れが多岐に渡り、どの
処理でデータを参照、更新してい
るかを把握することが困難
AI による分析内容
データ
ディクショナリ
•
データの項目名(Copybook, 
Db2 テーブルなど) だけでは
業務的な意味の把握が困難
•
データセット単位で、JCL・プロ
グラムによる依存関係とアクセ
スパターンを分析して一覧化
•
ソースコードから業務的な意味
を読み取り、各項目に業務的な
意味を付与
•
メインフレーム特有のデータ形
式（COMP-3, REDEFINES 等）
の所在が、コードからは把握し
づらい
•
各項目のデータ形式（COMP-3, 
REDEFINES 等）と初期値を記録
データの流れと意味を読み解き、フェーズ2 のインプットに活用
データ分析


## p.30

ビジネスロジック抽出の開始


## p.31

業務機能の分割
AI が業務機能を分割する仕組み
コンポーネント間の依存関係を分析
例: COBOL / JCL / Copybook など
Entry Point を識別
例: トランザクション/ バッチジョブ
業務機能の境界を判定して分割
判定基準: 依存関係と類似する業務機能
分割後のCardDemo 業務機能例
ユーザー
認証
口座管理
カード管理
取引・認可
取引履歴
請求・支払
報告・ BI
参照データ
管理
顧客管理
データ統合
システム
管理・基盤
未分類
↑フェーズ2 でマイクロサービス化
AI が分割した業務機能を基に、アプリケーションの再構築を検討
1
2
3
クレジットカード管理アプリケーション
12 の業務機能を分割
ビジネスロジック抽出


## p.32

ビジネスルールを抽出
ビジネスルールを8 つに分類し、Given / When / Then 形式で記述
Process Rules
プロセス
Validation Rules
データ検証
Decision Rules
分岐・判定
Computation Rules
計算
Definitional Rules
データ構造
Policy Rules
業務ポリシー
（例）口座開設日検証※CardDemo から抜粋
Given 口座開設日に入力がある
When 口座開設日の検証が実行される
Then 年・月・日が有効な暦上の日付であることを検証
実行可能な仕様— 仕様駆動開発の設計にも、テスト自動化にも活用
Action Rules
アクション
Authorization Rules
アクセス制御
ビジネスロジック抽出


## p.33

ビジネスロジック抽出結果
bre_output/
├─── index.html
├───ApplicationLevelAnalysis/
│   ├── application.html / .json
│   └── [業務機能名]/
│       ├── [業務機能名].html / .json
│       └── entrypoint-[EntryPoint 名]/
│           ├── entrypoint-[EntryPoint 名].html
│           └── entrypoint-[EntryPoint 名].json
├─── [ライブラリ名]/
│   ├── [プログラム名]-cbl.json
│   └── [プログラム名]-cbl.html
└─── [ライブラリ名]/
    ├── [ジョブ名]-jcl.json
    └── [ジョブ名]-jcl.html
index
AI が分割した業務機能ごとのビジネス
ロジック抽出結果が一覧化された目次
Application Level の分析結果
業務機能ごとに、機能概要と各Entry Point 
を起点とした処理概要
(処理フロー・入出力データ情報など）
COBOL / JCL 分析結果
プログラム/ JCL ごとの処理概要
( 処理フロー・Given / When / Then 形式の
ビジネスルールなど）
フェーズ 2 のインプットとしてそのまま使用可能な形式
1
2
3
1
2
3
ビジネスロジック抽出
3


## p.34

入力
AWS Transform
成果物
Kiro と人間による仕様駆動開発
Kiro Steering
設定
仕様の生成
コード・
テスト生成
アプリケーションを再構築し、ビジネスロジックを進化させる
フェーズ 2: フォワードエンジニアリング
フェーズ 3
デプロイ &
テスト


## p.35

Kiro のSteering 設定
なぜ Steering が必要か？
1. 永続的な知識の共有
Kiro が会話開始時にSteering を自動で
読み込むため、プロジェクトの前提知識
などの永続的な知識は毎回プロンプトで
指示する必要がなくなる
2. 成果物の一貫性を保つ
Kiro がSteering の内容を守り続ける
ことで、仕様・コードの品質を一貫
して維持する
基本情報
product.md
プロダクトの目的・対象ユーザー・主要機能・
ビジネス目標
tech.md
フレームワーク・ライブラリ・開発ツール・
技術的制約
structure.md
ファイル構成・命名規則・インポート規則・
アーキテクチャ設計方針
メソドロジー
ビジネスルール抽出分析
ドメイン駆動設計分析
マイクロサービス仕様生成
＜ 実践例のSteering設定＞


## p.36

Kiro による仕様駆動開発
仕様駆動開発の進め方
1. Spec を選択して仕様駆動開発を開始
①ローカルフォルダにAWS Transform の成果物を格納
②Kiro で上記のフォルダを開きSpec を選択
2. Kiro と人間が対話をして仕様駆動開発を進める
人間が入力するプロンプトに基づいてKiro が3 つの
Spec ドキュメントを生成し、人間と対話しながら
仕様駆動開発を進める
requirements.md
(ユーザーストーリー+ 受入基準)
tasks.md (実装手順 + タスク実行)
design.md (設計)
プロンプトを入力
Spec を選択


## p.37

Reimagine 前後の技術スタックの比較
Before (メインフレーム)
After (AWS)
画面
BMS マップ
React
オンライン
CICS
REST API
(オンライン・バッチ統合)
プログラム言語
COBOL
Java (Spring Boot)
データ
VSAM / Db2
Aurora PostgreSQL
OS ・基盤
z/OS
ECS Fargate
メインフレームアプリケーションが、クラウドネイティブな構成へ進化
バッチ
JCL
※ 実践例のTech.md の内容に基づいた、顧客管理マイクロサービスの構成例となります。


## p.38

Reimagine 前後のコード比較(COBOL to Java)
COBOL コードが自然なJava コードへ進化
パターン1 データの全件取得
PERFORM UNTIL END-OF-FILE =  'Y'
PERFORM 1000-CUSTFILE-GET-NEXT
IF
END-OF-FILE =  'N'
DISPLAY CUSTOMER-RECORD
END-IF
END-PERFORM.
@Service
public class CustomerService {
public List<CustomerDto> listAll() {
return repository.findAll().stream()
.map(mapper::toDto)
.toList();
}
}
パターン2 ファイルOpen / Close
0000-CUSTFILE-OPEN.
OPEN INPUT CUSTFILE-FILE.
    ・・・※中略・・・
9000-CUSTFILE-CLOSE.
    CLOSE CUSTFILE-FILE.
Spring が自動管理するため、
ファイルOPEN / CLOSE のコードは存在しない
PERFORM UNTIL で
1 件ずつデータを取得
findAll() で
データを一括取得
ファイルの
OPEN / CLOSE を記述
COBOL
Java
COBOL
Java


## p.39

Kiro による仕様生成
プロンプトのイメージ
Context:
あなたは、顧客管理機能の仕様に基づき、顧客管理
マイクロサービスのアーキテクチャを、AWS の
ベストプラクティスに従い、設計・実装します
Role:
あなたは、Senior AWS Solutions Architect および
  マイクロサービス開発者です
Action:
  1. CardDemo の顧客管理機能の仕様を分析
2. アーキテクチャ設計
(サービス境界/ 通信パターン/ AWS サービス選定)
3. マイクロサービスを設計に基づいて実装
(データモデル/ API 仕様/ 統合点 / テスト)
プロンプトの工夫ポイント
コンテキストを明示的に伝える
何を入力にして、何に従い、
何を作るかを明示的に伝える
Kiro に役割を与える
ソリューションアーキテクト+
マイクロサービス開発者の両視点で
考えさせる
Action を具体的に指示する
分析→設計→実装の順で
アクションの実行を指示する
1
2
3
1
2
3
何を・どの視点で・どう進めるかを伝え、仕様の精度を高める


## p.40

Spec で生成される 3 つのドキュメント
requirements.md
要件定義
• ユーザーストーリー
• 受入基準(EARS 記法)
• 非機能要件
design.md
技術設計
• アーキテクチャ
• データモデル
• ビジネスロジック
• API 設計
• テスト設計
tasks.md
実装タスク
•
CDK インフラ実装
※ CI/CD パイプライン含む
•
データモデル実装
•
ビジネスロジック実装
•
REST API 実装
•
テスト作成・実行
要件→設計→実装が一直線につながるトレース可能な仕様


## p.41

Human in the Loop の実践
Reimagine 実践例
実践例1
インフラ構築要件を追加
プログラムのコードだけでなく、AWS環
境の構築(CDK) を要件として追加
実践例2
要件をブラッシュアップ
CI/CD をビルドだけでなく、自動テスト・
検証環境デプロイまで構築する要件に変更
AI のドラフトを起点に、対話を重ねて確かな仕様に育てる
ドメインエキスパート
アーキテクト
Kiro
対話
※ 意思決定に関するAI との対話履歴は、意思決定ログとして残すことがおすすめ


## p.42

不明点はKiro に質問し、必要なら仕様に
戻って修正
Kiro によるコード・テスト生成
コード・テスト生成の進め方
1. tasks.md のタスクを実行
個別に実行、または一括実行
2. Kiro がコードとテストを生成・実行
コード: Java マイクロサービス+ CDK (IaC)
テストコード: ユニットテスト
テスト実行：ユニットテストを実行
3. 実行結果を人間がレビューしながら
進める
Kiro がタスクを実行し、人間が品質を高める


## p.43

Kiro が生成する成果物例
carddemo-reimagined/
├── .kiro/specs/cms/
│   ├── requirements.md
│   ├── design.md
│   └── tasks.md
├── cms/
│   ├── src/
│   │   ├── main/
│   │   └── test/
│   ├── pom.xml
│   └── Dockerfile
├── infra/
└── docs/
1
3
4
1
Spec ドキュメント
requirements.md / design.md / tasks.md の
3 つのMarkdown ファイル
2
Java プロジェクト一式
ビジネスロジックを実装したJava コードと、
それを検証するJUnit テストコード一式
(pom.xml・Dockerfile 含む)
3
4
AWS CDK v2 (IaC)
AWS 環境(Aurora, Fargate, CI/CD など) を
コードで構成したTypeScript ファイル
ドキュメント
デプロイ手順や運用手順など、必要に応じて
作成するMarkdown ファイル
フェーズ3 で使用する、デプロイ可能なコード一式を生成
2


## p.44

フェーズ3: デプロイ& テスト
AWS環境構築
・ユニットテスト(フェーズ 2 成果物)
・統合テスト(新規作成)
自動化と人間による検証、フェーズ 2 のサイクルで品質を向上
Kiro でAWS インフラ環境を構築
(フェーズ2 のCDK を活用)
検証環境へデプロイ
＆UAT・性能テスト
CI/CD で以下のテストを自動化
CI/CD で自動テスト・自動デプロイ
(必要に応じて人間が確認)
人間が業務・性能の両面で検証
・UAT (業務観点での受け入れ確認)
・性能テスト(本番相当の負荷で検証)
テストOK の場合は
本番環境へデプロイ
必要に応じて
フェーズ2 に戻る


## p.45

プロジェクト初期から検討すべき移行方針
移行方針
アプリケーションの規模・複雑性、ダウンタイム許容度に応じて、
段階移行(Strangler Fig) や一括移行(ビッグバン) などを検討
データ移行
データ変換、
DB・ファイル移行
本番切替
切替タイミング
ロールバック計画
並行稼働
メインフレームとAWS の
データ同期・整合性
適切な移行方針を検討し、安全なAWS移行を実現


## p.46

先進企業のReimagine 事例


## p.47

Itaú Unibanco
ラテンアメリカ最大の金融機関で、7,000 万人以上の顧客にサービスを提供
背景・課題
•
50 年以上稼働する数十億行のCOBOL コード
•
モダナイズには 4 年間を想定
•
エンジニアの時間の50% が依存関係の分析に
費やされる
成果
依存関係の検出時間を96% 短縮
ソリューション
•
70 本のオンライン+ 170 本のバッチジョブ
から構成するシステムのReimagine を実施
•
AWS Transform で依存関係を分析
•
Kiro CLI で仕様駆動開発を実施
フォワードエンジニアリングの時間を
82% 短縮
テスト効率が97% 向上
移行スケジュール全体が75% 短縮
repost.aws/selections/KPi8Lzj6LaQK-LnDjPyxrezA/generative-ai-for-mainframe-modernization


## p.48

BMW Group
自動車業界のグローバルリーダー/ AI バイデフォルト戦略を推進
背景・課題
•
AI バイデフォルト戦略を阻害する従来の
メインフレーム構成
•
複雑なレガシーコードに閉じ込められた
ビジネスルール
•
モダナイゼーション検証のためのテスト
ケースが不十分
成果
テスト作成時間を75% 短縮
（10 日間から数時間に短縮）
ソリューション
•
Reimagine とRefactor の戦略的な組み合わせ
•
AWS Transform でビジネスルール抽出
•
Kiro でフォワードエンジニアリング
•
7 つのアプリケーションを6 カ月で移行
テストカバレッジが60% 向上
プロジェクト全体のタイムラインの
12 か月短縮を目標
aws.amazon.com/solutions/case-studies/innovators/bmw/


## p.49

まとめとNext Steps


## p.50

まとめ
1
AWS Transform とKiro の連携でReimagine を加速
生成AI が、年単位のプロジェクトを月単位に短縮
2
Human in the Loop で、AI と人間が協業して品質を担保
AI が速度を、ドメインエキスパートとアーキテクトが品質を
3
Reimagine を始めるなら「今」
ドメインエキスパートがまだ社内にいる「今」が、成功の鍵


## p.51

Next Steps — 今日から始められること
AWS Transform でリバースエンジニアリングを体感する
CardDemo のコード分析・データ分析・ビジネスロジック抽出を体験する
※ CardDemo はaws-samples としてGitHub 上で公開
ドメインエキスパートと共にReimagine 対象の検討を開始する
現場の痛みを知ることから始めて、経営戦略に昇華する
AWS / パートナーへ相談する
一人で抱え込まず、まず話を聞いてみる
1
2
3


## p.52

参考リンク
※本セッションに関連する公式情報・ブログ
1. なぜ今、メインフレームを進化させるのか
•
AWS ブログ：実世界におけるCOBOL の
モダナイゼーションから学んだこと
aws.amazon.com/jp/blogs/news/learnings-from-cobol-modernization-in-
the-real-world/
•
AWS Executive Insights: Cloud for CEOs
aws.amazon.com/jp/executive-insights/content/cloud-for-ceos/
2. Reimagine とは
•
AWS ブログ：エージェンティックAI とAWS Transform で
メインフレームアプリケーションを再構想(reimagine) する
aws.amazon.com/jp/blogs/news/reimagine-your-mainframe-applications-
with-agentic-ai-and-aws-transform/
aws.amazon.com/jp/blogs/news/migration-and-modernization-taking-a-
comprehensive-perspective-to-mainframe-application-modernization-with-a-
disposition-strategy/
•
AWS Transform for mainframe
aws.amazon.com/jp/transform/mainframe/
•
Kiro
kiro.dev/docs/
•
AWS ブログ：メインフレームアプリケーションのモダナイ
ゼーションに関する包括的な視点と配置戦略
•
Kiro 公式ガイド
https://aws.amazon.com/jp/documentation-overview/kiro/


## p.53

参考リンク
※本セッションに関連する公式情報・ブログ
3. Reimagine の実践: 3 フェーズアプローチ
•
AWS re:Post: Data Analysis with AWS Transform for 
mainframe - Understand your applications data landscape
https://repost.aws/articles/ARTpafKxHXT0Wl4X3UBa6f1A/data-analysis-
with-aws-transform-for-mainframe-understand-your-applications-data-
landscape
aws.amazon.com/jp/blogs/news/integration-architectures-between-
mainframe-and-aws-for-co_existence/
•
AWS ブログ：メインフレームからAWS への移行途中の過渡期
に於ける両環境併存のための連携アーキテクチャ
•
AWS サンプルアプリ: CardDemo
https://github.com/aws-samples/aws-mainframe-modernization-carddemo
•
AWS re:Post: Understanding Business logic outputs from 
AWS Transform for mainframe
https://repost.aws/articles/ARIahCS4hUR3GQbfkFBGD4Fg/understanding-
business-logic-outputs-from-aws-transform-for-mainframe
https://aws.amazon.com/jp/blogs/migration-and-modernization/tackling-
large-mainframe-portfolio-with-agentic-ai-and-aws-transform/
•
AWS ブログ：Tackling large mainframe portfolio with 
Agentic AI and AWS Transform
https://docs.aws.amazon.com/ja_jp/prescriptive-guidance/latest/cloud-
design-patterns/strangler-fig.html
•
AWS 規範ガイダンス：strangler fig パターン


## p.54

Exhibition Booth Information
展示ブースのご案内
A126
レガシーの変革
-メインフレームモダナイゼーション
AWS Village①


## p.55

Ask the Speaker
こちらのRoom 後方の外側にございます、
「Ask the Speaker」カウンターまでお越しください
山下大介
アマゾンウェブサービスジャパン合同会社
Room


## p.56

本セッションのアンケートへ
ご協力をお願いします
Please give us your feedback
Thank you!
MAM303
