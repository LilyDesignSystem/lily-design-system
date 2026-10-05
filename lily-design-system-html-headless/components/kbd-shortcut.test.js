// kbd-shortcut.test.js
// KbdShortcut component test

const path = require('path');

describe('KbdShortcut', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'kbd-shortcut.html'));
  });

  it('should render a <kbd> root with the correct class', async function() {
    const el = await $('kbd.kbd-shortcut');
    await expect(el).toExist();
    expect(await el.getTagName()).toBe('kbd');
  });

  it('should render one nested kbd per key', async function() {
    const keys = await $$('.kbd-shortcut > kbd.kbd-shortcut-key');
    expect(keys.length).toBe(2);
    expect(await keys[0].getText()).toBe('Ctrl');
    expect(await keys[1].getText()).toBe('K');
  });

  it('should render separators between keys only', async function() {
    const order = await browser.execute(() =>
      Array.from(document.querySelector('.kbd-shortcut').children).map((c) => c.className));
    expect(order).toEqual(['kbd-shortcut-key', 'kbd-shortcut-separator', 'kbd-shortcut-key']);
  });

  it('should hide separators from assistive technology', async function() {
    const sep = await $('.kbd-shortcut-separator');
    expect(await sep.getAttribute('aria-hidden')).toBe('true');
  });

  it('should use + as the default separator', async function() {
    expect(await (await $('.kbd-shortcut-separator')).getText()).toBe('+');
  });

  it('should carry an optional aria-label as the spoken form', async function() {
    const label = await (await $('.kbd-shortcut')).getAttribute('aria-label');
    expect(label).not.toBeNull();
    expect(label).not.toBe('');
  });

  it('should not be focusable (passive element)', async function() {
    expect(await (await $('.kbd-shortcut')).getAttribute('tabindex')).toBeNull();
  });
});
