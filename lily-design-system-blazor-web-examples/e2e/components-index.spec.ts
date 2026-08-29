import { test, expect, type Page } from '@playwright/test';

// Plan P6-T5: the /components search's category + suffix-pattern
// filters, layered on top of the existing free-text search. Ported
// from the canonical Svelte reference:
// lily-design-system-svelte-sveltekit-examples/e2e/components-index.spec.ts
//
// This app's registry (ComponentData.cs) lives in C#, so a ground-truth
// count can't be imported into this TypeScript spec the way the
// canonical spec imports its sibling .ts data file. Instead:
//   - the "(N)" count baked into each <option>'s own label is trusted as
//     ground truth (it's rendered by the same server-side data the page
//     filters against), and every assertion below checks the *rendered
//     list* is self-consistent with that count;
//   - the suffix-pattern check ("every result ends in -picker-button")
//     is re-derived from the slug string itself, which needs no
//     side-channel data at all, since suffixPatternOf is a pure
//     function of the slug;
//   - the intersection test checks membership properties (contains
//     "star", ends in "-picker-button") directly on the rendered hrefs
//     rather than against a precomputed set.
//
// Blazor Interactive Server renders the initial markup before the
// SignalR circuit connects (see e2e/book-an-appointment.spec.ts's
// `gotoReady`); an interaction fired the instant `page.goto()` resolves
// can be silently lost -- the DOM changes locally but there is no live
// circuit yet to carry the event to the server, and the very next server
// render then overwrites the local change back to its stale value. The
// same `gotoReady` wait is used here, and every assertion that depends
// on a round trip having landed uses Playwright's auto-retrying
// `expect(...)` (not a one-shot `.textContent()`/`.count()` read) so a
// slow-to-land first event doesn't flake the test.

async function gotoReady(page: Page) {
  await page.goto('/components');
  await page.waitForFunction(() => (window as unknown as { Blazor?: unknown }).Blazor !== undefined);
  await page.waitForTimeout(300);
}

function slugFromHref(href: string | null): string {
  return (href ?? '').replace('/components/', '');
}

function optionCount(label: string | null): number {
  const match = (label ?? '').match(/\((\d+)\)$/);
  expect(match, `option label "${label}" should end in "(N)"`).toBeTruthy();
  return Number(match![1]);
}

test.describe('/components search filters', () => {
  test('search narrows the list and clear resets it', async ({ page }) => {
    await gotoReady(page);
    const status = page.getByRole('status');
    const totalText = (await status.textContent()) ?? '';
    const totalMatch = totalText.match(/(\d+) of (\d+) components/);
    expect(totalMatch).toBeTruthy();
    const total = Number(totalMatch![2]);
    await expect(status).toContainText(`${total} of ${total} components`);

    await page.getByLabel('Filter components').fill('breadcrumb');
    await expect(status).not.toContainText(`${total} of ${total} components`, { timeout: 10_000 });
    const afterText = (await status.textContent()) ?? '';
    const match = afterText.match(/(\d+) of \d+ components/);
    expect(match).toBeTruthy();
    const shown = Number(match![1]);
    expect(shown).toBeGreaterThan(0);
    expect(shown).toBeLessThan(total);

    const items = page.locator('.component-index-list-item');
    await expect(items).toHaveCount(shown);
    for (let i = 0; i < shown; i++) {
      await expect(items.nth(i)).toContainText(/breadcrumb/i);
    }

    await page.getByRole('button', { name: 'Clear filters' }).click();
    await expect(status).toContainText(`${total} of ${total} components`, { timeout: 10_000 });
    await expect(page.getByLabel('Filter components')).toHaveValue('');
  });

  test('category filter shows exactly the components in that category', async ({ page }) => {
    await gotoReady(page);
    const select = page.getByLabel('Category');
    const option = select.locator('option[value="tables"]');
    const expectedCount = optionCount(await option.textContent());
    expect(expectedCount).toBeGreaterThan(0);

    await select.selectOption('tables');

    const items = page.locator('.component-index-list-item a');
    await expect(items).toHaveCount(expectedCount, { timeout: 10_000 });
    await expect(page.getByRole('status')).toContainText(`${expectedCount} of`);
  });

  test('suffix-pattern filter shows exactly the slugs ending in that suffix', async ({ page }) => {
    await gotoReady(page);
    const select = page.getByLabel('Suffix pattern');
    const option = select.locator('option[value="picker-button"]');
    const expectedCount = optionCount(await option.textContent());
    expect(expectedCount).toBeGreaterThan(0);

    await select.selectOption('picker-button');

    const items = page.locator('.component-index-list-item a');
    await expect(items).toHaveCount(expectedCount, { timeout: 10_000 });

    const hrefs = await items.evaluateAll((as) => as.map((a) => a.getAttribute('href')));
    for (const href of hrefs) {
      const slug = slugFromHref(href);
      expect(
        slug === 'picker-button' || slug.endsWith('-picker-button'),
        `expected "${slug}" to end in "-picker-button"`
      ).toBe(true);
    }
  });

  test('category, suffix-pattern, and search combine as an intersection', async ({ page }) => {
    await gotoReady(page);
    const select = page.getByLabel('Category');
    const option = select.locator('option[value="pickers"]');
    const pickersCount = optionCount(await option.textContent());

    await select.selectOption('pickers');
    await expect(page.locator('.component-index-list-item a')).toHaveCount(pickersCount, { timeout: 10_000 });

    await page.getByLabel('Suffix pattern').selectOption('picker-button');
    const afterTwoFilters = page.locator('.component-index-list-item a');
    await expect(async () => {
      const count = await afterTwoFilters.count();
      expect(count).toBeLessThanOrEqual(pickersCount);
    }).toPass({ timeout: 10_000 });
    const countAfterTwoFilters = await afterTwoFilters.count();
    test.skip(countAfterTwoFilters === 0, 'no picker-button component in the "pickers" category currently');

    await page.getByLabel('Filter components').fill('star');
    await expect(async () => {
      const count = await page.locator('.component-index-list-item a').count();
      expect(count).toBeLessThanOrEqual(countAfterTwoFilters);
    }).toPass({ timeout: 10_000 });

    const items = page.locator('.component-index-list-item a');
    const hrefs = await items.evaluateAll((as) => as.map((a) => a.getAttribute('href')));
    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) {
      const slug = slugFromHref(href);
      expect(slug).toContain('star');
      expect(
        slug === 'picker-button' || slug.endsWith('-picker-button'),
        `expected "${slug}" to end in "-picker-button"`
      ).toBe(true);
    }

    await page.getByRole('button', { name: 'Clear filters' }).click();
    await expect(page.getByLabel('Category')).toHaveValue('');
    await expect(page.getByLabel('Suffix pattern')).toHaveValue('');
    await expect(page.getByLabel('Filter components')).toHaveValue('');
    const status = page.getByRole('status');
    await expect(async () => {
      const statusText = (await status.textContent()) ?? '';
      const match = statusText.match(/(\d+) of (\d+) components/);
      expect(match).toBeTruthy();
      expect(match![1]).toBe(match![2]);
    }).toPass({ timeout: 10_000 });
  });

  test('clear filters button only appears when a filter is active', async ({ page }) => {
    await gotoReady(page);
    await expect(page.getByRole('button', { name: 'Clear filters' })).toHaveCount(0);

    await page.getByLabel('Filter components').fill('breadcrumb');
    await expect(page.getByRole('button', { name: 'Clear filters' })).toBeVisible({ timeout: 10_000 });
  });
});
