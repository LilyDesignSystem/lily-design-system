import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";

// Standalone test harness for the Nunjucks helpers catalog. Each helper
// subproject (e.g. @lilydesignsystem/nunjucks-theme-picker) keeps its
// own `*.test.ts` next to its macro + client.js; vitest discovers them
// all. Specs opt into jsdom per-file via `// @vitest-environment jsdom`.
export default defineConfig({
  resolve: {
    alias: {
      // @lilydesignsystem/nunjucks-picker-bar's client.js depends on
      // these four sibling packages' client.js the same way a real
      // consumer would (declared as regular npm `dependencies`,
      // resolved from the registry once published). This catalog has
      // no workspace linking, so nothing installs them into
      // node_modules locally — these aliases point the bare specifiers
      // at each sibling's already-built `dist/index.js` for local
      // dev/test only. picker-bar's own dist keeps the bare imports,
      // which a real install resolves normally.
      "@lilydesignsystem/nunjucks-theme-picker": fileURLToPath(
        new URL(
          "./lily-design-system-nunjucks-theme-picker/dist/index.js",
          import.meta.url,
        ),
      ),
      "@lilydesignsystem/nunjucks-locale-picker": fileURLToPath(
        new URL(
          "./lily-design-system-nunjucks-locale-picker/dist/index.js",
          import.meta.url,
        ),
      ),
      "@lilydesignsystem/nunjucks-text-size-picker": fileURLToPath(
        new URL(
          "./lily-design-system-nunjucks-text-size-picker/dist/index.js",
          import.meta.url,
        ),
      ),
      "@lilydesignsystem/nunjucks-share-picker": fileURLToPath(
        new URL(
          "./lily-design-system-nunjucks-share-picker/dist/index.js",
          import.meta.url,
        ),
      ),
      // theme-picker/locale-picker/text-size-picker/motion-picker's
      // client.js each depend on this shared listbox-keyboard-behaviour
      // package the same way a real consumer would (a regular npm
      // `dependency`) — same local dev/test aliasing reason as the four
      // picker-bar dependencies above.
      "@lilydesignsystem/nunjucks-listbox-behavior": fileURLToPath(
        new URL(
          "./lily-design-system-nunjucks-listbox-behavior/dist/index.js",
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
