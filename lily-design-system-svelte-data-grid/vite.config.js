import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { svelteTesting } from "@testing-library/svelte/vite";

// Standalone test harness for @lilydesignsystem/svelte-data-grid.
export default defineConfig({
  plugins: [svelte(), svelteTesting()],
  resolve: {
    alias: {
      // DataGrid depends on the headless catalog's DataTable family as a
      // regular npm `dependency`, resolved from the registry once
      // published. For local dev/test this alias points the bare
      // specifier at the sibling top-level headless catalog's built
      // `dist/` instead. Not read by svelte-package: the published dist
      // keeps the bare import, which real installs resolve normally.
      "@lilydesignsystem/svelte-headless": fileURLToPath(
        new URL("../lily-design-system-svelte-headless/dist/index.js", import.meta.url),
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
