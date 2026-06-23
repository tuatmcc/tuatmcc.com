# Astro 7 へのアップグレード

## 概要

Astro を 6.x から最新の 7.x へメジャーアップグレードする。Astro 公式の codemod
を用いて機械的にマイグレーション可能な変更を適用し、残りは手動で修正する。

## 対象範囲 (Scope)

Astro 関連パッケージのみを更新する。React 19、TypeScript 6、Tailwind 4、Biome 2、
motion、daisyui 5 などの他の依存は今回スコープ外。

### 対象パッケージ

| パッケージ         | 現在      | ターゲット       |
| ------------------ | --------- | ---------------- |
| `astro`            | `^6.3.7`  | `^7.x` (最新)    |
| `@astrojs/cloudflare` | `^13.5.4` | v7 互換の最新 |
| `@astrojs/mdx`     | `^5.0.6`  | v7 互換の最新    |
| `@astrojs/partytown` | `^2.1.4` | v7 互換の最新   |
| `@astrojs/react`   | `^5.0.5`  | v7 互換の最新    |
| `@astrojs/check`   | `^0.9.4`  | v7 互換の最新    |
| `astro-expressive-code` | `^0.41.3` | v7 互換の最新 |
| `astro-icon`       | `^1.1.5`  | v7 互換の最新    |

### スコープ外

- React 19 / TypeScript 6 / Tailwind 4 / Biome 2 などの他メジャー
- `motion`, `daisyui`, `satori`, `simple-git` 等の周辺パッケージ
- ビルド検証 (`astro build`) と Cloudflare デプロイ検証 (`wrangler dev`)

## 前提

- 作業ブランチ: 既存の `refactor` ブランチをそのまま使用する (新規 worktree は作らない)
- パッケージマネージャ: bun (`bun.lock` を更新)
- 言語環境: bun 1.2.18 / Node 22.16.0 (mise 管理)

## アップグレード手順

1. **事前コミット** — アップグレード前の状態を 1 コミットにまとめておき、問題時に
   `git revert` で戻せるようにする。
2. **codemod 実行** — `bun x astro@latest upgrade` を実行し、Astro 公式 codemod を
   適用する。codemod が提示する差分を確認し、コードベースへ自動変換を反映する。
3. **手動修正** — codemod で対応できない破壊的変更は
   [Astro 7 マイグレーションガイド](https://docs.astro.build/en/guides/upgrade-to/v7/)
   を参照しながら手動で修正する。
4. **依存更新** — `bun install` を実行し、`bun.lock` を更新する。
5. **検証**
   - `bun run typecheck` (`astro check`) で型エラーがないこと
   - `bun run lint` (`biome check . && prettier --check .`) でリントエラーがないこと
   - `bun run format` で整形可能な状態を保つ

## 変更が予想される箇所

- `package.json` — 上記パッケージのバージョン番号
- `bun.lock` — lockfile の更新
- `astro.config.ts` — v7 で deprecated になった設定値の置換 (例: `image` 設定の
  構造変更、`envField` のオプション変更など)
- `src/**/*.astro` — Astro コンポーネントの API 変更に伴う修正
- `src/content/**` — Content Collection 関連 API の変更
- `src/**/*.ts(x)` — codemod が適用する API 置換

## ロールバック計画

- codemod 適用前のコミットを保持し、`git revert` で巻き戻せるようにする
- 必要に応じて `git restore .` で作業ツリーを元に戻し、
  `git checkout package.json bun.lock` で lockfile を復元する

## 成功基準

- `bun run typecheck` がエラーなく完了する
- `bun run lint` がエラーなく完了する
- `package.json` の対象パッケージが Astro 7 系に更新されている

## リスクと緩和

| リスク                                      | 緩和策                                                                |
| ------------------------------------------- | --------------------------------------------------------------------- |
| codemod が既存コードに想定外の変換を行う    | 適用前コミット、差分を手動レビュー                                    |
| 統合パッケージの peer dependency 不整合     | codemod 後に `bun install` し、peer 警告を解消                        |
| `astro.config.ts` の API 変更による起動失敗 | 設定変更後に `astro check` および `tsc` 相当の型チェックで確認        |
| 検証スコープ外 (build/deploy) の回帰        | 今回の検証範囲外として明示。後続タスクで別途対応する                  |
