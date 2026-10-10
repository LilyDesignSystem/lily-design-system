import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

// Standalone test harness for @lilydesignsystem/vue-picker-bar.
export default defineConfig({
  plugins: [vue()],
  resolve: {
    // A sibling subproject's built dist/ (aliased below) resolves vue from
    // its own node_modules; dedupe so one Vue runtime serves both.
    dedupe: ["vue"],
    alias: {
      // Each @lilydesignsystem dependency (direct or transitive) is a
      // regular npm `dependency`, resolved from the registry once published.
      // For local dev/test these aliases point the bare specifiers at the
      // sibling top-level subproject's built dist/ instead, so build those
      // first (bin/list-helper-packages vue prints the order).
      "@lilydesignsystem/vue-headless": fileURLToPath(
        new URL("../lily-design-system-vue-headless/dist/index.mjs", import.meta.url),
      ),
      "@lilydesignsystem/vue-link-picker": fileURLToPath(
        new URL("../lily-design-system-vue-link-picker/dist/index.js", import.meta.url),
      ),
      "@lilydesignsystem/vue-locale-picker": fileURLToPath(
        new URL("../lily-design-system-vue-locale-picker/dist/index.js", import.meta.url),
      ),
      "@lilydesignsystem/vue-search-picker": fileURLToPath(
        new URL("../lily-design-system-vue-search-picker/dist/index.js", import.meta.url),
      ),
      "@lilydesignsystem/vue-share-picker": fileURLToPath(
        new URL("../lily-design-system-vue-share-picker/dist/index.js", import.meta.url),
      ),
      "@lilydesignsystem/vue-text-size-picker": fileURLToPath(
        new URL("../lily-design-system-vue-text-size-picker/dist/index.js", import.meta.url),
      ),
      "@lilydesignsystem/vue-theme-picker": fileURLToPath(
        new URL("../lily-design-system-vue-theme-picker/dist/index.js", import.meta.url),
      ),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest-setup.js"],
    include: ["**/*.test.ts"],
    exclude: ["node_modules/**", "dist/**"],
  },
});
