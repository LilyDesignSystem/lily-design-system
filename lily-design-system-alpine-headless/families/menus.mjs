// Family: menus. lilyMenu (menu, menu-bar), lilyDropdownMenu (dropdown-menu,
// split-button, action-group), lilyContextMenu (context-menu), lilyCollapsible
// (hamburger-menu); float-button has no behaviour in its contract.

const press = `const press = async (target, key, init = {}) => {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init }));
  await tick();
};`;

const rovingMenu = (slug, role, horizontal, itemClass) => {
  const next = horizontal ? "ArrowRight" : "ArrowDown", prev = horizontal ? "ArrowLeft" : "ArrowUp";
  return {
    tag: "div", keyboard: `${next}/${prev} move focus (wrapping), Home/End jump; one item is in the tab order`,
    aria: `role="${role}" with aria-label; items are role="menuitem" with roving tabindex`,
    markup: `<div class="${slug}" role="${role}" aria-label="" x-data="lilyMenu('${horizontal ? "horizontal" : "vertical"}')" x-bind="menu">
  <button class="${itemClass}" x-bind="item('one')"><!-- Consumer provides label --></button>
  <button class="${itemClass}" x-bind="item('two')"><!-- Consumer provides label --></button>
  <button class="${itemClass}" x-bind="item('three')"><!-- Consumer provides label --></button>
</div>`,
    sel: `div.${slug}`,
    extra: `const items = () => [...document.querySelectorAll(".${itemClass}")];\n${press}`,
    test: `
  it('is role="${role}" with one tabbable menuitem', async () => {
    await mount("${slug}");
    expect(el().getAttribute("role")).toBe("${role}");
    expect(items().map((i) => i.getAttribute("role"))).toEqual(["menuitem", "menuitem", "menuitem"]);
    expect(items().map((i) => i.getAttribute("tabindex"))).toEqual(["0", "-1", "-1"]);
  });
  it("${next} / ${prev} move focus with wrapping, and the tab stop follows", async () => {
    await mount("${slug}");
    items()[0].focus();
    await press(items()[0], "${prev}");
    expect(document.activeElement).toBe(items()[2]);
    expect(items().map((i) => i.getAttribute("tabindex"))).toEqual(["-1", "-1", "0"]);
    await press(items()[2], "${next}");
    expect(document.activeElement).toBe(items()[0]);
  });
  it("Home and End jump", async () => {
    await mount("${slug}");
    items()[0].focus();
    await press(items()[0], "End");
    expect(document.activeElement).toBe(items()[2]);
    await press(items()[2], "Home");
    expect(document.activeElement).toBe(items()[0]);
  });
  it("ignores the other axis", async () => {
    await mount("${slug}");
    items()[0].focus();
    await press(items()[0], "${horizontal ? "ArrowDown" : "ArrowRight"}");
    expect(document.activeElement).toBe(items()[0]);
  });`,
  };
};

// Tests shared by every lilyDropdownMenu-shaped component.
const dropdownTests = (slug, trigger, menu, item) => `
  const trigger = () => document.querySelector(${JSON.stringify(trigger)});
  const menu = () => document.querySelector(${JSON.stringify(menu)});
  const items = () => [...document.querySelectorAll(${JSON.stringify(item)})];
  ${press}
  it('has a menu trigger and a hidden role="menu"', async () => {
    await mount("${slug}");
    expect(trigger().getAttribute("aria-haspopup")).toBe("menu");
    expect(trigger().getAttribute("aria-expanded")).toBe("false");
    expect(menu().getAttribute("role")).toBe("menu");
    expect(menu().hidden).toBe(true);
  });
  it("opens on click and focuses the first item", async () => {
    await mount("${slug}");
    trigger().click(); await tick(); await tick();
    expect(trigger().getAttribute("aria-expanded")).toBe("true");
    expect(menu().hidden).toBe(false);
    expect(document.activeElement).toBe(items()[0]);
  });
  it("opens with ArrowDown on the trigger", async () => {
    await mount("${slug}");
    await press(trigger(), "ArrowDown"); await tick();
    expect(menu().hidden).toBe(false);
  });
  it("arrows wrap, Home/End jump", async () => {
    await mount("${slug}");
    trigger().click(); await tick(); await tick();
    await press(items()[0], "ArrowUp");
    expect(document.activeElement).toBe(items()[items().length - 1]);
    await press(document.activeElement, "ArrowDown");
    expect(document.activeElement).toBe(items()[0]);
    await press(items()[0], "End");
    expect(document.activeElement).toBe(items()[items().length - 1]);
    await press(document.activeElement, "Home");
    expect(document.activeElement).toBe(items()[0]);
  });
  it("Escape closes and returns focus to the trigger", async () => {
    await mount("${slug}");
    trigger().focus(); trigger().click(); await tick(); await tick();
    await press(document.activeElement, "Escape");
    expect(menu().hidden).toBe(true);
    expect(document.activeElement).toBe(trigger());
  });
  it("choosing an item closes the menu", async () => {
    await mount("${slug}");
    trigger().focus(); trigger().click(); await tick(); await tick();
    items()[1].click(); await tick();
    expect(menu().hidden).toBe(true);
    expect(document.activeElement).toBe(trigger());
  });
  it("Tab and an outside click close without stealing focus", async () => {
    await mount("${slug}");
    trigger().click(); await tick(); await tick();
    await press(document.activeElement, "Tab");
    expect(menu().hidden).toBe(true);
    trigger().click(); await tick();
    document.body.click(); await tick();
    expect(menu().hidden).toBe(true);
  });`;

export default {
  menu: rovingMenu("menu", "menu", false, "menu-item"),
  "menu-bar": rovingMenu("menu-bar", "menubar", true, "menu-bar-item"),
  "dropdown-menu": {
    tag: "div", keyboard: "Enter/Space/ArrowDown open, arrows move, Escape closes",
    aria: 'trigger: aria-haspopup="menu" + aria-expanded; popup: role="menu"; items: role="menuitem"',
    markup: `<div class="dropdown-menu" x-data="lilyDropdownMenu(false)" x-bind="root">
  <button class="dropdown-menu-trigger" x-bind="trigger" aria-controls="dropdown-menu-1"><!-- Consumer provides trigger label --></button>
  <div class="dropdown-menu-popup" id="dropdown-menu-1" aria-label="" x-bind="menu">
    <button class="dropdown-menu-item" x-bind="item"><!-- Consumer provides label --></button>
    <button class="dropdown-menu-item" x-bind="item"><!-- Consumer provides label --></button>
    <button class="dropdown-menu-item" x-bind="item"><!-- Consumer provides label --></button>
  </div>
</div>`,
    sel: "div.dropdown-menu",
    test: dropdownTests("dropdown-menu", ".dropdown-menu-trigger", ".dropdown-menu-popup", ".dropdown-menu-item"),
  },
  "split-button": {
    tag: "div", keyboard: "Tab: primary then trigger; the trigger behaves as a dropdown-menu trigger",
    aria: 'role="group" with aria-label; menu trigger: aria-haspopup="menu", aria-expanded, its own aria-label',
    markup: `<div class="split-button" role="group" aria-label="" x-data="lilyDropdownMenu(false)" x-bind="root">
  <button class="split-button-primary" type="button"><!-- Consumer provides primary label --></button>
  <button class="split-button-menu-trigger" x-bind="trigger" aria-label="" aria-controls="split-button-menu-1">
    <!-- Consumer optionally provides a chevron icon -->
  </button>
  <div class="split-button-menu" id="split-button-menu-1" aria-label="" x-bind="menu">
    <button class="split-button-menu-item" x-bind="item"><!-- Consumer provides label --></button>
    <button class="split-button-menu-item" x-bind="item"><!-- Consumer provides label --></button>
  </div>
</div>`,
    sel: "div.split-button",
    test: `
  it('is a role="group" with a primary button before the trigger', async () => {
    await mount("split-button");
    expect(el().getAttribute("role")).toBe("group");
    const kids = [...el().children].map((c) => c.className);
    expect(kids.slice(0, 2)).toEqual(["split-button-primary", "split-button-menu-trigger"]);
  });` + dropdownTests("split-button", ".split-button-menu-trigger", ".split-button-menu", ".split-button-menu-item"),
  },
  "action-group": {
    tag: "div", keyboard: "Tab through the actions; the overflow trigger behaves as a dropdown-menu trigger",
    aria: 'role="group" with aria-label; overflow trigger: aria-haspopup="menu", aria-expanded, aria-controls',
    markup: `<div class="action-group" role="group" aria-label="" x-data="lilyDropdownMenu(false)" x-bind="root">
  <button type="button"><!-- Consumer provides a visible action --></button>
  <button class="action-group-overflow-trigger" x-bind="trigger" aria-label="" aria-controls="action-group-overflow-1">…</button>
  <div class="action-group-overflow-menu" id="action-group-overflow-1" aria-label="" x-bind="menu">
    <button class="action-group-overflow-item" x-bind="item"><!-- Consumer provides label --></button>
    <button class="action-group-overflow-item" x-bind="item"><!-- Consumer provides label --></button>
  </div>
</div>`,
    sel: "div.action-group",
    test: `
  it('is a role="group"', async () => {
    await mount("action-group");
    expect(el().getAttribute("role")).toBe("group");
  });` + dropdownTests("action-group", ".action-group-overflow-trigger", ".action-group-overflow-menu", ".action-group-overflow-item"),
  },
  "context-menu": {
    tag: "div", keyboard: "Right click, ContextMenu key or Shift+F10 opens; arrows move; Escape closes",
    aria: 'role="menu" with aria-label; items: role="menuitem"; position is exposed as --context-menu-x / --context-menu-y',
    markup: `<div x-data="lilyContextMenu()">
  <div class="context-menu-target" tabindex="0" x-bind="target"><!-- Consumer provides the region that owns the menu --></div>
  <div class="context-menu" aria-label="" x-bind="menu">
    <button class="context-menu-item" x-bind="item"><!-- Consumer provides label --></button>
    <button class="context-menu-item" x-bind="item"><!-- Consumer provides label --></button>
  </div>
</div>`,
    sel: "div.context-menu",
    extra: `const target = () => document.querySelector(".context-menu-target");
const items = () => [...document.querySelectorAll(".context-menu-item")];
${press}`,
    test: `
  it('is a hidden role="menu"', async () => {
    await mount("context-menu");
    expect(el().getAttribute("role")).toBe("menu");
    expect(el().hidden).toBe(true);
  });
  it("opens on the context-menu event at the pointer and focuses the first item", async () => {
    await mount("context-menu");
    target().dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true, clientX: 40, clientY: 60 }));
    await tick(); await tick();
    expect(el().hidden).toBe(false);
    expect(el().style.getPropertyValue("--context-menu-x")).toBe("40px");
    expect(el().style.getPropertyValue("--context-menu-y")).toBe("60px");
    expect(document.activeElement).toBe(items()[0]);
  });
  it("opens from the keyboard (ContextMenu key and Shift+F10)", async () => {
    await mount("context-menu");
    await press(target(), "ContextMenu"); await tick();
    expect(el().hidden).toBe(false);
    document.body.click(); await tick();
    expect(el().hidden).toBe(true);
    await press(target(), "F10", { shiftKey: true }); await tick();
    expect(el().hidden).toBe(false);
  });
  it("Escape closes and returns focus to the target", async () => {
    await mount("context-menu");
    target().focus();
    await press(target(), "ContextMenu"); await tick();
    await press(document.activeElement, "Escape");
    expect(el().hidden).toBe(true);
    expect(document.activeElement).toBe(target());
  });
  it("arrows move through the items; choosing one closes", async () => {
    await mount("context-menu");
    await press(target(), "ContextMenu"); await tick();
    await press(items()[0], "ArrowDown");
    expect(document.activeElement).toBe(items()[1]);
    items()[1].click(); await tick();
    expect(el().hidden).toBe(true);
  });`,
  },
  "hamburger-menu": {
    tag: "div", keyboard: "Enter or Space toggles; Tab moves into the navigation when open",
    aria: 'button: aria-expanded + aria-controls; navigation region: role="navigation" with aria-label, hidden while closed',
    markup: `<div class="hamburger-menu" x-data="lilyCollapsible(false)" x-bind="root">
  <button class="hamburger-menu-button" x-bind="trigger" aria-label="" aria-controls="hamburger-menu-nav-1">
    <!-- Consumer provides the icon -->
  </button>
  <nav class="hamburger-menu-nav" id="hamburger-menu-nav-1" aria-label="" x-bind="content">
    <!-- Consumer provides navigation content -->
  </nav>
</div>`,
    test: `
  const button = () => document.querySelector(".hamburger-menu-button");
  const nav = () => document.querySelector(".hamburger-menu-nav");
  it("starts closed with a hidden navigation", async () => {
    await mount("hamburger-menu");
    expect(button().getAttribute("aria-expanded")).toBe("false");
    expect(button().getAttribute("aria-controls")).toBe(nav().id);
    expect(nav().hidden).toBe(true);
  });
  it("toggles the navigation", async () => {
    await mount("hamburger-menu");
    button().click(); await tick();
    expect(button().getAttribute("aria-expanded")).toBe("true");
    expect(nav().hidden).toBe(false);
    button().click(); await tick();
    expect(nav().hidden).toBe(true);
  });`, sel: "div.hamburger-menu",
  },
  "float-button": {
    tag: "button", keyboard: "Tab to focus, Enter or Space to activate",
    aria: "native button; aria-label names it; position is data-position plus the contract's structural inline style",
    markup: `<button class="float-button" type="button" aria-label="" data-position="bottom-right"
        style="position: fixed; bottom: 1rem; right: 1rem;">
  <!-- Consumer provides icon content (SVG, emoji, or glyph) -->
</button>`,
    test: `
  it("is a button fixed to its corner", async () => {
    await mount("float-button");
    expect(el().type).toBe("button");
    expect(el().getAttribute("data-position")).toBe("bottom-right");
    expect(el().style.position).toBe("fixed");
  });`, sel: "button.float-button",
  },
};
