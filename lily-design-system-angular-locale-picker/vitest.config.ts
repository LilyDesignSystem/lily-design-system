import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";
import angular from "@analogjs/vite-plugin-angular";

// Standalone test harness for @lilydesignsystem/angular-locale-picker.
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
