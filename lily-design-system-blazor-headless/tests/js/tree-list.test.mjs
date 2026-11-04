// Behaviour tests for src/LilyBlazorHeadless/Components/TreeList.razor.js
// (mirrors the Svelte TreeList.test.ts key cases).
// Run: JSDOM_PATH=/path/to/jsdom node --test tests/js/tree-list.test.mjs
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
const { attach } = await import("../../src/LilyBlazorHeadless/Components/TreeList.razor.js");

function mount() {
    document.body.innerHTML = `<ol class="tree-list" role="tree" aria-label="Files"><li role="treeitem" tabindex="-1" aria-expanded="false">Fruit<ol role="group"><li role="treeitem" tabindex="-1">Apple</li></ol></li><li role="treeitem" tabindex="-1" aria-expanded="true">Tea<ol role="group"><li role="treeitem" tabindex="-1">Green</li></ol></li><li role="treeitem" tabindex="-1">Veg</li></ol>`;
    const root = document.body.firstElementChild;
    return { root, handle: attach(root) };
}
const item = (text) =>
    [...document.body.querySelectorAll("*")].find((e) => e.firstChild?.nodeValue === text);
const focused = () => document.activeElement.firstChild?.nodeValue;
const press = (key) => {
    const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true });
    document.activeElement.dispatchEvent(event);
    return event.defaultPrevented;
};

test("ArrowDown moves focus to the next item and wraps from the last to the first", () => {
    const { handle } = mount();
    item("Fruit").focus();
    const seen = [];
    for (let i = 0; i < 4; i++) {
        press("ArrowDown");
        seen.push(focused());
    }
    assert.deepEqual(seen, ["Tea", "Green", "Veg", "Fruit"]);
    handle.dispose();
});

test("ArrowUp moves focus to the previous item and wraps from the first to the last", () => {
    const { handle } = mount();
    item("Fruit").focus();
    press("ArrowUp");
    assert.equal(focused(), "Veg");
    press("ArrowUp");
    assert.equal(focused(), "Green");
    handle.dispose();
});

test("Home and End jump to the first and last item", () => {
    const { handle } = mount();
    item("Tea").focus();
    press("End");
    assert.equal(focused(), "Veg");
    press("Home");
    assert.equal(focused(), "Fruit");
    handle.dispose();
});

test("cancels the keys it handles and leaves other keys alone", () => {
    const { handle } = mount();
    item("Fruit").focus();
    assert.deepEqual(["ArrowDown", "Home", "End", "ArrowRight", "Tab", "Enter"].map(press), [
        true,
        true,
        true,
        false,
        false,
        true, // Enter activates the item.
    ]);
    handle.dispose();
});

test("dispose removes the listener", () => {
    const { handle } = mount();
    handle.dispose();
    item("Fruit").focus();
    assert.equal(press("ArrowDown"), false);
    assert.equal(focused(), "Fruit");
});
