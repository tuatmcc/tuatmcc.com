# IP 制限付き `/join` ページ 設計

日付: 2026-06-24
対象: tuatmcc.com (Astro 7 + Cloudflare Workers)

## 目的

`/join` に、東京農工大学のキャンパス IP レンジからのアクセスのときだけ Discord 招待リンクを表示する。それ以外のアクセスは招待リンクを非表示にし、既存の `/join/manual` へ誘導する。

## 動機

既存の `src/pages/join/manual/index.astro` は「セキュリティの観点から招待リンクを一般公開していない」と明記している。学内ネットワークに限定する形で `/join` を提供すれば、農工大生のみが Discord 招待に直接アクセスできる経路を確保できる。

## スコープ

- `/join`(SSR)で IP を判定し、表示を切り替える
- CIDR 判定ロジックをカンマ区切り複数 CIDR 対応に拡張する
- 招待リンクの出し分け UI を作る
- dev 環境では判定をバイパスする

スコープ外:

- 学外ユーザーへの Discord 招待(これは引き続き `/join/manual` 経由で手動)
- 学内 VPN 利用者向けの特別扱い(将来検討)
- 招待リンクのローテーションや有効期限管理
- アクセスログ・解析

## 設計

### アーキテクチャ

- `src/pages/join/index.astro` を `prerender = false` にして Cloudflare Workers 上で毎リクエスト実行
- クライアント IP は `Astro.clientAddress`(Cloudflare アダプタが `cf-connecting-ip` ヘッダを基に解決)を使用
- 既存 `src/libs/inCidr.ts` を拡張し、`inCidrAny(ip, cidrList)` を追加
- 環境変数は `astro.config.ts` で既に宣言済みの `TUAT_CIDR` / `DISCORD_INVITE` を使用
- dev 環境では `import.meta.env.DEV` で判定をスキップし、招待リンクを常に表示

### データフロー

```
[Client]
   │  GET /join
   ▼
[Cloudflare Edge]
   │  cf-connecting-ip: <client-ip>
   ▼
[Astro SSR (Cloudflare adapter)]
   │  Astro.clientAddress = <client-ip>
   ▼
[src/pages/join/index.astro]
   │  import.meta.env.DEV ?
   │   ├─ true  → allowed = true
   │   └─ false → allowed = inCidrAny(ip, TUAT_CIDR)
   ▼
[分岐]
   ├─ allowed && DISCORD_INVITE
   │     → 招待ボタン(URL は SSR 時に HTML へ)
   └─ !allowed
         → /join/manual への案内
```

招待リンクが HTML に含まれるのは `allowed === true` のときだけ。`/join` の HTML ソースに Discord 招待リンクは農工大 IP からのリクエスト時しか現れない。

### コンポーネント構成

| ファイル                     | 種類 | 役割                                            |
| ---------------------------- | ---- | ----------------------------------------------- |
| `src/pages/join/index.astro` | 新規 | IP 判定 → Discord 招待 or manual 誘導の出し分け |
| `src/libs/inCidr.ts`         | 変更 | `inCidrAny(ip, cidrList)` を追加                |

#### `src/pages/join/index.astro`

```
---
import { DISCORD_INVITE, TUAT_CIDR } from "astro:env/server";
import GlobalLayout from "../../layouts/GlobalLayout.astro";
import { inCidrAny } from "../../libs/inCidr";

export const prerender = false;

const ip = Astro.clientAddress;
const isDev = import.meta.env.DEV;
const allowed = isDev || (Boolean(ip) && inCidrAny(ip, TUAT_CIDR));
---
<GlobalLayout title="MCC - Discord に参加">
  <main class="relative grid gap-8">
    <h1 class="font-orbitron p-8 text-4xl font-bold">Join</h1>

    {allowed ? (
      <section>
        <p>MCC の Discord サーバーに参加する</p>
        <a class="btn btn-primary" href={`https://discord.gg/${DISCORD_INVITE}`} rel="noopener noreferrer">
          Discord に参加
        </a>
        <p>学外からアクセスしている場合は <a href="/join/manual">/join/manual</a> をご覧ください。</p>
      </section>
    ) : (
      <section>
        <p>学外ネットワークからのアクセスのため、招待リンクを表示できません。</p>
        <p>東京農工大学の学内ネットワークからアクセスしてください。</p>
        <a class="btn btn-primary" href="/join/manual">/join/manual を見る</a>
      </section>
    )}
  </main>
</GlobalLayout>
```

#### `inCidrAny` のシグネチャ

```ts
export function inCidrAny(ip: string, cidrList: string): boolean;
```

- `cidrList.split(/[,\s]+/)` で分割し、空文字を除外
- いずれかの CIDR に `inCidr(ip, cidr)` が true を返せば true
- いずれの判定も既存の `inCidr` の falsy 挙動(IP 不正、CIDR 不正)を継承

## エラーハンドリング

| 状況                                   | 挙動                                                                                     |
| -------------------------------------- | ---------------------------------------------------------------------------------------- |
| `Astro.clientAddress` が空 / undefined | `allowed = false` として NotAllowedSection を表示                                        |
| `TUAT_CIDR` が空 / 未設定              | 既存 `envField` 設定の `optional: false` でビルドが落ちる                                |
| `DISCORD_INVITE` が空 / 未設定         | 既存 `envField` 設定の `optional: false` でビルドが落ちる                                |
| `cidrList` に不正な CIDR が含まれる    | `inCidr` が false を返すので、その CIDR だけスキップ。他が正しければ全体 true になり得る |
| `ip` が IPv6(`:` を含む)               | 既存 `inCidr` が false を返すため `inCidrAny` も全体で false → NotAllowedSection         |
| dev 環境で判定スキップ                 | `import.meta.env.DEV` で早期 return、誤って false にならない                             |

## テスト

### 単体テスト (`src/libs/inCidr.ts`)

`bun:test` ベースで次を検証。

- `inCidrAny("192.0.2.10", "192.0.2.0/24")` → `true`
- `inCidrAny("192.0.3.10", "192.0.2.0/24")` → `false`
- `inCidrAny("192.0.2.10", "192.0.2.0/24, 10.0.0.0/8")` → `true`
- `inCidrAny("10.1.2.3", "192.0.2.0/24, 10.0.0.0/8")` → `true`
- `inCidrAny("8.8.8.8", "192.0.2.0/24, 10.0.0.0/8")` → `false`
- `inCidrAny("not-an-ip", "192.0.2.0/24")` → `false`
- `inCidrAny("192.0.2.10", "")` → `false`
- `inCidrAny("2001:db8::1", "192.0.2.0/24")` → `false`
- `inCidrAny("192.0.2.10", " 192.0.2.0/24 , 10.0.0.0/8 ")` → `true`

### 統合テスト(SSR レベル)

- dev モード(`astro dev`)で `/join` を開き招待ボタンが表示される
- 招待リンクの URL が `https://discord.gg/{DISCORD_INVITE}` 形式
- プレビュー環境(`wrangler dev` + 環境変数セット)で Cloudflare 経由の擬似 IP で挙動を確認

### 目視チェック

- CIDR 一致時: 招待ボタンが大きく、メッセージが簡潔
- CIDR 不一致時: manual への CTA が大きく、招待リンク要素が HTML に存在しない(`view-source:` で確認)

## 影響範囲

- 新規: `src/pages/join/index.astro`
- 変更: `src/libs/inCidr.ts`(関数を 1 つ追加するのみ、既存関数の API は不変)
- 環境変数: `TUAT_CIDR` / `DISCORD_INVITE` の両方が既に `astro.config.ts` で宣言済み。`wrangler secret` または `.env` での設定が必要
- 既存ページ `src/pages/join/manual/index.astro`: 変更なし。誘導先として参照される

## ロールアウト

1. dev で挙動確認(判定バイパス)
2. プレビュー環境で CIDR マッチ/非マッチ両方を確認
3. 本番デプロイ後、学内ネットワークから `/join` を実際に開いて招待リンクが現れることを確認
4. 既存ユーザーの動線(`/join/manual`)を壊していないことを確認

## リスクと緩和

- **リスク**: クライアント IP がプロキシや VPN で偽装される
  - **緩和**: 信頼境界を Cloudflare 内に閉じ、`cf-connecting-ip` を直接見ない(adapter に任せる)。完全な秘匿は招待リンクの性質上不要
- **リスク**: `TUAT_CIDR` の更新時、フォーマット間違いで全員が締め出される
  - **緩和**: プレビュー環境で必ず 2 種類の IP(マッチ / 非マッチ)で検証する手順を運用に組み込む
- **リスク**: SSR 化でビルドサイズ・コストが増える
  - **緩和**: ページは 1 つだけ。他のページはプリレンダーのまま
