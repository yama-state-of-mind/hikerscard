// =============================================
// カードの描画
//
// 自分のカード（card.html）と公開ページ（u.html）で共有する。
// データの取得元は違うが、描くものは同じなのでここにまとめる。
//
// 期待するデータの形：
// {
//   public_id, card_no, display_name, comment, type_code,
//   axes: { pe, sg, lf, ca },      // 1文字目側への寄り 0〜100。未診断なら null
//   hyakumeizan_done: 12,
//   climbed: [{ name, hyaku }]
// }
// =============================================

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
// 背景パターン（等高線）
// カードの奥行きを出すための薄い模様
// ---------------------------------------------
function bgContour() {
  let p = "";
  for (let i = 0; i < 11; i++) {
    const y = 26 + i * 46;
    p += `<path d="M-20 ${y} Q 80 ${y - 28} 160 ${y} T 340 ${y}"
             fill="none" stroke="rgba(30,58,49,.05)" stroke-width="1.6"/>`;
  }
  return `<svg class="card-bg" viewBox="0 0 320 520" preserveAspectRatio="none">${p}</svg>`;
}

// ---------------------------------------------
// カード全体
//
// opts:
//   charSVG   診断キャラのSVG文字列（未診断なら省略）
//   animal    キャラ名
//   typeName  タイプ名
// ---------------------------------------------
export function renderCard(d, opts = {}) {
  const diagnosed = !!d.type_code;

  return `
  <div class="hcard">
    ${bgContour()}
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
        <p class="hc-blk-t">COMMENT</p>
        <p class="hc-cmt"><span class="q">&ldquo;</span>${esc(d.comment)}<span class="q">&rdquo;</span></p>
      </div>` : ""}

      ${diagnosed && d.axes ? axesBlock(d.axes) : ""}

      ${hyakuBlock(d.hyakumeizan_done ?? 0)}

      ${(d.climbed?.length) ? climbedBlock(d.climbed) : ""}

    </div>
  </div>`;
}

// ---------------------------------------------
// 診断の4軸
// 両端型の軸なので、レーダーではなく横バーで表す
// ---------------------------------------------
const AXIS_DEFS = [
  { key: "pe", title: "目的",   a: "P", b: "E", aName: "ピークハント", bName: "エンジョイ" },
  { key: "sg", title: "仲間",   a: "S", b: "G", aName: "ソロ",         bName: "グループ" },
  { key: "lf", title: "計画",   a: "L", b: "F", aName: "計画的",       bName: "フィーリング" },
  { key: "ca", title: "リスク", a: "C", b: "A", aName: "慎重",         bName: "挑戦的" },
];

function axesBlock(axes) {
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
          <div class="hc-ax-bar ${aWins ? "a" : "b"}"
               style="width:${aWins ? aPct : bPct}%"></div>
        </div>
      </div>`;
  }).join("");

  if (!rows.trim()) return "";
  return `<div class="hc-blk"><p class="hc-blk-t">TYPE AXES</p>${rows}</div>`;
}

// ---------------------------------------------
// 百名山 踏破リング
// ---------------------------------------------
function hyakuBlock(done) {
  const r = 26;
  const C = 2 * Math.PI * r;
  return `
  <div class="hc-blk">
    <p class="hc-blk-t">HYAKUMEIZAN</p>
    <div class="hc-hy">
      <div class="hc-ring">
        <svg viewBox="0 0 62 62">
          <circle cx="31" cy="31" r="${r}" fill="none" stroke="rgba(30,58,49,.1)" stroke-width="6"/>
          <circle cx="31" cy="31" r="${r}" fill="none" stroke="#E0A33B" stroke-width="6"
                  stroke-linecap="round" stroke-dasharray="${C}"
                  stroke-dashoffset="${C * (1 - done / 100)}" transform="rotate(-90 31 31)"/>
        </svg>
        <div class="hc-ring-num"><b>${done}</b><span>/100</span></div>
      </div>
      <p class="hc-hy-txt">
        ${done === 0
          ? `<span class="muted">まだ登録がありません</span>`
          : `日本百名山<br><b>${done}座</b> 踏破 <span class="muted">／ 残り ${100 - done}座</span>`}
      </p>
    </div>
  </div>`;
}

// ---------------------------------------------
// 行った山
// ---------------------------------------------
function climbedBlock(list) {
  return `
  <div class="hc-blk">
    <p class="hc-blk-t">CLIMBED <span class="hc-n">${list.length}</span></p>
    <div class="hc-tags">
      ${list.map((m) => `
        <span class="hc-tag">
          ${m.hyaku ? `<span class="hc-b100">百</span>` : ""}${esc(m.name)}
        </span>`).join("")}
    </div>
  </div>`;
}

// ---------------------------------------------
// HTMLエスケープ
// ---------------------------------------------
export function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
