import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

// Standalone test harness for @lilydesignsystem/vue-org-editor.
export default defineConfig({
  plugins: [vue()],
  resolve: {
    dedupe: ["vue"],
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest-setup.js"],
    include: ["**/*.test.ts"],
    exclude: ["node_modules/**", "dist/**"],
  },
});
