// split-view.test.js
// SplitView component test

const path = require('path');

describe('SplitView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'split-view.html'));
  });

  it('should render the root element with correct class', async function() {
    const el = await $('div.split-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('split-view');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('div.split-view');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should expose data-orientation and data-split-percent', async function() {
    const el = await $('div.split-view');
    expect(await el.getAttribute('data-orientation')).not.toBeNull();
    expect(await el.getAttribute('data-split-percent')).not.toBeNull();
  });

  it('should render primary, divider, and secondary in order', async function() {
    const primary = await $('div.split-view > section.split-view-primary');
    const divider = await $('div.split-view > div.split-view-divider');
    const secondary = await $('div.split-view > section.split-view-secondary');
    await expect(primary).toExist();
    await expect(divider).toExist();
    await expect(secondary).toExist();
  });

  it('should mark the divider with role="separator" and ARIA values', async function() {
    const divider = await $('div.split-view-divider');
    expect(await divider.getAttribute('role')).toBe('separator');
    expect(await divider.getAttribute('aria-orientation')).not.toBeNull();
    expect(await divider.getAttribute('aria-valuenow')).not.toBeNull();
    expect(await divider.getAttribute('aria-valuemin')).toBe('0');
    expect(await divider.getAttribute('aria-valuemax')).toBe('100');
    expect(await divider.getAttribute('tabindex')).toBe('0');
  });
});
