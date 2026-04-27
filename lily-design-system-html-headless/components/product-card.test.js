// product-card.test.js
// ProductCard component test

const path = require('path');

describe('ProductCard', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'product-card.html'));
  });

  it('should render the article element with correct class', async function() {
    const el = await $('article.product-card');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('product-card');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('article.product-card');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should contain a header with name and price', async function() {
    const header = await $('article.product-card header.product-card-header');
    await expect(header).toExist();
    const name = await $('article.product-card h3.product-card-name');
    await expect(name).toExist();
    const price = await $('article.product-card p.product-card-price');
    await expect(price).toExist();
  });

  it('should contain a product image element', async function() {
    const img = await $('article.product-card img.product-card-image');
    await expect(img).toExist();
  });
});
