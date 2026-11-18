// Vitest for the Solid 2.0 catalog: the Solid compiler through @solidjs/vite-plugin, jsdom, and globals so
// @solidjs/testing-library cleans up after each test.
import solid from "@solidjs/vite-plugin";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [solid()],
    resolve: { conditions: ["browser", "development"] },
    test: {
        environment: "jsdom",
        globals: true,
        include: ["components/**/*.test.{ts,tsx}"],
    },
});
