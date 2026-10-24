import { defineConfig } from "vitest/config";
import angular from "@analogjs/vite-plugin-angular";

// Standalone test harness for @lilydesignsystem/angular-markdown-editor.
export default defineConfig({
  plugins: [angular()],
  resolve: {
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
