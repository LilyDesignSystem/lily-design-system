import { defineConfig, devices } from "@playwright/test";
import { E2E_HOST, e2ePort, e2eURL } from "./e2e-port";

const port = e2ePort();

// Specs that also run in Firefox and WebKit (P18-T1).
const crossEngineSpecs =
    /(responsive|focus-obscured|accessibility|theme-select|whole-card-link|form-validation|table-word-break)\.spec\.ts$/;

export default defineConfig({
    testDir: "./e2e",
    fullyParallel: true,
    workers: process.env.LILY_CI_WORKERS ? Number(process.env.LILY_CI_WORKERS) : undefined,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    reporter: process.env.CI ? "github" : "list",
    use: {
        baseURL: e2eURL(port),
        trace: "on-first-retry",
    },
    // Chromium runs every spec. Firefox and WebKit run the cross-engine
    // subset (P18-T1): the responsive sweep, Focus Not Obscured (2.4.11) and
    // the axe baseline. Run one engine with
    // `npx playwright test --project=firefox`.
    projects: [
        { name: "chromium", use: { ...devices["Desktop Chrome"] } },
        { name: "firefox", use: { ...devices["Desktop Firefox"] }, testMatch: crossEngineSpecs },
        { name: "webkit", use: { ...devices["Desktop Safari"] }, testMatch: crossEngineSpecs },
    ],
    webServer: {
        // The `pages/*.html` files reference `../assets/css/nhs.css` (one
        // level above `pages/`). `pages/assets` is a symlink to `../assets`
        // so that path resolves when http-server is rooted at `pages/`.
        command: `npx http-server pages -a ${E2E_HOST} -p ${port} -c-1 --silent`,
        url: `${e2eURL(port)}/`,
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
    },
});
