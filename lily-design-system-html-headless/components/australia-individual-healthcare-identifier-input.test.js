// australia-individual-healthcare-identifier-input.test.js
// AustraliaIndividualHealthcareIdentifierInput component test

const path = require('path');

describe('AustraliaIndividualHealthcareIdentifierInput', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'australia-individual-healthcare-identifier-input.html'));
  });

  it('should render the input element with correct class', async function() {
    const el = await $('input.australia-individual-healthcare-identifier-input');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('australia-individual-healthcare-identifier-input');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('input.australia-individual-healthcare-identifier-input');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });

  it('should have autocomplete off', async function() {
    const el = await $('input.australia-individual-healthcare-identifier-input');
    const value = await el.getAttribute('autocomplete');
    expect(value).toBe('off');
  });
});
