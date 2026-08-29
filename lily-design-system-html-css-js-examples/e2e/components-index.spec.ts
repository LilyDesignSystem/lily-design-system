import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Plan P6-T5: the /components search's category + suffix-pattern
// filters, layered on top of the existing free-text search. Ported
// from the canonical SvelteKit spec (e2e/components-index.spec.ts
// there) to this plain-HTML + vanilla-JS app.
//
// This app has no TypeScript data module to import from Node for
// ground truth -- its component array is embedded inline in
// pages/components/index.html's own <script> tag as plain JS. Ground
// truth is computed here by reading that HTML file and extracting the
// `var components = [...]` array body with the exact same marker
// convention bin/generate-registries's replaceRegion() uses
// ("var components = [" .. "                ];"), then evaluating it
// with `new Function`. suffixPatternOf() below is a duplicate of the
// production copy inside index.html's own script (ported verbatim
// from src/lib/data/suffix-pattern.ts in the canonical app) -- it has
// to be duplicated here because there is no shared module to import.

const INDEX_HTML_PATH = path.join(__dirname, '../pages/components/index.html');

interface CatalogComponent {
	slug: string;
	name: string;
	description: string;
	tag: string;
	category: string;
}

function readCatalog(): CatalogComponent[] {
	const html = fs.readFileSync(INDEX_HTML_PATH, 'utf-8');
	const startMarker = 'var components = [';
	const endMarker = '                ];';
	const start = html.indexOf(startMarker);
	if (start < 0) throw new Error('start marker not found in pages/components/index.html');
	const from = start + startMarker.length;
	const end = html.indexOf(endMarker, from);
	if (end < 0) throw new Error('end marker not found in pages/components/index.html');
	const body = html.slice(from, end);
	return new Function(`return [${body}]`)();
}

const SUFFIX_PATTERN_IDS = [
	'table-thead', 'table-tbody', 'table-tfoot', 'table-tr', 'table-th', 'table-td',
	'table-head', 'table-body', 'table-foot', 'table-row', 'list-item', 'list',
	'picker-button', 'bar-button', 'bar', 'select-option', 'option', 'group-item',
	'group', 'menu-item', 'menu', 'picker', 'nav', 'input', 'view', 'link', 'select',
	'button', 'dialog', 'fieldset', 'figure', 'footer', 'header', 'aside', 'main',
	'meter', 'progress', 'kbd', 'span', 'div', 'article', 'table',
];

function suffixPatternOf(slug: string): string {
	for (const id of SUFFIX_PATTERN_IDS) {
		if (slug === id || slug.endsWith(`-${id}`)) return id;
	}
	return 'standalone';
}

const components = readCatalog();
const TOTAL = components.length;
const tableSlugs = new Set(components.filter((c) => c.category === 'tables').map((c) => c.slug));
const pickerButtonSlugs = new Set(
	components.filter((c) => suffixPatternOf(c.slug) === 'picker-button').map((c) => c.slug),
);
const starPickerButtonSlugs = new Set(
	[...pickerButtonSlugs].filter(
		(slug) => slug.includes('star') && components.find((c) => c.slug === slug)?.category === 'pickers',
	),
);

function slugFromHref(href: string | null): string {
	const match = (href ?? '').match(/[?&]slug=([^&]+)/);
	return match ? decodeURIComponent(match[1]) : '';
}

test.describe('/components search filters', () => {
	test('search narrows the list and clear resets it', async ({ page }) => {
		await page.goto('/components/index.html');
		await expect(page.locator('#result-count')).toContainText(`${TOTAL} of ${TOTAL} components`);

		await page.getByLabel('Search components').fill('breadcrumb');
		const status = await page.locator('#result-count').textContent();
		const match = status?.match(/(\d+) of \d+ components/);
		expect(match).toBeTruthy();
		const shown = Number(match![1]);
		expect(shown).toBeGreaterThan(0);
		expect(shown).toBeLessThan(TOTAL);

		const items = page.locator('#component-list > li');
		expect(await items.count()).toBe(shown);
		for (let i = 0; i < shown; i++) {
			await expect(items.nth(i)).toContainText(/breadcrumb/i);
		}

		await page.getByRole('button', { name: 'Clear filters' }).click();
		await expect(page.locator('#result-count')).toContainText(`${TOTAL} of ${TOTAL} components`);
	});

	test('category filter shows exactly the components in that category', async ({ page }) => {
		await page.goto('/components/index.html');
		await page.getByLabel('Category').selectOption('tables');

		const items = page.locator('#component-list > li a');
		expect(await items.count()).toBe(tableSlugs.size);

		const hrefs = await items.evaluateAll((as) => as.map((a) => a.getAttribute('href')));
		for (const href of hrefs) {
			expect(tableSlugs.has(slugFromHref(href))).toBe(true);
		}
	});

	test('suffix-pattern filter shows exactly the slugs ending in that suffix', async ({ page }) => {
		await page.goto('/components/index.html');
		await page.getByLabel('Suffix pattern').selectOption('picker-button');

		const items = page.locator('#component-list > li a');
		expect(await items.count()).toBe(pickerButtonSlugs.size);

		const hrefs = await items.evaluateAll((as) => as.map((a) => a.getAttribute('href')));
		for (const href of hrefs) {
			expect(pickerButtonSlugs.has(slugFromHref(href))).toBe(true);
		}
	});

	test('category, suffix-pattern, and search combine as an intersection', async ({ page }) => {
		test.skip(starPickerButtonSlugs.size === 0, 'no star + picker-button component in the current catalog');

		await page.goto('/components/index.html');
		await page.getByLabel('Category').selectOption('pickers');
		await page.getByLabel('Suffix pattern').selectOption('picker-button');
		await page.getByLabel('Search components').fill('star');

		const items = page.locator('#component-list > li a');
		const hrefs = await items.evaluateAll((as) => as.map((a) => a.getAttribute('href')));
		expect(hrefs.map(slugFromHref).sort()).toEqual([...starPickerButtonSlugs].sort());

		await page.getByRole('button', { name: 'Clear filters' }).click();
		await expect(page.getByLabel('Category')).toHaveValue('');
		await expect(page.getByLabel('Suffix pattern')).toHaveValue('');
		await expect(page.getByLabel('Search components')).toHaveValue('');
		await expect(page.locator('#result-count')).toContainText(`${TOTAL} of ${TOTAL} components`);
	});
});
