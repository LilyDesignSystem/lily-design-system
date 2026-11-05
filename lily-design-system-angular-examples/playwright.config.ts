import { defineConfig, devices } from "@playwright/test";

// Specs that also run in Firefox and WebKit (P18-T1).
const crossEngineSpecs = /(responsive|focus-obscured|accessibility|disclosures|composed-inputs)\.spec\.ts$/;

export default defineConfig({
    testDir: "./e2e",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    reporter: process.env.CI ? "github" : "list",
    use: {
        baseURL: "http://localhost:4173",
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
        command: "pnpm run build && pnpm run start",
        url: "http://localhost:4173/",
        reuseExistingServer: !process.env.CI,
        timeout: 300_000,
    },
});
