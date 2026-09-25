# usage-guard

**Supabase Freeプランは課金が発生しない。超過してもお金は取られず、その代わりに
サービスが制限される（プロジェクト一時停止／DB読み取り専用／API 402）。**
つまりこれは「請求監視」ではなく「止まらないようにするためのガード」。
Management APIには usage/quota/invoice を取得するエンドポイントが無いため、自分のDBを
自分で毎日測る以外に方法が無い（`docs/SPEC.md`「制約」参照）。

## やっていること

1. `public.collect_usage()`（`supabase/migrations/0009_usage_guard.sql`）を呼び、DBサイズ・
   ストレージ使用量・`auth.users`件数・publicの各テーブル行数を実測して`usage_snapshots`に
   1行記録する
2. 無料枠の上限（DB 500MB / ストレージ1GB / MAU 5万 / Edge関数50万回。ファイル先頭の
   `FREE_TIER_LIMITS`定数）に対する使用率を計算する
3. **70%で警告、90%で強い警告**。どの項目が何%かを日本語メッセージにする
4. **90%以上は毎回**、**70%は前回`none`から初めて跨いだ時だけ**LINEにpushする
   （毎日は鳴らさない。前回の通知状態は`usage_guard_state`テーブルに持つ）
5. `public.prune_usage_snapshots()`を呼び、90日より古いスナップショットを消す
   （予算ガード自身がDB容量を圧迫したら本末転倒なため）
6. 使用率一覧・通知したかどうかをJSONで返す

**この関数が毎日DBを叩くこと自体が、Supabaseの「7日間未使用でプロジェクトが自動停止する」を
防ぐ役割も兼ねている。** 無料枠の話とは別に、動かし続けること自体に意味がある。

**通信5GB/月は測れない。** Postgres/Storageの中から観測できる値ではないため、この関数は
測ろうとしない（測れないものを測ったふりをしない）。設計側で画像・添付をSupabaseに置かない
方針にして構造的に食わせないようにしている（`docs/SPEC.md`）。レスポンスにも
`networkEgress: "unmeasured (structurally avoided instead — see README.md)"`として明示する。

**Edge関数の呼び出し回数（50万回/月枠）も同じ理由で測れない。** Management APIにusage系の
エンドポイントが無く、DBの中からも観測できないため、`ratioPercent`は常に`null`になる
（0%として誤魔化さない）。将来Supabaseダッシュボードの表示値を見て手動で判断する前提。

## 二瀬さんが手を動かす作業（必須）

### 1. 共有シークレットを決めて設定する

外部のスケジューラからこのEdge Functionを叩く時に使う認証キー。適当なランダム文字列でよい
（例: `openssl rand -hex 32`）。

```bash
supabase secrets set USAGE_GUARD_KEY=<ランダムな文字列>
```

### 2. LINE通知を使うなら（任意）

`line-webhook`と同じLINEチャネルを使い回してよい。

```bash
supabase secrets set LINE_CHANNEL_ACCESS_TOKEN=xxxxx
supabase secrets set LINE_USER_ID=<自分のLINEユーザーID>
```

未設定でも動く。その場合は70%/90%の判定・記録はするが、LINE送信だけスキップし、
レスポンスの`notifySkippedReason`にその旨が入る。

`SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` はSupabaseが自動的にEdge Functionへ注入するため、
通常は手動設定不要（ダッシュボードのProject Settings > API Keysに同じ値がある）。

### 3. マイグレーションを適用してデプロイする

```bash
# プロジェクトと未リンクなら先にリンク（1回だけ）
supabase link --project-ref <プロジェクトref>

# マイグレーション適用（usage_snapshots / collect_usage() / usage_guard_state を作る）
supabase db push

# デプロイ
supabase functions deploy usage-guard
```

### 4. 毎日1回叩くように設定する（必須・これをやらないと動かない）

Edge Function自体はデプロイしても勝手には動かない。外部から毎日1回HTTPで叩く仕組みが要る。
どちらか一方でよい。

#### 方法A: GitHub Actions cron（無料・おすすめ）

このリポジトリに`.github/workflows/usage-guard.yml`を追加する（他の担当ファイルと衝突しない
名前ならどこでもよい）。

```yaml
name: usage-guard daily
on:
  schedule:
    - cron: "0 21 * * *" # 06:00 JST（UTC+9なので21:00 UTC）
  workflow_dispatch: {} # 手動実行もできるようにしておく

jobs:
  call:
    runs-on: ubuntu-latest
    steps:
      - name: Call usage-guard
        run: |
          curl -sS -X POST \
            -H "x-usage-guard-key: ${{ secrets.USAGE_GUARD_KEY }}" \
            "https://<プロジェクトref>.supabase.co/functions/v1/usage-guard"
```

GitHubリポジトリの Settings > Secrets and variables > Actions に `USAGE_GUARD_KEY` を
（手順1で設定したものと同じ値で）登録する。

#### 方法B: Supabase pg_cron + pg_net

Supabaseダッシュボードの Database > Extensions で `pg_cron` と `pg_net` を有効化してから、
SQLエディタで以下を実行する（`<プロジェクトref>`と`<USAGE_GUARD_KEYの値>`は実際の値に置換）。

```sql
select cron.schedule(
  'usage-guard-daily',
  '0 21 * * *', -- 06:00 JST
  $$
  select net.http_post(
    url := 'https://<プロジェクトref>.supabase.co/functions/v1/usage-guard',
    headers := jsonb_build_object('x-usage-guard-key', '<USAGE_GUARD_KEYの値>'),
    body := '{}'::jsonb
  );
  $$
);
```

こちらはSQLエディタにシークレットを平文で貼ることになる点に注意（GitHub Actions側は
Secretsに隠せるのでそちらの方が安全）。どちらか一方が動いていればよい。

## 環境変数一覧

| 変数名 | 用途 | 必須 |
|---|---|---|
| `USAGE_GUARD_KEY` | 呼び出し元の認証（`x-usage-guard-key`ヘッダとタイミングセーフ比較） | 必須 |
| `SUPABASE_URL` | Supabaseクライアント接続先 | 必須（通常は自動注入） |
| `SUPABASE_SERVICE_ROLE_KEY` | `collect_usage()`/`prune_usage_snapshots()`のRPC呼び出しに使用 | 必須（通常は自動注入） |
| `LINE_CHANNEL_ACCESS_TOKEN` | LINE push APIの認証 | 任意（無ければ通知だけスキップ） |
| `LINE_USER_ID` | 通知の送信先LINEユーザーID | 任意（無ければ通知だけスキップ） |

`USAGE_GUARD_KEY`/`SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY`のいずれか1つでも未設定だと
Edge Functionは起動時に例外を投げて即失敗する（ログにどの変数が足りないか出る）。

## 動作の細部

- `x-usage-guard-key`ヘッダが無い/不一致なら401（タイミングセーフ比較）
- LINE pushはreply APIと違い月200通の無料枠を消費するため、90%以上か70%を初めて跨いだ時
  だけ送る。既に警告済みで状態が悪化していなければ黙る
- 閾値判定は「以上」で切る（70.0%はwarn、89.9%はwarnのまま、90.0%でcritical）
- 各項目の使用率が測れなかった（値がnull）場合はその項目を判定から除外する
- レスポンスは常にJSON。集計や通知の失敗は500で返す（このEdge Function自体は外部
  スケジューラから叩かれるだけなので、line-webhookのように常に200を返す必要は無い）
