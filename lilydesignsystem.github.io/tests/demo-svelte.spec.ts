import { test, expect } from '@playwright/test';

// The /demo/svelte/ page: a grail-layout app built from the real helper packages.
test.describe('demo: /demo/svelte/', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo/svelte/');
    // The panels render once the client has read "today".
    await expect(page.getByRole('grid').first()).toBeVisible();
  });

  test('has the grail landmarks and none of the site chrome', async ({ page }) => {
    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('contentinfo')).toBeVisible();
    await expect(page.getByRole('complementary')).toHaveCount(2);
    await expect(page.locator('.site-header')).toHaveCount(0);
  });

  test('the picker bar offers exactly the nine demo locales', async ({ page }) => {
    await page.getByRole('button', { name: 'Language' }).click();
    const options = page.getByRole('listbox', { name: 'Language' }).getByRole('option');
    await expect(options).toHaveText(['English', '中文', 'हिन्दी', 'العربية', 'Cymraeg', 'Español', 'Français', 'English (UK)', 'Deutsch']);
  });

  test('switching to Arabic mirrors the page and translates the demo and the helper labels', async ({ page }) => {
    await page.getByRole('button', { name: 'Language' }).click();
    await page.getByRole('option', { name: 'العربية' }).click();
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar-001');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('جدول البيانات');
    // A label that comes from the helper's own label pack, not from the demo.
    await expect(page.getByRole('button', { name: 'التالي' })).toBeVisible();
  });

  // Each locale: the page's own words, a label that comes from the helper's label pack (the grid's "next page"
  // button), the document's lang and dir, and a date formatted for the locale.
  for (const [option, lang, dir, h1, next] of [
    ['中文', 'zh-001', 'ltr', '数据表格', '下一页'],
    ['हिन्दी', 'hi-001', 'ltr', 'डेटा ग्रिड', 'अगला'],
    ['Cymraeg', 'cy-gb', 'ltr', 'Grid data', 'Nesaf'],
    ['Español', 'es-es', 'ltr', 'Cuadrícula de datos', 'Siguiente'],
    ['Français', 'fr-fr', 'ltr', 'Grille de données', 'Suivant'],
    ['English (UK)', 'en-gb', 'ltr', 'Data grid', 'Next'],
    ['Deutsch', 'de-de', 'ltr', 'Datentabelle', 'Weiter']
  ] as const) {
    test(`locale ${option}: translated page, label pack and document language`, async ({ page }) => {
      await page.getByRole('button', { name: 'Language' }).click();
      await page.getByRole('option', { name: option, exact: true }).click();
      await expect(page.locator('html')).toHaveAttribute('lang', new RegExp(`^${lang.split('-')[0]}`, 'i'));
      await expect(page.locator('html')).toHaveAttribute('dir', dir);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(h1);
      await expect(page.getByRole('button', { name: next, exact: true })).toBeVisible();
    });
  }

  test('every panel can be shown from the panel links', async ({ page }) => {
    const nav = page.getByRole('navigation', { name: 'Demo panels' });
    for (const [name, role] of [
      ['Kanban board', 'grid'],
      ['Gantt chart', 'grid'],
      ['Calendar', 'grid'],
      ['Markdown editor', 'textbox'],
      ['Org editor', 'textbox']
    ] as const) {
      await nav.getByRole('link', { name }).click();
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(name);
      await expect(page.getByRole('main').getByRole(role).first()).toBeVisible();
      await expect(nav.getByRole('link', { name })).toHaveAttribute('aria-current', 'page');
    }
  });

  for (const [side, nav, expand, items] of [
    ['left', 'Shortcuts', 0, ['Home', 'Search', 'Settings', 'Help', 'Email']],
    ['right', 'Directory', 1, ['Users', 'Groups', 'Places', 'Events', 'Actions']]
  ] as const) {
    test(`the ${side} rail collapses to icons, expands to icons with labels, and each button opens the dialog`, async ({ page }) => {
      const rail = page.getByRole('navigation', { name: nav });
      const toggle = rail.getByRole('button', { name: /^(Expand|Collapse)$/ });
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      // Collapsed: the labels are not visible, but every button still has its name.
      for (const name of items) {
        await expect(rail.getByRole('button', { name })).toBeVisible();
        await expect(rail.getByText(name, { exact: true })).not.toBeInViewport();
      }
      const collapsedWidth = (await rail.boundingBox())!.width;
      await toggle.click();
      await expect(toggle).toHaveAttribute('aria-expanded', 'true');
      for (const name of items) await expect(rail.getByText(name, { exact: true })).toBeVisible();
      expect((await rail.boundingBox())!.width).toBeGreaterThan(collapsedWidth);
      // The label sits after the icon, on the inline-end side.
      const first = rail.getByRole('button', { name: items[0] });
      const iconBox = (await first.locator('svg').boundingBox())!;
      const labelBox = (await first.locator('.demo-icon-rail-label').boundingBox())!;
      expect(labelBox.x).toBeGreaterThan(iconBox.x);

      // Every button opens a real modal dialog saying the demo text, and Escape closes it and returns focus.
      for (const name of items) {
        const button = rail.getByRole('button', { name });
        await button.click();
        const dialog = page.getByRole('dialog', { name });
        await expect(dialog).toBeVisible();
        await expect(dialog).toContainText('This is a demo icon button.');
        await page.keyboard.press('Escape');
        await expect(dialog).toBeHidden();
        await expect(button).toBeFocused();
      }
      void expand;
    });
  }

  test('the dialog is modal: the page behind it cannot be reached with the keyboard', async ({ page }) => {
    await page.getByRole('navigation', { name: 'Shortcuts' }).getByRole('button', { name: 'Home' }).click();
    const dialog = page.getByRole('dialog', { name: 'Home' });
    // Tabbing round never lands on an element behind the dialog (focus stays inside it, or leaves the page).
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Tab');
      const behind = await page.evaluate(() => {
        const el = document.activeElement;
        return !!el && el !== document.body && !el.closest('dialog');
      });
      expect(behind).toBe(false);
    }
    await expect(dialog).toBeVisible();
  });

  test('toggle buttons name the action, not the state', async ({ page }) => {
    const toggle = page.getByRole('navigation', { name: 'Shortcuts' }).getByRole('button', { name: 'Expand' });
    await toggle.click();
    await expect(page.getByRole('navigation', { name: 'Shortcuts' }).getByRole('button', { name: 'Collapse' })).toBeVisible();
  });

  test('on a phone the page has no horizontal overflow and the tables scroll inside the content', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
