// action-bar.test.js
// ActionBar component test

const path = require('path');

describe('ActionBar', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'action-bar.html'));
  });

  it('should render the toolbar element with correct class', async function() {
    const el = await $('div.action-bar');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('action-bar');
  });

  it('should have role="toolbar"', async function() {
    const el = await $('div.action-bar');
    const role = await el.getAttribute('role');
    expect(role).toBe('toolbar');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('div.action-bar');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should expose a data-selected-count attribute', async function() {
    const el = await $('div.action-bar');
    const count = await el.getAttribute('data-selected-count');
    expect(count).not.toBeNull();
  });

  it('should render the count span first', async function() {
    const countEl = await $('div.action-bar > span.action-bar-count');
    await expect(countEl).toExist();
  });

  it('should render the optional clear button with aria-label', async function() {
    const clearEl = await $('div.action-bar button.action-bar-clear');
    await expect(clearEl).toExist();
    const label = await clearEl.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
