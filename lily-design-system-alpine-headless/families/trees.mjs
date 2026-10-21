// Family: trees. lilyTree (tree-nav, tree-menu, file-tree), lilyTreeSelect
// (tree-select) and lilyCascader (cascader), all on one APG tree-view core.
// file-manager is a named region with no behaviour in its contract.

const press = `const press = async (target, key, init = {}) => {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init }));
  await tick();
};`;

// Shared helpers, injected into each generated test file.
const helpers = `${press}
const item = (id) => document.querySelector('[data-item="' + id + '"]');
const items = () => [...document.querySelectorAll('[role="treeitem"]')];
const name = (id, text) => item(id).prepend(text);
const nameAll = () => Object.entries({ one: "Fruit", "one-a": "Apple", "one-b": "Berry", two: "Tea", three: "Veg", "three-a": "Kale" }).forEach(([id, t]) => name(id, t));`;

// The sample hierarchy: one{one-a, one-b}, two, three{three-a}.
const sample = (pad, itemClass) => {
  const li = (id, kids) => kids
    ? `${pad}<li class="${itemClass}" x-bind="item('${id}', true)">
${pad}  <!-- Consumer provides label -->
${pad}  <ul role="group" x-bind="group('${id}')">
${kids.map((k) => `${pad}    <li class="${itemClass}" x-bind="item('${k}')"><!-- Consumer provides label --></li>`).join("\n")}
${pad}  </ul>
${pad}</li>`
    : `${pad}<li class="${itemClass}" x-bind="item('${id}')"><!-- Consumer provides label --></li>`;
  return [li("one", ["one-a", "one-b"]), li("two"), li("three", ["three-a"])].join("\n").replaceAll('<li class', '<li role="treeitem" class');
};

// Tests every hierarchical tree shares (ids one, one-a, one-b, two, three, three-a).
const treeTests = (slug, wrap) => `
  it("is a tree of treeitems with one tab stop and closed branches", async () => {
    await mount("${slug}");
    expect(document.querySelector("[role=tree]")).not.toBeNull();
    expect(items().map((i) => i.getAttribute("role"))).toEqual(Array(6).fill("treeitem"));
    expect(items().map((i) => i.getAttribute("tabindex"))).toEqual(["0", "-1", "-1", "-1", "-1", "-1"]);
    expect(item("one").getAttribute("aria-expanded")).toBe("false");
    expect(item("two").hasAttribute("aria-expanded")).toBe(false);
    expect(item("one").querySelector("[role=group]").hidden).toBe(true);
  });
  it("ArrowRight opens a branch then enters it; ArrowLeft closes or goes to the parent", async () => {
    await mount("${slug}");
    item("one").focus();
    await press(item("one"), "ArrowRight");
    expect(item("one").getAttribute("aria-expanded")).toBe("true");
    expect(item("one").querySelector("[role=group]").hidden).toBe(false);
    await press(item("one"), "ArrowRight");
    expect(document.activeElement).toBe(item("one-a"));
    await press(item("one-a"), "ArrowLeft");
    expect(document.activeElement).toBe(item("one"));
    await press(item("one"), "ArrowLeft");
    expect(item("one").getAttribute("aria-expanded")).toBe("false");
  });
  it("ArrowDown and ArrowUp skip the children of a closed branch", async () => {
    await mount("${slug}");
    item("one").focus();
    await press(item("one"), "ArrowDown");
    expect(document.activeElement).toBe(item("two"));
    await press(item("two"), "ArrowUp");
    expect(document.activeElement).toBe(item("one"));
    expect(item("one").getAttribute("tabindex")).toBe("0");
    expect(item("two").getAttribute("tabindex")).toBe("-1");
  });
  it("${wrap ? "the arrows wrap at the ends" : "the arrows stop at the ends"}; Home and End jump", async () => {
    await mount("${slug}");
    item("one").focus();
    await press(item("one"), "ArrowUp");
    expect(document.activeElement).toBe(${wrap ? 'item("three")' : 'item("one")'});
    await press(document.activeElement, "End");
    expect(document.activeElement).toBe(item("three"));
    await press(item("three"), "ArrowDown");
    expect(document.activeElement).toBe(${wrap ? 'item("one")' : 'item("three")'});
    await press(document.activeElement, "End");
    await press(item("three"), "Home");
    expect(document.activeElement).toBe(item("one"));
  });
  it("* opens every closed branch at the focused level", async () => {
    await mount("${slug}");
    item("one").focus();
    await press(item("one"), "*");
    expect(item("one").getAttribute("aria-expanded")).toBe("true");
    expect(item("three").getAttribute("aria-expanded")).toBe("true");
  });
  it("typing jumps to the next visible item starting with the character", async () => {
    await mount("${slug}"); nameAll();
    item("one").focus();
    await press(item("one"), "t");
    expect(document.activeElement).toBe(item("two"));
  });
  it("Enter on a leaf selects it and announces its path; a click on a child does not toggle its parent", async () => {
    await mount("${slug}");
    const seen = vi.fn();
    document.body.addEventListener("lily:select", (e) => seen(e.detail));
    item("one").click(); await tick();
    item("one-a").click(); await tick();
    expect(item("one").getAttribute("aria-expanded")).toBe("true");
    expect(item("one-a").getAttribute("aria-selected")).toBe("true");
    expect(seen).toHaveBeenLastCalledWith(expect.objectContaining({ selected: ${slug === "cascader" || slug === "tree-select" ? '["one-a"]' : '"one-a"'}, path: ["one", "one-a"] }));
    item("two").focus();
    await press(item("two"), "Enter");
    expect(item("two").getAttribute("aria-selected")).toBe("true");
  });`;

const popupTests = (slug, exclusive) => `
  const trigger = () => el().querySelector("button");
  const panel = () => el().querySelector("[class$=-panel]");
  const open = async () => { trigger().click(); await tick(); await tick(); };
  it("is a combobox popping a tree, closed at first", async () => {
    await mount("${slug}");
    expect(el().getAttribute("role")).toBe("combobox");
    expect(el().getAttribute("aria-haspopup")).toBe("tree");
    expect(el().getAttribute("aria-expanded")).toBe("false");
    expect(panel().hidden).toBe(true);
  });
  it("the trigger opens the panel and moves focus into the tree; Escape returns it", async () => {
    await mount("${slug}");
    trigger().focus();
    await open();
    expect(el().getAttribute("aria-expanded")).toBe("true");
    expect(panel().hidden).toBe(false);
    expect(document.activeElement).toBe(item("one"));
    await press(document.activeElement, "Escape");
    expect(el().getAttribute("aria-expanded")).toBe("false");
    expect(panel().hidden).toBe(true);
    expect(document.activeElement).toBe(trigger());
  });
  it("ArrowDown on the trigger opens it; an outside click closes it", async () => {
    await mount("${slug}");
    await press(trigger(), "ArrowDown"); await tick();
    expect(panel().hidden).toBe(false);
    document.body.click(); await tick();
    expect(panel().hidden).toBe(true);
  });
  it("choosing a leaf selects it, announces the path and closes", async () => {
    await mount("${slug}");
    const seen = vi.fn();
    el().addEventListener("lily:select", (e) => seen(e.detail));
    await open();
    item("one").click(); await tick();
    item("one-b").click(); await tick();
    expect(item("one-b").getAttribute("aria-selected")).toBe("true");
    expect(seen).toHaveBeenCalledWith({ selected: ["one-b"], path: ["one", "one-b"] });
    expect(panel().hidden).toBe(true);
    expect(document.activeElement).toBe(trigger());
  });
  it("${exclusive ? "opening a branch closes its siblings (one list per level)" : "multiple mode keeps the panel open and selects several"}", async () => {
    ${exclusive ? `await mount("${slug}"); await open();
    item("one").click(); await tick();
    item("three").click(); await tick();
    expect(item("three").getAttribute("aria-expanded")).toBe("true");
    expect(item("one").getAttribute("aria-expanded")).toBe("false");` : `await mount("${slug}", snippet("${slug}").replace("lilyTreeSelect()", "lilyTreeSelect(true)"));
    expect(el().getAttribute("aria-multiselectable")).toBe("true");
    await open();
    item("two").click(); await tick();
    item("three").click(); await tick();
    item("three-a").click(); await tick();
    expect(panel().hidden).toBe(false);
    expect(["two", "three-a"].map((id) => item(id).getAttribute("aria-selected"))).toEqual(["true", "true"]);`}
  });`;

export default {
  "tree-nav": {
    tag: "nav", keyboard: "arrows move through visible items, ArrowRight/ArrowLeft open, close and climb, Home/End jump, * opens siblings, type to jump",
    aria: 'nav landmark with aria-label; the list is role="tree" of role="treeitem" with aria-expanded on branches and a roving tabindex',
    markup: `<nav class="tree-nav" aria-label="" x-data="lilyTree()">
  <ul class="tree-list" role="tree" aria-label="" x-bind="tree">
${sample("    ", "tree-list-item")}
  </ul>
</nav>`,
    sel: "nav.tree-nav", extra: helpers, test: treeTests("tree-nav", false),
  },

  "tree-menu": {
    tag: "ul", keyboard: "ArrowDown/ArrowUp move through visible items (wrapping), ArrowRight/ArrowLeft open and close, Home/End jump",
    aria: 'role="tree" with aria-label; items are role="treeitem" with a roving tabindex',
    markup: `<ul class="tree-menu" role="tree" aria-label="" x-data="lilyTree(true)" x-bind="tree">
${sample("  ", "tree-menu-item")}
</ul>`,
    sel: "ul.tree-menu", extra: helpers, test: treeTests("tree-menu", true),
  },

  "tree-select": {
    tag: "div", keyboard: "Enter/Space or ArrowDown on the trigger opens; the tree takes the APG keys; Escape closes and returns to the trigger",
    aria: 'role="combobox" with aria-haspopup="tree", aria-expanded and aria-label; aria-multiselectable in multiple mode; the panel holds a role="tree"',
    markup: `<div class="tree-select" role="combobox" aria-haspopup="tree" aria-expanded="false" aria-label="" x-data="lilyTreeSelect()" x-bind="root">
  <button class="tree-select-trigger" x-bind="trigger"><!-- Consumer provides the display value or placeholder text --></button>
  <div class="tree-select-panel" hidden x-bind="panel">
    <ul class="tree-list" role="tree" aria-label="" x-bind="tree">
${sample("      ", "tree-list-item")}
    </ul>
  </div>
</div>`,
    sel: "div.tree-select",
    extra: `import { snippet } from "../test/mount.js";\n${helpers}`,
    test: treeTests("tree-select", false) + popupTests("tree-select", false),
  },

  cascader: {
    tag: "div", keyboard: "Enter/Space or ArrowDown on the trigger opens; arrows move and open one branch per level; Escape closes",
    aria: 'role="combobox" with aria-haspopup="tree", aria-expanded and aria-label; the panel holds a role="tree" of cascading lists',
    markup: `<div class="cascader" role="combobox" aria-haspopup="tree" aria-expanded="false" aria-label="" x-data="lilyCascader()" x-bind="root">
  <button class="cascader-trigger" x-bind="trigger"><!-- Consumer provides the display value or placeholder text --></button>
  <div class="cascader-panel" hidden x-bind="panel">
    <ul class="cascader-list" role="tree" aria-label="" x-bind="tree">
${sample("      ", "cascader-option")}
    </ul>
  </div>
</div>`,
    sel: "div.cascader", extra: helpers,
    test: popupTests("cascader", true),
  },

  "file-tree": {
    tag: "ul", keyboard: "arrows move through visible items, ArrowRight/ArrowLeft open, close and climb, Home/End jump, * opens siblings, type to jump, Enter/Space activates",
    aria: 'role="tree" with aria-label; folders carry aria-expanded and hold a role="group"; one item is in the tab order',
    markup: `<ul class="file-tree" role="tree" aria-label="" x-data="lilyTree(false, ['src', 'lib'])" x-bind="tree">
  <li role="treeitem" x-bind="item('src', true)">src
    <ul role="group" x-bind="group('src')">
      <li role="treeitem" x-bind="item('lib', true)">lib
        <ul role="group" x-bind="group('lib')"><li role="treeitem" x-bind="item('index')">index.ts</li></ul>
      </li>
      <li role="treeitem" x-bind="item('app')">app.ts</li>
    </ul>
  </li>
  <li role="treeitem" x-bind="item('docs', true)">docs
    <ul role="group" x-bind="group('docs')"><li role="treeitem" x-bind="item('guide')">guide.md</li></ul>
  </li>
  <li role="treeitem" x-bind="item('readme')">readme.md</li>
  <li role="treeitem" x-bind="item('etc', true)">etc
    <ul role="group" x-bind="group('etc')"><li role="treeitem" x-bind="item('x')">x.txt</li></ul>
  </li>
</ul>`,
    sel: "ul.file-tree", extra: helpers,
    test: `
  it("starts with src and lib open and one tab stop", async () => {
    await mount("file-tree");
    expect(el().getAttribute("role")).toBe("tree");
    expect(["src", "lib", "docs", "etc"].map((id) => item(id).getAttribute("aria-expanded"))).toEqual(["true", "true", "false", "false"]);
    expect(items().filter((i) => i.getAttribute("tabindex") === "0")).toEqual([item("src")]);
  });
  it("ArrowDown walks the visible items only", async () => {
    await mount("file-tree");
    item("src").focus();
    const order = [];
    for (let k = 0; k < 6; k++) { await press(document.activeElement, "ArrowDown"); order.push(document.activeElement.dataset.item); }
    expect(order).toEqual(["lib", "index", "app", "docs", "readme", "etc"]);
    await press(item("etc"), "ArrowDown");
    expect(document.activeElement).toBe(item("etc"));
  });
  it("ArrowLeft closes a folder, then climbs to its parent", async () => {
    await mount("file-tree");
    item("lib").focus();
    await press(item("lib"), "ArrowLeft");
    expect(item("lib").getAttribute("aria-expanded")).toBe("false");
    await press(item("lib"), "ArrowLeft");
    expect(document.activeElement).toBe(item("src"));
  });
  it("typeahead uses each item's own text, not its children's", async () => {
    await mount("file-tree");
    item("src").focus();
    await press(item("src"), "r");
    expect(document.activeElement).toBe(item("readme"));
  });
  it("* opens the closed folders at the focused level", async () => {
    await mount("file-tree");
    item("docs").focus();
    await press(item("docs"), "*");
    expect(["docs", "etc"].map((id) => item(id).getAttribute("aria-expanded"))).toEqual(["true", "true"]);
  });`,
  },

  "file-manager": {
    tag: "div", keyboard: "None (passive element)",
    aria: 'role="region" with aria-label for a named landmark',
    markup: `<div class="file-manager" role="region" aria-label="">
  <!-- Consumer provides file listing, folder navigation and actions -->
</div>`,
    sel: "div.file-manager",
    test: `
  it("is a named region", async () => {
    await mount("file-manager");
    expect(el().getAttribute("role")).toBe("region");
    expect(el().hasAttribute("aria-label")).toBe(true);
  });`,
  },
};
