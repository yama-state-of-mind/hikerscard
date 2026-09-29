-- =============================================================
-- ハイカーズカード Step 18：カードの裏面（登山スキル）
--
--   ・card_backs テーブル … 裏面の中身（登山スキルの自己申告）
--   ・save_card_back      … 裏面を保存する（中身を検証してから書き込む）
--   ・get_card_back       … 裏面を見る。本人と、カードを交換した相手だけが見られる
--
-- SQL Editor に全文を貼り付けて、一度に実行してください。
-- 何度実行しても壊れないように書いてあります。
-- =============================================================


-- ---------- 裏面の中身 ----------
--
-- skills は { "項目キー": { "level": 0〜5, "visible": true/false }, ... }
--   level 0 = 未経験、1〜5 = 段階。登録していない項目はキー自体が無い。
--   項目の一覧（キーと段階の目安）は card-back.js で管理している。
--   項目を増やすときにSQLを変えなくて済むよう、ここでは形だけを検証する。
create table if not exists public.card_backs (
  user_id    uuid primary key references public.profiles(id) on delete cascade,
  skills     jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.card_backs enable row level security;

-- 読むのは本人だけ（編集画面用）。
-- 書き込みは save_card_back 経由だけにするので、insert / update のポリシーは作らない。
-- 相手が見るときは get_card_back 経由（交換済みかどうかを確かめる）。
drop policy if exists "own back read" on public.card_backs;
create policy "own back read" on public.card_backs
  for select using (auth.uid() = user_id);


-- ---------- 裏面を保存する ----------
create or replace function public.save_card_back(p_skills jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  me    uuid := auth.uid();
  k     text;
  v     jsonb;
  lvl   int;
  clean jsonb := '{}'::jsonb;
begin
  if me is null then raise exception 'not authenticated'; end if;

  if p_skills is null or jsonb_typeof(p_skills) <> 'object' then
    raise exception 'invalid_skills';
  end if;

  if (select count(*) from jsonb_object_keys(p_skills)) > 40 then
    raise exception 'too_many_skills';
  end if;

  for k, v in select * from jsonb_each(p_skills) loop
    -- キーは英小文字・数字・_ のみ
    if k !~ '^[a-z][a-z0-9_]{1,30}$' then raise exception 'invalid_key'; end if;
    if jsonb_typeof(v) <> 'object' then raise exception 'invalid_value'; end if;
    if jsonb_typeof(v->'level') <> 'number' then raise exception 'invalid_level'; end if;

    lvl := (v->>'level')::numeric::int;
    if lvl < 0 or lvl > 5 or (v->>'level')::numeric <> lvl then
      raise exception 'invalid_level';
    end if;

    -- 必要なものだけを、決まった形で保存する
    clean := clean || jsonb_build_object(k, jsonb_build_object(
      'level', lvl,
      'visible', coalesce((v->>'visible')::boolean, true)));
  end loop;

  insert into public.card_backs (user_id, skills, updated_at)
  values (me, clean, now())
  on conflict (user_id) do update
    set skills = excluded.skills, updated_at = now();

  return jsonb_build_object('ok', true);
end;
$$;


-- ---------- 裏面を見る ----------
--
-- 返すもの：
--   null                                   … カードが無い／ブロック関係にある
--   { locked: true, reason: 'login' }      … 未ログイン
--   { locked: true, reason: 'not_exchanged' } … まだ交換していない
--   { locked: false, skills: {キー: 段階}, updated_at }
--      … 表示オンの項目だけ。本人が見ても同じ（相手からの見え方を確かめられる）
create or replace function public.get_card_back(p_public_id text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  viewer uuid := auth.uid();
  prof   public.profiles%rowtype;
  back   public.card_backs%rowtype;
begin
  select * into prof from public.profiles where public_id = p_public_id;
  if not found or prof.display_name = '' then return null; end if;

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
