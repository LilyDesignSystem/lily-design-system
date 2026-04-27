// datetime-view.test.js
// DatetimeView component test

const path = require('path');

describe('DatetimeView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'datetime-view.html'));
  });

  it('should render the time element with correct class', async function() {
    const el = await $('time.datetime-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('datetime-view');
  });

  it('should have a datetime attribute', async function() {
    const el = await $('time.datetime-view');
    const dt = await el.getAttribute('datetime');
    expect(dt).not.toBeNull();
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('time.datetime-view');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
