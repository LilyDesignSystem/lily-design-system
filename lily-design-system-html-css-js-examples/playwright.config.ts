import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:8080',
    trace: 'on-first-retry'
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    // The `pages/*.html` files reference `../assets/css/nhs.css` (one
    // level above `pages/`). `pages/assets` is a symlink to `../assets`
    // so that path resolves when http-server is rooted at `pages/`.
    command: 'npx http-server pages -p 8080 -c-1 --silent',
    url: 'http://localhost:8080/',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000
  }
});
