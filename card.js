// =============================================
// カードの描画
//
// card.html / u.html / collection.html で共有する。
// データの取得元は違うが、描くものは同じ。
// =============================================

// ---------------------------------------------
// 背景のパターン
// ---------------------------------------------
export const BG = {
  contour: () => {
    let p = "";
    for (let i = 0; i < 12; i++) {
      const y = 20 + i * 46;
      p += `<path d="M-20 ${y} Q 80 ${y - 30} 165 ${y} T 350 ${y}"
               fill="none" stroke="rgba(30,58,49,.055)" stroke-width="1.6"/>`;
    }
    return p;
  },

  ridge: () => `
    <path d="M-10 540 L60 380 L118 442 L190 320 L250 400 L330 540 Z" fill="rgba(30,58,49,.06)"/>
    <path d="M-10 540 L40 450 L96 500 L160 420 L228 486 L300 430 L340 540 Z" fill="rgba(70,112,143,.06)"/>`,

  mist: () => `
    <defs><linearGradient id="mg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#F6DCC0" stop-opacity=".55"/>
      <stop offset=".55" stop-color="#FBF6F1" stop-opacity="0"/>
    </linearGradient></defs>
    <rect width="320" height="540" fill="url(#mg)"/>
    <path d="M-10 300 Q 90 278 170 300 T 340 296" fill="none" stroke="rgba(193,128,74,.14)" stroke-width="2"/>
    <path d="M-10 336 Q 100 314 180 336 T 340 330" fill="none" stroke="rgba(193,128,74,.1)" stroke-width="2"/>`,

  forest: () => {
    let p = "";
    [14, 52, 96, 140, 186, 232, 276, 308].forEach((x, i) => {
      const w = 7 + (i % 3) * 3;
      p += `<rect x="${x}" y="0" width="${w}" height="540" fill="rgba(34,65,44,.045)"/>`;
      p += `<path d="M${x - 6} ${90 + i * 40} L${x + w / 2} ${56 + i * 40} L${x + w + 6} ${90 + i * 40} Z"
               fill="rgba(79,138,91,.07)"/>`;
    });
    return p;
  },

  night: () => {
    let p = "";
    const stars = [[28,54],[76,32],[122,78],[168,44],[214,92],[262,38],[296,70],
                   [46,132],[104,158],[186,126],[248,164],[300,140],
                   [22,214],[88,246],[152,206],[226,252],[288,228]];
    stars.forEach(([x, y], i) => {
      const r = i % 4 === 0 ? 1.8 : 1.1;
      p += `<circle cx="${x}" cy="${y}" r="${r}"
               fill="rgba(255,255,255,${i % 3 === 0 ? .5 : .28})"/>`;
    });
    p += `<path d="M-10 540 L52 402 L110 460 L182 356 L244 428 L330 540 Z" fill="rgba(0,0,0,.22)"/>`;
    return p;
  },
};

export const THEMES = [
  { id: "contour", name: "等高線" },
  { id: "ridge",   name: "山なみ" },
  { id: "mist",    name: "朝もや" },
  { id: "forest",  name: "木立"   },
  { id: "night",   name: "夜空"   },
];

// ---------------------------------------------
// 未診断のときのアイコン
// ---------------------------------------------
export const SILHOUETTE = `
<svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
  <circle cx="80" cy="80" r="78" fill="#EDF3EF"/>
  <circle cx="80" cy="64" r="26" fill="#C3D0C8"/>
  <path d="M80 96 C52 96 34 116 32 146 L128 146 C126 116 108 96 80 96 Z" fill="#C3D0C8"/>
  <path d="M104 40 L116 22 L128 40 Z" fill="#DCE4DF"/>
  <path d="M120 40 L132 26 L142 40 Z" fill="#DCE4DF"/>
</svg>`;

// ---------------------------------------------
// SNSの定義
// ---------------------------------------------
export const SNS = {
  // 他社のロゴをそのまま使うのは商標上の問題があるため、
  // 色だけ寄せた自作のアイコンにしている。
  // 正式にロゴを使う場合は、各社の利用条件を確認すること。
  yamap:     { label: "YAMAP",     bg: "#D93A2B", icon: "mt", url: (v) => `https://yamap.com/users/${v}` },
  yamareco:  { label: "ヤマレコ",   bg: "#1F6FB2", icon: "mt", url: (v) => `https://www.yamareco.com/modules/yamareco/userinfo-${v}.html` },
  instagram: { label: "Instagram", bg: "#C13584", short: "in", url: (v) => `https://instagram.com/${v}` },
  x:         { label: "X",         bg: "#111111", short: "X",  url: (v) => `https://x.com/${v}` },
};

// ---------------------------------------------
// ハイカーズカードのロゴ（山のシルエット）
// 登山タイプ診断のOGP画像と同じモチーフ
// ---------------------------------------------
export const LOGO_MARK = `
<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <circle cx="16" cy="11" r="7.5" fill="#F2EDE1"/>
  <path d="M16 6 L27 27 H5 Z" fill="#20463A"/>
  <path d="M16 6 L20.4 14.4 H11.6 Z" fill="#E0A33B"/>
  <path d="M5 27 L11 17 L15 22 L19.5 27 Z" fill="#2F5A4A"/>
</svg>`;

// ---------------------------------------------
// 動物ごとの足跡
//
// 16タイプを、足のつくりで5種類に分けている。
// カードの背景にうっすら散らして、その人らしさを出す。
// ---------------------------------------------
const PAW_SHAPES = {
  // 鳥：三本指＋後ろ指
  bird: `<path d="M12 3 L12 17 M12 17 L5 8 M12 17 L19 8 M12 17 L14.5 21"
           stroke="currentColor" stroke-width="2.2" fill="none"
           stroke-linecap="round"/>`,
  // クマ：大きな肉球と5つの指
  bear: `<ellipse cx="12" cy="15.5" rx="6.4" ry="5.2"/>
         <circle cx="5.4" cy="8.4" r="2.1"/><circle cx="9.4" cy="5.6" r="2.3"/>
         <circle cx="14.6" cy="5.6" r="2.3"/><circle cx="18.6" cy="8.4" r="2.1"/>`,
  // イヌ科：肉球と4つの指
  canine: `<ellipse cx="12" cy="16" rx="5.4" ry="4.6"/>
           <ellipse cx="6.2" cy="9.2" rx="2.1" ry="2.6"/>
           <ellipse cx="10.2" cy="6.4" rx="2.1" ry="2.7"/>
           <ellipse cx="13.8" cy="6.4" rx="2.1" ry="2.7"/>
           <ellipse cx="17.8" cy="9.2" rx="2.1" ry="2.6"/>`,
  // 偶蹄目：割れた蹄
  hoof: `<path d="M10.6 3.5 C7 8 6.2 14 9.4 20.5 C10.6 21.6 11 21.6 11 20 L11 5z"/>
         <path d="M13.4 3.5 C17 8 17.8 14 14.6 20.5 C13.4 21.6 13 21.6 13 20 L13 5z"/>`,
  // 小動物：細長い5本指
  small: `<ellipse cx="12" cy="16.5" rx="4" ry="3.6"/>
          <ellipse cx="6" cy="11" rx="1.5" ry="2.4" transform="rotate(-30 6 11)"/>
          <ellipse cx="9.2" cy="7.6" rx="1.5" ry="2.6"/>
          <ellipse cx="12.6" cy="6.6" rx="1.5" ry="2.7"/>
          <ellipse cx="15.8" cy="7.8" rx="1.5" ry="2.6"/>
          <ellipse cx="18.2" cy="11" rx="1.5" ry="2.4" transform="rotate(30 18.2 11)"/>`,
};

const PAW_BY_TYPE = {
  PSLC: "hoof",   // カモシカ
  PSLA: "bird",   // イヌワシ
  PSFC: "small",  // オコジョ
  PSFA: "bear",   // ツキノワグマ
  PGLC: "bird",   // ライチョウ
  PGLA: "bird",   // ホシガラス
  PGFC: "bird",   // イワツバメ
  PGFA: "small",  // ニホンザル
  ESLC: "small",  // ヤマネ
  ESLA: "small",  // ムササビ
  ESFC: "canine", // ホンドタヌキ
  ESFA: "canine", // ホンドギツネ
  EGLC: "hoof",   // ニホンジカ
  EGLA: "bird",   // ヤマセミ
  EGFC: "small",  // ニホンリス
  EGFA: "small",  // ノウサギ
};

// カードの背景に散らす足跡
function pawTrail(typeCode) {
  const shape = PAW_SHAPES[PAW_BY_TYPE[typeCode] ?? "canine"];
  if (!shape) return "";

  // 斜めに歩いていくように並べる
  const steps = [
    [30, 470, -18, 1.5], [62, 424, -14, 1.35], [40, 378, -20, 1.2],
    [78, 336, -12, 1.1], [56, 292, -18, .95], [96, 252, -10, .85],
  ];
  return steps.map(([x, y, rot, sc]) => `
    <g transform="translate(${x} ${y}) rotate(${rot}) scale(${sc}) translate(-12 -12)"
       fill="currentColor" opacity=".9">${shape}</g>`).join("");
}

export const PAW = { PAW_SHAPES, PAW_BY_TYPE };

// 単体の足跡（一覧などで使う）
export function pawIcon(typeCode) {
  const shape = PAW_SHAPES[PAW_BY_TYPE[typeCode] ?? "canine"];
  return `<svg viewBox="0 0 24 24" fill="currentColor">${shape}</svg>`;
}

const STAR = `<svg class="ic-star" viewBox="0 0 24 24"><path d="M12 2l3 6.6 7 .9-5.2 4.9 1.4 7L12 18l-6.2 3.4 1.4-7L2 9.5l7-.9z"/></svg>`;
const FLAG = `<svg class="ic-flag" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21V4"/><path d="M5 5h12l-2 4 2 4H5"/></svg>`;

const RANKS = [
  { key: "100", label: "百名山",   color: "#E0A33B" },
  { key: "200", label: "二百名山", color: "#8CA9BD" },
  { key: "300", label: "三百名山", color: "#B9C6BD" },
];

// ---------------------------------------------
// SNSのアイコン
// YAMAP・ヤマレコは山の形、Instagram・Xは頭文字
// ---------------------------------------------
const MT_GLYPH = `<svg viewBox="0 0 24 24" fill="#fff"><path d="M2.5 19.5 9 8l3.6 6.2L15 10l6.5 9.5z"/></svg>`;
export function snsIcon(key) {
  const s = SNS[key];
  if (!s) return "";
  return `<span class="sns-ic" style="background:${s.bg}">${s.icon === "mt" ? MT_GLYPH : esc(s.short)}</span>`;
}

// ---------------------------------------------
// テーマをページ全体に効かせる
//
// 模様（等高線など）はヒーローカードだけに敷く（Linktreeのパネルと同じ考え方）。
// ページはカードと同系色の無地にして、カードを引き立てる。
// body にクラスを付けることで、CSS変数が全体に行き渡る。
// ---------------------------------------------
export function applyTheme(bg) {
  const id = BG[bg] ? bg : "contour";
  document.body.className = document.body.className
    .replace(/\bt-\w+\b/g, "").trim() + " t-" + id;

  // スマホの上部バーの色も合わせる
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    const c = getComputedStyle(document.body).getPropertyValue("--c-page").trim();
    if (c) meta.setAttribute("content", c);
  }
  return id;
}

// ---------------------------------------------
// ヒーローカードの模様
//
// Linktreeのパネルのように、模様がはっきり見える濃さにする。
// 元の模様は薄めなので、同じものを重ねて濃さを上げる
// （夜空は星が文字に重なって読みにくくなるので重ねない）。
// ---------------------------------------------
const PATTERN_STRENGTH = { contour: 2, ridge: 2, forest: 2, mist: 1, night: 1 };

export function patternSVG(id, cls = "hero-bg") {
  const key = BG[id] ? id : "contour";
  const layer = BG[key]();
  const n = PATTERN_STRENGTH[key] ?? 1;
  return `<svg class="${cls}" viewBox="0 0 320 540" preserveAspectRatio="xMidYMid slice">${
    Array.from({ length: n }, () => `<g>${layer}</g>`).join("")}</svg>`;
}

// ---------------------------------------------
// 共通のリング
// ---------------------------------------------
function ringSVG(done, color, rad) {
  const C = 2 * Math.PI * rad;
  const size = rad * 2 + 8;
  const c = rad + 4;
  return `
  <svg viewBox="0 0 ${size} ${size}">
    <circle cx="${c}" cy="${c}" r="${rad}" fill="none" stroke="var(--c-soft)" stroke-width="${rad > 18 ? 5 : 3.6}"/>
    <circle cx="${c}" cy="${c}" r="${rad}" fill="none" stroke="${color}" stroke-width="${rad > 18 ? 5 : 3.6}"
            stroke-linecap="round" stroke-dasharray="${C}"
            stroke-dashoffset="${C * (1 - done / 100)}" transform="rotate(-90 ${c} ${c})"/>
  </svg>`;
}

// 行ってよかった山を順位順にそろえる（pos が無い古いデータは後ろへ）
function sortedFavs(list) {
  return [...(list ?? [])].sort((a, b) => (a.pos ?? 99) - (b.pos ?? 99));
}

// 1〜3位の冠（金・銀・銅）。4位以下は何も付けない
export function crown(pos) {
  if (!pos || pos > 3) return "";
  const label = ["", "1位", "2位", "3位"][pos];
  return `<svg class="crown c${pos}" viewBox="0 0 24 24" role="img" aria-label="${label}">
    <path d="M3 8l4.5 4L12 5l4.5 7L21 8l-1.8 10H4.8z"/><rect x="4.6" y="19" width="14.8" height="2" rx="1"/></svg>`;
}

// カードの左上に置く「裏返す」ボタン（円状の矢印＋2文字）
export const FLIP_IC = `<svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 0 1 13.7-5.6L20 9"/><path d="M20 4v5h-5"/><path d="M20 12a8 8 0 0 1-13.7 5.6L4 15"/><path d="M4 20v-5h5"/></svg>`;
export function flipToggle(toBack) {
  const label = toBack ? "裏面" : "表面";
  return `<button class="flip-toggle" data-flip aria-label="${label}を見る">${FLIP_IC}<span>${label}</span></button>`;
}

// 順位のバッジ（数字）
function posBadge(pos) {
  if (!pos) return "";
  return `<span class="pos pos-${pos <= 3 ? pos : "n"}">${pos}</span>`;
}

// =============================================
// ヒーローカード（縦長・要約）
//
// 背景の模様と、動物ごとの足跡を敷く。
// 行ってよかった山・行ってみたい山は省略せず全件載せる（各5座まで）。
// =============================================
export function renderHeroCard(d, opts = {}) {
  const diagnosed = !!d.type_code;
  const bg = BG[d.card_bg] ? d.card_bg : "contour";
  const ranks = d.ranks ?? {};
  const linked = opts.linked !== false;   // false ならスクロールさせない

  const shown = RANKS.filter((r) => ranks[r.key] !== undefined && ranks[r.key] !== null);
  const hasOther = ranks.other !== undefined && ranks.other !== null;

  const rings = shown.map((r) => {
    const done = Number(ranks[r.key]);
    return `
      <div class="mini-ring">
        <div class="mr">${ringSVG(done, r.color, 19)}
          <div class="mn"><b>${done}</b><span>/100</span></div></div>
        <p>${r.label}</p><em>${done >= 100 ? "完登" : `あと${100 - done}`}</em>
      </div>`;
  }).join("") + (hasOther ? `
      <div class="mini-ring">
        <div class="mr mr-other"><div class="mn"><b>${Number(ranks.other)}</b><span>座</span></div></div>
        <p>その他</p><em>&nbsp;</em>
      </div>` : "");

  const favs = sortedFavs(d.favorites);
  const wish = d.wishlist ?? [];

  const blk = (go, inner) => linked
    ? `<button class="hero-blk" data-go="${go}">${inner}</button>`
    : `<div class="hero-blk">${inner}</div>`;

  return `
  <div class="hero t-${bg}">
    ${patternSVG(bg)}
    ${diagnosed ? `
      <svg class="hero-paw" viewBox="0 0 320 540" preserveAspectRatio="xMidYMid slice">
        ${pawTrail(d.type_code)}
      </svg>` : ""}

    <div class="hero-in">
      <div class="hero-top">
        ${opts.flipBtn ? flipToggle(true) : "<span></span>"}
        <span class="hero-no">No.${String(d.card_no ?? 0).padStart(4, "0")}</span>
      </div>

      <div class="hero-me">
        <div class="hero-av">${diagnosed ? (opts.charSVG ?? "") : SILHOUETTE}</div>
        <p class="hero-name">${esc(d.display_name)}</p>
        ${diagnosed ? `
          <div class="hero-trow">
            <span class="hero-code">${esc(d.type_code)}</span>
            <span class="hero-tn">${esc(opts.animal ?? "")}・${esc(opts.typeName ?? "")}</span>
          </div>` : `<p class="hero-undiag">未診断</p>`}
        ${d.comment ? `<p class="hero-cmt">${escMultiline(d.comment)}</p>` : ""}
      </div>

      ${rings ? blk("section-meizan", `
        <p class="hero-lbl">踏破状況</p>
        <div class="mini-rings">${rings}</div>`) : ""}

      ${favs.length ? blk("section-mountains", `
        <p class="hero-lbl">${STAR}行ってよかった山</p>
        <div class="mini-tags">
          ${favs.map((m) => `<span class="mini-tag fav">${crown(m.pos)}${esc(m.name)}</span>`).join("")}
        </div>`) : ""}

      ${wish.length ? blk("section-mountains", `
        <p class="hero-lbl">${FLAG}行ってみたい山</p>
        <div class="mini-tags">
          ${wish.map((m) => `<span class="mini-tag wish">${esc(m.name)}</span>`).join("")}
        </div>`) : ""}
    </div>
    <span class="hero-brand hero-brand-foot">#ハイカーズカード</span>
  </div>`;
}

// =============================================
// 「誰のカードか」を示すバー（ヒーローカードの上に置く）
//
//   own        … マイカード（card.html）
//   own-public … 自分の公開ページを自分で見ている（/u/自分のID）
//   other      … 他人のカード（ログイン中）。交換済みかどうかも出す
//   guest      … 他人のカード（未ログイン）
//
// 自分のカードは太陽色、他人のカードはテーマのアクセント色にして、
// ひと目で区別できるようにする。
// =============================================
const IC_BAR = {
  me:   `<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>`,
  card: `<svg viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="18" rx="3"/><path d="M9 9h6M9 13h6"/></svg>`,
  eye:  `<svg viewBox="0 0 24 24"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>`,
  pen:  `<svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>`,
  back: `<svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg>`,
  ok:   `<svg viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"/></svg>`,
  img:  `<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2.5"/><circle cx="9" cy="10" r="1.8"/><path d="M21 16l-5-5-9 9"/></svg>`,
};

export function renderOwnerBar(kind, d = {}) {
  const name = esc(d.display_name);
  const btn = (href, icon, label, blank = false) =>
    `<a class="ob-btn" href="${href}" aria-label="${label}"${blank ? ' target="_blank" rel="noopener"' : ""}>${IC_BAR[icon]}<span>${label}</span></a>`;

  if (kind === "own") {
    return `
    <div class="owner-bar mine">
      <span class="ob-ic">${IC_BAR.me}</span>
      <p class="ob-t"><b>マイカード</b><span>あなたのカードです</span></p>
      <span class="ob-btns">
        ${btn(`/u/${encodeURIComponent(d.public_id)}`, "eye", "見え方")}
        ${btn("/card-image.html", "img", "画像", true)}
        ${btn("/edit.html", "pen", "編集")}
      </span>
    </div>`;
  }

  if (kind === "own-public") {
    return `
    <div class="owner-bar mine">
      <span class="ob-ic">${IC_BAR.eye}</span>
      <p class="ob-t"><b>あなたのカード</b><span>公開ページ：ほかの人にはこう見えます</span></p>
      ${btn("/card.html", "back", "マイカード")}
    </div>`;
  }

  const badge = kind === "other"
    ? (d.exchanged
        ? `<span class="ob-badge done">${IC_BAR.ok}交換済み</span>`
        : `<span class="ob-badge">未交換</span>`)
    : "";

  return `
  <div class="owner-bar">
    <span class="ob-ic">${IC_BAR.card}</span>
    <p class="ob-t"><b>${name}さんのカード</b><span>No.${String(d.card_no ?? 0).padStart(4, "0")}</span></p>
    ${badge}
  </div>`;
}

// 改行を保ったまま安全に出す（ひとこと用）
function escMultiline(s) {
  return esc(s).replace(/\r?\n/g, "<br>");
}

// =============================================
// 詳細セクション（カードの下に並べる）
//
// 並び：山リスト → 踏破状況 → 登山タイプ診断 → SNS
// 枠で囲わず、横線で区切るだけにしてヒーローカードを引き立てる
// =============================================
export function renderDetails(d, opts = {}) {
  return [
    mountainsSection(d, opts),
    meizanSection(d),
    diagnosisSection(d, opts),
    snsSection(d),
  ].filter(Boolean).join("");
}

// ---------- 山リスト ----------
function mountainsSection(d, opts) {
  const fav = sortedFavs(d.favorites);
  const wish = d.wishlist ?? [];

  // 自分のカードでは、空でもセクションを出して登録へ誘導する
  if (!fav.length && !wish.length) {
    if (!opts.own) return "";
    return `
    <section class="det" id="section-mountains">
      <div class="det-h"><h2>山リスト</h2></div>
      <p class="det-empty">行ってよかった山・行ってみたい山を<br>それぞれ5座まで載せられます。
        <a href="/mountains.html#fav">登録する</a></p>
    </section>`;
  }

  return `
  <section class="det" id="section-mountains">
    <div class="det-h"><h2>山リスト</h2></div>
    ${fav.length ? `<div class="d-card">
      <p class="d-sub first">行ってよかった山</p>
      <div class="d-tags">${tags(fav, "fav", STAR, opts.overlaps?.favorites)}</div>
    </div>` : ""}
    ${wish.length ? `<div class="d-card">
      <p class="d-sub first">行ってみたい山</p>
      <div class="d-tags">${tags(wish, "wish", FLAG, opts.overlaps?.wishlist)}</div>
    </div>` : ""}
    ${opts.own && (!fav.length || !wish.length) ? `
      <p class="det-empty">
        ${!fav.length ? "行ってよかった山" : "行ってみたい山"}がまだ未登録です。
        <a href="/mountains.html#${!fav.length ? "fav" : "wish"}">登録する</a>
      </p>` : ""}
  </section>`;
}

// overlaps: { 山名: [{ name, public_id }] }
function tags(list, cls, icon, overlaps) {
  const verb = cls === "fav" ? "も良かった山に選んでいます" : "も行ってみたい山にしています";
  return list.map((m) => {
    const lead = cls === "fav" ? crown(m.pos) : icon;
    const who = overlaps?.[m.name];
    if (!who?.length) return `<span class="d-tag ${cls}">${lead}${esc(m.name)}</span>`;
    const links = who.slice(0, 4)
      .map((p) => `<a href="/u/${encodeURIComponent(p.public_id)}">${esc(p.name)}さん</a>`)
      .join("、");
    const rest = who.length > 4 ? ` ほか${who.length - 4}人` : "";
    return `<span class="d-tag ${cls} has-ov" tabindex="0">
      ${lead}${esc(m.name)}<span class="ov-dot">${who.length}</span>
      <template class="ov-src">${links}${rest}${verb}</template>
    </span>`;
  }).join("");
}

// ---------- 踏破状況 ----------
function meizanSection(d) {
  const ranks = d.ranks ?? {};
  const list = d.climbed ?? [];
  const shown = RANKS.filter((r) => ranks[r.key] !== undefined && ranks[r.key] !== null);
  const showOther = ranks.other !== undefined && ranks.other !== null;
  const others = showOther ? list.filter((m) => !m.rank) : [];
  if (!shown.length && !others.length) return "";

  const total = shown.reduce((n, r) => n + Number(ranks[r.key]), 0);
  const caret = `<svg class="mz-car" viewBox="0 0 24 24" fill="none"
      stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>`;
  const tagList = (arr) => `
      <div class="mz-in"><div class="d-tags">
        ${arr.map((m) => `<span class="d-tag">${esc(m.name)}</span>`).join("")}
      </div></div>`;

  const blocks = shown.map((r) => {
    const done = Number(ranks[r.key]);
    const inRank = list.filter((m) => String(m.rank) === r.key);
    return `
      <button class="mz-row${inRank.length ? "" : " nolist"}" data-mz="${r.key}"
              ${inRank.length ? "" : "disabled"}>
        <div class="mz-r">${ringSVG(done, r.color, 22)}
          <div class="mn"><b>${done}</b><span>/100</span></div></div>
        <p class="mz-t">${r.label}<em>${done >= 100 ? "完登" : `あと${100 - done}座`}</em></p>
        ${inRank.length ? caret : ""}
      </button>
      ${inRank.length ? `<div class="mz-list" id="mzl-${r.key}">${tagList(inRank)}</div>` : ""}`;
  }).join("");

  return `
  <section class="det" id="section-meizan">
    <div class="det-h"><h2>踏破状況</h2>${shown.length ? `<span class="det-n">${total} / ${shown.length * 100}</span>` : ""}</div>
    <div class="d-card">
      ${blocks}
      ${others.length ? `
        <button class="mz-row mz-other${shown.length ? "" : " solo"}" data-mz="other">
          <div class="mz-r mz-r-other"><div class="mn"><b>${others.length}</b><span>座</span></div></div>
          <p class="mz-t">その他<em>名山リスト外の山</em></p>
          ${caret}
        </button>
        <div class="mz-list" id="mzl-other">${tagList(others)}</div>` : ""}
    </div>
  </section>`;
}

// ---------- 登山タイプ診断 ----------
const AXIS_DEFS = [
  { key: "pe", title: "目的",   a: "P", b: "E", aName: "ピークハント", bName: "エンジョイ" },
  { key: "sg", title: "仲間",   a: "S", b: "G", aName: "ソロ",         bName: "グループ" },
  { key: "lf", title: "計画",   a: "L", b: "F", aName: "計画的",       bName: "フィーリング" },
  { key: "ca", title: "リスク", a: "C", b: "A", aName: "慎重",         bName: "挑戦的" },
];

function diagnosisSection(d, opts) {
  if (!d.type_code) return "";

  const rows = AXIS_DEFS.map((ax) => {
    const aPct = d.axes?.[ax.key];
    if (aPct === null || aPct === undefined) return "";
    const bPct = 100 - aPct;
    const aWins = aPct >= 50;
    return `
      <div class="d-ax">
        <p class="d-ax-t">${ax.title}</p>
        <div class="d-ax-h">
          <span class="${aWins ? "w" : "l"}">${ax.a} ${ax.aName} <b>${aPct}</b></span>
          <span class="${aWins ? "l" : "w"}"><b>${bPct}</b> ${ax.bName} ${ax.b}</span>
        </div>
        <div class="d-ax-track">
          <i class="${aWins ? "" : "b"}" style="width:${aWins ? aPct : bPct}%"></i>
        </div>
      </div>`;
  }).join("");

  return `
  <section class="det" id="section-diagnosis">
    <div class="det-h"><h2>登山タイプ診断</h2><span class="det-n">${esc(d.type_code)}</span></div>
    ${opts.typeName ? `<p class="d-type">${esc(opts.animal ?? "")}・${esc(opts.typeName)}</p>` : ""}
    <div class="d-card">
      ${opts.features ? `<p class="d-sub first">特徴</p><p class="d-desc">${esc(opts.features)}</p>` : ""}
      ${opts.caution ? `<p class="d-sub${opts.features ? "" : " first"}">気をつけたいこと</p><p class="d-desc">${esc(opts.caution)}</p>` : ""}
      ${rows ? `<p class="d-sub${opts.features || opts.caution ? "" : " first"}">4軸のスコア</p>${rows}` : ""}
    </div>
  </section>`;
}

// ---------- SNS ----------
function snsSection(d) {
  const entries = Object.entries(d.sns ?? {})
    .filter(([k, v]) => SNS[k] && String(v ?? "").trim());
  if (!entries.length) return "";

  return `
  <section class="det" id="section-sns">
    <div class="det-h"><h2>SNS</h2></div>
    <div class="sns-links">
      ${entries.map(([k, v]) => `
        <a class="sns-link" href="${esc(SNS[k].url(encodeURIComponent(v)))}"
           target="_blank" rel="noopener noreferrer">
          ${snsIcon(k)}
          <span class="sns-t"><b>${SNS[k].label}</b><span>${esc(v)}</span></span>
          <svg class="sns-go" viewBox="0 0 24 24" fill="none" stroke-linecap="round"
               stroke-linejoin="round"><path d="M7 17L17 7M9 7h8v8"/></svg>
        </a>`).join("")}
    </div>
  </section>`;
}

// =============================================
// 操作を有効にする
//   ・ヒーローカード → 詳細へスムーズスクロール
//   ・踏破状況の開閉（開いたものは、もう一度押すまで閉じない）
//   ・重なりの吹き出し
// =============================================
export function bindCardInteractions(root = document) {
  root.querySelectorAll("[data-go]").forEach((b) => {
    if (b.dataset.bound) return;
    b.dataset.bound = "1";
    b.addEventListener("click", () => {
      const el = document.getElementById(b.dataset.go);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // 押したものだけを開閉する。ほかの開いているものには触らない
  root.querySelectorAll("[data-mz]").forEach((b) => {
    if (b.dataset.bound) return;
    b.dataset.bound = "1";
    b.addEventListener("click", () => {
      const target = root.querySelector(`#mzl-${b.dataset.mz}`);
      if (!target) return;
      const open = !b.classList.contains("open");
      b.classList.toggle("open", open);
      target.classList.toggle("open", open);
    });
  });

  bindOverlapPopover(root);
}

// ---------------------------------------------
// 重なりの吹き出し
//
// タグの中に置くと、画面の端で切れてしまう（スマホで顕著）。
// そこで body 直下に1つだけ吹き出しを作り、
// 押した（マウスを乗せた）タグの位置に合わせて、画面内に収まるよう置く。
// 吹き出しの中の名前は、その人のカードへのリンクになっている。
// ---------------------------------------------
let pop = null;
let popFor = null;
let hideTimer = null;

function ensurePop() {
  if (pop) return pop;
  pop = document.createElement("div");
  pop.className = "ov-pop";
  pop.hidden = true;
  pop.innerHTML = `<div class="ov-pop-in"></div><i class="ov-pop-arrow"></i>`;
  document.body.appendChild(pop);

  // 吹き出しの上にマウスがある間は閉じない（リンクを押せるように）
  pop.addEventListener("mouseenter", () => clearTimeout(hideTimer));
  pop.addEventListener("mouseleave", () => scheduleHide());
  pop.addEventListener("click", (e) => e.stopPropagation());

  document.addEventListener("click", () => hidePop());
  addEventListener("resize", () => hidePop());
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") hidePop(); });
  return pop;
}

function showPop(tag) {
  const p = ensurePop();
  clearTimeout(hideTimer);
  const src = tag.querySelector(".ov-src");
  if (!src) return;

  p.querySelector(".ov-pop-in").innerHTML = src.innerHTML;
  p.hidden = false;
  popFor = tag;

  // 画面の幅に合わせて位置を決める
  const margin = 10;
  const vw = document.documentElement.clientWidth;
  const r = tag.getBoundingClientRect();
  const w = Math.min(250, vw - margin * 2);
  p.style.width = w + "px";

  const h = p.offsetHeight;
  const cx = r.left + r.width / 2;
  const left = Math.max(margin, Math.min(cx - w / 2, vw - w - margin));

  // 上に出すスペースが無ければ（ヘッダーと重なるなら）下に出す
  const headerH = 70;
  const below = r.top - h - 10 < headerH;
  const top = below ? r.bottom + 10 : r.top - h - 10;

  p.style.left = left + scrollX + "px";
  p.style.top = top + scrollY + "px";
  p.classList.toggle("below", below);

  // 矢印はタグの中央を指す
  const arrowX = Math.max(14, Math.min(cx - left, w - 14));
  p.querySelector(".ov-pop-arrow").style.left = arrowX + "px";
}

function hidePop() {
  clearTimeout(hideTimer);
  if (pop) pop.hidden = true;
  popFor = null;
}

function scheduleHide() {
  clearTimeout(hideTimer);
  hideTimer = setTimeout(hidePop, 220);
}

function bindOverlapPopover(root) {
  const canHover = matchMedia("(hover: hover) and (pointer: fine)").matches;

  root.querySelectorAll(".d-tag.has-ov").forEach((t) => {
    if (t.dataset.bound) return;
    t.dataset.bound = "1";

    // タップで開閉する（スマホにはマウスオーバーが無いため）。
    // マウスの場合は乗せた時点で開いているので、クリックでは閉じない
    t.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!canHover && popFor === t && !pop.hidden) hidePop();
      else showPop(t);
    });

    if (canHover) {
      t.addEventListener("mouseenter", () => showPop(t));
      t.addEventListener("mouseleave", () => scheduleHide());
    }
  });
}

// ---------------------------------------------
export function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// =============================================
// ヒーローカードを傾けて立体感を出す
//
// マウスの位置に合わせて、カードを少しだけ傾け、光の当たる位置を動かす。
// マウスのある端末（PC）だけ。動きを減らす設定の人には効かせない。
// =============================================
export function enableTilt(card) {
  if (!card) return;
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const MAX = 5;   // 最大の傾き（度）
  card.classList.add("tilt");

  card.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;    // 0〜1
    const y = (e.clientY - r.top) / r.height;
    card.style.setProperty("--rx", `${(0.5 - y) * MAX}deg`);
    card.style.setProperty("--ry", `${(x - 0.5) * MAX}deg`);
    card.style.setProperty("--gx", `${x * 100}%`);
    card.style.setProperty("--gy", `${y * 100}%`);
  });
  card.addEventListener("pointerleave", () => {
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
    card.style.setProperty("--gx", "30%");
    card.style.setProperty("--gy", "0%");
  });
}
