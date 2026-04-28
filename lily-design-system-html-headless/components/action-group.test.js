// action-group.test.js
// ActionGroup component test

const path = require('path');

describe('ActionGroup', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'action-group.html'));
  });

  it('should render the group element with correct class', async function() {
    const el = await $('div.action-group');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('action-group');
  });

  it('should have role="group"', async function() {
    const el = await $('div.action-group');
    const role = await el.getAttribute('role');
    expect(role).toBe('group');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('div.action-group');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should render an overflow trigger with proper ARIA', async function() {
    const trigger = await $('button.action-group-overflow-trigger');
    await expect(trigger).toExist();
    expect(await trigger.getAttribute('aria-haspopup')).toBe('menu');
    expect(await trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('should toggle aria-expanded and panel hidden on overflow trigger click', async function() {
    const trigger = await $('button.action-group-overflow-trigger');
    const panel = await $('div.action-group-overflow-menu');

    // Initially collapsed
    expect(await trigger.getAttribute('aria-expanded')).toBe('false');
    const hiddenBefore = await panel.getAttribute('hidden');
    expect(hiddenBefore).not.toBeNull();

    // Click to expand
    await trigger.click();
    expect(await trigger.getAttribute('aria-expanded')).toBe('true');
    const hiddenAfter = await panel.getAttribute('hidden');
    expect(hiddenAfter).toBeNull();

    // Click to collapse
    await trigger.click();
    expect(await trigger.getAttribute('aria-expanded')).toBe('false');
    const hiddenAgain = await panel.getAttribute('hidden');
    expect(hiddenAgain).not.toBeNull();
  });
});
