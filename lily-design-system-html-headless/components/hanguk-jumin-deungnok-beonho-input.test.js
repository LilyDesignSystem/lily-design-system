// hanguk-jumin-deungnok-beonho-input.test.js
// HangukJuminDeungnokBeonhoInput component test

const path = require('path');

describe('HangukJuminDeungnokBeonhoInput', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'hanguk-jumin-deungnok-beonho-input.html'));
  });

  it('should render the input element with correct class', async function() {
    const el = await $('input.hanguk-jumin-deungnok-beonho-input');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('hanguk-jumin-deungnok-beonho-input');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('input.hanguk-jumin-deungnok-beonho-input');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should have autocomplete off', async function() {
    const el = await $('input.hanguk-jumin-deungnok-beonho-input');
    const value = await el.getAttribute('autocomplete');
    expect(value).toBe('off');
  });
});
