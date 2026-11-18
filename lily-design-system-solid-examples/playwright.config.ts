import { defineConfig, devices } from "@playwright/test";
import { E2E_HOST, e2ePort, e2eURL } from "./e2e-port";

const port = e2ePort();

// Specs that also run in Firefox and WebKit: the responsive sweep and the axe baseline.
const crossEngineSpecs = /(responsive|accessibility)\.spec\.ts$/;

export default defineConfig({
    testDir: "./e2e",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    reporter: process.env.CI ? "github" : "list",
    use: {
        baseURL: e2eURL(port),
        trace: "on-first-retry",
    },
    projects: [
        { name: "chromium", use: { ...devices["Desktop Chrome"] } },
        { name: "firefox", use: { ...devices["Desktop Firefox"] }, testMatch: crossEngineSpecs },
        { name: "webkit", use: { ...devices["Desktop Safari"] }, testMatch: crossEngineSpecs },
    ],
    webServer: {
        command: `pnpm vite build && pnpm vite preview --host ${E2E_HOST} --port ${port} --strictPort`,
        url: `${e2eURL(port)}/`,
        reuseExistingServer: !process.env.CI,
        timeout: 240_000,
    },
});
