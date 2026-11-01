// pin-input-div.test.js
// PinInputDiv component test

const path = require("path");

describe("PinInputDiv", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "pin-input-div.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.pin-input-div");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("pin-input-div");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.pin-input-div");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});

// Keyboard behaviour (P12-T4): real key presses in a real browser.
describe("PinInputDiv keyboard", function () {
    async function load(inner) {
        await browser.url("file://" + path.resolve(__dirname, "pin-input-div.html"));
        if (inner !== undefined) {
            await browser.execute(
                (sel, html) => {
                    document.querySelector(sel).insertAdjacentHTML("beforeend", html);
                },
                ".pin-input-div",
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

    const vals = () =>
        browser.execute(() =>
            Array.from(document.querySelectorAll(".pin-input-div input")).map((i) => i.value),
        );
    const idx = () =>
        browser.execute(() =>
            Array.from(document.querySelectorAll(".pin-input-div input")).indexOf(
                document.activeElement,
            ),
        );
    async function start() {
        await load();
        await browser.execute(() => document.querySelector(".pin-input-div input").focus());
    }
    it("is a labelled group of single-digit numeric inputs", async function () {
        await load();
        expect(await attr(".pin-input-div", "role")).toBe("group");
        expect(await attr(".pin-input-div input", "inputmode")).toBe("numeric");
        expect(await attr(".pin-input-div input", "maxlength")).toBe("1");
    });
    it("typing a digit fills the field and moves to the next", async function () {
        await start();
        await browser.keys("1");
        await browser.keys("2");
        expect(await vals()).toEqual(["1", "2", "", ""]);
        expect(await idx()).toBe(2);
        expect(await attr(".pin-input-div", "data-value")).toBe("12");
    });
    it("a non-digit is rejected", async function () {
        await start();
        await browser.keys("a");
        expect(await vals()).toEqual(["", "", "", ""]);
        expect(await idx()).toBe(0);
    });
    it("ArrowLeft and ArrowRight move between fields", async function () {
        await start();
        await browser.keys("ArrowRight");
        await browser.keys("ArrowRight");
        expect(await idx()).toBe(2);
        await browser.keys("ArrowLeft");
        expect(await idx()).toBe(1);
        await browser.keys("ArrowLeft");
        await browser.keys("ArrowLeft");
        expect(await idx()).toBe(0);
    });
    it("Backspace on an empty field clears and focuses the previous one", async function () {
        await start();
        await browser.keys("1");
        await browser.keys("2");
        await browser.keys("Backspace");
        expect(await idx()).toBe(1);
        expect(await vals()).toEqual(["1", "", "", ""]);
        await browser.keys("Backspace");
        expect(await idx()).toBe(0);
        expect(await vals()).toEqual(["", "", "", ""]);
    });
});
