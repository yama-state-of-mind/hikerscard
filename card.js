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
// ヒーローカード（横長・要約）
//
// 4軸スコアは入れない。詳細は下のセクションで見せる。
// 右側の各エリアを押すと、対応する詳細へスクロールする。
// =============================================
export function renderHeroCard(d, opts = {}) {
  const diagnosed = !!d.type_code;
  const bg = BG[d.card_bg] ? d.card_bg : "contour";
  const ranks = d.ranks ?? {};
  const linked = opts.linked !== false;   // false ならスクロールさせない（コレクション用）

  const shown = RANKS.filter((r) => ranks[r.key] !== undefined && ranks[r.key] !== null);

  const rings = shown.map((r) => {
    const done = Number(ranks[r.key]);
    return `
      <div class="mini-ring">
        <div class="mr">${ringSVG(done, r.color, 15)}
          <div class="mn"><b>${done}</b><span>/100</span></div></div>
        <p>${r.label}</p><em>${done >= 100 ? "完登" : `あと${100 - done}`}</em>
      </div>`;
  }).join("");

  const favN = d.favorites?.length ?? 0;
  const wishN = d.wishlist?.length ?? 0;
  const sampleTags = [
    ...(d.favorites ?? []).slice(0, 1).map((m) => `<span class="mini-tag fav">${esc(m.name)}</span>`),
    ...(d.wishlist ?? []).slice(0, 1).map((m) => `<span class="mini-tag wish">${esc(m.name)}</span>`),
  ].join("");

  const tag = (go, inner) => linked
    ? `<button class="hero-blk" data-go="${go}">${inner}</button>`
    : `<div class="hero-blk">${inner}</div>`;

  return `
  <div class="hero t-${bg}">
    <svg class="hero-bg" viewBox="0 0 380 240" preserveAspectRatio="xMidYMid slice">${BG[bg]()}</svg>

    <div class="hero-l">
      <span class="hero-no">No.${String(d.card_no ?? 0).padStart(4, "0")}</span>
      <div class="hero-chip"></div>
      <div class="hero-me">
        <div class="hero-av">${diagnosed ? (opts.charSVG ?? "") : SILHOUETTE}</div>
        <p class="hero-name">${esc(d.display_name)}</p>
      </div>
      <div class="hero-type">
        <p class="hero-lbl">登山タイプ</p>
        ${diagnosed ? `
          <div class="hero-trow">
            <span class="hero-code">${esc(d.type_code)}</span>
            <span class="hero-tn"><b>${esc(opts.animal ?? "")}</b><span>${esc(opts.typeName ?? "")}</span></span>
          </div>` : `<p class="hero-undiag">未診断</p>`}
        ${d.comment ? `<p class="hero-cmt">&ldquo;${esc(d.comment)}&rdquo;</p>` : ""}
      </div>
    </div>

    <div class="hero-r">
      ${rings ? tag("section-meizan", `
        <p class="hero-lbl">名山ハント</p>
        <div class="mini-rings">${rings}</div>`) : ""}

      ${(favN || wishN) ? tag("section-mountains", `
        <p class="hero-lbl">山リスト
          ${favN ? `<span class="mini-cnt fav">★${favN}</span>` : ""}
          ${wishN ? `<span class="mini-cnt wish">⚑${wishN}</span>` : ""}</p>
        <div class="mini-tags">${sampleTags}</div>`) : ""}
    </div>
  </div>`;
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
  if (!fav.length && !wish.length) return "";

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
