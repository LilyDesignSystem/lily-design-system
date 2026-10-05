// empty-state.test.js
// EmptyState component test

const path = require('path');

describe('EmptyState', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'empty-state.html'));
  });

  it('should render a div with the correct class', async function() {
    const el = await $('div.empty-state');
    await expect(el).toExist();
    expect(await el.getTagName()).toBe('div');
  });

  it('should have role=group and aria-label when a label is given', async function() {
    const el = await $('.empty-state');
    expect(await el.getAttribute('role')).toBe('group');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
    expect(label).not.toBe('');
  });

  it('should be exposed as a named group to assistive technology', async function() {
    const role = await (await $('.empty-state')).getComputedRole();
    expect(role).toBe('group');
  });

  it('should render consumer-supplied heading, text and action', async function() {
    await expect(await $('.empty-state h2')).toExist();
    await expect(await $('.empty-state p')).toExist();
    await expect(await $('.empty-state button')).toExist();
  });

  it('should not bundle an icon or image', async function() {
    expect((await $$('.empty-state svg, .empty-state img')).length).toBe(0);
  });

  it('should have the base class first and no inline style', async function() {
    const el = await $('.empty-state');
    expect((await el.getAttribute('class')).split(' ')[0]).toBe('empty-state');
    expect(await el.getAttribute('style')).toBeNull();
  });
});
