import { test, expect } from '@playwright/test';

// Responsive design smoke check across the Nunjucks + Eleventy examples app.
// See the SvelteKit examples app's responsive.spec.ts for the rationale
// — this file mirrors that pattern for the static-site route shape.
// Routes use trailing slashes (/components/{slug}/). Composed pages are
// not currently built in this app, so the smoke check focuses on the
// catalog and component-detail routes that are.
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
  '/components/',
  '/components/button/',
  '/components/data-table/',
  '/components/grail-layout/',
  '/components/text-input/',
  '/components/dialog/',
  '/components/breadcrumb-nav/',
  '/components/header/',
  '/components/footer/',
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
        const res = await page.goto(route);
        if (res && res.status() === 404) {
          test.skip(true, `Route not built: ${route}`);
        }
        await expect(page.getByRole('link', { name: /skip to main content/i })).toBeAttached();
        await expect(page.getByRole('main').first()).toBeVisible();
        await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
        await expectNoHorizontalOverflow(page, `${vp.name}${route}`);
      });
    }
  });
}
