---
title: "パルグループのインシデント対応 －サイバー攻撃という最大の危機を AWS 移行で乗り越えた 経営判断－"
category: "パートナーセッション"
sponsor: "TOKAI Communications"
session_id: "PRT210"
pages: 19
topics: ["セキュリティ", "マイグレーション/モダナイゼーション", "運用/SRE"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/パートナーセッション/パルグループのインシデント対応 －サイバー攻撃という最大の危機を AWS 移行で乗り越えた 経営判断－ (sponsored by TOKAI Communications).pdf"
---
# パルグループのインシデント対応 －サイバー攻撃という最大の危機を AWS 移行で乗り越えた 経営判断－


## p.1

PRT210-S
守山宗行
株式会社パルグループホールディングス
IT統括室リーダー
パルグループのインシデント対応
－サイバー攻撃という最大の危機をAWS 移行で乗り越えた
経営判断－(sponsored by TOKAI Communications)
渡邉直秀
株式会社TOKAIコミュニケーションズ
法人営業本部西日本事業部
営業一部首席主幹


## p.2

TOKAICOMのAWSソリューション
TOKAICOMについて
お客様の目指すゴールまで
ひたむきに、真摯に。
一緒に悩み、寄り添いながらどこまでもサポート
するのがTOKAIコミュニケーションズです。
株式会社TOKAIコミュニケーションズ
法人営業本部
西日本事業部
主席主幹
渡邉
直秀
自己紹介
はじめに
1


## p.3

セッション概要
3COINSやCIAOPANICなどを運営する株式会社パルグループ
ホールディングスを襲ったサイバー攻撃の全容と、2ヶ月という
短期間での復旧プロセスを Step by Step で解説します。
オンプレ等の選択肢から AWS へ全面移行することを決断した経
営判断の理由、そこから見えた AWS のメリットも解説。
「侵入は防げない」を前提に、被害最小化の設計・改ざんできな
いバックアップ・継続的なセキュリティー運用などの重要性をお
伝えします。
2


## p.4

パルグループのインシデント対応
サイバー攻撃という最大の危機を
AWS 移行で乗り越えた経営判断
3


## p.5

パルグループ会社紹介
4


## p.6

会社名：株式会社パルグループホールディングス
事業内容：アパレル、雑貨の企画・製造・販売
連結売上高：2,347 億円（2026 年2月期）
従業員数
4,441 名
（ほか、平均臨時雇用者数
3,336 名）
店舗数
1,151 店舗
アプリ会員数
1,355 万人
SNS総フォロワー数
2,472 万人
会社紹介
パルグループ
株式会社倉敷スタイル
株式会社P.M.フロンティア
■
■
■
■
■
■
■
5


## p.7

ブランドの紹介
パルグループ
BEARDSLEY
CAPRICIEUX LE'MAGE
Chico
CIAOPANIC
CIAOPANIC TYPY
COLLAGE
COLONY2139
DISCOAT
DOUDOU
Drawing Numbers
earPAPILLONNER
earthy_
6


## p.8

ブランドの紹介
GALLARDA GALANTE
GALLARDAGALANTE OUTLET
IACUCCI
Kastane
La boutique BonBon
Lattice
LOUNGEDRESS
Lui's
mystic
Omekashi
PAL GROUP OUTLET
prose verse
パルグループ
7


## p.9

RIVE DROITE
russet
RAY CASSIN
salut!
SHENERY
un dix cors
un dix cors OUTLET
Whim Gazette
WHO'S WHO gallery
w closet
3COINS
ブランドの紹介
パルグループ
8


## p.10

9


## p.11

TOKAICOMはどのように
この緊急事態の復旧を
支援していったのか
10


## p.12

TOKAICOMのミッション
AWS環境でいかに早く業務システムを提供できるか
1
サイバー攻撃の中最短で最善な環境を提供できるか
2
将来的にも対策を講じたセキュアなインフラ環境を
提供できるか
3
11


## p.13

TOKAICOMはどのように復旧を支援していったのか
6/17 〜
原因究明＆封じ込め
・個人情報保護委員会へ報告（
6/17）
・警察へ報告（
6/21）
・プレスリリース発表
・NW 対応を同時並行で実施
・フォレンジック調査、エンドポイント対応侵入経路の特定を急ぐ
〜7/6
AWS 環境構築
ｼｼｼｼｼｼｼｼｼｼへ環境引渡
TOKAICOM によるAWS環境整備
短期間で構築を行い、システム
ベンダーへ引き渡しを行いました。
7/22 〜8/2
全端末の再設定
マルウェア感染の恐れがある全PCの
再キッティングと安全確認を実施し、
システム接続の準備を整えました。
8/5
新環境の公開
販売管理ｼｼｼｼ再稼働
6/16
インシデント発生
調査、システム検証、
経営層への説明資料作成。
販売管理システム、POSシステム、
RFIDサーバ、ADサーバを含む
重要システムを同時公開
Step1
AWS環境整備
Step2
業務復旧
Step3
セキュリティ強化
Step4
DR対策・復旧訓練
12


## p.14

まとめ
予防・検知
復旧
継続的運用
・最小権限の原則としてきめ細やかな管理
IAM、MFA、KMSなど
・操作範囲、影響範囲の隔離
Security Group、WAF、NW FWなど
・全操作ログの取得、不可逆な監査ログの取得など
CloudTrail、Guard Duty, Security Hub、Control Tower, Configなど
・バックアップデータがイミュータブルであること
S3 object lock、Backup Vault lockなど
・リストア環境
Multi-AZなど壊された後にも迅速に戻せる環境
・復旧テストと継続改善サイクル
教育、訓練、インシデント発生時のフローの明確化
・運用フェーズでの継続対策
構成変更の監査、自動チェック
13


## p.15

まとめ
AWSは侵入を前提に予防・検知、復旧に対応するサービスが
揃っている
1
「侵入を完全に防ぐことはできない」を前提に、侵入されても
被害を抑制し、確実に復旧できる状態が作れていることが重要
2
インシデント対策は、特定の準備をすれば完了ではなく
継続的な運用が最も重要
3
14


## p.16

今回も肝となった通信サービス
15
AWS DirectConnect
東京 収容局ｘ２
AWS DirectConnect
大阪収容局ｘ2
要件に合致した
ハイブリッド運用
オンプレとクラウドとの接続を
最適な環境での接続
リスク分散
災害やサイバー攻撃など
リスク分散構成での接続
BCP対策
災害時でも事業継続可能な
冗長回線での接続
費用対効果
コスト削減と拡張性の両立
の為の安価で高品質な接続
Networking Consulting Competency
Amazon Direct Connect Delivery
■AWS閉域接続回線2,300回線超の実績
■四国／西日本エリアでも大阪で冗長接続が一早く可能に
15


## p.17

弊社がAWS接続・環境サーポートするお客様の一部
16


## p.18

お問い合わせ先
17
自社ヘルプデスク
24/365
運用保守
AWS接続実績
国内
トップクラス
オンプレとAWS
ハイブリッド
環境構築に対応
contact-biz@tokai-grp.co.jp
https://www.cloudsolution.tokai-com.co.jp/contact/
東京・静岡・名古屋・大阪・岡山にある拠点から全国どこでも対応します！
Email
URL
こちらのQRコードより
以下資料を無料で閲覧いただけます
・会社紹介
・サービスカタログ
・導入事例
・ホワイトペーパー
お問い合わせはこちら


## p.19

本セッションのアンケートへ
ご協力をお願いします
Please give us your feedback
Thank you!
PRT210-S
