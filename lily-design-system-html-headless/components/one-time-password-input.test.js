// one-time-password-input.test.js
// OneTimePasswordInput component test

const path = require('path');

describe('OneTimePasswordInput', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'one-time-password-input.html'));
  });

  it('should render an <input> with the correct class', async function() {
    const el = await $('input.one-time-password-input');
    await expect(el).toExist();
    expect(await el.getTagName()).toBe('input');
  });

  it('should be a text input (one real input, not segmented boxes)', async function() {
    expect(await (await $('.one-time-password-input')).getAttribute('type')).toBe('text');
    expect((await $$('.one-time-password-input')).length).toBe(1);
  });

  it('should hint a numeric keyboard', async function() {
    expect(await (await $('.one-time-password-input')).getAttribute('inputmode')).toBe('numeric');
  });

  it('should enable one-time-code autofill', async function() {
    expect(await (await $('.one-time-password-input')).getAttribute('autocomplete')).toBe('one-time-code');
  });

  it('should limit the length with maxlength mirrored in data-length', async function() {
    const el = await $('.one-time-password-input');
    const maxlength = await el.getAttribute('maxlength');
    expect(maxlength).not.toBeNull();
    expect(await el.getAttribute('data-length')).toBe(maxlength);
  });

  it('should truncate typed input to maxlength', async function() {
    const el = await $('.one-time-password-input');
    await el.click();
    await browser.keys('1234567890');
    expect(await el.getValue()).toBe('123456');
  });

  it('should have the numeric pattern by default', async function() {
    expect(await (await $('.one-time-password-input')).getAttribute('pattern')).toBe('[0-9]*');
  });

  it('should disable spellcheck and autocapitalize', async function() {
    const el = await $('.one-time-password-input');
    expect(await el.getAttribute('spellcheck')).toBe('false');
    expect(await el.getAttribute('autocapitalize')).toBe('off');
  });

  it('should have an aria-label attribute', async function() {
    const label = await (await $('.one-time-password-input')).getAttribute('aria-label');
    expect(label).not.toBeNull();
    expect(label).not.toBe('');
  });

  it('should be reachable with Tab', async function() {
    await browser.keys('Tab');
    const focused = await browser.execute(() => document.activeElement.className);
    expect(focused).toContain('one-time-password-input');
  });
});
