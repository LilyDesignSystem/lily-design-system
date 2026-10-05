// multi-select-with-extras.test.js
// MultiSelectWithExtras component test

const path = require('path');

describe('MultiSelectWithExtras', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'multi-select-with-extras.html'));
  });

  it('should render a wrapper div with the correct class', async function() {
    const el = await $('div.multi-select-with-extras');
    await expect(el).toExist();
    expect(await el.getTagName()).toBe('div');
  });

  it('should wrap a native multiple <select>', async function() {
    const el = await $('div.multi-select-with-extras > select');
    await expect(el).toExist();
    expect(await el.getAttribute('multiple')).not.toBeNull();
  });

  it('should put aria-label on the select, not the wrapper', async function() {
    const sel = await $('.multi-select-with-extras select');
    const label = await sel.getAttribute('aria-label');
    expect(label).not.toBeNull();
    expect(label).not.toBe('');
    expect(await (await $('.multi-select-with-extras')).getAttribute('aria-label')).toBeNull();
  });

  it('should render before and after content around the select', async function() {
    const order = await browser.execute(() =>
      Array.from(document.querySelector('.multi-select-with-extras').children).map((c) => c.tagName.toLowerCase()));
    expect(order).toEqual(['span', 'select', 'span']);
  });

  it('should render option children', async function() {
    expect((await $$('.multi-select-with-extras option')).length).toBeGreaterThan(1);
  });

  it('should expose size as visible rows on the select', async function() {
    expect(await (await $('.multi-select-with-extras select')).getAttribute('size')).toBe('4');
  });

  it('should select several options as an array of values', async function() {
    const values = await browser.execute(() => {
      const o = document.querySelectorAll('.multi-select-with-extras option');
      o[1].selected = true; o[3].selected = true;
      return Array.from(document.querySelector('.multi-select-with-extras select').selectedOptions).map((x) => x.value);
    });
    expect(values).toEqual(['olives', 'mushrooms']);
  });
});
