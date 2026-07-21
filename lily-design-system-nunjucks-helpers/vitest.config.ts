import { defineConfig } from "vitest/config";

// Standalone test harness for the Nunjucks helpers catalog. Each helper
// subproject (e.g. lily-design-system-nunjucks-theme-chooser) keeps its
// own `*.test.ts` next to its macro + client.js; vitest discovers them
// all. Specs opt into jsdom per-file via `// @vitest-environment jsdom`.
export default defineConfig({
  test: {
    environment: "node",
    setupFiles: ["./vitest-setup.ts"],
    include: ["lily-design-system-nunjucks-*/**/*.test.ts"],
  },
});
