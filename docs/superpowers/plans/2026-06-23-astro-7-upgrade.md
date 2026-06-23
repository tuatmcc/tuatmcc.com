# Astro 7 アップグレード実装プラン

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Astro 6.x を 7.x へメジャーアップグレードし、`@astrojs/*` および `astro-*` パッケージを Astro 7 互換のバージョンへ更新する。`bun run typecheck` と `bun run lint` をパスさせる。

**Architecture:** Astro 公式の `astro upgrade` CLI を使って codemod と依存更新を一括で適用する。codemod が生成した差分を確認し、`astro.config.ts` などの設定ファイルを必要に応じて手動修正する。最後に型チェックとリントで検証する。

**Tech Stack:** Astro 7, bun 1.2.18, Node 22.16.0, TypeScript 6, Biome 2, Prettier 3

**Spec:** `docs/superpowers/specs/2026-06-23-astro-7-upgrade-design.md`

---

## ファイル変更サマリ

| ファイル | 操作 | 役割 |
| --- | --- | --- |
| `package.json` | 変更 | Astro 関連パッケージのバージョンを更新 |
| `bun.lock` | 変更 | lockfile を Astro 7 系で再生成 |
| `astro.config.ts` | 変更 (可能性) | deprecated 設定の置換 |
| `src/**/*.astro` | 変更 (可能性) | codemod が生成する API 置換 |
| `src/**/*.ts(x)` | 変更 (可能性) | codemod が生成する API 置換 |
| `src/content/**` | 変更 (可能性) | Content Collection API の置換 |

---

## Task 1: 事前コミットで現状を保全

**Files:**
- (なし / `git commit` のみ)

- [ ] **Step 1: 作業ディレクトリの状態を確認**

```bash
git status
```

期待: `nothing to commit, working tree clean` (もしくは未コミット変更をコミット)

- [ ] **Step 2: 未コミットの変更があればコミット**

未コミット変更がある場合:

```bash
git add -A
git commit -m "chore: pre-astro-7-upgrade snapshot"
```

期待: `refactor` ブランチ上にクリーンな状態ができる。

- [ ] **Step 3: アップグレード前のバージョンを確認**

```bash
grep -E '"(astro|@astrojs/[a-z-]+|astro-[a-z-]+)"' package.json
```

期待: 現在のバージョン (`astro: ^6.3.7` など) が出力される。後で diff を取るために控えておく。

---

## Task 2: `astro upgrade` 実行

**Files:**
- 変更: `package.json`, `bun.lock`, `astro.config.ts`, `src/**` (codemod が触る)

- [ ] **Step 1: アップグレード CLI を実行**

```bash
bun x astro@latest upgrade
```

期待: Astro が `@astrojs/*` と `astro-*` を検出し、最新版へ更新する対話的フローが走る。

- [ ] **Step 2: プロンプトに回答**

codemod が提示する選択肢 (codemod を実行するか / 設定ファイル形式を維持するか など) にはデフォルトで `Yes` を選び、すべてのマイグレーションを適用する。

- [ ] **Step 3: 差分を確認**

```bash
git status
git diff --stat
```

期待: `package.json` / `bun.lock` / `astro.config.ts` / `src/**` のいずれかに変更が入っている。意図しないファイルが大きく書き換わっていないか目視で確認する。

---

## Task 3: 依存をインストール

**Files:**
- 変更: `node_modules/**` (lockfile 変更に伴う)

- [ ] **Step 1: bun install を実行**

```bash
bun install
```

期待: peer dependency 警告が出ないか、または出ても致命的でない。

- [ ] **Step 2: peer 警告を確認**

致命的な peer 警告 (例: `@astrojs/react@7` requires `react@^19` だが入っていない) があれば、対応するバージョンを `package.json` で明示する。今回のスコープでは React 19 は既に導入済みのため問題ないはず。

---

## Task 4: 型チェック

**Files:**
- 変更 (可能性): `src/**` および `astro.config.ts`

- [ ] **Step 1: typecheck を実行**

```bash
bun run typecheck
```

期待: エラーなし。`astro check` が型エラーを報告する場合がある。

- [ ] **Step 2: エラーが出た場合は手動修正**

エラーメッセージに従い、該当するファイル・行を修正する。典型的な修正:
- 削除済み API の呼び出しを新しい API へ置換
- 型定義の不整合 (Astro 7 で型が変更されているケース)
- `astro.config.ts` の設定値置換

- [ ] **Step 3: 再度 typecheck を実行し、エラーがないことを確認**

```bash
bun run typecheck
```

期待: エラーなしで完了。

---

## Task 5: リント

**Files:**
- 変更 (可能性): `src/**` (Biome / Prettier の自動修正による)

- [ ] **Step 1: lint を実行**

```bash
bun run lint
```

期待: エラーなし。Biome と Prettier の両方がチェックする。

- [ ] **Step 2: エラーが出た場合は format を実行**

```bash
bun run format
```

期待: 自動修正可能なものが解消される。

- [ ] **Step 3: 再度 lint を実行し、エラーがないことを確認**

```bash
bun run lint
```

期待: エラーなしで完了。

---

## Task 6: バージョンを確認

**Files:**
- (なし / 確認のみ)

- [ ] **Step 1: 対象パッケージのバージョンが 7 系 (または Astro 7 互換) であることを確認**

```bash
grep -E '"(astro|@astrojs/[a-z-]+|astro-[a-z-]+)"' package.json
```

期待: `astro` のバージョンが `^7.x` で始まり、各 `@astrojs/*` / `astro-*` が v7 互換の最新。

---

## Task 7: コミット

**Files:**
- 変更: すべての変更ファイル

- [ ] **Step 1: 差分全体をステージング**

```bash
git add -A
```

- [ ] **Step 2: コミット**

```bash
git commit -m "deps: upgrade astro 7 and @astrojs/* integrations"
```

期待: 1 つのコミットにまとめられる。

---

## Task 8: 最終確認

**Files:**
- (なし / 確認のみ)

- [ ] **Step 1: コミットログを確認**

```bash
git log --oneline -5
```

期待: 直近のコミットが `deps: upgrade astro 7 and @astrojs/* integrations` になっている。

- [ ] **Step 2: 作業ツリーがクリーンであることを確認**

```bash
git status
```

期待: `nothing to commit, working tree clean`。

---

## 成功基準 (Success Criteria)

- `bun run typecheck` がエラーなしで完了する
- `bun run lint` がエラーなしで完了する
- `package.json` の `astro` が `^7.x`、各 `@astrojs/*` / `astro-*` が Astro 7 互換
- `refactor` ブランチに 1 つのアップグレードコミットが積まれている

## スコープ外 (Out of Scope)

- React / TypeScript / Tailwind / Biome / motion / daisyui などの他メジャー
- `astro build` および `wrangler dev` によるビルド・Cloudflare デプロイ検証
- パフォーマンス計測、Lighthouse スコアの確認

## ロールバック

```bash
git revert HEAD       # アップグレードコミットを打ち消す
# または
git reset --hard HEAD~1   # アップグレード前の状態へ戻す (force push が必要)
```
