# Tempus

時間割型のタスク管理 PWA。予定の隙間に、やることを置く。

仕様は `docs/SPEC.md`、型は `src/types/domain.ts` が唯一の正。

## 今できること（v1）

- **起票3口**: アプリ内の常時1行入力欄 ／ LINEに一言送る ／ ホーム画面から1タップ
- **必須項目はタイトルだけ**。見積もりは過去の実績の中央値から推定して仮入れ（実績が無ければ30分）、`?` 付きバッジで推定だと分かり、押せば直せる
- **今日の時間割**: Googleカレンダーの予定を読み込んで表示（取得できた時にDBへキャッシュするので、再読み込み後も圏外でも見える）
- **置き方の提案 → 承認**: 空き時間に優先度順で詰めた案を出す。押して初めて確定する
- **実績記録**: 開始/終了の時刻差を取る（裏でタイマーは回さない）。止め忘れると見積もりの3倍 or 4時間超で確認が出る
- **オフライン**: 見る＋起票だけできる。起票はローカルに貯めて復帰時に自動送信

- **タスクの詳細**: 行のタイトル（か右端の▼）を押すと開く。メモ・手順のチェックリスト・部署ルーティンが送ってきた投稿文（コピーボタン付き）が入る。どのタスクにも紐付いていない文案は「貼るだけの文案」カードに出る

まだ無いもの（v2以降）: カレンダー書き戻し・レポート集約（`reports`は溜まるがUIが無い）・定型テンプレ・予算ガード・Valetudo取り込み・共有UI

## 開発

```bash
npm install
cp .env.example .env.local   # 値を埋める
npm run dev                  # http://localhost:5173
npm test                     # 提案アルゴリズムのテスト
npm run verify:db            # マイグレーションを実Postgres(PGlite)に流しRLSを挙動で検証
npm run build
```

`demo.html` は Supabase に繋がずUI部品だけ描く表示確認用（`npm run dev` して `/demo.html`）。本番バンドルには入らない。

---

# セットアップ（二瀬さんが手を動かす部分）

ここは代行できないので、上から順にやれば終わる形にしてある。

## 1. Supabase プロジェクトを作る

1. https://supabase.com でプロジェクト作成。**プランは Free のまま**（クレカを登録しなければ課金は原理的に発生しない）
2. リージョンは `Northeast Asia (Tokyo)`
3. Settings → API から `Project URL` と `anon public` キーを控える
4. `.env.local` に貼る

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

## 2. マイグレーションを流す

```bash
npx supabase link --project-ref <プロジェクトref>
npx supabase db push
```

流れる中身は `npm run verify:db` で実Postgres上での動作を検証済み（RLSが他人を弾くこと・無限再帰しないことを含む）。

## 3. Google ログイン＋カレンダー

1. Google Cloud Console でプロジェクトを作り、**Google Calendar API を有効化**
2. OAuth 同意画面を作る（外部・テストユーザーに自分を追加）
3. 認証情報 → OAuth クライアント ID（ウェブアプリケーション）を作成
   - 承認済みリダイレクト URI に `https://<プロジェクトref>.supabase.co/auth/v1/callback`
4. Supabase → Authentication → Providers → Google を有効化し、クライアントIDとシークレットを貼る
5. Authentication → URL Configuration の Site URL に、開発中は `http://localhost:5173`、公開後は本番URLを入れる

> **既知の制約**: Google のアクセストークンはページを再読み込みすると消える。その時は画面上部に「つなぎ直す」が出る。予定自体はDBにキャッシュ済みなので表示は消えない。

## 4. LINE で起票できるようにする

詳細は `supabase/functions/line-webhook/README.md`。要点だけ:

1. LINE Developers で Messaging API チャネルを作る
2. **応答メッセージを OFF**、Webhook の利用を ON
3. チャネルシークレットとチャネルアクセストークン（長期）を控える
4. デプロイする

```bash
npx supabase secrets set LINE_CHANNEL_SECRET=xxx LINE_CHANNEL_ACCESS_TOKEN=xxx
npx supabase functions deploy line-webhook
```

5. Webhook URL に `https://<ref>.supabase.co/functions/v1/line-webhook` を設定して検証ボタンを押す
6. Bot を友だち追加して何か送る → 「連携がまだです」と自分のユーザーIDが返ってくる
7. そのIDを Supabase のテーブルエディタで `profiles.line_user_id` に入れる
8. もう一度送ると「登録した: ○○」が返る

> 返信は reply API のみ使うので**月200通の制限にはカウントされない**。push は使っていない。

## 5. 公開する（Cloudflare Pages）

```bash
npm run build   # dist/ ができる
```

Cloudflare Pages で `dist` をデプロイ。ビルドコマンド `npm run build`、出力ディレクトリ `dist`、環境変数に `VITE_SUPABASE_URL` と `VITE_SUPABASE_ANON_KEY` を設定。

公開後、スマホのブラウザで開いて**ホーム画面に追加**する。これをしないと iPhone ではプッシュ通知が届かず、1タップ起票のショートカットも使えない。

## 無料枠について

Free プランは超過しても**請求されず、代わりにサービスが制限される**（停止・読み取り専用・402）。守るべきは請求ではなく「止まらないこと」。

- DB 500MB ／ ファイル1GB ／ 通信5GB/月 ／ MAU 5万 ／ Edge関数50万回 ／ 2プロジェクトまで
- **7日間まったく使わないとプロジェクトが停止する**（復帰は可能）
- Supabase に使用量を取るAPIは無いので、監視は自前で作る（v2の予算ガード）
- 通信5GBだけは測れないため、**画像・添付を Supabase Storage に置かない**設計で構造的に回避している
