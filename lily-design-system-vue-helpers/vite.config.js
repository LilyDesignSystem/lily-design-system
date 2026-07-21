import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

// Standalone test harness for the Vue helpers catalog. Each helper
// subproject (e.g. lily-design-system-vue-theme-chooser) keeps its own
// `*.test.ts` next to its component; vitest discovers them all.
export default defineConfig({
  plugins: [vue()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest-setup.js"],
    include: ["lily-design-system-vue-*/**/*.test.ts"],
  },
});
