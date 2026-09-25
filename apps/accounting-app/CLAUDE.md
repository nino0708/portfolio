# accounting-app（Kaikei 会計管理）

団体会計の汎用 Web 会計（Flask + SQLite）。NPO法人会計基準（活動計算書）対応。起動: `python app.py` → http://localhost:5050

## ファイルの分担（直したい機能のファイルだけ読む）

- `app.py` — 起動口（Blueprint 登録・画面 `/` `/manual`・main）
- `common.py` — DB 接続・スキーマ初期化(`init_db`)・会計区分の定数・計算ヘルパー
- `routes/` — API: `periods`（期間・期首残高・繰越）／`accounts`（科目・補助科目）／`entries`（仕訳・赤伝・履歴）／`reports`（帳簿・決算書・予実・月次・監査・整合性）／`data`（エクスポート/インポート）
- `static/js/` — 画面。`templates/index.html` の `<script>` の順に読み込み、トップレベルの const/function は全ファイルで共有。`core`（状態・API・画面遷移）→ `entry-form` → `ledger` → `statements` → `analysis` → `settings` → `ui` → `csv-import`（最後に `init()`）
- `templates/manual.html` は利用者向けマニュアル（大きいので必要時のみ）

## 注意

- 締め済み期間への書き込みは拒否し、訂正は赤伝（逆仕訳）で行う仕様
- 描画 JS が参照するクラス名・DOM 構造は変えない（見た目は CSS で変える）
- exe 化は `kaikei.spec`（PyInstaller）。`templates`・`static` を同梱する
