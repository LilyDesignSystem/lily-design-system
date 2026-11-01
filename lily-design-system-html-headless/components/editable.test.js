// editable.test.js
// Editable component test

const path = require("path");

describe("Editable", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "editable.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("span.editable");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("editable");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("span.editable");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});

// Keyboard behaviour (P12-T4): real key presses in a real browser.
describe("Editable keyboard", function () {
    async function load(inner) {
        await browser.url("file://" + path.resolve(__dirname, "editable.html"));
        if (inner !== undefined) {
            await browser.execute(
                (sel, html) => {
                    document.querySelector(sel).insertAdjacentHTML("beforeend", html);
                },
                ".editable",
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

    const text = () =>
        browser.execute(() => document.querySelector(".editable").textContent.trim());
    async function setup() {
        await load("value");
        await browser.execute(() => {
            window.__changes = [];
            document.addEventListener("editable-change", (e) =>
                window.__changes.push(e.detail && e.detail.value),
            );
            document.querySelector(".editable").focus();
        });
    }
    it("is a button in the tab order", async function () {
        await load();
        expect(await attr(".editable", "role")).toBe("button");
        expect(await attr(".editable", "tabindex")).toBe("0");
    });
    it("Enter swaps in a text field and moves focus into it", async function () {
        await setup();
        await browser.keys("Enter");
        expect(await browser.execute(() => document.activeElement.tagName)).toBe("INPUT");
        expect(await browser.execute(() => document.activeElement.value)).toBe("value");
    });
    it("a click starts editing", async function () {
        await setup();
        await (await $(".editable")).click();
        expect(await browser.execute(() => document.activeElement.tagName)).toBe("INPUT");
    });
    it("Space also starts editing", async function () {
        await setup();
        await browser.keys(" ");
        expect(await browser.execute(() => document.activeElement.tagName)).toBe("INPUT");
    });
    it("Enter in the field confirms the new value and restores the display", async function () {
        await setup();
        await browser.keys("Enter");
        await browser.execute(() => document.activeElement.select());
        await browser.keys("new");
        await browser.keys("Enter");
        expect(await text()).toBe("new");
        expect(await browser.execute(() => document.activeElement.className)).toBe("editable");
        expect(await browser.execute(() => window.__changes)).toEqual(["new"]);
    });
    it("Escape cancels and keeps the old value", async function () {
        await setup();
        await browser.keys("Enter");
        await browser.keys("zzz");
        await browser.keys("Escape");
        expect(await text()).toBe("value");
        expect(await browser.execute(() => document.querySelector("input.editable"))).toBeNull();
    });
    it("aria-disabled blocks editing", async function () {
        await setup();
        await browser.execute(() =>
            document.querySelector(".editable").setAttribute("aria-disabled", "true"),
        );
        await browser.keys("Enter");
        expect(await browser.execute(() => document.querySelector("input.editable"))).toBeNull();
    });
});
