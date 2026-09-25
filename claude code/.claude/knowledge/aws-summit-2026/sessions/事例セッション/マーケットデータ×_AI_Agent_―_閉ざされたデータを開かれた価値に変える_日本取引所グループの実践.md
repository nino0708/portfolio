---
title: "マーケットデータ× AI Agent ― \"閉ざされたデータ\"を\"開かれた価値\"に変える 日本取引所グループの実践"
category: "事例セッション"
session_id: "IND244"
pages: 36
topics: ["セキュリティ", "データ分析/基盤", "マイグレーション/モダナイゼーション"]
services: ["AWS Step Functions", "Amazon Q", "Claude", "MCP"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/事例セッション/マーケットデータ× AI Agent ― \"閉ざされたデータ\"を\"開かれた価値\"に変える 日本取引所グループの実践.pdf"
---
# マーケットデータ× AI Agent ― "閉ざされたデータ"を"開かれた価値"に変える 日本取引所グループの実践


## p.1

IND244
マーケットデータ× AI Agent
― "閉ざされたデータ"を"開かれた価値"に変える
日本取引所グループの実践
鈴木智之
株式会社JPX総研
ITビジネス部デジタライゼーション担当課長


## p.2

© 2026 Japan Exchange Group, Inc., and/or its affiliates
株式会社
JPX総研
マーケットデータ×AI Agent ― "閉ざ
されたデータ"を"開かれた価値"に変え
る日本取引所グループの実践


## p.3

© 2026 Japan Exchange Group, Inc., and/or its affiliates
（株）JPX総研
ITビジネス部
デジタライゼーション担当
課長
鈴木
智之
(Tomoyuki, Suzuki)
•
2010 年入社。
•
JPX総研にてデジタル戦略と内製開発を推進。
•
JPX のAWS 基盤「J-WS」、データレイク「J-LAKE」を構築。
•
アーキテクト兼プロジェクトマネージャとしてクラウドネイティブなガバナンスモデル
の設計、金融データ基盤のモダナイゼーションとサービス創出に従事。
#SAA #ギタリスト#日本スピッツ


## p.4

4
© 2026 Japan Exchange Group, Inc., and/or its affiliates
日本取引所グループ（JPX）の会社組織
清算機関
自主規制
商品市場運営
デリバティブ市場運営
データ・デジタル事業
•
2013 年1 月東京証券取引所と大阪証券取引所の経営統合により発足
•
2020 年7 月東京商品取引所を子会社化、「総合取引所」として本格稼働
•
2022 年4 月データ・デジタル関係事業を集約したJPX 総研が事業開始
現物市場運営
株式会社東京証券取引所
株式会社大阪取引所
株式会社東京商品取引所
株式会社日本証券クリアリング機構
日本取引所自主規制法人
株式会社JPX総研


## p.5

5
© 2026 Japan Exchange Group, Inc., and/or its affiliates
JPX総研の設立
JPX総研のビジネスを支えるテクノロジー
多様なマーケット・サービスの積極的な創造
多彩な技術や
手法の選択
柔軟なリソース活用、
多様な人材の活躍推進
共有機能基盤、商品/サー
ビス共通インフラの整備
社内外データの
連携パイプラインの整備
我が国金融・資本市場の
競争力強化
新たなパートナーシップのハブ
市場インフラとして培った
経験の活用


## p.6

6
© 2026 Japan Exchange Group, Inc., and/or its affiliates
JPX の中期経営計画・長期ビジョンとJPX総研の役割
中計2027
ビジネス・プラットフォームの強化
Target 2030
中計2024
第Ⅰステージ
グローバルな
総合金融・情報
プラットフォーム
デジタルイノベーションの協創
総合プラットフォーム化への邁進
着実な推進が
求められる領域
IT 組織基盤の強化・全体最適化
重点テーマ①
信頼性とレジリエンス
の更なる追及
重点テーマ②
多様な市場
ニーズへの対応
重点テーマ③
テクノロジーによる
ビジネス価値創出
AI・クラウド等
技術による改革
変化にいち早く
対応する領域


## p.7

© 2026 Japan Exchange Group, Inc., and/or its affiliates
・
”閉ざされた”データ
・
データの”発見力”
・
”開かれた”価値へ
・
データ利活用基盤
投資判断に使えるデータ
は”増え続ける”
日本市場の魅力は
”見えにくく”なった
本日のアジェンダ
マーケットデータを
取り巻く課題


## p.8

8
© 2026 Japan Exchange Group, Inc., and/or its affiliates
データ利活用基盤


## p.9

9
© 2026 Japan Exchange Group, Inc., and/or its affiliates
JPX が取り扱うマーケットデータ
散在する
データ
JPX が扱うマーケットデータは多様・膨大、各オンプレシステムにて個別管理
データ利活用がJPX のデータ戦略における重要課題
上場会社情報
クオンツ系
マスタ系
クオート
約定値段
バランス
伝統的開示情報
非財務情報開示
マスタ、指数
フロー
オルタナティブ
リアルタイム
リファレンス
相場情報、適時開示


## p.10

10
© 2026 Japan Exchange Group, Inc., and/or its affiliates
データ利活用基盤
“J-LAKE”
2021 年2 月
JPX総研設立
2022 年4 月
2025 年1 月
散在するデータ
オンプレシステムの
老朽化
クラウド活用
データの「民主化」
利活用の推進
データ管理複雑化
ガバナンス強化
多様なマーケット・
サービスの
積極的な創造
データプラットフォー
ムとJPX サービスの
ワンストップ化
情報共有やサービス拡充/
レベル向上に向けた
JPX データプラットフォーム
データ利活用基盤稼働
JPX 統制による
クラウドプラッ
トフォーム
J-WS 稼働


## p.11

11
© 2026 Japan Exchange Group, Inc., and/or its affiliates
データ利活用基盤（J-LAKE）の整備
マーケットデータ
売買・清算等の生データ
上場会社／参加者データ
適時開示等
社内システムデータ
業務DB／ログ等
外部連携データ
サードパーティ等
ⅰ. 社内利用
ⅱ. データ配信サービス
ⅲ. ビジネスパートナー
データ活用文化の醸成
市場・利用者分析基盤
チャネル/データ拡充
新たなデータサービス
パートナー協業
プラットフォーム連携
DATA SOURCE
PLATOFORM
DATA DELIVERY
AWS Lake Formation
ガバナンス& アクセス制御
Data Lake
データ蓄積
Catalog
Metadata 管理
Processing
パイプライン/AI
Quality/Security
品質担保・保護
JPX 統制下で利用可能な
AWS 基盤


## p.12

12
© 2026 Japan Exchange Group, Inc., and/or its affiliates
J-LAKE
アーキテクチャ設計のポイント
クラウド採用による個別最適化選好と
データ散在
データの散在と一元管理の両立
課題
解決の方向性
セキュリティ対策など最新のソリューショ
ンを採用しやすい
鈍重なシステム統合よりもアジリティを優
先したサービス構築計画
サービス間でデータ連携・複製することに
よる時間・リソースの非効率
AWS Lake Formation
×データメッシュ
個別最適化とデータ散在の許容
カタログ管理・アクセス管理を一元的に統合
データは複製を前提とせず、間接参照を許容
※リソースネックとなる場合を除く


## p.13

13
© 2026 Japan Exchange Group, Inc., and/or its affiliates
J-LAKE Data Analytics
J-LAKE
Central 
Governance
J-LAKE
主要アーキテクチャ
Corporate 
data center
J-LAKE Producer
VPC
AWS Transfer Family
AWS Data Sync
AWS Storage Gateway
連携サーバー
生データ
加工済み
(parquet
/iceberg)
AWS Step Functions 
workflow
Other Producer
加工済み
基幹系
システム等
Ingestion/Processing
Amazon 
Quick
Consumer
catalog
catalog
catalog
Consumer / Producer
catalog
catalog
AWS Lake Formation
Provide
Provide
Share
Share
Provide
Share
repair
table
更新履歴
更新イベント
プロデューサー
セントラルガバナンス
コンシューマー
・
・
・
arrownet
AWS Lake Formation によりデータ
メッシュを構成
新規コンシューマーにおけるデータ再利用性
向上
クラウドにおけるデータを一元管理可能
加工済み


## p.14

14
© 2026 Japan Exchange Group, Inc., and/or its affiliates
J-LAKE を利用したデータ利活用の現在
•
Amazon Quick
経営ダッシュボード
業務ダッシュボード
運用系ダッシュボード
•
DCoE ポータル
•
SQLNavi
ⅰ. 社内利用
ⅱ. データ配信サービス
ⅲ. ビジネスパートナー
•
JPXweb（JPX ホームページ）
•
TMI
•
SaaS、ISV 連携
•
FDUA データコンペ
2026/3/3 【第11 回Exchange Café】
ダッシュボードコンペ開催
具体的な活用例・取り組み
100以上


## p.15

15
© 2026 Japan Exchange Group, Inc., and/or its affiliates
“閉ざされた”データ


## p.16

16
© 2026 Japan Exchange Group, Inc., and/or its affiliates
“閉ざされた”データ
投資判断に利用できる情報
構造化
非構造化
定性情報
IR 資料
会見音声
上記の翻訳
オルタナティブ
SNS
特許
位置情報
衛星画像
POS データ
株価
BS/PL
(経済的理由も含めた)
人間の処理能力の限界
多くの銘柄
アナリストの人数の制約
翻訳リソースの制約
処理にかけられる時間が短い
情報量に波がある
情報ソースが分散
売買高
開示資料等
年間15 万件
100 万ページ以上
約27 億株/日
上場企業
約4,000 社
情報量の増加と人間による処理の限界
投資判断に利用できる情報は充実してきている
情報量が人間の処理限界を上回り始めており、個人からプロまで情報処理に苦慮


## p.17

17
© 2026 Japan Exchange Group, Inc., and/or its affiliates
“閉ざされた”価値
調べ切れないので
有名な会社に投資
（日本企業とは限らない）
少数の銘柄に、
資金/関心/売買が
集中しやすく
流動性の偏在は
日本市場の魅力低下
約4,000 社の企業に光があたる
生成AI の活用がブレークスルーとなり得る
不足しているのはデータの“発見力”
情報処理の問題
と
成長資金の流れ


## p.18

18
© 2026 Japan Exchange Group, Inc., and/or its affiliates
データの”発見力”
JPX のAI ソリューション事例
Data for AI
AI for Data
/Agentic
Data Plane
Context
Plane
Control
Plane
Intelligence
LLM
Skills
CLI
AI Agent
API
MCP
Vect
or
meta
-data
UX
WEB
meta
-data
Kno
wled
ge
人がAI で
データを扱い
やすく
AI が”データ
発見者”に


## p.19

19
© 2026 Japan Exchange Group, Inc., and/or its affiliates
データの”発見力”
Data for AI 人がAI でデータを扱いやすく


## p.20

20
© 2026 Japan Exchange Group, Inc., and/or its affiliates
https://pro.jpx-jquants.com/
サインインするとサンプルデータ
の確認及びトライアルデータ
（3 年分程度）の請求が行えます
多様なマーケットデータ
株価や財務情報といった伝統的な
データのほか、信用取引のフロー/
バランスデータやToSTNeT 約定情
報など、多様なデータを配信
マシンフレンドリーな
配信方法/フォーマット
API（JSON）やSFTP（CSV）による
配信で、機械が取得・活用しやすい
データ追加が容易
一度契約いただくと、簡便な手続き
で追加データセットの
サブスクリプションが可能


## p.21

21
© 2026 Japan Exchange Group, Inc., and/or its affiliates
MCP サーバー提供
初学者でも自然言語でプロレベルのデータ分析コードを生成可能
人によるデータ取得手続きの手間
MCP サーバーによるナレッジ提供
課題
ソリューション
API
仕様書
Python
API
仕様書
Python
ナレッジ
MCP
サーバー
MCP
クライアント
localhost
スキーマは？
アトリビュートは？
エンドポイントは？
認証方式は？
Python コードは？
実装されているツール
• エンドポイント検索
• エンドポイント詳細取得
• サンプルコード生成
• FAQ 回答


## p.22

22
© 2026 Japan Exchange Group, Inc., and/or its affiliates
人によるデータ取得手続きの手間
AI による自律API 実行能力提供
課題
ソリューション
j-quants API
j-quants-cli
(Rust CLI)
Claude Code
AI Agent
Claude Code
j-quants API
スキーマは？
アトリビュートは？
エンドポイントは？
認証方式は？
Python コードは？
試行錯誤
最も株価が
変動？
skill
特徴
• J-Quants API V2 の全エンドポイント
• 豊富な出力フォーマット
• パイプ連携時の自動CSV 切替
• シェル補完スクリプト生成
• AI Agent 向けSkills ファイル
• クロスプラットフォーム対応
自然言語による依頼をjquants cli コマンドに変換・実行
AI Agent が自律してデータ分析することが可能に
API 仕様をClaude に教える
Skills に各エンドポイントのパラメータ・出力
例が入っているので、Claude が正しい引数
でcli を実行（トークン節約＋誤用防止）
CLI / Skills 提供


## p.23

23
© 2026 Japan Exchange Group, Inc., and/or its affiliates
2026年4月の株価について、月初から今までで一番激しく価格
が変動した銘柄について知りたい
自然言語でデータ分析を指示
skill が読み込まれる
取引カレンダーで取引日を調べる
↓
ダウンロード対象のデータを調べる
↓
Bulk でダウンロードを実行
↓
Python で上位銘柄を調査
↓
結果対象銘柄の銘柄名称を取得
結果を取得
Agent skill 活用例


## p.24

24
© 2026 Japan Exchange Group, Inc., and/or its affiliates
データの”発見力”
AI for Data/Agentic AI が”データ発見者”に


## p.25

25
© 2026 Japan Exchange Group, Inc., and/or its affiliates
「データの情報が散逸していて探しにくい」というペインへのJPX の回答
データ利用方法を紹介するのレシピ集としてもコンテンツ拡充中
銘柄、開示検索にてAI を活用し探しやすく


## p.26

26
© 2026 Japan Exchange Group, Inc., and/or its affiliates
銘柄検索の高度化
一般的なインデックス検索ではヒット率が低い
言葉のゆらぎが拾えない
AI によるインデックス拡張
課題
ソリューション
上場会社に設定される業種区分は1 社につき1 つ
実際は多くの会社が複数の事業を営んでいる
同じ業種区分でも事業の性質がかなり異なる場合や異
なる業種区分でも同様の事業を営んでいる場合あり
業種区分だけでは上場会社の事業の実態を表しきれて
いない
決算短信での頻出事業タグ
建設, 不動産, 小売, ソフトウェア, コン
サルティング, 自動車, システム開発, ク
ラウド, IT, 飲食, 物流, 食品, 医薬品, 電
子, 投資, 金融, 介護, 銀行, エネルギー, 
医療, アパレル, 人材派遣, …
+
事業タグの英訳
+
会社の通称等
決算短信から
“事業タグ”を抽出
検索ヒット率の向上（事業ベースでも、通称でも）
新たな銘柄との出会い


## p.27

27
© 2026 Japan Exchange Group, Inc., and/or its affiliates
知りたいことをそのまま質問
•
言葉のゆらぎにも対応
•
モバイルなら音声入力が便利
•
試しやすいようサンプル質問も用意
•
ブラウザの標準機能利用可能（翻訳等）
絞込みも簡単に
•
よく使われる絞込み条件を用意（期間指定、
市場区分、業種、開示資料の種別）
•
今後、利用者フィードバックに
より拡張可能
一覧できる分量を理由とともに
•
関連度が高い最大10 件のみ表示
•
生成AI により抽出理由を付加
（ユーザが中身を確認する際の
参考情報を充実）
近年多様化、膨大化する開示資料へのアクセスが課題
”欲しい”開示に届き、”出会えなかった銘柄”に出会えるサービス
AI 開示情報検索サービス「J-LENS」β 版を2025 年12 月に公開


## p.28

28
© 2026 Japan Exchange Group, Inc., and/or its affiliates
検索しない検索
2025/5/12  15:30 
日時
タイトル
会社名
公開項目名
本文
2025 年3 月期決算短信
〇△×株式会社
決算短信（連結・日本基準）
2025 年3 月期決算短信〔日本基準〕(連結)  
…
１．2025 年３月期の連結業績（１）連結経営
成績…
１．経営成績等の概況
（１）当期の経営成績の概況
（当期の経営成績）
１．当期における業績全般の動向
当連結会計年度におけるわが国経済は、…
メタデータ/インデックス
本文から
キーワード抽出
開示資料
“程よく見つかる”
多すぎず少なすぎないヒット率
言葉のゆらぎの問題も‘部分的に解決’
一般的なインデックス検索ではヒット率が低い
本文を用いたテキスト検索ではヒットしすぎる
言葉のゆらぎが拾えない
AI によるインデックス拡張
ベクトル検索で程よく見つかるを高度化
課題
ソリューション
2025/5/12  15:30 
日時
タイトル
会社名
公開項目名
本文
2025 年3 月期決算短信
〇△×株式会社
決算短信（連結・日本基準）
2025 年3 月期決算短信〔日本基準〕(連結)  
…
１．2025 年３月期の連結業績（１）連結経営
成績…
１．経営成績等の概況
（１）当期の経営成績の概況
（当期の経営成績）
１．当期における業績全般の動向
当連結会計年度におけるわが国経済は、…
メタデータ/インデックス
キーワード
雇用や所得環境の改善,米国の通商政策の影
響,就業状況の向上,収入条件の好転, アメリ
カの貿易方針の余波, …
開示資料
辞書


## p.29

29
© 2026 Japan Exchange Group, Inc., and/or its affiliates
メリット・利用シーン
• キーワード検索、ルールベースの検索では難しい以下のような検索も可能
表記ゆれ
•
利上げ/金利上昇/金利引き上げ
•
TOB/公開買付け
否定形の検索
•
決算短信で業績予想の数値を開示していない資料
•
円安について言及しているが、収益への影響は限定的とし
ている資料
数値条件を含む検索
•
配当予想が50 ％以上増加した開示
•
売上高が前年同期比10 ％以上減少した企業
抽象・あいまい表現の検索
•
事業再編に関する方針転換が記載されている資料
•
生成AI の活用に積極的な企業
•
海外展開を発表した企業
投資家・証券会社等
投資判断や調査業務の効率化
•
特定テーマや関心事項に基づく開示資料の横断的な検索
•
定量条件に落とし込みづらい情報の検索
上場会社・コンサル等
資本・経営戦略の検討や自社の開示資料作成
•
他社事例の収集・分析、業界動向の把握
•
新たな施策の検討
検索しない検索
リサーチ体験の進化
メタ情報の追加複数資料を参照
検索意図の自動判別
検索条件の改善提案


## p.30

30
© 2026 Japan Exchange Group, Inc., and/or its affiliates
リサーチ体験の進化への挑戦
β 版の公開後の利用実態を調査
単なる資料検索にとどまらず、企業比較や条件抽出、テーマ横断的な調査など、
分析やインサイト獲得を目的とした多様な用途での利用を確認
2026 年度中にアップデート版のJ-LENS Pro サービスを提供予定
本日はJPX総研のブースにて
試作中のJ-LENS Pro の機能の
一部をお見せいたします！
•
開示資料PDF から、「開示の目的」や株
式数等の「定量情報」、「日程情報」等を
自動抽出
•
検索・分析に活用するとともに、PDF 内の
該当箇所をハイライトし内容理解を支援
PDF からの構造化情報の抽出および
PDF 参照の支援
•
開示資料から、業績に影響する要因を抽
出し、検索に活用検索に活用
•
各社のリスク要因や、特定トピックに対す
る各社の影響度を可視化し、比較・分析
を支援
GraphRAG を活用した検索プロセスの効率化
および業績・リスク要因等の可視化
•
検索内容に応じて、キーワード検索／数
値検索／因果関係に基づく検索などを
自動で選択・組み合わせ
•
ユーザが意識せずとも、最適な検索パター
ンで結果を提示
AI を用いた最適な検索手法の自動選択による
検索効率・精度の向上
PDF
開示目的
影響
定量情報
日程情報
関係者
抽出
ユーザ
検索
・・・
・・・
・・・
業績
PER・・
主なアップデート


## p.31

31
© 2026 Japan Exchange Group, Inc., and/or its affiliates
“開かれた”価値へ


## p.32

32
© 2026 Japan Exchange Group, Inc., and/or its affiliates
AI 時代に求められるデータ
Data for AI
AI for Data
/Agentic
Data Plane
Context
Plane
Control
Plane
Intelligence
LLM
Skill
s
CLI
AI Agent
API
MCP
Vect
or
met
a-
data
UX
WEB
met
a-
data
Kno
wled
ge
人がAI で
データを扱い
やすく
AI が”データ
発見者”に
事業タグ
本文キーワード
QA,スキーマ情報
データが鍵
Quality
Reliablity
Usability


## p.33

33
© 2026 Japan Exchange Group, Inc., and/or its affiliates
新たなサービスと”増え続ける”データ
デジタル化配信
証券バックオフィスデータ配信
次世代TDnet
証券会社向け公表情報のデジタル化・
ワンストップ配信システムをAWS に構築
上場会社の適時開示情報プラットフォーム
の次世代システムをAWS に構築
FY27 上期
FY27 下期


## p.34

34
© 2026 Japan Exchange Group, Inc., and/or its affiliates
JPX の挑戦は続く
“増え続ける”
データ
処理能力の限界
Data for AI
AI for Data
データが鍵
上場企業
4000 社に光
日本市場の
魅力向上
“閉ざされた”データ
データ”発見力”
“開かれた”価値へ


## p.35

Exhibition Booth Information
展示ブースのご案内
A119
株式会社JPX総研
AWS Village①


## p.36

本セッションのアンケートへ
ご協力をお願いします
Please give us your feedback
Thank you!
IND244
