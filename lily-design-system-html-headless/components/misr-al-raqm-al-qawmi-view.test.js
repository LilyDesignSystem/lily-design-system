// misr-al-raqm-al-qawmi-view.test.js
// MisrAlRaqmAlQawmiView component test

const path = require('path');

describe('MisrAlRaqmAlQawmiView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'misr-al-raqm-al-qawmi-view.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.misr-al-raqm-al-qawmi-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('misr-al-raqm-al-qawmi-view');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('span.misr-al-raqm-al-qawmi-view');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
