---
title: "ステーブルコイン「JPYC」を支える AWS －統制とスタートアップスピードの両立－"
category: "事例セッション"
session_id: "IND230"
pages: 24
topics: ["セキュリティ"]
services: ["AWS CloudTrail", "AWS Config", "AWS IAM", "AWS Security Hub", "AWS Systems Manager", "Amazon ECS", "Amazon GuardDuty", "Amazon S3"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/事例セッション/ステーブルコイン「JPYC」を支える AWS －統制とスタートアップスピードの両立－.pdf"
---
# ステーブルコイン「JPYC」を支える AWS －統制とスタートアップスピードの両立－


## p.1

IND230
ステーブルコイン「JPYC」を支えるAWS
－統制とスタートアップスピードの両立－
松岡慧
JPYC株式会社
執行役員・計画情報部長


## p.2

©️JPYC Inc.
ステーブルコイン「JPYC」を支えるAWS
－統制とスタートアップスピードの両立－
2026年6月26日


## p.3

©️JPYC Inc.
自己紹介
3
松岡慧
執行役員/ 計画情報部長
2023 年にJPYC株式会社へ入社。
Web エンジニアとして、フロントエンド、バックエンド、スマートコ
ントラクト、クラウドインフラまで幅広い領域の開発に従事。
現在は執行役員・計画情報部長としてシステムリスク管理を統
括し、セキュリティおよびIT ガバナンス体制の強化を推進。
情報処理安全確保支援士。


## p.4

©️JPYC Inc.
JPYC とは
4
JPYC = Japanese Yen Coin
銀行振込
JPYC 発行
JPYC 移転
銀行振込
ブロックチェーン上で利用
法律上は
電子決済手段


## p.5

©️JPYC Inc.
2022 年資金決済法改正
5
電子決済手段が法定化
After
Before
電子決済手段
資金移動業
前払式支払手段


## p.6

©️JPYC Inc.
国内初の電子決済手段
6
2025年10月
サービス開始


## p.7

©️JPYC Inc.
我々が直面していた条件
7
✔スタートアップ
✔少人数
✔金融システム
✔Web3
✔24H365D
✔国内初
✔規制対応


## p.8

©️JPYC Inc.
スタートアップvs 金融
8
スタートアップ
金融
まず出す
問題を出さない
スピード重視
慎重性重視
柔軟
厳格
少人数
高統制
両立が必要だった


## p.9

©️JPYC Inc.
金融システムは「動くだけ」ではダメ
9
説明可能性が必要
誰が変更したか
なぜ変更したか
誰が承認したか
ログは残るか
再発防止は
監査可能か


## p.10

©️JPYC Inc.
なぜ外部委託したか
10
内製だけでは厳しかった
必要だったもの
現実
24H365D 運用
採用難
金融知見
少人数
ブロックチェーン知見
当局対応
時間制約


## p.11

©️JPYC Inc.
シンプレクス株式会社を選択
11
✔暗号資産交換業の実績
✔AWS 知見
✔金融システム運用経験
✔当局対応経験
金融システムとして説明可能な体制


## p.12

©️JPYC Inc.
システム体制イメージ
12
JPYC の統制
シンプレクスの開発・運用
AWS のクラウドインフラ
自主規制団体
金融庁
外部サービス
ブロックチェーン
多数の関係者


## p.13

©️JPYC Inc.
AWS 採用理由
13
✔スピード
✔説明可能性
✔金融対応成熟度
大きく3 つ


## p.14

©️JPYC Inc.
FISC 対応の現実
14
300 超の項目
対応状況は
今後の対応は
責任範囲は
統制基準
独自基準
設備基準


## p.15

©️JPYC Inc.
外部委託先管理
15
✔財務状況
✔組織体制
✔セキュリティ対策
✔インシデント対応
✔第三者認証
確認項目の例


## p.16

©️JPYC Inc.
AWS の情報公開が強かった
16
✔FISC 対応情報
✔AWS Artifact
✔SOC
✔ISO
✔各種ホワイトペーパー
ゼロから作らなくてよかった


## p.17

©️JPYC Inc.
AWS Artifact
17


## p.18

©️JPYC Inc.
AWS で統制を実装
18
Amazon Cognito
Amazon GuardDuty
AWS CloudHSM
AWS Key Management 
Service (AWS KMS)
AWS Secrets Manager
AWS Security Hub
AWS Identity and Access 
Management (IAM)
AWS CloudTrail
AWS Config
AWS IAM Identity Center 
ID / アクセス権限
データ保護
検知/ 対応
Amazon Detective


## p.19

©️JPYC Inc.
FISC 対応事例：外部接続と出口対策
19
AWS Cloud
外部接続先
Internet gateway
Internet
Virtual private cloud (VPC)
Public subnet
Amazon Elastic Container 
Service (Amazon ECS)
NAT gateway
AWS Network Firewall
Endpoints
Private subnet
Public subnet
EKYC サービス
AML/CFT サービス
銀行入出金サービス
不正侵入防止（実14）
固定パブリックIP 化
FQDN 制御


## p.20

©️JPYC Inc.
FISC 対応事例：システム運用時のアクセス制御
20
AWS Cloud
セキュリティルーム
Virtual private cloud (VPC)
Private subnet
専用端末
AWS Management
Console
AWS Systems Manager
担当者
担当者
Instance
DB instance
責任者
アクセス
承認
AWS Identity and Access 
Management (IAM)
Okta
連携
運用手続き・体制の明確化（実36, 37）
不正侵入防止（実14, 15）
アクセス履歴の管理（実10）
不正プログラム対策（実20-22）
本人確認機能（実8）
アクセス権限管理（実25, 27）
AWS CloudTrail
AWS Config
Amazon Simple Storage 
Service (Amazon S3)
運行状況の監視体制（実46）


## p.21

©️JPYC Inc.
我々が得た学び
21
✔金融では説明可能性が重要
✔外部委託は能力調達
✔AWS は統制面も強い
✔スピードと統制は両立可能


## p.22

©️JPYC Inc.
金融リファレンスアーキテクチャ
22
https://github.com/aws-samples/baseline-
environment-on-aws-for-financial-services-institute


## p.23

©️JPYC Inc.


## p.24

本セッションのアンケートへ
ご協力をお願いします
Please give us your feedback
Thank you!
IND230
