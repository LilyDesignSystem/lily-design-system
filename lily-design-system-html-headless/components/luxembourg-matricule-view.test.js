// luxembourg-matricule-view.test.js
// LuxembourgMatriculeView component test

const path = require('path');

describe('LuxembourgMatriculeView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'luxembourg-matricule-view.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.luxembourg-matricule-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('luxembourg-matricule-view');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('span.luxembourg-matricule-view');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
