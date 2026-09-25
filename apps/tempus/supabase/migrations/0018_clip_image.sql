-- Tempus: clips に画像プレビュー用のURLを足す。
--
-- Built Japan編集部のようにheroImageを既に持っているルーティンは、Tempus側で
-- OGPを取りに行く（CORS・スクレイピングの手間）よりも、投稿文と一緒にimageUrlを
-- 送ってもらう方が確実。投稿済みにした後、UIでその画像をプレビュー表示する。

alter table public.clips
  add column image_url text;

comment on column public.clips.image_url is
  '投稿文に添える画像のURL（任意）。agent-ingestが送ってきた値をそのまま保持し、UIは投稿済みになった後にプレビュー表示する。';
