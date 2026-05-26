// cymru-rhif-y-gwasanaeth-iechyd-gwladol-input.test.js
// CymruRhifYGwasanaethIechydGwladolInput component test

const path = require('path');

describe('CymruRhifYGwasanaethIechydGwladolInput', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'cymru-rhif-y-gwasanaeth-iechyd-gwladol-input.html'));
  });

  it('should render the input element with correct class', async function() {
    const el = await $('input.cymru-rhif-y-gwasanaeth-iechyd-gwladol-input');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('cymru-rhif-y-gwasanaeth-iechyd-gwladol-input');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('input.cymru-rhif-y-gwasanaeth-iechyd-gwladol-input');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should have autocomplete off', async function() {
    const el = await $('input.cymru-rhif-y-gwasanaeth-iechyd-gwladol-input');
    const value = await el.getAttribute('autocomplete');
    expect(value).toBe('off');
  });
});
