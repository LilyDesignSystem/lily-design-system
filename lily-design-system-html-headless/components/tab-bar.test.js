// tab-bar.test.js
// TabBar component test

const path = require("path");

describe("TabBar", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "tab-bar.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.tab-bar");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("tab-bar");
    });

    it("should have the correct ARIA role", async function () {
        const el = await $("div.tab-bar");
        const roleAttr = await el.getAttribute("role");
        expect(roleAttr).toBe("tablist");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.tab-bar");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});

// Keyboard behaviour (P12-T4): real key presses in a real browser.
describe("TabBar keyboard", function () {
    async function load(inner) {
        await browser.url("file://" + path.resolve(__dirname, "tab-bar.html"));
        if (inner !== undefined) {
            await browser.execute(
                (sel, html) => {
                    document.querySelector(sel).insertAdjacentHTML("beforeend", html);
                },
                ".tab-bar",
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
        '<button id="a" role="tab" tabindex="-1">a</button><button id="b" role="tab" tabindex="-1">b</button><button id="c" role="tab" tabindex="-1">c</button>';
    it("ArrowRight moves to the next item and wraps", async function () {
        await load(ITEMS);
        await focus("a");
        await browser.keys("ArrowRight");
        expect(await active()).toBe("b");
        await focus("c");
        await browser.keys("ArrowRight");
        expect(await active()).toBe("a");
    });
    it("ArrowLeft moves to the previous item and wraps", async function () {
        await load(ITEMS);
        await focus("b");
        await browser.keys("ArrowLeft");
        expect(await active()).toBe("a");
        await browser.keys("ArrowLeft");
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

    it("clicking a tab selects it and makes it the only tab stop", async function () {
        await load(
            '<button id="a" role="tab" aria-selected="true">a</button><button id="b" role="tab" aria-selected="false">b</button>',
        );
        await (await $("#b")).click();
        expect(await attr("#b", "aria-selected")).toBe("true");
        expect(await attr("#a", "aria-selected")).toBe("false");
        expect(await attr("#b", "tabindex")).toBe("0");
        expect(await attr("#a", "tabindex")).toBe("-1");
    });
    it("Enter activates the focused tab", async function () {
        await load(
            '<button id="a" role="tab" aria-selected="true">a</button><button id="b" role="tab" aria-selected="false">b</button>',
        );
        await focus("b");
        await browser.keys("Enter");
        expect(await attr("#b", "aria-selected")).toBe("true");
    });
});
