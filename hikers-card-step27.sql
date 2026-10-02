-- =============================================================
-- ハイカーズカード Step 27：山マスタを「場所」のマスタに広げる
--
--   ・種類（kind）    … peak 山頂 ／ ridge 岩稜・難所 ／ scenic 景勝地 ／ course コース（縦走路・古道・海外のトレッキング）
--   ・国（countries） … 海外のときだけ国の2文字コード（tw, fr など）。国旗の表示に使う。国内は空
--   ・所属（parent_id）… 岩稜・景勝地などが、どの山・山域にあるか（ジャンダルム → 穂高岳）
--   ・表示名（display_name）… 画面に出す名前。管理用の name と違うときだけ入れる（雪山（台湾） → 雪山）
--
-- 追加する場所（59か所）
--   景勝地 10（五色台は「その他の山」から景勝地に変更、計11）／ コース 2 ／ 山頂 5 ／ 岩稜・難所 18 ／ 海外 24
--
-- 踏破状況の件数（meizan_counts）
--   百・二百・三百名山は今までどおり。「その他」は名山以外の国内の山頂だけになり、
--   岩稜・難所（ridge）、海外（overseas）、景勝地・コース（scenic）を別に数える。
--   景勝地・コースは山頂の踏破には数えない。
--
-- SQL Editor に全文を貼り付けて、一度に実行してください。
-- 何度実行しても同じ結果になります。最後に追加結果の一覧が表示されます。
-- =============================================================


-- ---------- 1. 列を足す ----------
alter table public.mountains add column if not exists kind text not null default 'peak';
alter table public.mountains drop constraint if exists mountains_kind_check;
alter table public.mountains add constraint mountains_kind_check check (kind in ('peak', 'ridge', 'scenic', 'course'));
alter table public.mountains add column if not exists countries text[] not null default '{}';
alter table public.mountains add column if not exists parent_id smallint references public.mountains(id) on delete set null;
alter table public.mountains add column if not exists display_name text;


-- ---------- 2. 場所を追加する（同じ名前があれば上書き） ----------
-- エリア・地域は、所属する山があればその山に合わせる
drop table if exists pg_temp.place_src;
create temp table place_src (name text, display_name text, kind text, countries text[], prefs text[],
                             elevation smallint, kana text, area text, parent text);
insert into place_src values
  ('上高地', null, 'scenic', '{}'::text[], '{長野県}'::text[], 1500, 'かみこうち', null, '穂高岳'),
  ('涸沢カール', null, 'scenic', '{}'::text[], '{長野県}'::text[], 2300, 'からさわかーる', null, '穂高岳'),
  ('尾瀬ヶ原', null, 'scenic', '{}'::text[], '{群馬県,福島県,新潟県}'::text[], 1400, 'おぜがはら', null, '至仏山'),
  ('千畳敷カール', null, 'scenic', '{}'::text[], '{長野県}'::text[], 2612, 'せんじょうじきかーる', null, '木曽駒ヶ岳'),
  ('奥入瀬渓流', null, 'scenic', '{}'::text[], '{青森県}'::text[], null, 'おいらせけいりゅう', '東北', null),
  ('白谷雲水峡', null, 'scenic', '{}'::text[], '{鹿児島県}'::text[], null, 'しらたにうんすいきょう', null, '宮之浦岳'),
  ('蒜山高原', null, 'scenic', '{}'::text[], '{岡山県}'::text[], null, 'ひるぜんこうげん', null, '蒜山'),
  ('秋吉台', null, 'scenic', '{}'::text[], '{山口県}'::text[], null, 'あきよしだい', '中国', null),
  ('四万十川源流域', null, 'scenic', '{}'::text[], '{高知県}'::text[], null, 'しまんとがわげんりゅういき', '四国', null),
  ('北八ヶ岳', null, 'scenic', '{}'::text[], '{長野県}'::text[], null, 'きたやつがたけ', null, '北横岳'),
  ('丹沢主脈', null, 'course', '{}'::text[], '{神奈川県}'::text[], null, 'たんざわしゅみゃく', null, '丹沢山'),
  ('那智の大雲取越', null, 'course', '{}'::text[], '{和歌山県}'::text[], null, 'なちのおおくもとりごえ', '近畿', null),
  ('笠取山', null, 'peak', '{}'::text[], '{山梨県,埼玉県}'::text[], 1953, 'かさとりやま', '奥秩父', null),
  ('摩周岳', null, 'peak', '{}'::text[], '{北海道}'::text[], 857, 'ましゅうだけ', '北海道', null),
  ('竜王山（香川）', '竜王山', 'peak', '{}'::text[], '{香川県,徳島県}'::text[], 1060, 'りゅうおうざん', '四国', null),
  ('宝永山', null, 'peak', '{}'::text[], '{静岡県}'::text[], 2693, 'ほうえいざん', null, '富士山'),
  ('六郎次山', null, 'peak', '{}'::text[], '{香川県}'::text[], null, 'ろくろうじやま', '四国', null),
  ('槍ヶ岳の穂先', null, 'ridge', '{}'::text[], '{長野県,岐阜県}'::text[], 3180, 'やりがたけのほさき', null, '槍ヶ岳'),
  ('大キレット', null, 'ridge', '{}'::text[], '{長野県,岐阜県}'::text[], null, 'だいきれっと', null, '穂高岳'),
  ('ジャンダルム', null, 'ridge', '{}'::text[], '{長野県,岐阜県}'::text[], 3163, 'じゃんだるむ', null, '穂高岳'),
  ('馬ノ背（奥穂高岳）', '馬ノ背', 'ridge', '{}'::text[], '{長野県,岐阜県}'::text[], null, 'うまのせ', null, '穂高岳'),
  ('西穂独標', null, 'ridge', '{}'::text[], '{長野県,岐阜県}'::text[], 2701, 'にしほどっぴょう', null, '穂高岳'),
  ('不帰ノ嶮', null, 'ridge', '{}'::text[], '{長野県,富山県}'::text[], null, 'かえらずのけん', null, '唐松岳'),
  ('八峰キレット', null, 'ridge', '{}'::text[], '{長野県,富山県}'::text[], null, 'はちみねきれっと', null, '鹿島槍ヶ岳'),
  ('牛首（唐松岳）', '牛首', 'ridge', '{}'::text[], '{長野県,富山県}'::text[], null, 'うしくび', null, '唐松岳'),
  ('カニのタテバイ', null, 'ridge', '{}'::text[], '{富山県}'::text[], null, 'かにのたてばい', null, '剱岳'),
  ('カニのヨコバイ', null, 'ridge', '{}'::text[], '{富山県}'::text[], null, 'かにのよこばい', null, '剱岳'),
  ('鋸岳の縦走路', null, 'ridge', '{}'::text[], '{山梨県,長野県}'::text[], null, 'のこぎりだけのじゅうそうろ', null, '鋸岳'),
  ('宝剣岳', null, 'ridge', '{}'::text[], '{長野県}'::text[], 2931, 'ほうけんだけ', null, '木曽駒ヶ岳'),
  ('横岳の岩稜', null, 'ridge', '{}'::text[], '{長野県}'::text[], null, 'よこだけのがんりょう', null, '横岳'),
  ('蟻の塔渡り', null, 'ridge', '{}'::text[], '{長野県}'::text[], null, 'ありのとわたり', null, '戸隠山'),
  ('表妙義縦走', null, 'ridge', '{}'::text[], '{群馬県}'::text[], null, 'おもてみょうぎじゅうそう', null, '妙義山'),
  ('西黒尾根', null, 'ridge', '{}'::text[], '{群馬県}'::text[], null, 'にしくろおね', null, '谷川岳'),
  ('八丁尾根', null, 'ridge', '{}'::text[], '{埼玉県,群馬県}'::text[], null, 'はっちょうおね', null, '両神山'),
  ('石鎚山の鎖場', null, 'ridge', '{}'::text[], '{愛媛県}'::text[], null, 'いしづちさんのくさりば', null, '石鎚山'),
  ('玉山', null, 'peak', '{tw}'::text[], '{}'::text[], 3952, 'ぎょくざん', 'アジア', null),
  ('雪山（台湾）', '雪山', 'peak', '{tw}'::text[], '{}'::text[], 3886, 'せっさん', 'アジア', null),
  ('キナバル山', null, 'peak', '{my}'::text[], '{}'::text[], 4095, 'きなばるさん', 'アジア', null),
  ('漢拏山', null, 'peak', '{kr}'::text[], '{}'::text[], 1947, 'はんらさん', 'アジア', null),
  ('北漢山', null, 'peak', '{kr}'::text[], '{}'::text[], 836, 'ぷかんさん', 'アジア', null),
  ('黄山', null, 'peak', '{cn}'::text[], '{}'::text[], 1864, 'こうざん', 'アジア', null),
  ('リンジャニ山', null, 'peak', '{id}'::text[], '{}'::text[], 3726, 'りんじゃにさん', 'アジア', null),
  ('モンブラン', null, 'peak', '{fr,it}'::text[], '{}'::text[], null, 'もんぶらん', 'ヨーロッパ', null),
  ('マッターホルン', null, 'peak', '{ch,it}'::text[], '{}'::text[], 4478, 'まったーほるん', 'ヨーロッパ', null),
  ('キリマンジャロ', null, 'peak', '{tz}'::text[], '{}'::text[], 5895, 'きりまんじゃろ', 'アフリカ', null),
  ('ハーフドーム', null, 'peak', '{us}'::text[], '{}'::text[], 2694, 'はーふどーむ', '北米', null),
  ('レーニア山', null, 'peak', '{us}'::text[], '{}'::text[], 4392, 'れーにあさん', '北米', null),
  ('アコンカグア', null, 'peak', '{ar}'::text[], '{}'::text[], 6961, 'あこんかぐあ', '南米', null),
  ('コジオスコ山', null, 'peak', '{au}'::text[], '{}'::text[], 2228, 'こじおすこさん', 'オセアニア', null),
  ('エベレスト・ベースキャンプ', null, 'course', '{np}'::text[], '{}'::text[], null, 'えべれすとべーすきゃんぷ', 'アジア', null),
  ('アンナプルナ・ベースキャンプ', null, 'course', '{np}'::text[], '{}'::text[], null, 'あんなぷるなべーすきゃんぷ', 'アジア', null),
  ('ツール・ド・モンブラン', null, 'course', '{fr,it,ch}'::text[], '{}'::text[], null, 'つーるどもんぶらん', 'ヨーロッパ', null),
  ('トレ・チーメ周遊', null, 'course', '{it}'::text[], '{}'::text[], null, 'とれちーめしゅうゆう', 'ヨーロッパ', null),
  ('ジョン・ミューア・トレイル', null, 'course', '{us}'::text[], '{}'::text[], null, 'じょんみゅーあとれいる', '北米', null),
  ('インカ道', null, 'course', '{pe}'::text[], '{}'::text[], null, 'いんかみち', '南米', null),
  ('トレス・デル・パイネ', null, 'course', '{cl}'::text[], '{}'::text[], null, 'とれすでるぱいね', '南米', null),
  ('フィッツロイ展望トレイル', null, 'course', '{ar}'::text[], '{}'::text[], null, 'ふぃっつろいてんぼうとれいる', '南米', null),
  ('ミルフォード・トラック', null, 'course', '{nz}'::text[], '{}'::text[], null, 'みるふぉーどとらっく', 'オセアニア', null),
  ('トンガリロ・アルパイン・クロッシング', null, 'course', '{nz}'::text[], '{}'::text[], null, 'とんがりろあるぱいんくろっしんぐ', 'オセアニア', null);

insert into public.mountains (name, display_name, kind, countries, prefs, elevation, kana, area, region, parent_id, is_popular)
select s.name, s.display_name, s.kind, s.countries, s.prefs, s.elevation, s.kana,
       coalesce(s.area, p.area),
       case when cardinality(s.countries) > 0 then null
            else coalesce(p.region, case s.area when '東北' then 'north' when '北海道' then 'north'
                                                when '奥秩父' then 'koshin' else 'west' end) end,
       p.id, false
  from place_src s
  left join public.mountains p on p.name = s.parent
on conflict (name) do update
   set display_name = excluded.display_name, kind = excluded.kind, countries = excluded.countries,
       prefs = excluded.prefs, elevation = excluded.elevation, kana = excluded.kana,
       area = excluded.area, region = excluded.region, parent_id = excluded.parent_id;

-- 五色台は「その他の山」から景勝地へ
update public.mountains set kind = 'scenic' where name = '五色台';


-- ---------- 3. 踏破数を種類ごとに ----------
create or replace function public.meizan_counts(p_user uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    '100',      count(*) filter (where m.meizan_rank = 100),
    '200',      count(*) filter (where m.meizan_rank = 200),
    '300',      count(*) filter (where m.meizan_rank = 300),
    -- 名山以外の国内の山頂
    'other',    count(*) filter (where m.meizan_rank is null and m.kind = 'peak' and cardinality(m.countries) = 0),
    -- 岩稜・難所
    'ridge',    count(*) filter (where m.kind = 'ridge'),
    -- 海外（山頂・トレッキング）
    'overseas', count(*) filter (where cardinality(m.countries) > 0),
    -- 国内の景勝地・コース（山頂の踏破には数えない）
    'scenic',   count(*) filter (where m.kind in ('scenic', 'course') and cardinality(m.countries) = 0)
  )
  from public.climbed_mountains c
  join public.mountains m on m.id = c.mountain_id
  where c.user_id = p_user;
$$;


-- ---------- 4. カードを返す関数：山の 表示名・種類・国 も返す ----------
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
          'name', m.name, 'rank', m.meizan_rank, 'label', coalesce(m.display_name, m.name), 'kind', m.kind, 'cc', m.countries)
          order by m.elevation desc nulls last)
        from public.climbed_mountains c
        join public.mountains m on m.id = c.mountain_id
       where c.user_id = me), '[]'::jsonb),
    'favorites',
      coalesce((select jsonb_agg(jsonb_build_object(
          'name', m.name, 'rank', m.meizan_rank, 'label', coalesce(m.display_name, m.name), 'kind', m.kind, 'cc', m.countries, 'pos', c.favorite_rank)
          order by c.favorite_rank nulls last, m.elevation desc nulls last)
        from public.climbed_mountains c
        join public.mountains m on m.id = c.mountain_id
       where c.user_id = me and c.is_favorite), '[]'::jsonb),
    'wishlist',
      coalesce((select jsonb_agg(jsonb_build_object(
          'name', m.name, 'rank', m.meizan_rank, 'label', coalesce(m.display_name, m.name), 'kind', m.kind, 'cc', m.countries)
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
  -- 名山以外（その他の山・岩稜・海外・景勝地）は「その他」の公開設定にまとめて従う
  if prof.vis_rank_other then
    ranks := ranks || jsonb_build_object('other', cnt->'other', 'ridge', cnt->'ridge',
                                         'overseas', cnt->'overseas', 'scenic', cnt->'scenic');
  end if;

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
          'name', m.name, 'rank', m.meizan_rank, 'label', coalesce(m.display_name, m.name), 'kind', m.kind, 'cc', m.countries)
          order by m.elevation desc nulls last)
        from public.climbed_mountains c
        join public.mountains m on m.id = c.mountain_id
       where c.user_id = prof.id), '[]'::jsonb),
    'favorites',
      coalesce((select jsonb_agg(jsonb_build_object(
          'name', m.name, 'rank', m.meizan_rank, 'label', coalesce(m.display_name, m.name), 'kind', m.kind, 'cc', m.countries, 'pos', c.favorite_rank)
          order by c.favorite_rank nulls last, m.elevation desc nulls last)
        from public.climbed_mountains c
        join public.mountains m on m.id = c.mountain_id
       where c.user_id = prof.id and c.is_favorite), '[]'::jsonb),
    'wishlist',
      coalesce((select jsonb_agg(jsonb_build_object(
          'name', m.name, 'rank', m.meizan_rank, 'label', coalesce(m.display_name, m.name), 'kind', m.kind, 'cc', m.countries)
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
          ('other',    case when p.vis_rank_other then public.meizan_counts(p.id)->'other' end),
          ('ridge',    case when p.vis_rank_other then public.meizan_counts(p.id)->'ridge' end),
          ('overseas', case when p.vis_rank_other then public.meizan_counts(p.id)->'overseas' end),
          ('scenic',   case when p.vis_rank_other then public.meizan_counts(p.id)->'scenic' end)
        ) as t(k, v)
        where v is not null),
      'climbed',
        coalesce((select jsonb_agg(jsonb_build_object(
            'name', m.name, 'rank', m.meizan_rank, 'label', coalesce(m.display_name, m.name), 'kind', m.kind, 'cc', m.countries)
            order by m.elevation desc nulls last)
          from public.climbed_mountains c
          join public.mountains m on m.id = c.mountain_id
         where c.user_id = p.id), '[]'::jsonb),
      'favorites',
        coalesce((select jsonb_agg(jsonb_build_object(
            'name', m.name, 'rank', m.meizan_rank, 'label', coalesce(m.display_name, m.name), 'kind', m.kind, 'cc', m.countries, 'pos', c.favorite_rank)
            order by c.favorite_rank nulls last, m.elevation desc nulls last)
          from public.climbed_mountains c
          join public.mountains m on m.id = c.mountain_id
         where c.user_id = p.id and c.is_favorite), '[]'::jsonb),
      'wishlist',
        coalesce((select jsonb_agg(jsonb_build_object(
            'name', m.name, 'rank', m.meizan_rank, 'label', coalesce(m.display_name, m.name), 'kind', m.kind, 'cc', m.countries)
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



-- ---------- 5. 追加結果（確認用） ----------
-- 「所属する山」が空なのに所属を指定していた行があれば、山マスタの名前と合っていない
select s.kind as 種類, s.name as 管理用の名前, coalesce(s.display_name, '') as 表示名,
       array_to_string(s.countries, ',') as 国, s.parent as 指定した所属,
       coalesce(p.name, case when s.parent is null then '' else '（見つからない）' end) as 所属する山,
       m.id is not null as 追加済み
  from place_src s
  left join public.mountains m on m.name = s.name
  left join public.mountains p on p.id = m.parent_id
 order by s.kind, s.name;
