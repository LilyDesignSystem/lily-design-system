// date-time-now-input.test.js
// DateTimeNowInput component test

const path = require('path');

describe('DateTimeNowInput', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'date-time-now-input.html'));
  });

  it('should render the div element with correct class', async function() {
    const el = await $('div.date-time-now-input');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('date-time-now-input');
  });
});
