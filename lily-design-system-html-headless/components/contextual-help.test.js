// contextual-help.test.js
// ContextualHelp component test

const path = require('path');

describe('ContextualHelp', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'contextual-help.html'));
  });

  it('should render the root element with correct class', async function() {
    const el = await $('div.contextual-help');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('contextual-help');
  });

  it('should have a trigger with aria-haspopup="dialog"', async function() {
    const trigger = await $('button.contextual-help-trigger');
    await expect(trigger).toExist();
    expect(await trigger.getAttribute('aria-haspopup')).toBe('dialog');
  });

  it('should have a trigger with aria-expanded and aria-controls', async function() {
    const trigger = await $('button.contextual-help-trigger');
    expect(await trigger.getAttribute('aria-expanded')).toBe('false');
    const controls = await trigger.getAttribute('aria-controls');
    expect(controls).not.toBeNull();
  });

  it('should render the panel with role="dialog"', async function() {
    const panel = await $('div.contextual-help-panel');
    await expect(panel).toExist();
    expect(await panel.getAttribute('role')).toBe('dialog');
  });

  it('should toggle aria-expanded and panel hidden on trigger click', async function() {
    const trigger = await $('button.contextual-help-trigger');
    const panel = await $('div.contextual-help-panel');

    expect(await trigger.getAttribute('aria-expanded')).toBe('false');
    expect(await panel.getAttribute('hidden')).not.toBeNull();

    await trigger.click();
    expect(await trigger.getAttribute('aria-expanded')).toBe('true');
    expect(await panel.getAttribute('hidden')).toBeNull();

    await trigger.click();
    expect(await trigger.getAttribute('aria-expanded')).toBe('false');
    expect(await panel.getAttribute('hidden')).not.toBeNull();
  });
});
