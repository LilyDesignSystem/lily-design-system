// indonesia-nomor-induk-kependudukan-view.test.js
// IndonesiaNomorIndukKependudukanView component test

const path = require('path');

describe('IndonesiaNomorIndukKependudukanView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'indonesia-nomor-induk-kependudukan-view.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.indonesia-nomor-induk-kependudukan-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('indonesia-nomor-induk-kependudukan-view');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('span.indonesia-nomor-induk-kependudukan-view');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
