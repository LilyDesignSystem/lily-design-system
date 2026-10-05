// multi-select.test.js
// MultiSelect component test

const path = require('path');

describe('MultiSelect', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'multi-select.html'));
  });

  it('should render a <select> with the correct class', async function() {
    const el = await $('select.multi-select');
    await expect(el).toExist();
    expect(await el.getTagName()).toBe('select');
  });

  it('should allow multiple selection', async function() {
    expect(await browser.execute(() => document.querySelector('.multi-select').multiple)).toBe(true);
  });

  it('should have an aria-label attribute', async function() {
    const label = await (await $('.multi-select')).getAttribute('aria-label');
    expect(label).not.toBeNull();
    expect(label).not.toBe('');
  });

  it('should render option children', async function() {
    expect((await $$('.multi-select option')).length).toBeGreaterThan(1);
  });

  it('should expose the size attribute as visible rows', async function() {
    expect(await (await $('.multi-select')).getAttribute('size')).toBe('4');
  });

  it('should be a listbox with multiselectable semantics natively', async function() {
    expect(await browser.execute(() => document.querySelector('.multi-select').type)).toBe('select-multiple');
  });

  it('should select several options and expose them as an array of values', async function() {
    await browser.execute(() => {
      const o = document.querySelectorAll('.multi-select option');
      o[0].selected = true; o[2].selected = true;
    });
    const values = await browser.execute(() =>
      Array.from(document.querySelector('.multi-select').selectedOptions).map((o) => o.value));
    expect(values).toEqual(['cheese', 'peppers']);
  });

  it('should be keyboard focusable with Tab', async function() {
    await browser.keys('Tab');
    expect(await browser.execute(() => document.activeElement.className)).toContain('multi-select');
  });
});
