// nederland-burgerservice-nummer-view.test.js
// NederlandBurgerserviceNummerView component test

const path = require('path');

describe('NederlandBurgerserviceNummerView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'nederland-burgerservice-nummer-view.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.nederland-burgerservice-nummer-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('nederland-burgerservice-nummer-view');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('span.nederland-burgerservice-nummer-view');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
