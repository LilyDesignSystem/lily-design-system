// Behaviour tests for src/LilyBlazorHeadless/Components/Menu.razor.js
// (mirrors the Svelte Menu.test.ts key cases).
// Run: JSDOM_PATH=/path/to/jsdom node --test tests/js/menu.test.mjs
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
const { attach } = await import("../../src/LilyBlazorHeadless/Components/Menu.razor.js");

function mount() {
    document.body.innerHTML = `<div class="menu" role="menu" aria-label="Actions"><button role="menuitem">Copy</button><button role="menuitem">Paste</button><button role="menuitem">Delete</button></div>`;
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
    item("Copy").focus();
    const seen = [];
    for (let i = 0; i < 3; i++) {
        press("ArrowDown");
        seen.push(focused());
    }
    assert.deepEqual(seen, ["Paste", "Delete", "Copy"]);
    handle.dispose();
});

test("ArrowUp moves focus to the previous item and wraps from the first to the last", () => {
    const { handle } = mount();
    item("Copy").focus();
    press("ArrowUp");
    assert.equal(focused(), "Delete");
    press("ArrowUp");
    assert.equal(focused(), "Paste");
    handle.dispose();
});

test("Home and End jump to the first and last item", () => {
    const { handle } = mount();
    item("Paste").focus();
    press("End");
    assert.equal(focused(), "Delete");
    press("Home");
    assert.equal(focused(), "Copy");
    handle.dispose();
});

test("cancels the keys it handles and leaves other keys alone", () => {
    const { handle } = mount();
    item("Copy").focus();
    assert.deepEqual(["ArrowDown", "Home", "End", "ArrowRight", "Tab", "Enter"].map(press), [
        true,
        true,
        true,
        false,
        false,
        false,
    ]);
    handle.dispose();
});

test("dispose removes the listener", () => {
    const { handle } = mount();
    handle.dispose();
    item("Copy").focus();
    assert.equal(press("ArrowDown"), false);
    assert.equal(focused(), "Copy");
});
