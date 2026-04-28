// download-button.test.js
// DownloadButton component test

const path = require('path');

describe('DownloadButton', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'download-button.html'));
  });

  it('should render the anchor element with correct class', async function() {
    const el = await $('a.download-button');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('download-button');
  });

  it('should have an href attribute', async function() {
    const el = await $('a.download-button');
    const href = await el.getAttribute('href');
    expect(href).not.toBeNull();
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('a.download-button');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should have a download attribute', async function() {
    const el = await $('a.download-button');
    const download = await el.getAttribute('download');
    // download attribute should be present even if empty
    expect(download).not.toBeNull();
  });

  it('should support data-file-size and data-file-format attributes', async function() {
    const el = await $('a.download-button');
    const size = await el.getAttribute('data-file-size');
    const format = await el.getAttribute('data-file-format');
    expect(size).not.toBeNull();
    expect(format).not.toBeNull();
  });
});
