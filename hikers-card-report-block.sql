-- =============================================
-- ハイカーズカード｜通報・ブロック用のRPC
--
-- 相手の内部ID（profiles.id）はフロントに公開していないので、
-- public_id を受け取って中で引き直す関数を用意する。
--
-- SQL Editor に貼り付けて、一度にまとめて実行してください。
-- 何度実行しても同じ結果になります。
-- =============================================

-- ---------------------------------------------
-- 通報する
--
-- 未ログインでも通報できる（reporter_id は null になる）。
-- p_block を true にすると、同時にブロックもする（ログイン時のみ）。
-- ---------------------------------------------
create or replace function public.submit_report(
  p_public_id text,
  p_reason    text,
  p_detail    text default null,
  p_block     boolean default false
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  me     uuid := auth.uid();
  target uuid;
begin
  select id into target from public.profiles where public_id = p_public_id;
  if target is null then
    return jsonb_build_object('ok', false, 'reason', 'not_found');
  end if;

  if me is not null and me = target then
    return jsonb_build_object('ok', false, 'reason', 'self');
  end if;

  if p_reason is null or btrim(p_reason) = '' then
    return jsonb_build_object('ok', false, 'reason', 'no_reason');
  end if;

  insert into public.reports (reporter_id, reported_id, reason, detail)
  values (me, target, p_reason, nullif(btrim(coalesce(p_detail, '')), ''));

  -- あわせてブロックする場合（ログインしているときだけ）
  if p_block and me is not null then
    insert into public.blocks (blocker_id, blocked_id)
    values (me, target)
    on conflict do nothing;      -- すでにブロック済みなら何もしない
  end if;

  return jsonb_build_object('ok', true);
end;
$$;

grant execute on function public.submit_report(text, text, text, boolean)
  to anon, authenticated;


-- ---------------------------------------------
-- ブロックする
--
-- ブロックと同時に、既存の交換記録が消える（トリガーで実行）。
-- 相手に通知は行かない。
-- ---------------------------------------------
create or replace function public.block_user(p_public_id text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  me     uuid := auth.uid();
  target uuid;
begin
  if me is null then
    return jsonb_build_object('ok', false, 'reason', 'not_authenticated');
  end if;

  select id into target from public.profiles where public_id = p_public_id;
  if target is null then
    return jsonb_build_object('ok', false, 'reason', 'not_found');
  end if;
  if target = me then
    return jsonb_build_object('ok', false, 'reason', 'self');
  end if;

  insert into public.blocks (blocker_id, blocked_id)
  values (me, target)
  on conflict do nothing;

  return jsonb_build_object('ok', true);
end;
$$;

grant execute on function public.block_user(text) to authenticated;


-- ---------------------------------------------
-- ブロックを解除する
--
-- 解除しても、消えた交換記録は戻らない。
-- もう一度繋がるには、改めて交換する必要がある。
-- ---------------------------------------------
create or replace function public.unblock_user(p_public_id text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  me     uuid := auth.uid();
  target uuid;
begin
  if me is null then
    return jsonb_build_object('ok', false, 'reason', 'not_authenticated');
  end if;

  select id into target from public.profiles where public_id = p_public_id;
  if target is null then
    return jsonb_build_object('ok', false, 'reason', 'not_found');
  end if;

  delete from public.blocks
   where blocker_id = me and blocked_id = target;

  return jsonb_build_object('ok', true);
end;
$$;

grant execute on function public.unblock_user(text) to authenticated;


-- ---------------------------------------------
-- ブロック中の一覧
--
-- 解除するための画面で使う。
-- 相手の表示名は、ブロック中でも自分には見える必要がある
-- （誰をブロックしたか分からないと解除できないため）
-- ---------------------------------------------
create or replace function public.get_my_blocks()
returns jsonb language plpgsql security definer set search_path = public as $$
declare me uuid := auth.uid();
begin
  if me is null then
    raise exception 'not authenticated';
  end if;

  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'public_id',    p.public_id,
      'display_name', p.display_name,
      'type_code',    p.type_code,
      'card_no',      p.card_no,
      'blocked_at',   b.created_at
    ) order by b.created_at desc)
    from public.blocks b
    join public.profiles p on p.id = b.blocked_id
   where b.blocker_id = me
  ), '[]'::jsonb);
end;
$$;

grant execute on function public.get_my_blocks() to authenticated;


-- =============================================
-- 確認用
-- =============================================

-- 関数ができているか（4つ並ぶはず）
-- select routine_name from information_schema.routines
--  where routine_schema = 'public'
--    and routine_name in ('submit_report','block_user','unblock_user','get_my_blocks');

-- 通報の一覧（運営用。ユーザーからは読めない）
-- select r.created_at, r.reason, r.detail, r.status,
--        rp.display_name as 通報者, tp.display_name as 対象
--   from public.reports r
--   left join public.profiles rp on rp.id = r.reporter_id
--   join public.profiles tp on tp.id = r.reported_id
--  order by r.created_at desc;
