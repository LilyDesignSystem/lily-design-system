import { afterEach, describe, expect, test } from "vitest";

import { FileTree } from "./file-tree.js";

if (!customElements.get("lily-file-tree")) {
    customElements.define("lily-file-tree", FileTree);
}

afterEach(() => {
    document.body.innerHTML = "";
});

// src (open) > [lib (open) > [index.ts], app.ts]; docs (closed) > [guide.md]; readme.md; etc (closed) > [x.txt]
const TREE = `
<li role="treeitem" aria-expanded="true" data-id="src">src
  <ul role="group">
    <li role="treeitem" aria-expanded="true" data-id="lib">lib
      <ul role="group"><li role="treeitem" data-id="index">index.ts</li></ul>
    </li>
    <li role="treeitem" data-id="app">app.ts</li>
  </ul>
</li>
<li role="treeitem" aria-expanded="false" data-id="docs">docs
  <ul role="group"><li role="treeitem" data-id="guide">guide.md</li></ul>
</li>
<li role="treeitem" data-id="readme">readme.md</li>
<li role="treeitem" aria-expanded="false" data-id="etc">etc
  <ul role="group"><li role="treeitem" data-id="x">x.txt</li></ul>
</li>`;

function setup(html = TREE, attrs = 'label="Files"') {
    document.body.innerHTML = `<lily-file-tree ${attrs}>${html}</lily-file-tree>`;
    const host = document.body.firstElementChild as HTMLElement;
    const item = (id: string) => host.querySelector<HTMLElement>(`[data-id="${id}"]`)!;
    return { host, item };
}

function press(el: HTMLElement, key: string): void {
    el.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
}

function keys(...ks: string[]): void {
    for (const k of ks) press(document.activeElement as HTMLElement, k);
}

const tick = () => new Promise((r) => setTimeout(r, 0));

describe("FileTree", () => {
    test("root is <ul role=tree> with class and aria-label", () => {
        const { host } = setup();
        const ul = host.querySelector(":scope > ul")!;
        expect(ul.getAttribute("role")).toBe("tree");
        expect(ul.className).toBe("file-tree");
        expect(ul.getAttribute("aria-label")).toBe("Files");
    });

    test("passes through attributes and consumer class", () => {
        const { host } = setup(TREE, 'label="F" data-testid="ft" class="extra"');
        const ul = host.querySelector(":scope > ul")!;
        expect(ul.getAttribute("data-testid")).toBe("ft");
        expect(ul.className).toBe("file-tree extra");
    });

    test("roving tabindex: exactly one item has tabindex=0, the first", () => {
        const { host, item } = setup();
        const stops = host.querySelectorAll("[role=treeitem][tabindex='0']");
        expect(stops).toHaveLength(1);
        expect(stops[0]).toBe(item("src"));
        expect(item("lib").getAttribute("tabindex")).toBe("-1");
    });

    test("tab stop follows focus", () => {
        const { host, item } = setup();
        item("src").focus();
        keys("ArrowDown");
        expect(item("lib").getAttribute("tabindex")).toBe("0");
        expect(item("src").getAttribute("tabindex")).toBe("-1");
        expect(host.querySelectorAll("[tabindex='0']")).toHaveLength(1);
    });

    test("ArrowDown moves to the next visible item, skipping closed folder contents", () => {
        const { item } = setup();
        item("readme").focus();
        keys("ArrowUp");
        expect(document.activeElement).toBe(item("docs"));
        keys("ArrowDown", "ArrowDown");
        expect(document.activeElement).toBe(item("etc"));
    });

    test("ArrowDown/ArrowUp walk into open folders", () => {
        const { item } = setup();
        item("src").focus();
        keys("ArrowDown");
        expect(document.activeElement).toBe(item("lib"));
        keys("ArrowDown");
        expect(document.activeElement).toBe(item("index"));
        keys("ArrowUp");
        expect(document.activeElement).toBe(item("lib"));
    });

    test("ArrowUp at the first item and ArrowDown at the last do not wrap", () => {
        const { item } = setup();
        item("src").focus();
        keys("ArrowUp");
        expect(document.activeElement).toBe(item("src"));
        item("etc").focus();
        keys("ArrowDown");
        expect(document.activeElement).toBe(item("etc"));
    });

    test("Home and End jump to the first and last visible items", () => {
        const { item } = setup();
        item("app").focus();
        keys("End");
        expect(document.activeElement).toBe(item("etc"));
        keys("Home");
        expect(document.activeElement).toBe(item("src"));
    });

    test("ArrowRight on a closed folder opens it", () => {
        const { item } = setup();
        item("docs").focus();
        keys("ArrowRight");
        expect(item("docs").getAttribute("aria-expanded")).toBe("true");
        expect(document.activeElement).toBe(item("docs"));
    });

    test("ArrowRight on an open folder moves to its first child", () => {
        const { item } = setup();
        item("src").focus();
        keys("ArrowRight");
        expect(document.activeElement).toBe(item("lib"));
    });

    test("ArrowRight on a file does nothing", () => {
        const { item } = setup();
        item("readme").focus();
        keys("ArrowRight");
        expect(document.activeElement).toBe(item("readme"));
    });

    test("ArrowLeft on an open folder closes it", () => {
        const { item } = setup();
        item("src").focus();
        keys("ArrowLeft");
        expect(item("src").getAttribute("aria-expanded")).toBe("false");
        expect(document.activeElement).toBe(item("src"));
    });

    test("ArrowLeft on a child moves focus to its parent folder", () => {
        const { item } = setup();
        item("index").focus();
        keys("ArrowLeft");
        expect(document.activeElement).toBe(item("lib"));
        keys("ArrowLeft");
        expect(item("lib").getAttribute("aria-expanded")).toBe("false");
        keys("ArrowLeft");
        expect(document.activeElement).toBe(item("src"));
    });

    test("closing a folder removes its children from keyboard order", () => {
        const { item } = setup();
        item("src").focus();
        keys("ArrowLeft", "ArrowDown");
        expect(document.activeElement).toBe(item("docs"));
    });

    test("* expands all closed sibling folders at the focused level", () => {
        const { item } = setup();
        item("src").focus();
        keys("*");
        expect(item("docs").getAttribute("aria-expanded")).toBe("true");
        expect(item("etc").getAttribute("aria-expanded")).toBe("true");
        expect(item("src").getAttribute("aria-expanded")).toBe("true");
    });

    test("* does not expand folders at other levels", () => {
        const { item } = setup(`
          <li role="treeitem" aria-expanded="true" data-id="a">a<ul role="group">
            <li role="treeitem" aria-expanded="false" data-id="b">b<ul role="group"><li role="treeitem">c</li></ul></li>
          </ul></li>
          <li role="treeitem" aria-expanded="false" data-id="d">d<ul role="group"><li role="treeitem">e</li></ul></li>`);
        item("a").focus();
        keys("*");
        expect(item("d").getAttribute("aria-expanded")).toBe("true");
        expect(item("b").getAttribute("aria-expanded")).toBe("false");
    });

    test("typeahead moves to the next visible item starting with the typed character", () => {
        const { item } = setup();
        item("src").focus();
        keys("r");
        expect(document.activeElement).toBe(item("readme"));
    });

    test("typeahead ignores items hidden in closed folders", () => {
        const { item } = setup();
        item("src").focus();
        keys("g");
        expect(document.activeElement).toBe(item("src"));
    });

    test("typeahead matches a multi-character prefix", () => {
        const { item } = setup();
        item("src").focus();
        keys("a", "p");
        expect(document.activeElement).toBe(item("app"));
    });

    test("typeahead matches a folder's own text, not its nested children", () => {
        const { item } = setup();
        item("readme").focus();
        keys("s");
        expect(document.activeElement).toBe(item("src"));
    });

    test("Enter and Space activate the focused item", () => {
        const { item } = setup();
        const clicks: string[] = [];
        item("readme").addEventListener("click", () => clicks.push("readme"));
        item("readme").focus();
        keys("Enter", " ");
        expect(clicks).toEqual(["readme", "readme"]);
    });

    test("if the tab stop gets hidden the tab stop moves to a visible item", async () => {
        const { host, item } = setup();
        item("index").focus();
        item("src").setAttribute("aria-expanded", "false");
        await tick();
        const stops = host.querySelectorAll("[role=treeitem][tabindex='0']");
        expect(stops).toHaveLength(1);
        expect(stops[0]).not.toBe(item("index"));
    });
});
