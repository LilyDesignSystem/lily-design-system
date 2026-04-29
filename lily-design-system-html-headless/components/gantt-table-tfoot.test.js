// gantt-table-tfoot.test.js
// GanttTableTfoot component test

const path = require('path');

describe('GanttTableTfoot', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'gantt-table-tfoot.html'));
  });

  it('should render the tfoot element with correct class', async function() {
    const el = await $('tfoot.gantt-table-tfoot');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('gantt-table-tfoot');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('tfoot.gantt-table-tfoot');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
