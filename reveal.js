// =============================================
// スクロールして要素が画面に入ったときに、ふわっと表示する
//
// header.js から読み込むので、ヘッダーのあるページすべてで効く。
// ・あとから描かれた要素（検索結果・一覧など）も拾う
// ・カード本体・コレクションの山・ポップアップなど、自前で動きを持つものには付けない
// ・入れ子の場合は、外側の要素だけに付ける（二重に動かさない）
// ・端末で「視差効果を減らす」を選んでいる人には何もしない
// =============================================

const SELECTOR = [
  ".det", ".d-card", ".skd",
  ".mp-me", ".mp-note", ".mp-item",
  ".edit-item", ".side-h",
  ".ske", ".ad-row", ".sns-link",
  ".hc-empty", ".af-cta", ".owner-bar", ".flip-toggle-wrap",
].join(",");

// 自前で動きを持つもの（この中の要素には付けない）
const SKIP = ".hero, .flip, .deck, .afs, .share-pop, .sheet, .toast";

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduce && "IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    // 同時に画面に入ったものは、上から順に少しずつ遅らせて出す
    const shown = entries.filter((e) => e.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
    shown.forEach((e, i) => {
      const el = e.target;
      el.style.transitionDelay = `${Math.min(i * 60, 300)}ms`;
      el.classList.add("rv-in");
      io.unobserve(el);
      // 表示し終わったら印を外し、その要素本来の動き（押したときの縮みなど）に戻す
      const done = () => {
        el.classList.remove("rv", "rv-in");
        el.style.transitionDelay = "";
        el.removeEventListener("transitionend", done);
      };
      el.addEventListener("transitionend", done);
      setTimeout(done, 1200);   // transitionend が来ない場合の保険
    });
  }, { rootMargin: "0px 0px -6% 0px", threshold: 0.06 });

  const scan = (root) => {
    root.querySelectorAll(SELECTOR).forEach((el) => {
      if (el.dataset.rv) return;
      el.dataset.rv = "1";
      if (el.closest(SKIP)) return;
      if (el.parentElement?.closest(".rv")) return;   // 外側がすでに動くなら付けない
      el.classList.add("rv");
      io.observe(el);
    });
  };

  const start = () => {
    scan(document);
    // あとから描かれた要素も拾う（描画のたびに1回だけまとめて調べる）
    let queued = false;
    new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => { queued = false; scan(document); });
    }).observe(document.body, { childList: true, subtree: true });
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
}
