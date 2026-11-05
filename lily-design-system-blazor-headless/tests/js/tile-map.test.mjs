// Behaviour tests for src/LilyBlazorHeadless/Components/TileMap.razor.js
// (mirrors the Svelte TileMap.test.ts key cases).
// Run: JSDOM_PATH=/path/to/jsdom node --test tests/js/tile-map.test.mjs
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
for (const k of ["window", "document", "HTMLElement", "Node", "KeyboardEvent", "CustomEvent"]) {
    globalThis[k] = k === "window" ? dom.window : (dom.window[k] ?? globalThis[k]);
}
const { attach } = await import("../../src/LilyBlazorHeadless/Components/TileMap.razor.js");

// A 3 x 2 grid: a b c / d e f. jsdom has no layout, so each tile reports its own box.
function mount() {
    document.body.innerHTML = `<div class="tile-map" role="img" aria-label="Regions" aria-roledescription="tile map">${[
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
    ]
        .map((t) => `<div data-tile tabindex="0">${t}</div>`)
        .join("")}</div>`;
    const root = document.querySelector(".tile-map");
    [...root.querySelectorAll("[data-tile]")].forEach((tile, i) => {
        const left = (i % 3) * 10;
        const top = Math.floor(i / 3) * 10;
        tile.getBoundingClientRect = () => ({
            left,
            top,
            width: 10,
            height: 10,
            right: left + 10,
            bottom: top + 10,
        });
    });
    return { root, handle: attach(root) };
}
const tile = (t) => [...document.querySelectorAll("[data-tile]")].find((e) => e.textContent === t);
const focused = () => document.activeElement.textContent;
const press = (key) => {
    const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true });
    document.activeElement.dispatchEvent(event);
    return event.defaultPrevented;
};

test("ArrowRight and ArrowLeft step through the tiles and stop at the ends", () => {
    const { handle } = mount();
    tile("a").focus();
    press("ArrowLeft");
    assert.equal(focused(), "a");
    press("ArrowRight");
    press("ArrowRight");
    assert.equal(focused(), "c");
    tile("f").focus();
    press("ArrowRight");
    assert.equal(focused(), "f");
    press("ArrowLeft");
    assert.equal(focused(), "e");
    handle.dispose();
});

test("ArrowDown and ArrowUp go to the nearest tile in the next or previous row", () => {
    const { handle } = mount();
    tile("b").focus();
    press("ArrowDown");
    assert.equal(focused(), "e");
    press("ArrowDown");
    assert.equal(focused(), "e");
    tile("f").focus();
    press("ArrowUp");
    assert.equal(focused(), "c");
    handle.dispose();
});

test("a nearer row wins over a tile further down that is directly below", () => {
    const { handle } = mount();
    // "b" sits one row down, slightly to the right; "f" sits two rows down, directly below "a".
    const box = (left, top) => () => ({
        left,
        top,
        width: 10,
        height: 10,
        right: left + 10,
        bottom: top + 10,
    });
    tile("a").getBoundingClientRect = box(0, 0);
    tile("b").getBoundingClientRect = box(5, 10);
    tile("f").getBoundingClientRect = box(0, 20);
    for (const t of ["c", "d", "e"]) tile(t).getBoundingClientRect = box(100, 0);
    tile("a").focus();
    press("ArrowDown");
    assert.equal(focused(), "b");
    handle.dispose();
});

test("Enter and Space dispatch a bubbling tile-activate on the focused tile", () => {
    const { root, handle } = mount();
    const seen = [];
    root.addEventListener("tile-activate", (e) => seen.push(e.target.textContent));
    tile("d").focus();
    press("Enter");
    press(" ");
    assert.deepEqual(seen, ["d", "d"]);
    handle.dispose();
});

test("Escape deselects the focused tile", () => {
    const { handle } = mount();
    tile("c").focus();
    press("Escape");
    assert.equal(document.activeElement, document.body);
    handle.dispose();
});

test("cancels the keys it handles and leaves other keys alone", () => {
    const { handle } = mount();
    tile("a").focus();
    assert.deepEqual(
        ["ArrowRight", "ArrowDown", "Enter", "Escape", "Tab", "a"].map((key) => {
            tile("a").focus();
            return press(key);
        }),
        [true, true, true, true, false, false],
    );
    handle.dispose();
});

test("dispose removes the listener", () => {
    const { handle } = mount();
    handle.dispose();
    tile("a").focus();
    assert.equal(press("ArrowRight"), false);
    assert.equal(focused(), "a");
});
