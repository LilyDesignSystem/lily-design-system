// nederland-identiteitskaart-nummer-input.test.js
// NederlandIdentiteitskaartNummerInput component test

const path = require('path');

describe('NederlandIdentiteitskaartNummerInput', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'nederland-identiteitskaart-nummer-input.html'));
  });

  it('should render the input element with correct class', async function() {
    const el = await $('input.nederland-identiteitskaart-nummer-input');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('nederland-identiteitskaart-nummer-input');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('input.nederland-identiteitskaart-nummer-input');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should have autocomplete off', async function() {
    const el = await $('input.nederland-identiteitskaart-nummer-input');
    const value = await el.getAttribute('autocomplete');
    expect(value).toBe('off');
  });
});
