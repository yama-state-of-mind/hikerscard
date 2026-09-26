// =============================================
// 共通ヘッダー
//
// ・下にスクロールすると隠れ、上に戻すと現れる
// ・右上のアイコンでメニュー（ドロワー）が開く
//
// 使い方：
//   import { mountHeader } from "./header.js";
//   mountHeader();            // body の先頭に差し込む
//   .wrap に has-hd クラスを付けると、高さぶん下がる
// =============================================

const ICON = {
  card: `<svg viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="18" rx="3"/><path d="M9 9h6M9 13h6"/></svg>`,
  deck: `<svg viewBox="0 0 24 24"><rect x="3" y="7" width="13" height="14" rx="2"/><path d="M8 4h11a2 2 0 0 1 2 2v13"/></svg>`,
  qr:   `<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM19 19h2v2h-2z"/></svg>`,
  mt:   `<svg viewBox="0 0 24 24"><path d="M3 20l6-14 4 8 3-5 5 11z"/></svg>`,
  star: `<svg viewBox="0 0 24 24"><path d="M12 3l2.6 5.6 6 .8-4.4 4.2 1.1 6-5.3-2.9L6.7 19.6l1.1-6L3.4 9.4l6-.8z"/></svg>`,
  redo: `<svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg>`,
  gear: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 13a7.5 7.5 0 0 0 0-2l2-1.5-2-3.4-2.4 1a7.5 7.5 0 0 0-1.7-1L14.9 3h-3.8l-.4 2.6a7.5 7.5 0 0 0-1.7 1l-2.4-1-2 3.4 2 1.5a7.5 7.5 0 0 0 0 2l-2 1.5 2 3.4 2.4-1a7.5 7.5 0 0 0 1.7 1l.4 2.6h3.8l.4-2.6a7.5 7.5 0 0 0 1.7-1l2.4 1 2-3.4z"/></svg>`,
  ban:  `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/></svg>`,
  out:  `<svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/></svg>`,
};

const MENU = [
  { href: "./card.html",       icon: "card", label: "マイカード" },
  { href: "./collection.html", icon: "deck", label: "コレクション" },
  { href: "./exchange.html",   icon: "qr",   label: "カードを交換する" },
  { sep: true },
  { href: "./mountains.html",  icon: "mt",   label: "登った山" },
  { href: "./picks.html",      icon: "star", label: "好きな山・登りたい山" },
  { href: "./quiz.html",       icon: "redo", label: "診断をやり直す" },
  { sep: true },
  { href: "./setup.html",      icon: "gear", label: "プロフィール編集", mut: true },
  { href: "./blocks.html",     icon: "ban",  label: "ブロック中のユーザー", mut: true },
  { act: "logout",             icon: "out",  label: "ログアウト", mut: true },
];

export function mountHeader(onLogout) {
  // すでにあるなら何もしない
  if (document.getElementById("hd")) return;

  const links = MENU.map((m) => {
    if (m.sep) return `<div class="sep"></div>`;
    const cls = m.mut ? ' class="mut"' : "";
    const href = m.act ? `href="#" data-act="${m.act}"` : `href="${m.href}"`;
    return `<a ${href}${cls}>${ICON[m.icon]}${m.label}</a>`;
  }).join("");

  const html = `
  <header class="hd" id="hd">
    <div class="hd-in">
      <button class="hd-logo" id="hd-logo">ハイカーズ<span>カード</span></button>
      <button class="hd-menu" id="hd-menu" aria-label="メニュー">
        <i></i><i></i><i></i>
      </button>
    </div>
  </header>
  <div class="drawer" id="drawer"><div class="drawer-in">${links}</div></div>`;

  document.body.insertAdjacentHTML("afterbegin", html);

  const hd = document.getElementById("hd");
  const btn = document.getElementById("hd-menu");
  const drawer = document.getElementById("drawer");

  // 下にスクロール → 隠す／上に戻す → 出す
  let lastY = 0;
  addEventListener("scroll", () => {
    const y = scrollY;
    if (y > lastY && y > 80) hd.classList.add("up");
    else hd.classList.remove("up");
    lastY = y;
  }, { passive: true });

  const toggle = () => {
    drawer.classList.toggle("on");
    btn.classList.toggle("on");
  };
  btn.onclick = toggle;

  // 背景を押したら閉じる
  drawer.onclick = (e) => {
    if (e.target === drawer) toggle();
  };

  document.getElementById("hd-logo").onclick = () => {
    location.href = "./card.html";
  };

  drawer.querySelectorAll("[data-act]").forEach((a) => {
    a.onclick = (e) => {
      e.preventDefault();
      if (a.dataset.act === "logout" && onLogout) onLogout();
    };
  });
}
