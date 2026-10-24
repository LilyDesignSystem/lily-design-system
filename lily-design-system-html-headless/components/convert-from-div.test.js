// convert-from-div.test.js
// ConvertFromDiv component test

const path = require('path');

describe('ConvertFromDiv', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'convert-from-div.html'));
  });

  it('should render the root element with correct class', async function() {
    const el = await $('.convert-from-div');
    await expect(el).toExist();
  });

  it('should have no role and no aria-label', async function() {
    const el = await $('.convert-from-div');
    expect(await el.getAttribute('role')).toBeNull();
    expect(await el.getAttribute('aria-label')).toBeNull();
  });
});
