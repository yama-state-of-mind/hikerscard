-- =============================================================
-- ハイカーズカード Step 19：管理者ページ
--
--   ・admins テーブル        … 管理者のユーザー（SQL Editor からだけ登録する）
--   ・is_admin()             … ログイン中の人が管理者か
--   ・admin_search_users()   … ユーザー検索（管理者だけが使える）
--
-- SQL Editor に全文を貼り付けて、一度に実行してください。
-- 何度実行しても壊れないように書いてあります。
--
-- ■ 管理者を登録する（このファイルとは別に、SQL Editor で実行）
--   カードNo.（カード右上の「No.0003」なら 3）で指定する。
--     insert into public.admins (user_id, note)
--     select id, '運営' from public.profiles where card_no = 3
--     on conflict do nothing;
--
-- ■ 管理者から外す
--     delete from public.admins
--      where user_id = (select id from public.profiles where card_no = 3);
--
-- ■ いまの管理者を確かめる
--     select p.card_no, p.display_name, a.note, a.created_at
--       from public.admins a join public.profiles p on p.id = a.user_id
--      order by p.card_no;
-- =============================================================


-- ---------- 管理者 ----------
create table if not exists public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  note       text,
  created_at timestamptz not null default now()
);

-- RLSを有効にし、ポリシーは作らない。
-- ＝画面（publishable キー）からは誰も読み書きできない。登録は SQL Editor からだけ。
alter table public.admins enable row level security;


-- ---------- ログイン中の人が管理者か ----------
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;


-- ---------- 検索条件に合うか（検索と件数で同じ条件を使うため、関数にまとめる） ----------
--   p_q    … 表示名・公開ID・メールアドレスの部分一致、タイプの完全一致、数字ならカードNo.
--   p_type … 'PGLA' などのタイプ、'none' で未診断のみ、空なら絞り込まない
create or replace function public.admin_user_matches(
  p_name text, p_public_id text, p_email text, p_type_code text, p_card_no int,
  p_q text, p_type text)
returns boolean language sql immutable as $$
  select
    (p_q is null
      or p_name      ilike '%' || p_q || '%' escape '\'
      or p_public_id ilike '%' || p_q || '%' escape '\'
      or p_email     ilike '%' || p_q || '%' escape '\'
      or upper(coalesce(p_type_code, '')) = upper(p_q)
      or (p_q ~ '^[0-9]{1,9}$' and p_card_no = p_q::int))
    and
    (p_type is null
      or (p_type = 'none' and p_type_code is null)
      or p_type_code = upper(p_type));
$$;


-- ---------- ユーザー検索 ----------
--   p_sort … 'new'（登録が新しい順）/ 'old' / 'no'（カードNo.順）/ 'name'（表示名順）
--   返すもの：{ total: 条件に合う人数, all: 全ユーザー数, items: [...] }
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
begin
  -- 管理者でなければ何も返さない
  if not public.is_admin() then
    raise exception 'forbidden';
  end if;

  -- LIKE の特殊文字（% と _）を、ふつうの文字として探せるようにする
  if q is not null then
    q := replace(replace(replace(q, '\', '\\'), '%', '\%'), '_', '\_');
  end if;

  select count(*) into allc from public.profiles;

  select count(*) into total
    from public.profiles p join auth.users u on u.id = p.id
   where public.admin_user_matches(p.display_name, p.public_id, u.email, p.type_code, p.card_no, q, t);

  select coalesce(jsonb_agg(row_to_json(r)::jsonb), '[]'::jsonb) into items
  from (
    select
      p.public_id, p.card_no, p.display_name, p.type_code,
      u.email, p.created_at, u.last_sign_in_at,
      (select count(*) from public.climbed_mountains c where c.user_id = p.id) as climbed,
      (select count(*) from public.exchanges e where p.id in (e.user_a, e.user_b)) as exchanges,
      (select count(*) from public.reports rp where rp.reported_id = p.id and rp.status = 'open') as reports_open,
      exists (select 1 from public.admins a where a.user_id = p.id) as is_admin
    from public.profiles p join auth.users u on u.id = p.id
    where public.admin_user_matches(p.display_name, p.public_id, u.email, p.type_code, p.card_no, q, t)
    order by
      case when p_sort = 'old'  then p.created_at end asc,
      case when p_sort = 'no'   then p.card_no end asc,
      case when p_sort = 'name' then nullif(p.display_name, '') end asc nulls last,
      p.created_at desc
    limit lim offset off
  ) r;

  return jsonb_build_object('total', total, 'all', allc, 'items', items);
end;
$$;
