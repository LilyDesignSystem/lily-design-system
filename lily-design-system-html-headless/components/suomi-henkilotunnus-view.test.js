// suomi-henkilotunnus-view.test.js
// SuomiHenkilotunnusView component test

const path = require('path');

describe('SuomiHenkilotunnusView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'suomi-henkilotunnus-view.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.suomi-henkilotunnus-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('suomi-henkilotunnus-view');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('span.suomi-henkilotunnus-view');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
