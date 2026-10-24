// convert-div.test.js
// ConvertDiv component test

const path = require('path');

describe('ConvertDiv', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'convert-div.html'));
  });

  it('should render the root element with correct class', async function() {
    const el = await $('.convert-div');
    await expect(el).toExist();
  });

  it('should be a named group', async function() {
    const el = await $('.convert-div');
    expect(await el.getAttribute('role')).toBe('group');
    expect(await el.getAttribute('aria-label')).not.toBeNull();
  });
});
