import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { svelteTesting } from "@testing-library/svelte/vite";

// Standalone test harness for @lilydesignsystem/svelte-gantt-chart.
export default defineConfig({
  plugins: [svelte(), svelteTesting()],
  resolve: {
    alias: {
      // Each @lilydesignsystem dependency is a regular npm `dependency`,
      // resolved from the registry once published. For local dev/test
      // these aliases point the bare specifiers at the sibling top-level
      // subproject's built `dist/` instead, so build those first. Not read
      // by svelte-package: the published dist keeps the bare imports.
      "@lilydesignsystem/svelte-date-time-picker": fileURLToPath(
        new URL("../lily-design-system-svelte-date-time-picker/dist/index.js", import.meta.url),
      ),
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
