// transfer-list.test.js
// TransferList component test

const path = require('path');

describe('TransferList', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'transfer-list.html'));
  });

  it('should render a div with the transfer-list class', async function() {
    const el = await $('div.transfer-list');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('transfer-list');
  });

  it('should have role="group"', async function() {
    const el = await $('div.transfer-list');
    const role = await el.getAttribute('role');
    expect(role).toBe('group');
  });

  it('should have an aria-label attribute on the root', async function() {
    const el = await $('div.transfer-list');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should contain source, actions, and target regions', async function() {
    const source = await $('section.transfer-list-source');
    const actions = await $('div.transfer-list-actions');
    const target = await $('section.transfer-list-target');
    await expect(source).toExist();
    await expect(actions).toExist();
    await expect(target).toExist();
  });

  it('should expose aria-label on the source and target sections', async function() {
    const source = await $('section.transfer-list-source');
    const target = await $('section.transfer-list-target');
    const sourceLabel = await source.getAttribute('aria-label');
    const targetLabel = await target.getAttribute('aria-label');
    expect(sourceLabel).not.toBeNull();
    expect(targetLabel).not.toBeNull();
  });
});
