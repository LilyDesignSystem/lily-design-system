import { fileURLToPath, URL } from "node:url";

import solid from "@solidjs/vite-plugin";
import { defineConfig } from "vitest/config";

// Test harness for @lilydesignsystem/solid-locale-picker. A sibling @lilydesignsystem package is a regular npm dependency once
// published; for local tests the alias points it at the sibling subproject's source, which the Solid compiler builds
// here, so no sibling build is needed first. build.mjs keeps the bare imports.
export default defineConfig({
    plugins: [solid()],
    resolve: {
        conditions: ["browser", "development"],
        alias: {
            "@lilydesignsystem/solid-headless": fileURLToPath(
                new URL("../lily-design-system-solid-headless/index.ts", import.meta.url),
            ),
        },
    },
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: ["./vitest-setup.ts"],
        include: ["**/*.test.tsx", "**/*.test.ts"],
        exclude: ["node_modules/**", "dist/**"],
    },
});
