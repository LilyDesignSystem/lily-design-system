// tree-list.test.js
// TreeList component test

const path = require("path");

describe("TreeList", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "tree-list.html"));
    });

    it("should render the ol element with correct class", async function () {
        const el = await $("ol.tree-list");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("tree-list");
    });

    it("should have the correct ARIA role", async function () {
        const el = await $("ol.tree-list");
        const roleAttr = await el.getAttribute("role");
        expect(roleAttr).toBe("tree");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("ol.tree-list");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});

// Keyboard behaviour (P12-T4): real key presses in a real browser.
describe("TreeList keyboard", function () {
    async function load(inner) {
        await browser.url("file://" + path.resolve(__dirname, "tree-list.html"));
        if (inner !== undefined) {
            await browser.execute(
                (sel, html) => {
                    document.querySelector(sel).insertAdjacentHTML("beforeend", html);
                },
                ".tree-list",
                inner,
            );
        }
    }
    async function active() {
        return browser.execute(() => document.activeElement && document.activeElement.id);
    }
    async function focus(id) {
        await browser.execute((i) => document.getElementById(i).focus(), id);
    }
    async function attr(selector, name) {
        return browser.execute((s, n) => document.querySelector(s).getAttribute(n), selector, name);
    }

    const TREE =
        '<li id="a" role="treeitem" tabindex="-1" aria-expanded="true">a<ol role="group"><li id="a1" role="treeitem" tabindex="-1">a1</li></ol></li>' +
        '<li id="b" role="treeitem" tabindex="-1" aria-expanded="false">b<ol role="group"><li id="b1" role="treeitem" tabindex="-1">b1</li></ol></li>' +
        '<li id="c" role="treeitem" tabindex="-1">c</li>';
    it("ArrowDown/ArrowUp skip the children of a collapsed branch and wrap", async function () {
        await load(TREE);
        await focus("a");
        await browser.keys("ArrowDown");
        expect(await active()).toBe("a1");
        await browser.keys("ArrowDown");
        expect(await active()).toBe("b");
        await browser.keys("ArrowDown");
        expect(await active()).toBe("c");
        await browser.keys("ArrowDown");
        expect(await active()).toBe("a");
        await browser.keys("ArrowUp");
        expect(await active()).toBe("c");
    });
    it("Home and End jump to the first and last visible item", async function () {
        await load(TREE);
        await focus("b");
        await browser.keys("End");
        expect(await active()).toBe("c");
        await browser.keys("Home");
        expect(await active()).toBe("a");
    });
    it("ArrowRight expands a collapsed branch, then enters it", async function () {
        await load(TREE);
        await focus("b");
        await browser.keys("ArrowRight");
        expect(await attr("#b", "aria-expanded")).toBe("true");
        await browser.keys("ArrowRight");
        expect(await active()).toBe("b1");
    });
    it("ArrowLeft collapses an expanded branch, else moves to the parent", async function () {
        await load(TREE);
        await focus("a1");
        await browser.keys("ArrowLeft");
        expect(await active()).toBe("a");
        await browser.keys("ArrowLeft");
        expect(await attr("#a", "aria-expanded")).toBe("false");
    });
});
