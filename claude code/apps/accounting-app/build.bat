@echo off
chcp 65001 >nul
REM Windows用: ダブルクリックで Kaikei.exe をビルドする
cd /d "%~dp0"
echo PyInstaller をインストール（未導入なら）...
python -m pip install --quiet pyinstaller || goto :err
echo ビルド中...
python -m PyInstaller --noconfirm --clean kaikei.spec || goto :err
echo.
echo 完了: dist\Kaikei.exe が作成されました。
echo 配布するときは dist\Kaikei.exe を任意のフォルダに置いて実行してください。
echo （データは実行ファイルと同じ場所の data\accounting.db に保存されます）
pause
exit /b 0
:err
echo ビルドに失敗しました。Python が入っているか確認してください。
pause
exit /b 1
