// step-list-item.test.js
// StepListItem component test

const path = require('path');

describe('StepListItem', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'step-list-item.html'));
  });

  it('should render an li element with the step-list-item class', async function() {
    const el = await $('li.step-list-item');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('step-list-item');
  });

  it('should expose data-status for state', async function() {
    const el = await $('li.step-list-item');
    const status = await el.getAttribute('data-status');
    expect(status).not.toBeNull();
  });

  it('should expose an aria-label attribute', async function() {
    const el = await $('li.step-list-item');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
