// gantt-table-td.test.js
// GanttTableTD component test

const path = require('path');

describe('GanttTableTD', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'gantt-table-td.html'));
  });

  it('should render the td element with correct class', async function() {
    const el = await $('td.gantt-table-td');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('gantt-table-td');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('td.gantt-table-td');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
