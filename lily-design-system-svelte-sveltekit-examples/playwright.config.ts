import { defineConfig, devices } from "@playwright/test";
import { E2E_HOST, e2ePort, e2eURL } from "./e2e-port";

const port = e2ePort();

// Specs that also run in Firefox and WebKit (P18-T1). visual-regression joined 2026-11-19 (P38-T6): each engine keeps
// its own baselines, named by Playwright with the project and the platform.
const crossEngineSpecs =
    /(responsive|clinical-reflow|summary-list-pairing|table-cell-words|focus-obscured|accessibility|axe-catalog|overflow-navigation|wheel-picker-theme|time-wheels|patient-banner|healthcare-pages|clinic-pages|patient-dashboard|motion-recipes|visual-regression)\.spec\.ts$/;

export default defineConfig({
    testDir: "./e2e",
    fullyParallel: true,
    workers: process.env.LILY_CI_WORKERS ? Number(process.env.LILY_CI_WORKERS) : undefined,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    // In CI an HTML report beside the annotations: bin/ci uploads it, with the traces, when a job fails (tasks.md P50-T21).
    reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
    use: {
        baseURL: e2eURL(port),
        trace: "on-first-retry",
    },
    // Chromium runs every spec. Firefox and WebKit run the cross-engine
    // subset (P18-T1): the responsive sweep, Focus Not Obscured (2.4.11), the
    // axe baseline, the full axe catalog, the overflow-navigation case and the
    // wheel-picker theme layout (P26-T2), since scroll padding is per engine,
    // and the visual-regression baseline (P38-T6).
    // Run one engine with `npx playwright test --project=firefox`.
    projects: [
        { name: "chromium", use: { ...devices["Desktop Chrome"] } },
        { name: "firefox", use: { ...devices["Desktop Firefox"] }, testMatch: crossEngineSpecs },
        { name: "webkit", use: { ...devices["Desktop Safari"] }, testMatch: crossEngineSpecs },
    ],
    webServer: {
        command: `pnpm build && pnpm preview --host ${E2E_HOST} --port ${port} --strictPort`,
        url: `${e2eURL(port)}/`,
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
    },
});
