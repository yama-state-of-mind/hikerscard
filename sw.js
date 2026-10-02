// =============================================
// Service Worker
//
// PWAとして成立させるために必要な最小限のもの。
//
// 【方針】キャッシュはほとんど使わない。
// 開発中に頻繁に更新するサイトでキャッシュを効かせすぎると、
// 「直したのに反映されない」という厄介な問題が起きる。
// しかもユーザー側でキャッシュを消してもらうのは現実的ではない。
//
// このサービスは交換もコレクションもサーバーのデータが必要なので、
// オフラインで使える場面がほとんどない。
// キャッシュするのはアイコンなど、めったに変わらないものだけにする。
// =============================================

const VERSION = "v4";   // Step 27：国旗の画像を追加
const CACHE = `hikers-card-${VERSION}`;

// めったに変わらないものだけを事前に保存しておく
const PRECACHE = [
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

// ---------------------------------------------
// インストール
// ---------------------------------------------
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(PRECACHE))
      .catch(() => {})      // 失敗してもインストール自体は進める
      .then(() => self.skipWaiting())
  );
});

// ---------------------------------------------
// 有効化：古いバージョンのキャッシュを捨てる
// ---------------------------------------------
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// ---------------------------------------------
// 取得
//
// 基本はネットワークを優先する。
// 画像だけは、失敗したときにキャッシュを使う。
// ---------------------------------------------
self.addEventListener("fetch", (e) => {
  const req = e.request;

  // GET以外、別ドメイン（SupabaseやCDN）は素通し
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  // アイコンなどの画像は、キャッシュがあればそれを返す
  if (url.pathname.startsWith("/icons/")) {
    e.respondWith(
      caches.match(req).then((hit) => hit || fetchAndStore(req))
    );
    return;
  }

  // それ以外は常にネットワークから。
  // cache: "no-cache" で、ブラウザに残っている古いファイルを使わず、
  // 毎回サーバーに「新しくなっていないか」を確かめる
  // （変わっていなければ中身は送られないので、通信量はほとんど増えない）。
  // これが無いと、JSだけ古いまま・CSSだけ新しい、というズレが起きる。
  // オフラインのときだけ、保存されていれば返す
  e.respondWith(
    fetch(req, { cache: "no-cache" }).catch(() => caches.match(req))
  );
});

function fetchAndStore(req) {
  return fetch(req).then((res) => {
    if (res.ok) {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(req, copy));
    }
    return res;
  });
}
