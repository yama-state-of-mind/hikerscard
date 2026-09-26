# ハイカーズカード｜フロントエンド Step 4

ログイン・プロフィール設定・16タイプ診断・登った山の登録・**カード表示と公開ページ**まで。

## ファイル構成

```
hikers-card/
├── config.js      ← ここに自分のSupabaseの値を書く
├── supabase.js    ← Supabaseクライアントと共通処理
├── style.css      ← 共通スタイル（筑波山版のトークンを踏襲）
├── index.html     ← 入口。ログイン状態で行き先を振り分ける
├── login.html     ← ログイン画面（Google／マジックリンク）
├── setup.html     ← プロフィール初期設定・編集
├── quiz.html      ← 16タイプ診断
├── mountains.html ← 登った山の登録（百名山100座から選ぶ）
├── card.html      ← 自分のカード
├── u.html         ← 公開ページ（/u/{public_id} で表示される）
├── card.js        ← カードの描画（card.html と u.html で共有）
└── vercel.json    ← /u/:id を u.html に繋ぐ設定
├── data.js        ← 診断の設問・タイプ定義（筑波山版から移植・変更しない）
└── characters.js  ← 16キャラのSVG（筑波山版から移植・変更しない）
```

## 診断について

- `data.js` と `characters.js` は**筑波山版からそのままコピー**したもの。計算ロジックも `calcResult` と同一
- 結果は `type_code` と4軸スコア（1文字目側への寄り0〜100）としてDBに保存される
- **未ログインでも診断を受けられる。** その場合は結果をブラウザに一時保存し、ログイン完了後に自動で書き込む
- **やり直しは制限なし**
- シークレットキャラは MVP では移植していない（`type_code` が4文字英大文字に限定されているため）

## 手順

### 1. config.js を書き換える

```js
export const SUPABASE_URL = "https://xxxxxxxxxxxx.supabase.co";
export const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_xxxxxxxxxxxxxxxx";
```

- **URL**：Supabase → Project Settings → Data API
- **publishable key**：Supabase → Project Settings → API Keys

`sb_secret_` で始まるキーは**絶対にここに書かないでください**。

### 2. ローカルサーバーを起動する

**ファイルをダブルクリックして開いてはいけません。** `file://` では動きません（モジュールの読み込みが許可されないため）。

ポートは **3000** にしてください。SupabaseのRedirect URLsに `http://localhost:3000/**` を登録してあるためです。

```bash
cd hikers-card
npx serve -l 3000
```

Pythonでも構いません。

```bash
python3 -m http.server 3000
```

### 3. ブラウザで開く

```
http://localhost:3000
```

## 確認すること

| # | 操作 | 期待する動き |
|---|---|---|
| 1 | トップを開く | 未ログインなので login.html へ移動する |
| 2 | 「Googleで続ける」を押す | Googleの選択画面が出る。戻ると setup.html へ移動する |
| 3 | 表示名を入れて保存 | index.html に戻り、**DBから読んだプロフィールが表示される** |
| 4 | 「プロフィールを編集」 | 既存の値が入った状態で setup.html が開く |
| 5 | Supabaseの Table Editor で profiles を見る | display_name と comment が反映されている |
| 6 | ログアウト → もう一度ログイン | setup を飛ばして、いきなりトップが表示される |
| 7 | 「診断を受ける」を押す | quiz.html が開く |
| 8 | 12問に答えて結果を見る | キャラ・タイプ名・4軸バーが表示される |
| 9 | 「この結果をカードに保存する」 | トップに戻り、**アイコンがキャラに変わり4軸が表示される** |
| 10 | Table Editor で profiles を見る | type_code と axis_pe/sg/lf/ca が入っている |
| 11 | ログアウトした状態で quiz.html を直接開く | 診断は受けられる。保存を押すとログインへ誘導され、ログイン後に結果が反映される |

| 12 | 「登った山を登録する」を押す | mountains.html が開き、100座が標高順に並ぶ |
| 13 | 検索欄に「やり」と入力 | **槍ヶ岳が出る**（かな検索が効いている） |
| 14 | エリアの「北アルプス」を押す | 北アルプスの山だけに絞られる |
| 15 | いくつか選んで保存 | トップに戻り、**踏破リングと山タグが表示される** |
| 16 | もう一度開く | 選んだ山にチェックが入っている |
| 17 | チェックを外して保存 | 踏破数が減る（差分だけ書き込んでいる） |

| 18 | トップを開く | **1枚の縦長カード**が表示される |
| 19 | 「コピー」を押す | 公開URL `https://.../u/xxxxxx` がコピーされる |
| 20 | そのURLを開く | 同じカードが公開ページとして表示される |
| 21 | **シークレットウィンドウ**で同じURLを開く | 未ログインでもカードが見え、「カードを作る」が出る |
| 22 | 存在しないID（`/u/aaaaaa`）を開く | 「カードが見つかりません」と出る |

**22番まで通れば、カード表示は完成**です。

## /u/{id} のルーティングについて

`vercel.json` の rewrites で `/u/:id` を `u.html` に繋いでいます。**このファイルをリポジトリの直下に置くのを忘れないでください。**

`u.html` の中では、CSSやJSの参照を**絶対パス**（`/style.css` など）にしています。`/u/x7k2p9` というパスで表示されるため、相対パスだと `/u/style.css` を探してしまうからです。

## つまずきやすいところ

| 症状 | 原因と対処 |
|---|---|
| 画面が真っ白 | ブラウザの開発者ツール（F12）でコンソールを確認。config.js の値が未設定だとここで止まる |
| `file://` で開いて動かない | ローカルサーバーを立ててください（手順2） |
| Googleログイン後に戻ってこない | Supabase → Authentication → URL Configuration の Redirect URLs に `http://localhost:3000/**` があるか確認 |
| Googleが「アクセスをブロック」 | Google Auth Platform → 対象（Audience）のテストユーザーに自分のアカウントを追加 |
| 「プロフィールを読み込めませんでした」 | profiles にトリガーで行が作られていない。SQL Editor で `select * from public.profiles;` を確認 |
| マジックリンクが届かない | 送信数の上限（1時間に数通）に達している可能性。普段はGoogleログインでテストする |
| ポートが 3000 以外 | Redirect URLs に登録したポートと一致させるか、Supabase側に追加する |

## 次のステップ

- カード表示（UIサンプル `hikers-card-sample-v1.html` のカードを、DBの値で描く）
- QRの発行と読み取り（`issue_exchange_token` / `redeem_exchange_token`）
- コレクション（`get_my_collection`）
- 公開ページ `/u/{public_id}`（`get_public_card`）

## 補足

- `detectSessionInUrl` を有効にしてあるので、Googleから戻ってきたときもマジックリンクを踏んだときも、Supabaseのライブラリが自動でセッションを作ります。コールバック用のページを自分で用意する必要はありません
- ページを開いた直後はセッションの復元中なので、**判定が終わるまで「読み込んでいます」を表示**しています。これを省くと一瞬ログアウト状態に見えます
- 入力欄のフォントサイズを15pxにしているのは、iOSで16px未満だと画面が自動拡大されるのを避けるためです
