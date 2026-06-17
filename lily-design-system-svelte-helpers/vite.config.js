import { defineConfig } from "vitest/config";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { svelteTesting } from "@testing-library/svelte/vite";

// Standalone test harness for the Svelte helpers catalog. Each helper
// subproject (e.g. lily-design-system-svelte-theme-select) keeps its
// own `*.test.ts` next to its component; vitest discovers them all.
export default defineConfig({
  plugins: [svelte(), svelteTesting()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest-setup.js"],
    include: ["lily-design-system-svelte-*/**/*.test.ts"],
  },
});
