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
// テーマをページ全体に効かせる
//
// カードの背景を選ぶと、ページの地色や見出しの色も変わる。
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

// =============================================
// カード（縦長・要約）
//
// 横長はスマホで文字が小さくなりすぎるため縦長に戻した。
// ここは要約だけを置き、詳細は下のセクションで見せる。
// 背景の模様と、動物ごとの足跡を敷く。
// =============================================
export function renderHeroCard(d, opts = {}) {
  const diagnosed = !!d.type_code;
  const bg = BG[d.card_bg] ? d.card_bg : "contour";
  const ranks = d.ranks ?? {};
  const linked = opts.linked !== false;   // false ならスクロールさせない

  const shown = RANKS.filter((r) => ranks[r.key] !== undefined && ranks[r.key] !== null);

  const rings = shown.map((r) => {
    const done = Number(ranks[r.key]);
    return `
      <div class="mini-ring">
        <div class="mr">${ringSVG(done, r.color, 19)}
          <div class="mn"><b>${done}</b><span>/100</span></div></div>
        <p>${r.label}</p><em>${done >= 100 ? "完登" : `あと${100 - done}`}</em>
      </div>`;
  }).join("");

  const favN = d.favorites?.length ?? 0;
  const wishN = d.wishlist?.length ?? 0;
  const sampleTags = [
    ...(d.favorites ?? []).slice(0, 2).map((m) => `<span class="mini-tag fav">${esc(m.name)}</span>`),
    ...(d.wishlist ?? []).slice(0, 2).map((m) => `<span class="mini-tag wish">${esc(m.name)}</span>`),
  ].join("");

  const blk = (go, inner) => linked
    ? `<button class="hero-blk" data-go="${go}">${inner}</button>`
    : `<div class="hero-blk">${inner}</div>`;

  return `
  <div class="hero t-${bg}">
    <svg class="hero-bg" viewBox="0 0 320 540" preserveAspectRatio="xMidYMid slice">${BG[bg]()}</svg>
    ${diagnosed ? `
      <svg class="hero-paw" viewBox="0 0 320 540" preserveAspectRatio="xMidYMid slice">
        ${pawTrail(d.type_code)}
      </svg>` : ""}

    <div class="hero-in">
      <div class="hero-top">
        <span class="hero-brand">${LOGO_MARK}<span>ハイカーズカード</span></span>
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
        <p class="hero-lbl">名山ハント</p>
        <div class="mini-rings">${rings}</div>`) : ""}

      ${(favN || wishN) ? blk("section-mountains", `
        <p class="hero-lbl">山リスト
          ${favN ? `<span class="mini-cnt fav">★${favN}</span>` : ""}
          ${wishN ? `<span class="mini-cnt wish">⚑${wishN}</span>` : ""}</p>
        <div class="mini-tags">${sampleTags}</div>`) : ""}
    </div>
  </div>`;
}

// 改行を保ったまま安全に出す（ひとこと用）
function escMultiline(s) {
  return esc(s).replace(/\r?\n/g, "<br>");
}

// =============================================
// 詳細セクション（カードの下に並べる）
// =============================================
export function renderDetails(d, opts = {}) {
  return [
    diagnosisSection(d, opts),
    meizanSection(d),
    mountainsSection(d, opts),
  ].filter(Boolean).join("");
}

// ---------- 登山タイプ ----------
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
    <div class="det-h"><h2>登山タイプ</h2><span class="det-n">${esc(d.type_code)}</span></div>
    ${rows ? `<div class="d-card">${rows}</div>` : ""}
    ${(opts.features || opts.caution) ? `
      <div class="d-card">
        ${opts.features ? `<p class="d-sub">特徴</p><p class="d-desc">${esc(opts.features)}</p>` : ""}
        ${opts.caution ? `<p class="d-sub">気をつけたいこと</p><p class="d-desc">${esc(opts.caution)}</p>` : ""}
      </div>` : ""}
  </section>`;
}

// ---------- 名山ハント ----------
function meizanSection(d) {
  const ranks = d.ranks ?? {};
  const list = d.climbed ?? [];
  const shown = RANKS.filter((r) => ranks[r.key] !== undefined && ranks[r.key] !== null);
  if (!shown.length && !list.length) return "";

  const total = shown.reduce((n, r) => n + Number(ranks[r.key]), 0);
  const others = list.filter((m) => !m.rank);

  const blocks = shown.map((r, i) => {
    const done = Number(ranks[r.key]);
    const inRank = list.filter((m) => String(m.rank) === r.key);
    return `
      <button class="mz-row${inRank.length ? "" : " nolist"}" data-mz="${r.key}"
              ${inRank.length ? "" : "disabled"}>
        <div class="mz-r">${ringSVG(done, r.color, 22)}
          <div class="mn"><b>${done}</b><span>/100</span></div></div>
        <p class="mz-t">${r.label}<em>${done >= 100 ? "完登" : `あと${100 - done}座`}</em></p>
        ${inRank.length ? `<svg class="mz-car" viewBox="0 0 24 24" fill="none"
          stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>` : ""}
      </button>
      ${inRank.length ? `
        <div class="mz-list" id="mzl-${r.key}">
          <div class="mz-in"><div class="d-tags">
            ${inRank.map((m) => `<span class="d-tag">${esc(m.name)}</span>`).join("")}
          </div></div>
        </div>` : ""}`;
  }).join("");

  return `
  <section class="det" id="section-meizan">
    <div class="det-h"><h2>名山ハント</h2><span class="det-n">${total} / 300</span></div>
    <div class="d-card">
      ${blocks}
      ${others.length ? `
        <button class="mz-row mz-other" data-mz="other">
          <p class="mz-t">そのほかの山<em>${others.length}座</em></p>
          <svg class="mz-car" viewBox="0 0 24 24" fill="none"
            stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
        </button>
        <div class="mz-list" id="mzl-other">
          <div class="mz-in"><div class="d-tags">
            ${others.map((m) => `<span class="d-tag">${esc(m.name)}</span>`).join("")}
          </div></div>
        </div>` : ""}
    </div>
  </section>`;
}

// ---------- 山リスト ----------
function mountainsSection(d, opts) {
  const fav = d.favorites ?? [];
  const wish = d.wishlist ?? [];

  // 自分のカードでは、空でもセクションを出して登録へ誘導する
  if (!fav.length && !wish.length) {
    if (!opts.own) return "";
    return `
    <section class="det" id="section-mountains">
      <div class="det-h"><h2>山リスト</h2></div>
      <div class="hc-empty">
        <p>行ってよかった山・登ってみたい山を<br>それぞれ5座まで載せられます。</p>
        <button class="btn ghost" style="margin-top:12px"
                onclick="location.href='./picks.html'">選ぶ</button>
      </div>
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
      <p class="d-sub first">登ってみたい山</p>
      <div class="d-tags">${tags(wish, "wish", FLAG, opts.overlaps?.wishlist)}</div>
    </div>` : ""}
    ${opts.own && (!fav.length || !wish.length) ? `
      <p class="af-note" style="text-align:center;margin-top:10px">
        ${!fav.length ? "行ってよかった山" : "登ってみたい山"}がまだ未登録です。
        <a href="./picks.html" style="color:var(--c-acc)">選ぶ</a>
      </p>` : ""}
  </section>`;
}

// overlaps: { 山名: [{ name, public_id }] }
function tags(list, cls, icon, overlaps) {
  const verb = cls === "fav" ? "も良かった山に選んでいます" : "も登ってみたい山にしています";
  return list.map((m) => {
    const who = overlaps?.[m.name];
    if (!who?.length) return `<span class="d-tag ${cls}">${icon}${esc(m.name)}</span>`;
    const links = who.slice(0, 4)
      .map((p) => `<a href="/u/${encodeURIComponent(p.public_id)}">${esc(p.name)}</a>`)
      .join("、");
    const rest = who.length > 4 ? ` ほか${who.length - 4}人` : "";
    return `<span class="d-tag ${cls} has-ov">
      ${icon}${esc(m.name)}<span class="ov-dot">${who.length}</span>
      <span class="ov-bubble">${links}${rest}${verb}</span>
    </span>`;
  }).join("");
}

// =============================================
// 操作を有効にする
//   ・ヒーローカード → 詳細へスムーズスクロール
//   ・名山ハントの折りたたみ
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

  // 名山は1つずつ開く
  root.querySelectorAll("[data-mz]").forEach((b) => {
    if (b.dataset.bound) return;
    b.dataset.bound = "1";
    b.addEventListener("click", () => {
      const target = root.querySelector(`#mzl-${b.dataset.mz}`);
      const wasOpen = b.classList.contains("open");
      root.querySelectorAll("[data-mz]").forEach((x) => x.classList.remove("open"));
      root.querySelectorAll(".mz-list").forEach((x) => x.classList.remove("open"));
      if (!wasOpen && target) { b.classList.add("open"); target.classList.add("open"); }
    });
  });

  // 吹き出しはタップでも開く（スマホにはマウスオーバーが無いため）
  root.querySelectorAll(".d-tag.has-ov").forEach((t) => {
    if (t.dataset.bound) return;
    t.dataset.bound = "1";
    t.addEventListener("click", (e) => {
      if (e.target.closest("a")) return;
      e.stopPropagation();
      const open = t.classList.contains("show-ov");
      root.querySelectorAll(".d-tag.show-ov").forEach((x) => x.classList.remove("show-ov"));
      if (!open) t.classList.add("show-ov");
    });
  });
  document.addEventListener("click", () => {
    document.querySelectorAll(".d-tag.show-ov").forEach((x) => x.classList.remove("show-ov"));
  });
}

// ---------------------------------------------
export function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// =============================================
// 相手との共通点
//
// 公開ページをログイン済みで見たときに出す。
// 「同じところ」を具体的に見せて、会話のきっかけにする。
// =============================================
const AXIS_COMMENT = {
  pe: { P: "どちらも頂上を目指すタイプ", E: "どちらも道中を楽しむタイプ" },
  sg: { S: "どちらも一人の時間を大事にする", G: "どちらも誰かと登るのが好き" },
  lf: { L: "どちらも計画を立ててから動く", F: "どちらもその日の気分で決める" },
  ca: { C: "どちらも慎重に判断する", A: "どちらも挑戦を選ぶ" },
};
const AXIS_META = {
  pe: { a: "P", b: "E", title: "目的" },
  sg: { a: "S", b: "G", title: "仲間" },
  lf: { a: "L", b: "F", title: "計画" },
  ca: { a: "C", b: "A", title: "リスク" },
};

export function buildAffinity(me, other) {
  if (!me || !other) return null;

  // ---- 4軸の一致 ----
  const axisHits = [];
  let axisScore = 0;
  if (me.axes && other.axes) {
    for (const k of ["pe", "sg", "lf", "ca"]) {
      const a = me.axes[k], b = other.axes[k];
      if (a == null || b == null) continue;
      const sideA = a >= 50, sideB = b >= 50;
      if (sideA === sideB) {
        const letter = sideA ? AXIS_META[k].a : AXIS_META[k].b;
        axisHits.push({ title: AXIS_META[k].title, letter, text: AXIS_COMMENT[k][letter] });
        // 寄り具合が近いほど高く（同じ側で最大25点）
        axisScore += 25 - Math.min(24, Math.abs(a - b) / 2);
      }
    }
  }

  // ---- 山の重なり ----
  const names = (list) => new Set((list ?? []).map((m) => m.name));
  const myFav = names(me.favorites), myWish = names(me.wishlist);
  const myClimbed = names(me.climbed);

  const sameFav  = (other.favorites ?? []).filter((m) => myFav.has(m.name)).map((m) => m.name);
  const sameWish = (other.wishlist ?? []).filter((m) => myWish.has(m.name)).map((m) => m.name);
  // 相手が登りたい山を、自分はもう登っている
  const canTell  = (other.wishlist ?? []).filter((m) => myClimbed.has(m.name)).map((m) => m.name);
  // 自分が登りたい山を、相手はもう登っている
  const canAsk   = (me.wishlist ?? []).filter((m) => names(other.climbed).has(m.name)).map((m) => m.name);

  const mtScore = Math.min(100, sameFav.length * 12 + sameWish.length * 10 + canTell.length * 4);
  const score = Math.round(axisScore * 0.7 + mtScore * 0.3);

  return {
    score: Math.max(0, Math.min(100, score)),
    axisHits, sameFav, sameWish, canTell, canAsk,
    label: score >= 75 ? "とても近い" : score >= 50 ? "近い" : score >= 25 ? "少し違う" : "かなり違う",
  };
}

export function renderAffinity(af, partnerName) {
  if (!af) return "";

  const items = [];

  if (af.axisHits.length) {
    items.push(`
      <div class="af-item">
        <p class="af-t">登山タイプ</p>
        <ul class="af-list">
          ${af.axisHits.map((h) => `<li><b>${h.letter}</b>${esc(h.text)}</li>`).join("")}
        </ul>
      </div>`);
  }

  const mtRow = (label, list, cls) => list.length ? `
    <div class="af-item">
      <p class="af-t">${label}</p>
      <div class="d-tags">${list.map((n) => `<span class="d-tag ${cls}">${esc(n)}</span>`).join("")}</div>
    </div>` : "";

  items.push(mtRow("同じ山を「よかった」に選んでいます", af.sameFav, "fav"));
  items.push(mtRow("同じ山に登りたいと思っています", af.sameWish, "wish"));

  if (af.canTell.length) {
    items.push(`
      <div class="af-item">
        <p class="af-t">${esc(partnerName)}さんが登りたい山のうち、あなたが登った山</p>
        <div class="d-tags">${af.canTell.map((n) => `<span class="d-tag">${esc(n)}</span>`).join("")}</div>
        <p class="af-note">話を聞かせてあげられそうです。</p>
      </div>`);
  }
  if (af.canAsk.length) {
    items.push(`
      <div class="af-item">
        <p class="af-t">あなたが登りたい山のうち、${esc(partnerName)}さんが登った山</p>
        <div class="d-tags">${af.canAsk.map((n) => `<span class="d-tag">${esc(n)}</span>`).join("")}</div>
        <p class="af-note">話を聞いてみるとよさそうです。</p>
      </div>`);
  }

  const body = items.filter(Boolean).join("");

  return `
  <section class="det" id="section-affinity">
    <div class="det-h"><h2>${esc(partnerName)}さんとの共通点</h2></div>
    <div class="d-card">
      <div class="af-score">
        <div class="af-meter">
          <div class="af-bar" style="width:${af.score}%"></div>
        </div>
        <div class="af-num"><b>${af.score}</b><span>${af.label}</span></div>
      </div>
      ${body || `<p class="af-none">まだ共通点が見つかりません。<br>
        山を登録すると、重なりが見えてきます。</p>`}
    </div>
  </section>`;
}
