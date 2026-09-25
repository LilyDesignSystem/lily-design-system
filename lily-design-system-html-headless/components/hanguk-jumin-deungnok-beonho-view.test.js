// hanguk-jumin-deungnok-beonho-view.test.js
// HangukJuminDeungnokBeonhoView component test

const path = require('path');

describe('HangukJuminDeungnokBeonhoView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'hanguk-jumin-deungnok-beonho-view.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.hanguk-jumin-deungnok-beonho-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('hanguk-jumin-deungnok-beonho-view');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('span.hanguk-jumin-deungnok-beonho-view');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
