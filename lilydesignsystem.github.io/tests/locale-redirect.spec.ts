import { test, expect } from '@playwright/test';
import { pickLocaleRoute } from '../src/lib/locale-redirect';

const available = ['ar-001', 'cy-001', 'cy-gb', 'en-001', 'en-gb', 'en-us', 'fr-001', 'pt-001', 'zh-cn'];
const pick = (...langs: string[]) => pickLocaleRoute(langs, available);

test.describe('pickLocaleRoute', () => {
  test('exact region match, hyphen or underscore, any case', () => {
    expect(pick('cy-GB')).toBe('cy-gb');
    expect(pick('cy_GB')).toBe('cy-gb');
    expect(pick('EN-us')).toBe('en-us');
    expect(pick('zh-CN')).toBe('zh-cn');
  });
  test('falls back to the language generic (-001)', () => {
    expect(pick('fr-CA')).toBe('fr-001');
    expect(pick('pt-BR')).toBe('pt-001');
    expect(pick('cy')).toBe('cy-001');
    expect(pick('ar-EG')).toBe('ar-001');
  });
  test('script subtags are ignored when a region is present', () => {
    expect(pick('zh-Hans-CN')).toBe('zh-cn');
  });
  test('no invented fallbacks', () => {
    expect(pick('zh-TW')).toBeNull();
    expect(pick('de-DE')).toBeNull();
    expect(pick('')).toBeNull();
  });
  test('English variants without their own route go to the international en-001', () => {
    expect(pick('en')).toBe('en-001');
    expect(pick('en-AU')).toBe('en-001');
    expect(pick('en-001')).toBe('en-001');
    expect(pick('en-GB')).toBe('en-gb');
  });
  test('earlier preferences win, and unmatched ones are skipped', () => {
    expect(pick('de-DE', 'fr-CA', 'cy-GB')).toBe('fr-001');
    expect(pick('de-DE', 'en-AU')).toBe('en-001');
  });
});

test.describe('home page redirect', () => {
  test.describe('Welsh (UK) browser', () => {
    test.use({ locale: 'cy-GB' });
    test('"/" goes to /cy-gb/ once per session', async ({ page }) => {
      await page.goto('/');
      await page.waitForURL('**/cy-gb/');
      await expect(page.locator('html')).toHaveAttribute('lang', 'cy-GB');
      // Back to "/" in the same session: no second redirect.
      await page.goto('/');
      await page.waitForTimeout(800);
      expect(new URL(page.url()).pathname).toBe('/');
    });
  });
  test.describe('English (Australia) browser', () => {
    test.use({ locale: 'en-AU' });
    test('"/" goes to /en-001/ (there is no en-au route)', async ({ page }) => {
      await page.goto('/');
      await page.waitForURL('**/en-001/');
      await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    });
  });
  test.describe('unsupported language browser', () => {
    test.use({ locale: 'de-DE' });
    test('"/" stays', async ({ page }) => {
      await page.goto('/');
      await page.waitForTimeout(800);
      expect(new URL(page.url()).pathname).toBe('/');
    });
  });
});
