import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Standalone test harness for the React helpers catalog. Each helper
// subproject (e.g. @lilydesignsystem/react-theme-picker) keeps its
// own `*.test.tsx` next to its component; vitest discovers them all.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // @lilydesignsystem/react-picker-bar depends on these four sibling
      // packages the same way a real consumer would (declared as regular
      // npm `dependencies`, resolved from the registry once published).
      // This catalog has no pnpm workspace linking (no `packages:` glob in
      // pnpm-workspace.yaml), so nothing installs them into node_modules
      // locally — these aliases point the bare specifiers at each
      // sibling's already-built `dist/` for local dev/test only. Not read
      // by the tsup build: picker-bar's own dist keeps the bare imports,
      // which real installs resolve normally.
      "@lilydesignsystem/react-theme-picker": fileURLToPath(
        new URL(
          "./lily-design-system-react-theme-picker/dist/index.js",
          import.meta.url,
        ),
      ),
      "@lilydesignsystem/react-locale-picker": fileURLToPath(
        new URL(
          "./lily-design-system-react-locale-picker/dist/index.js",
          import.meta.url,
        ),
      ),
      "@lilydesignsystem/react-text-size-picker": fileURLToPath(
        new URL(
          "./lily-design-system-react-text-size-picker/dist/index.js",
          import.meta.url,
        ),
      ),
      "@lilydesignsystem/react-share-picker": fileURLToPath(
        new URL(
          "./lily-design-system-react-share-picker/dist/index.js",
          import.meta.url,
        ),
      ),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest-setup.ts"],
    include: ["lily-design-system-react-*/**/*.test.tsx"],
  },
});
