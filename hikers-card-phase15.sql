-- =============================================
-- ハイカーズカード｜Phase 1.5 のDB変更
--
-- 追加するもの：
--   ・カードの背景デザイン（profiles.card_bg）
--   ・SNSリンク4つ（profiles.sns_*）
--   ・登ってよかった山（climbed_mountains.is_favorite）
--   ・これから登りたい山（wishlist_mountains テーブル）
--
-- SQL Editor に貼り付けて、一度にまとめて実行してください。
-- 既存のデータは消えません。何度実行しても同じ結果になります。
-- =============================================


-- ---------------------------------------------
-- profiles に列を追加
-- ---------------------------------------------
alter table public.profiles
  add column if not exists card_bg text not null default 'contour'
    check (card_bg in ('contour','ridge','mist','forest','night')),
  add column if not exists sns_yamap     text check (char_length(sns_yamap)     <= 60),
  add column if not exists sns_yamareco  text check (char_length(sns_yamareco)  <= 60),
  add column if not exists sns_instagram text check (char_length(sns_instagram) <= 60),
  add column if not exists sns_x         text check (char_length(sns_x)         <= 60);


-- ---------------------------------------------
-- 登ってよかった山
--
-- 登った山の中から選ぶものなので、新しいテーブルは作らず
-- climbed_mountains にフラグを足す。
-- 別テーブルにすると「行った山から消したのにお気に入りに残る」
-- という不整合が起きうる。
-- ---------------------------------------------
alter table public.climbed_mountains
  add column if not exists is_favorite boolean not null default false;

-- 好きな山だけを探すとき用
create index if not exists climbed_favorite_idx
  on public.climbed_mountains (user_id) where is_favorite;


-- ---------------------------------------------
-- これから登りたい山
--
-- まだ登っていない山が対象なので、こちらは独立したテーブル。
-- ---------------------------------------------
create table if not exists public.wishlist_mountains (
  user_id uuid not null references public.profiles(id) on delete cascade,
  mountain_id smallint not null references public.mountains(id),
  created_at timestamptz not null default now(),
  primary key (user_id, mountain_id)
);

alter table public.wishlist_mountains enable row level security;

drop policy if exists "wishlist read"   on public.wishlist_mountains;
drop policy if exists "wishlist insert" on public.wishlist_mountains;
drop policy if exists "wishlist delete" on public.wishlist_mountains;

create policy "wishlist read"   on public.wishlist_mountains for select using (true);
create policy "wishlist insert" on public.wishlist_mountains for insert with check (auth.uid() = user_id);
create policy "wishlist delete" on public.wishlist_mountains for delete using (auth.uid() = user_id);


-- ---------------------------------------------
-- 上限5座をDBで守る
--
-- 画面側でも制限するが、それだけだと回避できてしまう。
-- 6件目を入れようとしたらDBが弾くようにしておく。
-- ---------------------------------------------
create or replace function public.limit_favorites()
returns trigger language plpgsql as $$
begin
  if new.is_favorite and (
    select count(*) from public.climbed_mountains
     where user_id = new.user_id and is_favorite
       and mountain_id <> new.mountain_id
  ) >= 5 then
    raise exception 'favorite_limit';
  end if;
  return new;
end;
$$;

drop trigger if exists check_favorite_limit on public.climbed_mountains;
create trigger check_favorite_limit
  before insert or update on public.climbed_mountains
  for each row execute function public.limit_favorites();


create or replace function public.limit_wishlist()
returns trigger language plpgsql as $$
begin
  if (select count(*) from public.wishlist_mountains
       where user_id = new.user_id) >= 5 then
    raise exception 'wishlist_limit';
  end if;
  return new;
end;
$$;

drop trigger if exists check_wishlist_limit on public.wishlist_mountains;
create trigger check_wishlist_limit
  before insert on public.wishlist_mountains
  for each row execute function public.limit_wishlist();


-- =============================================
-- 公開カードの取得を、新しい項目に対応させる
-- =============================================
create or replace function public.get_public_card(p_public_id text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  prof public.profiles%rowtype;
  viewer uuid := auth.uid();
  result jsonb;
  sns jsonb;
begin
  select * into prof from public.profiles where public_id = p_public_id;
  if not found then return null; end if;

  -- 表示名が未設定なら公開しない
  if prof.display_name = '' then return null; end if;

  -- 訪問者がブロックされていたら「存在しない」扱い
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
    'hyakumeizan_done',
      (select count(*) from public.climbed_mountains c
        join public.mountains m on m.id = c.mountain_id
       where c.user_id = prof.id and m.is_hyakumeizan),
    'climbed',
      coalesce((select jsonb_agg(jsonb_build_object(
          'name', m.name, 'hyaku', m.is_hyakumeizan)
          order by m.elevation desc nulls last)
        from public.climbed_mountains c
        join public.mountains m on m.id = c.mountain_id
       where c.user_id = prof.id), '[]'::jsonb),
    'favorites',
      coalesce((select jsonb_agg(jsonb_build_object(
          'name', m.name, 'hyaku', m.is_hyakumeizan)
          order by m.elevation desc nulls last)
        from public.climbed_mountains c
        join public.mountains m on m.id = c.mountain_id
       where c.user_id = prof.id and c.is_favorite), '[]'::jsonb),
    'wishlist',
      coalesce((select jsonb_agg(jsonb_build_object(
          'name', m.name, 'hyaku', m.is_hyakumeizan)
          order by m.elevation desc nulls last)
        from public.wishlist_mountains w
        join public.mountains m on m.id = w.mountain_id
       where w.user_id = prof.id), '[]'::jsonb)
  );

  -- 閲覧者との交換状態（ボタン表示の切り替えに使う）
  if viewer is not null and viewer <> prof.id then
    result := result || jsonb_build_object('exchanged', exists (
      select 1 from public.exchanges
      where user_a = least(viewer, prof.id) and user_b = greatest(viewer, prof.id)));
  end if;

  return result;
end;
$$;

grant execute on function public.get_public_card(text) to anon, authenticated;


-- =============================================
-- コレクションも新しい項目に対応させる
-- =============================================
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
      'hyakumeizan_done',
        (select count(*) from public.climbed_mountains c
          join public.mountains m on m.id = c.mountain_id
         where c.user_id = p.id and m.is_hyakumeizan),
      'climbed',
        coalesce((select jsonb_agg(jsonb_build_object(
            'name', m.name, 'hyaku', m.is_hyakumeizan)
            order by m.elevation desc nulls last)
          from public.climbed_mountains c
          join public.mountains m on m.id = c.mountain_id
         where c.user_id = p.id), '[]'::jsonb),
      'favorites',
        coalesce((select jsonb_agg(jsonb_build_object(
            'name', m.name, 'hyaku', m.is_hyakumeizan)
            order by m.elevation desc nulls last)
          from public.climbed_mountains c
          join public.mountains m on m.id = c.mountain_id
         where c.user_id = p.id and c.is_favorite), '[]'::jsonb),
      'wishlist',
        coalesce((select jsonb_agg(jsonb_build_object(
            'name', m.name, 'hyaku', m.is_hyakumeizan)
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

grant execute on function public.get_my_collection() to authenticated;


-- =============================================
-- 確認用
-- =============================================

-- 列が増えているか
-- select column_name, data_type from information_schema.columns
--  where table_name = 'profiles' order by ordinal_position;

-- wishlist_mountains ができているか
-- select tablename, rowsecurity from pg_tables
--  where schemaname='public' order by tablename;

-- 上限のトリガーが効くか（6件目でエラーになるはず）
-- insert into public.wishlist_mountains (user_id, mountain_id)
-- select (select id from public.profiles where card_no = 1), id
--   from public.mountains limit 6;
