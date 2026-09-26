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
//   ログイン済み・名前なし → "setup"
//   ログイン済み・名前あり → "home"
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
    if (!retry) return { to: "setup", user, profile: null };
    return {
      to: retry.display_name ? "home" : "setup",
      user,
      profile: retry,
    };
  }

  return {
    to: profile.display_name ? "home" : "setup",
    user,
    profile,
  };
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
