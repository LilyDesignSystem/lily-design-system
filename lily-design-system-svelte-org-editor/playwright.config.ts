import { defineConfig, devices } from "@playwright/test";

// Real-browser checks: undo / redo through the editing pipeline differs per engine.
export default defineConfig({
    testDir: "./e2e",
    testMatch: "*.spec.ts",
    reporter: "list",
    use: { baseURL: "http://localhost:4181" },
    projects: [
        { name: "chromium", use: { ...devices["Desktop Chrome"] } },
        { name: "firefox", use: { ...devices["Desktop Firefox"] } },
        { name: "webkit", use: { ...devices["Desktop Safari"] } },
    ],
    webServer: {
        command: "npx vite --config e2e/vite.config.js",
        url: "http://localhost:4181/",
        reuseExistingServer: true,
        timeout: 60_000,
    },
});
