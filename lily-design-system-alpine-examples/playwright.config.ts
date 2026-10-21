import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:8082",
    trace: "on-first-retry",
    // The themes fade colours on controls; axe would otherwise measure contrast mid-transition.
    reducedMotion: "reduce",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    // `npm run test:e2e` builds dist/ first.
    command: "npx http-server dist -p 8082 -c-1 --silent",
    url: "http://localhost:8082/",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
