# 朝7:00のルーティンを Tempus に繋ぐ

対象: クラウドルーティン **builtjapan-daily-article（Built Japan 編集部・毎日7:00 JST）** と
**friday-sourcing-research（Friday商事 仕入れリサーチ部・毎日7:00 JST）**
管理画面: https://claude.ai/code/routines

## なぜこれで足りるのか

Tempus 側に「7時に起こす」仕組みを別途作る必要はない。**ルーティンの実行時刻がそのままトリガー**になる。

- 7:00 にルーティンが動く → その中で `agent-ingest` に POST → `tasks` に行が入る
- アプリを開いた時にその行が読まれて「やること（優先順）」に並ぶ

注意すべきなのは次の2点だけ。

1. **Tempus はプッシュしない。** 7:00 に通知は来ない。7:00 時点で「開けば載っている」状態になるだけ。
2. **`Network access` を Custom にして `*.supabase.co` を許可する。** 既定のままだと外部への
   HTTP が全部ブロックされ、**静かに失敗する**（ルーティンのログにも成功と出かねない）。

「毎日やる作業」（`recurrences`）とは別の経路なので混同しないこと。あちらは**アプリを開いた時**に
その日の分を起票する仕組みで、時刻を持たない。決まった時刻に決まった中身を出したいものは、
こちらのルーティン経由にする。

## ルーティンのプロンプトに追記する文面

以下をそのまま貼る。`<TEMPUS_AGENT_KEY>` は伏せてあるので、ローカルの
`apps/tempus/.secrets.local` にある値に置き換えること。`<部署名>` は各ルーティンの部署名にする。

---

### Tempus への連携（毎回必ず実行する）

その日にやるべきことと、生成した投稿文案を以下のエンドポイントに POST して Tempus に登録する。

```bash
curl -sS -X POST "https://nucqcatwhwdjsphetops.supabase.co/functions/v1/agent-ingest" \
  -H "x-tempus-agent-key: <TEMPUS_AGENT_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
    "agent": "<部署名>",
    "tasks": [
      {
        "title": "<部署名> X投稿",
        "notes": "（何のための投稿か・どう判断したかを数行で）",
        "estimateMin": 10,
        "importance": "mid",
        "dedupeKey": "sourcing-x-2026-08-27"
      }
    ],
    "clips": [
      {
        "label": "<部署名> 朝の投稿",
        "text": "（そのまま貼れる完成した投稿文。改行もそのまま入れてよい）",
        "url": "https://builtjapan.com/buildings/xxxx/",
        "taskDedupeKey": "sourcing-x-2026-08-27",
        "dedupeKey": "sourcing-x-clip-2026-08-27"
      }
    ]
  }'
```

**守ること:**

- **`clips` の `taskDedupeKey` に、対応する task の `dedupeKey` と同じ値を入れる。**
  これでタスク行を開いた時にその投稿文が出る（コピーボタン付き）。
  付け忘れると投稿文は「貼るだけの文案」カードに落ちて、タスクと繋がらない。
- **dedupeKey は日付を含めて一意にする**（例 `sourcing-x-2026-08-27`）。
  再実行しても二重に増えない。同じ内容の再送は安全なので、失敗したら遠慮なくリトライしてよい。
- **title は1行で完結させる。** 長い説明は `notes` に、レポート本文は `reports` に入れる。
- **estimateMin は分単位の整数。** 省略するとDBの既定（30分・推定扱い）になる。
- **dueAt を書くならタイムゾーン付き**（`+09:00`）。付け忘れると UTC と解釈されて9時間ずれる。
- **本業（会社の仕事）は匿名化して書く。** 顧客名・システム名・手順の中身は書かない。
- 1リクエストの tasks / reports / clips は**各100件まで**。ボディは1MBまで。
- **失敗したら（HTTPが200以外）レポートにその旨を書く。黙って成功したことにしない。**
  レスポンスに `warnings` が入っていた場合もそのまま書く（例: taskDedupeKey が一致しなかった）。

---

## 動作確認

```bash
# 7:00 の実行が届いているか
select received_at, agent, counts from public.agent_ingest_log
 where agent in ('編集部', '仕入れリサーチ部')
 order by received_at desc limit 10;

# タスクと投稿文が繋がっているか（task_id が入っていれば詳細に出る）
select c.label, c.task_id, t.title
  from public.clips c left join public.tasks t on t.id = c.task_id
 order by c.created_at desc limit 10;
```

`task_id` が null のクリップはアプリの「貼るだけの文案」カードに出る。
消えてはいないが、タスクとは繋がっていないということ。
