-- 社長室（秘書）が登録した文案は部署資料からの参考メモで、X の投稿文ではない。
-- これまでは全部 kind='x_post' で入っていたので、秘書の分を 'note' に直す。
-- 以降の登録は agent-ingest が送信元から kind を決める（_shared/clipKind.ts）。
update public.clips
set kind = 'note'
where kind = 'x_post'
  and dedupe_key like 'secretary-%';
