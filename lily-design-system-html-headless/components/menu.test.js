// menu.test.js
// Menu component test

const path = require("path");

describe("Menu", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "menu.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.menu");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("menu");
    });

    it("should have the correct ARIA role", async function () {
        const el = await $("div.menu");
        const roleAttr = await el.getAttribute("role");
        expect(roleAttr).toBe("menu");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.menu");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});

// Keyboard behaviour (P12-T4): real key presses in a real browser.
describe("Menu keyboard", function () {
    async function load(inner) {
        await browser.url("file://" + path.resolve(__dirname, "menu.html"));
        if (inner !== undefined) {
            await browser.execute(
                (sel, html) => {
                    document.querySelector(sel).insertAdjacentHTML("beforeend", html);
                },
                ".menu",
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

    const ITEMS =
        '<div id="a" role="menuitem" tabindex="-1">a</div><div id="b" role="menuitem" tabindex="-1">b</div><div id="c" role="menuitem" tabindex="-1">c</div>';
    it("ArrowDown moves to the next item and wraps", async function () {
        await load(ITEMS);
        await focus("a");
        await browser.keys("ArrowDown");
        expect(await active()).toBe("b");
        await focus("c");
        await browser.keys("ArrowDown");
        expect(await active()).toBe("a");
    });
    it("ArrowUp moves to the previous item and wraps", async function () {
        await load(ITEMS);
        await focus("b");
        await browser.keys("ArrowUp");
        expect(await active()).toBe("a");
        await browser.keys("ArrowUp");
        expect(await active()).toBe("c");
    });
    it("Home and End jump to the first and last item", async function () {
        await load(ITEMS);
        await focus("b");
        await browser.keys("End");
        expect(await active()).toBe("c");
        await browser.keys("Home");
        expect(await active()).toBe("a");
    });
    it("ignores keys that are not part of its contract", async function () {
        await load(ITEMS);
        await focus("b");
        await browser.keys("x");
        expect(await active()).toBe("b");
    });
});
