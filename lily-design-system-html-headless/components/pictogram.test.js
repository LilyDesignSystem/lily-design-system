// pictogram.test.js
// Pictogram component test

const path = require('path');

describe('Pictogram', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'pictogram.html'));
  });

  it('should render the figure element with correct class', async function() {
    const el = await $('figure.pictogram');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('pictogram');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('figure.pictogram');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should have a data-layout attribute', async function() {
    const el = await $('figure.pictogram');
    const layout = await el.getAttribute('data-layout');
    expect(layout).not.toBeNull();
  });

  it('should contain an icon container with aria-hidden="true"', async function() {
    const icon = await $('figure.pictogram .pictogram-icon');
    await expect(icon).toExist();
    const hidden = await icon.getAttribute('aria-hidden');
    expect(hidden).toBe('true');
  });

  it('should contain a figcaption with heading and description', async function() {
    const caption = await $('figure.pictogram figcaption.pictogram-caption');
    await expect(caption).toExist();
    const heading = await $('figure.pictogram .pictogram-heading');
    await expect(heading).toExist();
    const desc = await $('figure.pictogram .pictogram-description');
    await expect(desc).toExist();
  });
});
