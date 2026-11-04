// @vitest-environment jsdom
// The shared tree and tree-expand contracts against the macro's markup and tree.js.
import { afterEach, expect, test } from "vitest";

import { runPattern } from "../../../shared/pattern-tester";
import { render } from "../../test/render.js";
import { autoInit, initTreeList } from "./tree.js";

const mount = (html) => {
    document.body.innerHTML = render("tree-list", { label: "Files" }, html).document.body.innerHTML;
    return document.querySelector(".tree-list");
};

afterEach(() => {
    document.body.innerHTML = "";
});

test("meets the tree contract", async () => {
    const tree = mount("");
    const handle = initTreeList(tree);
    await runPattern("tree", { root: tree, hook: "tree-list" });
    handle.dispose();
});

test("meets the tree-expand contract", async () => {
    const tree = mount(
        `<li role="treeitem" aria-expanded="true">Parent<ol role="group"><li id="branch" role="treeitem" tabindex="-1" aria-expanded="false">Branch<ol role="group"><li role="treeitem" tabindex="-1">Child</li></ol></li></ol></li>`,
    );
    const handle = initTreeList(tree);
    await runPattern("tree-expand", { root: document.getElementById("branch"), hook: "tree-list" });
    handle.dispose();
});

test("the tree is one tab stop, and the stop follows focus", () => {
    const tree = mount(
        `<li role="treeitem" tabindex="-1">One</li><li role="treeitem" tabindex="-1">Two</li>`,
    );
    const [handle] = autoInit(document);
    const [one, two] = tree.querySelectorAll("[role='treeitem']");
    expect([one.tabIndex, two.tabIndex]).toEqual([0, -1]);
    two.focus();
    expect([one.tabIndex, two.tabIndex]).toEqual([-1, 0]);
    handle.dispose();
});

test("right-to-left swaps ArrowRight and ArrowLeft", () => {
    const tree = mount(`<li role="treeitem" aria-expanded="false">Branch</li>`);
    tree.setAttribute("dir", "rtl");
    tree.style.direction = "rtl";
    const handle = initTreeList(tree);
    const item = tree.querySelector("[role='treeitem']");
    item.focus();
    const press = (key) =>
        item.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
    press("ArrowRight");
    expect(item.getAttribute("aria-expanded")).toBe("false");
    press("ArrowLeft");
    expect(item.getAttribute("aria-expanded")).toBe("true");
    handle.dispose();
});
