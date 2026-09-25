---
title: "MMO 戦略シミュレーションゲーム 『三國志 覇道』における Amazon Bedrock を 用いたチャット等リアルタイム翻訳事例"
category: "事例セッション"
session_id: "AIM118"
pages: 46
topics: ["生成AI/エージェント"]
services: ["Amazon Aurora", "Amazon Bedrock", "Amazon EC2", "Amazon Nova", "Claude"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/事例セッション/MMO 戦略シミュレーションゲーム 『三國志 覇道』における Amazon Bedrock を 用いたチャット等リアルタイム翻訳事例.pdf"
---
# MMO 戦略シミュレーションゲーム 『三國志 覇道』における Amazon Bedrock を 用いたチャット等リアルタイム翻訳事例


## p.1

AIM118
MMO 戦略シミュレーションゲーム
『三國志覇道』におけるAmazon Bedrock を
用いたチャット等リアルタイム翻訳事例
冨士田智仁
株式会社コーエーテクモゲームス
エンタテインメント事業部
シブサワ・コウブランドシニアリーダー


## p.2

MMO戦略シミュレーションゲーム
『三國志覇道』における
Amazon Bedrockを用いたチャット等リアルタイム翻訳事例
©コーエーテクモゲームスAll rights reserved.
株式会社コーエーテクモゲームス
エンタテインメント事業部
シブサワ・コウブランド
冨士田智仁


## p.3

本日のお話概要
『三國志覇道』における生成AI を用いたゲーム内チャットの翻訳を
テーマに、導入事例をご紹介します
時系列にやっていったことを説明(検討段階～リリース後まで)
まとめ
タイトルのご紹介＆翻訳機能が必要になった背景
©コーエーテクモゲームスAll rights reserved.


## p.4

『三國志覇道』のご紹介
「攻城戦」(GvG)を繰り返し、中華統一を目指す
ユーザー同士のチャットなどでのコミュニケーションが重要
※画面はイメージです
©コーエーテクモゲームスAll rights reserved.
2020 年9 月日本語版・2021 年7 月繁体字版リリース(別サーバー)
MMO 戦略シミュレーションゲーム


## p.5

『混合サーバー』を作りたい
日本語版と繁体字版のサーバーを統合し、
ユーザーの対戦相手・ライバル・仲間に変化を出したい！
同じサーバーで遊べる『混合サーバー』を登場させよう
チャットなどユーザー同士のコミュニケーションが
大切なゲームだから、言語の壁を超える必要がある
気軽に翻訳できなければ
統合の意味がない！
©コーエーテクモゲームスAll rights reserved.


## p.6

みなさんなら、どうしますか？
『三國志覇道チーム』では、この順でやりましたよ
という事例をご紹介していきます
どの順に手を動かしたかわかりやすいように
時系列に並べてあります
そのため、話題があちこち飛んでしまうことを、
あらかじめご了承ください
みなさんのチームに、こんなお題がやってきたら、
どの順で手を動かしていきますか？
©コーエーテクモゲームスAll rights reserved.


## p.7

翻訳API の一次選定
・ランニングコスト
・翻訳精度
・導入難易度(実装コスト)
まずは、翻訳API を一次選定をして候補を絞り込もう
Amazon Translate
Amazon Bedrock (Anthropic Claude 3 Haiku モデル)
©コーエーテクモゲームスAll rights reserved.
担当のソリューションアーキテクト(SA)さんからご提案頂いたのが
「生成AI」


## p.8

タスクの列挙と作業割り振り
▼プログラマー担当
・翻訳機コアを除いた外側の仕組みの実装
・翻訳API の検証と決定
・翻訳機コアの実装
タスクを洗い出して、
プログラマーとプランナーで作業を割り振ろう
▼プランナー担当
・生成AI 使用は使っていいのか？リスクはないのか確認
・ゲーム側の仕様策定(※本セッションでは触れません)
・画面レイアウト策定(※本セッションでは触れません)
©コーエーテクモゲームスAll rights reserved.


## p.9

法務部への確認
法務部への確認
・翻訳機として生成AI を使うけど、法務リスクはないのか？
・ユーザーのチャット情報を外部送出することになる
・社内の機密情報的漏洩リスクは少ない
・著作権上の問題が起こるリスクは少ない
・ユーザー入力を外部サーバーや第三者に送信する場合、
プライバシーや通信秘密を守れる環境なのか、確認する必要あり
・利用許諾契約に外部送出に関して、加筆が必要である
©コーエーテクモゲームスAll rights reserved.


## p.10

法務部への確認
Amazon Bedrock は、プロンプトやAI のレスポンスを
AWS モデルのトレーニングに使用したり、第三者に配布しない
プライバシーや通信秘密を守れる環境なのか？
※ https://aws.amazon.com/jp/bedrock/faqs/ より抜粋
©コーエーテクモゲームスAll rights reserved.


## p.11

翻訳機コアを除いて外側から実装
【前提】システム構成図(一部省略・抜粋)
AWS Cloud
Mobile client
Virtual private cloud (VPC)
Amazon EC2 instance contents
Amazon Aurora
Batch
Server
Socket
Server
Application
Server
Elastic Load Balancing
Request To Server
Push To Client
©コーエーテクモゲームスAll rights reserved.
Amazon Translate
Amazon Bedrock
OR
Part to Add


## p.12

翻訳機コアを除いて外側から実装
【前提】チャット関連のテーブル構成(一部カラム抜粋)
シンプルなチャット発言内容格納テーブル
id
user_id
message
create_time
1
1234
お手合わせ、ありがとうございます
2025-03-28 15:03:01
2
5678
最後惜しかったわぁ
2025-03-28 15:03:22
3
1234
ギリギリ守り切りました
2025-03-28 15:03:38
4
5678
それな
2025-03-28 15:03:45
5
1234
あと1 分あったらヤバかったっすね
2025-03-28 15:03:58
テーブル名:Chat
©コーエーテクモゲームスAll rights reserved.


## p.13

翻訳機コアを除いて外側から実装
既存のテーブルには原則的に手を入れないで、新規テーブルを追加
// 既存の処理への影響を最小限にしたい
// レコード数が多いため、カラム追加はメンテナンス時間への懸念
実装方針(テーブル設計)
「仮翻訳済みテキスト」とだけ返すようにしておく
// 翻訳機コアの実装には時間がかかるし
// 分業しやすい場所なのでとりあえず置いておく
翻訳機コアの実装までの間は…
©コーエーテクモゲームスAll rights reserved.


## p.14

翻訳機コアを除いて外側から実装
翻訳結果格納用のテーブルを追加(一部カラム抜粋)
・未翻訳をSELECT して翻訳機に掛ける
・翻訳出来たら、翻訳後文字列を格納する
type
type_param
lang_settng
message
lang_tr
message_tr
status
1
1
0(日本語)
お手合わせ、
ありがとうございます
1(繁体字)
仮翻訳済みテキスト
2(翻訳済)
1
2
0(日本語)
最後惜しかったわぁ
1(繁体字)
仮翻訳済みテキスト
2(翻訳済)
1
3
0(日本語)
ギリギリ守り切りました1(繁体字)
仮翻訳済みテキスト
2(翻訳済)
1
4
0(日本語)
それな
1(繁体字)
仮翻訳済みテキスト
2(翻訳済)
1
5
0(日本語)
あと1分あったら
ヤバかったっすね
1(繁体字)
1(未)
テーブル名:ChatTranslation
©コーエーテクモゲームスAll rights reserved.


## p.15

翻訳機コアを除いて外側から実装
・翻訳用のバッチ処理を新規追加
// 翻訳に時間がかかるor 失敗してもチャットのスムーズさは失われない
// スイッチ入れておけば自動で翻訳済み文字列が表示されるようにしたい
// 発言の横にある翻訳ボタンを都度押すタイプではない
・翻訳されていない翻訳対象文言があれば、翻訳かけてテーブルに結果格納
・テーブルに格納されたら、クライアントにPUSH する仕組み
実装方針の決定(バックエンド)
※スイッチ入れておけば自動で翻訳するタイプ
※翻訳するボタンが発言毎についているタイプ
©コーエーテクモゲームスAll rights reserved.


## p.16

翻訳機コアを除いて外側から実装
ここまで実装完了
外堀は埋まったので、あとは翻訳機コア部分を詰めていこう
※日本語版クライアント
※繁体字版クライアント
※画面はイメージです
©コーエーテクモゲームスAll rights reserved.


## p.17

翻訳機コアはとりあえずAmazon Translate で実装
まずは、Linux コンソール上でも簡単に呼び出し可能な
Amazon Translate で実装することにした
実装初期のコードスニペット(Linux コマンドをexec で呼び出すスタイル)
©コーエーテクモゲームスAll rights reserved.


## p.18

翻訳API の決定
・Amazon Translate
・Amazon Bedrock (Claude 3 Haiku モデル)
どちらにするのか？
・ランニングコスト
・翻訳精度
両面からどちらにするか決めよう
翻訳機コアを本格的に実装する前に
使用するAPI を確定させたい
©コーエーテクモゲームスAll rights reserved.


## p.19

翻訳API の決定(ランニングコスト)
▼算出のもととなる情報
・1 サーバー(ワールド)・1 ヵ月(30 日)あたりの
・チャットレコード数= 発言数
・Byte 数
・1 発言当たりの推定トークン数
(あらかじめサンプルで計測)
この実績値をもとに、
担当のソリューションアーキテクト(SA)さんが算出したところ…
【要素①】ランニングコスト
©コーエーテクモゲームスAll rights reserved.


## p.20

翻訳API の決定(ランニングコスト)
■Amazon Translate
■Amazon Bedrock (Claude 3 Haiku モデル)
30 日間の総コスト
約$500
30 日間の総コスト
約$120
入力トークン数
約9500 万トークン
出力トークン数
約8000 万トークン
※総文字数でコスト計算
※トークン数でコスト計算
※1 発言あたりの推定トークン数は『三國志覇道』チャットサンプルより算出
©コーエーテクモゲームスAll rights reserved.
【ランニングコスト試算結果(1 サーバー・1 ヵ月あたりの試算)】


## p.21

翻訳API の決定(ランニングコスト)
Amazon Translate では問題にならないが、
Amazon Bedrock (Claude 3 Haiku モデル)だと、
東京リージョンのAPI 実行回数(200 回/ 分)だとQuota に掛かる
※回避方法は苦労点のところで後述
©コーエーテクモゲームスAll rights reserved.
想定されるピークタイムでの1 分間のチャット発言回数が多い
【ランニングコスト試算で判明したこと】


## p.22

翻訳精度検証にAmazon Bedrock 版の翻訳機コアも実装
本格的にAmazon Bedrock 版の実装の前に
AWS SDK for PHP を導入して、exec() での呼び出しをやめる
・Amazon Bedrock をコマンドラインで呼び出すには引数が多くなる
・外部コマンド実行はエラー発生時に拾いづらい
Amazon Bedrock 版の翻訳機コア実装の前に…
©コーエーテクモゲームスAll rights reserved.


## p.23

翻訳精度検証にAmazon Bedrock 版の翻訳機コアも実装
Amazon Bedrock (Claude 3 Haiku モデル) を使った翻訳機コアを実装
©コーエーテクモゲームスAll rights reserved.


## p.24

翻訳精度検証にAmazon Bedrock 版の翻訳機コアも実装
BedrockRuntimeClient を使用するカタチ
©コーエーテクモゲームスAll rights reserved.


## p.25

翻訳API の決定(翻訳精度)
サンプルを翻訳して比較
チーム内の日本語・繁体字両方が読めるメンバーに協力してもらって検証
【要素②】翻訳精度
■主なシチュエーション
・攻城戦中のチャット
・(普段の)全体チャット
・君主コメント
■精度検証のポイント
・話の流れが読み取れるか(特に攻城戦の指示)
・意味が大きく変わっていないか
・自然な翻訳となっているか
©コーエーテクモゲームスAll rights reserved.


## p.26

翻訳API の決定(翻訳精度)
管理ツール上にバッチ翻訳機能を実装して検証
©コーエーテクモゲームスAll rights reserved.


## p.27

翻訳API の決定(翻訳精度)
■サンプルの例示
原文
Amazon Translate(繁)
Amazon Bedrock
(Claude 3 Haikuモデル)(繁)
点呼するよ
我要定電
點名
ひがし整列
東方線
東方整列
初手城壁へ
到哈蘇特城牆
起始於城牆
巨大弓兵詰所[2604,749]攻撃
巨型弓箭手基地[2604,749] 
攻擊
攻擊[2604,749]的
巨大弓兵詰所
相手人数いなさげ
調查對手數量
人數好像不多
むりや
村屋
不可能
残り2分で全員本丸ね
每個人都在全圈裡，剩下2分鐘
剩餘2分鐘,全員返回本丸
お疲れさまでした♪(^o^ゞ
感謝您的辛勤工作♪(^o^ 
辛苦了♪(^o^ゞ
・攻城戦中のチャット
©コーエーテクモゲームスAll rights reserved.


## p.28

翻訳API の決定(翻訳精度)
原文
Amazon Translate(繁)
Amazon Bedrock
(Claude 3 Haiku モデル)(繁)
軍団員絶賛募集中
為軍團兵招募激烈的評論
軍團員熱烈招募中
タイキルされたら復讐するぜ
如果你被打倒，我會復仇
如果被殺害的話就復仇吧
原文
Amazon Translate(繁)
Amazon Bedrock
(Claude 3 Haiku モデル)(繁)
本日の攻城戦お相手
ありがとうございました
感謝你在今天的圍攻中的對手
感謝您今日在攻城戰中的相陪
うぐ、寝落ちしとった
啊，我睡著了
啊呀,我睡著了
・(普段の)全体チャット
・君主コメント
©コーエーテクモゲームスAll rights reserved.


## p.29

翻訳API の決定(結論づけ)
【要素①】ランニングコスト
Amazon Bedrock : Amazon Translate の想定費用はおよそ1 : 4 である
※ 『三國志覇道』での翻訳試験用プロンプトを用いた試算結果
『三國志覇道』での結論は
Amazon Bedrock (Claude 3 Haiku モデル)で行こう
(ただし、API 呼び出し回数問題は何か工夫が必要だ)
【要素②】翻訳精度
Amazon Bedrock (Claude 3 Haiku モデル) のほうが
・誤った翻訳で意味がおかしくなる頻度が低く、話の流れが崩れにくい
・顔文字の翻訳などもスムーズ
©コーエーテクモゲームスAll rights reserved.


## p.30

本実装での苦労点・工夫点
①API 呼び出し回数問題
・ピークタイムの推定呼び出し回数が多い
・東京リージョンでのQuota は200 回/ 分
(On-demand InvokeModel requests per minute for Anthropic Claude 3 Haiku)
・案A
1 回のAPI 呼び出しで複数メッセージをまとめて翻訳リクエストする
・案B
US リージョンを利用する(US ならQuota は1,000 回/ 分)
・案C
Claude 3 Haiku 以外のモデルも併用する
©コーエーテクモゲームスAll rights reserved.


## p.31

本実装での苦労点・工夫点
・案A (採用案)
1 回のAPI 呼び出しで複数メッセージをまとめて翻訳リクエストする
// 翻訳用のバッチ処理で呼び出す設計のため、相性が良い
・案B
US リージョンを利用する(US ならQuota は1,000 回/ 分)
// 日本・アメリカ間のレイテンシが心配
// リージョン間通信には追加費用
・案C
Claude 3 Haiku 以外のモデルも併用する
// プロンプトの複数管理が煩雑になりそう
結論
©コーエーテクモゲームスAll rights reserved.


## p.32

本実装での苦労点・工夫点
②絵文字・座標も翻訳されてしまうことがある問題
「:」で囲んだ絵文字、[]で囲んだ座標は、翻訳機に掛けても
翻訳されないようにしたい
・絵文字表記:smile:
⇒
(まれに翻訳されてしまい) :笑:
・座標表記[100,200]
⇒
(まれに翻訳されてしまい) [100,200人]
プレースホルダーに一度置き換えてから翻訳機に掛ける
©コーエーテクモゲームスAll rights reserved.


## p.33

本実装での苦労点・工夫点
プレースホルダーに置き換えている箇所のコードスニペット
(元の文字列を保存して、後で元に戻せるように)
©コーエーテクモゲームスAll rights reserved.


## p.34

プロンプトの苦労点・工夫点
最初は長い文章で指示していたが、
最終的には箇条書きで指示するようになっていった
Please translate each text individually from ja to zh-TW
Output format is JSON only. And please also separate each translation result with index.
Example:(array) {"result01": "你好"}, { "result02": "晚安"}
実装初期のプロンプト
©コーエーテクモゲームスAll rights reserved.


## p.35

プロンプトの苦労点・工夫点
1. Translate the above Japanese enclosed between <text> and </text> into Traditional 
Chinese.
Understand the meaning of Japanese and find relevant words and native phrases in 
Traditional Chinese
2. Output format is JSON only. And please also separate each translation result with index.
Example: {"result01": "你好"}, { "result02": "晚安"}
3. Alphanumeric characters enclosed in curly brackets are placeholders. Example: 
{noun01}, {emoji03}
4. Do NOT translate placeholders and keep them in their original location in the sentence.
5. The number of placeholders must be the same in both input and output.
最終的なプロンプト
©コーエーテクモゲームスAll rights reserved.


## p.36

プロンプトの苦労点・工夫点
・プロンプトは試行錯誤の繰り返し
・プロンプトを直してすぐに試せる開発環境づくりが大切
・翻訳単体を試せる機能は作って正解だった
・生成AI ベンダーの提供している公式文書は情報が豊富
・Amazon Bedrock User Guide
・Claude API Docs ＞プロンプトのベストプラクティス
Tips
©コーエーテクモゲームスAll rights reserved.


## p.37

利用許諾契約の文言確定
■使用許諾契約の一部変更を行いました
第12条個人情報に関する事項
2.当社プライバシーポリシーの2～4項及び11項に記載しているところに加えて、本コンテンツ
では以下の利用目的のために以下の個人情報を取得及び第三者と共同利用又は第三者に提供し
ます。
取得する個人情報
メッセージ
利用目的
翻訳機能の提供
当社グループにおける共同利用の有無
有
第三者提供の有無
有
当該第三者に関する情報
●提供先
Amazon Web Services Japan, Amazon Web Services, Inc.（所在国：日本、米国）
●所在国の個人情報保護制度に関する情報<br>米国については、以下のリンク記載の個人情報保護制度を有して
います。https://www.ppc.go.jp/files/pdf/USA_report.pdf（米国連邦）
ワシントン州における個人情報の保護に関する制度.pdf（米国ワシントン州）
©コーエーテクモゲームスAll rights reserved.


## p.38

利用許諾契約の文言確定
3.当社プライバシーポリシーの2項に加えて、本コンテンツにおいて当社は以下の方法で個人情
報を取得します。
Amazon Web Services, Inc.の提供するサービスである「Amazon Bedrock」および
「Amazon Translate」で取得した「メッセージ」を取得し、翻訳されたメッセージを本コン
テンツにおいて表示するために使用します。本コンテンツの運用に際しては、Amazon Web 
Services, Inc.の定める「AWS Service Terms」および関連のガイドラインに従います。
©コーエーテクモゲームスAll rights reserved.


## p.39

翻訳機能リリース
こうして
2024 年12 月19 日の定期メンテナンスで
無事にリリースされました
※画面はイメージです
©コーエーテクモゲームスAll rights reserved.


## p.40

翻訳機能リリース
©コーエーテクモゲームスAll rights reserved.
※画面はイメージです


## p.41

リリース直後のトラブル
【トラブル1】
翻訳失敗のWarning が想定以上に発生
・翻訳機コアが何のJSON も返してこないWarning が想定以上に発生
・想定外の返事の場合は3 回リトライを行うコードだったため、
余計に処理が詰まる状態が発生
(ランダム性temperature に期待していたがリトライしてもあまり変わっていなかった)
・リトライしないように修正
・1 回のAPI 呼び出しで送るメッセージ数を5 ⇒ 3 に変更
(メッセージ数を減らせば、何も返してこない率が改善するかもしれない)
©コーエーテクモゲームスAll rights reserved.


## p.42

リリース直後のトラブル
【トラブル2】
翻訳機に入力したメッセージ数と、出力のメッセージ数が合致しない
・翻訳機に入力したメッセージ数を超える数の答えが返ってくる
ことがある
・1 つのメッセージを入力しているケースでは、
最初の一つを最終的な翻訳後のメッセージとするように修正
・2 つ以上のメッセージを入力しているケースでは、
全体をエラーとして扱うように修正
©コーエーテクモゲームスAll rights reserved.


## p.43

Claude 3 Haikuがレガシー指定
2026 年3 月10 日
Claude 3 Haiku がAmazon Bedrock においてレガシー指定された
サポート終了日は、2026 年9 月10 日とアナウンスされている
・Claude Haiku 4.5
・Amazon Nova 2 Lite
上記のいずれかを、後継モデル候補として、アップデートを実施予定
©コーエーテクモゲームスAll rights reserved.


## p.44

まとめ
・ゲームのユーザー自由入力文は、他分野と比較すると一文が短い
・翻訳することに特化するなら、軽量で安価なモデルで十分
・動作速度も、軽量モデルならさほど問題にならない
・顔文字(文化)も理解していることに驚き
・これから生成AI の翻訳精度は上がっていくことが予想される
生成AI での翻訳は
ゲームのユーザー自由入力と
相性が良いです
©コーエーテクモゲームスAll rights reserved.


## p.45

Exhibition Booth Information
展示ブースのご案内
A008
株式会社コーエーテクモゲームス
AWS for Industries Zone②


## p.46

本セッションのアンケートへ
ご協力をお願いします
Please give us your feedback
Thank you!
AIM118
