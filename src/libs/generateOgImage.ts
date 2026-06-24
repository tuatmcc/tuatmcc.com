import type { CollectionEntry } from "astro:content";
import { OgImage } from "@components/react/OgImage";
import { initWasm, Resvg } from "@resvg/resvg-wasm";
import RESVG_WASM_URL from "@resvg/resvg-wasm/index_bg.wasm?url";
import fontDataUrl from "../assets/og/ZenKakuGothicNew-Bold.ttf?inline";
import { createElement } from "react";
import satori from "satori";

const resolveResvgWasm = async () => {
  if (!import.meta.env.SSR) {
    return RESVG_WASM_URL;
  }

  const [{ readFile }, { join }] = await Promise.all([
    import("node:fs/promises"),
    import("node:path"),
  ]);

  const fileName = RESVG_WASM_URL.split("/").pop();
  if (!fileName) {
    throw new Error("Could not derive resvg wasm filename from URL");
  }
  const candidates = [
    join(process.cwd(), "dist/client/_astro", fileName),
    join(process.cwd(), "dist/server/.prerender/_astro", fileName),
    join(process.cwd(), "dist/server/_astro", fileName),
  ];
  for (const path of candidates) {
    try {
      return await readFile(path);
    } catch {}
  }
  throw new Error(`resvg wasm not found in any of: ${candidates.join(", ")}`);
};

await initWasm(resolveResvgWasm());

const dataUrlToArrayBuffer = (dataUrl: string): ArrayBuffer => {
  const base64 = dataUrl.split(",")[1];
  if (!base64) {
    throw new Error("Invalid inline font data URL");
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};

const font = dataUrlToArrayBuffer(fontDataUrl);

export const generateOgImage = async (
  post: CollectionEntry<"posts">,
): Promise<Uint8Array> => {
  const svg = await satori(createElement(OgImage, { title: post.data.title }), {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "Zen Kaku Gothic New",
        data: font,
        weight: 700,
        style: "normal",
      },
    ],
  });

  const png = new Resvg(svg).render().asPng();
  return png;
};
