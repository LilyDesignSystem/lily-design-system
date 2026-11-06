// Behaviour tests for the keys in Popover.razor.js (DropdownMenu, ContextMenu) and NavigationMenu.razor.js. bUnit runs no
// JavaScript, so these are the only tests of those keys.
// Run: JSDOM_PATH=/path/to/jsdom node --test tests/js/menu-keys.test.mjs
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
    Object.defineProperty(globalThis, k, {
        configurable: true,
        value: k === "window" ? dom.window : dom.window[k],
    });
}
globalThis.ResizeObserver = class {
    observe() {}
    disconnect() {}
};
const { attach } = await import("../../src/LilyBlazorHeadless/Components/Popover.razor.js");
const { setupOverflowNavigation } = await import(
    "../../src/LilyBlazorHeadless/Components/NavigationMenu.razor.js"
);

const press = (el, key) => el.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));

function menu() {
    document.body.innerHTML = `<button id="t">Open</button><div id="m">
        <button role="menuitem" id="a">A</button><button role="menuitem" id="b">B</button><button role="menuitem" id="c">C</button>
    </div>`;
    const node = document.getElementById("m");
    const trigger = document.getElementById("t");
    const handle = attach(node, { invokeMethodAsync() {} }, true, trigger, { menu: true });
    document.getElementById("a").focus();
    return { node, trigger, handle };
}
const active = () => document.activeElement.id;

test("ArrowDown and ArrowUp move through the menu and wrap", () => {
    const { node, handle } = menu();
    press(node, "ArrowDown");
    assert.equal(active(), "b");
    press(node, "ArrowUp");
    press(node, "ArrowUp");
    assert.equal(active(), "c");
    press(node, "ArrowDown");
    assert.equal(active(), "a");
    handle.dispose();
});

test("Home and End jump to the ends", () => {
    const { node, handle } = menu();
    press(node, "End");
    assert.equal(active(), "c");
    press(node, "Home");
    assert.equal(active(), "a");
    handle.dispose();
});

test("Escape closes the fallback menu and returns focus to the trigger", () => {
    const { node, handle } = menu();
    press(node, "Escape");
    assert.equal(node.hidden, true);
    assert.equal(active(), "t");
    handle.dispose();
});

test("a popover that is not a menu takes no keys", () => {
    document.body.innerHTML = `<div id="m"><button role="menuitem" id="a">A</button><button role="menuitem" id="b">B</button></div>`;
    const node = document.getElementById("m");
    const handle = attach(node, { invokeMethodAsync() {} }, true, null, {});
    document.getElementById("a").focus();
    press(node, "ArrowDown");
    assert.equal(active(), "a");
    handle.dispose();
});

test("Escape closes the More list and returns focus to its button", () => {
    document.body.innerHTML = `<nav class="navigation-menu"><ul class="navigation-menu-list"><li><a href="#a">A</a></li>
        <li class="navigation-menu-more"><button class="navigation-menu-more-button" type="button" aria-expanded="false">More</button>
        <ul class="navigation-menu-more-list" hidden><li><a id="x" href="#x">X</a></li></ul></li></ul></nav>`;
    const root = document.querySelector("nav");
    const nav = setupOverflowNavigation(root);
    const button = root.querySelector(".navigation-menu-more-button");
    const list = root.querySelector(".navigation-menu-more-list");
    // jsdom measures every width as 0, so nothing overflows and the module hides the More item. Show it, as a real overflow would.
    root.querySelector(".navigation-menu-more").hidden = false;
    button.click();
    assert.equal(button.getAttribute("aria-expanded"), "true");
    assert.equal(list.hidden, false);
    press(button, "Escape");
    assert.equal(list.hidden, true);
    assert.equal(button.getAttribute("aria-expanded"), "false");
    assert.equal(document.activeElement, button);
    nav?.destroy?.();
});
