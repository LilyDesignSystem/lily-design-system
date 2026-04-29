// page-layout.test.js
// Page Layout test

const path = require('path');

describe('Page Layout', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, '..', 'pages', 'page-layout.html'));
  });

  it('should render the skip link', async function() {
    const el = await $('a.skip-link');
    await expect(el).toExist();
    const href = await el.getAttribute('href');
    expect(href).toBe('#main-content');
  });

  it('should render the header with aria-label', async function() {
    const el = await $('header.header');
    await expect(el).toExist();
    const label = await el.getAttribute('aria-label');
    expect(label).toBe('Site header');
  });

  it('should render the navigation menu', async function() {
    const el = await $('nav.navigation-menu');
    await expect(el).toExist();
    const label = await el.getAttribute('aria-label');
    expect(label).toBe('Main navigation');
  });

  it('should render the breadcrumb nav', async function() {
    const el = await $('nav.breadcrumb-nav');
    await expect(el).toExist();
    const label = await el.getAttribute('aria-label');
    expect(label).toBe('Breadcrumb');
  });

  it('should render breadcrumb list items', async function() {
    const items = await $$('li.breadcrumb-list-item');
    expect(items.length).toBe(3);
  });

  it('should mark last breadcrumb as current page', async function() {
    const items = await $$('li.breadcrumb-list-item');
    const last = items[items.length - 1];
    const current = await last.getAttribute('aria-current');
    expect(current).toBe('page');
  });

  it('should render the sidebar', async function() {
    const el = await $('aside.sidebar');
    await expect(el).toExist();
    const role = await el.getAttribute('role');
    expect(role).toBe('complementary');
  });

  it('should render the grail layout', async function() {
    const el = await $('div.grail-layout');
    await expect(el).toExist();
  });

  it('should render the footer', async function() {
    const el = await $('footer.footer');
    await expect(el).toExist();
    const label = await el.getAttribute('aria-label');
    expect(label).toBe('Site footer');
  });
});
