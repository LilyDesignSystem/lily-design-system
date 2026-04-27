// statistic.test.js
// Statistic component test

const path = require('path');

describe('Statistic', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'statistic.html'));
  });

  it('should render a div with the statistic class', async function() {
    const el = await $('div.statistic');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('statistic');
  });

  it('should have role="group"', async function() {
    const el = await $('div.statistic');
    const role = await el.getAttribute('role');
    expect(role).toBe('group');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('div.statistic');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should contain a statistic-title and statistic-value element', async function() {
    const title = await $('div.statistic-title');
    const value = await $('div.statistic-value');
    await expect(title).toExist();
    await expect(value).toExist();
  });

  it('should contain prefix and suffix span placeholders', async function() {
    const prefix = await $('span.statistic-prefix');
    const suffix = await $('span.statistic-suffix');
    await expect(prefix).toExist();
    await expect(suffix).toExist();
  });
});
