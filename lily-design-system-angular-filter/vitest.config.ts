import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";
import angular from "@analogjs/vite-plugin-angular";

// Standalone test harness for @lilydesignsystem/angular-filter.
export default defineConfig({
  plugins: [angular()],
  resolve: {
    // A sibling subproject's built dist/ (aliased below) resolves Angular
    // and rxjs from its own node_modules; dedupe so one runtime serves both.
    dedupe: ["@angular/core", "@angular/common", "rxjs"],
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest-setup.ts"],
    include: ["**/*.spec.ts", "**/*.test.ts"],
    exclude: ["node_modules/**", "dist/**"],
  },
});
