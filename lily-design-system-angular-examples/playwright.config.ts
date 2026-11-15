import { defineConfig, devices } from "@playwright/test";
import { E2E_HOST, e2ePort, e2eURL } from "./e2e-port";

const port = e2ePort();

// Specs that also run in Firefox and WebKit (P18-T1).
const crossEngineSpecs =
    /(responsive|focus-obscured|accessibility|disclosures|modals|hydration|composed-inputs|actions|tree-and-overflow)\.spec\.ts$/;

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
        // Run the built static site for stable a11y / responsive tests.
        // Build first, then http-server the SSG output.
        command: `pnpm run build && pnpm exec http-server dist/analog/public -a ${E2E_HOST} -p ${port} -c-1 --silent`,
        url: `${e2eURL(port)}/`,
        reuseExistingServer: !process.env.CI,
        timeout: 300_000,
    },
});
