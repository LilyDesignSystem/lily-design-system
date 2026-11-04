// @vitest-environment jsdom
// What the tabs, menu and menubar contracts do not reach.
import { afterEach, expect, test } from "vitest";

import { initMenu } from "./menu/menu.js";
import { initMenuBar } from "./menu-bar/menu-bar.js";
import { initTabBar } from "./tab-bar/tab-bar.js";

const press = (el, key, init = {}) => {
    const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init });
    el.dispatchEvent(event);
    return event;
};
const mount = (html) => {
    document.body.innerHTML = html;
    return document.body.firstElementChild;
};
const MENU = `<ul class="menu" role="menu"><li><button role="menuitem">Apple</button></li><li><button role="menuitem" disabled>Avocado</button></li><li><button role="menuitem">Banana</button></li><li><button role="menuitem">Blueberry</button></li></ul>`;

afterEach(() => {
    document.body.innerHTML = "";
});

test("a menu is one tab stop, and the stop follows focus", () => {
    const root = mount(MENU);
    const handle = initMenu(root);
    const items = root.querySelectorAll("[role='menuitem']");
    expect(items[0].tabIndex).toBe(0);
    expect(items[2].tabIndex).toBe(-1);
    items[2].focus();
    expect(items[0].tabIndex).toBe(-1);
    expect(items[2].tabIndex).toBe(0);
    handle.dispose();
});

test("a typed letter jumps, a repeat cycles, and a disabled item is skipped", () => {
    const root = mount(MENU);
    const handle = initMenu(root);
    const items = root.querySelectorAll("[role='menuitem']");
    items[0].focus();
    expect(press(items[0], "b").defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(items[2]);
    press(items[2], "B");
    expect(document.activeElement).toBe(items[3]);
    press(items[3], "a");
    expect(document.activeElement).toBe(items[0]);
    handle.dispose();
});

test("a shortcut and a key during IME composition are left alone", () => {
    const root = mount(MENU);
    const handle = initMenu(root);
    const item = root.querySelector("[role='menuitem']");
    item.focus();
    expect(press(item, "b", { ctrlKey: true }).defaultPrevented).toBe(false);
    expect(press(item, "b", { isComposing: true }).defaultPrevented).toBe(false);
    handle.dispose();
});

test("right-to-left swaps a menu bar's arrows", () => {
    const root = mount(
        `<div class="menu-bar" role="menubar" style="direction: rtl"><button role="menuitem">One</button><button role="menuitem">Two</button></div>`,
    );
    const handle = initMenuBar(root);
    const [one, two] = root.querySelectorAll("[role='menuitem']");
    one.focus();
    press(one, "ArrowLeft");
    expect(document.activeElement).toBe(two);
    handle.dispose();
});

test("a vertical tab bar uses the block arrows", () => {
    const root = mount(
        `<div class="tab-bar" role="tablist" aria-orientation="vertical"><button role="tab">One</button><button role="tab">Two</button></div>`,
    );
    const handle = initTabBar(root);
    const [one, two] = root.querySelectorAll("[role='tab']");
    one.focus();
    press(one, "ArrowDown");
    expect(document.activeElement).toBe(two);
    handle.dispose();
});

test("clicking a tab selects it, and the tab stop stays on the selected tab while focus moves", () => {
    const root = mount(
        `<div class="tab-bar" role="tablist"><button role="tab" aria-selected="true" tabindex="0">One</button><button role="tab" aria-selected="false" tabindex="-1">Two</button></div>`,
    );
    const handle = initTabBar(root);
    const [one, two] = root.querySelectorAll("[role='tab']");
    one.focus();
    press(one, "ArrowRight");
    expect(document.activeElement).toBe(two);
    expect(one.tabIndex).toBe(0);
    two.click();
    expect(two.getAttribute("aria-selected")).toBe("true");
    expect(one.getAttribute("aria-selected")).toBe("false");
    expect(two.tabIndex).toBe(0);
    expect(one.tabIndex).toBe(-1);
    handle.dispose();
});
