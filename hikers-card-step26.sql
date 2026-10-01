-- =============================================================
-- ハイカーズカード Step 26：カードの背景の刷新と「交換で解放」
--
--   いつでも使える（色だけのシンプルなカード）：雪 snow・苔 moss・砂 sand・空 sky・墨 sumi
--   カードを交換すると使える：
--     1枚 … 山なみ ridge
--     3枚 … 朝焼け morgen・雲海 unkai
--     5枚 … 地形図 topo・夜空 night
--
--   廃止した背景は置き換える：等高線 contour → 雪、朝もや mist → 砂、木立 forest → 苔
--   すでに山なみ・夜空を使っている人は、枚数が足りなくてもそのまま使える（変えたら戻せない）
--
-- SQL Editor に全文を貼り付けて、一度に実行してください。
-- 何度実行しても壊れないように書いてあります。
-- =============================================================


-- ---------- 1. 背景の種類の制約を入れ替える ----------
-- 古い制約（名前が分からないので、card_bg を見ている check 制約をすべて外す）
do $$
declare c record;
begin
  for c in
    select conname from pg_constraint
     where conrelid = 'public.profiles'::regclass and contype = 'c'
       and pg_get_constraintdef(oid) like '%card_bg%'
  loop
    execute format('alter table public.profiles drop constraint %I', c.conname);
  end loop;
end $$;

-- 廃止した背景を置き換える
update public.profiles set card_bg = 'snow' where card_bg = 'contour';
update public.profiles set card_bg = 'sand' where card_bg = 'mist';
update public.profiles set card_bg = 'moss' where card_bg = 'forest';

alter table public.profiles add constraint profiles_card_bg_check check (card_bg in (
  'snow', 'moss', 'sand', 'sky', 'sumi',
  'ridge', 'morgen', 'unkai', 'topo', 'night'));

alter table public.profiles alter column card_bg set default 'snow';


-- ---------- 2. 保護トリガー：交換枚数が足りない背景には変えられない ----------
create or replace function public.protect_profile_fields()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  need int;
begin
  new.updated_at := now();
  new.public_id  := old.public_id;   -- URLは変更不可
  new.card_no    := old.card_no;     -- カード番号も変更不可
  new.created_at := old.created_at;

  -- 完成の日時は、complete_onboarding が許可の印を立てたときだけ変えられる
  if coalesce(current_setting('hc.onboarding', true), '') <> '1' then
    new.onboarded_at := old.onboarded_at;
  end if;

  -- テスト用の印は、管理人（admin_set_tester）が許可の印を立てたときだけ変えられる
  if coalesce(current_setting('hc.tester', true), '') <> '1' then
    new.is_tester := old.is_tester;
  end if;

  -- カードの背景の鍵：交換した枚数が足りない背景には変えられない
  --   山なみ 1枚 ／ 朝焼け・雲海 3枚 ／ 地形図・夜空 5枚（card.js の THEMES と同じ表）
  --   いま使っている背景のまま（変えない）なら、枚数が足りなくてもそのまま使える
  if new.card_bg is distinct from old.card_bg then
    need := case new.card_bg
              when 'ridge'  then 1
              when 'morgen' then 3
              when 'unkai'  then 3
              when 'topo'   then 5
              when 'night'  then 5
              else 0 end;
    if need > 0 and (select count(*) from public.exchanges e
                      where new.id in (e.user_a, e.user_b)) < need then
      raise exception 'bg_locked';
    end if;
  end if;

  -- 完成したら、まだ番号の無い人に次の番号を振る
  if new.card_no is null and new.onboarded_at is not null then
    new.card_no := nextval('public.profiles_card_no_seq');
  end if;

  return new;
end;
$$;



-- ---------- 3. テスト用のやり直し：背景の初期値を「雪」に ----------
create or replace function public.reset_my_onboarding()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  me uuid := auth.uid();
begin
  if me is null then raise exception 'not authenticated'; end if;

  -- テスト用でなければ使えない（一般の利用者は絶対にやり直せない）
  if not coalesce((select is_tester from public.profiles where id = me), false) then
    raise exception 'forbidden';
  end if;

  delete from public.climbed_mountains where user_id = me;
  delete from public.wishlist_mountains where user_id = me;

  -- 完成の記録も消す（保護トリガーに許可の印を見せる）。カード番号は残す
  perform set_config('hc.onboarding', '1', true);
  update public.profiles
     set display_name = '', comment = null, card_bg = 'snow',
         type_code = null, axis_pe = null, axis_sg = null, axis_lf = null, axis_ca = null,
         onboarded_at = null
   where id = me;
  perform set_config('hc.onboarding', '', true);

  return jsonb_build_object('ok', true);
end;
$$;
