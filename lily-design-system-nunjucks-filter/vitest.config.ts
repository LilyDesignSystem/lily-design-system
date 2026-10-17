import { defineConfig } from "vitest/config";

// Standalone test harness for @lilydesignsystem/nunjucks-filter.
export default defineConfig({
  resolve: {
  },
  test: {
    environment: "node",
    setupFiles: ["./vitest-setup.ts"],
    include: ["**/*.test.ts"],
    exclude: ["node_modules/**", "dist/**"],
  },
});
