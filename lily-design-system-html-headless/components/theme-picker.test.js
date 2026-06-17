// theme-select.test.js
// ThemeSelect component test

const path = require('path');

describe('ThemeSelect', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'theme-select.html'));
  });

  it('should render the div element with correct class', async function() {
    const el = await $('div.theme-select');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('theme-select');
  });

  it('should have the correct ARIA role', async function() {
    const el = await $('div.theme-select');
    const roleAttr = await el.getAttribute('role');
    expect(roleAttr).toBe('radiogroup');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('div.theme-select');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
