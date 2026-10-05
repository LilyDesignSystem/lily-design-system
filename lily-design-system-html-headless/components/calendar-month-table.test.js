// calendar-month-table.test.js
// CalendarMonthTable component test

const path = require('path');

describe('CalendarMonthTable', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'calendar-month-table.html'));
  });

  it('should render a table element', async function() {
    const el = await $('.calendar-month-table');
    await expect(el).toExist();
    expect(await el.getTagName()).toBe('table');
  });

  it('should have the calendar-month-table base class as its first class', async function() {
    const el = await $('table');
    expect((await el.getAttribute('class')).split(' ')[0]).toBe('calendar-month-table');
  });

  it('should have role="grid"', async function() {
    const el = await $('.calendar-month-table');
    expect(await el.getAttribute('role')).toBe('grid');
  });

  it('should have a non-empty aria-label', async function() {
    const el = await $('.calendar-month-table');
    const label = await el.getAttribute('aria-label');
    expect(label).toBe('January 2025');
  });

  it('should mark the view as data-view="month"', async function() {
    const el = await $('.calendar-month-table');
    expect(await el.getAttribute('data-view')).toBe('month');
  });

  it('should render the optional caption as the first child', async function() {
    const cap = await $('.calendar-month-table > caption');
    await expect(cap).toExist();
    const first = await browser.execute(function(sel) { return document.querySelector(sel).firstElementChild.tagName; }, '.calendar-month-table');
    expect(first).toBe('CAPTION');
  });

  it('should hold the consumer-supplied body and cells', async function() {
    const td = await $('.calendar-month-table .calendar-table-td');
    await expect(td).toExist();
    expect(await td.getText()).toBe('1');
  });

  it('should not ship inline styles', async function() {
    const el = await $('.calendar-month-table');
    expect(await el.getAttribute('style')).toBeNull();
  });
});
