import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";

// Standalone test harness for @lilydesignsystem/web-components-picker-bar.
export default defineConfig({
  resolve: {
    alias: {
      // Each @lilydesignsystem dependency (direct or transitive) is a
      // regular npm `dependency`, resolved from the registry once published.
      // For local dev/test these aliases point the bare specifiers at the
      // sibling top-level subproject instead: a helper package's built
      // dist/ (build those first; bin/list-helper-packages web-components prints the
      // order), or the headless library's built dist/.
      "@lilydesignsystem/web-components-headless": fileURLToPath(new URL("../lily-design-system-web-components-headless/dist/index.js", import.meta.url)),
      "@lilydesignsystem/web-components-link-picker": fileURLToPath(new URL("../lily-design-system-web-components-link-picker/dist/index.js", import.meta.url)),
      "@lilydesignsystem/web-components-locale-picker": fileURLToPath(new URL("../lily-design-system-web-components-locale-picker/dist/index.js", import.meta.url)),
      "@lilydesignsystem/web-components-search-picker": fileURLToPath(new URL("../lily-design-system-web-components-search-picker/dist/index.js", import.meta.url)),
      "@lilydesignsystem/web-components-share-picker": fileURLToPath(new URL("../lily-design-system-web-components-share-picker/dist/index.js", import.meta.url)),
      "@lilydesignsystem/web-components-text-size-picker": fileURLToPath(new URL("../lily-design-system-web-components-text-size-picker/dist/index.js", import.meta.url)),
      "@lilydesignsystem/web-components-theme-picker": fileURLToPath(new URL("../lily-design-system-web-components-theme-picker/dist/index.js", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest-setup.ts"],
    include: ["**/*.test.ts"],
    exclude: ["node_modules/**", "dist/**"],
  },
});
