import { defineConfig, devices } from "@playwright/test";

// Real-browser checks for what jsdom cannot judge: where focus actually lands and how Tab moves.
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: { baseURL: "http://localhost:4174" },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  webServer: {
    command: "pnpm exec vite --config vite.e2e.config.js --port 4174 --strictPort",
    url: "http://localhost:4174/",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
