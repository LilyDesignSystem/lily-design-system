// progress-bar.test.js
const path = require('path');
describe('ProgressBar', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'progress-bar.html'));
  });
  it('renders the div element with class progress-bar', async function() {
    const el = await $('div.progress-bar');
    await expect(el).toExist();
  });
});
