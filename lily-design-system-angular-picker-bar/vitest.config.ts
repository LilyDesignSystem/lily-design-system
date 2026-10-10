import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";
import angular from "@analogjs/vite-plugin-angular";

// Standalone test harness for @lilydesignsystem/angular-picker-bar.
export default defineConfig({
  plugins: [angular()],
  resolve: {
    // A sibling subproject's built dist/ (aliased below) resolves Angular
    // and rxjs from its own node_modules; dedupe so one runtime serves both.
    dedupe: ["@angular/core", "@angular/common", "rxjs"],
    alias: {
      // Each @lilydesignsystem dependency (direct or transitive) is a
      // regular npm `dependency`, resolved from the registry once published.
      // For local dev/test these aliases point the bare specifiers at the
      // sibling top-level subproject's ng-packagr output instead, so build
      // those first (bin/list-helper-packages angular prints the order).
      "@lilydesignsystem/angular-headless": fileURLToPath(
        new URL("../lily-design-system-angular-headless/dist/fesm2022/lilydesignsystem-angular-headless.mjs", import.meta.url),
      ),
      "@lilydesignsystem/angular-link-picker": fileURLToPath(
        new URL("../lily-design-system-angular-link-picker/dist/fesm2022/lilydesignsystem-angular-link-picker.mjs", import.meta.url),
      ),
      "@lilydesignsystem/angular-locale-picker": fileURLToPath(
        new URL("../lily-design-system-angular-locale-picker/dist/fesm2022/lilydesignsystem-angular-locale-picker.mjs", import.meta.url),
      ),
      "@lilydesignsystem/angular-search-picker": fileURLToPath(
        new URL("../lily-design-system-angular-search-picker/dist/fesm2022/lilydesignsystem-angular-search-picker.mjs", import.meta.url),
      ),
      "@lilydesignsystem/angular-share-picker": fileURLToPath(
        new URL("../lily-design-system-angular-share-picker/dist/fesm2022/lilydesignsystem-angular-share-picker.mjs", import.meta.url),
      ),
      "@lilydesignsystem/angular-text-size-picker": fileURLToPath(
        new URL("../lily-design-system-angular-text-size-picker/dist/fesm2022/lilydesignsystem-angular-text-size-picker.mjs", import.meta.url),
      ),
      "@lilydesignsystem/angular-theme-picker": fileURLToPath(
        new URL("../lily-design-system-angular-theme-picker/dist/fesm2022/lilydesignsystem-angular-theme-picker.mjs", import.meta.url),
      ),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest-setup.ts"],
    include: ["**/*.spec.ts"],
    exclude: ["node_modules/**", "dist/**"],
  },
});
