import { defineConfig, devices } from "@playwright/test";
import { E2E_HOST, e2ePort, e2eURL } from "./e2e-port";

const port = e2ePort();

// Real-browser checks for what jsdom cannot judge: where focus actually lands and how Tab moves.
export default defineConfig({
    testDir: "./e2e",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    reporter: process.env.CI ? "github" : "list",
    use: { baseURL: e2eURL(port) },
    projects: [
        { name: "chromium", use: { ...devices["Desktop Chrome"] } },
        { name: "firefox", use: { ...devices["Desktop Firefox"] } },
        { name: "webkit", use: { ...devices["Desktop Safari"] } },
    ],
    webServer: {
        command: `pnpm exec vite --config vite.e2e.config.js --host ${E2E_HOST} --port ${port} --strictPort`,
        url: `${e2eURL(port)}/`,
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
    },
});
