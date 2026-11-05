import { defineConfig, devices } from "@playwright/test";

// Specs that also run in Firefox and WebKit (P18-T1).
const crossEngineSpecs = /(responsive|focus-obscured|accessibility|overflow-navigation|menu-popover|dialog-modality|keyboard|widget-keys|controls)\.spec\.ts$/;

export default defineConfig({
    testDir: "./e2e",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    reporter: process.env.CI ? "github" : "list",
    use: {
        baseURL: "http://localhost:5050",
        ignoreHTTPSErrors: true,
        trace: "on-first-retry",
    },
    // Chromium runs every spec. Firefox and WebKit run the cross-engine
    // subset (P18-T1): the responsive sweep, Focus Not Obscured (2.4.11) and
    // the axe baseline, the overflow-navigation case, and the keyboard specs. Run one engine with
    // `npx playwright test --project=firefox`.
    projects: [
        { name: "chromium", use: { ...devices["Desktop Chrome"] } },
        { name: "firefox", use: { ...devices["Desktop Firefox"] }, testMatch: crossEngineSpecs },
        { name: "webkit", use: { ...devices["Desktop Safari"] }, testMatch: crossEngineSpecs },
    ],
    webServer: {
        command:
            "cd src/LilyBlazorWebExamples && ASPNETCORE_ENVIRONMENT=Development ASPNETCORE_URLS=http://localhost:5050 dotnet run --no-launch-profile -c Release",
        url: "http://localhost:5050/",
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
    },
});
