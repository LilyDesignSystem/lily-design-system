import { defineConfig } from "vitest/config";
import angular from "@analogjs/vite-plugin-angular";

// Standalone test harness for the Angular helpers catalog. Each helper
// subproject (e.g. lily-design-system-angular-theme-chooser) keeps its
// own `*.component.spec.ts` next to its component; vitest discovers
// them all. Mirrors the angular-headless library harness.

export default defineConfig({
  plugins: [angular()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest-setup.ts"],
    include: ["lily-design-system-angular-*/**/*.spec.ts"],
  },
});
