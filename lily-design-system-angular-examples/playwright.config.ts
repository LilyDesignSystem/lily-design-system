import { defineConfig, devices } from "@playwright/test";

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
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    // Run the built static site for stable a11y / responsive tests.
    // Build first, then http-server the SSG output.
    command: "pnpm run build && pnpm run start",
    url: "http://localhost:4173/",
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
  },
});
