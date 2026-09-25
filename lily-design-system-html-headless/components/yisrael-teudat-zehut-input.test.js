// yisrael-teudat-zehut-input.test.js
// YisraelTeudatZehutInput component test

const path = require('path');

describe('YisraelTeudatZehutInput', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'yisrael-teudat-zehut-input.html'));
  });

  it('should render the input element with correct class', async function() {
    const el = await $('input.yisrael-teudat-zehut-input');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('yisrael-teudat-zehut-input');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('input.yisrael-teudat-zehut-input');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should have autocomplete off', async function() {
    const el = await $('input.yisrael-teudat-zehut-input');
    const value = await el.getAttribute('autocomplete');
    expect(value).toBe('off');
  });
});
