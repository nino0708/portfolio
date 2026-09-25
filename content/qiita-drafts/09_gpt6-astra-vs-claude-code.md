---
title: GPT-6 Astra は Claude Code の代わりになるのか — 公式発表と独立ベンチを突き合わせて整理した
tags:
  - OpenAI
  - ClaudeCode
  - Codex
  - LLM
  - AI
private: true
updated_at: ''
id: null
organization_url_name: null
slide: false
ignorePublish: false
---

## はじめに

2026年9月3日、OpenAI が **GPT-6 Astra** を発表しました。打ち出しはかなり強く、「computer use・ブラウジング・ソフトウェア工学・サイバーセキュリティ・科学・専門業務で SOTA」、社長の Greg Brockman は「世代を超えた飛躍」「いずれ AGI の到来と見なされるかもしれない」とまで言っています。

ただ、公式の数字と第三者による独立計測を並べてみると、**勝っている領域と後退している領域がかなりはっきり分かれていました**。少なくとも「全部入れ替わった」という話ではありません。

この記事では、公式発表・API ドキュメント・System Card・独立ベンチマークを突き合わせて、**Claude Code を使っている人が乗り換えるべきかどうか**という視点で整理します。

---

## 0. 先に比較の軸を揃える

一番よくある混乱がここなので最初に潰しておきます。**GPT-6 Astra と Claude Code はレイヤーが違います。**

| レイヤー | OpenAI | Anthropic |
|---|---|---|
| モデル | **GPT-6 Astra** | Claude Fable 5.1 / Opus 5 など |
| コーディングエージェント（ハーネス） | Codex | **Claude Code** |

Astra は「モデル」、Claude Code は「CLI のエージェント実行環境（ハーネス）」です。比較として成立するのは **Codex(+Astra) vs Claude Code(+Claude)**。

後で出てくるベンチマークのスコア差にも、**モデルの差とハーネスの差が混ざっています**。ここは読むときに常に意識が要ります。

---

## 1. GPT-6 Astra のスペック

| 項目 | 値 |
|---|---|
| モデルID | `gpt-6-astra` |
| コンテキストウィンドウ | 1,050,000 トークン（入力上限 922,000） |
| 最大出力 | 128,000 トークン |
| 知識カットオフ | 2026-04-30 |
| reasoning effort | `low` / `medium` / `high` / `xhigh` / `max` |
| エンドポイント | Chat Completions / Responses / Batch |
| 提供 | OpenAI API、Amazon Bedrock、ChatGPT (Plus/Pro/Business/Enterprise) |

対応ツールが agentic 寄りに揃っています。

```
web search / file search / image generation / code interpreter /
hosted shell / apply patch / skills / computer use / MCP / tool search
```

レート制限は Standard Tier 1 で 500 RPM・500K TPM、Tier 5 で 15,000 RPM・40M TPM。

---

## 2. 前世代（GPT-5.6 Sol）から何が変わったか

| ベンチマーク | GPT-6 Astra | GPT-5.6 Sol | Claude Fable 5.1 |
|---|---|---|---|
| ScreenSpot-Pro（UI把握） | **92.7%** | 76.9% | — |
| OSWorld 2.0（デスクトップ操作） | **72.6%** / 約40分 | 65.7% / 約75分 | — |
| Terminal-Bench 4.0 | **57.7%** | 37.3% | 55.8% |
| FrontierMath Tier 4 | **97.6%** | 83.0% | 87.8% |
| Humanity's Last Exam (tools) | 57.2% | — | **65.0%** |

### 本命は「賢さ」ではなくトークン効率

派手なスコアより、実務で効きそうなのはこちらです。

- Codex ハーネス上で **GPT-5.6 Sol (max) の 1/3 のトークン**で同じ仕事を終える（約70%の効率改善）
- **Claude Opus 5 (xhigh) と比べると 1/5**

Artificial Analysis の計測では、コーディングタスクにおいて「Sol (max) とほぼ同じコストで 2 点高いスコア」という結果になっています。単価は上がったが、消費量が減ったので相殺されている、という構図です。

### 幻覚率が大きく下がった

AA-Omniscience で **幻覚率 92% → 51%**、しかも同時に正答率が 4 ポイント改善しています。「知らないことを知らないと言う」方向の改善は体感に効きやすいので、ここは素直に大きいと思います。

### ただし全勝ではない

ここが公式発表だけ読んでいると見えない部分です。

- **Intelligence Index は 61 で GPT-5.6 Sol と同点**。Claude Fable 5.1 (max) には 5 ポイント差で負けている
- **GDPval-AA v2 は約 80 Elo 後退**
- カスタマーサポート、科学系コーディング、長文脈推論で **2〜3 ポイントの後退**
- Humanity's Last Exam (tools) は 57.2% で Claude Fable 5.1 の 65.0% に届いていない
- **価格が 2.5 倍**になった（$4/$20 → $10/$50）

「全方位で置き換わった」ではなく、**agentic・ターミナル・数学・GUI に振った代わりに、いくつかの領域を落としている**というのが実態に近いです。

---

## 3. エージェントとして何が新しいか

新規性は大きく 2 つです。

### (1) computer use が正式なツールとして載った

画面を直接操作する能力が、API のツールとして提供されています。ScreenSpot-Pro（UI要素の把握）で 92.7%、OSWorld 2.0（実際のデスクトップ作業）で 72.6% を約40分。前世代が 65.7% を約75分だったので、**精度を上げながら 1 タスクあたり約 47% 速い**という改善です。

想定されている使い方は、経費精算フォームの入力、CRM の更新、QA テスト、ソフトウェアのトラブルシュートといった「GUI を経由しないと終わらない定型作業」です。

### (2) Codex のコンテキスト管理が「要約」から「ノート＋検索」に変わった

個人的にはこちらのほうが効きそうだと思っています。

従来の長時間セッションは、コンテキストが埋まると**過去を要約して圧縮**していました。要約は不可逆なので、「序盤で決めた仕様」「前に流したテストの結果」が落ちて、エージェントが途中から前提を忘れる、という問題が起きます。

Astra + Codex では、圧縮する代わりに **ノートを取りながら、過去のコンテキストウィンドウを検索可能なまま保持する**方式に変わりました。現在は `config.toml` から有効化する実験機能ですが、近くデフォルトになる予定とのことです。

長時間エージェントで一番つらいのが「前提の忘却」なので、ここは実用度が高い変更だと思います。

### ⚠️ ARC-AGI-3 99.9% は額面通りに取らない

公式が出している目玉スコアに ARC-AGI-3 の 99.9%（人間のアクション効率ベースラインを 96% のレベルで上回った）があります。ただしこれは **stateful なハーネスを前提とした条件下のスコア**で、**ステートレスな API 呼び出しでは大幅に低くなります**。

AI 懐疑派として知られる Gary Marcus も「本物の前進ではあるが、ARC-AGI での成功は — その名前に反して — AGI の証明ではない」と AGI ラベルを明確に否定しています。

公式のベンチは「その条件で出た最大値」であって「自分のコードで再現する値」ではない、という前提で読むのが安全です。

### ⚠️ サイバー能力が "Critical" に到達している

Astra は OpenAI の Preparedness 基準で**初めてサイバーセキュリティの Critical 水準に到達したモデル**です。System Card の表現では「適切なツールとアクセスがあれば、十分に防御されたシステムに対して未知の脆弱性を発見し、新しい攻撃手法を開発できる」。

このため、

- センシティブな領域（バイオ、サイバー）は**信頼ベースのアクセス制御**が入る
- 一部の用途は申請制プログラム（Daybreak）でゲートされる
- ツール使用を伴う推論すべてにミスアライメント監視が走る
- **cyber 系の拒否率は約 94%**

セキュリティ検証系の用途を考えている場合、この制約は事前に確認しておいたほうがいいです。

---

## 4. Codex vs Claude Code

Artificial Analysis の Coding Agent Index。

| 構成 | スコア |
|---|---|
| Claude Fable 5.1 in **Claude Code** | **70** |
| GPT-6 Astra in **Codex** | 67 |
| Claude Opus 5 / Fable 5 | ≒67 |

**⚠️ この 3 点差は、ハーネスが違う状態での比較です。** Astra は Codex 上、Fable 5.1 は Claude Code 上で走っているので、差の一部は足回り（コンテキスト管理・ツール設計・プロンプト）の差であって、モデルそのものの差ではありません。

### 得意領域の分かれ方

| | 強い側 |
|---|---|
| ターミナル作業 | Astra / Codex（Terminal-Bench 4.0 で 57.7% vs 55.8%） |
| GUI 操作 | **Astra / Codex（Claude Code に相当機能なし）** |
| 数学・科学エージェント | Astra / Codex |
| トークン効率 | Astra / Codex |
| 長時間のリポジトリ推論 | Claude Code |
| 複数ファイルの整合性 | Claude Code |
| 丁寧なパッチレビュー | Claude Code |

### 機能として決定的な差は「画面を触れるかどうか」

> **Claude Code はターミナルとファイルシステムの住人**です。ブラウザや GUI アプリは操作できません。
> **Astra の computer use は画面を直接触れます。**

コードを書く仕事の中だけで見ると、この差はほとんど表に出ません。差が出るのは、**公式 API が存在せず、管理画面からしか操作できない作業**がワークフローに混ざったときです。

**⚠️ ただし規約リスクがあります。** SaaS やプラットフォームの管理画面をブラウザ自動操作するのは、利用規約違反になる場合があります。「アカウント停止」が最大損失なので、

- 公式 API がある経路は**必ず API を使う**
- GUI 自動操作は**代替手段が無い作業に限定する**

という線引きは最初に決めておいたほうがいいです。

---

## 5. 料金

### API（100万トークンあたり）

| モデル | 入力 | キャッシュ読み込み | 出力 | コンテキスト |
|---|---|---|---|---|
| **GPT-6 Astra** | **$10** | $1（書き込み $12.50） | **$50** | 1.05M |
| Claude Fable 5.1 | $10 | — | $50 | 1M |
| Claude Opus 5 | $5 | — | $25 | 1M |
| Claude Sonnet 5 | $2 | — | $10 | 1M |

Astra の fast mode は 2.5 倍速で約 2 倍の料金（≒ $20/$100）。

### サブスクリプション

| | Codex (OpenAI) | Claude Code (Anthropic) |
|---|---|---|
| 無料 | あり（制限付き） | なし |
| エントリー | Go $8 / Plus $20 | Pro $20（年額なら月換算 $17） |
| 上位 | Pro $100 / $200 | Max 5x $100 / Max 20x $200 |
| 法人 | Business $20/席（年額） | Team Premium $100〜125/席 |
| 従量課金 | 2026-04-02 からトークンベースのクレジット制（1クレジット ≒ $0.04） | サブスク上限を超えたら API 課金 |

Astra は既存プランの利用枠に含まれ、追加クレジットの購入も可能。**Enterprise は管理者が手動で有効化する必要があり、初期状態はオフ**です。

### ⚠️ 「新しいモデルに乗り換えれば安くなる」ではない

$10/$50 は **Claude Fable 5.1 と同額**、**Claude Opus 5 の 2 倍**、**Claude Sonnet 5 の 5 倍**です。

トークン効率の改善（前世代の 1/3、Opus 5 xhigh の 1/5）が効くのは、**効率差が単価差を上回るケース**、つまり長時間で重い agentic 作業だけです。定型処理や大量バッチを Astra に寄せると素直に高くつきます。

---

## 6. で、乗り換えるべきか

**現時点の結論としては、Claude Code を使っているなら乗り換える理由は薄いです。**

- コーディングエージェント指標では Claude Code 側がまだ上（70 vs 67、ただしハーネス差込み）
- 価格は同額（$10/$50）
- Intelligence Index も Claude Fable 5.1 が 5 ポイント上

一方で、**追加で持つ価値があるのは computer use です。** ここだけは Claude Code に代替物がありません。

なので現実的な検証としては、

1. 今、**どうしても人力で画面を触っている工程**を 1 つ特定する
2. 月 $20 のプランで、**その工程が消えるかどうかだけ**を測る

これが最小コストの試し方だと思います。「コーディングエージェントを乗り換えるか」ではなく「GUI 工程を埋める道具を 1 つ増やすか」というフレームで見たほうが、判断を間違えにくいです。

---

## まとめ

- **Astra はモデル、Claude Code はハーネス。** 比べるときは Codex vs Claude Code に軸を揃える
- 本命は「賢さ」ではなく **トークン効率**（前世代の 1/3、Opus 5 xhigh の 1/5）と **幻覚率の低下**（92% → 51%）
- ただし全勝ではない。**長文脈推論・科学系コーディング・カスタマーサポートは後退**している
- 公式の派手なスコア（ARC-AGI-3 99.9%）は **stateful なハーネス前提**。ステートレス API では再現しない
- サイバー能力が **Critical** に到達し、一部用途は申請制ゲート＋拒否率約 94%
- コーディング単体なら Claude Code が優位。**代替不能な差分は computer use だけ**
- 価格は Claude Fable 5.1 と同額・Opus 5 の 2 倍。**乗り換えてもコストは下がらない**

発表から日が浅く、独立計測もまだ出揃っていません。ベンチの数字はあくまで判断材料の一つとして、最終的には自分のリポジトリ・自分のワークフローで測るのが確実だと思います。

---

## 出典

- [Introducing GPT-6-Astra — OpenAI Developer Community](https://community.openai.com/t/introducing-gpt-6-astra-the-most-intelligent-and-aligned-model-in-the-world/1394703)
- [GPT-6 Astra Model | OpenAI API Docs](https://developers.openai.com/api/docs/models/gpt-6-astra)
- [GPT-6 Astra System Card — OpenAI Deployment Safety Hub](https://deploymentsafety.openai.com/gpt-6-astra)
- [Benchmarking GPT-6 Astra | Artificial Analysis](https://artificialanalysis.ai/articles/benchmarking-gpt-6-astra)
- [GPT-6 Astra: Features, Benchmarks, and Pricing | DataCamp](https://www.datacamp.com/blog/gpt-6-astra)
- [OpenAI releasing major upgrade to ChatGPT and Codex with GPT-6 Astra | 9to5Mac](https://9to5mac.com/2026/09/04/openai-releasing-major-upgrade-to-chatgpt-and-codex-with-gpt-6-astra-details-here/)
- [OpenAI Launches GPT-6 Astra After A Curious False Start | Forbes](https://www.forbes.com/sites/ronschmelzer/2026/09/03/openai-announces-gpt-6-astra-or-does-it/)
- [OpenAI unveils GPT-6 Astra amid rising scrutiny and safety concerns | Al Jazeera](https://www.aljazeera.com/economy/2026/9/4/openai-unveils-gpt-6-astra-amid-rising-scrutiny-and-safety)
- [GPT-6 Astra vs Claude Fable 5.1: Agentic Coding Benchmarks | Contra Collective](https://contracollective.com/blog/gpt-6-astra-vs-claude-fable-5-1-agentic-coding-benchmarks-2026)
- [OpenAI Codex Pricing 2026 | UI Bakery](https://uibakery.io/blog/openai-codex-pricing)
- [Claude Code Pricing In 2026 | CloudZero](https://www.cloudzero.com/blog/claude-code-pricing/)

<!-- 数字はすべて 2026-09-06 時点。Astra は 2026-09-03 発表・段階展開中のため、
     公開が遅れる場合は Artificial Analysis と OpenAI の API docs を再確認すること -->
