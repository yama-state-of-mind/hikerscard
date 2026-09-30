-- =============================================================
-- ハイカーズカード Step 21
--
--   1. 管理者を2段階に：「管理人」と「小屋番」
--        管理人 … 小屋番の付与・解除ができる。メールアドレスも見られる
--        小屋番 … ユーザー検索ができる（メールアドレスは見られない・検索にも使えない）
--   2. ユーザー検索に「最終ログイン順」を追加
--   3. カード交換のお知らせ（QRを見せていた側に、次に開いたとき一度だけ出す）
--
-- SQL Editor に全文を貼り付けて、一度に実行してください。
-- 何度実行しても壊れないように書いてあります。
--
-- これまでの管理者は、すべて「管理人」になります。
--
-- ■ 管理人を追加する（SQL Editor から。画面からは管理人を増やせない）
--     insert into public.admins (user_id, role, note)
--     select id, 'kanrinin', '運営' from public.profiles where card_no = 3
--     on conflict (user_id) do update set role = 'kanrinin';
--
-- ■ 小屋番は、管理人が小屋番ページ（/koyaban）の画面から付け外しできる
--
-- ■ いまの管理人・小屋番を確かめる
--     select p.card_no, p.display_name, a.role, a.created_at
--       from public.admins a join public.profiles p on p.id = a.user_id
--      order by a.role, p.card_no;
-- =============================================================


-- ---------- 1. 管理人と小屋番 ----------
alter table public.admins add column if not exists role text not null default 'kanrinin';
alter table public.admins drop constraint if exists admins_role_check;
alter table public.admins add constraint admins_role_check check (role in ('kanrinin', 'koyaban'));
-- これから SQL で追加するときに、うっかり管理人にならないよう既定は小屋番にしておく
alter table public.admins alter column role set default 'koyaban';

-- ログイン中の人の役割（'kanrinin' / 'koyaban' / null）
create or replace function public.my_admin_role()
returns text language sql stable security definer set search_path = public as $$
  select role from public.admins where user_id = auth.uid();
$$;

-- 管理人・小屋番のどちらかなら true（小屋番ページに入れるか）
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- 小屋番の付与・解除（管理人だけ）
--   ・管理人の役割は、画面からは変えられない（SQL Editor から）
--   ・自分自身は変えられない
create or replace function public.admin_set_koyaban(p_public_id text, p_on boolean)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  target uuid;
  cur    text;
begin
  if public.my_admin_role() is distinct from 'kanrinin' then
    raise exception 'forbidden';
  end if;

  select id into target from public.profiles where public_id = p_public_id;
  if target is null then return jsonb_build_object('ok', false, 'reason', 'not_found'); end if;
  if target = auth.uid() then return jsonb_build_object('ok', false, 'reason', 'self'); end if;

  select role into cur from public.admins where user_id = target;
  if cur = 'kanrinin' then return jsonb_build_object('ok', false, 'reason', 'kanrinin'); end if;

  if p_on then
    insert into public.admins (user_id, role, note)
    values (target, 'koyaban', '管理人が付与')
    on conflict (user_id) do nothing;
  else
    delete from public.admins where user_id = target and role = 'koyaban';
  end if;

  return jsonb_build_object('ok', true, 'role', case when p_on then 'koyaban' end);
end;
$$;


-- ---------- 2. ユーザー検索（役割に応じてメールを出し分け・最終ログイン順） ----------
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
      p.id = auth.uid() as is_me
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



-- ---------- 3. カード交換のお知らせ ----------
create table if not exists public.notices (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  kind       text not null check (kind in ('exchanged')),
  partner_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  seen_at    timestamptz
);
create index if not exists notices_unseen_idx on public.notices (user_id) where seen_at is null;

-- 画面からは直接読み書きさせない（take_my_notices 経由だけ）
alter table public.notices enable row level security;

-- 交換の成立（お知らせを残す処理を追加）
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
  if (select display_name from public.profiles where id = me) = '' then
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


-- まだ見ていないお知らせを受け取り、同時に「見た」にする（＝表示は最初の一回だけ）
-- ブロック関係にある相手からのお知らせは出さない
create or replace function public.take_my_notices()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  me uuid := auth.uid();
  result jsonb;
begin
  if me is null then return '[]'::jsonb; end if;

  select coalesce(jsonb_agg(jsonb_build_object(
      'kind', n.kind,
      'created_at', n.created_at,
      'partner', jsonb_build_object(
        'public_id', p.public_id,
        'display_name', p.display_name,
        'type_code', p.type_code))
      order by n.created_at desc), '[]'::jsonb)
    into result
    from public.notices n
    join public.profiles p on p.id = n.partner_id
   where n.user_id = me and n.seen_at is null
     and not exists (
       select 1 from public.blocks b
        where (b.blocker_id = me and b.blocked_id = p.id)
           or (b.blocker_id = p.id and b.blocked_id = me));

  update public.notices set seen_at = now()
   where user_id = me and seen_at is null;

  return result;
end;
$$;
