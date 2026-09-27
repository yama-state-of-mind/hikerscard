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

const STAR = `<svg class="hc-star" viewBox="0 0 24 24"><path d="M12 2l3 6.6 7 .9-5.2 4.9 1.4 7L12 18l-6.2 3.4 1.4-7L2 9.5l7-.9z"/></svg>`;
const FLAG = `<svg class="hc-flag" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21V4"/><path d="M5 5h12l-2 4 2 4H5"/></svg>`;

// ---------------------------------------------
// カード全体
// ---------------------------------------------
export function renderCard(d, opts = {}) {
  const diagnosed = !!d.type_code;
  const bg = BG[d.card_bg] ? d.card_bg : "contour";
  const uid = opts.uid ?? Math.random().toString(36).slice(2, 8);

  return `
  <div class="hcard t-${bg}" data-uid="${uid}">
    <svg class="card-bg" viewBox="0 0 320 540" preserveAspectRatio="xMidYMid slice">${BG[bg]()}</svg>
    <div class="hcard-inner">

      <div class="hc-head">
        <span class="hc-no">No.${String(d.card_no ?? 0).padStart(4, "0")}</span>
        <div class="hc-avatar">${diagnosed ? (opts.charSVG ?? "") : SILHOUETTE}</div>
        <p class="hc-name">${esc(d.display_name)}</p>
        ${diagnosed
          ? `<p class="hc-type">${esc(opts.animal ?? "")}・${esc(opts.typeName ?? "")}</p>
             <span class="hc-code">${esc(d.type_code)}</span>`
          : `<p class="hc-type undiag">未診断</p>`}
      </div>

      ${d.comment ? `
      <div class="hc-blk">
        <p class="hc-blk-t">ひとこと</p>
        <p class="hc-cmt">&ldquo;${esc(d.comment)}&rdquo;</p>
      </div>` : ""}

      ${diagnosed && d.axes ? axesBlock(d.axes, uid, opts) : ""}

      ${meizanBlock(d, uid)}

      ${tagBlock("行ってよかった山", d.favorites, "fav", STAR, opts.overlaps?.favorites)}
      ${tagBlock("登ってみたい山", d.wishlist, "wish", FLAG, opts.overlaps?.wishlist)}

      ${snsBlock(d.sns)}

    </div>
  </div>`;
}

// ---------------------------------------------
// 折りたたみの開閉を有効にする。カードを描いたあとに呼ぶ
// ---------------------------------------------
export function bindCardToggles(root = document) {
  // 名山の一覧（hy-row）と、登山タイプの説明（ax-row）
  [["hy-row", "hy-list"], ["ax-row", "ax-list"]].forEach(([rowCls, listId]) => {
    root.querySelectorAll("." + rowCls).forEach((row) => {
      if (row.dataset.bound) return;
      row.dataset.bound = "1";
      row.addEventListener("click", () => {
        const list = root.querySelector(`#${listId}-${row.dataset.uid}`);
        row.classList.toggle("open");
        if (list) list.classList.toggle("open");
      });
    });
  });

  // 重なりの吹き出しは、タップでも出せるようにする
  // （スマホにはマウスオーバーが無いため）
  root.querySelectorAll(".hc-tag.has-ov").forEach((tag) => {
    if (tag.dataset.bound) return;
    tag.dataset.bound = "1";
    tag.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = tag.classList.contains("show-ov");
      root.querySelectorAll(".hc-tag.show-ov").forEach((t) => t.classList.remove("show-ov"));
      if (!open) tag.classList.add("show-ov");
    });
  });
  document.addEventListener("click", () => {
    document.querySelectorAll(".hc-tag.show-ov").forEach((t) => t.classList.remove("show-ov"));
  });
}

// ---------------------------------------------
// 診断の4軸（両端型なので横バーで表す）
// ---------------------------------------------
const AXIS_DEFS = [
  { key: "pe", title: "目的",   a: "P", b: "E", aName: "ピークハント", bName: "エンジョイ" },
  { key: "sg", title: "仲間",   a: "S", b: "G", aName: "ソロ",         bName: "グループ" },
  { key: "lf", title: "計画",   a: "L", b: "F", aName: "計画的",       bName: "フィーリング" },
  { key: "ca", title: "リスク", a: "C", b: "A", aName: "慎重",         bName: "挑戦的" },
];

function axesBlock(axes, uid, opts = {}) {
  const rows = AXIS_DEFS.map((ax) => {
    const aPct = axes[ax.key];
    if (aPct === null || aPct === undefined) return "";
    const bPct = 100 - aPct;
    const aWins = aPct >= 50;
    return `
      <div class="hc-ax">
        <p class="hc-ax-title">${ax.title}</p>
        <div class="hc-ax-head">
          <span class="${aWins ? "w" : "l"}">${ax.a} ${ax.aName} <b>${aPct}</b></span>
          <span class="${aWins ? "l" : "w"}"><b>${bPct}</b> ${ax.bName} ${ax.b}</span>
        </div>
        <div class="hc-ax-track">
          <div class="hc-ax-bar ${aWins ? "a" : "b"}" style="width:${aWins ? aPct : bPct}%"></div>
        </div>
      </div>`;
  }).join("");

  if (!rows.trim()) return "";

  // 押すと4軸の下に「特徴」「気をつけたいこと」が開く
  const hasText = !!(opts.features || opts.caution);

  return `
  <div class="hc-blk">
    <p class="hc-blk-t">登山タイプ</p>
    <button class="ax-row${hasText ? "" : " nolist"}" data-uid="${uid}" ${hasText ? "" : "disabled"}>
      <div class="ax-rows">${rows}</div>
      ${hasText ? `<svg class="hy-caret" viewBox="0 0 24 24" fill="none"
        stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>` : ""}
    </button>
    ${hasText ? `
    <div class="hy-list" id="ax-list-${uid}">
      <div class="hy-list-in">
        ${opts.features ? `
          <p class="hc-sub-t">特徴</p>
          <p class="hc-desc">${esc(opts.features)}</p>` : ""}
        ${opts.caution ? `
          <p class="hc-sub-t" style="margin-top:12px">気をつけたいこと</p>
          <p class="hc-desc">${esc(opts.caution)}</p>` : ""}
      </div>
    </div>` : ""}
  </div>`;
}

// ---------------------------------------------
// 名山の踏破リング＋折りたたみ
//
// 百名山・二百名山・三百名山を、公開設定がオンのものだけ横に並べる。
// 山の一覧は押したときだけ開く（並びっぱなしだとくどいため）
// ---------------------------------------------
const RANKS = [
  { key: "100", label: "百名山",   short: "百",   color: "#E0A33B" },
  { key: "200", label: "二百名山", short: "二百", color: "#8CA9BD" },
  { key: "300", label: "三百名山", short: "三百", color: "#B9C6BD" },
];

function meizanBlock(d, uid) {
  const ranks = d.ranks ?? {};
  const list = d.climbed ?? [];
  const hasList = list.length > 0;

  const rings = RANKS
    .filter((r) => ranks[r.key] !== undefined && ranks[r.key] !== null)
    .map((r) => ring(Number(ranks[r.key]), r));

  // 公開されているリングが1つもなく、山の登録もないなら出さない
  if (!rings.length && !hasList) return "";

  const other = Number(ranks.other ?? 0);

  return `
  <div class="hc-blk">
    <p class="hc-blk-t">名山ハント</p>
    <button class="hy-row${hasList ? "" : " nolist"}" data-uid="${uid}" ${hasList ? "" : "disabled"}>
      <div class="hc-rings">${rings.join("")}</div>
      ${hasList ? `<svg class="hy-caret" viewBox="0 0 24 24" fill="none"
        stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>` : ""}
    </button>
    ${other > 0 ? `<p class="hc-other">そのほか <b>${other}座</b></p>` : ""}
    ${hasList ? `
    <div class="hy-list" id="hy-list-${uid}">
      <div class="hy-list-in">
        <div class="hc-tags">
          ${list.map((m) => `
            <span class="hc-tag">
              ${m.rank ? `<span class="hc-b100 r${m.rank}">${
                m.rank === 100 ? "百" : m.rank === 200 ? "二百" : "三百"}</span>` : ""}${esc(m.name)}
            </span>`).join("")}
        </div>
      </div>
    </div>` : ""}
  </div>`;
}

function ring(done, r) {
  const rad = 22;
  const C = 2 * Math.PI * rad;
  return `
    <div class="hc-ring-item">
      <div class="hc-ring">
        <svg viewBox="0 0 52 52">
          <circle cx="26" cy="26" r="${rad}" fill="none" stroke="var(--c-soft)" stroke-width="5"/>
          <circle cx="26" cy="26" r="${rad}" fill="none" stroke="${r.color}" stroke-width="5"
                  stroke-linecap="round" stroke-dasharray="${C}"
                  stroke-dashoffset="${C * (1 - done / 100)}" transform="rotate(-90 26 26)"/>
        </svg>
        <div class="hc-ring-num"><b>${done}</b><span>/100</span></div>
      </div>
      <p class="hc-ring-label">${r.label}</p>
      <p class="hc-ring-rest">${done >= 100 ? "完登" : `あと${100 - done}`}</p>
    </div>`;
}

// ---------------------------------------------
// 好きな山・登りたい山
// ---------------------------------------------
// overlaps: { 山名: ["たくみ", "green_mt"] }
// 交換した相手と同じ山を選んでいたら、吹き出しで知らせる
function tagBlock(label, list, cls, icon, overlaps) {
  if (!list?.length) return "";

  const verb = cls === "fav" ? "も良かった山に選んでいます" : "も登ってみたい山にしています";

  return `
  <div class="hc-blk">
    <p class="hc-blk-t">${label} <span class="hc-n">${list.length}</span></p>
    <div class="hc-tags">
      ${list.map((m) => {
        const who = overlaps?.[m.name];
        if (!who?.length) return `<span class="hc-tag ${cls}">${icon}${esc(m.name)}</span>`;
        const names = who.slice(0, 3).map(esc).join("、")
          + (who.length > 3 ? ` ほか${who.length - 3}人` : "");
        return `<span class="hc-tag ${cls} has-ov">
          ${icon}${esc(m.name)}<span class="ov-dot">${who.length}</span>
          <span class="ov-bubble">${names}${verb}</span>
        </span>`;
      }).join("")}
    </div>
  </div>`;
}

// ---------------------------------------------
// SNSリンク
// ---------------------------------------------
function snsBlock(sns) {
  if (!sns) return "";
  const items = Object.entries(sns)
    .filter(([k, v]) => SNS[k] && v)
    .map(([k, v]) => {
      const s = SNS[k];
      const inner = s.icon === "mt"
        ? `<svg viewBox="0 0 24 24" fill="#fff"><path d="M3 19l6.2-11 3.4 6 2.4-4L21 19z"/></svg>`
        : s.short;
      return `<a href="${s.url(encodeURIComponent(v))}" target="_blank" rel="noopener noreferrer">
        <span class="ic" style="background:${s.bg}">${inner}</span>${esc(v)}
      </a>`;
    });

  if (!items.length) return "";
  return `<div class="hc-blk"><p class="hc-blk-t">リンク</p>
    <div class="hc-sns">${items.join("")}</div></div>`;
}

// ---------------------------------------------
export function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
