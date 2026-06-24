# IP 制限付き `/join` ページ 実装計画

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `/join` に東京農工大学キャンパス IP レンジからのアクセスのときだけ Discord 招待リンクを表示し、それ以外は `/join/manual` に誘導する。

**Architecture:** `/join` を `prerender = false` の SSR ページにし、`Astro.clientAddress` と既存 `inCidr` を拡張した `inCidrAny` で CIDR 判定する。dev では判定をバイパスする。招待リンクの URL は判定通過時のみ HTML に出力される。

**Tech Stack:** Astro 7 / @astrojs/cloudflare 14 / TypeScript / `bun:test`

**Spec:** `docs/superpowers/specs/2026-06-24-ip-gated-join-page-design.md`

---

## ファイル構成

| ファイル | 種類 | 役割 |
| --- | --- | --- |
| `src/libs/inCidr.ts` | 変更 | `inCidrAny(ip, cidrList)` を追加 |
| `src/libs/inCidr.test.ts` | 新規 | `inCidr` / `inCidrAny` の `bun:test` 単体テスト |
| `src/pages/join/index.astro` | 新規 | IP 判定で招待リンク表示 / manual 誘導を出し分ける SSR ページ |

---

## Task 1: `inCidrAny` 関数の追加 (TDD)

**Files:**
- Modify: `src/libs/inCidr.ts`
- Create: `src/libs/inCidr.test.ts`

- [ ] **Step 1: 失敗するテストを `src/libs/inCidr.test.ts` に書く**

```ts
import { describe, expect, test } from "bun:test";
import { inCidr, inCidrAny } from "./inCidr";

describe("inCidr", () => {
	test("matches an IP inside a single /24", () => {
		expect(inCidr("192.0.2.10", "192.0.2.0/24")).toBe(true);
	});

	test("rejects an IP outside a single /24", () => {
		expect(inCidr("192.0.3.10", "192.0.2.0/24")).toBe(false);
	});

	test("rejects an IPv6 address", () => {
		expect(inCidr("2001:db8::1", "192.0.2.0/24")).toBe(false);
	});
});

describe("inCidrAny", () => {
	test("matches an IP in a single-element list", () => {
		expect(inCidrAny("192.0.2.10", "192.0.2.0/24")).toBe(true);
	});

	test("rejects an IP outside a single-element list", () => {
		expect(inCidrAny("192.0.3.10", "192.0.2.0/24")).toBe(false);
	});

	test("matches an IP in the first CIDR of a comma-separated list", () => {
		expect(inCidrAny("192.0.2.10", "192.0.2.0/24, 10.0.0.0/8")).toBe(true);
	});

	test("matches an IP in a later CIDR of a comma-separated list", () => {
		expect(inCidrAny("10.1.2.3", "192.0.2.0/24, 10.0.0.0/8")).toBe(true);
	});

	test("rejects an IP outside all CIDRs in a comma-separated list", () => {
		expect(inCidrAny("8.8.8.8", "192.0.2.0/24, 10.0.0.0/8")).toBe(false);
	});

	test("rejects an invalid IP", () => {
		expect(inCidrAny("not-an-ip", "192.0.2.0/24")).toBe(false);
	});

	test("returns false for an empty list", () => {
		expect(inCidrAny("192.0.2.10", "")).toBe(false);
	});

	test("returns false for an IPv6 IP even with multiple CIDRs", () => {
		expect(inCidrAny("2001:db8::1", "192.0.2.0/24, 10.0.0.0/8")).toBe(false);
	});

	test("tolerates surrounding whitespace and mixed separators", () => {
		expect(inCidrAny("192.0.2.10", " 192.0.2.0/24 , 10.0.0.0/8 ")).toBe(true);
	});
});
```

- [ ] **Step 2: テストを実行して `inCidrAny` 未定義で失敗することを確認**

Run:
```bash
bun test src/libs/inCidr.test.ts
```

Expected: `inCidrAny` がまだ export されていないため、 bun:test が `SyntaxError: Export named 'inCidrAny' not found in module './inCidr'` のような import エラーで失敗する。

- [ ] **Step 3: `src/libs/inCidr.ts` に `inCidrAny` を追加**

`src/libs/inCidr.ts` の末尾に以下を追記する(既存 import / 関数は変更しない)。

```ts
export function inCidrAny(ip: string, cidrList: string): boolean {
	const cidrs = cidrList.split(/[,\s]+/).filter((c) => c.length > 0);
	if (cidrs.length === 0) return false;
	return cidrs.some((cidr) => inCidr(ip, cidr));
}
```

- [ ] **Step 4: テストを実行して全件パスすることを確認**

Run:
```bash
bun test src/libs/inCidr.test.ts
```

Expected: 全テスト PASS。

- [ ] **Step 5: lint / typecheck を確認**

Run:
```bash
bun run lint
bun run typecheck
```

Expected: エラー 0 件。

- [ ] **Step 6: コミット**

```bash
git add src/libs/inCidr.ts src/libs/inCidr.test.ts
git commit -m "feat(libs): add inCidrAny for comma-separated CIDR lists"
```

---

## Task 2: `/join` ページの実装

**Files:**
- Create: `src/pages/join/index.astro`

- [ ] **Step 1: `src/pages/join/index.astro` を作成**

```astro
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
  <main class="relative grid gap-8 p-8">
    <h1 class="font-orbitron text-4xl font-bold">Join</h1>

    {allowed ? (
      <section class="grid gap-4">
        <p>学内ネットワークからのアクセスのため、招待リンクを表示しています。</p>
        <a
          class="btn btn-primary w-fit"
          href={`https://discord.gg/${DISCORD_INVITE}`}
          rel="noopener noreferrer"
        >
          Discord に参加
        </a>
        <p class="text-sm opacity-70">
          学外からアクセスしている場合は
          <a href="/join/manual" class="link link-secondary">/join/manual</a>
          をご覧ください。
        </p>
      </section>
    ) : (
      <section class="grid gap-4">
        <p>
          学外ネットワークからのアクセスのため、招待リンクを表示できません。
        </p>
        <p>
          東京農工大学の学内ネットワークからアクセスしてください。
        </p>
        <a class="btn btn-primary w-fit" href="/join/manual">/join/manual を見る</a>
      </section>
    )}
  </main>
</GlobalLayout>
```

- [ ] **Step 2: dev サーバで動作確認**

Run:
```bash
bun run dev
```

別のターミナルで:
```bash
curl -s http://localhost:4321/join | grep -E "Discord に参加|/join/manual"
```

Expected: いずれかが少なくとも 1 回マッチする(dev では `allowed === true` なので「Discord に参加」が出る)。`view-source:http://localhost:4321/join` をブラウザで開き、招待ボタンが見えていること。

- [ ] **Step 3: ビルドが SSR 設定で通ることを確認**

Run:
```bash
bun run build
```

Expected: ビルド成功。Cloudflare Workers 用の出力に `join/index.astro` が SSR 対象として含まれる。

- [ ] **Step 4: typecheck / lint**

Run:
```bash
bun run typecheck
bun run lint
```

Expected: エラー 0 件。

- [ ] **Step 5: コミット**

```bash
git add src/pages/join/index.astro
git commit -m "feat(pages): add /join page with IP-gated Discord invite"
```

---

## Task 3: プレビュー環境でマッチ / 非マッチ両方を確認

**Files:** なし(検証のみ)

- [ ] **Step 1: `.env` または wrangler secret に `TUAT_CIDR` / `DISCORD_INVITE` を設定**

`wrangler secret` を使う場合:
```bash
bunx wrangler secret put TUAT_CIDR
# プロンプトにカンマ区切り CIDR を入力
bunx wrangler secret put DISCORD_INVITE
# プロンプトに Discord 招待コードを入力
```

ローカルプレビュー用に `.dev.vars` を使う場合は、リポジトリの `.gitignore` に含まれていることを確認してから:
```bash
cat > .dev.vars <<EOF
TUAT_CIDR=192.0.2.0/24
DISCORD_INVITE=example
EOF
```

- [ ] **Step 2: プレビューサーバを起動**

Run:
```bash
bun run preview
```

Expected: `wrangler dev --assets=./dist` が起動し、Workers 互換のローカル URL が表示される。

- [ ] **Step 3: マッチする IP を模してリクエスト**

Run:
```bash
curl -s -H "CF-Connecting-IP: 192.0.2.10" http://localhost:8787/join | grep -E "discord.gg|/join/manual"
```

Expected: `discord.gg/example` のような招待 URL がレスポンスに含まれる。

- [ ] **Step 4: マッチしない IP を模してリクエスト**

Run:
```bash
curl -s -H "CF-Connecting-IP: 8.8.8.8" http://localhost:8787/join | grep -E "discord.gg|/join/manual"
```

Expected: `discord.gg` を含まず、`/join/manual` への誘導リンクが含まれる。

- [ ] **Step 5: 環境変数の秘匿確認(本番デプロイ前のみ)**

`wrangler.jsonc` / `astro.config.ts` 双方に `TUAT_CIDR` / `DISCORD_INVITE` が `secret` 指定されていることを再確認(既存設定で OK)。クライアント用 bundle に値が漏れていないことを `git grep` で念のため確認:

Run:
```bash
git grep -n DISCORD_INVITE src/
```

Expected: `src/pages/join/index.astro` 以外には現れない(SSR 専用であり、client 用に import されていない)。

- [ ] **Step 6: コミット(必要なら)**

`.dev.vars` を作成した場合、コミットに含めず(`.gitignore` 対象)プレビュー用に残す。新規ファイルが無ければコミットも不要。

---

## 完了チェックリスト

- [ ] `bun test src/libs/inCidr.test.ts` 全件 PASS
- [ ] `bun run typecheck` エラー 0 件
- [ ] `bun run lint` エラー 0 件
- [ ] `bun run build` 成功
- [ ] dev で `/join` に Discord ボタンが表示される
- [ ] プレビューで CIDR 内 IP → 招待リンク、CIDR 外 IP → manual 誘導
- [ ] 既存の `/join/manual` ページが壊れていない
