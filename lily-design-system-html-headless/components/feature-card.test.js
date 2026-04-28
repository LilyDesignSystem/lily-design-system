// feature-card.test.js
// FeatureCard component test

const path = require('path');

describe('FeatureCard', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'feature-card.html'));
  });

  it('should render the article element with correct class', async function() {
    const el = await $('article.feature-card');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('feature-card');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('article.feature-card');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should have a data-image-position attribute', async function() {
    const el = await $('article.feature-card');
    const pos = await el.getAttribute('data-image-position');
    expect(pos).not.toBeNull();
  });

  it('should contain a header with a heading', async function() {
    const header = await $('article.feature-card header.feature-card-header');
    await expect(header).toExist();
    const heading = await $('article.feature-card .feature-card-heading');
    await expect(heading).toExist();
  });

  it('should contain a description paragraph', async function() {
    const desc = await $('article.feature-card p.feature-card-description');
    await expect(desc).toExist();
  });
});
