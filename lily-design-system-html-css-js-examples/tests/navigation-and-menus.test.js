// navigation-and-menus.test.js
// Navigation and Menus page test

const path = require('path');

describe('Navigation and Menus', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, '..', 'pages', 'navigation-and-menus.html'));
  });

  it('should render the demo navigation menu', async function() {
    const navs = await $$('nav.navigation-menu');
    expect(navs.length).toBeGreaterThanOrEqual(2);
  });

  it('should render the menu bar with correct role', async function() {
    const el = await $('div.menu-bar');
    await expect(el).toExist();
    const role = await el.getAttribute('role');
    expect(role).toBe('menubar');
  });

  it('should render menu bar buttons', async function() {
    const buttons = await $$('button.menu-bar-button');
    expect(buttons.length).toBe(4);
    const role = await buttons[0].getAttribute('role');
    expect(role).toBe('menuitem');
  });

  it('should render dropdown menus hidden initially', async function() {
    const menus = await $$('div.dropdown-menu');
    expect(menus.length).toBe(2);
    for (const menu of menus) {
      const hidden = await menu.getAttribute('hidden');
      expect(hidden).not.toBeNull();
    }
  });

  it('should open file menu on click', async function() {
    await $('button#file-menu-btn').click();
    const menu = await $('div#file-menu');
    const hidden = await menu.getAttribute('hidden');
    expect(hidden).toBeNull();
  });

  it('should render the toolbar with correct role', async function() {
    const el = await $('div.tool-bar');
    await expect(el).toExist();
    const role = await el.getAttribute('role');
    expect(role).toBe('toolbar');
  });

  it('should render toolbar buttons', async function() {
    const buttons = await $$('button.tool-bar-button');
    expect(buttons.length).toBe(7);
  });

  it('should toggle hamburger menu', async function() {
    const hamburger = await $('button#hamburger-btn');
    await hamburger.click();
    const expanded = await hamburger.getAttribute('aria-expanded');
    expect(expanded).toBe('true');
    const nav = await $('nav#mobile-nav');
    const hidden = await nav.getAttribute('hidden');
    expect(hidden).toBeNull();
  });
});
