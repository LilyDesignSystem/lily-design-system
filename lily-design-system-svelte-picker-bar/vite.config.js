import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { svelteTesting } from "@testing-library/svelte/vite";

// Standalone test harness for @lilydesignsystem/svelte-picker-bar.
export default defineConfig({
  plugins: [svelte(), svelteTesting()],
  resolve: {
    alias: {
      // Each @lilydesignsystem dependency is a regular npm `dependency`,
      // resolved from the registry once published. For local dev/test
      // these aliases point the bare specifiers at the sibling top-level
      // subproject's built `dist/` instead, so build those first. Not read
      // by svelte-package: the published dist keeps the bare imports.
      "@lilydesignsystem/svelte-link-picker": fileURLToPath(
        new URL("../lily-design-system-svelte-link-picker/dist/index.js", import.meta.url),
      ),
      "@lilydesignsystem/svelte-locale-picker": fileURLToPath(
        new URL("../lily-design-system-svelte-locale-picker/dist/index.js", import.meta.url),
      ),
      "@lilydesignsystem/svelte-search-picker": fileURLToPath(
        new URL("../lily-design-system-svelte-search-picker/dist/index.js", import.meta.url),
      ),
      "@lilydesignsystem/svelte-share-picker": fileURLToPath(
        new URL("../lily-design-system-svelte-share-picker/dist/index.js", import.meta.url),
      ),
      "@lilydesignsystem/svelte-text-size-picker": fileURLToPath(
        new URL("../lily-design-system-svelte-text-size-picker/dist/index.js", import.meta.url),
      ),
      "@lilydesignsystem/svelte-theme-picker": fileURLToPath(
        new URL("../lily-design-system-svelte-theme-picker/dist/index.js", import.meta.url),
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
