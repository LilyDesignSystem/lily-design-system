// status-tag.test.js
// StatusTag component test

const path = require('path');

describe('StatusTag', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'status-tag.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.status-tag');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('status-tag');
  });
});
