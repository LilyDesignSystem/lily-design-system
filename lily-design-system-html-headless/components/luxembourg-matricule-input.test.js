// luxembourg-matricule-input.test.js
// LuxembourgMatriculeInput component test

const path = require('path');

describe('LuxembourgMatriculeInput', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'luxembourg-matricule-input.html'));
  });

  it('should render the input element with correct class', async function() {
    const el = await $('input.luxembourg-matricule-input');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('luxembourg-matricule-input');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('input.luxembourg-matricule-input');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should have autocomplete off', async function() {
    const el = await $('input.luxembourg-matricule-input');
    const value = await el.getAttribute('autocomplete');
    expect(value).toBe('off');
  });
});
