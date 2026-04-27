// tree-select.test.js
// TreeSelect component test

const path = require('path');

describe('TreeSelect', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'tree-select.html'));
  });

  it('should render a div element with the tree-select class', async function() {
    const el = await $('div.tree-select');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('tree-select');
  });

  it('should have role="combobox" with aria-haspopup="tree"', async function() {
    const el = await $('div.tree-select');
    const role = await el.getAttribute('role');
    const haspopup = await el.getAttribute('aria-haspopup');
    expect(role).toBe('combobox');
    expect(haspopup).toBe('tree');
  });

  it('should have aria-expanded set to false by default', async function() {
    const el = await $('div.tree-select');
    const expanded = await el.getAttribute('aria-expanded');
    expect(expanded).toBe('false');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('div.tree-select');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should contain a tree-select-trigger and tree-select-panel', async function() {
    const trigger = await $('button.tree-select-trigger');
    const panel = await $('div.tree-select-panel');
    await expect(trigger).toExist();
    await expect(panel).toExist();
  });

  it('should toggle aria-expanded when the trigger is clicked', async function() {
    const root = await $('div.tree-select');
    const trigger = await $('button.tree-select-trigger');
    await trigger.click();
    const expanded = await root.getAttribute('aria-expanded');
    expect(expanded).toBe('true');
  });

  it('should remove the hidden attribute on the panel when the trigger is clicked', async function() {
    const trigger = await $('button.tree-select-trigger');
    const panel = await $('div.tree-select-panel');
    await trigger.click();
    const hidden = await panel.getAttribute('hidden');
    expect(hidden).toBeNull();
  });
});
