# Qiita 下書き一覧

会話履歴から抽出したAWS技術記事の下書き。公開前に肉付け・図の追加が必要。

| ファイル | タイトル | 状態 |
|---|---|---|
| `01_ssm-session-manager-no-keypair.md` | SSM Session Managerでキーペア・踏み台・22番ポートが全部いらなくなった話 | 下書き |
| `02_iam-confused-deputy.md` | IAMの「混乱した代理問題」と外部IDによる対策 | 下書き |
| `03_sqs-dlq-auto-isolation.md` | SQS デッドレターキュー（DLQ）で失敗した処理を自動隔離する | 下書き |
| `04_kinesis-shard-iterator-expired.md` | Kinesisのシャードイテレーターが期限切れになる意外な原因 | 下書き |
| `05_lambda-cloudwatch-logs-missing.md` | LambdaのCloudWatch Logsにログが出ない原因の切り分け方 | 下書き |
| `06_kms-cmk-unexpected-billing.md` | KMSのカスタマーマネージドキーを放置したら月12,000円請求された話 | 下書き |
| `07_hardcoded-ip-failover.md` | ハードコードされたIPアドレスをフェイルオーバー対応にする方法 | 下書き |
| `08_minecraft-server-ec2-cost.md` | IT未経験だった私が「週末3時間だけのマイクラサーバー」をEC2で建てたら、レンタルサーバーの1/6になった話 | **図・画像込みで完成**（LT15分用） |
| `09_gpt6-astra-vs-claude-code.md` | GPT-6 Astra は Claude Code の代わりになるのか — 公式発表と独立ベンチを突き合わせて整理した | **本文完成**（画像なし・そのまま投稿可） |

## 各記事に共通で必要な作業

- [ ] 構成図・図解の追加（draw.io または Mermaid）
- [ ] 実際の操作画面スクリーンショットの追加
- [ ] CloudFormation / CLI のコード例の確認・補完
- [ ] 公開前の誤字チェック

## 09 について

08 と同じ2本立て（`09_....md` = CLI投稿用フロントマターあり / `09_....paste.md` = webエディタ貼り付け用）。
**画像が1点も無いので、08と違って貼るだけで公開できる。**

- 本文の数字はすべて **2026-09-06 時点**。Astra は 2026-09-03 発表・段階展開中なので、
  公開が遅れる場合は [Artificial Analysis](https://artificialanalysis.ai/articles/benchmarking-gpt-6-astra) と
  [OpenAI API docs](https://developers.openai.com/api/docs/models/gpt-6-astra) を再確認する
- 本文を直したら `.paste.md` を作り直すこと（コマンドは下の08の項と同じ、ファイル名だけ差し替え）

## 08 について（他と状態が違う）

01〜07 が本文のみの下書きなのに対し、08 は**画像13点と構成図つきで完成済み**。15分の発表用に章立てと時間配分を入れてある。

- 画像: `images/08_minecraft/`（構成図2点は `_svg-source/` にSVG原本あり。数字を直す時はSVGを編集して `rsvg-convert -w 1620 x.svg -o x.png`）
- 本文は**素のMarkdown**（HTMLタグ不使用・テーブルはGFM記法）

本文は用途別に2つある。**中身は同一で、フロントマターの有無だけが違う**：

| ファイル | 用途 |
|---|---|
| `08_minecraft-server-ec2-cost.md` | **CLI投稿用。** 冒頭にQiita CLI形式のYAMLフロントマター（`private: true`）あり |
| `08_minecraft-server-ec2-cost.paste.md` | **webエディタ貼り付け用。** フロントマターを除いた版。タイトル・タグはエディタ側で入力する |

webエディタにフロントマター付きの方を貼ると、`title:` などがそのまま本文に表示されてしまうので注意。
本文を修正した時は `.md` 側を直し、以下で `.paste.md` を作り直す：

```bash
awk 'NR==1&&/^---$/{fm=1;next} fm&&/^---$/{fm=0;next} !fm' \
  08_minecraft-server-ec2-cost.md > 08_minecraft-server-ec2-cost.paste.md
```

### 公開する時の手順

Qiita API v2 に**画像アップロードのエンドポイントは無い**ため、画像だけは手作業が要る。

1. Qiitaのwebエディタで新規記事を作り、`images/08_minecraft/` の13点をドラッグ&ドロップしてアップロード
2. 発行された `https://qiita-image-store.s3.../xxx.png` のURLで本文の `![](images/08_minecraft/...)` を置換
3. 本文を貼って限定共有で保存 → 内容を確認してから公開

CLIで回したい場合は `npx qiita init` → アクセストークン登録（現状このマシンには未設定）。それでも画像は上記の手作業が必要。

### 数字の出典（更新時の注意）

料金は **AWS Pricing API から取得した東京リージョンの実額**（2026-08時点）、為替は **1 USD = 158.7円**（2026-08-21）。
時間が経ったら以下で取り直す:

```bash
aws pricing get-products --region us-east-1 --service-code AmazonEC2 \
  --filters 'Type=TERM_MATCH,Field=regionCode,Value=ap-northeast-1' \
            'Type=TERM_MATCH,Field=productFamily,Value=Storage Snapshot'
curl -sL "https://api.frankfurter.dev/v1/latest?base=USD&symbols=JPY"
```
