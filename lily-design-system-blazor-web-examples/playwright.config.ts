import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:5050',
    ignoreHTTPSErrors: true,
    trace: 'on-first-retry'
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command:
      'cd src/LilyBlazorWebExamples && ASPNETCORE_ENVIRONMENT=Development ASPNETCORE_URLS=http://localhost:5050 dotnet run --no-launch-profile -c Release',
    url: 'http://localhost:5050/',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000
  }
});
