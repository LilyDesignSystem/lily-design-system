import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";

// Standalone test harness for @lilydesignsystem/nunjucks-theme-picker.
export default defineConfig({
  resolve: {
    alias: {
      // Each @lilydesignsystem client-script dependency (direct or
      // transitive) is a regular npm `dependency`, resolved from the
      // registry once published. For local dev/test these aliases point the
      // bare specifiers at the sibling top-level subproject's built dist/
      // instead, so build those first (bin/list-helper-packages nunjucks).
      // Templates are found separately, through the Nunjucks search paths
      // the tests configure (the repository root holds every sibling).
      "@lilydesignsystem/nunjucks-listbox-behavior": fileURLToPath(new URL("../lily-design-system-nunjucks-listbox-behavior/dist/index.js", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    setupFiles: ["./vitest-setup.ts"],
    include: ["**/*.test.ts"],
    exclude: ["node_modules/**", "dist/**"],
  },
});
