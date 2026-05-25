// timeout-dialog.test.js
// TimeoutDialog component test

const path = require('path');

describe('TimeoutDialog', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'timeout-dialog.html'));
  });

  it('should render the dialog element with correct class', async function() {
    const el = await $('dialog.timeout-dialog');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('timeout-dialog');
  });
});
