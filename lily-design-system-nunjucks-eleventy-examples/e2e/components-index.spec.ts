import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { suffixPatternOf } from '../src/assets/js/modules/components-search.js';

// Plan P6-T5: the /components search's category + suffix-pattern
// filters, layered on top of the free-text search this test file
// introduces alongside them (this app had no client-side search
// before this change). Ported from the canonical SvelteKit reference
// (lily-design-system-svelte-sveltekit-examples/e2e/components-index.spec.ts)
// to this app's static-site route shape (trailing-slash routes) and
// its progressive-enhancement filtering (matching <li>s stay in the
// DOM with a `hidden` attribute rather than being removed).
//
// This app has no importable TS component registry, so ground truth
// is read directly from the root canonical components-categories.tsv
// -- the same source src/_data/components.js reads at build time --
// rather than hardcoded counts, so a catalog change can't silently
// drift this test out of sync with reality. suffixPatternOf is
// imported from the actual browser module rather than duplicated a
// third time.

const here = path.dirname(fileURLToPath(import.meta.url));
const categoriesTsv = path.resolve(here, '..', '..', 'components-categories.tsv');

interface Row {
	slug: string;
	tag: string;
	category: string;
}

function loadRows(): Row[] {
	return readFileSync(categoriesTsv, 'utf-8')
		.split('\n')
		.filter((line) => line.trim().length > 0)
		.map((line) => {
			const [slug, tag, category] = line.split('\t');
			return { slug, tag, category };
		});
}

const rows = loadRows();
const TOTAL = rows.length;
const tableSlugs = new Set(rows.filter((r) => r.category === 'tables').map((r) => r.slug));
const pickerButtonSlugs = new Set(
	rows.filter((r) => suffixPatternOf(r.slug) === 'picker-button').map((r) => r.slug),
);
const starPickerButtonSlugs = new Set(
	[...pickerButtonSlugs].filter(
		(slug) => slug.includes('star') && rows.find((r) => r.slug === slug)?.category === 'pickers',
	),
);

function slugFromHref(href: string | null): string {
	return (href ?? '').replace('/components/', '').replace(/\/$/, '');
}

test.describe('/components search filters', () => {
	test('search narrows the list and clear resets it', async ({ page }) => {
		await page.goto('/components/');
		await expect(page.getByRole('status')).toContainText(`${TOTAL} of ${TOTAL} components`);

		await page.getByLabel('Filter components').fill('breadcrumb');
		const status = await page.getByRole('status').textContent();
		const match = status?.match(/(\d+) of \d+ components/);
		expect(match).toBeTruthy();
		const shown = Number(match![1]);
		expect(shown).toBeGreaterThan(0);
		expect(shown).toBeLessThan(TOTAL);

		const items = page.locator('.component-index-list-item:not([hidden])');
		expect(await items.count()).toBe(shown);
		for (let i = 0; i < shown; i++) {
			await expect(items.nth(i)).toContainText(/breadcrumb/i);
		}

		await page.getByRole('button', { name: 'Clear filters' }).click();
		await expect(page.getByRole('status')).toContainText(`${TOTAL} of ${TOTAL} components`);
	});

	test('category filter shows exactly the components in that category', async ({ page }) => {
		await page.goto('/components/');
		await page.getByLabel('Category').selectOption('tables');

		const items = page.locator('.component-index-list-item:not([hidden]) a');
		expect(await items.count()).toBe(tableSlugs.size);

		const hrefs = await items.evaluateAll((as) => as.map((a) => a.getAttribute('href')));
		for (const href of hrefs) {
			expect(tableSlugs.has(slugFromHref(href))).toBe(true);
		}
	});

	test('suffix-pattern filter shows exactly the slugs ending in that suffix', async ({ page }) => {
		await page.goto('/components/');
		await page.getByLabel('Suffix pattern').selectOption('picker-button');

		const items = page.locator('.component-index-list-item:not([hidden]) a');
		expect(await items.count()).toBe(pickerButtonSlugs.size);

		const hrefs = await items.evaluateAll((as) => as.map((a) => a.getAttribute('href')));
		for (const href of hrefs) {
			expect(pickerButtonSlugs.has(slugFromHref(href))).toBe(true);
		}
	});

	test('category, suffix-pattern, and search combine as an intersection', async ({ page }) => {
		test.skip(starPickerButtonSlugs.size === 0, 'no star + picker-button component in the current catalog');

		await page.goto('/components/');
		await page.getByLabel('Category').selectOption('pickers');
		await page.getByLabel('Suffix pattern').selectOption('picker-button');
		await page.getByLabel('Filter components').fill('star');

		const items = page.locator('.component-index-list-item:not([hidden]) a');
		const hrefs = await items.evaluateAll((as) => as.map((a) => a.getAttribute('href')));
		expect(hrefs.map(slugFromHref).sort()).toEqual([...starPickerButtonSlugs].sort());

		await page.getByRole('button', { name: 'Clear filters' }).click();
		await expect(page.getByLabel('Category')).toHaveValue('');
		await expect(page.getByLabel('Suffix pattern')).toHaveValue('');
		await expect(page.getByLabel('Filter components')).toHaveValue('');
		await expect(page.getByRole('status')).toContainText(`${TOTAL} of ${TOTAL} components`);
	});
});
