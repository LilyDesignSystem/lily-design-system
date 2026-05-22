import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest-setup.ts"],
    exclude: ["**/node_modules/**", "**/.nuxt/**", "**/.output/**", "**/e2e/**", "**/*.stories.*"],
  },
});
