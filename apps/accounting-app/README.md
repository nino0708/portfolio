# accounting-app

団体会計向けの汎用Web会計アプリ（Python/Flask + SQLite）。NPO法人会計基準（活動計算書）に対応し、複合仕訳・整合性チェック・かんたん入力アシスタントを備える。科目は決め打ちせず動的生成。

## 起動

```bash
cd accounting-app
pip install -r requirements.txt
python app.py        # → http://localhost:5050
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
├── app.py              # 起動口（Blueprint登録・画面 / と /manual・main）
├── common.py           # DB接続・スキーマ初期化(init_db)・会計区分の定数・計算ヘルパー
├── routes/             # API（periods / accounts / entries / reports / data）
├── requirements.txt
├── templates/
│   ├── index.html      # メイン画面（SPA的に1ページで全機能）
│   └── manual.html     # 操作マニュアル（/manual）
├── static/
│   ├── css/style.css
│   └── js/             # 画面。index.html の <script> の順に読み込む
│       ├── core.js         # 状態・API呼び出し・初期化・画面遷移
│       ├── entry-form.js   # 仕訳フォーム・かんたん入力アシスタント・あいまい検索
│       ├── ledger.js       # 仕訳帳・変更削除履歴・総勘定元帳・試算表
│       ├── statements.js   # 期首残高・貸借対照表・活動計算書・予実分析
│       ├── analysis.js     # 純資産変動計算書・月次推移・監査レポート・イベント収支
│       ├── settings.js     # 科目・補助科目・会計期間・データ管理
│       ├── ui.js           # モーダル・期間セレクタ・サイドバー・検索・お知らせ
│       └── csv-import.js   # CSV取込（最後に init() で起動）
├── data/
│   ├── accounting.db   # SQLite本体（gitignore対象。初回起動時に自動生成）
│   └── backups/        # DBの手動バックアップ（gitignore対象）
└── 起動.command / 起動.bat
```

> DBパスは `common.py` の `DATABASE = data/accounting.db`。`init_db()` が初回に自動作成する。

## コードの読み方

直したい機能のファイルだけを開く。JS はトップレベルの const/function を全ファイルで共有する（classic script）ため、読み込み順を変えるときは `init()` が最後になるようにする。

```bash
grep -nE "^// =====" static/js/*.js     # フロントのセクション一覧
grep -rnE "^@bp\.route" routes/        # APIエンドポイント一覧
```

## メンテナンス上の注意

- DB本体・バックアップは `.gitignore` 済み（ローカル運用データのためコミットしない）。
- フロント改修時はJSが参照するクラス名・DOM構造・data属性を壊さないこと（描画ロジックの契約）。
- ファイルの分担は `CLAUDE.md`、リポジトリ全体は直下の `CLAUDE.md` と `docs/PROJECT_MAP.md` を参照。
