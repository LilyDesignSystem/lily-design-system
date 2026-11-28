import { defineConfig, devices } from "@playwright/test";
import { E2E_HOST, e2ePort, e2eURL } from "./e2e-port";

const port = e2ePort();

// Real-browser checks for what jsdom cannot judge: where focus actually lands and how Tab moves.
export default defineConfig({
    testDir: "./e2e",
    fullyParallel: true,
    workers: process.env.LILY_CI_WORKERS ? Number(process.env.LILY_CI_WORKERS) : undefined,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    // In CI an HTML report beside the annotations: bin/ci uploads it, with the traces, when a job fails (tasks.md P50-T21).
    reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
    use: { baseURL: e2eURL(port), trace: "on-first-retry" },
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
