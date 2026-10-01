-- =============================================================
-- ハイカーズカード Step 24：カードづくりを繰り返し確かめるための「テスト用アカウント」
--
--   ・profiles.is_tester … テスト用の印（管理人が小屋番ページから付け外しする）
--   ・admin_set_tester   … テスト用の印を付ける／外す（管理人だけ）
--   ・reset_my_onboarding … テスト用アカウントだけが使える「カードづくりを最初からやり直す」
--
-- やり直すと消えるもの：表示名・ひとこと・背景・診断結果・登録した山・完成の記録
-- 残るもの　　　　　　：カード番号（次に完成したときも同じ番号）・交換相手・登山スキル
--
-- SQL Editor に全文を貼り付けて、一度に実行してください。
-- 何度実行しても壊れないように書いてあります。
--
-- ■ SQL Editor からテスト用にする場合（カード番号で指定。完成前で番号が無い場合は public_id で）
--     select set_config('hc.tester', '1', false);
--     update public.profiles set is_tester = true where card_no = 12;
--     select set_config('hc.tester', '', false);
-- =============================================================


-- ---------- 1. テスト用の印 ----------
alter table public.profiles add column if not exists is_tester boolean not null default false;


-- ---------- 2. 保護トリガー：テスト用の印も、画面からは変えられないようにする ----------
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

  -- テスト用の印は、管理人（admin_set_tester）が許可の印を立てたときだけ変えられる
  if coalesce(current_setting('hc.tester', true), '') <> '1' then
    new.is_tester := old.is_tester;
  end if;

  -- 完成したら、まだ番号の無い人に次の番号を振る
  if new.card_no is null and new.onboarded_at is not null then
    new.card_no := nextval('public.profiles_card_no_seq');
  end if;

  return new;
end;
$$;



-- ---------- 3. テスト用の印を付ける／外す（管理人だけ） ----------
create or replace function public.admin_set_tester(p_public_id text, p_on boolean)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  target uuid;
begin
  if public.my_admin_role() is distinct from 'kanrinin' then
    raise exception 'forbidden';
  end if;

  select id into target from public.profiles where public_id = p_public_id;
  if target is null then return jsonb_build_object('ok', false, 'reason', 'not_found'); end if;

  perform set_config('hc.tester', '1', true);
  update public.profiles set is_tester = coalesce(p_on, false) where id = target;
  perform set_config('hc.tester', '', true);

  return jsonb_build_object('ok', true, 'is_tester', coalesce(p_on, false));
end;
$$;


-- ---------- 4. カードづくりを最初からやり直す（テスト用アカウントだけ） ----------
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
     set display_name = '', comment = null, card_bg = 'contour',
         type_code = null, axis_pe = null, axis_sg = null, axis_lf = null, axis_ca = null,
         onboarded_at = null
   where id = me;
  perform set_config('hc.onboarding', '', true);

  return jsonb_build_object('ok', true);
end;
$$;


-- ---------- 5. ユーザー検索：テスト用の印も返す ----------
create or replace function public.admin_search_users(
  p_query  text default null,
  p_type   text default null,
  p_sort   text default 'new',
  p_limit  int  default 50,
  p_offset int  default 0)
returns jsonb language plpgsql stable security definer set search_path = public, auth as $$
declare
  q    text := nullif(btrim(coalesce(p_query, '')), '');
  t    text := nullif(btrim(coalesce(p_type, '')), '');
  lim  int  := least(greatest(coalesce(p_limit, 50), 1), 200);
  off  int  := greatest(coalesce(p_offset, 0), 0);
  total int;
  allc  int;
  items jsonb;
  my_role text := public.my_admin_role();
  see_email boolean;
begin
  -- 管理人・小屋番でなければ何も返さない
  if my_role is null then
    raise exception 'forbidden';
  end if;
  -- メールアドレスは管理人だけが見られる（小屋番はメールで検索することもできない）
  see_email := my_role = 'kanrinin';

  -- LIKE の特殊文字（% と _）を、ふつうの文字として探せるようにする
  if q is not null then
    q := replace(replace(replace(q, '\', '\\'), '%', '\%'), '_', '\_');
  end if;

  select count(*) into allc from public.profiles;

  select count(*) into total
    from public.profiles p join auth.users u on u.id = p.id
   where public.admin_user_matches(p.display_name, p.public_id, case when see_email then u.email end, p.type_code, p.card_no, q, t);

  select coalesce(jsonb_agg(row_to_json(r)::jsonb), '[]'::jsonb) into items
  from (
    select
      p.public_id, p.card_no, p.display_name, p.type_code,
      case when see_email then u.email end as email,
      p.created_at, u.last_sign_in_at,
      (select count(*) from public.climbed_mountains c where c.user_id = p.id) as climbed,
      (select count(*) from public.exchanges e where p.id in (e.user_a, e.user_b)) as exchanges,
      (select count(*) from public.reports rp where rp.reported_id = p.id and rp.status = 'open') as reports_open,
      (select a.role from public.admins a where a.user_id = p.id) as role,
      p.id = auth.uid() as is_me,
      p.is_tester
    from public.profiles p join auth.users u on u.id = p.id
    where public.admin_user_matches(p.display_name, p.public_id, case when see_email then u.email end, p.type_code, p.card_no, q, t)
    order by
      case when p_sort = 'old'  then p.created_at end asc,
      case when p_sort = 'no'   then p.card_no end asc,
      case when p_sort = 'name' then nullif(p.display_name, '') end asc nulls last,
      case when p_sort = 'login' then u.last_sign_in_at end desc nulls last,
      p.created_at desc
    limit lim offset off
  ) r;

  return jsonb_build_object('total', total, 'all', allc, 'items', items, 'my_role', my_role);
end;
$$;
