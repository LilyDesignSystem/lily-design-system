// portugal-passaporte-input.test.js
// PortugalPassaporteInput component test

const path = require('path');

describe('PortugalPassaporteInput', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'portugal-passaporte-input.html'));
  });

  it('should render the input element with correct class', async function() {
    const el = await $('input.portugal-passaporte-input');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('portugal-passaporte-input');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('input.portugal-passaporte-input');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should have autocomplete off', async function() {
    const el = await $('input.portugal-passaporte-input');
    const value = await el.getAttribute('autocomplete');
    expect(value).toBe('off');
  });
});
