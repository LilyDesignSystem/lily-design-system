import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// Serves e2e/harness/ for the Playwright suite (see playwright.config.ts).
export default defineConfig({
  root: fileURLToPath(new URL("./e2e/harness", import.meta.url)),
  plugins: [svelte()],
  server: { fs: { allow: [fileURLToPath(new URL("..", import.meta.url))] } },
  resolve: {
    alias: {
      "@lilydesignsystem/svelte-headless": fileURLToPath(
        new URL("../lily-design-system-svelte-headless/dist/index.js", import.meta.url),
      ),
    },
  },
});
