// =============================================
// 共通ヘッダー
//
// ・下にスクロールすると隠れ、上に戻すと現れる
// ・右上のアイコンでメニュー（ドロワー）が開く
// ・ログイン中は、メニューの左にシェアボタンを出す
//   （自分のカードのURLをポップアップでコピーできる）
//
// 使い方：
//   import { mountHeader } from "./header.js";
//   mountHeader();            // body の先頭に差し込む
//   .wrap に has-hd クラスを付けると、高さぶん下がる
// =============================================

import { LOGO_MARK, esc } from "./card.js";
import { getMyProfile } from "./supabase.js";
import "./reveal.js";   // スクロールして画面に入った要素をふわっと表示する

const ICON = {
  redo: `<svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg>`,
  home: `<svg viewBox="0 0 24 24"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>`,
  card: `<svg viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="18" rx="3"/><path d="M9 9h6M9 13h6"/></svg>`,
  deck: `<svg viewBox="0 0 24 24"><rect x="3" y="7" width="13" height="14" rx="2"/><path d="M8 4h11a2 2 0 0 1 2 2v13"/></svg>`,
  qr:   `<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM19 19h2v2h-2z"/></svg>`,
  mt:   `<svg viewBox="0 0 24 24"><path d="M3 20l6-14 4 8 3-5 5 11z"/></svg>`,
  star: `<svg viewBox="0 0 24 24"><path d="M12 3l2.6 5.6 6 .8-4.4 4.2 1.1 6-5.3-2.9L6.7 19.6l1.1-6L3.4 9.4l6-.8z"/></svg>`,
  redo: `<svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg>`,
  pen:  `<svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>`,
  ban:  `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/></svg>`,
  share:`<svg viewBox="0 0 24 24"><path d="M12 3v12"/><path d="M7.5 7.5L12 3l4.5 4.5"/><path d="M5 13v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"/></svg>`,
  out:  `<svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/></svg>`,
};

// メニューは3つのまとまりにする。
//   ①ふだん使うもの ②カードを整えるもの ③設定
// 山の登録などは「カードを編集する」の中にまとめた
// リンクは絶対パスにする。
// /u/x7k2p9 のような階層のあるパスから開いても正しく飛べるようにするため
const MENU_IN = [
  { href: "/mypage.html",     icon: "home", label: "マイページ" },
  { href: "/card.html",       icon: "card", label: "マイカード" },
  { href: "/collection.html", icon: "deck", label: "コレクション" },
  { href: "/exchange.html",   icon: "qr",   label: "カードを交換する" },
  { sep: true },
  { href: "/edit.html",       icon: "pen",  label: "カードを編集する" },
  { href: "/quiz.html",       icon: "redo", label: "診断をやり直す" },
  { sep: true },
  { href: "/blocks.html",     icon: "ban",  label: "ブロック中のユーザー", mut: true },
  { act: "logout",            icon: "out",  label: "ログアウト", mut: true },
];

// 未ログインの人に出すメニュー。
// 他人のカードを見ている場合などに使う
const MENU_OUT = [
  { href: "/login.html", icon: "card", label: "カードを作る" },
  { href: "/",           icon: "qr",   label: "登山タイプ診断について" },
];

export function mountHeader(onLogout, opts = {}) {
  // すでにあるなら何もしない
  if (document.getElementById("hd")) return;

  const loggedIn = opts.loggedIn !== false;
  const menu = loggedIn ? MENU_IN : MENU_OUT;

  const links = menu.map((m) => {
    if (m.sep) return `<div class="sep"></div>`;
    const cls = m.mut ? ' class="mut"' : "";
    const href = m.act ? `href="#" data-act="${m.act}"` : `href="${m.href}"`;
    return `<a ${href}${cls}>${ICON[m.icon]}${m.label}</a>`;
  }).join("");

  const html = `
  <header class="hd" id="hd">
    <div class="hd-in">
      <button class="hd-logo" id="hd-logo">
        <span class="hd-mark">${LOGO_MARK}</span>ハイカーズ<span class="hd-c">カード</span>
      </button>
      ${loggedIn ? `<button class="hd-share" id="hd-share" aria-label="自分のカードをシェア">${ICON.share}</button>` : ""}
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
    location.href = opts.loggedIn === false ? "/" : "/mypage.html";
  };

  const share = document.getElementById("hd-share");
  if (share) share.onclick = () => openShare(opts.shareId);

  drawer.querySelectorAll("[data-act]").forEach((a) => {
    a.onclick = (e) => {
      e.preventDefault();
      if (a.dataset.act === "logout" && onLogout) onLogout();
    };
  });

}

// =============================================
// シェアのポップアップ
//
// 自分のカードの公開URLを出してコピーできるようにする。
// 端末の共有機能（LINEなどに送る）が使える場合はボタンも出す。
// =============================================
let myPublicId = null;

async function openShare(knownId) {
  if (!myPublicId) myPublicId = knownId ?? (await getMyProfile())?.public_id ?? null;
  if (!myPublicId) return;

  const url = `${location.origin}/u/${myPublicId}`;
  const canNative = typeof navigator.share === "function";

  const wrap = document.createElement("div");
  wrap.className = "share-pop";
  wrap.innerHTML = `
    <div class="share-in" role="dialog" aria-modal="true" aria-label="カードをシェア">
      <div class="share-h">
        <p>カードをシェア</p>
        <button class="share-x" aria-label="閉じる">&times;</button>
      </div>
      <p class="share-d">このURLを送ると、あなたのカードを見てもらえます。<br>
        交換（コレクションへの追加）は、会ったときのQRで行います。</p>
      <div class="share-url">
        <input type="text" readonly value="${esc(url)}" aria-label="カードのURL">
        <button data-act="copy">コピー</button>
      </div>
      ${canNative ? `<button class="btn ghost" data-act="native">ほかのアプリで送る</button>` : ""}
      <div class="msg" data-msg></div>
    </div>`;
  document.body.appendChild(wrap);
  document.body.style.overflow = "hidden";

  const close = () => {
    wrap.remove();
    document.body.style.overflow = "";
    removeEventListener("keydown", onKey);
  };
  const onKey = (e) => { if (e.key === "Escape") close(); };
  addEventListener("keydown", onKey);

  const input = wrap.querySelector("input");
  const msg = wrap.querySelector("[data-msg]");
  const say = (kind, text) => { msg.className = "msg " + kind; msg.textContent = text; };

  wrap.addEventListener("click", async (e) => {
    if (e.target === wrap || e.target.closest(".share-x")) return close();

    const b = e.target.closest("[data-act]");
    if (!b) return;

    if (b.dataset.act === "copy") {
      try {
        await navigator.clipboard.writeText(url);
        say("success", "URLをコピーしました。");
      } catch {
        // クリップボードが使えない環境では、選択状態にして手動コピーしてもらう
        input.focus();
        input.select();
        say("error", "コピーできませんでした。選択されたURLを長押ししてコピーしてください。");
      }
    }

    if (b.dataset.act === "native") {
      try {
        await navigator.share({ title: "ハイカーズカード", text: "わたしのハイカーズカードです", url });
      } catch { /* キャンセルされた場合は何もしない */ }
    }
  });

  input.addEventListener("focus", () => input.select());
}
