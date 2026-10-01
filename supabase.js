// =============================================
// Supabase クライアントと共通ヘルパー
// =============================================

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "./config.js";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    // URLに含まれる認証情報を自動で処理してセッションを作る
    // （Googleから戻ってきたとき・マジックリンクを踏んだとき）
    detectSessionInUrl: true,
    persistSession: true,
    autoRefreshToken: true,
  },
});

// ---------------------------------------------
// ログイン中のユーザーを返す（いなければ null）
//
// ページを開いた直後はセッションの復元中で、一瞬 null になる。
// getSession() は復元を待ってから返すので、これを使う。
// ---------------------------------------------
export async function getUser() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error("セッション取得に失敗:", error);
    return null;
  }
  return data.session?.user ?? null;
}

// ---------------------------------------------
// 自分のプロフィールを取得
// RLSで「本人のみ読める」ようにしてあるので、条件を書かなくても
// 自分の行しか返らないが、明示した方が意図が伝わるので書いておく
// ---------------------------------------------
export async function getMyProfile() {
  const user = await getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("プロフィール取得に失敗:", error);
    return null;
  }
  return data;
}

// ---------------------------------------------
// ログイン状態に応じた行き先を判定する
//
//   未ログイン           → "login"
//   ログイン済み・カードづくりがまだ → "start"
//   ログイン済み・カード完成 → "home"
// ---------------------------------------------
export async function resolveDestination() {
  const user = await getUser();
  if (!user) return { to: "login", user: null, profile: null };

  const profile = await getMyProfile();

  // プロフィール行はトリガーで自動作成されるが、
  // 万一まだ無ければ少し待って取り直す
  if (!profile) {
    await new Promise((r) => setTimeout(r, 800));
    const retry = await getMyProfile();
    if (!retry) return { to: "start", user, profile: null };
    return {
      to: retry.onboarded_at ? "home" : "start",
      user,
      profile: retry,
    };
  }

  // カードづくりを終えていなければ、カードづくりへ
  return {
    to: profile.onboarded_at ? "home" : "start",
    user,
    profile,
  };
}

// ---------------------------------------------
// 未ログインのまま受けた診断結果を、ログイン後にDBへ書き込む
//
// quiz.html が localStorage に置いた値を拾う。
// すでに診断済みの場合は書き込まない
// （過去の結果が復活する事故を防ぐため）
// ---------------------------------------------
export async function applyPendingDiagnosis(profile) {
  const raw = localStorage.getItem("pendingDiagnosis");
  if (!raw) return profile;

  // すでに診断済みなら、保留分は捨てる
  if (profile?.type_code) {
    localStorage.removeItem("pendingDiagnosis");
    return profile;
  }

  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    localStorage.removeItem("pendingDiagnosis");
    return profile;
  }

  const user = await getUser();
  if (!user) return profile;

  const { error } = await supabase
    .from("profiles")
    .update(payload)
    .eq("id", user.id);

  if (error) {
    console.error("診断結果の保存に失敗:", error);
    return profile;   // 次回の読み込みで再挑戦できるよう、保留分は残す
  }

  localStorage.removeItem("pendingDiagnosis");
  return await getMyProfile();
}

// ---------------------------------------------
// 未ログインのまま開いた交換URLを、ログイン後に実行する
//
// x.html が localStorage に預けたトークンを拾う。
// 成功・失敗どちらでも預かり分は消す（期限切れのトークンが
// 残り続けると、毎回エラーが出てしまうため）
//
// 戻り値: 交換できたら { partner: 相手のpublic_id, isNew: 新しい交換か }、そうでなければ null
// ---------------------------------------------
export async function applyPendingExchange() {
  const token = localStorage.getItem("pendingExchangeToken");
  if (!token) return null;

  const user = await getUser();
  if (!user) return null;

  localStorage.removeItem("pendingExchangeToken");

  const { data, error } = await supabase.rpc("redeem_exchange_token", {
    p_token: token,
  });

  if (error) {
    console.error("交換に失敗:", error);
    return null;
  }
  if (!data?.ok) {
    console.warn("交換できませんでした:", data?.reason);
    return null;
  }
  return { partner: data.partner, isNew: !!data.is_new };
}

// ---------------------------------------------
// テスト用アカウントだけ：カードづくりを最初からやり直す
//
// 名前・診断・登録した山・完成の記録が消える（カード番号・交換相手・登山スキルは残る）。
// ブラウザに残っている途中の状態（未保存の診断・登録のしかた）も消す。
// テスト用でない人が呼んでも、DB側で拒否される。
// ---------------------------------------------
export async function resetMyOnboarding() {
  if (!confirm("カードづくりを最初からやり直しますか？\n\n名前・診断・登録した山が消えます。\n（カード番号・交換相手・登山スキルは残ります）")) return false;
  const { error } = await supabase.rpc("reset_my_onboarding");
  if (error) { alert("やり直せませんでした：" + error.message); return false; }
  localStorage.removeItem("pendingDiagnosis");
  sessionStorage.removeItem("hcRegMode");
  location.href = "/start.html";
  return true;
}

// ---------------------------------------------
// ログアウト
// ---------------------------------------------
export async function signOut() {
  await supabase.auth.signOut();
  location.href = "./index.html";
}

// ---------------------------------------------
// このサイトのベースURL（末尾にファイル名を付けて使う）
// 例: http://localhost:3000/
// ---------------------------------------------
export function baseUrl() {
  const path = location.pathname.replace(/[^/]*$/, "");
  return `${location.origin}${path}`;
}
