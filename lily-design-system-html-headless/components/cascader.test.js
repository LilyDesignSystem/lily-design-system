// cascader.test.js
// Cascader component test

const path = require('path');

describe('Cascader', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'cascader.html'));
  });

  it('should render a div element with the cascader class', async function() {
    const el = await $('div.cascader');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('cascader');
  });

  it('should have role="combobox" with aria-haspopup="tree"', async function() {
    const el = await $('div.cascader');
    const role = await el.getAttribute('role');
    const haspopup = await el.getAttribute('aria-haspopup');
    expect(role).toBe('combobox');
    expect(haspopup).toBe('tree');
  });

  it('should have aria-expanded set to false by default', async function() {
    const el = await $('div.cascader');
    const expanded = await el.getAttribute('aria-expanded');
    expect(expanded).toBe('false');
  });

  it('should have aria-label attribute', async function() {
    const el = await $('div.cascader');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should contain a cascader-trigger button and cascader-panel', async function() {
    const trigger = await $('button.cascader-trigger');
    const panel = await $('div.cascader-panel');
    await expect(trigger).toExist();
    await expect(panel).toExist();
  });

  it('should toggle aria-expanded when the trigger is clicked', async function() {
    const root = await $('div.cascader');
    const trigger = await $('button.cascader-trigger');
    await trigger.click();
    const expanded = await root.getAttribute('aria-expanded');
    expect(expanded).toBe('true');
  });

  it('should remove the hidden attribute on the panel when the trigger is clicked', async function() {
    const trigger = await $('button.cascader-trigger');
    const panel = await $('div.cascader-panel');
    await trigger.click();
    const hidden = await panel.getAttribute('hidden');
    expect(hidden).toBeNull();
  });
});
