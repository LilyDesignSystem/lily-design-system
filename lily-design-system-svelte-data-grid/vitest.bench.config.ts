import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { svelteTesting } from "@testing-library/svelte/vite";

// The render benchmarks (bin/benchmark, tasks.md P38-T8), apart from the tests: the same Svelte compilation, jsdom and
// headless-catalog alias as vite.config.js, but only *.bench.ts, one file at a time.
export default defineConfig({
    plugins: [svelte(), svelteTesting()],
    resolve: {
        alias: {
            "@lilydesignsystem/svelte-headless": fileURLToPath(
                new URL("../lily-design-system-svelte-headless/dist/index.js", import.meta.url),
            ),
        },
    },
    test: {
        environment: "jsdom",
        setupFiles: ["./vitest-setup.js"],
        include: ["*.bench.ts"],
        fileParallelism: false,
    },
});
