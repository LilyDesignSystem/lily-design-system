// show-more.test.js
// ShowMore component test

const path = require('path');

describe('ShowMore', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'show-more.html'));
  });

  it('should render a div root with the correct class', async function() {
    const el = await $('div.show-more');
    await expect(el).toExist();
  });

  it('should contain a content div and a button', async function() {
    await expect(await $('.show-more > .show-more-content')).toExist();
    const btn = await $('.show-more > button.show-more-button');
    await expect(btn).toExist();
    expect(await btn.getAttribute('type')).toBe('button');
  });

  it('should start collapsed', async function() {
    expect(await (await $('.show-more-button')).getAttribute('aria-expanded')).toBe('false');
    expect(await (await $('.show-more-content')).getAttribute('data-expanded')).toBe('false');
  });

  it('should link the button to the content with aria-controls', async function() {
    const id = await (await $('.show-more-content')).getAttribute('id');
    expect(id).not.toBeNull();
    expect(await (await $('.show-more-button')).getAttribute('aria-controls')).toBe(id);
  });

  it('should show the more label while collapsed', async function() {
    const root = await $('.show-more');
    expect(await (await $('.show-more-button')).getText()).toBe(await root.getAttribute('data-more-label'));
  });

  it('should expand on click and show the less label', async function() {
    const root = await $('.show-more');
    const btn = await $('.show-more-button');
    await btn.click();
    expect(await btn.getAttribute('aria-expanded')).toBe('true');
    expect(await (await $('.show-more-content')).getAttribute('data-expanded')).toBe('true');
    expect(await btn.getText()).toBe(await root.getAttribute('data-less-label'));
  });

  it('should collapse again on a second click', async function() {
    const btn = await $('.show-more-button');
    await btn.click();
    await btn.click();
    expect(await btn.getAttribute('aria-expanded')).toBe('false');
    expect(await (await $('.show-more-content')).getAttribute('data-expanded')).toBe('false');
  });

  it('should toggle with Enter and Space on the focused button', async function() {
    const btn = await $('.show-more-button');
    await browser.execute(() => document.querySelector('.show-more-button').focus());
    await browser.keys('Enter');
    expect(await btn.getAttribute('aria-expanded')).toBe('true');
    await browser.keys(' ');
    expect(await btn.getAttribute('aria-expanded')).toBe('false');
  });

  it('should keep content in the accessibility tree (no aria-hidden, no inline style)', async function() {
    const content = await $('.show-more-content');
    expect(await content.getAttribute('aria-hidden')).toBeNull();
    expect(await content.getAttribute('style')).toBeNull();
  });
});
