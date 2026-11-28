import { defineConfig, devices } from '@playwright/test';
import { E2E_HOST, e2ePort, e2eURL } from './e2e-port';

const port = e2ePort();

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: process.env.LILY_CI_WORKERS ? Number(process.env.LILY_CI_WORKERS) : undefined,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // In CI an HTML report beside the annotations: CI uploads it, with the traces, when a job fails (tasks.md P50-T21).
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: e2eURL(port),
    // A language with no /locales/ route, so "/" is not redirected (en-US, Playwright's default, is).
    locale: 'zu-ZA',
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],
  webServer: {
    command: `pnpm build && pnpm preview --host ${E2E_HOST} --port ${port} --strictPort`,
    url: `${e2eURL(port)}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000
  }
});
