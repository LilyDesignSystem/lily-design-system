import { test, expect } from "@playwright/test";

// Responsive design smoke check across the Angular examples app.
// Mirrors the pattern from svelte-sveltekit / react-next / vue-nuxt /
// blazor-web / html-css-js example apps.

const viewports = [
  { name: "mobile  ", width: 375, height: 667 },
  { name: "tablet  ", width: 768, height: 1024 },
  { name: "desktop ", width: 1280, height: 800 },
  { name: "4K      ", width: 2560, height: 1440 },
];

const routes = [
  "/",
  "/components",
  "/components/button",
  "/components/data-table",
  "/components/grail-layout",
  "/contact-form",
  "/dashboard",
  "/page-layout",
  "/task-management",
  "/timeline-and-cards",
];

async function expectNoHorizontalOverflow(
  page: import("@playwright/test").Page,
  label: string,
) {
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
        await expect(page.getByRole("link", { name: /skip to main content/i })).toBeAttached();
        await expect(page.getByRole("main").first()).toBeVisible();
        await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
        await expectNoHorizontalOverflow(page, `${vp.name}${route}`);
      });
    }
  });
}
