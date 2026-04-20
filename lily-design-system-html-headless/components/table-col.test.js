// table-col.test.js
// TableCol component test

const path = require('path');

describe('TableCol', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'table-col.html'));
  });

  it('should render the th element with correct class', async function() {
    const el = await $('th.table-col');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('table-col');
  });

  it('should have scope="col"', async function() {
    const el = await $('th.table-col');
    const scope = await el.getAttribute('scope');
    expect(scope).toBe('col');
  });
});
