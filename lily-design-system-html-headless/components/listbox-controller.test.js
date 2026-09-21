// listbox-controller.test.js
// ListboxController — shared APG listbox keyboard behaviour, extracted
// from the six *-picker custom elements in lily-design-system-html-helpers
// (see the class doc comment in listbox-controller.js). Real-browser
// harness: listbox-controller.fixture.html, not a shipped component.

const path = require("path");

async function open(query = "") {
  await browser.url(
    "file://" + path.resolve(__dirname, "listbox-controller.fixture.html") + query
  );
}

async function calls() {
  return browser.execute(() => window.__calls);
}

async function keydown(selector, key, modifiers = {}) {
  await browser.execute(
    (sel, k, mods) => {
      document
        .querySelector(sel)
        .dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true, ...mods }));
    },
    selector,
    key,
    modifiers
  );
}

describe("ListboxController", function () {
  it("does not move the cursor until setActiveIndex is called", async function () {
    await open();
    const c = await calls();
    expect(c.activeIndex).toEqual([]);
  });

  it("ArrowDown/ArrowUp move the cursor and wrap by default", async function () {
    await open();
    await browser.execute(() => window.__controller.setActiveIndex(2));
    await keydown("#list", "ArrowDown");
    let c = await calls();
    expect(c.activeIndex[c.activeIndex.length - 1]).toBe(0); // wrapped

    await keydown("#list", "ArrowUp");
    c = await calls();
    expect(c.activeIndex[c.activeIndex.length - 1]).toBe(2); // wrapped the other way
  });

  it("ArrowDown clamps at the last option when clamp=true", async function () {
    await open("?clamp=true");
    await browser.execute(() => window.__controller.setActiveIndex(2));
    await keydown("#list", "ArrowDown");
    const c = await calls();
    expect(c.activeIndex[c.activeIndex.length - 1]).toBe(2); // clamped, not wrapped to 0
  });

  it("Home and End jump to the first and last option", async function () {
    await open();
    await browser.execute(() => window.__controller.setActiveIndex(1));
    await keydown("#list", "End");
    await keydown("#list", "Home");
    const c = await calls();
    expect(c.activeIndex.slice(-2)).toEqual([2, 0]);
  });

  it("Enter invokes onActivate with the active index", async function () {
    await open();
    await browser.execute(() => window.__controller.setActiveIndex(1));
    await keydown("#list", "Enter");
    const c = await calls();
    expect(c.activate).toEqual([1]);
  });

  it("Escape invokes onEscape", async function () {
    await open();
    await keydown("#list", "Escape");
    const c = await calls();
    expect(c.escape).toBe(1);
  });

  it("Tab invokes onTabOut", async function () {
    await open();
    await keydown("#list", "Tab");
    const c = await calls();
    expect(c.tabOut).toBe(1);
  });

  it("typeahead moves to the next option starting with the typed character, only when enabled", async function () {
    await open("?typeahead=true");
    await browser.execute(() => window.__controller.setActiveIndex(0));
    await keydown("#list", "b");
    let c = await calls();
    expect(c.activeIndex[c.activeIndex.length - 1]).toBe(1); // Banana

    await open(); // typeahead not enabled
    await browser.execute(() => window.__controller.setActiveIndex(0));
    await keydown("#list", "b");
    c = await calls();
    expect(c.activeIndex).toEqual([0]); // only the setActiveIndex(0) call, "b" ignored
  });

  it("PageDown/PageUp move by pageSize, clamped", async function () {
    await open("?clamp=true&pageSize=1");
    await browser.execute(() => window.__controller.setActiveIndex(0));
    await keydown("#list", "PageDown");
    let c = await calls();
    expect(c.activeIndex[c.activeIndex.length - 1]).toBe(1);

    await keydown("#list", "PageDown");
    await keydown("#list", "PageDown");
    c = await calls();
    expect(c.activeIndex[c.activeIndex.length - 1]).toBe(2); // clamped at the end
  });

  it("aria-activedescendant tracks the cursor via the onActiveIndexChange callback", async function () {
    await open();
    await browser.execute(() => window.__controller.setActiveIndex(1));
    const list = await $("#list");
    expect(await list.getAttribute("aria-activedescendant")).toBe("opt-1");
  });
});
