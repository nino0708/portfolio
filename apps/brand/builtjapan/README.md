# Built Japan ブランドアセット（X / Twitter）

`@builtjapan` のプロフィール用ヘッダー＆アイコン。表示名は **Built Japan**（サイト内部名 "Tokyo Towers Journal" ではなくこちらを使う）。HTML/CSS＋ヘッドレスChromeで実ファイル化（AI生成画像ではない）。配色は既存サイト（apps/tokyo-building-blog）に合わせている。

## 成果物（`out/`）

| ファイル | 用途 | 実寸 | 備考 |
|---|---|---|---|
| `builtjapan-header.png` | Xヘッダー | 3000×1000（@2x／推奨1500×500） | 左に紙かすみ＋テキスト、右に製図カルトゥーシュ |
| `builtjapan-icon.png` | Xアイコン | 800×800（@2x／推奨400×400） | 円形クロップでも中央のタワーが残る |

## デザイン仕様

- **方向性**: 建築設計図（ブループリント）×東京スカイラインのエディトリアル。Friday商事（黒×朱）とは別系統で、サイトの明るい青基調に統一
- **配色**: 図面紙 `#F4F6F9` ／ 製図インク濃紺 `#16243A` ／ ブランド青 `#1F5FAE` ／ 琥珀アクセント `#D98324`（いずれも既存サイトのCSS変数と一致）
- **書体**: Fraunces（欧文ロゴ＝雑誌マストヘッド感）／ Noto Sans JP（和文タグライン）／ Space Mono（製図メタ・キャプション）
- **モチーフ**: スカイライン立面図／方位記号・スケールバー・座標（35.6586°N 139.7454°E）／高さ注記。手描き製図の体裁でAI感を消し「建築好きが作った」質感を出す。ヒーロータワー1棟だけ琥珀で強調

## 作り直し方

```bash
cd "apps/builtjapan-brand"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=2 \
  --window-size=1500,500 --virtual-time-budget=6000 \
  --screenshot="out/builtjapan-header.png" "file://$PWD/header.html"
"$CHROME" --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=2 \
  --window-size=400,400 --virtual-time-budget=6000 \
  --screenshot="out/builtjapan-icon.png" "file://$PWD/icon.html"
```

文言・色を変えるときは `header.html` / `icon.html` のテキストと `:root` CSS変数を編集して再レンダー。
