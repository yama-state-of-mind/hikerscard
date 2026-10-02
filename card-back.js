// =============================================
// カードの裏面（登山スキル）
//
//   SKILL_GROUPS      … 項目と各段階の目安（編集画面と裏面で共通）
//   renderBackFace()  … 裏面のカード
//   renderFlipCard()  … 表と裏を重ねた、裏返せるカード
//   bindFlip()        … 裏返すボタンを有効にする
//
// 段階は 0〜5。0 = 未経験、1〜5 = 下の目安。
// 項目を増やすときは、ここに足すだけでよい（SQLの変更は不要）。
// ※ 裏面の情報は、登山相性のスコアには使っていない。
// =============================================

import { esc, patternSVG, flipToggle, cardNo, normalizeBg, DARK_THEMES } from "./card.js";

export const SKILL_GROUPS = [
  {
    id: "base", title: "基本",
    items: [
      { key: "stamina", name: "歩行力", desc: "1日に歩ける行程の目安", levels: [
        ["ゆったり", "標高差500m・歩行3時間くらいまで"],
        ["ふつう", "標高差800m・歩行5時間くらい"],
        ["しっかり", "標高差1000m・歩行7時間くらい"],
        ["健脚", "標高差1500m・歩行9時間以上もこなせる"],
        ["超健脚", "標高差2000m級・10時間を超える行程を安定して歩ける"],
      ]},
      { key: "navigation", short: "地図読み", name: "地図読み", desc: "地図やコンパスでルートを判断する力", levels: [
        ["アプリで確認", "登山アプリの軌跡を見ながら歩く"],
        ["地形図も携行", "紙の地形図も持ち、分岐で確認している"],
        ["現在地がわかる", "地形とコンパスで現在地を特定できる"],
        ["道迷いに対応", "道を外れても、自力で正しいルートに戻れる"],
        ["読図で歩ける", "登山道のない尾根や谷も、読図で歩ける"],
      ]},
      { key: "hut", name: "小屋泊", desc: "山小屋・避難小屋での宿泊", levels: [
        ["1泊", "営業小屋に1泊したことがある"],
        ["小屋で連泊", "小屋をつないで2〜3日歩いたことがある"],
        ["避難小屋", "寝具・食料を持って避難小屋に泊まったことがある"],
        ["長期", "小屋泊で4泊以上の山行をしたことがある"],
        ["自在", "季節や混雑に合わせて、小屋泊を自在に計画できる"],
      ]},
      { key: "tent", name: "テント泊", desc: "テントを担いでの宿泊", levels: [
        ["1泊", "テント場で1泊したことがある"],
        ["テントで縦走", "テントを担いで縦走したことがある"],
        ["連泊", "テントで3泊以上の山行をしたことがある"],
        ["冬季も", "冬季のテント泊をしたことがある"],
        ["どこでも", "雪上や水場のない場所でも、快適に泊まれる"],
      ]},
      { key: "traverse", name: "縦走", desc: "山から山へ歩きつなぐ山行", levels: [
        ["日帰り縦走", "日帰りで周回・縦走をしたことがある"],
        ["1泊2日", "1泊2日の縦走をしたことがある"],
        ["2〜3泊", "2〜3泊の縦走をしたことがある"],
        ["4泊以上", "4泊以上の縦走をしたことがある"],
        ["長期縦走", "1週間以上の長期縦走をしたことがある"],
      ]},
      { key: "firstaid", name: "安全", desc: "応急手当・セルフレスキュー", levels: [
        ["救急セット", "救急セットを持ち、基本的な手当ができる"],
        ["講習受講", "普通救命講習などを受けたことがある"],
        ["野外救急", "WFAなど、野外救急の講習を受けている"],
        ["セルフレスキュー", "搬送やロープを使うセルフレスキューを学んだ"],
        ["教えられる", "応急手当やレスキューを人に教えられる"],
      ]},
    ],
  },
  {
    id: "advanced", title: "応用",
    items: [
      { key: "snow", name: "雪山", desc: "雪のある山での行動", levels: [
        ["雪の低山", "チェーンスパイクで雪のある低山を歩いた"],
        ["雪の一般ルート", "アイゼン・ピッケルで雪山の一般ルートを歩いた"],
        ["冬の2000m級", "赤岳など、厳冬期の2000m級に登った"],
        ["冬のアルプス", "厳冬期の3000m級一般ルートに登った"],
        ["厳冬期縦走", "厳冬期の縦走や、雪のバリエーションに行った"],
      ]},
      { key: "rock", short: "岩稜", name: "岩稜・鎖場", desc: "岩場やハシゴのある道", levels: [
        ["短い鎖場", "短い鎖場・ハシゴなら落ち着いて通れる"],
        ["一般的な岩場", "槍ヶ岳の穂先くらいの岩場を登れる"],
        ["難所", "大キレットや剱岳の一般ルートを歩ける"],
        ["最難関", "ジャンダルムなど、最難関の一般ルートも歩ける"],
        ["ロープ技術", "ロープでの確保や懸垂下降ができる"],
      ]},
      { key: "variation", short: "バリエ", name: "バリエーション", desc: "登山道のないルート", levels: [
        ["踏み跡", "踏み跡の薄い道や廃道を歩いたことがある"],
        ["経験者と", "経験者と一緒に、やさしい尾根や藪を歩いた"],
        ["自分で計画", "自分で計画してバリエーションルートを歩ける"],
        ["難路も", "藪・岩・雪が混じる難しいルートも歩ける"],
        ["リード", "難しいルートでもパーティをリードできる"],
      ]},
      { key: "sawa", name: "沢登り", desc: "沢を遡って登る", levels: [
        ["体験", "ガイドや経験者と、初級の沢に行った"],
        ["初級", "初級の沢なら、自分たちで遡行できる"],
        ["中級", "ロープを使う中級の沢を遡行できる"],
        ["泊まりも", "泊まりがけの遡行をしたことがある"],
        ["上級", "上級の沢でもリードできる"],
      ]},
    ],
  },
  {
    id: "sport", title: "スポーツ",
    items: [
      { key: "trailrun", short: "トレラン", name: "トレイルラン", desc: "山道を走る", levels: [
        ["少し走る", "下りや平らな道を少し走る程度"],
        ["20kmくらい", "20km前後のコースを走れる"],
        ["50km級", "50km級のレースや練習をこなせる"],
        ["100km級", "100km級を完走したことがある"],
        ["100マイル級", "100マイル級を完走したことがある"],
      ]},
      { key: "climbing", short: "クライム", name: "クライミング", desc: "岩や壁を登る", levels: [
        ["ボルダリング", "ジムでボルダリングをしている"],
        ["ロープ（ジム）", "ジムでリード・トップロープができる"],
        ["外岩", "外の岩場でクライミングをしている"],
        ["マルチピッチ", "外岩のマルチピッチを登る"],
        ["アルパイン", "アルパインクライミングをしている"],
      ]},
      { key: "ski", short: "山スキー", name: "山スキー・BC", desc: "雪山を滑る", levels: [
        ["サイドカントリー", "ゲレンデ脇やリフト近くの山を滑った"],
        ["ツアー体験", "ガイドツアーでバックカントリーを体験した"],
        ["自分たちで", "ビーコンなどを持ち、自分たちでツアーに行ける"],
        ["急斜面も", "急斜面や大きな山域も滑れる"],
        ["上級", "長大なツアーや厳冬期の山岳滑走もこなせる"],
      ]},
    ],
  },
];

export const SKILL_BY_KEY = Object.fromEntries(
  SKILL_GROUPS.flatMap((g) => g.items.map((it) => [it.key, { ...it, group: g }])));

export const levelName = (item, lv) => lv === 0 ? "未経験" : item.levels[lv - 1]?.[0] ?? "";
export const levelDesc = (item, lv) => lv === 0 ? "まだ経験はない（これから挑戦したい）" : item.levels[lv - 1]?.[1] ?? "";

// 5段のメーター
export function meter(lv) {
  return `<span class="sk-meter" aria-label="5段階中${lv}">${
    [1, 2, 3, 4, 5].map((i) => `<i class="${i <= lv ? "on" : ""}"></i>`).join("")}</span>`;
}

// =============================================
// レーダーチャート
//
// 軸の数は項目数で固定（基本=6、応用=4、スポーツ=3）。
// 表示していない・未登録の項目も軸は残し、値は中心、ラベルは「—」にする。
// =============================================
function radarSVG(group, skills, size) {
  const items = group.items;
  const n = items.length;
  const pad = size === "lg" ? 56 : 44;     // ラベルのための余白
  const R = size === "lg" ? 86 : 40;
  const W = (R + pad) * 2;
  const H = n === 3 ? R * 1.5 + pad * 2 : (R + pad) * 2 - (n === 4 ? 0 : 8);
  const cx = W / 2;
  const cy = n === 3 ? pad + R : H / 2;    // 三角形は上に寄せて余白を詰める
  const ang = (i) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const pt = (i, r) => [cx + Math.cos(ang(i)) * r, cy + Math.sin(ang(i)) * r];
  const poly = (r) => items.map((_, i) => pt(i, r).map((v) => v.toFixed(1)).join(",")).join(" ");

  // 目盛り（1〜5段）と軸
  const rings = [1, 2, 3, 4, 5].map((lv) =>
    `<polygon class="rd-ring${lv === 5 ? " outer" : ""}" points="${poly((R * lv) / 5)}"/>`).join("");
  const spokes = items.map((_, i) => {
    const [x, y] = pt(i, R);
    return `<line class="rd-spoke" x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}"/>`;
  }).join("");

  // 値
  const vals = items.map((it) => (skills[it.key] === undefined ? null : Number(skills[it.key])));
  const dataPts = vals.map((v, i) => pt(i, (R * (v ?? 0)) / 5));
  const area = `<polygon class="rd-area" points="${dataPts.map((p) => p.map((v) => v.toFixed(1)).join(",")).join(" ")}"/>`;
  const dots = dataPts.map(([x, y], i) => vals[i] === null ? "" :
    `<circle class="rd-dot" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${size === "lg" ? 3.4 : 2.8}"/>`).join("");

  // ラベル（項目名＋段階）。角度に合わせて寄せる
  const labels = items.map((it, i) => {
    const [x, y] = pt(i, R + (size === "lg" ? 16 : 13));
    const c = Math.cos(ang(i));
    const s = Math.sin(ang(i));
    // 三角形の下の2つは、横にはみ出さないよう頂点の真下に置く
    const below = n === 3 && s > 0.3;
    const anchor = below || Math.abs(c) < 0.2 ? "middle" : c > 0 ? "start" : "end";
    const dy = s < -0.5 ? -6 : below || s > 0.5 ? 14 : 3;   // 上の軸は上へ、下の軸は下へ
    const v = vals[i];
    return `<text class="rd-lbl" x="${x.toFixed(1)}" y="${(y + dy).toFixed(1)}" text-anchor="${anchor}">
        <tspan class="rd-name">${esc(it.short ?? it.name)}</tspan><tspan class="rd-val${v === null ? " none" : ""}" dx="4">${v === null ? "—" : v}</tspan>
      </text>`;
  }).join("");

  return `<svg class="rd rd-${size}" viewBox="0 0 ${W} ${H}" role="img"
      aria-label="${esc(group.title)}：${items.map((it, i) => `${it.name} ${vals[i] ?? "未登録"}`).join("、")}">
      ${rings}${spokes}${area}${dots}${labels}</svg>`;
}

function chartsHtml(skills) {
  const [base, adv, sport] = SKILL_GROUPS;
  const has = (g) => g.items.some((it) => skills[it.key] !== undefined);
  const block = (g, size) => `
    <div class="rd-box${has(g) ? "" : " empty"}" data-skill="${g.id}" role="button" tabindex="0"
         aria-label="${esc(g.title)}の詳しい説明を見る">
      <p class="sk-gt">${g.title}</p>
      ${radarSVG(g, skills, size)}
    </div>`;
  return `
    <div class="rd-wrap">
      ${block(base, "lg")}
      <div class="rd-row">${block(adv, "sm")}${block(sport, "sm")}</div>
    </div>`;
}

function listHtml(skills) {
  return SKILL_GROUPS.map((g) => {
    const rows = g.items.filter((it) => skills[it.key] !== undefined).map((it) => {
      const lv = Number(skills[it.key]);
      return `
        <div class="sk-row">
          <span class="sk-name">${esc(it.name)}</span>
          ${meter(lv)}
          <span class="sk-lv">${esc(levelName(it, lv))}</span>
        </div>`;
    }).join("");
    return rows ? `<div class="sk-group"><p class="sk-gt">${g.title}</p>${rows}</div>` : "";
  }).join("");
}

const LOCK = `<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>`;

// =============================================
// 裏面のカード
//
// back: get_card_back の結果
//   null / { locked: true, reason } / { locked: false, skills: {キー: 段階} }
// opts.own: 自分のカードか（空のときの案内を変える）
// =============================================
export function renderBackFace(d, back, opts = {}) {
  const bg = normalizeBg(d.card_bg);
  const head = `
    <div class="hero-top">
      ${flipToggle(false)}
      <span class="hero-no">${cardNo(d.card_no)}</span>
    </div>
    <div class="bk-title">
      <p class="bk-en">SKILLS</p>
      <p class="bk-name">${esc(d.display_name)}さんの登山スキル</p>
    </div>`;

  let body;
  if (!back || back.locked) {
    const text = back?.reason === "login"
      ? "ログインして、カードを交換すると<br>裏面の登山スキルが見られます。"
      : "カードを交換すると、<br>裏面の登山スキルが見られます。";
    body = `
      <div class="bk-lock">
        <span class="bk-lock-ic">${LOCK}</span>
        <p>${text}</p>
        ${opts.lockAction ?? ""}
      </div>`;
  } else {
    const skills = back.skills ?? {};
    const groups = Object.keys(skills).some((k) => SKILL_BY_KEY[k]);
    // チャートと一覧を切り替えられる（段階の名前は一覧で見られる）
    body = groups
      ? `<div class="bk-view" role="tablist">
           <button class="bk-view-b on" data-view="chart" role="tab" aria-selected="true">チャート</button>
           <button class="bk-view-b" data-view="list" role="tab" aria-selected="false">一覧</button>
         </div>
         <div class="bk-pane" data-pane="chart">${chartsHtml(skills)}</div>
         <div class="bk-pane" data-pane="list" hidden><div class="sk-groups">${listHtml(skills)}</div></div>
         <p class="bk-note">自己申告のスキルです（0＝未経験〜5）</p>`
      : `<div class="bk-lock">
           <p>${opts.own
              ? "裏面はまだ空です。<br>登山スキルを登録すると、交換した相手に見せられます。"
              : "まだ登山スキルが登録されていません。"}</p>
           ${opts.own ? `<a class="btn ghost bk-btn" href="/skills.html">登山スキルを登録する</a>` : ""}
         </div>`;
  }

  return `
  <div class="hero hero-back t-${bg}${DARK_THEMES.has(bg) ? " dark" : ""}">
    ${patternSVG(bg)}
    <div class="hero-in">${head}${body}</div>
    <span class="hero-brand hero-brand-foot">#ハイカーズカード</span>
  </div>`;
}

// =============================================
// 裏面のときにカードの下に出す「各スキルの詳しい説明」
//
// 分類（基本・応用・スポーツ）ごとのセクションにする。
// id は skill-base などで、裏面のチャートを押すとここへスクロールする。
// =============================================
export function renderBackDetails(back, opts = {}) {
  // まだ見られない（未ログイン・未交換）
  if (!back || back.locked) {
    return `
      <section class="det" id="skill-locked">
        <div class="det-h"><h2>登山スキル</h2></div>
        <p class="det-empty">${back?.reason === "login"
          ? "ログインして、カードを交換すると見られます。"
          : "カードを交換すると、登山スキルの詳しい内容が見られます。"}</p>
      </section>`;
  }

  const skills = back.skills ?? {};
  const any = Object.keys(skills).some((k) => SKILL_BY_KEY[k]);
  if (!any && !opts.own) {
    return `
      <section class="det">
        <div class="det-h"><h2>登山スキル</h2></div>
        <p class="det-empty">まだ登山スキルが登録されていません。</p>
      </section>`;
  }

  return SKILL_GROUPS.map((g) => {
    const rows = g.items.map((it) => {
      const has = skills[it.key] !== undefined;
      if (!has) {
        // 自分のカードでは、未登録の項目も出して登録のきっかけにする
        return opts.own ? `
          <div class="skd none">
            <div class="skd-h"><b>${esc(it.name)}</b><span class="skd-lv">（未登録）</span></div>
            <p class="skd-what">${esc(it.desc)}</p>
          </div>` : "";
      }
      const lv = Number(skills[it.key]);
      // 全段階を並べ、選んだ段階を強調する（全体の中でどこにいるかが分かるように）
      const ladder = [0, 1, 2, 3, 4, 5].map((n) => `
            <li class="${n === lv ? "cur" : n < lv ? "done" : ""}">
              <b>${n}</b><span>${esc(levelName(it, n))}</span></li>`).join("");
      return `
        <div class="skd">
          <div class="skd-h">
            <b>${esc(it.name)}</b>
            ${meter(lv)}
            <span class="skd-lv">${lv === 0 ? "未経験" : `Lv.${lv} ${esc(levelName(it, lv))}`}</span>
          </div>
          <p class="skd-desc">${esc(levelDesc(it, lv))}</p>
          <ol class="skd-ladder" aria-label="${esc(it.name)}の段階">${ladder}</ol>
          <p class="skd-what">${esc(it.desc)}</p>
        </div>`;
    }).join("");
    if (!rows) return "";
    return `
      <section class="det" id="skill-${g.id}">
        <div class="det-h"><h2>${esc(g.title)}</h2><span class="det-n">登山スキル</span></div>
        <div class="skd-list">${rows}</div>
      </section>`;
  }).join("") + (opts.own
    ? `<p class="det-empty" style="text-align:center;margin-top:18px"><a href="/skills.html">登山スキルを編集する</a></p>`
    : "");
}

// =============================================
// 裏返せるカード
// =============================================

export function renderFlipCard(frontHTML, backHTML) {
  return `
    <div class="flip" id="flip">
      <div class="flip-face front">${frontHTML}</div>
      <div class="flip-face back" aria-hidden="true">${backHTML}</div>
    </div>`;
}

export function bindFlip(root = document) {
  const flip = root.querySelector("#flip");
  if (!flip) return;

  const front = flip.querySelector(".flip-face.front");
  const back = flip.querySelector(".flip-face.back");

  const set = (toBack) => {
    flip.classList.toggle("flipped", toBack);
    front.setAttribute("aria-hidden", toBack);
    back.setAttribute("aria-hidden", !toBack);
    // カードの下の表示も、表面用／裏面用を切り替える
    document.querySelectorAll("[data-side]").forEach((el) => {
      el.hidden = el.dataset.side !== (toBack ? "back" : "front");
    });
  };

  // カードの左上のボタン（表・裏それぞれにある）で裏返す
  flip.addEventListener("click", (e) => {
    if (!e.target.closest("[data-flip]")) return;
    e.stopPropagation();
    // 裏返す間だけ、ゆっくり回るアニメーションにする（普段は傾きに素早く追従させる）
    flip.classList.add("flipping");
    set(!flip.classList.contains("flipped"));
    clearTimeout(flip._t);
    flip._t = setTimeout(() => flip.classList.remove("flipping"), 800);
  });

  // 裏面のチャートを押したら、その分類の詳しい説明へ
  const goSkill = (id) => {
    const el = document.getElementById(`skill-${id}`) ?? document.getElementById("skill-locked");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  back.addEventListener("keydown", (e) => {
    const box = e.target.closest("[data-skill]");
    if (box && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); goSkill(box.dataset.skill); }
  });

  // 裏面の「チャート｜一覧」
  back.addEventListener("click", (e) => {
    const box = e.target.closest("[data-skill]");
    if (box) { goSkill(box.dataset.skill); return; }
    const v = e.target.closest("[data-view]");
    if (!v) return;
    back.querySelectorAll("[data-view]").forEach((b) => {
      const on = b === v;
      b.classList.toggle("on", on);
      b.setAttribute("aria-selected", on);
    });
    back.querySelectorAll("[data-pane]").forEach((p) => { p.hidden = p.dataset.pane !== v.dataset.view; });
  });

  // 裏面のURL（#back）で開いたら、最初から裏を見せる
  if (location.hash === "#back") set(true);
}
