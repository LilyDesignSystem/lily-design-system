// australia-individual-healthcare-identifier-view.test.js
// AustraliaIndividualHealthcareIdentifierView component test

const path = require('path');

describe('AustraliaIndividualHealthcareIdentifierView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'australia-individual-healthcare-identifier-view.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.australia-individual-healthcare-identifier-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('australia-individual-healthcare-identifier-view');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('span.australia-individual-healthcare-identifier-view');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
