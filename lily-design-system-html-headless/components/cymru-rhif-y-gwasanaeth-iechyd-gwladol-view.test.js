// cymru-rhif-y-gwasanaeth-iechyd-gwladol-view.test.js
// CymruRhifYGwasanaethIechydGwladolView component test

const path = require('path');

describe('CymruRhifYGwasanaethIechydGwladolView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'cymru-rhif-y-gwasanaeth-iechyd-gwladol-view.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.cymru-rhif-y-gwasanaeth-iechyd-gwladol-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('cymru-rhif-y-gwasanaeth-iechyd-gwladol-view');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('span.cymru-rhif-y-gwasanaeth-iechyd-gwladol-view');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
