// convert-into-value-div.test.js
// ConvertIntoValueDiv component test

const path = require('path');

describe('ConvertIntoValueDiv', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'convert-into-value-div.html'));
  });

  it('should render the root element with correct class', async function() {
    const el = await $('.convert-into-value-div');
    await expect(el).toExist();
  });

  it('should have no role and no aria-label', async function() {
    const el = await $('.convert-into-value-div');
    expect(await el.getAttribute('role')).toBeNull();
    expect(await el.getAttribute('aria-label')).toBeNull();
  });
});
