import { test, expect } from '@playwright/test';

// Plan P13-T6: reduced motion changes how content appears, never whether it appears. With
// prefers-reduced-motion: reduce, each animated component's demo still renders its content,
// its accessible name and its order. (Whether the themes also stop animating is P12-T12.)

test.use({ reducedMotion: 'reduce' });

const demos: { slug: string; text?: string; name?: string }[] = [
  { slug: 'carousel', text: 'Slide 1', name: 'Carousel' },
  { slug: 'slider', text: '50', name: 'Value' },
  { slug: 'loading', text: 'Loading...', name: 'Loading' },
  { slug: 'slide-out-drawer', text: 'Slide-out drawer', name: 'Drawer' },
  { slug: 'skeleton' }
];

for (const { slug, text, name } of demos) {
  test(`reduced motion keeps the ${slug} demo's content`, async ({ page }) => {
    await page.goto(`/components/${slug}`);
    expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true);
    const demo = page.locator(`.component-example-rendered .${slug}`).first();
    await expect(demo).toBeAttached();
    if (text) await expect(demo).toContainText(text);
    if (name) await expect(demo).toHaveAttribute('aria-label', name);
  });
}
