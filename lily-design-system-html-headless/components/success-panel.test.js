// success-panel.test.js
// SuccessPanel component test

const path = require('path');

describe('SuccessPanel', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'success-panel.html'));
  });

  it('should render the div element with correct class', async function() {
    const el = await $('div.success-panel');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('success-panel');
  });
});
