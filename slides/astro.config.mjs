// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import restart from "vite-plugin-restart";

export default defineConfig({
  site: "https://cogapplabs.github.io",
  base: "/claude-at-cogapp",
  trailingSlash: "ignore",
  integrations: [mdx()],
  vite: {
    plugins: [
      tailwindcss(),
      restart({
        restart: [
          "src/content/order.ts",
          "src/content/slides/**/*.mdx",
        ],
      }),
    ],
  },
  markdown: {
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark" },
      defaultColor: "light",
      wrap: false,
    },
  },
});
