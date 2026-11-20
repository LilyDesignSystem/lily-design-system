// @vitest-environment jsdom
// The menu module directly: keys, submenus in a menu and a menubar, right-to-left, clicks, focus leaving, tree keys.
import { afterEach, expect, test } from "vitest";

import {
    activateItem,
    attach,
    attachMenu,
    menuKeydown,
    treeItemKey,
    typeaheadTarget,
} from "./menu-keys";

afterEach(() => {
    document.body.innerHTML = "";
});

const key = (k: string, init: KeyboardEventInit = {}) =>
    new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true, ...init });

function press(target: Element, k: string, init: KeyboardEventInit = {}): KeyboardEvent {
    const event = key(k, init);
    target.dispatchEvent(event);
    return event;
}

const focused = () => document.activeElement as HTMLElement;

/** A menubar: File (with a submenu of New, Open), Edit, View. */
function bar(dir = "ltr") {
    document.body.innerHTML = `
        <div role="menubar" id="bar" dir="${dir}" style="direction:${dir}">
            <button role="menuitem" id="file" aria-haspopup="menu" aria-expanded="false" aria-controls="file-menu">File</button>
            <div role="menu" id="file-menu" hidden>
                <div role="menuitem" id="new" tabindex="-1">New</div>
                <div role="menuitem" id="open" tabindex="-1">Open</div>
            </div>
            <button role="menuitem" id="edit">Edit</button>
            <button role="menuitem" id="view">View</button>
        </div>`;
    const root = document.getElementById("bar")!;
    const detach = attachMenu(root, "horizontal");
    const $ = (id: string) => document.getElementById(id)!;
    return { root, detach, $ };
}

/** A vertical menu: Cut, Copy, More (with a submenu of Paste, Paste special), a disabled Delete. */
function menu() {
    document.body.innerHTML = `
        <div role="menu" id="m">
            <div role="menuitem" id="cut" tabindex="-1">Cut</div>
            <div role="menuitem" id="copy" tabindex="-1">Copy</div>
            <div role="menuitem" id="more" tabindex="-1" aria-haspopup="menu" aria-expanded="false" aria-controls="more-menu">More</div>
            <div role="menu" id="more-menu" hidden>
                <div role="menuitem" id="paste" tabindex="-1">Paste</div>
                <div role="menuitem" id="special" tabindex="-1">Paste special</div>
            </div>
            <div role="menuitem" id="delete" tabindex="-1" aria-disabled="true">Delete</div>
        </div>`;
    const root = document.getElementById("m")!;
    const detach = attachMenu(root, "vertical");
    const $ = (id: string) => document.getElementById(id)!;
    return { root, detach, $ };
}

test("attaching gives the first item the one tab stop, and focus moves it", () => {
    const { $ } = menu();
    expect($("cut").tabIndex).toBe(0);
    expect($("copy").tabIndex).toBe(-1);
    $("copy").focus();
    expect($("copy").tabIndex).toBe(0);
    expect($("cut").tabIndex).toBe(-1);
});

test("attaching keeps a tab stop the consumer already set", () => {
    document.body.innerHTML = `<div role="menu" id="m"><div role="menuitem" id="a" tabindex="-1">A</div><div role="menuitem" id="b" tabindex="0">B</div></div>`;
    attachMenu(document.getElementById("m")!, "vertical");
    expect(document.getElementById("b")!.tabIndex).toBe(0);
    expect(document.getElementById("a")!.tabIndex).toBe(-1);
});

test("attaching an empty menu does nothing", () => {
    document.body.innerHTML = `<div role="menu" id="m"></div>`;
    expect(() => attachMenu(document.getElementById("m")!, "vertical")()).not.toThrow();
});

test("a vertical menu moves on ArrowDown and ArrowUp, wraps, skips disabled items and jumps with Home and End", () => {
    const { $ } = menu();
    $("cut").focus();
    expect(press($("cut"), "ArrowDown").defaultPrevented).toBe(true);
    expect(focused().id).toBe("copy");
    press(focused(), "ArrowDown");
    expect(focused().id).toBe("more");
    press(focused(), "ArrowDown");
    expect(focused().id).toBe("cut"); // Delete is disabled; wraps.
    press(focused(), "ArrowUp");
    expect(focused().id).toBe("more");
    press(focused(), "End");
    expect(focused().id).toBe("more");
    press(focused(), "Home");
    expect(focused().id).toBe("cut");
    press(focused(), "ArrowUp");
    expect(focused().id).toBe("more");
});

test("a key sent to the container acts on the focused item", () => {
    const { root, $ } = menu();
    $("copy").focus();
    press(root, "ArrowDown");
    expect(focused().id).toBe("more");
});

test("a key outside any menu is ignored", () => {
    document.body.innerHTML = `<p id="p">x</p>`;
    const event = key("ArrowDown");
    Object.defineProperty(event, "target", { value: document.getElementById("p") });
    menuKeydown(event, "vertical");
    expect(event.defaultPrevented).toBe(false);
});

test("a key during composition is ignored", () => {
    const { $ } = menu();
    $("cut").focus();
    press($("cut"), "ArrowDown", { isComposing: true });
    expect(focused().id).toBe("cut");
});

test("in a vertical menu ArrowRight opens a submenu on its first item and ArrowLeft returns", () => {
    const { $ } = menu();
    $("more").focus();
    press($("more"), "ArrowRight");
    expect($("more").getAttribute("aria-expanded")).toBe("true");
    expect($("more-menu").hidden).toBe(false);
    expect(focused().id).toBe("paste");
    press(focused(), "ArrowDown");
    expect(focused().id).toBe("special");
    press(focused(), "ArrowLeft");
    expect($("more").getAttribute("aria-expanded")).toBe("false");
    expect($("more-menu").hidden).toBe(true);
    expect(focused().id).toBe("more");
});

test("Enter and Space open a submenu; Escape closes it to its parent", () => {
    const { $ } = menu();
    for (const k of ["Enter", " "]) {
        $("more").focus();
        press($("more"), k);
        expect(focused().id).toBe("paste");
        press(focused(), "Escape");
        expect(focused().id).toBe("more");
        expect($("more-menu").hidden).toBe(true);
    }
});

test("in a menubar ArrowRight and ArrowLeft move and wrap", () => {
    const { $ } = bar();
    $("file").focus();
    press($("file"), "ArrowRight");
    expect(focused().id).toBe("edit");
    press(focused(), "ArrowRight");
    press(focused(), "ArrowRight");
    expect(focused().id).toBe("file");
    press(focused(), "ArrowLeft");
    expect(focused().id).toBe("view");
});

test("right-to-left swaps the menubar's arrows", () => {
    const { $ } = bar("rtl");
    $("file").focus();
    press($("file"), "ArrowLeft");
    expect(focused().id).toBe("edit");
    press(focused(), "ArrowRight");
    expect(focused().id).toBe("file");
});

test("in a menubar ArrowDown opens on the first item and ArrowUp on the last", () => {
    const { $ } = bar();
    $("file").focus();
    press($("file"), "ArrowDown");
    expect(focused().id).toBe("new");
    press(focused(), "Escape");
    expect(focused().id).toBe("file");
    press(focused(), "ArrowUp");
    expect(focused().id).toBe("open");
});

test("in a menubar's submenu ArrowRight and ArrowLeft close it and move along the bar", () => {
    const { $ } = bar();
    $("file").focus();
    press($("file"), "ArrowDown");
    press(focused(), "ArrowRight");
    expect($("file-menu").hidden).toBe(true);
    expect(focused().id).toBe("edit");
    $("file").focus();
    press($("file"), "ArrowDown");
    press(focused(), "ArrowLeft");
    expect($("file-menu").hidden).toBe(true);
    expect(focused().id).toBe("view");
});

test("a submenu whose parent item cannot be found ignores Escape", () => {
    document.body.innerHTML = `<div role="menu" id="m"><div role="menu" id="orphan"><div role="menuitem" id="x" tabindex="-1">X</div></div></div>`;
    const x = document.getElementById("x")!;
    attachMenu(document.getElementById("m")!, "vertical");
    x.focus();
    expect(press(x, "Escape").defaultPrevented).toBe(false);
    expect(focused().id).toBe("x");
});

test("Enter on a non-native leaf clicks it; on a native button it leaves the browser to act", () => {
    const { $ } = menu();
    let clicks = 0;
    $("cut").addEventListener("click", () => clicks++);
    $("cut").focus();
    expect(press($("cut"), "Enter").defaultPrevented).toBe(true);
    expect(clicks).toBe(1);

    const b = bar();
    let edits = 0;
    b.$("edit").addEventListener("click", () => edits++);
    b.$("edit").focus();
    expect(press(b.$("edit"), "Enter").defaultPrevented).toBe(false);
    expect(edits).toBe(0);
});

test("a typed letter jumps to the next match and a repeat cycles", () => {
    const { $ } = menu();
    $("cut").focus();
    press($("cut"), "c");
    expect(focused().id).toBe("copy");
    press(focused(), "C");
    expect(focused().id).toBe("cut");
    press(focused(), "z");
    expect(focused().id).toBe("cut");
});

test("type-ahead ignores modifiers, non-printing keys and composition, and reads aria-label", () => {
    document.body.innerHTML = `<div id="a" aria-label="Zebra">x</div><div id="b">  Ápple </div><div id="c"></div>`;
    const items = [...document.querySelectorAll<HTMLElement>("div")];
    expect(typeaheadTarget(items, null, key("z"))?.id).toBe("a");
    expect(typeaheadTarget(items, items[0], key("á"))?.id).toBe("b");
    expect(typeaheadTarget(items, null, key("z", { ctrlKey: true }))).toBeUndefined();
    expect(typeaheadTarget(items, null, key("z", { metaKey: true }))).toBeUndefined();
    expect(typeaheadTarget(items, null, key("z", { altKey: true }))).toBeUndefined();
    expect(typeaheadTarget(items, null, key("z", { isComposing: true }))).toBeUndefined();
    expect(typeaheadTarget(items, null, key("Tab"))).toBeUndefined();
    expect(typeaheadTarget(items, null, key(" "))).toBeUndefined();
});

test("activateItem acts only on Enter or Space on a non-native item", () => {
    document.body.innerHTML = `<div id="d">D</div><a id="a" href="#">A</a>`;
    expect(activateItem(key("Enter"), null)).toBe(false);
    expect(activateItem(key("x"), document.getElementById("d"))).toBe(false);
    expect(activateItem(key("Enter"), document.getElementById("a"))).toBe(false);
    expect(activateItem(key(" "), document.getElementById("d"))).toBe(true);
});

test("a click on a parent toggles its submenu; a click on a leaf in a submenu closes all and refocuses the parent", () => {
    const { $ } = bar();
    $("file").click();
    expect($("file-menu").hidden).toBe(false);
    $("file").click();
    expect($("file-menu").hidden).toBe(true);
    $("file").click();
    $("new").click();
    expect($("file-menu").hidden).toBe(true);
    expect($("file").getAttribute("aria-expanded")).toBe("false");
    expect(focused().id).toBe("file");
});

test("a click on a top-level leaf or outside an item leaves submenus alone", () => {
    const { root, $ } = bar();
    $("file").click();
    $("edit").click();
    expect($("file-menu").hidden).toBe(false);
    root.click();
    expect($("file-menu").hidden).toBe(false);
});

test("focus leaving the menu closes every submenu; focus moving inside does not", () => {
    const { $ } = bar();
    document.body.insertAdjacentHTML("beforeend", `<button id="out">Out</button>`);
    $("file").focus();
    press($("file"), "ArrowDown");
    $("open").focus();
    expect($("file-menu").hidden).toBe(false);
    $("out").focus();
    expect($("file-menu").hidden).toBe(true);
});

test("a popover submenu opens and closes with the Popover API, tolerating its state errors", () => {
    document.body.innerHTML = `
        <div role="menu" id="m">
            <div role="menuitem" id="p" tabindex="-1" aria-controls="pm" aria-expanded="false">P</div>
            <div role="menu" id="pm" popover><div role="menuitem" id="q" tabindex="-1">Q</div></div>
        </div>`;
    const pm = document.getElementById("pm")! as HTMLElement & {
        showPopover: () => void;
        hidePopover: () => void;
    };
    const calls: string[] = [];
    // jsdom has no Popover API: stand in for it, with the hide refusing as a browser does for a closed popover.
    const show = () => (pm.style.display = "block");
    const hide = () => (pm.style.display = "");
    pm.showPopover = () => {
        calls.push("show");
        show();
    };
    pm.hidePopover = () => {
        calls.push("hide");
        hide();
        throw new Error("InvalidStateError");
    };
    attachMenu(document.getElementById("m")!, "vertical");
    const p = document.getElementById("p")!;
    p.focus();
    press(p, "ArrowRight");
    expect(calls).toEqual(["show"]);
    expect(p.getAttribute("aria-expanded")).toBe("true");
    expect(focused().id).toBe("q");
    press(focused(), "Escape");
    expect(calls).toEqual(["show", "hide"]);
    expect(p.getAttribute("aria-expanded")).toBe("false");
    expect(focused().id).toBe("p");
});

test("aria-controls that names no menu is not a submenu", () => {
    document.body.innerHTML = `
        <div role="menu" id="m">
            <div role="menuitem" id="a" tabindex="-1" aria-controls="nothing">A</div>
            <div role="menuitem" id="b" tabindex="-1" aria-controls="region">B</div>
            <div id="region" role="region" hidden></div>
        </div>`;
    attachMenu(document.getElementById("m")!, "vertical");
    const b = document.getElementById("b")!;
    let clicks = 0;
    b.addEventListener("click", () => clicks++);
    b.focus();
    press(b, "Enter");
    expect(clicks).toBe(1);
    expect(document.getElementById("region")!.hidden).toBe(true);
    expect(b.hasAttribute("aria-expanded")).toBe(false);
});

test("cleanup removes every listener", () => {
    const { detach, $ } = menu();
    detach();
    $("cut").focus();
    press($("cut"), "ArrowDown");
    expect(focused().id).toBe("cut");
    $("more").click();
    expect($("more-menu").hidden).toBe(true);
});

test("attach defaults to vertical and disposes", () => {
    document.body.innerHTML = `<div role="menu" id="m"><div role="menuitem" id="a" tabindex="-1">A</div><div role="menuitem" id="b" tabindex="-1">B</div></div>`;
    const handle = attach(document.getElementById("m")!);
    const a = document.getElementById("a")!;
    a.focus();
    press(a, "ArrowDown");
    expect(focused().id).toBe("b");
    handle.dispose();
    press(focused(), "ArrowDown");
    expect(focused().id).toBe("b");
    attach(document.getElementById("m")!, "horizontal").dispose();
});

test("treeItemKey activates and type-aheads, and skips a key already handled", () => {
    document.body.innerHTML = `
        <ul role="tree" id="t">
            <li role="treeitem" id="apple" tabindex="0"><span id="label">Apple</span></li>
            <li role="treeitem" id="banana" tabindex="-1">Banana</li>
            <li role="treeitem" id="blueberry" tabindex="-1">Blueberry</li>
        </ul>`;
    const items = [...document.querySelectorAll<HTMLElement>('[role="treeitem"]')];
    const tree = document.getElementById("t")!;
    tree.addEventListener("keydown", (e) => treeItemKey(e, items));
    let clicks = 0;
    items[0].addEventListener("click", () => clicks++);

    items[0].focus();
    press(document.getElementById("label")!, "Enter");
    expect(clicks).toBe(1);
    press(items[0], "b");
    expect(focused().id).toBe("banana");
    press(focused(), "b");
    expect(focused().id).toBe("blueberry");
    // Sent to the tree itself, the focused item is the current one.
    press(tree, "a");
    expect(focused().id).toBe("apple");
    press(focused(), "q");
    expect(focused().id).toBe("apple");

    const handled = key("b");
    handled.preventDefault();
    items[0].dispatchEvent(handled);
    expect(focused().id).toBe("apple");
});
