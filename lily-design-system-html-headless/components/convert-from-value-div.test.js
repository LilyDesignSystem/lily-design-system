// convert-from-value-div.test.js
// ConvertFromValueDiv component test

const path = require('path');

describe('ConvertFromValueDiv', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'convert-from-value-div.html'));
  });

  it('should render the root element with correct class', async function() {
    const el = await $('.convert-from-value-div');
    await expect(el).toExist();
  });

  it('should have no role and no aria-label', async function() {
    const el = await $('.convert-from-value-div');
    expect(await el.getAttribute('role')).toBeNull();
    expect(await el.getAttribute('aria-label')).toBeNull();
  });
});
