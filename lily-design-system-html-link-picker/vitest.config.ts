import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";

// Standalone test harness for @lilydesignsystem/html-link-picker.
export default defineConfig({
  resolve: {
    alias: {
      // Each @lilydesignsystem dependency (direct or transitive) is a
      // regular npm `dependency`, resolved from the registry once published.
      // For local dev/test these aliases point the bare specifiers at the
      // sibling top-level subproject instead: a helper package's built
      // dist/ (build those first; bin/list-helper-packages html prints the
      // order), or the headless library's source file, which needs no build.

    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest-setup.ts"],
    include: ["**/*.test.ts"],
    exclude: ["node_modules/**", "dist/**"],
  },
});
