// Behaviour tests for src/LilyBlazorHeadless/Components/Autosuggest.razor.js
// (the default actions the C# key handler cannot cancel).
// Run: JSDOM_PATH=/path/to/jsdom node --test tests/js/autosuggest.test.mjs
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
const { attach } = await import("../../src/LilyBlazorHeadless/Components/Autosuggest.razor.js");

function mount(expanded) {
    document.body.innerHTML = `<input role="combobox" aria-expanded="${expanded}">`;
    const input = document.querySelector("input");
    return { input, handle: attach(input) };
}
const press = (el, key) => {
    const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true });
    el.dispatchEvent(event);
    return event.defaultPrevented;
};

test("ArrowDown and ArrowUp are always cancelled", () => {
    const { input, handle } = mount("false");
    assert.equal(press(input, "ArrowDown"), true);
    assert.equal(press(input, "ArrowUp"), true);
    handle.dispose();
});

test("Home, End, Enter and Escape are cancelled only while the list is open", () => {
    const closed = mount("false");
    for (const key of ["Home", "End", "Enter", "Escape"])
        assert.equal(press(closed.input, key), false, key);
    closed.handle.dispose();
    const open = mount("true");
    for (const key of ["Home", "End", "Enter", "Escape"])
        assert.equal(press(open.input, key), true, key);
    open.handle.dispose();
});

test("typing is never cancelled, and dispose detaches", () => {
    const { input, handle } = mount("true");
    assert.equal(press(input, "a"), false);
    handle.dispose();
    assert.equal(press(input, "ArrowDown"), false);
});
