# Friday商事 ブランドアセット（X / Twitter）

`@friday_sedori` のプロフィール用ヘッダー＆アイコン。HTML/CSS を組んでヘッドレスChromeで実ファイル化している（AI生成画像ではないので破綻・余計なテカリが無い）。

## 成果物（`out/`）

| ファイル | 用途 | 実寸 | 備考 |
|---|---|---|---|
| `friday-header.png` | Xヘッダーバナー | 3000×1000（@2x／推奨1500×500） | 左に余白を確保しアバター重なりを回避 |
| `friday-icon.png` | Xアイコン | 800×800（@2x／推奨400×400） | 円形クロップでも中央のFが残る |

## デザイン仕様

- **方向性**: モダン×シャープ（ダーク基調＋アクセント1色）
- **配色**: ink `#0B0C0E` ／ 温白 `#ECEAE3` ／ 朱(vermilion) `#FB4D27`（紫青グラデなどAIデフォを排除、商社らしい朱を1色だけ効かせる）
- **書体**: Archivo Black（欧文ロゴ）／ Noto Sans JP 900（商事・和文）／ Space Mono（メタ・英字キャプション）
- **モチーフ**: バーコード／スキャン＝せどりの「目利き・仕入れ」を示す。グレイン・レジストレーションマークで印刷物の質感を足しAI感を消す

## 作り直し方

```bash
cd "apps/friday-brand"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=2 \
  --window-size=1500,500 --virtual-time-budget=6000 \
  --screenshot="out/friday-header.png" "file://$PWD/header.html"
"$CHROME" --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=2 \
  --window-size=400,400 --virtual-time-budget=6000 \
  --screenshot="out/friday-icon.png" "file://$PWD/icon.html"
```

文言・色を変えたいときは `header.html` / `icon.html` のテキストと CSS 変数（`:root`）を編集して再レンダー。
