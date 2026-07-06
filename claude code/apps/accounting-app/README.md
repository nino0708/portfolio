# accounting-app

団体会計向けの汎用Web会計アプリ（Python/Flask + SQLite）。NPO法人会計基準（活動計算書）に対応し、複合仕訳・整合性チェック・かんたん入力アシスタントを備える。科目は決め打ちせず動的生成。

## 起動

```bash
cd accounting-app
pip install -r requirements.txt
python app.py        # → http://localhost:5000
```

Mac は `起動.command`、Windows は `起動.bat` をダブルクリックでも起動可。

## 実行ファイル化（Pythonなしで配布する）

PyInstaller で単一の実行ファイルにまとめられる（Python未インストールのPCでも動く）。

```bash
# Mac: build.command をダブルクリック、または
python3 -m pip install pyinstaller
python3 -m PyInstaller --noconfirm --clean kaikei.spec   # → dist/Kaikei

# Windows: build.bat をダブルクリック、または
python -m pip install pyinstaller
python -m PyInstaller --noconfirm --clean kaikei.spec     # → dist\Kaikei.exe
```

- 成果物 `dist/Kaikei`（Win は `Kaikei.exe`）を任意のフォルダに置いて実行 → ブラウザが自動で開く。
- **データは実行ファイルと同じ場所の `data/accounting.db` に保存**される（ポータブル運用）。
  既存データを引き継ぐときは、その `data/` フォルダを実行ファイルの隣にコピーする。
- **PyInstaller はクロスコンパイル不可**。Windows用 exe は Windows 上で、Mac 用は Mac 上でビルドする必要がある。
- `templates/` と `static/` は `kaikei.spec` の `datas` で同梱され、`app.py` の `resource_path()` 経由で参照される。

## ディレクトリ構成

```
accounting-app/
├── app.py              # Flaskアプリ本体（DBスキーマ + 全APIエンドポイント）
├── requirements.txt
├── templates/
│   ├── index.html      # メイン画面（SPA的に1ページで全機能）
│   └── manual.html     # 操作マニュアル（/manual）
├── static/
│   ├── css/style.css   # スタイル
│   └── js/app.js       # フロントロジック（画面描画・API呼び出し）
├── data/
│   ├── accounting.db   # SQLite本体（gitignore対象。初回起動時に自動生成）
│   └── backups/        # DBの手動バックアップ（gitignore対象）
└── 起動.command / 起動.bat
```

> DBパスは `app.py` の `DATABASE = data/accounting.db`。`init_db()` が初回に自動作成する。

## コードの読み方（セクションマップ）

両ファイルとも `# =====` / `// =====` のセクションコメントで区切られている。grep でセクション一覧を取れる。

### `app.py`（バックエンド／約1500行）
`get_db` / `init_db`（スキーマ）→ 以下のAPI群が並ぶ：
会計期間(Periods) / 期首残高・繰越(Opening Balances) / 勘定科目(Accounts) / 補助科目(Sub Accounts) /
仕訳(Journal Entries) / 総勘定元帳(General Ledger) / 試算表(Trial Balance) / 貸借対照表(B/S) /
活動計算書(P/L) / 予実分析(Budget) / 月次推移 / 監査レポート / 整合性チェック(Integrity) / エクスポート・インポート

### `static/js/app.js`（フロント／約2900行）
`State` / `API helpers` / 整合性チェッカー / `Init` / `Navigation` を起点に、
仕訳フォーム・かんたん入力アシスタント・各帳票（元帳/試算表/B/S/活動計算書/予実/月次推移/監査）・
科目/期間管理・CSV取込・イベント収支 などが画面単位で並ぶ。

```bash
grep -nE "^// =====" static/js/app.js   # フロントのセクション一覧
grep -nE "^@app\.route" app.py          # APIエンドポイント一覧
```

## メンテナンス上の注意

- DB本体・バックアップは `.gitignore` 済み（ローカル運用データのためコミットしない）。
- フロント改修時はJSが参照するクラス名・DOM構造・data属性を壊さないこと（描画ロジックの契約）。
- 詳しいプロジェクト方針はリポジトリ直下の `CLAUDE.md` / `PROJECT_MAP.md` を参照。
