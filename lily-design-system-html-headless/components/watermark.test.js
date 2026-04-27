// watermark.test.js
// Watermark component test

const path = require('path');

describe('Watermark', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'watermark.html'));
  });

  it('should render a div with the watermark class', async function() {
    const el = await $('div.watermark');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('watermark');
  });

  it('should expose data-rotate and data-gap on the wrapper', async function() {
    const el = await $('div.watermark');
    const rotate = await el.getAttribute('data-rotate');
    const gap = await el.getAttribute('data-gap');
    expect(rotate).not.toBeNull();
    expect(gap).not.toBeNull();
  });

  it('should contain a decorative overlay marked aria-hidden', async function() {
    const overlay = await $('div.watermark-overlay');
    await expect(overlay).toExist();
    const ariaHidden = await overlay.getAttribute('aria-hidden');
    expect(ariaHidden).toBe('true');
  });

  it('should expose data-text and data-image-url on the overlay', async function() {
    const overlay = await $('div.watermark-overlay');
    const text = await overlay.getAttribute('data-text');
    const imageUrl = await overlay.getAttribute('data-image-url');
    expect(text).not.toBeNull();
    expect(imageUrl).not.toBeNull();
  });
});
