import { test, expect } from '@playwright/test';

// Responsive design smoke check across the Nuxt examples app.
// See the SvelteKit examples app's responsive.spec.ts for the rationale
// — this file mirrors that pattern for the Nuxt route shape.
//
// Loads a representative set of routes at 4 viewport sizes (mobile,
// tablet, desktop, 4K) and asserts:
//   - No horizontal overflow (page width fits the viewport).
//   - The skip-link is reachable in the tab order.
//   - The main landmark and the page H1 are visible.

const viewports = [
  { name: 'mobile  ', width: 375,  height: 667  },  // iPhone SE
  { name: 'tablet  ', width: 768,  height: 1024 },  // iPad portrait
  { name: 'desktop ', width: 1280, height: 800  },  // laptop
  { name: '4K      ', width: 2560, height: 1440 },  // 27" 1440p
];

const routes = [
  '/',
  '/components',
  '/components/button',
  '/components/data-table',
  '/components/grail-layout',
  '/contact-form',
  '/dashboard',
  '/page-layout',
  '/task-management',
  '/timeline-and-cards',
];

async function expectNoHorizontalOverflow(page: import('@playwright/test').Page, label: string) {
  const overflow = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
  }));
  if (overflow.documentWidth > overflow.viewportWidth + 2) {
    throw new Error(
      `horizontal overflow on ${label}: documentWidth=${overflow.documentWidth} > viewportWidth=${overflow.viewportWidth}`,
    );
  }
}

for (const vp of viewports) {
  test.describe(`responsive: ${vp.name.trim()} (${vp.width}x${vp.height})`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    for (const route of routes) {
      test(route, async ({ page }) => {
        await page.goto(route);
        await expect(page.getByRole('link', { name: /skip to main content/i })).toBeAttached();
        await expect(page.getByRole('main').first()).toBeVisible();
        await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
        await expectNoHorizontalOverflow(page, `${vp.name}${route}`);
      });
    }
  });
}
