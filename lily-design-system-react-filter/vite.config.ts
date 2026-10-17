import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Standalone test harness for @lilydesignsystem/react-filter.
export default defineConfig({
  plugins: [react()],
  resolve: {
    // A sibling subproject's built dist/ (aliased below) resolves react from
    // its own node_modules; without deduping, React mounts two copies and
    // every hook call inside it throws "Invalid hook call".
    dedupe: ["react", "react-dom"],
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest-setup.ts"],
    include: ["**/*.test.tsx", "**/*.test.ts"],
    exclude: ["node_modules/**", "dist/**"],
  },
});
