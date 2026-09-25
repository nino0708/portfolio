# リモートルーティン（Friday商事・Built Japan）

管理画面: https://claude.ai/code/routines ／ **2026-09-25 に routines API と突き合わせた実態**。
ルーティンのプロンプトは API では編集できない（http_api 作成のため）。変更は管理画面から手で行う。

## 稼働中

| ルーティン | 役割 | 起動(JST) | 触るリポジトリ |
|---|---|---|---|
| Friday商事 朝会＋社長スケジュール提案 | 社長室（秘書）。各部署レポートを読み朝会ダイジェスト＋今日のスケジュールを作り、**Tempusにタスク登録** | 毎日7:00 | - |
| friday-marketing | マーケティング部。**X投稿文を作り Tempus の clips に登録**（`[Friday商事_SNS戦略]` にも出力）。投稿は人が貼る | 毎日7:00 | - |
| friday-alignment | 経営企画室。週次で全部署の認識合わせ | 月9:00 | - |
| friday-accounting-finance | 経理財務部。収支・資金繰り（資本金10万円の上限管理） | 金18:00 | - |
| Built Japan 編集部（記事執筆） | 日英2本を毎日執筆し blog に push＋**X投稿文を Tempus に登録** | 毎日7:00 | blog |
| Built Japan 画像監視部 | 公開後のヒーロー画像チェックと自己修復 | 毎日8:00 | blog |
| 日次ブリーフィング（統合） | Friday商事＋Built Japan を1つの Drive ドキュメントに集約 | 毎日8:00 | - |
| Built Japan 経営企画部（事業計画） | 黒字化逆算・収益分析・生産KPI実測（記事数は `site/src/content/buildings/` から実測） | 月11:00 | portfolio+blog |
| Built Japan デザイン部（サイトUX改善） | UX改善提案（承認制・自動反映なし） | 土10:00 | blog |

## 停止中（⏸）

friday-procurement-decision（COO）／friday-weekly-planning／friday-morning-briefing（Gmail版秘書）／friday-market-analysis（市場分析部）／friday-affiliate-research（2026-09-19停止）／friday-sales-strategy／friday-inventory-logistics／Built Japan 運営部（2026-09-19廃止、経営企画部に統合）／app-glow-up-weekly（2026-09-19停止、関連コマンドも削除済み）

- せどり事業は休止中。停止中部署のレポートが古いのは想定どおり
- friday-sourcing-research（仕入れリサーチ部）は実在しない

## 運用ルール

- **Drive のファイル名は `[資料名][年][月日].md`**（例 `[Friday商事_朝会][2026][0815].md`）。`_最新` は付けず日ごとに積み上げる。日付は必ず JST（ルーティンは UTC 深夜に動く）
- Drive 保存先 parentId: Friday商事 `1QmyZOQ_Jm9kSctrEW-U44oJqNMb61nok`／Built Japan `1No5M0iDywOJaaelPXFEKHk9_5z8y6xmW`（表示名は旧称「タワーズメディア」のまま）
- Tempus への登録は Edge Function `agent-ingest` に POST（手順は `apps/tempus/docs/ops/`）。クラウド環境のネットワーク許可に `*.supabase.co` が無いと**静かに失敗**する
- ⚠️ 秘書・マーケティング部・編集部のプロンプトに `TEMPUS_AGENT_KEY` が平文で書かれている（要整理）
- ペルソナ: `docs/friday-persona.md`。memory の user_* が更新されたらここも同期し、ルーティンのプロンプトへは管理画面から手で反映
