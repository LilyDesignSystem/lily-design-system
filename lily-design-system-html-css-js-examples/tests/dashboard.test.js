// dashboard.test.js
// Dashboard page test

const path = require('path');

describe('Dashboard', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, '..', 'pages', 'dashboard.html'));
  });

  it('should render the banner with sprint info', async function() {
    const el = await $('div.banner');
    await expect(el).toExist();
    const role = await el.getAttribute('role');
    expect(role).toBe('banner');
  });

  it('should render three cards', async function() {
    const cards = await $$('div.card');
    expect(cards.length).toBe(3);
  });

  it('should render the progress circle', async function() {
    const el = await $('div.progress-circle');
    await expect(el).toExist();
    const role = await el.getAttribute('role');
    expect(role).toBe('progressbar');
  });

  it('should render the progress bar for test coverage', async function() {
    const el = await $('progress.progress');
    await expect(el).toExist();
    const value = await el.getAttribute('value');
    expect(value).toBe('87');
  });

  it('should render badges', async function() {
    const badges = await $$('span.badge');
    expect(badges.length).toBeGreaterThan(0);
  });

  it('should render the data table with correct aria-label', async function() {
    const el = await $('table.data-table');
    await expect(el).toExist();
    const label = await el.getAttribute('aria-label');
    expect(label).toBe('Sprint tasks');
  });

  it('should have five task rows in the table', async function() {
    const rows = await $$('table.data-table tbody tr');
    expect(rows.length).toBe(5);
  });

  it('should compute stats correctly via JavaScript', async function() {
    const completed = await $('#completed-count');
    const text = await completed.getText();
    expect(text).toBe('1');
  });
});
