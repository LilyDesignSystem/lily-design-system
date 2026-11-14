import { defineConfig, devices } from "@playwright/test";

// Specs that also run in Firefox and WebKit (P18-T1).
const crossEngineSpecs =
    /(responsive|focus-obscured|accessibility|axe-catalog|overflow-navigation|wheel-picker-theme|time-wheels|patient-banner)\.spec\.ts$/;

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
    // subset (P18-T1): the responsive sweep, Focus Not Obscured (2.4.11), the
    // axe baseline, the full axe catalog, the overflow-navigation case and the
    // wheel-picker theme layout (P26-T2), since scroll padding is per engine.
    // Run one engine with `npx playwright test --project=firefox`.
    projects: [
        { name: "chromium", use: { ...devices["Desktop Chrome"] } },
        { name: "firefox", use: { ...devices["Desktop Firefox"] }, testMatch: crossEngineSpecs },
        { name: "webkit", use: { ...devices["Desktop Safari"] }, testMatch: crossEngineSpecs },
    ],
    webServer: {
        command: "pnpm build && pnpm preview --port 4173 --strictPort",
        url: "http://localhost:4173/",
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
    },
});
