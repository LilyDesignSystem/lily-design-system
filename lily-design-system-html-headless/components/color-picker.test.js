// color-picker.test.js
// ColorPicker component test

const path = require("path");

describe("ColorPicker", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "color-picker.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.color-picker");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("color-picker");
    });

    it("should have the correct ARIA role", async function () {
        const el = await $("div.color-picker");
        const roleAttr = await el.getAttribute("role");
        expect(roleAttr).toBe("slider");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.color-picker");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});

// Keyboard behaviour (P12-T4): real key presses in a real browser.
describe("ColorPicker keyboard", function () {
    async function load(inner) {
        await browser.url("file://" + path.resolve(__dirname, "color-picker.html"));
        if (inner !== undefined) {
            await browser.execute(
                (sel, html) => {
                    document.querySelector(sel).insertAdjacentHTML("beforeend", html);
                },
                ".color-picker",
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

    async function setup(extra) {
        await load();
        await browser.execute((e) => {
            const d = document.querySelector(".color-picker");
            Object.keys(e).forEach((k) => d.setAttribute(k, e[k]));
            d.focus();
        }, extra || {});
    }
    it("is a slider, not a radiogroup", async function () {
        await load();
        expect(await attr(".color-picker", "role")).toBe("slider");
        expect(await attr(".color-picker", "tabindex")).toBe("0");
    });
    it("ArrowRight/ArrowLeft change X; aria-valuenow follows", async function () {
        await setup({ "data-x": "50", "data-y": "50" });
        await browser.keys("ArrowRight");
        expect(await attr(".color-picker", "data-x")).toBe("51");
        expect(await attr(".color-picker", "aria-valuenow")).toBe("51");
        await browser.keys("ArrowLeft");
        await browser.keys("ArrowLeft");
        expect(await attr(".color-picker", "data-x")).toBe("49");
    });
    it("ArrowUp/ArrowDown change Y; Shift moves by 10 and values are clamped", async function () {
        await setup({ "data-x": "50", "data-y": "50" });
        await browser.keys("ArrowDown");
        expect(await attr(".color-picker", "data-y")).toBe("51");
        await browser.keys("ArrowUp");
        await browser.keys(["Shift", "ArrowUp"]);
        expect(await attr(".color-picker", "data-y")).toBe("40");
        await browser.keys(["Shift", "ArrowRight"]);
        await browser.keys(["Shift", "ArrowRight"]);
        await browser.keys(["Shift", "ArrowRight"]);
        await browser.keys(["Shift", "ArrowRight"]);
        await browser.keys(["Shift", "ArrowRight"]);
        await browser.keys(["Shift", "ArrowRight"]);
        expect(await attr(".color-picker", "data-x")).toBe("100");
    });
    it("Home sets X to 0 and End to 100", async function () {
        await setup({ "data-x": "50" });
        await browser.keys("Home");
        expect(await attr(".color-picker", "data-x")).toBe("0");
        await browser.keys("End");
        expect(await attr(".color-picker", "data-x")).toBe("100");
    });
    it("aria-disabled ignores keys", async function () {
        await setup({ "data-x": "50", "aria-disabled": "true" });
        await browser.keys("ArrowRight");
        expect(await attr(".color-picker", "data-x")).toBe("50");
    });
});
