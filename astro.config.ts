import cloudflare from "@astrojs/cloudflare";
import partytown from "@astrojs/partytown";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField, fontProviders } from "astro/config";
import expressiveCode from "astro-expressive-code";
import icon from "astro-icon";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import remarkNormalizeHeadings from "remark-normalize-headings";
import remarkToc from "remark-toc";

// https://astro.build/config
export default defineConfig({
  site: "https://tuatmcc.com",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    react({
      include: ["**/react/**"],
    }),
    icon(),
    partytown(),
    expressiveCode({
      themes: ["github-light", "github-dark"],
    }),
  ],
  markdown: {
    gfm: true,
    remarkPlugins: [remarkToc, remarkNormalizeHeadings, remarkMath],
    rehypePlugins: [rehypeKatex],
  },
  image: {
    // layout: "constrained",
  },
  adapter: cloudflare({
    imageService: "passthrough",
    prerenderEnvironment: "node",
  }),
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Orbitron",
      weights: ["500", "700"], // medium, bold
      cssVariable: "--font-family-orbitron",
    },
  ],
  env: {
    schema: {
      GOOGLE_ANALYTICS_ID: envField.string({
        context: "client",
        access: "public",
        optional: true,
      }),
      DISCORD_INVITE: envField.string({
        context: "server",
        access: "secret",
        optional: false,
      }),
      TUAT_CIDR: envField.string({
        context: "server",
        access: "secret",
        optional: false,
      }),
    },
  },
});
