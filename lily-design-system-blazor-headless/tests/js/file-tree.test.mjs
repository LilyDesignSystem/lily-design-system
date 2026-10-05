// Behaviour tests for src/LilyBlazorHeadless/Components/FileTree.razor.js
// (the APG tree keyboard; mirrors the Svelte FileTree.test.ts cases).
// Run: JSDOM_PATH=/path/to/jsdom node --test tests/js/file-tree.test.mjs
// Needs the `jsdom` package (resolved normally, or via the JSDOM_PATH env var).
import { test } from "node:test";
import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import path from "node:path";

const { JSDOM } = process.env.JSDOM_PATH
    ? await import(pathToFileURL(path.join(process.env.JSDOM_PATH, "lib/api.js")).href).then((m) => m.default ?? m)
    : await import("jsdom");

const dom = new JSDOM("<!doctype html><body></body>", { pretendToBeVisual: true });
for (const k of ["window", "document", "MutationObserver", "HTMLElement", "Node"]) {
    globalThis[k] = k === "window" ? dom.window : dom.window[k] ?? globalThis[k];
}
const { attach } = await import("../../src/LilyBlazorHeadless/Components/FileTree.razor.js");

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

function setup() {
    document.body.innerHTML = `<ul role="tree" aria-label="Files">${TREE}</ul>`;
    const tree = document.querySelector("ul");
    const handle = attach(tree);
    const item = (id) => tree.querySelector(`[data-id="${id}"]`);
    const key = (el, k) => el.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true }));
    const focus = (el) => el.focus();
    return { tree, handle, item, key, focus };
}

test("roving tabindex: exactly one item has tabindex=0, the first", () => {
    const { tree, item } = setup();
    assert.equal(tree.querySelectorAll("[role=treeitem][tabindex='0']").length, 1);
    assert.equal(item("src").getAttribute("tabindex"), "0");
    assert.equal(item("lib").getAttribute("tabindex"), "-1");
});

test("tab stop follows focus", () => {
    const { item, focus, key, tree } = setup();
    focus(item("src"));
    key(item("src"), "ArrowDown");
    assert.equal(item("lib").getAttribute("tabindex"), "0");
    assert.equal(item("src").getAttribute("tabindex"), "-1");
    assert.equal(tree.querySelectorAll("[tabindex='0']").length, 1);
});

test("ArrowDown/ArrowUp skip closed folder contents", () => {
    const { item, focus, key } = setup();
    focus(item("readme"));
    key(item("readme"), "ArrowUp");
    assert.equal(document.activeElement, item("docs"));
    key(item("docs"), "ArrowDown"); key(item("readme"), "ArrowDown");
    assert.equal(document.activeElement, item("etc"));
});

test("arrows clamp, no wrap", () => {
    const { item, focus, key } = setup();
    focus(item("src")); key(item("src"), "ArrowUp");
    assert.equal(document.activeElement, item("src"));
    focus(item("etc")); key(item("etc"), "ArrowDown");
    assert.equal(document.activeElement, item("etc"));
});

test("Home and End", () => {
    const { item, focus, key } = setup();
    focus(item("app")); key(item("app"), "End");
    assert.equal(document.activeElement, item("etc"));
    key(item("etc"), "Home");
    assert.equal(document.activeElement, item("src"));
});

test("ArrowRight opens a closed folder, moves into an open one, ignores files", () => {
    const { item, focus, key } = setup();
    focus(item("docs")); key(item("docs"), "ArrowRight");
    assert.equal(item("docs").getAttribute("aria-expanded"), "true");
    key(item("docs"), "ArrowRight");
    assert.equal(document.activeElement, item("guide"));
    focus(item("readme")); key(item("readme"), "ArrowRight");
    assert.equal(document.activeElement, item("readme"));
});

test("ArrowLeft closes an open folder, else moves to the parent", () => {
    const { item, focus, key } = setup();
    focus(item("src")); key(item("src"), "ArrowLeft");
    assert.equal(item("src").getAttribute("aria-expanded"), "false");
    key(item("src"), "ArrowRight");
    focus(item("app")); key(item("app"), "ArrowLeft");
    assert.equal(document.activeElement, item("src"));
});

test("closing a folder removes its children from keyboard order", () => {
    const { item, focus, key } = setup();
    focus(item("src")); key(item("src"), "ArrowLeft");
    key(item("src"), "ArrowDown");
    assert.equal(document.activeElement, item("docs"));
});

test("* expands closed sibling folders at the focused level only", () => {
    const { item, focus, key } = setup();
    focus(item("src")); key(item("src"), "*");
    assert.equal(item("docs").getAttribute("aria-expanded"), "true");
    assert.equal(item("etc").getAttribute("aria-expanded"), "true");
});

test("typeahead moves to the next visible item with that first character", () => {
    const { item, focus, key } = setup();
    focus(item("src")); key(item("src"), "r");
    assert.equal(document.activeElement, item("readme"));
});

test("typeahead ignores items hidden in closed folders", () => {
    const { item, focus, key } = setup();
    focus(item("src")); key(item("src"), "g");
    assert.equal(document.activeElement, item("src"));
});

test("typeahead matches a multi-character prefix on a folder's own text", () => {
    const { item, focus, key } = setup();
    focus(item("src")); key(item("src"), "e"); key(document.activeElement, "t");
    assert.equal(document.activeElement, item("etc"));
});

test("Enter and Space click the focused item", () => {
    const { item, focus, key } = setup();
    let clicks = 0;
    item("readme").addEventListener("click", () => clicks++);
    focus(item("readme")); key(item("readme"), "Enter"); key(item("readme"), " ");
    assert.equal(clicks, 2);
});

test("hidden tab stop moves to a visible item", async () => {
    const { item, focus, tree } = setup();
    focus(item("index"));
    assert.equal(item("index").getAttribute("tabindex"), "0");
    item("src").setAttribute("aria-expanded", "false");
    item("lib").setAttribute("aria-expanded", "false");
    await new Promise((r) => setTimeout(r, 20));
    assert.equal(tree.querySelectorAll("[tabindex='0']").length, 1);
    assert.equal(item("src").getAttribute("tabindex"), "0");
});

test("dispose removes listeners", () => {
    const { item, focus, key, handle } = setup();
    handle.dispose();
    focus(item("src")); key(item("src"), "ArrowDown");
    assert.equal(document.activeElement, item("src"));
});
