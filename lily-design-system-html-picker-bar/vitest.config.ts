import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";

// Standalone test harness for @lilydesignsystem/html-picker-bar.
export default defineConfig({
  resolve: {
    alias: {
      // Each @lilydesignsystem dependency (direct or transitive) is a
      // regular npm `dependency`, resolved from the registry once published.
      // For local dev/test these aliases point the bare specifiers at the
      // sibling top-level subproject instead: a helper package's built
      // dist/ (build those first; bin/list-helper-packages html prints the
      // order), or the headless library's source file, which needs no build.
      "@lilydesignsystem/html-headless/components/listbox-controller.js": fileURLToPath(new URL("../lily-design-system-html-headless/components/listbox-controller.js", import.meta.url)),
      "@lilydesignsystem/html-link-picker": fileURLToPath(new URL("../lily-design-system-html-link-picker/dist/index.js", import.meta.url)),
      "@lilydesignsystem/html-locale-picker": fileURLToPath(new URL("../lily-design-system-html-locale-picker/dist/index.js", import.meta.url)),
      "@lilydesignsystem/html-search-picker": fileURLToPath(new URL("../lily-design-system-html-search-picker/dist/index.js", import.meta.url)),
      "@lilydesignsystem/html-share-picker": fileURLToPath(new URL("../lily-design-system-html-share-picker/dist/index.js", import.meta.url)),
      "@lilydesignsystem/html-text-size-picker": fileURLToPath(new URL("../lily-design-system-html-text-size-picker/dist/index.js", import.meta.url)),
      "@lilydesignsystem/html-theme-picker": fileURLToPath(new URL("../lily-design-system-html-theme-picker/dist/index.js", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest-setup.ts"],
    include: ["**/*.test.ts"],
    exclude: ["node_modules/**", "dist/**"],
  },
});
