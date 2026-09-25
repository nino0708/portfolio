---
title: "Agentic RAG が切り開く 製造現場語理解の新たな可能性"
category: "事例セッション"
session_id: "AIM336"
pages: 33
topics: ["機械学習/MLOps", "生成AI/エージェント"]
services: ["AWS Glue", "AgentCore", "Amazon Athena", "Amazon Bedrock", "Amazon CloudFront", "Amazon DynamoDB", "Amazon Nova", "Amazon OpenSearch", "Amazon Q", "Amazon S3", "Claude"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/事例セッション/Agentic RAG が切り開く 製造現場語理解の新たな可能性.pdf"
---
# Agentic RAG が切り開く 製造現場語理解の新たな可能性


## p.1

AIM336
Agentic RAG が切り開く
製造現場語理解の新たな可能性
坂倉広也
東洋紡株式会社
TX・業務革新総括部, AIエンジニア


## p.2

Agentic RAG が切り開く製造現場語理解の新たな可能性
東洋紡株式会社
TX・業務革新総括部
坂倉広也
AWS Summit Japan 2026


## p.3

3
自己紹介
入社後、研究所で
マテリアルインフォマティクスを
1 年間推進
製造現場に機械学習を導入する
キャリアの歩み
0
2
3
大学院まで化学を専攻
TX・業務革新総括部
坂倉広也
【趣味】
コーヒーを淹れること、
テニス、ランニング
2024 年東洋紡入社
1
物理化学を専攻
シミュレーションやデータ処理に
プログラミングを活用


## p.4

4
会社名
東洋紡株式会社
代表者
代表取締役社長竹内郁夫
創立
1882 年(明治15 年)5 月3 日
設立
1914 年(大正3 年)6 月26 日
資本金
51,730百万円(2025 年3 月31 日現在)
発行済株式総数
89,048,792 株(2025 年3 月31 日現在)
本社
大阪府大阪市北区梅田一丁目13番1号
大阪梅田ツインタワーズ・サウス
TEL:06-6348-3111
グループ会社
日本21 社、国外30 社
連結従業員数
9,976 名(2025 年3 月31 日現在)
従業員数
3,030 名(2025 年3 月31 日現在)
URL
https://www.toyobo.co.jp/
／会社概要


## p.5

5
／早わかりTOYOBO


## p.6

6
東洋紡で進めているTX（Toyobo Transformation ）とは？
TX（Toyobo Transformation ）とは、
現場の意識や行動、組織風土まで
踏み込んで変えていく取り組み
TX の実践：
生産現場に入り、
現場と一緒に課題を解く
生成AI を紹介して終わりではなく、
現場と一緒に課題を解く
意識・行動の変革
×
組織風土の変革
×
デジタルの力
私たちのアプローチ
現場の困りごと
を聞く
現場で使われている
言葉を理解する
現場の判断に必要
な知識へつなげる
業務が変わること
を一緒に考える


## p.7

7
現場の言葉と文書に残された知識がつながらず、
必要な情報が、必要な人に、必要なタイミングで届きにくい
現状の製造業の一般課題認識
忙しさ
日々の操業・トラブル対応・品質対応が優先
知識を調べる・更新する時間が取りにくい
属人化
ベテランの勘所が会話や作業の中に埋もれやすい
文書化されにくく、次の世代に渡しにくい
複雑化
製品・条件・設備・工程の組み合わせが増えて
おり、特定の詳しい人に負荷が集中しやすい
探せない
どの資料を見ればよいか分からない
現場の呼び方と正式名称がつながらない
伝わらない
ベテランの判断や現場特有の言葉が整理されていない
技能継承や横展開が難しい
活かされていない
日報・トラブル記録・技術文書・BI レポートは蓄積
判断や次の課題解決にすぐ使える形になっていない
知識活用で起こっていること
現場の実態｜知識活用が難しい背景


## p.8

8
本日の問い
生成AI・RAG を入れれば、生産現場の
人が本当に知識活用できるのか？
仮説：RAG を導入するだけでは、現場の期待には届かない可能性がある


## p.9

9
現場調査で見えた4つの要望
1
普段の呼び方で
聞いても通じてほしい
略語・俗称・工場ごとの呼
び方を、文脈から補って理
解する
2
一度教えた言葉を
次に活かしてほしい
使いながら出てくる現場語
を、人の確認を通じて蓄積
する
3
ざっくりした状況から
似た事例を絞ってほしい
検索条件が曖昧でも、AI が
聞き返して情報を整理する
現場が求めているのは、“現場用語と知識をつなぐAI”
現場の言葉を理解し、足りない情報を補いながら、知識へつないでくれるAI
現場の期待：普段の言葉で、必要な知識・データにたどり着きたい
４
使っていくうちに
現場にフィットしてほしい
使いながら出てくるユース
ケースや現場語に適した
回答になっていってほしい
目標


## p.10

10
1
4
3
2
課題と取り組み①②③④
普段の呼び方で
聞いても通じる
一度教えた言葉を
次に活かす
ざっくりした状況から
似た事例を絞る
使っていくうちに
現場にフィットする
現場用語の
認識精度向上
対話型検索
エージェント
活用ログによる
改善サイクル
Human-in-the-loop で
用語を蓄積する


## p.11

11
推進体制
SCP 等の基盤管理
PoC の実験支援
セキュリティ・ガバナンス
エージェント設計・構築
現場課題の定義・検証
データ提供・評価
アーキテクチャ支援
エージェント開発支援
LLM 開発支援
×
×
アマゾンウェブサービス
ジャパン合同会社


## p.12

12
取り組み①：現場用語理解の精度を上げる
現場の知識の回答精度を上げる
1
現場用語の
認識精度向上
作業員
普段の呼び方で聞いても通じてほしい
AI
現場用語で意思疎通
略語・俗称・工場ごとの呼び方を、文脈から補って理解する
Amazon Bedrock
Knowledge Base
Amazon OpenSearch
Serverless
Amazon S3
(Source Documents)
現場作業員とAI が現場用語で会話する
1-1.  Simple RAG
1-2. 精度向上


## p.13

13
現場用語認識精度評価方法
取り組み①：現場用語理解の精度を上げる
評価タイプ
「Amazon Bedrock Evaluations 」（LLM-as-a-Judge で自動採点）
評価対象
データ数111
モデル設定
Evaluator（Judge ）
：us.anthropic.claude-3-7-sonnet-20250219-v1:0
Generator（回答生成）：us.anthropic.claude-3-7-sonnet-20250219-v1:0
比較した要素（アブレーション）
検索方式
：Semantic / Hybrid（キーワード＋ベクトル）
取得件数（top-k ）：5 / 60
主要指標（平均スコア0 〜1 ）
Correctness（正確性）
Amazon Web Services, Amazon Bedrock の新しいRAG 評価機能とLLM-as-a-Judge 機能, AWS公式ブログ（日本語）, 2025-01-15.
Danilo Poccia, New RAG evaluation and LLM-as-a-Judge capabilities in Amazon Bedrock, AWS Blog, 2024-12-01.


## p.14

14
1
4
3
2
現場用語の壁
検索ノイズの壁
継続改善の壁
取り組み①-1 : 現場用語理解の精度= 50 % 【無関心期】
仮説
現場用語を入れて精度を50 % まで上げても【無関心】
現場から否定的だったSimple-RAG
精度50 % で現場がLLM の利用に関心を持つ？
行動を変える労力に見合わない
現場から使えないだろうの否定的な声
1. 現場用語集の整理
2. 社内文章をAmazon Bedrock Knowledge Bases に入れてRAG 構築
工夫
結果
😢


## p.15

15
取り組み①-2 : 現場用語理解の精度= 80 % 【関心期】
仮説
独自用語に対応するため、検索方式と取得件数の見直しを行った
独自単語は“数字とアルファベット”の組み合わせなので、セマンティックでは不十分？？
改善1：ハイブリッド検索を明示
工夫
0.86
0.57
0.45
0.2
0.4
0.6
0.8
1.0
初期
ハイブリッド
取得件数
拡張後
初期ではセマンティック検索を採用
精度が50 % に届かない
正確性：0.45 → 0.57
明示的にハイブリッド検索を指定した。
（キーワード検索＋セマンティック検索）
“AB-1” のような略語で、工場・工程・製品などを表記
Sawarkar & Solanki, "Blended RAG," IEEE MIPR 2024.


## p.16

16
取り組み①-2 : 現場用語理解の精度= 80 % 【関心期】
仮説
単語の文脈を習得するためのデータソースが不十分？？
改善2：取得ソース数を5 → 60 に拡張
工夫
0.86
0.57
0.45
0.2
0.4
0.6
0.8
1.0
初期
ハイブリッド
取得件数
拡張後
デフォルトソースは5 ソースに設定
単語の文脈がつかめない
正確性：0.57 → 0.86
明示的に取得ソース数上限を60 に拡張
「AB-1 でトラブル発生、XX時に対応」だけでは、AB-1 が何を指すのか、
どんな異常だったのかが分からない
Asai et al., "Self-RAG: Learning to Retrieve, Generate, and Critique," ICLR 2024 (Oral).
独自用語に対応するため、検索方式と取得件数の見直しを行った


## p.17

17
1
検索ノイズの壁
取り組み①-2 : 現場用語理解の精度= 80 % 【関心期】
精度を80 % まで上げ、【関心期】へ、データ活用・蓄積の意識が変わった
使えそうの声、加えてデータ構造へ問題意識が芽生える
結果
結果まで入力すれば良い回答が出てきそうだね
当時どういう現象かの記録も必要だね
😄
仮説
精度向上により意識改革が行われた
精度がもっと上がれば関心をもってくれる？
改善1 : ハイブリッド検索の明示
改善2 : 取得ソース数の拡張
工夫


## p.18

18
1
現場用語の壁
未知の用語が次々出る
✓用語認識精度
検索ノイズの壁
単語が増えるとノイズも増える
継続改善の壁
改善を回す仕組みがない
取り組み①-2 : 現場用語理解の精度= 80 % 【関心期】
精度向上の次の課題
新たな課題
精度80 %
検索改善
無関心期
関心期
実践期
精度50 %
Simple RAG
？？？？
現場定着


## p.19

19
現場知識が育つエージェントとして再設計する
【転換】精度検証から見えた壁を解くための再設計
単なる検索機能から、現場と対話しながら賢くなる仕組みへ再設計する。
従来聞いて・探して・答える
一方向の検索体験
→
新方針
現場の言葉を理解し、確認し、蓄積し、改善に戻す
Human-in-the-loop で、誤った知識の蓄積を防ぐ
1
聞く
状況・目的を
確認する
→
2
理解する
現場用語を
解釈する
→
3
確認する
未知の用語は
人に聞く
→
4
検索する
類似事例・
関係資料へ
→
5
蓄積する
用語DB ・ログに
反映する
→
6
改善する
検索設計へ
戻す
目指す姿
一度教えた言葉は次から通じ、ざっくりした状況からでも似た事例にたどり着ける
現場の使われ方そのものを、RAG 改善の入力にする。
An et al., "Golden-Retriever: Agentic RAG for Industrial Knowledge Base," arXiv:2408.00798, 2024.
Singh et al., arXiv:2501.09136, 2025.


## p.20

20
Knowledge Base
Analytics
Dashboard
Amazon CloudFront
Amazon Cognito
Amazon DynamoDB
(Chat History)
Amazon Bedrock
Knowledge Base
Amazon OpenSearch
Serverless
Amazon S3
(Source Documents)
Amazon Bedrock
Amazon DynamoDB
(Terminology)
Amazon Athena
AWS Glue
Data Catalog
Amazon S3
(Data Lake)
Amazon Quick
Amazon Simple Email 
Service (Amazon SES)
Users
AWS Cloud
Amazon Bedrock
(Amazon Nova)
Authenticated 
user
エージェント基盤の構成図
Amazon Bedrock AgentCore Runtime
AgentCore
Memory


## p.21

21
取り組み②：Human-in-the-loop で用語を蓄積する
AI が勝手に学ぶのではなく、人と一緒に現場知識を育てる
２
Human-in-
the-loop で
用語を蓄積する
未知語が
出る
AI が
候補提示
人が
確認・承認
用語DB へ
蓄積
Bedrock AgentCore
Amazon DynamoDB
(Terminology)
Amazon SES
最初からすべて集め切ることはできない
実際に使ってもらう中で、初めて出てくる言葉がある
Agent が
育つ


## p.22

22
Knowledge Base
Analytics
Dashboard
Amazon CloudFront
Amazon Cognito
Amazon DynamoDB
(Chat History)
Amazon Bedrock
Knowledge Base
Amazon OpenSearch
Serverless
Amazon S3
(Source Documents)
Amazon Bedrock
Amazon DynamoDB
(Terminology)
Amazon Athena
AWS Glue
Data Catalog
Amazon S3
(Data Lake)
Amazon Quick
Users
AWS Cloud
Amazon Bedrock
(Amazon Nova)
Authenticated 
user
エージェント基盤の構成図
Amazon Bedrock AgentCore Runtime
AgentCore
Memory
Amazon Simple Email 
Service (Amazon SES)


## p.23

23
Knowledge Base
Analytics
Dashboard
Amazon CloudFront
Amazon Cognito
Amazon DynamoDB
(Chat History)
Amazon Bedrock
Knowledge Base
Amazon OpenSearch
Serverless
Amazon Bedrock
Amazon DynamoDB
(Terminology)
Amazon Athena
AWS Glue
Data Catalog
Amazon Quick
Amazon Simple Email 
Service (Amazon SES)
Users
AWS Cloud
Amazon Bedrock
(Amazon Nova)
Authenticated 
user
Amazon Bedrock AgentCore Runtime
AgentCore
Memory
エージェント基盤の構成図
一度教えた言葉は、次の検索や
回答に活かす仕組み
Mosqueira-Rey et al., "Human-in-the-loop ML: a state of the art," 
AI Review, 2023..
2.  用語を蓄積ワークフロー
ユーザー：「○○で油漏れ異常が出た」
登録された
言い換えを含め検索
過去文書から言い換え候補を逆引き
ユーザー：確認・修正
Agent：「登録しますか？」
登録→ DB 書き込み+ 管理者通知
次回以降、全Agent・全ユーザー
に即時反映
用語
言い換え表現
状態
油漏れ
（候補: オイル漏れ、OL ）
？要確認
Agent：用語辞書を検索
未登録の場合
登録済の場合
油漏れ異常
油漏れで検索...
オイルリークで検索...
OL で検索...
油漏れの言い換えは
オイルリーク？？
OL とも言います
辞書に登録しまか？
油漏れ異常
登録します


## p.24

24
取り組み③：対話で検索前の問いを整える
広い探索空間でも、対話で最適解に近づける
３
対話型検索
エージェント
ざっくりした
相談
AI が聞き返す
いつ/ どこ/ 何が
人が回答
検索前の問いを
整える
真に求めている
資料・回答
Amazon Bedrock AgentCore


## p.25

25
Knowledge Base
Analytics
Dashboard
Amazon CloudFront
Amazon Cognito
Amazon DynamoDB
(Chat History)
Amazon Bedrock
Knowledge Base
Amazon OpenSearch
Serverless
Amazon S3
(Source Documents)
Amazon Bedrock
Amazon DynamoDB
(Terminology)
Amazon Athena
AWS Glue
Data Catalog
Amazon S3
(Data Lake)
Amazon Quick
Users
AWS Cloud
Amazon Bedrock
(Amazon Nova)
Authenticated 
user
エージェント基盤の構成図
Amazon Bedrock AgentCore Runtime
AgentCore
Memory
Amazon Simple Email 
Service (Amazon SES)


## p.26

26
Analytics
Dashboard
Amazon CloudFront
Knowledge Base
Amazon Cognito
Amazon DynamoDB
(Chat History)
Amazon Bedrock
Knowledge Base
Amazon OpenSearch
Serverless
Amazon Bedrock
Amazon DynamoDB
(Terminology)
Amazon Athena
AWS Glue
Data Catalog
Amazon Quick
Amazon Simple Email 
Service (Amazon SES)
Users
AWS Cloud
Amazon Bedrock
(Amazon Nova)
Authenticated 
user
Amazon Bedrock AgentCore Runtime
AgentCore
Memory
エージェント基盤の構成図
3. 対話型検索エージェントワークフロー
ユーザー：「○○で△△異常が出た」
結果を整理して提示（評価を通過したもののみ）
Agent：情報を探索
自己修正・自律的探索ループ
Action （質問）: 
ユーザーに状況を確認
- いつ, どこ, 何が…etc.
Thought : 
切り口を変える（3 回まで）
ユーザーに追加質問
情報不足
Action（検索）: 文書検索を実行
- 文章に優先度を付与
Observation : 結果を評価
ループ終了
検索可能
十分
不十分
Thought : 
現在の情報で何を検索すべきか判断する
膨大な文書の中から、
より求めている情報を提示可能に
Mo et al., "ConvGQR: Generative Query Reformulation for Conversational Search," ACL 2023.


## p.27

27
取り組み④：活用ログで改善サイクルを回す
チャット
ログ
傾向
分析
不足知識
発見
Agent
改善
監視をAmazon Nova のNova 2 Lite に任せることで、
監視コストを削減
作って終わりではなく、使われ方から学び続ける
よく聞かれる質問・不足データ・想定外ニーズを改善へ戻す
４
活用ログによる
改善サイクル
どのような質問が多いのか
どの業務フローで使われているのか
どのデータソースが不足しているのか
想定外の業務ニーズが出ていないか
Amazon Bedrock
(Amazon Nova)
Amazon Bedrock AgentCore
Amazon Quick
Amazon DynamoDB
(Chat History)
Shukla et al., "Adaptive Data Flywheel: Applying MAPE Control Loops to AI Agent Improvement," EACL 2026 (Industry).
Zhao et al., "Agent-in-the-Loop: A Data Flywheel for Continuous Improvement in LLM-based Customer Support," EMNLP 2025 (Industry).
global.amazon.nova-2-lite-v1:0


## p.28

28
RAG を“現場知識が育つ仕組み”へ拡張する
結果
現場用語の壁
普段の呼び方と文書中の表現がずれ
ると、必要な情報にたどり着けない
検索ノイズの壁
文書を増やすほど、関連情報だけ
でなく関係の薄い情報も増える
継続改善の壁
使われる中で見えてくる新しい言葉
や不足資料を改善に戻す必要がある
壁：RAG を入れるだけでは、現場用語・検索ノイズ・継続改善の課題が残る
Amazon Bedrock AgentCore を使って、
現場の言葉を理解し、確認し、蓄積し、改善していく仕組みとして再設計


## p.29

29
1
4
3
2
現場用語の壁
検索ノイズの壁
継続改善の壁
成果
精度80 %
検索改善
無関心期
関心期
精度50 % 
Simple RAG
無関心期から関心期への変化
無関心期から関心期、そして実践期へ
50 % 
80 % 
精度改善後
検索方式の見直し・取得ソースの拡張
現場認識精度向上
データを残すこと・表記をそろえる
ことがAI 回答品質に繋がると認識
現場意識の変化
Simple RAG 導入時
現場用語認識精度が不十分
このままでは使えないだろう


## p.30

30
成果
1 か月の先行指標
利用率
80 %+
継続利用率
60 %+
有用回答率
70 %+
承認済み用語
10 件/月
関心を持ったユーザー数
120 +
4
Agentic RAG
1
4
3
2
現場用語の壁
検索ノイズの壁
継続改善の壁
精度80 %
検索改善
無関心期
関心期
実践期
精度50 % 
Simple RAG
Agentic 
RAG
現場定着
現場が使い、言葉を教え、知識を残し、その結果AI がさらに改善する循環が回り始めた


## p.31

31
意味：AI が使えると、現場がデータを残す意味を感じ始める
使えると
感じる
残す意味が
分かる
データ品質
が
上がる
AI が
改善する
使えるAI は、データを残す行動を
変えるきっかけになる
TX（Toyobo Transformation ）とは、
現場の意識や行動、組織風土まで
踏み込んで変えていく取り組み
意識・行動の変革
×
組織風土の変革
×
デジタルの力
Agentic RAG は、単なる検索ツールではありません
現場の知識を使える形に変え、属人化の解消に向けた第一歩になった
TX の実践：
生産現場に入り、
現場と一緒に課題を解く


## p.32

©️TOYOBO CO., LTD. All rights reserved.


## p.33

本セッションのアンケートへ
ご協力をお願いします
Please give us your feedback
Thank you!
AIM336
