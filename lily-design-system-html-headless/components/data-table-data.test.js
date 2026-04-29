// data-table-td.test.js
// DataTableTD component test

const path = require('path');

describe('DataTableTD', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'data-table-td.html'));
  });

  it('should render the td element with correct class', async function() {
    const el = await $('td.data-table-td');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('data-table-td');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('td.data-table-td');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
