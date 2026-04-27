// split-button.test.js
// SplitButton component test

const path = require('path');

describe('SplitButton', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'split-button.html'));
  });

  it('should render the div element with correct class', async function() {
    const el = await $('div.split-button');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('split-button');
  });

  it('should have role="group" and an aria-label', async function() {
    const el = await $('div.split-button');
    const role = await el.getAttribute('role');
    expect(role).toBe('group');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should contain a primary button', async function() {
    const primary = await $('div.split-button button.split-button-primary');
    await expect(primary).toExist();
    const type = await primary.getAttribute('type');
    expect(type).toBe('button');
  });

  it('should contain a menu trigger with aria-haspopup and aria-expanded', async function() {
    const trigger = await $('div.split-button button.split-button-menu-trigger');
    await expect(trigger).toExist();
    const haspopup = await trigger.getAttribute('aria-haspopup');
    expect(haspopup).toBe('menu');
    const expanded = await trigger.getAttribute('aria-expanded');
    expect(expanded).toBe('false');
  });

  it('should toggle the menu open when the trigger is clicked', async function() {
    const trigger = await $('div.split-button button.split-button-menu-trigger');
    const menu = await $('div.split-button div.split-button-menu');
    await trigger.click();
    const expanded = await trigger.getAttribute('aria-expanded');
    expect(expanded).toBe('true');
    const hidden = await menu.getAttribute('hidden');
    expect(hidden).toBeNull();
  });

  it('should close the menu when Escape is pressed', async function() {
    const trigger = await $('div.split-button button.split-button-menu-trigger');
    await trigger.click();
    await browser.keys('Escape');
    const expanded = await trigger.getAttribute('aria-expanded');
    expect(expanded).toBe('false');
  });
});
