# プロジェクト地図

必要なときだけ読む。常に読まれるのは直下の `CLAUDE.md` だけ。

## ディレクトリ

| パス | 中身 |
|---|---|
| `apps/tempus/` | 時間割型タスク管理 PWA（本番稼働中）。詳細は `apps/tempus/CLAUDE.md` |
| `apps/accounting-app/` | 団体会計アプリ（Flask + SQLite）。詳細は `apps/accounting-app/CLAUDE.md` |
| `apps/valetudo/` | 体調記録（単一HTML、開くだけ） |
| `apps/drink-calc/` | 飲み会のお酒の本数・費用計算（単一HTML、開くだけ） |
| `apps/brand/builtjapan/`・`apps/brand/friday/` | X用ヘッダー・アイコン素材（ヘッドレス Chrome で `out/` に書き出し） |
| `tools/` | スクリプト: `auto-blog`・`record-blog`（Qiita下書き生成）・`friday-assistant`（LINE通知）・`dividend-portfolio`（高配当株の買付）・`youtube/yt.py`（`/youtube` スキルが使う）・`screenshot.py` |
| `content/` | `games/`・`qiita-drafts/`・`aws-sap-blackbelt-summary/` |
| `infra/contact-form/` | AWS 問い合わせフォーム（Terraform: CloudFront+S3 / API Gateway+Lambda+DynamoDB+SES）。**現在リソースは削除済み（state が空）** |
| `HTMLfiles/` | 問い合わせフォームの GitHub Pages 公開用 HTML（URL が変わるので移動しない） |
| `docs/` | この地図・`routines.md`（ルーティン一覧）・`friday-persona.md`・`cc-features.md`（Claude Code 便利機能カタログ）・`archive/`（使い終わった設計メモ） |
| `.claude/` | `agents/`（aws-ops-advisor・friday-analyst・security-reviewer）・`commands/`（design・drive-up・friday-new-dept・new-skill）・`skills/`（grill-me・youtube）・`settings.json` |

`tools/`・`content/`・`apps/valetudo`・`apps/drink-calc`・`apps/brand/` は Mac にだけあり GitHub 未追跡のことがある。

## 起動

```bash
cd apps/tempus && npm install && npm run dev        # Tempus
cd apps/accounting-app && pip install -r requirements.txt && python app.py   # 会計 → http://localhost:5050
cd tools/friday-assistant && npm install && node scripts/scheduler.js        # .env に LINE_TOKEN
```

## デザイン作業

`/design` で Google Design MCP（`.mcp.json`、`https://design.googleapis.com/mcp`）を使う。好みは memory `user_design_taste.md`（クリーン＋色味・ホーム感）。

## 関連

- ブログ本番は GitHub `nino0708/blog`（このリポジトリには置かない）
- memory: `~/.claude/projects/-Users-itsukinino-portfolio/memory/`
