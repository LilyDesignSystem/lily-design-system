// file-upload-form.test.js
// File Upload Form page test

const path = require('path');

describe('File Upload Form', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, '..', 'pages', 'file-upload-form.html'));
  });

  it('should render the form with correct class', async function() {
    const el = await $('form.form');
    await expect(el).toExist();
    const label = await el.getAttribute('aria-label');
    expect(label).toBe('File upload');
  });

  it('should render the file upload area', async function() {
    const el = await $('div.file-upload');
    await expect(el).toExist();
  });

  it('should render the file input', async function() {
    const el = await $('input.file-input');
    await expect(el).toExist();
    const type = await el.getAttribute('type');
    expect(type).toBe('file');
  });

  it('should have the upload button disabled initially', async function() {
    const btn = await $('button#upload-btn');
    const disabled = await btn.getAttribute('disabled');
    expect(disabled).not.toBeNull();
  });

  it('should render the progress bar hidden initially', async function() {
    const el = await $('progress.progress');
    await expect(el).toExist();
    const hidden = await el.getAttribute('hidden');
    expect(hidden).not.toBeNull();
  });

  it('should have upload alert hidden initially', async function() {
    const el = await $('div.alert');
    const hidden = await el.getAttribute('hidden');
    expect(hidden).not.toBeNull();
  });
});
