// go-to-previous-section.test.js
const path = require('path');
describe('GoToPreviousSection', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'go-to-previous-section.html'));
  });
  it('renders the a element with class go-to-previous-section', async function() {
    const el = await $('a.go-to-previous-section');
    await expect(el).toExist();
  });
});
