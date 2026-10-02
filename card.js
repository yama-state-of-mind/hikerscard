import { FLAG_SVG } from "./flags-data.js";
// =============================================
// カードの描画
//
// card.html / u.html / collection.html で共有する。
// データの取得元は違うが、描くものは同じ。
// =============================================

// ---------------------------------------------
// 背景のパターン
// ---------------------------------------------
// 背景の模様（幅300×高さ470で描く。patternSVG で拡大縮小して敷く）
// 色だけのカード（雪・苔・砂・空・墨）は模様なし
const STARS = [[28,54],[76,32],[122,78],[168,44],[214,92],[262,38],[286,70],[46,132],[104,158],[186,126],
               [248,164],[280,140],[22,214],[88,246],[152,206],[226,252],[270,228],[60,300],[200,290]];
const TOPO = `<g stroke="#7FA7BF" stroke-opacity=".28" stroke-width=".8"><line x1="0" y1="0" x2="0" y2="470"/><line x1="75" y1="0" x2="75" y2="470"/><line x1="150" y1="0" x2="150" y2="470"/><line x1="225" y1="0" x2="225" y2="470"/><line x1="300" y1="0" x2="300" y2="470"/><line x1="0" y1="0" x2="300" y2="0"/><line x1="0" y1="75" x2="300" y2="75"/><line x1="0" y1="150" x2="300" y2="150"/><line x1="0" y1="225" x2="300" y2="225"/><line x1="0" y1="300" x2="300" y2="300"/><line x1="0" y1="375" x2="300" y2="375"/><line x1="0" y1="450" x2="300" y2="450"/></g><path d="M234.4 330.0 L232.9 334.3 L230.0 337.9 L226.5 341.0 L221.9 343.0 L216.6 343.1 L212.0 342.8 L207.1 343.8 L200.8 344.7 L195.1 342.9 L192.9 338.4 L193.8 333.7 L194.4 330.0 L194.3 326.4 L195.3 322.7 L198.2 319.5 L201.9 316.7 L206.3 313.7 L212.0 312.4 L217.5 314.4 L220.8 318.4 L223.3 321.4 L227.5 323.2 L232.4 325.8 Z" fill="none" stroke="#A2763F" stroke-opacity="0.32" stroke-width="0.8" stroke-linejoin="round"/><path d="M256.0 330.0 L252.1 338.2 L247.2 345.4 L240.0 351.3 L230.2 354.0 L220.8 354.9 L212.0 357.8 L200.8 361.9 L188.0 361.5 L180.0 354.3 L178.6 344.7 L178.3 336.9 L176.0 330.0 L174.8 322.4 L177.9 315.0 L183.5 308.3 L190.2 301.4 L200.1 296.2 L212.0 297.0 L221.5 303.2 L228.0 308.9 L236.6 311.3 L247.9 314.3 L255.6 321.1 Z" fill="none" stroke="#A2763F" stroke-opacity="0.32" stroke-width="0.8" stroke-linejoin="round"/><path d="M274.6 330.0 L270.3 341.9 L263.4 352.6 L251.5 360.0 L237.9 364.0 L225.9 369.5 L212.0 378.1 L193.5 382.4 L177.3 375.6 L170.0 362.0 L166.8 349.8 L160.8 340.4 L154.6 330.0 L154.4 318.3 L159.5 307.0 L166.6 295.5 L177.9 285.0 L194.9 281.4 L212.0 286.9 L224.6 294.3 L237.3 296.6 L254.8 297.5 L270.7 304.2 L276.8 316.8 Z" fill="none" stroke="#A2763F" stroke-opacity="0.32" stroke-width="0.8" stroke-linejoin="round"/><path d="M291.8 330.0 L288.0 345.5 L277.4 358.7 L261.6 367.7 L247.5 376.7 L233.2 390.2 L212.0 401.5 L187.7 399.0 L171.2 383.7 L162.5 367.6 L152.1 356.3 L138.9 344.9 L131.8 330.0 L133.5 314.0 L138.8 297.9 L148.5 281.7 L167.5 271.4 L191.8 272.8 L212.0 279.9 L229.1 281.6 L251.2 278.4 L275.7 281.6 L290.7 295.5 L293.5 313.4 Z" fill="none" stroke="#A2763F" stroke-opacity="0.55" stroke-width="1.4" stroke-linejoin="round"/><path d="M309.4 330.0 L303.9 348.7 L289.5 364.0 L274.6 377.5 L261.9 395.6 L241.9 414.8 L212.0 420.4 L184.8 407.2 L167.7 388.3 L152.0 375.6 L131.5 365.3 L114.8 349.8 L109.4 330.0 L110.7 309.4 L116.3 288.0 L133.1 270.1 L161.9 264.0 L190.1 268.0 L212.0 268.4 L236.5 260.4 L267.7 256.7 L293.4 268.1 L304.7 289.3 L308.0 310.4 Z" fill="none" stroke="#A2763F" stroke-opacity="0.32" stroke-width="0.8" stroke-linejoin="round"/><path d="M326.5 330.0 L317.6 351.5 L304.3 370.5 L294.6 392.8 L279.8 419.2 L249.1 435.3 L212.0 428.8 L183.9 409.7 L161.8 396.0 L134.9 388.6 L107.6 375.8 L91.9 354.5 L86.5 330.0 L85.8 304.3 L96.4 279.3 L124.9 263.8 L159.8 261.3 L187.0 259.1 L212.0 246.4 L246.0 233.5 L281.8 238.1 L304.6 259.6 L315.5 284.6 L323.7 307.3 Z" fill="none" stroke="#A2763F" stroke-opacity="0.32" stroke-width="0.8" stroke-linejoin="round"/><path d="M341.5 330.0 L333.2 354.7 L327.9 380.8 L321.2 413.0 L295.6 440.0 L252.3 444.3 L212.0 428.9 L181.9 415.3 L150.0 411.6 L113.3 405.0 L85.1 385.7 L70.1 358.9 L61.5 330.0 L62.7 299.6 L85.4 274.4 L123.2 262.5 L155.6 255.7 L179.8 238.8 L212.0 216.1 L254.4 209.7 L290.0 227.3 L311.3 254.5 L327.6 279.3 L340.6 303.8 Z" fill="none" stroke="#A2763F" stroke-opacity="0.32" stroke-width="0.8" stroke-linejoin="round"/><path d="M357.2 330.0 L357.9 359.7 L361.0 395.4 L346.1 431.9 L303.0 449.7 L251.7 442.6 L212.0 430.9 L176.3 431.3 L133.4 433.5 L92.6 420.7 L65.5 394.3 L47.4 363.5 L37.2 330.0 L48.8 296.8 L83.8 273.8 L119.8 260.0 L143.0 239.1 L168.9 207.7 L212.0 187.7 L259.1 196.4 L293.4 222.9 L318.9 248.7 L342.6 272.7 L356.5 300.6 Z" fill="none" stroke="#A2763F" stroke-opacity="0.55" stroke-width="1.4" stroke-linejoin="round"/><path d="M380.9 330.0 L394.4 367.1 L394.5 410.1 L359.1 441.8 L301.2 447.4 L251.0 440.7 L212.0 445.1 L167.1 457.4 L116.7 455.5 L76.0 433.4 L46.7 402.5 L24.4 368.2 L20.9 330.0 L46.7 296.3 L82.7 273.3 L104.6 248.3 L121.2 210.5 L157.8 176.4 L212.0 171.5 L260.3 193.1 L296.7 218.5 L330.5 239.9 L358.5 265.7 L372.1 297.4 Z" fill="none" stroke="#A2763F" stroke-opacity="0.32" stroke-width="0.8" stroke-linejoin="round"/><path d="M59.6 120.0 L58.3 123.7 L55.7 126.9 L52.7 129.6 L48.6 131.4 L44.0 131.5 L40.0 131.2 L35.8 132.0 L30.2 132.9 L25.2 131.3 L23.3 127.3 L24.0 123.3 L24.6 120.0 L24.5 116.8 L25.4 113.6 L27.9 110.8 L31.1 108.3 L35.0 105.8 L40.0 104.6 L44.8 106.3 L47.7 109.8 L49.9 112.5 L53.6 114.0 L57.8 116.4 Z" fill="none" stroke="#A2763F" stroke-opacity="0.32" stroke-width="0.8" stroke-linejoin="round"/><path d="M78.5 120.0 L75.1 127.1 L70.8 133.5 L64.5 138.6 L56.0 141.0 L47.7 141.8 L40.0 144.3 L30.2 147.9 L19.0 147.6 L12.0 141.3 L10.7 132.8 L10.6 126.0 L8.5 120.0 L7.4 113.4 L10.2 106.9 L15.0 101.0 L21.0 94.9 L29.6 90.4 L40.0 91.1 L48.3 96.5 L54.0 101.5 L61.5 103.6 L71.4 106.2 L78.2 112.2 Z" fill="none" stroke="#A2763F" stroke-opacity="0.32" stroke-width="0.8" stroke-linejoin="round"/><path d="M94.8 120.0 L91.0 130.4 L85.0 139.7 L74.5 146.2 L62.6 149.8 L52.2 154.6 L40.0 162.1 L23.8 165.9 L9.7 159.9 L3.2 148.0 L0.5 137.3 L-4.8 129.1 L-10.2 120.0 L-10.4 109.7 L-5.9 99.8 L0.3 89.8 L10.1 80.7 L25.0 77.5 L40.0 82.3 L51.0 88.8 L62.2 90.8 L77.5 91.5 L91.4 97.4 L96.7 108.5 Z" fill="none" stroke="#A2763F" stroke-opacity="0.32" stroke-width="0.8" stroke-linejoin="round"/><path d="M109.8 120.0 L106.5 133.5 L97.2 145.1 L83.4 153.0 L71.1 160.9 L58.6 172.7 L40.0 182.5 L18.7 180.4 L4.3 167.0 L-3.3 152.9 L-12.4 143.0 L-23.9 133.0 L-30.2 120.0 L-28.7 106.0 L-24.0 91.9 L-15.6 77.8 L1.1 68.8 L22.3 69.9 L40.0 76.1 L54.9 77.6 L74.3 74.9 L95.7 77.7 L108.8 89.8 L111.3 105.5 Z" fill="none" stroke="#A2763F" stroke-opacity="0.55" stroke-width="1.4" stroke-linejoin="round"/><path d="M212 318 L220 331 L204 331 Z" fill="none" stroke="#7A4F22" stroke-width="1.4"/><text x="226" y="333" font-family="Inter, sans-serif" font-size="9" font-weight="600" fill="#7A4F22">2956</text>`;

export const BG = {
  snow: () => "", moss: () => "", sand: () => "", sky: () => "", sumi: () => "",

  ridge: () => `
    <path d="M-10 470 L40 360 L92 410 L160 300 L220 372 L310 470 Z" fill="#1E3A31" fill-opacity=".09"/>
    <path d="M-10 470 L30 400 L84 440 L146 372 L208 428 L268 380 L310 470 Z" fill="#46708F" fill-opacity=".10"/>`,

  morgen: () => `
    <rect x="-200" y="-1200" width="700" height="1400" fill="#F9E3D3"/>
    <path d="M-10 470 L70 300 L150 170 L214 268 L250 236 L310 330 L310 470 Z" fill="#F0C7B6"/>
    <path d="M150 170 L214 268 L196 290 L170 250 L150 300 Z" fill="#E1A99C"/>
    <path d="M150 170 L162 190 L150 204 L140 192 Z" fill="#FFF6EF"/>
    <path d="M-10 470 L-10 410 C 60 392, 120 418, 190 400 S 280 392, 310 404 L310 470 Z" fill="#C79C97"/>`,

  unkai: () => `
    <path d="M40 330 L118 214 L164 262 L206 232 L276 330 Z" fill="#4E6472" fill-opacity=".38"/>
    <path d="M118 214 L128 230 L112 238 Z" fill="#fff" fill-opacity=".9"/>
    <path d="M-20 318 C 30 296, 70 316, 110 304 S 190 288, 230 306 S 290 296, 330 310 L330 470 L-20 470 Z" fill="#fff" fill-opacity=".92"/>
    <path d="M-20 360 C 40 342, 90 362, 140 350 S 230 336, 330 354 L330 470 L-20 470 Z" fill="#F4F8FA"/>
    <path d="M-20 404 C 50 390, 110 408, 170 398 S 260 386, 330 400 L330 470 L-20 470 Z" fill="#fff"/>`,

  topo: () => TOPO,

  night: () => STARS.map(([x, y], i) =>
      `<circle cx="${x}" cy="${y}" r="${i % 4 === 0 ? 1.8 : 1.1}" fill="rgba(255,255,255,${i % 3 === 0 ? .55 : .3})"/>`).join("") + `
    <circle cx="246" cy="62" r="14" fill="#F2EAD3" fill-opacity=".9"/><circle cx="252" cy="57" r="13" fill="#1E2A33"/>
    <path d="M-10 470 L48 352 L102 402 L168 310 L226 372 L310 470 Z" fill="#000" fill-opacity=".26"/>
    <path d="M-10 470 L30 420 L86 448 L150 400 L214 446 L262 414 L310 470 Z" fill="#000" fill-opacity=".22"/>`,
};

// =============================================
// 背景を選ぶ部品（プロフィール更新・カードづくりで共通）
//
//   selected … いま選んでいる背景
//   count    … 交換した枚数（鍵の判定に使う）
//   opts.plainOnly … いつでも使える5種だけ出す（カードづくりの最初）
//   opts.keep      … 枚数が足りなくても選べる背景（すでに使っている背景はそのまま選べる）
//   opts.staff     … 管理人・小屋番。制限なくすべて選べる（DB側の is_staff と同じ考え方）
// =============================================
const LOCK_SVG = `<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>`;

function bgChip(t, selected, locked) {
  return `
    <button type="button" class="bg-chip${t.id === selected ? " on" : ""}${locked ? " locked" : ""}"
            data-id="${t.id}" data-need="${t.need}" aria-pressed="${t.id === selected}"
            aria-label="${t.name}${locked ? `（交換${t.need}枚で解放）` : ""}">
      <div class="sw t-${t.id}">
        <svg viewBox="0 0 300 470" preserveAspectRatio="xMidYMid slice">${BG[t.id]()}</svg>
        ${locked ? `<span class="bg-lock">${LOCK_SVG}<em>${t.need}枚</em></span>` : ""}
      </div>
      <span>${t.name}</span>
    </button>`;
}

export function renderBgPicker(selected, count = 0, opts = {}) {
  const plain = THEMES.filter((t) => t.need === 0);
  const plainHtml = `
    <p class="bgp-h">いつでも使える</p>
    <div class="bgp-grid">${plain.map((t) => bgChip(t, selected, false)).join("")}</div>`;
  if (opts.plainOnly) {
    return `<div class="bgp">${plainHtml}
      <p class="bgp-note">カードを交換すると、山なみ・朝焼け・雲海・地形図・夜空も使えるようになります。</p></div>`;
  }

  // 管理人・小屋番は、すべての背景を使える
  if (opts.staff) {
    const all = THEMES.filter((t) => t.need > 0);
    return `
    <div class="bgp">
      ${plainHtml}
      <p class="bgp-h lock">${LOCK_SVG}カードを交換すると使える</p>
      <p class="bgp-count">管理人・小屋番は、すべての背景を使えます。</p>
      <div class="bgp-grid">${all.map((t) => bgChip(t, selected, false)).join("")}</div>
    </div>`;
  }

  const next = nextUnlock(count);
  const max = UNLOCK_STEPS[UNLOCK_STEPS.length - 1];
  // 交換で使える5種は、1列に並べる（鍵には必要な枚数を表示）
  const rare = THEMES.filter((t) => t.need > 0);
  const steps = `<div class="bgp-grid">${rare
    .map((t) => bgChip(t, selected, count < t.need && t.id !== opts.keep)).join("")}</div>`;

  return `
    <div class="bgp">
      ${plainHtml}
      <p class="bgp-h lock">${LOCK_SVG}カードを交換すると使える</p>
      <div class="bgp-prog">
        <div class="bgp-bar"><i style="width:${Math.min(100, (count / max) * 100)}%"></i>
          ${UNLOCK_STEPS.map((n) => `<b class="${count >= n ? "on" : ""}" style="left:${(n / max) * 100}%">${n}</b>`).join("")}
        </div>
        <p class="bgp-count">交換 <b>${count}</b>枚${next
          ? `・あと<b>${next.need - count}</b>枚で ${next.themes.map((t) => t.name).join("・")}`
          : "・すべて解放しました！"}</p>
      </div>
      ${steps}
    </div>`;
}

// ---------------------------------------------
// 「新しい背景が使えるようになりました」のお知らせ
//
// どの段階（1・3・5枚）まで知らせたかをブラウザに覚えておき、
// 新しい段階に届いたときに一度だけ知らせる。
// ---------------------------------------------
const SEEN_KEY = "hcBgUnlockSeen";

export function unlockNews(count) {
  const reached = [...UNLOCK_STEPS].reverse().find((n) => n <= (count ?? 0)) ?? 0;
  let seen = 0;
  try { seen = Number(localStorage.getItem(SEEN_KEY)) || 0; } catch { /* 使えない環境 */ }
  if (reached <= seen) return null;
  return { reached, themes: THEMES.filter((t) => t.need > seen && t.need <= reached) };
}
export function markUnlockSeen(count) {
  const reached = [...UNLOCK_STEPS].reverse().find((n) => n <= (count ?? 0)) ?? 0;
  try { localStorage.setItem(SEEN_KEY, String(reached)); } catch { /* 使えない環境 */ }
}

// お知らせの中に並べる、小さな背景の見本
export function bgThumbs(themes) {
  return `<span class="bg-thumbs">${themes.map((t) => `
    <span class="bg-thumb"><span class="sw t-${t.id}">
      <svg viewBox="0 0 300 470" preserveAspectRatio="xMidYMid slice">${BG[t.id]()}</svg></span>
      <em>${t.name}</em></span>`).join("")}</span>`;
}

// 廃止した背景（保存されていた場合の読み替え）
const OLD_BG = { contour: "snow", mist: "sand", forest: "moss" };
export const normalizeBg = (bg) => BG[bg] ? bg : (OLD_BG[bg] ?? DEFAULT_BG);

// カードの背景。need = 使えるようになるのに必要な交換枚数
//   0 枚：色だけのシンプルなカード（いつでも使える）
//   1 枚：山なみ ／ 3 枚：朝焼け・雲海 ／ 5 枚：地形図・夜空
// ※ DB側（protect_profile_fields）にも同じ表があるので、変えるときは両方そろえる
export const THEMES = [
  { id: "snow",   name: "雪",     need: 0 },
  { id: "moss",   name: "苔",     need: 0 },
  { id: "sand",   name: "砂",     need: 0 },
  { id: "sky",    name: "空",     need: 0 },
  { id: "sumi",   name: "墨",     need: 0 },
  { id: "ridge",  name: "山なみ", need: 1 },
  { id: "morgen", name: "朝焼け", need: 3 },
  { id: "unkai",  name: "雲海",   need: 3 },
  { id: "topo",   name: "地形図", need: 5 },
  { id: "night",  name: "夜空",   need: 5 },
];
export const THEME_BY_ID = Object.fromEntries(THEMES.map((t) => [t.id, t]));
export const UNLOCK_STEPS = [1, 3, 5];                       // 解放の段階（交換枚数）
export const DARK_THEMES = new Set(["moss", "sumi", "night"]); // 文字を白にするテーマ
export const DEFAULT_BG = "snow";

// その背景が、交換枚数 count で使えるか
export const bgUnlocked = (id, count) => (THEME_BY_ID[id]?.need ?? 0) <= (count ?? 0);
// 次に解放される段階（無ければ null）
export function nextUnlock(count) {
  const n = UNLOCK_STEPS.find((x) => x > (count ?? 0));
  return n ? { need: n, themes: THEMES.filter((t) => t.need === n) } : null;
}

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
  // YAMAP・ヤマレコは、ロゴの利用条件が公開されていないため自作のアイコン。
  // Instagram・X は、アカウントへのリンクにロゴ（グリフ）を使うことを
  // 各社のブランドガイドラインが認めているので、公式の形をそのまま使う
  // （形・色を変えない、他の図形の中に入れない、がルール）。
  yamap:     { label: "YAMAP",     bg: "#D93A2B", icon: "mt", url: (v) => `https://yamap.com/users/${v}` },
  yamareco:  { label: "ヤマレコ",   bg: "#1F6FB2", icon: "mt", url: (v) => `https://www.yamareco.com/modules/yamareco/userinfo-${v}.html` },
  instagram: { label: "Instagram", icon: "ig", url: (v) => `https://instagram.com/${v}` },
  x:         { label: "X",         icon: "x",  url: (v) => `https://x.com/${v}` },
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
// Instagram の公式グリフ（角丸の四角・円・右上の点）。公式のグラデーションで塗る
const IG_GLYPH = `<svg viewBox="0 0 24 24" aria-hidden="true">
  <defs><radialGradient id="hc-ig-grad" cx="30%" cy="107%" r="150%">
    <stop offset="0" stop-color="#FDF497"/><stop offset=".05" stop-color="#FDF497"/>
    <stop offset=".45" stop-color="#FD5949"/><stop offset=".6" stop-color="#D6249F"/><stop offset=".9" stop-color="#285AEB"/>
  </radialGradient></defs>
  <rect x="2.2" y="2.2" width="19.6" height="19.6" rx="5.6" fill="none" stroke="url(#hc-ig-grad)" stroke-width="2.2"/>
  <circle cx="12" cy="12" r="4.6" fill="none" stroke="url(#hc-ig-grad)" stroke-width="2.2"/>
  <circle cx="17.6" cy="6.4" r="1.4" fill="url(#hc-ig-grad)"/></svg>`;
// X の公式ロゴ
const X_GLYPH = `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>`;

export function snsIcon(key) {
  const s = SNS[key];
  if (!s) return "";
  if (s.icon === "ig") return `<span class="sns-ic brand ig">${IG_GLYPH}</span>`;
  if (s.icon === "x")  return `<span class="sns-ic brand x">${X_GLYPH}</span>`;
  return `<span class="sns-ic" style="background:${s.bg}">${MT_GLYPH}</span>`;
}

// ---------------------------------------------
// テーマをページ全体に効かせる
//
// 模様（等高線など）はヒーローカードだけに敷く（Linktreeのパネルと同じ考え方）。
// ページはカードと同系色の無地にして、カードを引き立てる。
// body にクラスを付けることで、CSS変数が全体に行き渡る。
// ---------------------------------------------
export function applyTheme(bg) {
  const id = normalizeBg(bg);
  document.body.className = document.body.className
    .replace(/\bt-\w+\b/g, "").replace(/\btheme-dark\b/g, "").trim() + " t-" + id;
  // 文字を白にするテーマ（苔・墨・夜空）は、まとめて theme-dark で見た目を切り替える
  document.body.classList.toggle("theme-dark", DARK_THEMES.has(id));

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
// 景色の背景（山なみ・朝焼け・雲海）は、カードの幅に合わせて下にそろえる（縦長のカードでも山が大きくなりすぎない）。
// 全面の模様（地形図・夜空）は、カード全体を覆うように敷く
const BG_FIT = { ridge: "xMidYMax meet", morgen: "xMidYMax meet", unkai: "xMidYMax meet" };
export function patternSVG(id, cls = "hero-bg") {
  const key = normalizeBg(id);
  return `<svg class="${cls}" viewBox="0 0 300 470" preserveAspectRatio="${BG_FIT[key] ?? "xMidYMid slice"}">${BG[key]()}</svg>`;
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

// 登ってよかった山を順位順にそろえる（pos が無い古いデータは後ろへ）
function sortedFavs(list) {
  return [...(list ?? [])].sort((a, b) => (a.pos ?? 99) - (b.pos ?? 99));
}

// カード番号の表示。「No.0003」の形にする。
// 番号は「表示名の入力」と「診断」がそろった時点で発行されるので、まだ無い人もいる（そのときは空）
export function cardNo(n, empty = "") {
  return n === null || n === undefined ? empty : `No.${String(n).padStart(4, "0")}`;
}

// ---------------------------------------------
// 国旗と、山の名前の表示
//
// 海外の山は、国名の代わりに国旗を山名の後ろに付ける。
// 国旗の画像は flags-data.js に埋め込んである（読み込みを広告ブロック拡張などに止められないように）。
// 国名は読み上げ・マウスを乗せたときの説明に使う。
// 絵文字の国旗は Windows で表示されないため使わない。
// ---------------------------------------------
// ホーム（拠点）に選べる都道府県
export const PREFECTURES = ["北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県", "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県", "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県", "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県", "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"];
const PIN = `<svg class="ic-pin" viewBox="0 0 24 24"><path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/></svg>`;

export const COUNTRIES = {
  tw: "台湾", my: "マレーシア", kr: "韓国", cn: "中国", id: "インドネシア", np: "ネパール",
  fr: "フランス", it: "イタリア", ch: "スイス", tz: "タンザニア", us: "アメリカ",
  ar: "アルゼンチン", pe: "ペルー", cl: "チリ", au: "オーストラリア", nz: "ニュージーランド",
};
export function flags(cc) {
  if (!cc?.length) return "";
  return `<span class="flags">${cc.slice(0, 3).filter((c) => FLAG_SVG[c]).map((c) =>
    `<img class="flag" src="${FLAG_SVG[c]}" alt="${esc(COUNTRIES[c] ?? c)}"
          title="${esc(COUNTRIES[c] ?? c)}" width="16" height="12">`).join("")}</span>`;
}
// 山の名前（表示名があればそちら）＋国旗（名前の後ろ）。どの画面でもこれで出す
export function mtLabel(m) {
  return `${esc(m.label ?? m.display_name ?? m.name)}${flags(m.cc ?? m.countries)}`;
}
// 名山以外の場所の分け方（踏破状況の行・件数と同じ分け方）
export function placeCat(m) {
  if (m.rank) return String(m.rank);
  if ((m.cc ?? m.countries)?.length) return "overseas";
  if (m.kind === "ridge") return "ridge";
  if (m.kind === "scenic" || m.kind === "course") return "scenic";
  return "other";
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
// 登ってよかった山・登ってみたい山は省略せず全件載せる（各5座まで）。
// =============================================
export function renderHeroCard(d, opts = {}) {
  const diagnosed = !!d.type_code;
  const bg = normalizeBg(d.card_bg);
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
      </div>` : "") + (Number(ranks.overseas) > 0 ? `
      <div class="mini-ring">
        <div class="mr mr-other"><div class="mn"><b>${Number(ranks.overseas)}</b><span>か所</span></div></div>
        <p>海外</p><em>&nbsp;</em>
      </div>` : "");

  const favs = sortedFavs(d.favorites);
  const wish = d.wishlist ?? [];

  const blk = (go, inner) => linked
    ? `<button class="hero-blk" data-go="${go}">${inner}</button>`
    : `<div class="hero-blk">${inner}</div>`;

  // 自分のカード（opts.own）では、未登録の項目も「（未登録）」として全部出す。
  // 押すとその項目の登録画面へ行けるので、登録のきっかけになる
  const own = !!opts.own;
  const emptyBlk = (href, label) => `
    <a class="hero-blk hero-empty" href="${href}">
      <p class="hero-lbl">${label}</p>
      <span class="hero-none">（未登録）<em>登録する</em></span>
    </a>`;

  return `
  <div class="hero t-${bg}${DARK_THEMES.has(bg) ? " dark" : ""}">
    ${patternSVG(bg)}
    ${diagnosed ? `
      <svg class="hero-paw" viewBox="0 0 320 540" preserveAspectRatio="xMidYMid slice">
        ${pawTrail(d.type_code)}
      </svg>` : ""}

    <div class="hero-in">
      <div class="hero-top">
        ${opts.flipBtn ? flipToggle(true) : "<span></span>"}
        <span class="hero-no">${cardNo(d.card_no)}</span>
      </div>

      <div class="hero-me">
        <div class="hero-av">${diagnosed ? (opts.charSVG ?? "") : SILHOUETTE}</div>
        <p class="hero-name">${esc(d.display_name)}</p>
        ${diagnosed ? `
          <div class="hero-trow">
            <span class="hero-code">${esc(d.type_code)}</span>
            <span class="hero-tn">${esc(opts.animal ?? "")}・${esc(opts.typeName ?? "")}</span>
          </div>` : own
            ? `<a class="hero-undiag hero-none" href="/quiz.html">（未診断）<em>診断する</em></a>`
            : `<p class="hero-undiag">未診断</p>`}
        ${d.home ? `<p class="hero-home">${PIN}${esc(d.home)}</p>`
          : own ? `<a class="hero-home hero-none" href="/setup.html">${PIN}ホーム（未登録）<em>登録する</em></a>` : ""}
        ${d.comment ? `<p class="hero-cmt">${escMultiline(d.comment)}</p>`
          : own ? `<a class="hero-cmt hero-none" href="/setup.html">ひとこと（未登録）<em>登録する</em></a>` : ""}
      </div>

      ${rings ? blk("section-meizan", `
        <p class="hero-lbl">踏破状況</p>
        <div class="mini-rings">${rings}</div>`) : ""}

      ${favs.length ? blk("section-mountains", `
        <p class="hero-lbl">${STAR}登ってよかった山</p>
        <div class="mini-tags">
          ${favs.map((m) => `<span class="mini-tag fav">${crown(m.pos)}${mtLabel(m)}</span>`).join("")}
        </div>`) : own ? emptyBlk("/mountains.html#fav", `${STAR}登ってよかった山`) : ""}

      ${wish.length ? blk("section-mountains", `
        <p class="hero-lbl">${FLAG}登ってみたい山</p>
        <div class="mini-tags">
          ${wish.map((m) => `<span class="mini-tag wish">${mtLabel(m)}</span>`).join("")}
        </div>`) : own ? emptyBlk("/mountains.html#wish", `${FLAG}登ってみたい山`) : ""}
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
    <p class="ob-t"><b>${name}さんのカード</b><span>${cardNo(d.card_no)}</span></p>
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
// 並び：登山タイプ診断 → 踏破状況 → 山リスト（登ってみたい山・登ってよかった山） → SNS
// 枠で囲わず、横線で区切るだけにしてヒーローカードを引き立てる
// =============================================
export function renderDetails(d, opts = {}) {
  return [
    diagnosisSection(d, opts),
    meizanSection(d),
    mountainsSection(d, opts),
    snsSection(d, opts),
  ].filter(Boolean).join("");
}

// ---------- 山リスト ----------
function mountainsSection(d, opts) {
  const fav = sortedFavs(d.favorites);
  const wish = d.wishlist ?? [];
  if (!fav.length && !wish.length && !opts.own) return "";

  // 自分のカードでは、空のほうも「（未登録）」として見出しごと出す
  const part = (list, title, cls, icon, ov, hash) => list.length
    ? `<div class="d-card">
         <p class="d-sub first">${title}</p>
         <div class="d-tags">${tags(list, cls, icon, ov)}</div>
       </div>`
    : opts.own
      ? `<div class="d-card">
           <p class="d-sub first">${title}</p>
           <p class="det-empty">（未登録） <a href="/mountains.html#${hash}">登録する</a></p>
         </div>`
      : "";

  return `
  <section class="det" id="section-mountains">
    <div class="det-h"><h2>山リスト</h2></div>
    ${part(wish, "登ってみたい山", "wish", FLAG, opts.overlaps?.wishlist, "wish")}
    ${part(fav, "登ってよかった山", "fav", STAR, opts.overlaps?.favorites, "fav")}
  </section>`;
}

// overlaps: { 山名: [{ name, public_id }] }
function tags(list, cls, icon, overlaps) {
  const verb = cls === "fav" ? "も良かった山に選んでいます" : "も登ってみたい山にしています";
  return list.map((m) => {
    const lead = cls === "fav" ? crown(m.pos) : icon;
    const who = overlaps?.[m.name];
    if (!who?.length) return `<span class="d-tag ${cls}">${lead}${mtLabel(m)}</span>`;
    const links = who.slice(0, 4)
      .map((p) => `<a href="/u/${encodeURIComponent(p.public_id)}">${esc(p.name)}さん</a>`)
      .join("、");
    const rest = who.length > 4 ? ` ほか${who.length - 4}人` : "";
    return `<span class="d-tag ${cls} has-ov" tabindex="0">
      ${lead}${mtLabel(m)}<span class="ov-dot">${who.length}</span>
      <template class="ov-src">${links}${rest}${verb}</template>
    </span>`;
  }).join("");
}

// ---------- 踏破状況 ----------
// 名山以外の行（踏破状況）。scenic は山頂の踏破には数えない
const EXTRA_ROWS = [
  { key: "other",    title: "その他の山", sub: "名山リスト外の山",     unit: "座" },
  { key: "ridge",    title: "岩稜・難所", sub: "キレット・鎖場など",   unit: "か所" },
  { key: "overseas", title: "海外",       sub: "海外の山・トレッキング", unit: "か所" },
  { key: "scenic",   title: "景勝地・コース", sub: "山頂の踏破には数えません", unit: "か所" },
];

function meizanSection(d) {
  const ranks = d.ranks ?? {};
  const list = d.climbed ?? [];
  const shown = RANKS.filter((r) => ranks[r.key] !== undefined && ranks[r.key] !== null);
  // 名山以外は「その他」の公開設定にまとめて従う（ranks.other が無ければ出さない）
  const showExtra = ranks.other !== undefined && ranks.other !== null;
  const extras = showExtra
    ? EXTRA_ROWS.map((r) => ({ ...r, items: list.filter((m) => placeCat(m) === r.key) })).filter((r) => r.items.length)
    : [];
  if (!shown.length && !extras.length) return "";

  const total = shown.reduce((n, r) => n + Number(ranks[r.key]), 0);
  const caret = `<svg class="mz-car" viewBox="0 0 24 24" fill="none"
      stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>`;
  // 登ってよかった山のベスト3には、山名の左に王冠
  const favPos = new Map(sortedFavs(d.favorites).map((m) => [m.name, m.pos]));
  const tagList = (arr) => `
      <div class="mz-in"><div class="d-tags">
        ${arr.map((m) => `<span class="d-tag">${crown(favPos.get(m.name))}${mtLabel(m)}</span>`).join("")}
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

  const extraBlocks = extras.map((r, k) => `
      <button class="mz-row mz-other${k === 0 && !shown.length ? " solo" : ""}${k > 0 ? " mz-more" : ""}" data-mz="${r.key}">
        <div class="mz-r mz-r-other"><div class="mn"><b>${r.items.length}</b><span>${r.unit}</span></div></div>
        <p class="mz-t">${r.title}<em>${r.sub}</em></p>
        ${caret}
      </button>
      <div class="mz-list" id="mzl-${r.key}">${tagList(r.items)}</div>`).join("");

  return `
  <section class="det" id="section-meizan">
    <div class="det-h"><h2>踏破状況</h2>${shown.length ? `<span class="det-n">${total} / ${shown.length * 100}</span>` : ""}</div>
    <div class="d-card">
      ${blocks}
      ${extraBlocks}
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
  if (!d.type_code) {
    if (!opts.own) return "";
    return `
    <section class="det" id="section-diagnosis">
      <div class="det-h"><h2>登山タイプ診断</h2></div>
      <p class="det-empty">（未診断） <a href="/quiz.html">診断する</a></p>
    </section>`;
  }

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
      ${rows ? `<div class="d-axbox">
        <p class="d-sub first">4軸のスコア</p>
        <div class="d-axrows">${rows}</div>
      </div>` : ""}
    </div>
  </section>`;
}

// ---------- SNS ----------
function snsSection(d, opts = {}) {
  const entries = Object.entries(d.sns ?? {})
    .filter(([k, v]) => SNS[k] && String(v ?? "").trim());
  if (!entries.length) {
    if (!opts.own) return "";
    return `
    <section class="det" id="section-sns">
      <div class="det-h"><h2>SNS</h2></div>
      <p class="det-empty">（未登録） <a href="/setup.html">登録する</a></p>
    </section>`;
  }

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
