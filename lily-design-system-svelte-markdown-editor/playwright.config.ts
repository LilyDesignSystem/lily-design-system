import { defineConfig, devices } from "@playwright/test";
import { E2E_HOST, e2ePort, e2eURL } from "./e2e-port";

const port = e2ePort();

// Real-browser checks: undo / redo through the editing pipeline differs per engine.
export default defineConfig({
    testDir: "./e2e",
    testMatch: "*.spec.ts",
    reporter: "list",
    use: { baseURL: e2eURL(port) },
    projects: [
        { name: "chromium", use: { ...devices["Desktop Chrome"] } },
        { name: "firefox", use: { ...devices["Desktop Firefox"] } },
        { name: "webkit", use: { ...devices["Desktop Safari"] } },
    ],
    webServer: {
        command: `npx vite --config e2e/vite.config.js --host ${E2E_HOST} --port ${port} --strictPort`,
        url: `${e2eURL(port)}/`,
        reuseExistingServer: true,
        timeout: 60_000,
    },
});
