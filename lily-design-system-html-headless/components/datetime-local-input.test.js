// datetime-local-input.test.js
// DateTimeLocalInput component test

const path = require('path');

describe('DateTimeLocalInput', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'datetime-local-input.html'));
  });

  it('should render the input element with correct class', async function() {
    const el = await $('input.datetime-local-input');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('datetime-local-input');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('input.datetime-local-input');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
