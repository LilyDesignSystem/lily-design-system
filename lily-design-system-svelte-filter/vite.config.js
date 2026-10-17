import { defineConfig } from "vitest/config";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { svelteTesting } from "@testing-library/svelte/vite";

// Standalone test harness for @lilydesignsystem/svelte-filter. The package has no
// @lilydesignsystem dependency: it ships its own markup, so there is nothing to alias.
export default defineConfig({
  plugins: [svelte(), svelteTesting()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest-setup.js"],
    include: ["**/*.test.ts"],
    exclude: ["node_modules/**", "dist/**"],
  },
});
