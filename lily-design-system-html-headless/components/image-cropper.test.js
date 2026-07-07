// image-cropper.test.js
// ImageCropper component test

const path = require('path');

describe('ImageCropper', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'image-cropper.html'));
  });

  it('should render the div element with correct class', async function() {
    const el = await $('div.image-cropper');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('image-cropper');
  });

  it('should have the application role', async function() {
    const el = await $('div.image-cropper');
    const role = await el.getAttribute('role');
    expect(role).toBe('application');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('div.image-cropper');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
