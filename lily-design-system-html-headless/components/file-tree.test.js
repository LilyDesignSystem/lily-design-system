// file-tree.test.js
// FileTree component test
//
// Fixture (file-tree.html):
//   src (open) > [lib (open) > [index.ts], app.ts]; docs (closed) > [guide.md]; readme.md; etc (closed) > [x.txt]

const path = require('path');

async function focus(id) {
  await browser.execute((i) => document.querySelector('[data-id="' + i + '"]').focus(), id);
}
async function active() {
  return browser.execute(() => document.activeElement.getAttribute('data-id'));
}
async function expanded(id) {
  return browser.execute((i) => document.querySelector('[data-id="' + i + '"]').getAttribute('aria-expanded'), id);
}
async function tabindex(id) {
  return browser.execute((i) => document.querySelector('[data-id="' + i + '"]').getAttribute('tabindex'), id);
}

describe('FileTree', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, 'file-tree.html'));
  });

  it('should render a <ul role=tree> with class and aria-label', async function() {
    const el = await $('ul.file-tree');
    await expect(el).toExist();
    expect(await el.getAttribute('role')).toBe('tree');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
    expect(label).not.toBe('');
  });

  it('should use roving tabindex: exactly one item has tabindex=0, the first', async function() {
    const stops = await browser.execute(() =>
      Array.from(document.querySelectorAll("[role='treeitem'][tabindex='0']")).map((e) => e.getAttribute('data-id')));
    expect(stops).toEqual(['src']);
    expect(await tabindex('lib')).toBe('-1');
  });

  it('should move the tab stop with focus', async function() {
    await focus('src');
    await browser.keys('ArrowDown');
    expect(await tabindex('lib')).toBe('0');
    expect(await tabindex('src')).toBe('-1');
    expect(await browser.execute(() => document.querySelectorAll("[tabindex='0']").length)).toBe(1);
  });

  it('ArrowDown/ArrowUp should skip closed folder contents', async function() {
    await focus('readme');
    await browser.keys('ArrowUp');
    expect(await active()).toBe('docs');
    await browser.keys(['ArrowDown', 'ArrowDown']);
    expect(await active()).toBe('etc');
  });

  it('ArrowDown/ArrowUp should walk into open folders', async function() {
    await focus('src');
    await browser.keys('ArrowDown');
    expect(await active()).toBe('lib');
    await browser.keys('ArrowDown');
    expect(await active()).toBe('index');
    await browser.keys('ArrowUp');
    expect(await active()).toBe('lib');
  });

  it('should not wrap at the first or last item', async function() {
    await focus('src');
    await browser.keys('ArrowUp');
    expect(await active()).toBe('src');
    await focus('etc');
    await browser.keys('ArrowDown');
    expect(await active()).toBe('etc');
  });

  it('Home and End should jump to the first and last visible items', async function() {
    await focus('lib');
    await browser.keys('End');
    expect(await active()).toBe('etc');
    await browser.keys('Home');
    expect(await active()).toBe('src');
  });

  it('ArrowRight on a closed folder should open it', async function() {
    await focus('docs');
    await browser.keys('ArrowRight');
    expect(await expanded('docs')).toBe('true');
    expect(await active()).toBe('docs');
  });

  it('ArrowRight on an open folder should move to its first child', async function() {
    await focus('src');
    await browser.keys('ArrowRight');
    expect(await active()).toBe('lib');
  });

  it('ArrowRight on a file should do nothing', async function() {
    await focus('readme');
    await browser.keys('ArrowRight');
    expect(await active()).toBe('readme');
  });

  it('ArrowLeft on an open folder should close it', async function() {
    await focus('src');
    await browser.keys('ArrowLeft');
    expect(await expanded('src')).toBe('false');
    expect(await active()).toBe('src');
  });

  it('ArrowLeft on a child should move focus to its parent folder', async function() {
    await focus('index');
    await browser.keys('ArrowLeft');
    expect(await active()).toBe('lib');
    await browser.keys('ArrowLeft');
    expect(await expanded('lib')).toBe('false');
    await browser.keys('ArrowLeft');
    expect(await active()).toBe('src');
  });

  it('closing a folder should remove its children from keyboard order', async function() {
    await focus('src');
    await browser.keys(['ArrowLeft', 'ArrowDown']);
    expect(await active()).toBe('docs');
  });

  it('* should expand all closed sibling folders at the focused level', async function() {
    await focus('readme');
    await browser.keys('*');
    expect(await expanded('docs')).toBe('true');
    expect(await expanded('etc')).toBe('true');
    expect(await expanded('src')).toBe('true');
  });

  it('* should not expand folders at other levels', async function() {
    await browser.execute(() => {
      document.querySelector('[data-id="lib"]').setAttribute('aria-expanded', 'false');
    });
    await focus('docs');
    await browser.keys('*');
    expect(await expanded('etc')).toBe('true');
    expect(await expanded('lib')).toBe('false');
  });

  it('typeahead should move to the next visible item starting with the character', async function() {
    await focus('src');
    await browser.keys('r');
    expect(await active()).toBe('readme');
  });

  it('typeahead should ignore items hidden in closed folders', async function() {
    await focus('readme');
    await browser.keys('g');
    expect(await active()).toBe('readme');
  });

  it('typeahead should match a multi-character prefix', async function() {
    await focus('src');
    await browser.keys(['a', 'p']);
    expect(await active()).toBe('app');
  });

  it("typeahead should match a folder's own text, not its nested children", async function() {
    await focus('readme');
    await browser.keys('s');
    expect(await active()).toBe('src');
  });

  it('typeahead should not match text that only appears in a nested child', async function() {
    // "guide.md" is nested in a closed folder (docs); "index.ts" is nested in lib.
    // Typing "l" from readme must reach "lib" (own text), never treat src as "l...".
    await focus('readme');
    await browser.keys('l');
    expect(await active()).toBe('lib');
  });

  it('Enter and Space should activate the focused item (click)', async function() {
    await browser.execute(() => {
      window.__clicks = [];
      document.querySelector('[data-id="readme"]').addEventListener('click', () => window.__clicks.push('readme'));
    });
    await focus('readme');
    await browser.keys('Enter');
    await browser.keys(' ');
    expect(await browser.execute(() => window.__clicks)).toEqual(['readme', 'readme']);
  });

  it('should move the tab stop to a visible item if the stop gets hidden', async function() {
    await focus('index');
    await browser.execute(() => document.querySelector('[data-id="src"]').setAttribute('aria-expanded', 'false'));
    await browser.pause(100); // MutationObserver is async
    const stops = await browser.execute(() =>
      Array.from(document.querySelectorAll("[role='treeitem'][tabindex='0']")).map((e) => e.getAttribute('data-id')));
    expect(stops.length).toBe(1);
    expect(stops[0]).not.toBe('index');
  });
});
