// calendar-table-th.test.js
// CalendarTableTD component test

const path = require('path');

describe('CalendarTableTD', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'calendar-table-th.html'));
  });

  it('should render the th element with correct class', async function() {
    const el = await $('th.calendar-table-th');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('calendar-table-th');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('th.calendar-table-th');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
