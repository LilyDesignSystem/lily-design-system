// go-to-next-section.test.js
const path = require('path');
describe('GoToNextSection', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'go-to-next-section.html'));
  });
  it('renders the a element with class go-to-next-section', async function() {
    const el = await $('a.go-to-next-section');
    await expect(el).toExist();
  });
});
