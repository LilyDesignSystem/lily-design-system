import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

// Standalone test harness for @lilydesignsystem/vue-filter.
export default defineConfig({
  plugins: [vue()],
  resolve: {
    // A sibling subproject's built dist/ (aliased below) resolves vue from
    // its own node_modules; dedupe so one Vue runtime serves both.
    dedupe: ["vue"],
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest-setup.js"],
    include: ["**/*.test.ts"],
    exclude: ["node_modules/**", "dist/**"],
  },
});
