import { defineConfig } from "vitest/config";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { svelteTesting } from "@testing-library/svelte/vite";

// Dedicated vitest config that avoids the SvelteKit plugin's SSR conditions.
// `sveltekit()` from `vite.config.ts` resolves Svelte to its server entry,
// which makes `@testing-library/svelte`'s `mount()` throw
// `lifecycle_function_unavailable`. The `svelteTesting()` plugin restores
// the browser/client conditions for tests.
export default defineConfig({
  plugins: [svelte(), svelteTesting()],
  test: {
    include: ["src/**/*.test.ts"],
    environment: "jsdom",
    setupFiles: ["./vitest-setup.js"],
  },
});
