// table-data.test.js
// TableTD component test

const path = require('path');

describe('TableTD', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'table-data.html'));
  });

  it('should render the div element with correct class', async function() {
    const el = await $('div.table-data');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('table-data');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('div.table-data');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
