import { fileURLToPath, URL } from "node:url";

import solid from "@solidjs/vite-plugin";
import { defineConfig } from "vitest/config";

// Test harness for @lilydesignsystem/solid-picker-bar. A sibling @lilydesignsystem package is a regular npm dependency once
// published; for local tests the alias points it at the sibling subproject's source, which the Solid compiler builds
// here, so no sibling build is needed first. build.mjs keeps the bare imports.
export default defineConfig({
    plugins: [solid()],
    resolve: {
        conditions: ["browser", "development"],
        alias: {
            "@lilydesignsystem/solid-link-picker": fileURLToPath(
                new URL("../lily-design-system-solid-link-picker/index.ts", import.meta.url),
            ),
            "@lilydesignsystem/solid-locale-picker": fileURLToPath(
                new URL("../lily-design-system-solid-locale-picker/index.ts", import.meta.url),
            ),
            "@lilydesignsystem/solid-search-picker": fileURLToPath(
                new URL("../lily-design-system-solid-search-picker/index.ts", import.meta.url),
            ),
            "@lilydesignsystem/solid-share-picker": fileURLToPath(
                new URL("../lily-design-system-solid-share-picker/index.ts", import.meta.url),
            ),
            "@lilydesignsystem/solid-text-size-picker": fileURLToPath(
                new URL("../lily-design-system-solid-text-size-picker/index.ts", import.meta.url),
            ),
            "@lilydesignsystem/solid-theme-picker": fileURLToPath(
                new URL("../lily-design-system-solid-theme-picker/index.ts", import.meta.url),
            ),
            "@lilydesignsystem/solid-time-zone-picker": fileURLToPath(
                new URL("../lily-design-system-solid-time-zone-picker/index.ts", import.meta.url),
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
