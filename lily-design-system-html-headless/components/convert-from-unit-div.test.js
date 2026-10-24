// convert-from-unit-div.test.js
// ConvertFromUnitDiv component test

const path = require('path');

describe('ConvertFromUnitDiv', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'convert-from-unit-div.html'));
  });

  it('should render the root element with correct class', async function() {
    const el = await $('.convert-from-unit-div');
    await expect(el).toExist();
  });

  it('should have no role and no aria-label', async function() {
    const el = await $('.convert-from-unit-div');
    expect(await el.getAttribute('role')).toBeNull();
    expect(await el.getAttribute('aria-label')).toBeNull();
  });
});
