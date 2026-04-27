// step-list.test.js
// StepList component test

const path = require('path');

describe('StepList', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'step-list.html'));
  });

  it('should render an ol element with the step-list class', async function() {
    const el = await $('ol.step-list');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('step-list');
  });

  it('should expose an aria-label attribute', async function() {
    const el = await $('ol.step-list');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should expose a data-current attribute hook', async function() {
    const el = await $('ol.step-list');
    const current = await el.getAttribute('data-current');
    expect(current).not.toBeNull();
  });
});
