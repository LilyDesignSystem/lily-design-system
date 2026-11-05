import { defineConfig } from "vitest/config";
import angular from "@analogjs/vite-plugin-angular";

// A real server render: no jsdom and no TestBed, so `document` is undefined as it is while prerendering.
export default defineConfig({
    plugins: [angular()],
    test: {
        globals: true,
        environment: "node",
        include: ["prerender/**/*.spec.ts"],
        testTimeout: 120000,
        silent: "passed-only",
    },
});
