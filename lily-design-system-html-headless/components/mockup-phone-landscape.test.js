// mockup-phone-landscape.test.js
const path = require('path');
describe('MockupPhoneLandscape', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'mockup-phone-landscape.html'));
  });
  it('renders the div element with class mockup-phone-landscape', async function() {
    const el = await $('div.mockup-phone-landscape');
    await expect(el).toExist();
  });
});
