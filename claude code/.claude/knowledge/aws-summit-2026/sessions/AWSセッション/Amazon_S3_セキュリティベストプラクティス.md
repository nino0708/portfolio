---
title: "Amazon S3 セキュリティベストプラクティス"
category: "AWSセッション"
session_id: "STG357"
pages: 50
topics: ["セキュリティ"]
services: ["AWS CloudTrail", "AWS Config", "AWS IAM", "AWS Organizations", "Amazon CloudFront", "Amazon S3", "Amazon SageMaker"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/AWSセッション/Amazon S3 セキュリティベストプラクティス.pdf"
---
# Amazon S3 セキュリティベストプラクティス


## p.1

STG357
Amazon S3 セキュリティベストプラクティス
焼尾徹
アマゾンウェブサービスジャパン合同会社


## p.2

目次
AWS のセキュリティ原則
利用者にとってのAmazon S3 セキュリティ
ベストプラクティス
すぐにできるアクション
本セッションに最適な聴講者：
Amazon S3 利用者（アプリケーション開発者）
Amazon S3 管理者（システム運用管理者）
AWS Organizations は聞いたことがある・利用している
そういったお客様にシステムを提案するインテグレータ様


## p.3

AWS は、セキュリティをどう考えているか


## p.4

AWS のセキュリティ・耐久性・可用性・
パフォーマンスの真の価値は、
利用者がビジネス要件を達成できるよう
にすることにある


## p.5

データへのビジネスアクセス
を継続的に確保する
ビジネスへ影響しうるリスク
を最小化または軽減する
ビジネス価値を効率的に提供
する
お客様の要件
Amazon S3


## p.6

セキュリティは全員の仕事である
設計者
運用者
利用者


## p.7

継続的な
反復的改善が
不可欠である


## p.8

チェックサム
がデフォルト
で有効
Block Public 
Access が
デフォルトで
有効
SOAP
インターフェース
の廃止
ACL が
デフォルトで
無効
SSE-C が
デフォルトで
無効
すべての新規
オブジェクトが
暗号化済み
Amazon S3 が標準で守っていること
利用者の対応不要


## p.9

「ダメ!」と言うことだけがセキュリティではない
ダメ!
アクセスできないデータは、
ある意味「ない」のと同じ
Amazon S3 は、
データが活用できるよう
デフォルトがセキュアです
ベストプラクティス
実践!
管理者
利用者
管理者
利用者


## p.10

Amazon S3 のセキュリティベストプラク
ティスとは？


## p.11

データへのパブ
リックアクセス
をブロックする
バケットキーを
有効にする
統制を分離して
スケールする
セキュリティ変
更をモデル上で
テストする
AWS 
Organizations を
活用する
S3 のデータ保護
をアプリケーシ
ョンにも広げる
ログを
有効にする
耐久性とリカバ
リを計画する
2
3
4
5
6
7
8
1


## p.12

Amazon S3 の目的別バケット・機能
Amazon S3
S3 Files
S3 Vectors
S3 Tables
S3 Metadata
S3 Express
汎用バケット
ファイル
ベクトルバケット
テーブルバケット
インベントリ
と
ジャーナル
ディレクトリ
バケット
マネージドな
Apache Iceberg 
テーブル
ベクトルDB と
クエリAPI
レイテンシー
重視
NFS インターフェース
オブジェクト
ストレージ
汎用バケット
のメタデータ


## p.13

データへのパブリックアクセスを
ブロックする
①データへのパブリックアクセスをブロックする
②バケットキーを有効にする
③統制を分離してスケールする
④セキュリティ変更をモデル上でテストする
⑤AWS Organizations でセキュリティを簡素化する
⑥S3 のデータ保護をアプリケーションにも広げる
⑦ログを有効にして、検知と対応を実装する
⑧耐久性とリカバリを事前に計画する


## p.14

Block Public 
Access
S3 汎用バケットではデフォルト
で有効になっている
すべてのウェブホスティングユース
ケースでAmazon CloudFront を使
用する
S3 access points でも自動的に有効
ディレクトリ、テーブル、ベクトル
バケットには、Public の概念はない
①データへのパブリックアクセスをブロックする
AWS Cloud
VPC
S3 バケット
Amazon S3
AWS Identity and Access 
Management (IAM)


## p.15

バケットレベルの暗号化キーを
有効にする
①データへのパブリックアクセスをブロックする
②バケットキーを有効にする
③統制を分離してスケールする
④セキュリティ変更をモデル上でテストする
⑤AWS Organizations でセキュリティを簡素化する
⑥S3 のデータ保護をアプリケーションにも広げる
⑦ログを有効にして、検知と対応を実装する
⑧耐久性とリカバリを事前に計画する


## p.16

バケットキー
S3 汎用バケットでSSE-KMS
使用時にオプションとして利用
できる
S3 Tables では、同様の仕組み
が自動的に有効になっている
AWS KMS コストを最大
99% 削減できる
②バケットキーを有効にする
AWS Key Management 
Service (AWS KMS)


## p.17

統制を分離してスケールする
①データへのパブリックアクセスをブロックする
②バケットキーを有効にする
③統制を分離してスケールする
④セキュリティ変更をモデル上でテストする
⑤AWS Organizations でセキュリティを簡素化する
⑥S3 のデータ保護をアプリケーションにも広げる
⑦ログを有効にして、検知と対応を実装する
⑧耐久性とリカバリを事前に計画する


## p.18

統制の分離
アーキテクチャの
モジュール化
組織のモジュール化
③統制を分離してスケールする


## p.19

統制を分離した時のオプション
S3 
Access 
Points
S3 
Access 
Grants
トークン
自動販売機
の考え方
ABAC
③統制を分離してスケールする


## p.20

S3 Access 
Points
ユースケースごとに独
自のポリシーを持つバ
ケットエンドポイント
を提供する
% aws s3api list-objects-v2 ¥ 
--bucket sales-hrzrlukc5m36ft7okagglf3gmwluquse1b-s3alias
自動的についたアクセスポイントエイリアス名をバケットとして指定
③統制を分離してスケールする


## p.21

Amazon S3 Access Points 利用例
VPC
S3 バケット
Sales
（VPC12345)
VPC
Data Science
(VPC67890)
VPCE
AP:
datascience
AP:
sales
バケットポリシー
VPCE
インターネット
AWS Cloud
Access points
Access points
• Sales、Data Science とそれぞれS3
アクセスポイントを分ける
• S3 アクセスポイントはVPC 利用を
強制するAWS Organizations のSCP 
(Service Control Policy, 後述) を作
成する
• バケットポリシーでS3 アクセスポ
イントについてVPC からのアクセ
スのみを許可する（結果としてイン
ターネットからのアクセスが禁止さ
れる）
Before: バケットポリシーのみで頑張る
After: アクセスポイントごとにコントロールする
③統制を分離してスケールする


## p.22

S3 Access 
Grants
特定のAWS プリンシ
パルまたはフェデレー
テッドプリンシパルに
対して、バケットやプ
レフィックスへのアク
セス権をプログラムで
付与する
企業のディレクトリ
ACCESS GRANTS
AWS IAM Identity Center による
フェデレーション


## p.23

Amazon S3 Access Grants 利用例
S3 バケット
AWS Cloud
AWS IAM 
Identity Center
S3 Access Grants の
GetAccess するロール
Amazon S3 Access Grants
Location
Grants
ロケーションに指定された
S3バケットにアクセスする
ロール
User
Grantee ID
IdP
IAM IdC インスタンス
S3 Access Grants インスタンス
リージョン
クライアント
Amazon SageMaker
Unified Studio 
AWS Transfer Family
WebApp
③統制を分離してスケールする


## p.24

トークン
自動販売機の
考え方
任意の認可ロジック
に基づき、最小ス
コープの一時認証情
報をオンデマンドで
発行する
カスタム認証・認可
③統制を分離してスケールする


## p.25

属性ベース
アクセス制御
（ABAC）
プリンシパル名やリ
ソース名ではなくタ
グに基づいてセキュ
リティポリシーを定
義する
タグベースのポリシー
③統制を分離してスケールする


## p.26

属性ベース
アクセス制御
（ABAC）
プリンシパル名やリ
ソース名ではなくタ
グに基づいてセキュ
リティポリシーを定
義する
タグベースのポリシー
③統制を分離してスケールする


## p.27

Amazon S3 
のABAC 対応
標準的なAWS TagResource API が
Amazon S3 リソースで動作する
バケットをABAC にオプトインすると
PutBucketTagging API が無効になる
NEW
S3 Tables とS3 Vectors がABAC を
サポートする
汎用バケットはオプトインによりABAC 
をサポートする
③統制を分離してスケールする


## p.28

“Simple” ですか?


## p.29

ビジネスの成長に合わせて、
最適なツールも変わる
③統制を分離してスケールする


## p.30

セキュリティ変更をモデル
上でテストする
①データへのパブリックアクセスをブロックする
②バケットキーを有効にする
③統制を分離してスケールする
④セキュリティ変更をモデル上でテストする
⑤AWS Organizations でセキュリティを簡素化する
⑥S3 のデータ保護をアプリケーションにも広げる
⑦ログを有効にして、検知と対応を実装する
⑧耐久性とリカバリを事前に計画する


## p.31

セキュリティ変更のテスト
正常系と異常系の
両方をテストする
変更のたびにテス
トを再実行する
IaC ツールでテスト
スタックを構築する
+ −
/
④セキュリティ変更をモデル上でテストする


## p.32

AWS Organizations で
セキュリティを簡素化する
①データへのパブリックアクセスをブロックする
②バケットキーを有効にする
③統制を分離してスケールする
④セキュリティ変更をモデル上でテストする
⑤AWS Organizations でセキュリティを簡素化する
⑥S3 のデータ保護をアプリケーションにも広げる
⑦ログを有効にして、検知と対応を実装する
⑧耐久性とリカバリを事前に計画する


## p.33

管理者
AWS アカウント1
AWS アカウント2
AWS アカウント3
組織
組織単位(OU)
組織単位(OU)
RCP
SCP
RCP
SCP
RCP
SCP
⑤AWS Organizations でセキュリティを簡素化する


## p.34

組織レベルの
ガードレール
として
Resource 
Control 
Policies
を使用する
組織管理者のみがガードレールを
変更できることを保証する
ガードレールはすべての新規・既存
AWS リソースに適用され、開発者が
安全を保ちながら自由に開発できる
RCP の例：Organizations 全体でS3 への非TLS アクセスを拒否
Condition: aws:SecureTransport = false →Deny​
⑤AWS Organizations でセキュリティを簡素化する


## p.35

アクセス拒否
メッセージの
強化
S3 が、同一AWS Organizations 内
のリクエストに対して
強化されたHTTP 403 メッセージを
返すことで、権限のトラブルシュー
ティングを簡素化する
NEW
⑤AWS Organizations でセキュリティを簡素化する


## p.36

1 回のAPI コールで、AWS
Organizations の組織、または組
織単位(OU) 内のすべてのアカウ
ントのすべてのS3 リソースに
Block Public Access を強制する
NEW
Amazon S3 の
Organizations 
ポリシー(宣言
的ポリシー)
⑤AWS Organizations でセキュリティを簡素化する


## p.37

Amazon S3 のデータ保護を
アプリケーションにも広げる
①データへのパブリックアクセスをブロックする
②バケットキーを有効にする
③統制を分離してスケールする
④セキュリティ変更をモデル上でテストする
⑤AWS Organizations でセキュリティを簡素化する
⑥S3 のデータ保護をアプリケーションにも広げる
⑦ログを有効にして、検知と対応を実装する
⑧耐久性とリカバリを事前に計画する


## p.38

アプリケーションで生
成した瞬間からS3 に
届くまで、途切れなく
保護する
チェックサムを作成時から付与する
データライフサイクル全体で維持する
すべての永続ストレージを暗号化する
キーローテーションと監査付きで暗号化する
データ転送中も常に暗号化する
TLS とプライベートVPC を使用する
⑥S3 のデータ保護をアプリケーションにも広げる


## p.39

S3 がデフォルトでチェックサム値をつける
Name: MyObject
ETAG (MD5): doqiawdjqowijd
Checksum_CRC64NVME: ABCDEF==
Checksum_Type: Full_Object
ChecksumAlgorithm 指定なし
↓
ChecksumAlgorithm=CRC64NVME
Default checksum
SHA-256
SHA-1
CRC32
CRC32C
User
S3 API
Storage
PUT
200 OK
CRC64-NVME
Amazon S3
Client
checksum
checksum
checksum
指定しない場合のデフォルト
SHA-512
MD5
XXHash3
XXHash64
XXHash128
⑥S3 のデータ保護をアプリケーションにも広げる
NEW


## p.40

ログを有効にして
検知と対応を実装する
①データへのパブリックアクセスをブロックする
②バケットキーを有効にする
③統制を分離してスケールする
④セキュリティ変更をモデル上でテストする
⑤AWS Organizations でセキュリティを簡素化する
⑥S3 のデータ保護をアプリケーションにも広げる
⑦ログを有効にして、検知と対応を実装する
⑧耐久性とリカバリを事前に計画する


## p.41

S3 サーバー
アクセスログ
AWS CloudTrail
Amazon S3 固有の
アクティビティログ
イベント、フィルター、
CloudWatch による可視化
すべてのAWS サービス
をサポートする
ストレージ利用分のみ
課金
⑦ログを有効にして、検知と対応を実装する


## p.42

もちろん検知
と対応は、
ログ記録だけ
ではない
フォレンジック監査
異常検知とドリフト検出
自動即時修復
https://aws.amazon.com/jp/blogs/storage/automatically-scan-for-public-amazon-s3-buckets-and-block-public-access/
Automatically scan for public Amazon S3 buckets and block public access
⑦ログを有効にして、検知と対応を実装する


## p.43

AWS Config
AWS 
Control Tower
Amazon 
GuardDuty
AWS
Security Hub
⑦ログを有効にして、検知と対応を実装する


## p.44

耐久性とリカバリを事前
に計画する
①データへのパブリックアクセスをブロックする
②バケットキーを有効にする
③統制を分離してスケールする
④セキュリティ変更をモデル上でテストする
⑤AWS Organizations でセキュリティを簡素化する
⑥S3 のデータ保護をアプリケーションにも広げる
⑦ログを有効にして、検知と対応を実装する
⑧耐久性とリカバリを事前に計画する


## p.45

S3 conditional 
writes
S3 object versioning
S3 ObjectLock
S3 Replication
AWS Backup
⑧耐久性とリカバリを事前に計画する
AWS Backup support 
for Amazon S3
AWS Backup
WORM


## p.46

データへのパブ
リックアクセス
をブロックする
バケットキーを
有効にする
統制を分離して
スケールする
セキュリティ変
更をモデル上で
テストする
AWS 
Organizations を
活用する
S3 のデータ保護
をアプリケーシ
ョンにも広げる
ログを
有効にする
耐久性とリカバ
リを計画する
1
2
3
4
5
6
7
8


## p.47

今日からすぐにできること


## p.48

新しいタグ付けAPI に移行する
重要なバケットでログを有効にする
アプリケーションにエンドツーエンドのチェックサム
を組み込む
①データへのパブリックアクセスをブロックする
②バケットキーを有効にする
③統制を分離してスケールする
④セキュリティ変更をモデル上でテストする
⑤AWS Organizations でセキュリティを簡素化する
⑥S3 のデータ保護をアプリケーションにも広げる
⑦ログを有効にして、検知と対応を実装する
⑧耐久性とリカバリを事前に計画する
開発者・現場の方は


## p.49

組織リーダーの方は
AWS Organizations レベルでBPA を強制する
必要に応じて、チームをABAC の採用に向けて推進する
テストスタックと監査にリソースを割り当てる
①データへのパブリックアクセスをブロックする
②バケットキーを有効にする
③統制を分離してスケールする
④セキュリティ変更をモデル上でテストする
⑤AWS Organizations でセキュリティを簡素化する
⑥S3 のデータ保護をアプリケーションにも広げる
⑦ログを有効にして、検知と対応を実装する
⑧耐久性とリカバリを事前に計画する


## p.50

本セッションのアンケートへ
ご協力をお願いします
Please give us your feedback
Thank you!
STG357
