#!/bin/bash
# macOS用: ダブルクリックで実行ファイルをビルドする
cd "$(dirname "$0")"
echo "PyInstaller をインストール（未導入なら）..."
python3 -m pip install --quiet pyinstaller || { echo "pip install に失敗しました"; exit 1; }
echo "ビルド中..."
python3 -m PyInstaller --noconfirm --clean kaikei.spec
echo
echo "完了: dist/Kaikei が作成されました。"
echo "配布するときは dist/Kaikei を任意のフォルダに置いて実行してください。"
echo "（データは実行ファイルと同じ場所の data/accounting.db に保存されます）"
