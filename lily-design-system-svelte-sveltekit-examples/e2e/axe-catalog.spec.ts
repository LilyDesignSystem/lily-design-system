import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { components } from '../src/lib/data/components';

// Plan P4-T1: the full-catalog accessibility sweep — axe against every
// one of the 491 /components/{slug} detail pages, not just the ~16
// samples the baseline suite checks. Rule set matches the baseline
// suite (WCAG 2.0/2.1 A+AA, 2.2 AA).
const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

test.describe('axe: full component catalog', () => {
  for (const c of components) {
    test(`/components/${c.slug}`, async ({ page }) => {
      await page.goto(`/components/${c.slug}`);
      const results = await new AxeBuilder({ page }).withTags(wcagTags).analyze();
      const summary = results.violations
        .map(v => `  - ${v.id} (${v.impact}): ${v.help} [${v.nodes.map(n => n.target[0]).join(', ')}]`)
        .join('\n');
      expect(results.violations, `axe violations on /components/${c.slug}:\n${summary}`).toEqual([]);
    });
  }
});
