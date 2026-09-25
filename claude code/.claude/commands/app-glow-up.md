---
description: アプリのフロントを「実際に使われているサービス」級に磨き上げる改善サイクル（探索→レビュー→デザイン適用→スクショ検証→反映→記録）。会計ソフトに限らず全アプリ対象。
---

# アプリ磨き上げサイクル（app-glow-up）

ポートフォリオ内の任意のアプリを、Googleデザイン言語（Material Design 3）ベースで
実サービス級のフロントエンドに磨き上げる、繰り返し回すための定型サイクル。

## 使い方
```
/app-glow-up                 # 対象を選んで1サイクル回す
/app-glow-up accounting-app  # 対象アプリを指定
```
$ARGUMENTS に対象ディレクトリ名があればそれを対象に、無ければ `PROJECT_MAP.md` の
Webアプリ系から1つ選ぶ（前回から間隔が空いているもの優先）。

## このサイクルが守る原則
- **JSの契約を壊さない**: 描画ロジックが参照するクラス名・DOM構造・data属性は維持し、原則 `index.html` と CSS で見た目を変える。JS編集は付加的要素（ヒーロー等）に限り、ロジックは触らない。
- **憶測で完成にしない**: 必ずアプリを起動しスクショで実画面を確認してから「できた」と言う。
- **クリーン＋色味のバランス**: 余白・タイポ・淡いボーダーの清潔感は保ちつつ、グラデのヒーロー・色分けアイコン/カード・アクセントで「使われている感」を出す（→ memory: ユーザーのデザイン好み）。

## 実行手順

### Step 1: 探索（サブエージェント委譲でコンテキスト節約）
- 対象アプリの起動方法（ポート・コマンド）を `PROJECT_MAP.md` で確認。
- フロント構成（テンプレHTML / CSS / 描画JS）を読み、使用クラス・配色変数・コンポーネントを把握。
- JSが参照するクラス名一覧を抽出（例）:
  ```bash
  grep -oE 'class="[^"]*"' static/js/app.js | sed 's/class="//;s/"//' | tr ' ' '\n' | sort -u
  ```

### Step 2: レビュー
- `ui-design-reviewer` サブエージェントに現状をレビューさせ、優先度付き改善点を受け取る。
  （`/design` スキルで Google Design MCP が使える場合はカラー/フォント/アイコンもそこで取得）

### Step 3: デザイン適用
- Google Fonts（Noto Sans JP + 数値用に Roboto Mono 等）と Material Symbols を CDN で読み込む。
- Material Design 3 のカラー/エレベーション/角丸/状態（hover/focus/active/disabled）を CSS 変数で整備。
- レビュー指摘と好みに沿って彩りを追加（ヒーローバナー / ページ別カラーアイコン / 色分け統計カード / アクセントライン 等）。
- 色はハードコードせず変数化。インラインスタイルの乱用を避ける。

### Step 4: スクショ検証（必須）
```bash
(python3 app.py >/tmp/app.log 2>&1 &) ; sleep 2.5   # ポート競合時は lsof -ti tcp:PORT | xargs kill
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --window-size=1440,950 --virtual-time-budget=4500 --screenshot=/tmp/shot.png "http://localhost:PORT/"
```
- 撮ったPNGを Read で開いて目視確認。主要ページ（一覧/テーブル/フォーム等）を最低2種。
- SPAで初期以外を撮るときは初期 state を一時変更→撮影→**必ず復元**。
- API/静的ファイルが 200 で返るかも確認（古いプロセスが残っていないか）。

### Step 5: 反映ループ
- ユーザーのフィードバックがあれば Step 3-4 を繰り返す。2回失敗したら方針を変える。

### Step 6: 記録
- 新たに分かったユーザーの好み・判断は memory（feedback/project）に追記。
- 共通化できた手法・部品は本スキルや CLAUDE.md に還元する。
- どのアプリをいつ磨いたかを `PROJECT_MAP.md` か memory に残し、次サイクルで間隔の空いたアプリを選べるようにする。

## 定期実行について
このサイクルは定期的に全アプリへ回す運用。スケジュール実行の設定は `/schedule` で行う
（cron ルーティン化）。自動実行では「監査＆改善案の提示」までに留め、コード反映は
レビュー後に人が承認する運用を基本とする。
