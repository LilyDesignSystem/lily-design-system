// calendar-table-td.test.js
// CalendarTableTD component test

const path = require('path');

describe('CalendarTableTD', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'calendar-table-td.html'));
  });

  it('should render the td element with correct class', async function() {
    const el = await $('td.calendar-table-td');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('calendar-table-td');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('td.calendar-table-td');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
