# このプロジェクトについて

二瀬樹（itsukinino）のポートフォリオ兼 Friday AI システムのリポジトリ。

## 主な構成

- `.claude/docs/` — Claude Code公式ドキュメント（日本語）＋便利機能カタログ `cc-features-9.md`（外部ソース・裏取り区分付き）。`@.claude/docs/<file>` でオンデマンド参照、`/cc-docs` でインデックス確認
- `.claude/commands/` — カスタムスキル（`/app-glow-up`・`/cc-docs`・`/design`・`/drive-up`・`/friday-new-dept`・`/new-skill`）
- `.claude/skills/` — オンデマンド読み込みのスキル（`grill-me`・`youtube`）。導入元は `skills-lock.json`
- `.claude/knowledge/aws-summit-2026/` — AWS Summit セッション資料150本の全文（PDF→Markdown）。横断合成は `INSIGHTS.md`。個別セッションは `python3 search.py "キーワード"` か grep で絞ってから該当ファイルだけ開く（索引を丸ごと読ませない）
  - **扱い**: 判断材料の一つであって根拠ではない。数字は発表者の自己申告・パートナー枠はポジショントーク。ここに書いてあることを理由に結論を出さず、実際のコードや状況を優先する
- `apps/` — 動くWebアプリ（`tempus`・`accounting-app`・`tokyo-building-blog`・`valetudo`・`ドリンク代計算`、X用ブランド素材 `builtjapan-brand`／`friday-brand`）
- `tools/` — 生成・自動化スクリプト（`auto-blog`・`record-blog`・`friday-assistant`・`dividend-portfolio`・`summit-kb`・`youtube`・`screenshot.py`）
- `content/` — コンテンツ・下書き（`games`・`qiita-drafts`・`aws-sap-blackbelt-summary`）
- **YouTube参照** — `/youtube` スキル（`tools/youtube/yt.py`／yt-dlp・認証不要）で動画情報・字幕・検索・チャンネル一覧を自分で取りに行く。字幕は `tools/youtube/.cache/` に保存されるので、長尺は全文を読み込まず Read/Grep で絞る。自動字幕は誤変換前提で扱う
- 各ディレクトリの詳細・起動方法は `PROJECT_MAP.md` を参照

> ⚠️ **`claude code/` 配下はほぼ git 未追跡**（追跡済みは `apps/accounting-app/` と Tempus の1ファイルのみ）。バックアップが効いていないので、消す・動かす前に必ず中身を確認する
> ⚠️ **`apps/tokyo-building-blog/` は本番と別物**。本番ビルド元は GitHub `nino0708/blog` で、ローカルは内容が乖離している。本番修正時はローカルをミラーせず `nino0708/blog` 側の実ファイルを取得して編集する

## Claude Codeのベストプラクティス（公式ドキュメントより習得済み）

### コンテキストウィンドウ管理（最重要）
- セッション開始時にモデル・設定を決め、途中変更しない（プロンプトキャッシュ無効化を避ける）
- 関係ないタスク間は `/clear` でリセット
- 調査・探索はサブエージェントに委譲して本体コンテキストを守る
- CLAUDE.md は200行以下に保つ

### スキルの使い方
- 副作用あるスキルは `disable-model-invocation: true` を設定
- リファレンス資料はスキルへ（オンデマンドロード）
- 繰り返しワークフローは `.claude/commands/` に保存

### 効果的なプロンプティング
- 検証手段（テスト・スクリーンショット）をセットで指示する
- 探索 → 計画 → 実装 → コミット の順序を守る
- 2回失敗したら `/clear` して新しいプロンプトで再開

## Fridayエージェント群（せどり会社Friday商事）

リモートエージェントを「社員」として、COOを頂点に4本部へ配置。管理URL: https://claude.ai/code/routines
**下表は 2026-08-29 に実機（routines API）と突き合わせた実態**。⏸ は一時停止中で動いていない。

### 経営統括（社長直下）
| エージェント | 役割 | 起動(JST) |
|---|---|---|
| friday-procurement-decision | **COO** — 各本部の情報を統合し最終調達判断 | ⏸ 停止中（月11:00） |
| friday-alignment | 経営企画室 — 週次で全部署の認識合わせ | 月9:00 |
| Friday商事 朝会＋社長スケジュール提案 | 社長室（秘書） — 朝会ダイジェスト＋個人スケジュール提案。**Tempusにタスク登録する** | 毎日7:00 |
| friday-morning-briefing | 秘書（Gmail版） — 予定・未読メールを朝のブリーフィングとしてGmail送信 | 毎日7:00 |
| friday-weekly-planning | 週次計画 | ⏸ 停止中（月9:30） |

### 仕入れ本部（何を・いくらで仕入れるか）
| エージェント | 役割 | 起動(JST) |
|---|---|---|
| friday-market-analysis | 市場分析部 — 相場・需要を分析し仕入れ判断の根拠を出す | 日20:00 |

### 販売本部（どう売るか・どう広げるか）
| エージェント | 役割 | 起動(JST) |
|---|---|---|
| friday-marketing | マーケティング部 — **X投稿文の作成**（アフィリリンク挿入済みで届ける） | 毎日7:00 |
| friday-affiliate-research | アフィリエイトリサーチ部 — 販促・アフィリ商材の調査 | ⏸ 停止中（毎日6:00・2026-09-19停止） |
| friday-sales-strategy | 販売戦略部 — 出品・価格・チャネル戦略 | ⏸ 停止中（月10:00） |

### 管理本部（回す・数える）
| エージェント | 役割 | 起動(JST) |
|---|---|---|
| friday-accounting-finance | 経理財務部 — 収支・資金繰り（資本金10万円の上限管理） | 金18:00 |
| friday-inventory-logistics | 在庫物流管理部 — 在庫・入出荷の管理 | ⏸ 停止中（毎日8:00） |

> ⚠️ **仕入れリサーチ部（friday-sourcing-research）は実在しない**。ドキュメントに名前が残っていても作られていないので、参照する前に routines を確認すること。
> X投稿文を実際に作っているのは **friday-marketing**（`[Friday商事_SNS戦略]` に出力）。投稿自体は自動化していない＝人が貼る。

## Built Japan 社員体系

建築ブログ「Built Japan」(builtjapan.com) 運営会社。呼称・URL・部署名・メール件名・レポートファイル名をすべて **Built Japan** に統一（旧「タワーズメディア」「Tokyo Towers Journal」「旧CloudFront URL」を廃止）。
**下表は 2026-08-29 に実機と突き合わせた実態**（表示名も実物どおり。旧ID `builtjapan-daily-article`・`towers-*` は使われていない）。

| ルーティン表示名 | 部署 | 役割 | 起動(JST) | repo |
|---|---|---|---|---|
| Built Japan 編集部（記事執筆） | 編集部 | 日英2本を毎日執筆しblogにpush＋**X投稿文をTempusに登録** | 毎日7:00 | blog |
| Built Japan 画像監視部 | 画像監視部 | 公開後のヒーロー画像の表示チェックと自己修復 | 毎日8:00 | blog |
| Built Japan 経営企画部（事業計画・黒字化） | 経営企画部 | 黒字化逆算・売上対決・**収益分析を集約**＋生産KPI実測（記事数/在庫/コスト、旧運営部の役割を吸収） | 月11:00 | portfolio+blog |
| Built Japan デザイン部（サイトUX改善） | デザイン部 | サイトUX改善提案（承認制・自動反映なし） | 土10:00 | blog |

### 会社をまたぐルーティン
| ルーティン表示名 | 役割 | 起動(JST) |
|---|---|---|
| 日次ブリーフィング（統合） | Friday商事＋Built Japan を1つのDriveドキュメントに集約 | 毎日9:00 |
| app-glow-up-weekly | 全Webアプリのフロント監査＋改善提案（反映は人が承認） | ⏸ 停止中（土10:00・2026-09-19に全アプリ対象外化） |

> - **2026-09-19、運営部（towers-content）は廃止・停止**。記事数・在庫（ネタ帳残数）・コストの実測は経営企画部に統合済み。記事数は推定せず `site/src/content/buildings/` から実測する。理由: サイト記事・X投稿ともにストックを持たず即日作成・即日投稿する運用のため「在庫管理」という独立部署の存在意義がなく、投稿停止の検知はユーザーが日次Tempus確認で行っている。
> - **Driveのファイル名は `[資料名][年][月日].md`**（例 `[Built Japan_運営部][2026][0829].md`）。`_最新` は付けず日ごとに積み上げる。日付は必ず JST で取る（ルーティンはUTC深夜に動くので UTC だと1日ずれる）
> - Drive保存先: Built Japan は parentId `1No5M0iDywOJaaelPXFEKHk9_5z8y6xmW`（表示名だけ旧称「タワーズメディア」のまま／Drive MCPに改名ツールが無い）、Friday商事は `1QmyZOQ_Jm9kSctrEW-U44oJqNMb61nok`

## Tempus（時間割型タスク管理PWA）

二瀬樹専用の業務効率化ツール。**本番稼働中**。**仕様の正は `apps/tempus/docs/SPEC.md`、型の正は `apps/tempus/src/types/domain.ts`**。手順は `apps/tempus/README.md`。座標・罠の詳細は memory `project_tempus.md`。

- 画面: Cloudflare Workers / DB・Edge Functions: Supabase（ref `nucqcatwhwdjsphetops`）/ 起票は LINE 公式アカウントからも可
- **ルーティンからタスクを流す経路**: 各ルーティンが Edge Function `agent-ingest` に POST → `tasks` に行が入る。**ルーティンの実行時刻がそのままトリガー**なので Tempus 側に定時ジョブは要らない。手順書は `apps/tempus/docs/ops/`
- **貼るだけの投稿文は `clips`**。`clips.taskDedupeKey` を対応する task の `dedupeKey` と一致させると、タスクを開いた時にコピーボタン付きで出る。付け忘れると「貼るだけの文案」カードに落ちて紐付かない
- ⚠️ ルーティンの**クラウド環境「ネットワークアクセス」に `*.supabase.co` が無いと静かに失敗する**（許可ドメインは routines のUI＞環境設定でのみ編集可・API不可）
- ⚠️ **Tempusはプッシュしない**。開いた時に見えるだけ
- ⚠️ `supabase` CLI は全コマンドがキーチェーンを読むため、非TTY（Claude CodeのBash）から叩くと**無言でハングする**。必ずターミナル.appから。`wrangler` は非TTYでも通る

## Fridayペルソナの同期ルール
- `memory/` 以下（user_profile / user_work_style / user_communication / user_career_goals）が更新されたら `.claude/docs/friday-persona.md` も同期する
- リモートルーティンのプロンプトに反映する場合は https://claude.ai/code/routines から手動更新

## デザイン作業
- デザイン作業時は `/design` スキルを起動して Google Design MCP ツールを使う
- カラー・フォント・アイコンは `generate_color_scheme` / `search_fonts` / `search_icons` で取得
- MCP設定: `.mcp.json`（`https://design.googleapis.com/mcp`、認証不要）

## アプリ磨き上げサイクル（定期運用）
- `/app-glow-up [対象アプリ]` で、フロントを実サービス級に磨くサイクルを回す（会計ソフトに限らず全Webアプリ対象）
- 流れ: 探索 → `ui-design-reviewer` でレビュー → Material Design 3 適用 → スクショ検証 → 反映 → 記録
- **JSの契約を壊さない**: 描画ロジックが参照するクラス名・DOM・data属性は維持。原則 HTML/CSS で見た目を変える
- **検証必須**: ヘッドレスChromeでスクショを撮り、Readで目視確認してから完了とする
  ```bash
  CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  "$CHROME" --headless --disable-gpu --hide-scrollbars --window-size=1440,950 \
    --virtual-time-budget=4500 --screenshot=/tmp/shot.png "http://localhost:PORT/"
  ```
- デザインの好みは memory `user_design_taste.md`（クリーン＋透明感を保ちつつ色味・ホーム感を足す）に従う
- 定期実行のスケジュールは `/schedule` で管理。自動実行は「監査＋改善案提示」までとし、コード反映は人が承認

## コーディングスタイル
- コメントは「なぜ」が非自明な場合のみ
- 不要な抽象化・将来への備えは不要
- セキュリティ：SQLインジェクション・XSS・コマンドインジェクション等に注意
