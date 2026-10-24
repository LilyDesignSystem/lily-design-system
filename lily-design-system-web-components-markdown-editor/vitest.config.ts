import { defineConfig } from "vitest/config";

// Standalone test harness for @lilydesignsystem/web-components-markdown-editor.
export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest-setup.ts"],
    include: ["**/*.test.ts"],
    exclude: ["node_modules/**", "dist/**"],
  },
});
