// =============================================
// 登山相性（相手のカードのページで、下からせり出すシートに出す）
//
//   computeAffinity(me, other) … スコア・4軸の近さ・山の共通点・コメントを計算
//   openAffinitySheet(...)      … シートを開く
//
// ■ スコアの計算（50〜100）
//   1. 4軸の近さ（0〜1）
//      各軸の差 d（0〜100）から近さを出し、重みを付けて足す。
//        目的・仲間 … 近さ = 1 − d/100   （重み 各0.3）
//          → 「どんな山行にしたいか」「誰と登るか」は近いほど一緒に楽しみやすい
//        計画・リスク … 近さ = 1 − d/200 （重み 各0.2）
//          → 違っていても役割分担で補いあえるので、差の影響を半分にする
//   2. 山の重なり（0〜1）
//        行ってみたい山がおなじ ×3点、よかった山がおなじ ×2点、
//        片方が行ってみたい山を、もう片方が登ったことがある ×1点
//        を足して、6点で満点（それ以上は1に丸める）
//   3. 合計 raw = 4軸 × 0.8 ＋ 山 × 0.2
//   4. スコア = 50 + 50 × raw^1.5
//      1.5乗で、よくある組み合わせ（raw 0.6前後）が70台に収まり、
//      80台後半〜100は「本当に近いふたり」だけになるよう広げている
//
//   どちらから見ても同じ数字になるよう、計算はすべて左右対称にしてある。
//   どちらかが未診断のときは、4軸を 0.6（平均的）として山の重なりだけで出し、「参考値」と表示する。
//
// ■ コメント
//   ふたりの公開IDから決まる乱数で、文の言い回しを選ぶ。
//   同じふたりなら毎回同じ文、別のふたりなら違う文になる。
// =============================================

import { esc, SILHOUETTE } from "./card.js";

// ---------------------------------------------
// 4軸の定義
// ---------------------------------------------
const AXES = [
  { key: "pe", title: "目的",   a: "P", b: "E", aName: "ピークハント", bName: "エンジョイ",   weight: 0.3, soft: false },
  { key: "sg", title: "仲間",   a: "S", b: "G", aName: "ソロ",         bName: "グループ",     weight: 0.3, soft: false },
  { key: "lf", title: "計画",   a: "L", b: "F", aName: "計画的",       bName: "フィーリング", weight: 0.2, soft: true },
  { key: "ca", title: "リスク", a: "C", b: "A", aName: "慎重",         bName: "挑戦的",       weight: 0.2, soft: true },
];

const closeTag = (d) =>
  d <= 10 ? "ほぼ同じ" : d <= 25 ? "近い" : d <= 45 ? "少し違う" : "正反対";

const scoreLabel = (s) =>
  s >= 90 ? "最高の相棒" : s >= 80 ? "息ぴったり" : s >= 70 ? "いいバランス"
  : s >= 60 ? "補いあえるふたり" : "発見の多いふたり";

// ---------------------------------------------
// ふたりに固有の乱数（どちらから見ても同じ）
// ---------------------------------------------
function seededRandom(a, b) {
  const key = [a, b].sort().join("|");
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  // mulberry32
  return () => {
    h |= 0; h = (h + 0x6D2B79F5) | 0;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const pick = (rnd, list) => list[Math.floor(rnd() * list.length)];

// =============================================
// 計算
// =============================================
export function computeAffinity(me, other) {
  // ---- 4軸 ----
  const bothDiag = !!(me.type_code && other.type_code && me.axes && other.axes);
  const axes = [];
  let axisRaw = 0.6;   // 未診断のときの仮の値

  if (bothDiag) {
    axisRaw = 0;
    for (const ax of AXES) {
      const m = Number(me.axes[ax.key] ?? 50);
      const o = Number(other.axes[ax.key] ?? 50);
      const d = Math.abs(m - o);
      const close = ax.soft ? 1 - d / 200 : 1 - d / 100;
      axisRaw += ax.weight * close;
      axes.push({ ...ax, me: m, other: o, diff: d, near: 100 - d, tag: closeTag(d) });
    }
  }

  // ---- 山 ----
  const names = (list) => new Set((list ?? []).map((m) => m.name));
  const list  = (arr, set) => (arr ?? []).filter((m) => set.has(m.name)).map((m) => m.name);

  const sameWish = list(other.wishlist, names(me.wishlist));
  const sameFav  = list(other.favorites, names(me.favorites));
  const canAsk   = list(me.wishlist, names(other.climbed));    // 自分が行ってみたい山に、相手は登った
  const canTell  = list(other.wishlist, names(me.climbed));    // 相手が行ってみたい山に、自分は登った

  const mtPoints = sameWish.length * 3 + sameFav.length * 2 + canAsk.length + canTell.length;
  const mtRaw = Math.min(1, mtPoints / 6);

  // ---- スコア ----
  const raw = axisRaw * 0.8 + mtRaw * 0.2;
  const score = Math.round(50 + 50 * Math.pow(Math.max(0, Math.min(1, raw)), 1.5));

  const af = {
    score, label: scoreLabel(score), reference: !bothDiag,
    axes, bothDiag,
    mt: { sameWish, sameFav, canAsk, canTell },
  };
  af.comment = buildComment(af, me, other);
  return af;
}

// =============================================
// コメント
// =============================================
const OPENING = {
  90: [
    "{P}とあなたは、山の好みも歩き方も驚くほど近いふたり。初めて一緒に登る日から、長年の相棒のように歩けそうです。",
    "登山スタイルがここまで重なる相手には、なかなか出会えません。{P}とは、きっと話が尽きない関係になります。",
    "山に求めるものがよく似たふたりです。{P}となら、同じ景色を同じ温度で楽しめるはず。",
  ],
  80: [
    "{P}とは、根っこの部分がよく似ています。ちょっとした違いも、一緒に登るうちに心地よいアクセントになりそう。",
    "息の合う山行が想像しやすいふたりです。まずは近場の山から、一緒に歩いてみてはいかがでしょう。",
    "{P}とあなたは、共通点と違いのバランスがちょうどいい組み合わせ。お互いの登り方から学べることが多そうです。",
  ],
  70: [
    "似ているところと違うところが、ほどよく混ざったふたり。違いがあるからこそ、ひとりでは選ばない山に出会えそうです。",
    "{P}とあなたは、お互いを補いあえる関係。役割分担を意識すると、山行がぐっと楽しくなります。",
    "スタイルは少しずつ違っても、山が好きな気持ちは同じ。話してみると、意外な共通点が見つかるかもしれません。",
  ],
  60: [
    "{P}とあなたは、山との付き合い方がけっこう違うふたり。そのぶん、相手の話から新しい楽しみ方を知れるはずです。",
    "違いの多い組み合わせは、実は発見の宝庫。{P}の登り方を知ると、あなたの山の世界も広がりそうです。",
    "登り方は対照的でも、それは相性が悪いということではありません。お互いの得意を持ち寄れば、心強いペアになれます。",
  ],
  0: [
    "{P}とあなたは、ほぼ正反対のスタイル。だからこそ、ひとりでは見えない景色を教えあえる関係です。",
    "ここまで違うと、話を聞くだけでも新鮮なはず。{P}の「当たり前」が、あなたの次の山行のヒントになるかもしれません。",
    "対照的なふたりです。一緒に登るなら、事前に「どんな一日にしたいか」を話しておくと、お互いに楽しめます。",
  ],
};

// 同じ側で近い軸
const SIMILAR = {
  pe: {
    P: ["ふたりとも「山頂に立ってこそ」のタイプ。目標の山を決めたら、登頂まで気持ちがぶれにくい組み合わせです。",
        "山頂を目指す気持ちの強さがよく似ています。黙々と登る時間も、ふたりなら苦になりません。"],
    E: ["ふたりとも、道中の景色や休憩のひとときを楽しむタイプ。花や雲に足を止めても、お互いに急かさずにいられます。",
        "山頂より「その日一日が楽しかったか」を大事にするところがそっくり。ゆっくりペースの山行が気持ちよく続きそうです。"],
  },
  sg: {
    S: ["ふたりとも、ひとりで山と向き合う時間を大切にしています。ほどよい距離感を保ったまま、同じ山を楽しめる関係になれそうです。",
        "単独行の気楽さを知っている者どうし。一緒に歩くときも、無理に会話を続けなくていい心地よさがあります。"],
    G: ["ふたりとも、誰かと登る山が好きなタイプ。山頂でのおやつから下山後のごはんまで、にぎやかに楽しめそうです。",
        "仲間と登る楽しさを知っているところが共通しています。ふたりを起点に、山仲間の輪が広がっていきそう。"],
  },
  lf: {
    L: ["ふたりとも計画を立ててから動く派。行程やエスケープルートを一緒に詰めていく時間まで楽しめる組み合わせです。",
        "下調べを大事にするところがよく似ています。地図を広げて計画を練るだけで、話が尽きないはず。"],
    F: ["ふたりとも、その日の天気や気分で動けるタイプ。思い立ったらすぐ出かけられる身軽さが、ふたりの強みです。",
        "計画に縛られすぎない自由さが共通しています。予定外の寄り道も、ふたりなら楽しい思い出に変わりそう。"],
  },
  ca: {
    C: ["ふたりとも慎重に判断するタイプ。「今日はやめておこう」と言い出しやすく、安心して一緒に歩けます。",
        "リスクへの感覚がよく似ていて、撤退の判断で揉めにくい組み合わせ。長く安全に山を続けられる相性です。"],
    A: ["ふたりとも新しい挑戦に心が動くタイプ。難しいルートや初めての山域にも、背中を押しあって踏み出せそうです。",
        "「行ってみたい」の熱量がよく似ています。ふたりなら、ひとりではためらう山にも挑戦できるかもしれません。"],
  },
};

// 反対側の軸（{A} = a側の人、{B} = b側の人）
const COMPLEMENT = {
  pe: ["目的では、{A}が山頂を目指す派、{B}が道中を楽しむ派。{A}が目標を決め、{B}が景色や寄り道の楽しさを添えれば、登頂も道のりも両方楽しめる山行になります。",
       "{A}は頂上、{B}は道中に心が向くタイプ。ペースの違いが出やすいぶん、休憩のタイミングを先に決めておくと、お互いの「楽しい」を守れます。"],
  sg: ["仲間については、{A}がソロ派で{B}がグループ派。{B}が誘い出し、{A}がほどよい距離感を保つことで、ちょうどいい関係が作れそうです。",
       "{A}はひとり時間、{B}はみんなで登る時間を大切にするタイプ。ときどき一緒に、ときどき別々に──そんな付き合い方が長続きのコツです。"],
  lf: ["計画では、{A}がしっかり準備する派、{B}がその場で決める派。{A}が行程の骨組みを作り、{B}が当日の気づきで彩りを加える、理想的な役割分担ができます。",
       "{A}の段取りと{B}の臨機応変さは、ちょうど補いあう関係。予定どおりにいかない日ほど、ふたりの組み合わせが頼りになります。"],
  ca: ["リスクの感じ方は、{A}が慎重派、{B}が挑戦派。{B}が「行ってみよう」と背中を押し、{A}が「ここまでにしよう」とブレーキをかける、バランスのいいペアです。",
       "{B}の挑戦心と{A}の慎重さは、組み合わせると心強い武器になります。撤退ラインだけは出発前に一緒に決めておきましょう。"],
};

// 同じ側だが、強さに差がある軸
const DEGREE_TRAIT = {
  P: "山頂へのこだわりが強め", E: "道中を楽しむ気持ちが強め",
  S: "ひとり時間を大事にする傾向が強め", G: "仲間と登りたい気持ちが強め",
  L: "計画を重視する傾向が強め", F: "気分で動く傾向が強め",
  C: "慎重さが強め", A: "挑戦したい気持ちが強め",
};
const DEGREE = [
  "{T}ではどちらも{N}寄りですが、{S}のほうが{R}。温度差を知っておくと、計画のすり合わせがスムーズです。",
  "{T}の向きは同じ{N}。ただ、{S}のほうが{R}なので、そこだけお互いに一声かけあうとちょうどよさそうです。",
];

const MOUNTAIN = {
  sameWish: [
    "そして、{M}はふたりとも「行ってみたい山」。一緒に計画を立てれば、初登頂の喜びを分かちあえるかもしれません！",
    "{M}にふたりとも行ってみたいと思っているのも見逃せません。タイミングが合えば、同じ山頂で初めての景色を見られそうです。",
  ],
  canAsk: [
    "{P}は、あなたが行ってみたい{M}にすでに登っています。コースの様子や見どころを聞いてみると、計画がぐっと具体的になりますよ。",
    "あなたの憧れの{M}は、{P}にとって経験済みの山。次に会ったとき、ぜひ体験談を聞いてみてください。",
  ],
  canTell: [
    "{X}{P}が行ってみたい{M}は、あなたが登ったことのある山。あなたの経験が、{P}の背中を押すきっかけになりそうです。",
    "{X}{P}が気になっている{M}に、あなたは登ったことがあります。そのときの話をしてあげると、きっと喜ばれます。",
  ],
  sameFav: [
    "{M}をふたりとも「行ってよかった山」に選んでいるのも、好みが近い証拠。思い出話で盛り上がれそうです。",
    "「行ってよかった山」に{M}が重なっているのも素敵な偶然。同じ山の好きなところを語りあってみては。",
  ],
  none: [
    "山の登録が増えると、共通の山が見えてくるかもしれません。まずはお互いの「行ってみたい山」を話してみては？",
    "今のところ共通の山は見つかりませんでしたが、そのぶんお互いの知らない山を紹介しあえる関係です。",
  ],
};

const CLOSING = [
  "次の週末、どこかの山で並んで歩くふたりを想像してみてください。",
  "いつか同じ山頂で、この相性を確かめてみてください。",
  "お互いのカードを見返しながら、次の山の話をしてみましょう。",
  "山の上で交わす会話が、きっとふたりの距離を縮めてくれます。",
];

function buildComment(af, me, other) {
  const rnd = seededRandom(me.public_id ?? "me", other.public_id ?? "other");
  const P = `${other.display_name}さん`;
  const fill = (s, v) => s.replace(/\{(\w)\}/g, (_, k) => v[k] ?? "");
  const mtNames = (arr) => arr.length > 2 ? `${arr.slice(0, 2).join("・")}など` : arr.join("・");
  const paras = [];

  // 1. はじまり
  const band = af.score >= 90 ? 90 : af.score >= 80 ? 80 : af.score >= 70 ? 70 : af.score >= 60 ? 60 : 0;
  paras.push(fill(pick(rnd, OPENING[band]), { P }));

  // 2. 4軸
  if (af.bothDiag) {
    const sorted = [...af.axes].sort((x, y) => x.diff - y.diff);
    const similar = sorted.filter((ax) => ax.diff <= 25 && (ax.me >= 50) === (ax.other >= 50)).slice(0, 2);
    const different = [...sorted].reverse().filter((ax) => ax.diff > 25).slice(0, 2);

    const axisText = [];
    for (const ax of similar) {
      const pole = (ax.me + ax.other) / 2 >= 50 ? ax.a : ax.b;
      axisText.push(pick(rnd, SIMILAR[ax.key][pole]));
    }
    for (const ax of different) {
      const meA = ax.me >= 50, otherA = ax.other >= 50;
      if (meA !== otherA) {
        // 反対側：補いあい
        const A = meA ? "あなた" : P;
        const B = meA ? P : "あなた";
        axisText.push(fill(pick(rnd, COMPLEMENT[ax.key]), { A, B }));
      } else {
        // 同じ側：強さの差
        const pole = meA ? ax.a : ax.b;
        const meStronger = meA ? ax.me > ax.other : ax.me < ax.other;
        axisText.push(fill(pick(rnd, DEGREE), {
          T: ax.title, N: meA ? ax.aName : ax.bName,
          S: meStronger ? "あなた" : P, R: DEGREE_TRAIT[pole],
        }));
      }
    }
    if (axisText.length) paras.push(axisText.join(""));
  } else {
    paras.push("ふたりとも登山タイプ診断を受けると、4軸の近さから、似ているところや補いあえるところも分かるようになります。");
  }

  // 3. 山（多すぎると長くなるので3つまで）
  const { sameWish, canAsk, canTell, sameFav } = af.mt;
  const mt = [];
  if (sameWish.length) mt.push(fill(pick(rnd, MOUNTAIN.sameWish), { M: mtNames(sameWish), P }));
  if (canAsk.length)   mt.push(fill(pick(rnd, MOUNTAIN.canAsk),   { M: mtNames(canAsk), P }));
  if (canTell.length)  mt.push(fill(pick(rnd, MOUNTAIN.canTell),  { M: mtNames(canTell), P, X: canAsk.length ? "逆に、" : "" }));
  if (sameFav.length)  mt.push(fill(pick(rnd, MOUNTAIN.sameFav),  { M: mtNames(sameFav), P }));
  paras.push(mt.length ? mt.slice(0, 3).join("") : pick(rnd, MOUNTAIN.none));

  // 4. むすび
  paras.push(pick(rnd, CLOSING));

  return paras;
}

// =============================================
// 表示
// =============================================
const IC = {
  wish: `<svg viewBox="0 0 24 24"><path d="M3 20l6-11 4 7 3-4 5 8z"/><path d="M9 9V4l4 2-4 2"/></svg>`,
  ask:  `<svg viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4z"/><path d="M10 9.5a2 2 0 1 1 2.8 1.8c-.5.3-.8.7-.8 1.2"/><path d="M12 14.5h.01"/></svg>`,
  tell: `<svg viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4z"/><path d="M8 10h8M8 13h5"/></svg>`,
  fav:  `<svg viewBox="0 0 24 24"><path d="M12 3l2.7 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.4 6.5 20.4l1.1-6.3L3 9.7l6.3-.9z"/></svg>`,
};

function mountainGroups(af, P) {
  const g = (list, icon, title, note, cls) => list.length ? `
    <div class="afs-mg ${cls}">
      <div class="afs-mg-h"><span class="afs-mg-ic">${IC[icon]}</span><p>${title}</p></div>
      <div class="afs-tags">${list.map((n) => `<span>${esc(n)}</span>`).join("")}</div>
      <p class="afs-mg-note">${note}</p>
    </div>` : "";

  const { sameWish, canAsk, canTell, sameFav } = af.mt;
  const html = [
    g(sameWish, "wish", "一緒に登れるかも！？", "ふたりとも「行ってみたい山」です。", "wish"),
    g(canAsk,   "ask",  `${esc(P)}さんに話を聞いてみよう`, `あなたが行ってみたい山に、${esc(P)}さんはもう登っています。`, "ask"),
    g(canTell,  "tell", "話してあげられるかも", `${esc(P)}さんが行ってみたい山に、あなたは登ったことがあります。`, "tell"),
    g(sameFav,  "fav",  "好きな山がおなじ", "ふたりとも「行ってよかった山」に選んでいます。", "fav"),
  ].join("");

  return html || `<p class="afs-empty">まだ共通の山はありません。<br>山を登録すると、重なりが見えてきます。</p>`;
}

function axisRows(af) {
  if (!af.bothDiag) {
    return `<p class="afs-empty">ふたりとも登山タイプ診断を受けると表示されます。</p>`;
  }
  return af.axes.map((ax) => `
    <div class="afs-ax">
      <div class="afs-ax-h">
        <p>${ax.title}</p>
        <span class="afs-near">近さ <b>${ax.near}</b>%<em>${ax.tag}</em></span>
      </div>
      <div class="afs-ax-track">
        <i class="afs-dot other" style="left:${100 - ax.other}%" title="相手"></i>
        <i class="afs-dot me" style="left:${100 - ax.me}%" title="あなた"></i>
        <span class="afs-gap" style="left:${100 - Math.max(ax.me, ax.other)}%;width:${ax.diff}%"></span>
      </div>
      <div class="afs-ax-poles"><span>${ax.a} ${ax.aName}</span><span>${ax.bName} ${ax.b}</span></div>
    </div>`).join("");
}

function ringSVG(score) {
  const R = 52, C = 2 * Math.PI * R;
  return `
    <svg viewBox="0 0 120 120" class="afs-ring">
      <circle cx="60" cy="60" r="${R}" class="trk"/>
      <circle cx="60" cy="60" r="${R}" class="val" stroke-dasharray="${C}"
              stroke-dashoffset="${C}" data-target="${C * (1 - score / 100)}"
              transform="rotate(-90 60 60)"/>
    </svg>`;
}

// ---------------------------------------------
// シート本体の中身
// ---------------------------------------------
function sheetBody(af, ctx) {
  const P = ctx.other.display_name;
  return `
    <div class="afs-pair">
      <div class="afs-av me">${ctx.myChar || SILHOUETTE}</div>
      <span class="afs-x">×</span>
      <div class="afs-av other">${ctx.otherChar || SILHOUETTE}</div>
    </div>
    <p class="afs-names">あなた × ${esc(P)}さん</p>

    <div class="afs-score">
      ${ringSVG(af.score)}
      <div class="afs-num"><b data-count="${af.score}">50</b><span>/ 100</span></div>
    </div>
    <p class="afs-label">${af.label}${af.reference ? `<em>参考値</em>` : ""}</p>

    <section class="afs-sec">
      <h3>4軸の近さ</h3>
      ${af.bothDiag ? `<div class="afs-legend"><span><i class="afs-dot me"></i>あなた</span><span><i class="afs-dot other"></i>${esc(P)}さん</span></div>` : ""}
      ${axisRows(af)}
    </section>

    <section class="afs-sec">
      <h3>山の共通点</h3>
      ${mountainGroups(af, P)}
    </section>

    <section class="afs-sec">
      <h3>ふたりへのコメント</h3>
      <div class="afs-comment">${af.comment.map((p) => `<p>${esc(p)}</p>`).join("")}</div>
    </section>`;
}

// ---------------------------------------------
// シートの開閉（下からせり出す）
// ---------------------------------------------
function openSheet(inner, title) {
  const wrap = document.createElement("div");
  wrap.className = "afs";
  wrap.innerHTML = `
    <div class="afs-panel" role="dialog" aria-modal="true" aria-label="${esc(title)}">
      <div class="afs-grab"><i></i></div>
      <button class="afs-close" aria-label="閉じる">&times;</button>
      <div class="afs-scroll">${inner}</div>
    </div>`;
  document.body.appendChild(wrap);
  document.body.style.overflow = "hidden";

  // 次のフレームでクラスを付けて、せり出すアニメーションを走らせる
  requestAnimationFrame(() => requestAnimationFrame(() => wrap.classList.add("open")));

  const panel = wrap.querySelector(".afs-panel");
  const scroller = wrap.querySelector(".afs-scroll");

  const close = () => {
    wrap.classList.remove("open");
    removeEventListener("keydown", onKey);
    setTimeout(() => { wrap.remove(); document.body.style.overflow = ""; }, 320);
  };
  const onKey = (e) => { if (e.key === "Escape") close(); };
  addEventListener("keydown", onKey);

  wrap.addEventListener("click", (e) => {
    if (e.target === wrap || e.target.closest(".afs-close")) close();
  });

  // 上の持ち手を下にスワイプして閉じる
  let startY = null;
  panel.addEventListener("touchstart", (e) => {
    if (scroller.scrollTop > 0 && !e.target.closest(".afs-grab")) return;
    startY = e.touches[0].clientY;
  }, { passive: true });
  panel.addEventListener("touchmove", (e) => {
    if (startY === null) return;
    const dy = e.touches[0].clientY - startY;
    if (dy > 0) panel.style.transform = `translateY(${dy}px)`;
  }, { passive: true });
  panel.addEventListener("touchend", (e) => {
    if (startY === null) return;
    const dy = e.changedTouches[0].clientY - startY;
    startY = null;
    panel.style.transform = "";
    if (dy > 90) close();
  });

  return wrap;
}

// スコアのリングと数字をアニメーションさせる
function animateScore(root) {
  const val = root.querySelector(".afs-ring .val");
  const num = root.querySelector("[data-count]");
  if (!val || !num) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const target = Number(num.dataset.count);
  setTimeout(() => {
    val.style.strokeDashoffset = val.dataset.target;
    if (reduce) { num.textContent = target; return; }
    const t0 = performance.now(), dur = 900;
    const step = (t) => {
      const k = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - k, 3);
      num.textContent = Math.round(50 + (target - 50) * eased);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, 260);
}

// =============================================
// 外から呼ぶもの
// =============================================

// ヒーローカードの下に置くボタン
export function renderAffinityButton(partnerName) {
  return `
    <button class="af-cta" id="af-open">
      <span class="af-cta-ic"><svg viewBox="0 0 24 24"><path d="M3 19l6-10 4 6 3-4 5 8z"/><path d="M12 5.5c-1-1.6-3.6-1.3-3.6.8 0 1.5 2 2.8 3.6 4 1.6-1.2 3.6-2.5 3.6-4 0-2.1-2.6-2.4-3.6-.8z"/></svg></span>
      <span class="af-cta-t"><b>登山相性をみる</b><span>${esc(partnerName)}さんとあなたの相性</span></span>
      <svg class="af-cta-go" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>
    </button>`;
}

// ctx: { me, other, myChar, otherChar, loginUrl }
export function openAffinitySheet(ctx) {
  if (!ctx.me) {
    // 未ログイン：ログインへ誘導
    openSheet(`
      <div class="afs-login">
        <div class="afs-pair">
          <div class="afs-av me">${SILHOUETTE}</div><span class="afs-x">×</span>
          <div class="afs-av other">${ctx.otherChar || SILHOUETTE}</div>
        </div>
        <p class="afs-login-t">${esc(ctx.other.display_name)}さんとの登山相性</p>
        <p class="afs-login-d">ログインすると、4軸の近さや共通の山から<br>ふたりの相性を測定できます。</p>
        <a class="btn sun" href="${esc(ctx.loginUrl)}" style="text-decoration:none">ログインして測定する</a>
      </div>`, "登山相性");
    return;
  }

  const af = computeAffinity(ctx.me, ctx.other);
  const sheet = openSheet(sheetBody(af, ctx), "登山相性");
  animateScore(sheet);
}
