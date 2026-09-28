-- =============================================================
-- ハイカーズカード Step 17
--
--   1. 行ってよかった山に順位（1〜5位）を付ける   … favorite_rank
--   2. 踏破状況の「その他」も表示の出し分けができる … vis_rank_other
--   3. 登った山・よかった山・登りたい山を一度に保存する RPC
--   4. カードを返す RPC を、上の2つに合わせて更新
--
-- SQL Editor に全文を貼り付けて、一度に実行してください。
-- 何度実行しても壊れないように書いてあります。
-- =============================================================


-- ---------- 1. 行ってよかった山の順位 ----------
alter table public.climbed_mountains
  add column if not exists favorite_rank smallint
  check (favorite_rank between 1 and 5);

-- 同じ人の中で順位が重ならないようにする
create unique index if not exists climbed_favorite_rank_uniq
  on public.climbed_mountains (user_id, favorite_rank)
  where favorite_rank is not null;

-- 既存の「よかった山」に、これまでの表示順（標高の高い順）で順位を振る
with ranked as (
  select c.user_id, c.mountain_id,
         row_number() over (partition by c.user_id
                            order by m.elevation desc nulls last, m.id) as rn
    from public.climbed_mountains c
    join public.mountains m on m.id = c.mountain_id
   where c.is_favorite and c.favorite_rank is null
)
update public.climbed_mountains c
   set favorite_rank = r.rn
  from ranked r
 where c.user_id = r.user_id and c.mountain_id = r.mountain_id
   and r.rn <= 5;


-- ---------- 2. 「その他」の表示設定 ----------
alter table public.profiles
  add column if not exists vis_rank_other boolean not null default true;


-- ---------- 3. 山の登録をまとめて保存 ----------
--
-- 画面では3つを行き来しながら選ぶので、保存も1回で済ませる。
-- 途中で失敗しても半端な状態が残らないよう、1つの関数（=1トランザクション）にしている。
--
--   p_climbed   … 登った山のID
--   p_favorites … 行ってよかった山のID（配列の順番がそのまま1位〜5位）
--   p_wishlist  … 登ってみたい山のID
create or replace function public.save_my_mountains(
  p_climbed   smallint[],
  p_favorites smallint[],
  p_wishlist  smallint[])
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  me   uuid := auth.uid();
  clim smallint[];
  fav  smallint[];
  wish smallint[];
begin
  if me is null then raise exception 'not authenticated'; end if;

  -- 重複を除く（よかった山は順番を保つ）
  select coalesce(array_agg(distinct x), '{}') into clim
    from unnest(coalesce(p_climbed, '{}')) as x;

  select coalesce(array_agg(x order by first_pos), '{}') into fav
    from (select x, min(ord) as first_pos
            from unnest(coalesce(p_favorites, '{}')) with ordinality as t(x, ord)
           group by x) s;

  select coalesce(array_agg(distinct x), '{}') into wish
    from unnest(coalesce(p_wishlist, '{}')) as x;

  -- 検証
  if cardinality(fav) > 5 then raise exception 'favorite_limit'; end if;
  if cardinality(wish) > 5 then raise exception 'wishlist_limit'; end if;
  if not (fav <@ clim) then raise exception 'favorite_not_climbed'; end if;

  -- 登りたい山のうち、登った山に入っているものは外す
  select coalesce(array_agg(x), '{}') into wish
    from unnest(wish) as x where x <> all(clim);

  -- 登った山：外したものを消し、足したものを入れる
  delete from public.climbed_mountains
   where user_id = me and mountain_id <> all(clim);

  insert into public.climbed_mountains (user_id, mountain_id)
  select me, x from unnest(clim) as x
  on conflict (user_id, mountain_id) do nothing;

  -- よかった山：いったん全部外してから、順位を付け直す
  update public.climbed_mountains
     set is_favorite = false, favorite_rank = null
   where user_id = me and (is_favorite or favorite_rank is not null);

  update public.climbed_mountains c
     set is_favorite = true, favorite_rank = f.ord
    from unnest(fav) with ordinality as f(id, ord)
   where c.user_id = me and c.mountain_id = f.id;

  -- 登りたい山：入れ直す
  delete from public.wishlist_mountains where user_id = me;

  insert into public.wishlist_mountains (user_id, mountain_id)
  select me, x from unnest(wish) as x;

  return jsonb_build_object(
    'ok', true,
    'climbed', cardinality(clim),
    'favorites', cardinality(fav),
    'wishlist', cardinality(wish));
end;
$$;


-- ---------- 4. カードを返す RPC の更新 ----------
--   ・よかった山は順位順に並べ、'pos'（1〜5）を付ける
--   ・「その他」も公開設定を見る

create or replace function public.get_my_card()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  me uuid := auth.uid();
  prof public.profiles%rowtype;
  cnt jsonb;
begin
  if me is null then return null; end if;

  select * into prof from public.profiles where id = me;
  if not found then return null; end if;

  cnt := public.meizan_counts(me);

  return jsonb_build_object(
    'public_id',    prof.public_id,
    'card_no',      prof.card_no,
    'display_name', prof.display_name,
    'comment',      prof.comment,
    'type_code',    prof.type_code,
    'card_bg',      prof.card_bg,
    'axes', jsonb_build_object(
      'pe', prof.axis_pe, 'sg', prof.axis_sg,
      'lf', prof.axis_lf, 'ca', prof.axis_ca),
    'ranks', cnt,
    'climbed',
      coalesce((select jsonb_agg(jsonb_build_object(
          'name', m.name, 'rank', m.meizan_rank)
          order by m.elevation desc nulls last)
        from public.climbed_mountains c
        join public.mountains m on m.id = c.mountain_id
       where c.user_id = me), '[]'::jsonb),
    'favorites',
      coalesce((select jsonb_agg(jsonb_build_object(
          'name', m.name, 'rank', m.meizan_rank, 'pos', c.favorite_rank)
          order by c.favorite_rank nulls last, m.elevation desc nulls last)
        from public.climbed_mountains c
        join public.mountains m on m.id = c.mountain_id
       where c.user_id = me and c.is_favorite), '[]'::jsonb),
    'wishlist',
      coalesce((select jsonb_agg(jsonb_build_object(
          'name', m.name, 'rank', m.meizan_rank)
          order by m.elevation desc nulls last)
        from public.wishlist_mountains w
        join public.mountains m on m.id = w.mountain_id
       where w.user_id = me), '[]'::jsonb)
  );
end;
$$;

create or replace function public.get_public_card(p_public_id text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  prof public.profiles%rowtype;
  viewer uuid := auth.uid();
  result jsonb;
  sns jsonb;
  cnt jsonb;
  ranks jsonb;
begin
  select * into prof from public.profiles where public_id = p_public_id;
  if not found then return null; end if;
  if prof.display_name = '' then return null; end if;

  -- 相手にブロックされていたら「存在しない」ことにする
  if viewer is not null and exists (
    select 1 from public.blocks
    where blocker_id = prof.id and blocked_id = viewer
  ) then
    return null;
  end if;

  -- SNSは入力のあるものだけ返す
  sns := '{}'::jsonb;
  if nullif(btrim(coalesce(prof.sns_yamap,     '')), '') is not null then
    sns := sns || jsonb_build_object('yamap', prof.sns_yamap); end if;
  if nullif(btrim(coalesce(prof.sns_yamareco,  '')), '') is not null then
    sns := sns || jsonb_build_object('yamareco', prof.sns_yamareco); end if;
  if nullif(btrim(coalesce(prof.sns_instagram, '')), '') is not null then
    sns := sns || jsonb_build_object('instagram', prof.sns_instagram); end if;
  if nullif(btrim(coalesce(prof.sns_x,         '')), '') is not null then
    sns := sns || jsonb_build_object('x', prof.sns_x); end if;

  -- 踏破数。公開設定がオンのものだけ含める
  cnt := public.meizan_counts(prof.id);
  ranks := '{}'::jsonb;
  if prof.vis_rank_100   then ranks := ranks || jsonb_build_object('100',   cnt->'100');   end if;
  if prof.vis_rank_200   then ranks := ranks || jsonb_build_object('200',   cnt->'200');   end if;
  if prof.vis_rank_300   then ranks := ranks || jsonb_build_object('300',   cnt->'300');   end if;
  if prof.vis_rank_other then ranks := ranks || jsonb_build_object('other', cnt->'other'); end if;

  result := jsonb_build_object(
    'public_id',    prof.public_id,
    'card_no',      prof.card_no,
    'display_name', prof.display_name,
    'comment',      prof.comment,
    'type_code',    prof.type_code,
    'card_bg',      prof.card_bg,
    'axes', jsonb_build_object(
      'pe', prof.axis_pe, 'sg', prof.axis_sg,
      'lf', prof.axis_lf, 'ca', prof.axis_ca),
    'sns', sns,
    'ranks', ranks,
    'climbed',
      coalesce((select jsonb_agg(jsonb_build_object(
          'name', m.name, 'rank', m.meizan_rank)
          order by m.elevation desc nulls last)
        from public.climbed_mountains c
        join public.mountains m on m.id = c.mountain_id
       where c.user_id = prof.id), '[]'::jsonb),
    'favorites',
      coalesce((select jsonb_agg(jsonb_build_object(
          'name', m.name, 'rank', m.meizan_rank, 'pos', c.favorite_rank)
          order by c.favorite_rank nulls last, m.elevation desc nulls last)
        from public.climbed_mountains c
        join public.mountains m on m.id = c.mountain_id
       where c.user_id = prof.id and c.is_favorite), '[]'::jsonb),
    'wishlist',
      coalesce((select jsonb_agg(jsonb_build_object(
          'name', m.name, 'rank', m.meizan_rank)
          order by m.elevation desc nulls last)
        from public.wishlist_mountains w
        join public.mountains m on m.id = w.mountain_id
       where w.user_id = prof.id), '[]'::jsonb)
  );

  if viewer is not null and viewer <> prof.id then
    result := result || jsonb_build_object('exchanged', exists (
      select 1 from public.exchanges
      where user_a = least(viewer, prof.id) and user_b = greatest(viewer, prof.id)));
  end if;

  return result;
end;
$$;

create or replace function public.get_my_collection()
returns jsonb language plpgsql security definer set search_path = public as $$
declare me uuid := auth.uid();
begin
  if me is null then raise exception 'not authenticated'; end if;

  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'public_id',    p.public_id,
      'card_no',      p.card_no,
      'display_name', p.display_name,
      'comment',      p.comment,
      'type_code',    p.type_code,
      'card_bg',      p.card_bg,
      'axes', jsonb_build_object(
        'pe', p.axis_pe, 'sg', p.axis_sg, 'lf', p.axis_lf, 'ca', p.axis_ca),
      'sns', (
        select coalesce(jsonb_object_agg(k, v), '{}'::jsonb)
        from (values
          ('yamap', p.sns_yamap), ('yamareco', p.sns_yamareco),
          ('instagram', p.sns_instagram), ('x', p.sns_x)
        ) as t(k, v)
        where nullif(btrim(coalesce(v, '')), '') is not null),
      'ranks', (
        select coalesce(jsonb_object_agg(k, v), '{}'::jsonb)
        from (values
          ('100',   case when p.vis_rank_100   then public.meizan_counts(p.id)->'100'   end),
          ('200',   case when p.vis_rank_200   then public.meizan_counts(p.id)->'200'   end),
          ('300',   case when p.vis_rank_300   then public.meizan_counts(p.id)->'300'   end),
          ('other', case when p.vis_rank_other then public.meizan_counts(p.id)->'other' end)
        ) as t(k, v)
        where v is not null),
      'climbed',
        coalesce((select jsonb_agg(jsonb_build_object(
            'name', m.name, 'rank', m.meizan_rank)
            order by m.elevation desc nulls last)
          from public.climbed_mountains c
          join public.mountains m on m.id = c.mountain_id
         where c.user_id = p.id), '[]'::jsonb),
      'favorites',
        coalesce((select jsonb_agg(jsonb_build_object(
            'name', m.name, 'rank', m.meizan_rank, 'pos', c.favorite_rank)
            order by c.favorite_rank nulls last, m.elevation desc nulls last)
          from public.climbed_mountains c
          join public.mountains m on m.id = c.mountain_id
         where c.user_id = p.id and c.is_favorite), '[]'::jsonb),
      'wishlist',
        coalesce((select jsonb_agg(jsonb_build_object(
            'name', m.name, 'rank', m.meizan_rank)
            order by m.elevation desc nulls last)
          from public.wishlist_mountains w
          join public.mountains m on m.id = w.mountain_id
         where w.user_id = p.id), '[]'::jsonb),
      'first_met_at', e.first_met_at
    ) order by e.first_met_at desc)
    from public.exchanges e
    join public.profiles p
      on p.id = case when e.user_a = me then e.user_b else e.user_a end
   where me in (e.user_a, e.user_b)
  ), '[]'::jsonb);
end;
$$;
