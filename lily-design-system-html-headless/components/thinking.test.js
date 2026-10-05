// thinking.test.js
// Thinking component test

const path = require('path');

describe('Thinking', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'thinking.html'));
  });

  it('should render a <details> root with the correct class', async function() {
    const el = await $('details.thinking');
    await expect(el).toExist();
    expect(await el.getTagName()).toBe('details');
  });

  it('should render a summary with the label text', async function() {
    const s = await $('.thinking > summary.thinking-summary');
    await expect(s).toExist();
    expect((await s.getText()).length).toBeGreaterThan(0);
  });

  it('should render content in thinking-content', async function() {
    await expect(await $('.thinking > div.thinking-content')).toExist();
  });

  it('should be closed by default', async function() {
    expect(await browser.execute(() => document.querySelector('.thinking').open)).toBe(false);
  });

  it('should open when the summary is clicked', async function() {
    await (await $('.thinking-summary')).click();
    expect(await browser.execute(() => document.querySelector('.thinking').open)).toBe(true);
  });

  it('should toggle with Enter and Space on the focused summary', async function() {
    await browser.execute(() => document.querySelector('.thinking-summary').focus());
    await browser.keys('Enter');
    expect(await browser.execute(() => document.querySelector('.thinking').open)).toBe(true);
    await browser.keys(' ');
    expect(await browser.execute(() => document.querySelector('.thinking').open)).toBe(false);
  });

  it('should mark a streaming block with data-streaming and aria-busy', async function() {
    const el = await $('.thinking');
    expect(await el.getAttribute('data-streaming')).toBe('true');
    expect(await el.getAttribute('aria-busy')).toBe('true');
  });

  it('should hide the content while closed', async function() {
    expect(await (await $('.thinking-content')).isDisplayed()).toBe(false);
  });

  it('should show the content once opened', async function() {
    await (await $('.thinking-summary')).click();
    expect(await (await $('.thinking-content')).isDisplayed()).toBe(true);
  });
});
