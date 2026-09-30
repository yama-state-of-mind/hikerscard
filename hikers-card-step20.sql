-- =============================================================
-- ハイカーズカード Step 20：カード番号の発行タイミングを変える
--
-- これまで：アカウントを作った瞬間に番号が振られていた
--           （メールを送っただけ・Googleでログインしただけの空のアカウントにも番号が付いた）
-- これから：「表示名の入力」と「診断」の両方がそろった瞬間に、はじめて番号を振る
--           （どちらを先に済ませても、そろった時点で発行。発行後は変わらない）
--
-- SQL Editor に全文を貼り付けて、一度に実行してください。
-- 何度実行しても壊れないように書いてあります。
--
-- すでに番号を持っている人の番号は変えません。
-- =============================================================


-- ---------- 1. 自動採番をやめて、番号を空にできるようにする ----------
alter table public.profiles alter column card_no drop identity if exists;
alter table public.profiles alter column card_no drop not null;

-- 番号は専用の連番から取る。いまの最大の番号の続きから始める
create sequence if not exists public.profiles_card_no_seq as integer;

select setval(
  'public.profiles_card_no_seq',
  coalesce((select max(card_no) from public.profiles), 1),
  (select max(card_no) from public.profiles) is not null   -- 誰もいなければ次は 1
);

-- 画面（publishable キー）から連番を進められないようにする
revoke all on sequence public.profiles_card_no_seq from anon, authenticated;


-- ---------- 2. 条件がそろったら番号を振る ----------
--
-- プロフィールが更新されるたびに動く既存のトリガー関数に、採番を足す。
--   ・番号は一度振ったら変えない（画面から書き換えようとしても元に戻す）
--   ・まだ番号が無く、表示名と診断結果がそろったら、次の番号を振る
--
-- security definer にしているのは、ログイン中の利用者の権限では
-- 連番（sequence）を進められないようにしてあるため。
create or replace function public.protect_profile_fields()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.updated_at := now();
  new.public_id  := old.public_id;   -- URLは変更不可
  new.card_no    := old.card_no;     -- カード番号も変更不可
  new.created_at := old.created_at;

  if new.card_no is null
     and coalesce(btrim(new.display_name), '') <> ''
     and new.type_code is not null then
    new.card_no := nextval('public.profiles_card_no_seq');
  end if;

  return new;
end;
$$;


-- ---------- 3. 管理者の検索：番号の無い人は「カードNo.順」で最後に ----------
-- （admin_search_users は order by card_no asc なので、null は自動的に最後になる。変更不要）


-- =============================================================
-- （任意）確認用
-- =============================================================

-- 番号を持っているのに、表示名か診断がまだの人（これまでに発行された「空の番号」）
--   select card_no, display_name, type_code, created_at
--     from public.profiles
--    where card_no is not null
--      and (coalesce(btrim(display_name), '') = '' or type_code is null)
--    order by card_no;
--
-- ↑ の人たちの番号を外したい場合（外すと、入力と診断を終えた時点で新しい番号が振られる）。
-- 　外した番号は再利用されず欠番になります。実行するかは内容を見てから判断してください。
--   update public.profiles set card_no = null ... は保護トリガーで戻されるため、
--   いったんトリガーを止めて実行する：
--
--   alter table public.profiles disable trigger on_profile_update;
--   update public.profiles
--      set card_no = null
--    where coalesce(btrim(display_name), '') = '' or type_code is null;
--   alter table public.profiles enable trigger on_profile_update;
