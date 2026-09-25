---
title: "Microsoft ワークロードの モダナイゼーション最新⽅程式 - もう待たない、⽣成 AI で加速する移⾏の現実解"
category: "AWSセッション"
session_id: "MAM331"
pages: 35
topics: ["AI駆動開発", "マイグレーション/モダナイゼーション"]
services: ["AWS DMS", "AWS Lambda", "Amazon Aurora", "Amazon ECS", "Kiro", "MCP"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/AWSセッション/Microsoft ワークロードの モダナイゼーション最新⽅程式 - もう待たない、⽣成 AI で加速する移⾏の現実解.pdf"
---
# Microsoft ワークロードの モダナイゼーション最新⽅程式 - もう待たない、⽣成 AI で加速する移⾏の現実解


## p.1

MAM331
Microsoft ワークロードの
モダナイゼーション最新⽅程式
- もう待たない、⽣成AI で加速する移⾏の現実解
古屋楓
アマゾンウェブサービスジャパン合同会社


## p.2

⾃⼰紹介
Kaede Koya / 古屋 楓
広域事業統括本部Solutions Architect
経歴
Tata Consultancy Services Japan 
Microsoft Japan
Amazon Web Service Japan
好きな AWS サービス
Amazon Lightsail , Kiro, Amazon Transform


## p.3

• レガシーなMicrosoft ワークロードに課題をお持ちの⽅
• ⽣成AI を活⽤したモダナイゼーションに興味のある⽅
また、かつてチャレンジしたが諦めた⽅
本セッションの⽬的・対象
⽬的
• ⽣成AI を活⽤した効率的なMicrosoft ワークロードの
モダナイゼーション⼿法を理解する
対象


## p.4

• モダナイゼーションの動機
• AWS Transform とは
• 事例紹介
• まとめ& Next Step
アジェンダ


## p.5

モダナイゼーションの動機


## p.6

なぜWindows ベースの
ワークロードを
クラウドネイティブ、
オープンソースに
モダナイズするのか︖
スケーラビリティの課題
ピーク需要での
オーバー
プロビジョニング
イノベーションの停滞
DevOps、AI、
アナリティクス機能との
統合制約
コストの圧⼒
ライセンスやサポート
アップグレードの
コスト⾼
サポート終了時のパッチ
アップグレード
コンプライアンス対応
セキュリティとサポート


## p.7

コスト
パフォーマンススケーラビリティ
Windows
Linux
40% 削減
1.5 - 2x 増加
50% 以上
Windows を Linux 化するメリット
Windows 利⽤を70% 以上削減し
Linux を採⽤
X86 -64 / ARM64 への対応
軽量なコンテナ環境
AWS Lambda 
サーバーレスアーキテクチャ


## p.8

コード分析
デプロイ
互換性問題
の洗い出し
コードの
変換
検証と
動作確認
アプリケーションポートフォリオ全体に対して繰り返し実⾏
.NET アプリケーションをLinux に移⾏することは複雑
コードの書き換え、エラー処理、およびチーム間の調整が必要
労務依存
エラーの頻発
コラボレーション
ボトルネック
.NET クロスプラットフォーム移⾏は多難


## p.9

SQL Server のモダナイズは複雑で断⽚的
SQL Server のモダナイゼーションは断⽚的で複雑であり、
複数のツールと⼿作業が必要
データベースと
アプリケーション
の依存関係を分析
デプロイと検証
データベース
スキーマを変換
依存する
アプリーケーション
コードを修正
すべてのSQL Server データベースに対して繰り返す
断⽚的
エラーが起きやすい
労⼒がかかる


## p.10

AWS Transform とは


## p.11

.NET モダナイゼーション– プロセス
分析
検証
変換 
Linux 対応
.NET 
アプリケーション
.NET 
Framework


## p.12

.NET モダナイゼーション– ⼿作業の場合
分析
検証
変換 
Linux 対応
.NET 
アプリケーション
.NET 
Framework


## p.13

.NET 
Framework 
分析
検証
変換
Linux 対応
.NET 
アプリケーション
.NET モダナイゼーション– Coding Assistants の場合
Q DEVELOPER


## p.14

.NET 
Framework 
分析
検証
変換
Linux 対応
.NET 
アプリケーション
.NET モダナイゼーション– AI Agents の場合
AWS Transform 
for  .NET 
Q DEVELOPER


## p.15

フルスタックのWindows 
モダナイゼーションを
最⼤5 倍加速
数百のアプリケーションにわ
たってモダナイゼーションを
スケーリング
運⽤コストを最⼤70% 削減
AWS Transform
for full-stack Windows modernization
I N T R O D U C I N G
すべてのレイヤーで⼀貫した
変換品質を実現
G E N E R A L LY AVA I L A B L E
.NET、UI フレームワーク、SQL 
Server、デプロイメントなど、
フルスタックWindows 
アプリケーションを⼤規模に
モダナイズするための最初の
エージェントAI サービス


## p.16

Amazon ECS / 
EC2 Linux
AWS Transform for full-stack Windows modernization
デプロイ
データベース層
アプリ
ケーション層
Before
Windows ベースの
アプリケーションスタック
Windows サーバー
仮想マシン
.NET Framework 3.5+
After
オープンソース
クラウドネイティブなスタック
Cross-platform 
.NET 8 & 10
SQL Server
Amazon Aurora 
PostgreSQL
AWS Transform
Web コンソール
⼤規模モダナイゼーション
AWS DMS / Visual Studio IDE 拡張
開発者 / DBA リード


## p.17

エクスペリエンス
Web コンソール
IT 部⾨向け
ü リポジトリ単位での
⼤規模変換
ü チーム間連携
ü 開発者へのハンドオフ
Visual Studio IDE
開発者向け
ü 1 つのソリューションへ
の集中
ü チェックポイントによる
反復
ü 変換結果の確認と⽅向
修正
AI コードコンパニオン
開発者向け
ü 1 つのソリューションへ
の集中
ü AI エージェントとの
協働
ü 変換後の課題も解決


## p.18

⾃律モードと対話モードでの作業
変換はエージェントに任せることも、⾃分で主導することも可能
AWS 
Transform
Autonomous
Interactive
エージェント任せで変換を実⾏
エージェントと並⾛して作業
.NET 
Framework
app
Modern 
.NET app
AWS 
Transform
.NET 
Framework
app
Modern 
.NET app
MCP Server 
連携 
MCP Server 
連携


## p.19

.NET Transformation agent
.NET アプリケーションのLinux への移⾏を⽀援するエージェント
Linux 対応の
.NET 8/ 10
アプリケーション
分析
検証
変換 
Web コンソール
⼤規模移⾏
Visual Studio IDE 拡張
Windows 依存の
.NET framework 
3.5 以降の
アプリケーション
開発者主導
MCP Server 
連携


## p.21

Web コンソールからも確認可能


## p.22

AWS 
Transform
.NET Framework
app
Modernized
.NET app
NextSteps.md
Modernized 
.NET app
Finalized
.NET app
AWS Transform が残タスクのネクストステップを⽣成
AI コードコンパニオンに引き継いで、モダナイズしたアプリのカスタマイズと仕上げを実施
仕上げはAI コードコンパニオンに引き継ぎ


## p.24

AWS Transform for SQL Server モダナイゼーション
分析と
アセスメント
検証とデプロイ
データベース
モダナイ
ゼーション
EC2 / RDS / 外部ホストの
SQL Server と依存する
.NETアプリケーション
Aurora PostgreSQL データベースおよび
互換性のある .NET アプリケーション
依存アプリ
ケーションコード
の変換


## p.26

事例紹介


## p.27

重要なベンダー管理システ
ム(Skylynx) を .NET 
Framework 4.8 から更新
し、Windows Server の
ライセンスコストを削減す
るとともに、クラウド
インフラストラクチャを最
適化する必要がありまし
た。
課題
AWS Transform の 
AI エージェント機能を 
Web UI と Visual Studio 
拡張機能の両⽅を利⽤
し、アプリケーションを
クロスプラットフォーム
対応の.NET 8 へ移⾏しま
した。
ソリューション
› 初期導⼊段階 7,870⾏(コード
ベースの30%) を数時間で変換
› 変換時間を数ヶ⽉から数週間に
⼤幅短縮
› 4 つの主要プロジェクトすべて
のモダナイズに成功
› Windows ライセンスの廃⽌に
より、TCO の⼤幅削減を実現
結果
The Hartford is a leader in 
property and casualty 
insurance, group benefits, 
and mutual funds. For over 
200 years, the company 
has provided people and 
businesses with the 
support and protection they 
need to pursue their unique 
ambitions, seize opportunity, 
and prevail through 
unexpected challenges.
C U S T O M E R P R O F I L E
I N D U S T R Y
Insurance/Financial Services
R E G I O N
United States
AWS Transform は、当社のモダナイズを加速し、クラウド移⾏イニシア
チブの市場投⼊速度を向上させました。このサービスはレガシーコードの
変換を数ヶ⽉から数週間に短縮するだけでなく、開発者にプロセス全体を
通じて貴重な洞察と提案を提供してくれました。
Gaurav C Patrikar
Director Software Engineering, The Hartford
The Hartford: AWS Transform を活⽤した
.NET のモダナイズの加速


## p.28

イノベーションを妨げ、
ロードマップの優先事項
と競合する⾼コストで
時間のかかるレガシー
な.NET Framework 
アプリケーションの
メンテナンスに苦慮して
いました。
課題
⼤規模な .NET モダナ
イズ⽤途に設計された
AI エージェントツール
「AWS Transform」を
導⼊しました。この
ツールは、Web イン
ターフェースとID E統
合の両⽅を通じて並列
処理を可能にします。
ソリューション
› モダナイズによる 4 倍
の⾼速化: 150 万⾏/⽉
のコード
› Linuxへの移⾏により
30%のコスト削減
› 技術的負債を70%削減
› 変換作業期間: 数ヶ⽉
の予定を 2 週間に短縮
結果
As a global tech and AI 
leader powering the legal, 
tax, and compliance 
industries, Thomson Reuters 
is always looking for smarter, 
faster ways to build. That 
means staying ahead of the 
curve—and teaming up with 
partners like AWS to push 
what’s possible.
C U S T O M E R P R O F I L E
I N D U S T R Y
Financial Services
R E G I O N
United States/Global
AWS Transform は、私たちのチームの⼀員のような存在でした̶
常に学習し、最適化し、私たちをより迅速に前進させる⽀援をしてく
れました。
Matt Dimich
VP, Platform Engineering Enablement at Thomson Reuters
Thomson Reuters : AWS Transform を
活⽤して.NET のモダナイズを加速


## p.29

⽣成 AI で実現する .NET モダナイゼーションの運⽤
Tools
AWS Transform for .NET
AI コーディング
アシスタント
People
中央チームの設置
ナレッジベースの構築
Process
セルフサービス化
ビジネス価値と
優先度の整合
Business Benefits
• 開発時間の削減
• モダナイズ対象の拡⼤
• クラウドコストの最適化
• ビジネス俊敏性の向上


## p.30

まとめ& Next Step


## p.31

本セッションのまとめ
1. AWS Transform × AI コーディングエージェントで
 モダナイゼーションを実現
2.  成功のカギはツール、⼈、プロセス
3.  モダナイゼーションによりビジネス俊敏性向上を実現


## p.32

Get started today
AWS Transform for .NET 
について詳しく学ぶ
https://aws.amazon.com/
jp/transform/net 
ハンズオンデモ
https://aws.storylane.io/share
/5xy6f98m17hm  
ユーザーガイド
https://docs.aws.amazon.com/
transform/latest/userguide/do
tnet.html


## p.33

Exhibition Booth Information
展⽰ブースのご案内
A130
Microsoft ワークロードの
モダナイゼーション最前線
AWS Village①


## p.34

Ask the Speaker
こちらのRoom 後⽅の外側にございます、
「Ask the Speaker」カウンターまでお越しください
古屋楓
アマゾンウェブサービスジャパン合同会社
Room


## p.35

本セッションのアンケートへ
ご協⼒をお願いします
Please give us your feedback
Thank you!
MAM331
