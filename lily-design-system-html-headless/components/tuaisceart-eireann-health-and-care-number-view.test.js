// tuaisceart-eireann-health-and-care-number-view.test.js
// TuaisceartEireannHealthAndCareNumberView component test

const path = require('path');

describe('TuaisceartEireannHealthAndCareNumberView', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'tuaisceart-eireann-health-and-care-number-view.html'));
  });

  it('should render the span element with correct class', async function() {
    const el = await $('span.tuaisceart-eireann-health-and-care-number-view');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('tuaisceart-eireann-health-and-care-number-view');
  });
});
