// tuaisceart-eireann-health-and-care-number-input.test.js
// TuaisceartEireannHealthAndCareNumberInput component test

const path = require('path');

describe('TuaisceartEireannHealthAndCareNumberInput', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'tuaisceart-eireann-health-and-care-number-input.html'));
  });

  it('should render the input element with correct class', async function() {
    const el = await $('input.tuaisceart-eireann-health-and-care-number-input');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('tuaisceart-eireann-health-and-care-number-input');
  });
});
