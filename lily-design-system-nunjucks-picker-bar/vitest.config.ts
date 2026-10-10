import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";

// Standalone test harness for @lilydesignsystem/nunjucks-picker-bar.
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
      "@lilydesignsystem/nunjucks-link-picker": fileURLToPath(new URL("../lily-design-system-nunjucks-link-picker/dist/index.js", import.meta.url)),
      "@lilydesignsystem/nunjucks-listbox-behavior": fileURLToPath(new URL("../lily-design-system-nunjucks-listbox-behavior/dist/index.js", import.meta.url)),
      "@lilydesignsystem/nunjucks-locale-picker": fileURLToPath(new URL("../lily-design-system-nunjucks-locale-picker/dist/index.js", import.meta.url)),
      "@lilydesignsystem/nunjucks-search-picker": fileURLToPath(new URL("../lily-design-system-nunjucks-search-picker/dist/index.js", import.meta.url)),
      "@lilydesignsystem/nunjucks-share-picker": fileURLToPath(new URL("../lily-design-system-nunjucks-share-picker/dist/index.js", import.meta.url)),
      "@lilydesignsystem/nunjucks-text-size-picker": fileURLToPath(new URL("../lily-design-system-nunjucks-text-size-picker/dist/index.js", import.meta.url)),
      "@lilydesignsystem/nunjucks-theme-picker": fileURLToPath(new URL("../lily-design-system-nunjucks-theme-picker/dist/index.js", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    setupFiles: ["./vitest-setup.ts"],
    include: ["**/*.test.ts"],
    exclude: ["node_modules/**", "dist/**"],
  },
});
