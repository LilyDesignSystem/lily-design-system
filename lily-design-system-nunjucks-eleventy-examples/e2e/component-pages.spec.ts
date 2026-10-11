import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// One page test per component, generated from the root canonical
// components.tsv rather than one hand-kept spec file per slug: the
// per-slug files drifted (285 components had none; 18 tested slugs that
// had left the catalog and 404ed), and a catalog change now updates
// this suite without anyone touching it.

const here = path.dirname(fileURLToPath(import.meta.url));
const componentsTsv = path.resolve(here, '..', '..', 'components.tsv');

const slugs = readFileSync(componentsTsv, 'utf-8')
	.split('\n')
	.filter((line) => line.trim().length > 0)
	.map((line) => line.split('\t')[0]);

test('the catalog is not empty', () => {
	expect(slugs.length).toBeGreaterThan(0);
});

for (const slug of slugs) {
	test.describe(`component page: ${slug}`, () => {
		test('responds with a non-error status', async ({ page }) => {
			const res = await page.goto(`/components/${slug}/`);
			expect(res, 'navigation response').not.toBeNull();
			expect(res!.status(), 'http status').toBeLessThan(400);
		});

		test('renders a visible non-empty H1', async ({ page }) => {
			await page.goto(`/components/${slug}/`);
			const h1 = page.getByRole('heading', { level: 1 }).first();
			await expect(h1).toBeVisible();
			await expect(h1).not.toHaveText('');
		});
	});
}
