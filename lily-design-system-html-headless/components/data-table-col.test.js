// data-table-col.test.js
// DataTableTD component test

const path = require('path');

describe('DataTableTD', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'data-table-col.html'));
  });

  it('should render the th element with correct class', async function() {
    const el = await $('th.data-table-col');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('data-table-col');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('th.data-table-col');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
