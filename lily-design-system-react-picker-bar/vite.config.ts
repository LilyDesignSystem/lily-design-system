import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Standalone test harness for @lilydesignsystem/react-picker-bar.
export default defineConfig({
  plugins: [react()],
  resolve: {
    // A sibling subproject's built dist/ (aliased below) resolves react from
    // its own node_modules; without deduping, React mounts two copies and
    // every hook call inside it throws "Invalid hook call".
    dedupe: ["react", "react-dom"],
    alias: {
      // Each @lilydesignsystem dependency (direct or transitive) is a
      // regular npm `dependency`, resolved from the registry once published.
      // For local dev/test these aliases point the bare specifiers at the
      // sibling top-level subproject's built dist/ instead, so build those
      // first (bin/list-helper-packages react prints the order). Not read by
      // the tsup build: this package's dist keeps the bare imports.
      "@lilydesignsystem/react-headless": fileURLToPath(
        new URL("../lily-design-system-react-headless/dist/index.js", import.meta.url),
      ),
      "@lilydesignsystem/react-link-picker": fileURLToPath(
        new URL("../lily-design-system-react-link-picker/dist/index.js", import.meta.url),
      ),
      "@lilydesignsystem/react-locale-picker": fileURLToPath(
        new URL("../lily-design-system-react-locale-picker/dist/index.js", import.meta.url),
      ),
      "@lilydesignsystem/react-search-picker": fileURLToPath(
        new URL("../lily-design-system-react-search-picker/dist/index.js", import.meta.url),
      ),
      "@lilydesignsystem/react-share-picker": fileURLToPath(
        new URL("../lily-design-system-react-share-picker/dist/index.js", import.meta.url),
      ),
      "@lilydesignsystem/react-text-size-picker": fileURLToPath(
        new URL("../lily-design-system-react-text-size-picker/dist/index.js", import.meta.url),
      ),
      "@lilydesignsystem/react-theme-picker": fileURLToPath(
        new URL("../lily-design-system-react-theme-picker/dist/index.js", import.meta.url),
      ),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest-setup.ts"],
    include: ["**/*.test.tsx", "**/*.test.ts"],
    exclude: ["node_modules/**", "dist/**"],
  },
});
