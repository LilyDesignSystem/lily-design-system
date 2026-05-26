// belgique-numero-de-registre-national-view.test.js
// BelgiqueNumeroDeRegistreNationalView component test

const path = require('path');

describe('BelgiqueNumeroDeRegistreNationalView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'belgique-numero-de-registre-national-view.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.belgique-numero-de-registre-national-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('belgique-numero-de-registre-national-view');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('span.belgique-numero-de-registre-national-view');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
