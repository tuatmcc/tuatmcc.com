# tuatmcc.com

## 概要

MCC のホームページ.

- [Astro](https://astro.build/)
- [Bun](https://bun.sh/)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/).

## ロードマップ

- [x] マークダウン記事 (→ [コンテンツ専用リポジトリ](https://github.com/tuatmcc/hp-md-content))
- [x] 旧サイトからのリダイレクト
- [x] 部内講習資料
- [ ] CMS

## Setup

Clone repo and install bun with `mise`.

```sh
mise trust
mise install
```

## Development

- Launch the development server

```sh
bun dev
```

- Build the project

```sh
bun run build
```

- Run format

```sh
bun format
```

- Run type checks

```sh
bun typecheck
```
