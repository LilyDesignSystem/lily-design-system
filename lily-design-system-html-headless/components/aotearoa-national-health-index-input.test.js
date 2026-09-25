// aotearoa-national-health-index-input.test.js
// AotearoaNationalHealthIndexInput component test

const path = require('path');

describe('AotearoaNationalHealthIndexInput', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'aotearoa-national-health-index-input.html'));
  });

  it('should render the input element with correct class', async function() {
    const el = await $('input.aotearoa-national-health-index-input');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('aotearoa-national-health-index-input');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('input.aotearoa-national-health-index-input');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should have autocomplete off', async function() {
    const el = await $('input.aotearoa-national-health-index-input');
    const value = await el.getAttribute('autocomplete');
    expect(value).toBe('off');
  });
});
