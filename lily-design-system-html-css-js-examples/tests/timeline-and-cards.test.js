// timeline-and-cards.test.js
// Timeline and Cards page test

const path = require('path');

describe('Timeline and Cards', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, '..', 'pages', 'timeline-and-cards.html'));
  });

  it('should render the filter card', async function() {
    const cards = await $$('div.card');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('should render date inputs', async function() {
    const inputs = await $$('input.date-input');
    expect(inputs.length).toBe(2);
  });

  it('should render the timeline list', async function() {
    const el = await $('ol.timeline-list');
    await expect(el).toExist();
    const label = await el.getAttribute('aria-label');
    expect(label).toBe('Project milestones');
  });

  it('should render four timeline items by default', async function() {
    const items = await $$('li.timeline-list-item');
    expect(items.length).toBe(4);
  });

  it('should render cards within timeline items', async function() {
    const cards = await $$('li.timeline-list-item div.card');
    expect(cards.length).toBe(4);
  });

  it('should render badges with status types', async function() {
    const badges = await $$('li.timeline-list-item span.badge');
    expect(badges.length).toBeGreaterThan(0);
  });

  it('should render summary lists within timeline cards', async function() {
    const lists = await $$('li.timeline-list-item ol.summary-list');
    expect(lists.length).toBe(4);
  });

  it('should render the project summary list', async function() {
    const el = await $('ol.summary-list[aria-label="Overall project summary"]');
    await expect(el).toExist();
  });

  it('should render summary list items', async function() {
    const items = await $$('ol.summary-list[aria-label="Overall project summary"] li.summary-list-item');
    expect(items.length).toBe(4);
  });

  it('should filter timeline by date range', async function() {
    const startInput = await $('input#filter-start');
    await startInput.setValue('2025-06-01');
    const items = await $$('li.timeline-list-item');
    expect(items.length).toBeLessThan(4);
  });
});
