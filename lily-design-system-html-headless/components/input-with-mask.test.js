// input-with-mask.test.js
// InputWithMask component test

const path = require('path');

describe('InputWithMask', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'input-with-mask.html'));
  });

  it('should render the div wrapper with correct class', async function() {
    const el = await $('div.input-with-mask');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('input-with-mask');
  });

  it('should expose the mask via data-mask', async function() {
    const el = await $('div.input-with-mask');
    const mask = await el.getAttribute('data-mask');
    expect(mask).not.toBeNull();
  });

  it('should contain a decorative display span with aria-hidden="true"', async function() {
    const display = await $('div.input-with-mask span.input-with-mask-display');
    await expect(display).toExist();
    const hidden = await display.getAttribute('aria-hidden');
    expect(hidden).toBe('true');
  });

  it('should contain an inner text input with aria-label', async function() {
    const input = await $('div.input-with-mask input.input-with-mask-control');
    await expect(input).toExist();
    const type = await input.getAttribute('type');
    expect(type).toBe('text');
    const label = await input.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
