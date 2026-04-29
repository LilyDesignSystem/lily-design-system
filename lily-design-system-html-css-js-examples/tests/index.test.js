// index.test.js
// Index page test

const path = require('path');

describe('Index Page', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, '..', 'pages', 'index.html'));
  });

  it('should render the skip link', async function() {
    const el = await $('a.skip-link');
    await expect(el).toExist();
  });

  it('should render the header with correct class', async function() {
    const el = await $('header.header');
    await expect(el).toExist();
    const label = await el.getAttribute('aria-label');
    expect(label).toBe('Site header');
  });

  it('should render the main content area', async function() {
    const el = await $('main#main-content');
    await expect(el).toExist();
  });

  it('should have links to all example pages', async function() {
    const links = await $$('main ul li a');
    expect(links.length).toBe(12);
  });

  it('should render the footer with correct class', async function() {
    const el = await $('footer.footer');
    await expect(el).toExist();
    const label = await el.getAttribute('aria-label');
    expect(label).toBe('Site footer');
  });
});
