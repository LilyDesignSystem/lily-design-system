// search-and-filter.test.js
// Search and Filter page test

const path = require('path');

describe('Search and Filter', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, '..', 'pages', 'search-and-filter.html'));
  });

  it('should render the search input', async function() {
    const el = await $('input.search-input');
    await expect(el).toExist();
    const role = await el.getAttribute('role');
    expect(role).toBe('searchbox');
  });

  it('should render the combobox', async function() {
    const el = await $('div.combobox');
    await expect(el).toExist();
    const role = await el.getAttribute('role');
    expect(role).toBe('combobox');
  });

  it('should render the tag group', async function() {
    const el = await $('div.tag-group');
    await expect(el).toExist();
  });

  it('should render the data table', async function() {
    const el = await $('table.data-table');
    await expect(el).toExist();
    const label = await el.getAttribute('aria-label');
    expect(label).toBe('Product catalog');
  });

  it('should render all eight products initially', async function() {
    const rows = await $$('table.data-table tbody tr');
    expect(rows.length).toBe(8);
  });

  it('should filter products by search query', async function() {
    await $('input.search-input').setValue('Keyboard');
    const rows = await $$('table.data-table tbody tr');
    expect(rows.length).toBe(1);
  });

  it('should show result count', async function() {
    const count = await $('span#result-count');
    const text = await count.getText();
    expect(text).toBe('8');
  });

  it('should update result count on search', async function() {
    await $('input.search-input').setValue('Desk');
    const count = await $('span#result-count');
    const text = await count.getText();
    expect(parseInt(text)).toBeGreaterThan(0);
    expect(parseInt(text)).toBeLessThan(8);
  });

  it('should render status badges in table', async function() {
    const badges = await $$('table.data-table tbody span.badge');
    expect(badges.length).toBeGreaterThan(0);
  });
});
