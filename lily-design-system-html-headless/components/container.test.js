// container.test.js
const path = require('path');
describe('Container', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'container.html'));
  });
  it('renders the div element with class container', async function() {
    const el = await $('div.container');
    await expect(el).toExist();
  });
});
