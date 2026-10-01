-- =============================================================
-- ハイカーズカード Step 23：カードづくり（初期登録）を完了してからカード番号を発行
--
-- 新しく登録した人は「カードづくり」の画面で
--   名前 → 登山タイプ診断 → 山の仕分け → ベスト3 → 完成
-- と進み、完成した時点でカード番号が発行される。
--
-- 完成の条件（complete_onboarding が確かめる）
--   ・表示名がある
--   ・登山タイプ診断の結果がある
--   ・登ってみたい山が1つ以上
--   ・登った山がある人は、登ってよかった山が1つ以上（登った山が0座ならなくてよい）
--
-- 完成前のカードは、公開ページ・裏面・交換のどれにも使えない。
-- すでにカード番号を持っている人は「完成済み」として扱う（影響なし）。
--
-- SQL Editor に全文を貼り付けて、一度に実行してください。
-- 何度実行しても壊れないように書いてあります。
-- =============================================================


-- ---------- 1. 完成した日時 ----------
alter table public.profiles add column if not exists onboarded_at timestamptz;

-- すでにカード番号を持っている人は、完成済みにする
-- （保護トリガーが onboarded_at を書き換えさせないので、この間だけ許可の印を立てる）
select set_config('hc.onboarding', '1', false);
update public.profiles
   set onboarded_at = coalesce(created_at, now())
 where card_no is not null and onboarded_at is null;
select set_config('hc.onboarding', '', false);


-- ---------- 2. 保護トリガー：完成したらカード番号を発行 ----------
--   ・onboarded_at は画面から書き換えられない（complete_onboarding からだけ）
--   ・番号の発行条件を「表示名＋診断」から「カードづくりの完成」に変える
create or replace function public.protect_profile_fields()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.updated_at := now();
  new.public_id  := old.public_id;   -- URLは変更不可
  new.card_no    := old.card_no;     -- カード番号も変更不可
  new.created_at := old.created_at;

  -- 完成の日時は、complete_onboarding が許可の印を立てたときだけ変えられる
  if coalesce(current_setting('hc.onboarding', true), '') <> '1' then
    new.onboarded_at := old.onboarded_at;
  end if;

  -- 完成したら、まだ番号の無い人に次の番号を振る
  if new.card_no is null and new.onboarded_at is not null then
    new.card_no := nextval('public.profiles_card_no_seq');
  end if;

  return new;
end;
$$;


-- ---------- 3. カードづくりを完成させる ----------
--   返すもの：{ ok: true, card_no } または { ok: false, reason }
--     reason … no_name（表示名がない）/ no_type（未診断）/ no_wish（登ってみたい山がない）
--              no_fav（登った山があるのに、登ってよかった山がない）
create or replace function public.complete_onboarding()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  me    uuid := auth.uid();
  prof  public.profiles%rowtype;
  n_climbed int;
  n_fav     int;
  n_wish    int;
begin
  if me is null then raise exception 'not authenticated'; end if;

  select * into prof from public.profiles where id = me;
  if not found then raise exception 'no profile'; end if;

  -- すでに完成していれば、そのまま番号を返す
  if prof.onboarded_at is not null then
    return jsonb_build_object('ok', true, 'card_no', prof.card_no, 'already', true);
  end if;

  if coalesce(btrim(prof.display_name), '') = '' then
    return jsonb_build_object('ok', false, 'reason', 'no_name');
  end if;
  if prof.type_code is null then
    return jsonb_build_object('ok', false, 'reason', 'no_type');
  end if;

  select count(*), count(*) filter (where is_favorite)
    into n_climbed, n_fav
    from public.climbed_mountains where user_id = me;
  select count(*) into n_wish from public.wishlist_mountains where user_id = me;

  if n_wish < 1 then
    return jsonb_build_object('ok', false, 'reason', 'no_wish');
  end if;
  if n_climbed > 0 and n_fav < 1 then
    return jsonb_build_object('ok', false, 'reason', 'no_fav');
  end if;

  -- 完成の日時を記録（保護トリガーに許可の印を見せる）。トリガーが番号を振る
  perform set_config('hc.onboarding', '1', true);
  update public.profiles set onboarded_at = now() where id = me;
  perform set_config('hc.onboarding', '', true);

  select * into prof from public.profiles where id = me;
  return jsonb_build_object('ok', true, 'card_no', prof.card_no);
end;
$$;


-- ---------- 4. 完成前のカードは、交換・公開ページ・裏面に使えない ----------

create or replace function public.issue_exchange_token()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  me uuid := auth.uid();
  t text;
  exp timestamptz := now() + interval '10 minutes';
begin
  if me is null then raise exception 'not authenticated'; end if;

  -- 表示名が未設定のうちは交換できない
  if (select onboarded_at from public.profiles where id = me) is null then   -- カードが完成していなければ交換できない
    raise exception 'profile not ready';
  end if;

  -- 既存の有効なトークンを無効化（同時に複数出さない）
  update public.exchange_tokens
     set revoked = true
   where owner_id = me and revoked = false and expires_at > now();

  loop
    t := public.random_token(16);
    exit when not exists (select 1 from public.exchange_tokens where token = t);
  end loop;

  insert into public.exchange_tokens (token, owner_id, expires_at)
  values (t, me, exp);

  return jsonb_build_object('token', t, 'expires_at', exp);
end;
$$;

create or replace function public.redeem_exchange_token(p_token text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  me uuid := auth.uid();
  tok public.exchange_tokens%rowtype;
  a uuid; b uuid;
  is_new boolean;
begin
  if me is null then raise exception 'not authenticated'; end if;

  select * into tok from public.exchange_tokens where token = p_token;
  if not found then return jsonb_build_object('ok', false, 'reason', 'not_found'); end if;
  if tok.revoked then return jsonb_build_object('ok', false, 'reason', 'revoked'); end if;
  if tok.expires_at <= now() then return jsonb_build_object('ok', false, 'reason', 'expired'); end if;
  if tok.owner_id = me then return jsonb_build_object('ok', false, 'reason', 'self'); end if;

  -- どちらかがブロックしていたら交換できない
  if exists (
    select 1 from public.blocks
    where (blocker_id = tok.owner_id and blocked_id = me)
       or (blocker_id = me and blocked_id = tok.owner_id)
  ) then
    return jsonb_build_object('ok', false, 'reason', 'blocked');
  end if;

  -- 表示名が未設定なら交換できない
  if (select onboarded_at from public.profiles where id = me) is null then   -- カードが完成していなければ交換できない
    return jsonb_build_object('ok', false, 'reason', 'profile_not_ready');
  end if;

  a := least(me, tok.owner_id);
  b := greatest(me, tok.owner_id);

  insert into public.exchanges (user_a, user_b)
  values (a, b)
  on conflict (user_a, user_b)
    do update set last_exchanged_at = now()   -- first_met_at は上書きしない
  returning (xmax = 0) into is_new;

  update public.exchange_tokens
     set use_count = use_count + 1
   where token = p_token;

  -- 新しく交換できたら、QRを見せていた側に「交換しました」のお知らせを残す
  -- （読み取った側は、その場でお祝いの画面を見るので不要）
  if is_new then
    insert into public.notices (user_id, kind, partner_id)
    values (tok.owner_id, 'exchanged', me);
  end if;

  return jsonb_build_object(
    'ok', true,
    'is_new', is_new,
    'partner', (select public_id from public.profiles where id = tok.owner_id));
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
  if prof.onboarded_at is null then return null; end if;   -- 完成前のカードは公開しない

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

create or replace function public.get_card_back(p_public_id text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  viewer uuid := auth.uid();
  prof   public.profiles%rowtype;
  back   public.card_backs%rowtype;
begin
  select * into prof from public.profiles where public_id = p_public_id;
  if not found or prof.onboarded_at is null then return null; end if;   -- 完成前のカードは公開しない

  if viewer is distinct from prof.id then
    if viewer is null then
      return jsonb_build_object('locked', true, 'reason', 'login');
    end if;

    -- どちらかがブロックしていたら、存在しないことにする
    if exists (
      select 1 from public.blocks
       where (blocker_id = prof.id and blocked_id = viewer)
          or (blocker_id = viewer and blocked_id = prof.id)
    ) then
      return null;
    end if;

    if not exists (
      select 1 from public.exchanges
       where user_a = least(viewer, prof.id) and user_b = greatest(viewer, prof.id)
    ) then
      return jsonb_build_object('locked', true, 'reason', 'not_exchanged');
    end if;
  end if;

  select * into back from public.card_backs where user_id = prof.id;

  return jsonb_build_object(
    'locked', false,
    'skills', coalesce((
      select jsonb_object_agg(key, (value->>'level')::int)
        from jsonb_each(coalesce(back.skills, '{}'::jsonb))
       where coalesce((value->>'visible')::boolean, true)
         and (value->>'level')::int between 0 and 5
    ), '{}'::jsonb),
    'updated_at', back.updated_at
  );
end;
$$;
