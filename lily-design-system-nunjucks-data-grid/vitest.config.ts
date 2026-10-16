import { defineConfig } from "vitest/config";

// Standalone test harness for @lilydesignsystem/nunjucks-data-grid (no Lily dependencies).
export default defineConfig({
  test: {
    environment: "node",
    setupFiles: ["./vitest-setup.ts"],
    include: ["**/*.test.ts"],
    exclude: ["node_modules/**", "dist/**"],
  },
});
