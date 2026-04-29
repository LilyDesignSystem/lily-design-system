// kanban-table-td.test.js
// KanbanTableTD component test

const path = require('path');

describe('KanbanTableTD', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'kanban-table-td.html'));
  });

  it('should render the td element with correct class', async function() {
    const el = await $('td.kanban-table-td');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('kanban-table-td');
  });

  it('should have an aria-label attribute', async function() {
    const el = await $('td.kanban-table-td');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
});
