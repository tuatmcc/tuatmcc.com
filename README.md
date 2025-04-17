<img align="center" src="./public/images/wordmark-logo.svg" width="100%" >

<p align="center">
  <img alt="GitHub branch check runs" src="https://img.shields.io/github/check-runs/tuatmcc/tuatmcc.com/main?style=flat&label=deploy&link=https%3A%2F%2Ftuatmcc.com">
  <img src="https://img.shields.io/github/languages/code-size/tuatmcc/homepage2.0?style=flat-square)](https://github.com/tuatmcc/homepage2.0">
  <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/tuatmcc/tuatmcc.com">
  <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/tuatmcc/tuatmcc.com">
</p>

<h1 align="center">tuatmcc.com</h1>


## 環境構築

### nix-direnv の場合

```sh
echo 'use flake' > .envrc
direnv allow
bun install
```

### mise の場合

```sh
mise install
bun install
```

## 開発

```sh
bun dev
```

```sh
bun build
```

```sh
bun preview
```

```sh
bun lint
```

```sh
bun fmt
```

## 関連リンク

- [tuatmcc/hp-md-content](https://github.com/tuatmcc/hp-md-content)
- [記事の書き方](https://www.tuatmcc.com/blog/2023-01-adding-articles)

