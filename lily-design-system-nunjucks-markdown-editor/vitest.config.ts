import { defineConfig } from "vitest/config";

// Standalone test harness for @lilydesignsystem/nunjucks-markdown-editor.
export default defineConfig({
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    exclude: ["node_modules/**", "dist/**"],
  },
});
