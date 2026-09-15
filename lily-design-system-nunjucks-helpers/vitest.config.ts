import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";

// Standalone test harness for the Nunjucks helpers catalog. Each helper
// subproject (e.g. lily-design-system-nunjucks-theme-picker) keeps its
// own `*.test.ts` next to its macro + client.js; vitest discovers them
// all. Specs opt into jsdom per-file via `// @vitest-environment jsdom`.
export default defineConfig({
  resolve: {
    alias: {
      // lily-design-system-nunjucks-picker-bar's client.js depends on
      // these four sibling packages' client.js the same way a real
      // consumer would (declared as regular npm `dependencies`,
      // resolved from the registry once published). This catalog has
      // no workspace linking, so nothing installs them into
      // node_modules locally — these aliases point the bare specifiers
      // at each sibling's already-built `dist/index.js` for local
      // dev/test only. picker-bar's own dist keeps the bare imports,
      // which a real install resolves normally.
      "lily-design-system-nunjucks-theme-picker": fileURLToPath(
        new URL(
          "./lily-design-system-nunjucks-theme-picker/dist/index.js",
          import.meta.url,
        ),
      ),
      "lily-design-system-nunjucks-locale-picker": fileURLToPath(
        new URL(
          "./lily-design-system-nunjucks-locale-picker/dist/index.js",
          import.meta.url,
        ),
      ),
      "lily-design-system-nunjucks-text-size-picker": fileURLToPath(
        new URL(
          "./lily-design-system-nunjucks-text-size-picker/dist/index.js",
          import.meta.url,
        ),
      ),
      "lily-design-system-nunjucks-share-picker": fileURLToPath(
        new URL(
          "./lily-design-system-nunjucks-share-picker/dist/index.js",
          import.meta.url,
        ),
      ),
    },
  },
  test: {
    environment: "node",
    setupFiles: ["./vitest-setup.ts"],
    include: ["lily-design-system-nunjucks-*/**/*.test.ts"],
  },
});
