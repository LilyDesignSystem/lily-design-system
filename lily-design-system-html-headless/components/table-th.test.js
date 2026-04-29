// table-th.test.js
// TableTD component test

const path = require('path');

describe('TableTD', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'table-th.html'));
  });

  it('should render the th element with correct class', async function() {
    const el = await $('th.table-th');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('table-th');
  });

  it('should have scope="col"', async function() {
    const el = await $('th.table-th');
    const scope = await el.getAttribute('scope');
    expect(scope).toBe('col');
  });
});
