// Behaviour tests for src/LilyBlazorHeadless/Components/TreeMenu.razor.js
// (mirrors the Svelte TreeMenu.test.ts key cases).
// Run: JSDOM_PATH=/path/to/jsdom node --test tests/js/tree-menu.test.mjs
// Needs the `jsdom` package (resolved normally, or via the JSDOM_PATH env var).
import { test } from "node:test";
import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import path from "node:path";

const { JSDOM } = process.env.JSDOM_PATH
    ? await import(pathToFileURL(path.join(process.env.JSDOM_PATH, "lib/api.js")).href).then(
          (m) => m.default ?? m,
      )
    : await import("jsdom");

const dom = new JSDOM("<!doctype html><body></body>", { pretendToBeVisual: true });
for (const k of ["window", "document", "HTMLElement", "Node", "KeyboardEvent"]) {
    globalThis[k] = k === "window" ? dom.window : (dom.window[k] ?? globalThis[k]);
}
const { attach } = await import("../../src/LilyBlazorHeadless/Components/TreeMenu.razor.js");

function mount() {
    document.body.innerHTML = `<div class="tree-menu" role="tree" tabindex="-1" aria-label="Site"><ul>
      <li role="treeitem" tabindex="-1">Home</li><li role="treeitem" tabindex="-1">Settings</li>
      <li role="treeitem" tabindex="-1">Profile</li></ul></div>`;
    const tree = document.querySelector("[role=tree]");
    return { tree, items: [...tree.querySelectorAll("[role=treeitem]")], handle: attach(tree) };
}
const press = (el, key) =>
    el.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));

test("ArrowDown and ArrowUp move focus between tree items and wrap at the ends", () => {
    const { items, handle } = mount();
    items[0].focus();
    press(items[0], "ArrowDown");
    assert.equal(document.activeElement, items[1]);
    press(items[1], "ArrowUp");
    assert.equal(document.activeElement, items[0]);
    press(items[0], "ArrowUp");
    assert.equal(document.activeElement, items[2]);
    press(items[2], "ArrowDown");
    assert.equal(document.activeElement, items[0]);
    handle.dispose();
});

test("Home and End jump to the first and last tree item", () => {
    const { items, handle } = mount();
    items[1].focus();
    press(items[1], "End");
    assert.equal(document.activeElement, items[2]);
    press(items[2], "Home");
    assert.equal(document.activeElement, items[0]);
    handle.dispose();
});

test("dispose removes the key handling", () => {
    const { items, handle } = mount();
    handle.dispose();
    items[0].focus();
    press(items[0], "ArrowDown");
    assert.equal(document.activeElement, items[0]);
});
