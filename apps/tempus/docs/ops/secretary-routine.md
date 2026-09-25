# 秘書ルーティンに Tempus の時間管理をやらせる

対象: クラウドルーティン「朝会＋社長スケジュール」（社長室・秘書／毎朝 8:30 JST）
管理画面: https://claude.ai/code/routines

これまで毎朝の予定案は Drive の Markdown に書かれるだけで、見に行かないと存在しなかった。
Tempus の受け口（`agent-ingest`）に直接投げれば、**朝起きた時点でタスクになっている**状態にできる。

Notion には書けなかった（クラウドルーティンに対応コネクタが無い）が、Supabase は HTTP で叩けるのでこの経路が取れる。

## 事前に必要な設定（1回だけ）

ルーティンの **Network access を Custom** にして `*.supabase.co` を許可する。
これをやらないと外部への HTTP が全部ブロックされて、静かに失敗する。

## ルーティンのプロンプトに追記する文面

以下をそのまま貼る。`<TEMPUS_AGENT_KEY>` は伏せてあるので、
ローカルの `apps/tempus/.secrets.local` にある値に置き換えること。

---

### Tempus への連携（毎回必ず実行する）

その日のスケジュール案とやるべきことを、以下のエンドポイントに POST して Tempus に登録する。

```bash
curl -sS -X POST "https://nucqcatwhwdjsphetops.supabase.co/functions/v1/agent-ingest" \
  -H "x-tempus-agent-key: <TEMPUS_AGENT_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
    "agent": "社長室（秘書）",
    "tasks": [
      {
        "title": "（タスク名。1行で完結させる）",
        "estimateMin": 30,
        "importance": "mid",
        "dueAt": "2026-08-27T18:00:00+09:00",
        "dedupeKey": "secretary-2026-08-27-1"
      }
    ],
    "reports": [
      {
        "source": "社長室（秘書）",
        "title": "朝会ダイジェスト 2026-08-27",
        "bodyMd": "（Driveに書いたのと同じ内容）",
        "reportedFor": "2026-08-27",
        "dedupeKey": "secretary-brief-2026-08-27"
      }
    ]
  }'
```

**守ること:**

- **dedupeKey は必ず付ける。** 日付を含めて一意にする（例 `secretary-2026-08-27-1`）。
  ルーティンが再実行されても同じタスクが二重に作られない。
- **title は1行で完結させる。** 説明は notes ではなく、reports 側に書く。
  Tempus のタスク一覧は一覧性が命なので、長いタイトルは避ける。
- **estimateMin は分単位の整数。** 分からなければ省略してよい（30分が既定で入る）。
  推定であることは Tempus 側がバッジで表示する。
- **importance は low / mid / high のいずれか。** 迷ったら mid。
- **dueAt は必ずタイムゾーン付きで書く**（`+09:00`）。付け忘れると UTC と解釈されて9時間ずれる。
- **本業（会社の仕事）は匿名化して書く。** 顧客名・システム名・手順の中身は書かない。
  「A社の定期作業」「案件1 監視設定見直し」のように書く。
- 1リクエストの tasks / reports / clips は**各100件まで**。ボディは1MBまで。
- 失敗したら（HTTPが200以外）レポートにその旨を書く。**黙って成功したことにしない。**

### X投稿文案を「貼るだけタスク」にする場合

投稿文が生成できた日は `clips` に入れる。Tempus 側にコピーボタン付きで並ぶ。

```json
"clips": [
  {
    "label": "Built Japan 朝の投稿",
    "text": "（そのまま貼れる完成した投稿文）",
    "url": "https://builtjapan.com/buildings/xxxx/",
    "taskDedupeKey": "secretary-2026-08-27-1",
    "dedupeKey": "bj-x-2026-08-27-am"
  }
]
```

**`taskDedupeKey` には、この投稿をやるタスクの `dedupeKey` と同じ値を入れる。**
そうするとタスク行を開いた時に投稿文が出る（コピーボタン付き）。付け忘れると
「貼るだけの文案」カードに落ちて、どのタスクの分か画面から分からなくなる。

**記事URLは直リンクの canonical 形式のまま入れること。** 短縮や中継URLにしない。

---

## 動作確認

登録された結果は Tempus のアプリで見えるほか、SQLでも確認できる。

```sql
select created_at, title, source from public.tasks
 where source = 'routine' order by created_at desc limit 20;

select received_at, agent, counts from public.agent_ingest_log
 order by received_at desc limit 10;
```

## 他のルーティンにも同じ経路が使える

`agent` の値を変えるだけで、どの部署のルーティンからでも投げられる。
レポート集約（Friday商事・Built Japan の各部署）も同じ `reports` を使う。
