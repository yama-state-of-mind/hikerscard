-- =============================================================
-- ハイカーズカード Step 25：人気の山の並び順（登山者数の参考データ）
--
-- カードづくりの「かんたん仕分け」で、初心者が選びやすいよう
-- 実際によく登られている山を上に出すための順位を付ける。
--
-- ■ 参考データ
--   YAMAP「登られた山ランキング2025」（2025年1月1日〜11月30日の登頂数＝活動日記数を
--   10エリア別に集計、各エリア上位5座）
--   https://prtimes.jp/main/html/rd/p/000000259.000011352.html
--
-- ■ 全国の順位の付け方
--   ランキングはエリアごとなので、全国では
--     「各エリアの1位」→「各エリアの2位」→ … →「各エリアの5位」
--   の順に並べる。同じ順位の中では、エリアの登山者の多さの見立てで
--     関東 → 甲信越 → 近畿 → 東海 → 北陸 → 東北 → 九州 → 北海道 → 中国 → 四国
--   とする（この並びは見立てなので、変えたい場合は下の表の番号を入れ替える）。
--
-- ■ 山の特定
--   同じ名前の山があるため（神奈川の大山と鳥取の大山など）、山名と都道府県の両方で照合する。
--   データベースでの呼び方が違う場合に備えて、別名も書いてある（くじゅう連山＝九重山 など）。
--   データベースに無い山（里山など）は飛ばされる。最後に照合結果を表示するので確認すること。
--
--   ※ 順位の付いた山には「人気の山」（is_popular）の印も付ける。
--
-- SQL Editor に全文を貼り付けて、一度に実行してください。何度実行しても同じ結果になります。
-- =============================================================


-- ---------- 1. 人気の順位（1 がいちばん。順位の無い山は null） ----------
alter table public.mountains add column if not exists popular_rank smallint;


-- ---------- 2. 参考データから順位を付ける ----------
drop table if exists pg_temp.popular_src;
create temp table popular_src (no smallint, area_rank smallint, names text[], prefs text[]);
insert into popular_src values
    ( 1, 1, array['高尾山'], array['東京']),
    ( 2, 1, array['木曽駒ヶ岳','木曽駒ケ岳'], array['長野']),
    ( 3, 1, array['金剛山'], array['大阪','奈良']),
    ( 4, 1, array['猿投山'], array['愛知']),
    ( 5, 1, array['立山'], array['富山']),
    ( 6, 1, array['安達太良山'], array['福島']),
    ( 7, 1, array['くじゅう連山','九重山','久住山'], array['大分']),
    ( 8, 1, array['藻岩山'], array['北海道']),
    ( 9, 1, array['大山'], array['鳥取']),
    (10, 1, array['剣山','剣山（つるぎさん）'], array['徳島']),
    (11, 2, array['筑波山'], array['茨城']),
    (12, 2, array['燕岳'], array['長野']),
    (13, 2, array['六甲山'], array['兵庫']),
    (14, 2, array['金華山'], array['岐阜']),
    (15, 2, array['白山'], array['石川','岐阜']),
    (16, 2, array['月山'], array['山形']),
    (17, 2, array['宝満山'], array['福岡']),
    (18, 2, array['三角山'], array['北海道']),
    (19, 2, array['福山'], array['岡山']),
    (20, 2, array['石鎚山'], array['愛媛']),
    (21, 3, array['塔ノ岳','丹沢'], array['神奈川']),
    (22, 3, array['唐松岳'], array['長野','富山']),
    (23, 3, array['摩耶山'], array['兵庫']),
    (24, 3, array['富士山'], array['静岡','山梨']),
    (25, 3, array['文殊山'], array['福井']),
    (26, 3, array['一切経山'], array['福島']),
    (27, 3, array['韓国岳','霧島山'], array['宮崎','鹿児島']),
    (28, 3, array['旭岳','大雪山'], array['北海道']),
    (29, 3, array['弥山'], array['広島']),
    (30, 3, array['飯野山'], array['香川']),
    (31, 4, array['大山'], array['神奈川']),
    (32, 4, array['大菩薩嶺','大菩薩岳'], array['山梨']),
    (33, 4, array['旗振山'], array['兵庫']),
    (34, 4, array['乗鞍岳'], array['岐阜','長野']),
    (35, 4, array['爺ヶ岳'], array['富山','長野']),
    (36, 4, array['蔵王山','熊野岳','蔵王 熊野岳'], array['山形','宮城']),
    (37, 4, array['立花山'], array['福岡']),
    (38, 4, array['樽前山'], array['北海道']),
    (39, 4, array['右田ヶ岳'], array['山口']),
    (40, 4, array['三嶺'], array['徳島','高知']),
    (41, 5, array['御岳山'], array['東京']),
    (42, 5, array['赤岳','八ヶ岳'], array['山梨','長野']),
    (43, 5, array['御在所岳','御在所山'], array['三重','滋賀']),
    (44, 5, array['弥勒山'], array['岐阜','愛知']),
    (45, 5, array['五竜岳'], array['富山','長野']),
    (46, 5, array['磐梯山'], array['福島']),
    (47, 5, array['阿蘇山','阿蘇山・中岳'], array['熊本']),
    (48, 5, array['十勝岳'], array['北海道']),
    (49, 5, array['三瓶山'], array['島根']),
    (50, 5, array['瓶ヶ森'], array['愛媛']);

-- いったん全部外してから付け直す（何度実行しても同じ結果になるように）
update public.mountains set popular_rank = null where popular_rank is not null;

-- 山名（別名を含む）と都道府県の両方が合う山に、順位を付ける。
-- 1つの山に複数の行が当たったときは、上の順位を使う
update public.mountains m
   set popular_rank = s.no,
       is_popular   = true
  from (
    select m2.id, min(ps.no) as no
      from public.mountains m2
      join popular_src ps
        on m2.name = any(ps.names)
       and exists (
         select 1 from unnest(coalesce(m2.prefs, '{}')) as p(pref), unnest(ps.prefs) as q(pref)
          where p.pref like q.pref || '%')   -- 「長野」でも「長野県」でも合うように
     group by m2.id
  ) s
 where m.id = s.id;


-- ---------- 3. 照合結果（どの山に順位が付いたか） ----------
-- 「（データベースに無し）」の行は、その山が山マスタに入っていないか、名前の書き方が違う。
-- 名前の書き方が違うだけなら、上の表の別名に足して実行し直す。
select ps.no as 全国順位,
       ps.area_rank as エリア内順位,
       array_to_string(ps.names, '／') as 参考データの山名,
       array_to_string(ps.prefs, '・') as 都道府県,
       coalesce((select string_agg(m.name || '（' || array_to_string(m.prefs, '・') || '）', '、')
                   from public.mountains m where m.popular_rank = ps.no),
                '（データベースに無し）') as 順位が付いた山
  from popular_src ps
 order by ps.no;
