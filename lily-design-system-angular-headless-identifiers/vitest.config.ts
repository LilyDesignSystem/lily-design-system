import { defineConfig } from "vitest/config";
import angular from "@analogjs/vite-plugin-angular";

// Vitest configuration for the Angular headless component library. Two projects, so a bare `vitest run` runs both.
// `unit`: @analogjs/vite-plugin-angular compiles Angular templates in test files, and jsdom provides a browser-like
// DOM for ARIA / class assertions via TestBed.createComponent + ComponentFixture.
// `prerender`: a real server render, with no jsdom and no TestBed, so `document` is undefined as it is while
// prerendering (prerender/prerender.spec.ts).

export default defineConfig({
    test: {
        projects: [
            {
                plugins: [angular()],
                test: {
                    name: "unit",
                    globals: true,
                    environment: "jsdom",
                    setupFiles: ["./vitest-setup.ts"],
                    include: ["components/**/*.spec.ts"],
                },
            },
            {
                plugins: [angular()],
                test: {
                    name: "prerender",
                    globals: true,
                    environment: "node",
                    include: ["prerender/**/*.spec.ts"],
                    testTimeout: 120000,
                },
            },
        ],
    },
});
