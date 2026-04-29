// data-table-th.test.js
// DataTableTD component test

const path = require('path');

describe('DataTableTD', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'data-table-th.html'));
  });

  it('should render the th element with correct class', async function() {
    const el = await $('th.data-table-th');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('data-table-th');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('th.data-table-th');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
