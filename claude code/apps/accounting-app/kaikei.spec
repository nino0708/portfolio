# -*- mode: python ; coding: utf-8 -*-
# Kaikei 会計管理 — PyInstaller ビルド定義（単一実行ファイル / onefile）
#
# ビルド:
#   pip install pyinstaller
#   pyinstaller kaikei.spec
# 成果物:
#   dist/Kaikei            (macOS / Linux)
#   dist/Kaikei.exe        (Windows)
#
# 注意: PyInstaller はクロスコンパイル不可。Windows用exeはWindows上で、
#       macOS用はmac上でビルドする必要がある。

block_cipher = None

a = Analysis(
    ['app.py'],
    pathex=[],
    binaries=[],
    # テンプレートと静的ファイルを実行ファイルに同梱する（resource_path で参照）
    datas=[('templates', 'templates'), ('static', 'static')],
    hiddenimports=[],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name='Kaikei',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=True,          # サーバーのログ表示＆ウィンドウを閉じて終了できるようにする
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
