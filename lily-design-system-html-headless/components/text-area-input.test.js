// text-area-input.test.js
// TextAreaInput component test

const path = require('path');

describe('TextAreaInput', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'text-area-input.html'));
  });

  it('should render the text-area-input element with correct class', async function() {
    const el = await $('textarea.text-area-input');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('text-area-input');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('textarea.text-area-input');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
