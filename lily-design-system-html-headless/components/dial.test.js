// dial.test.js
// Dial component test

const path = require("path");

describe("Dial", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "dial.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.dial");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("dial");
    });

    it("should have the correct ARIA role", async function () {
        const el = await $("div.dial");
        const roleAttr = await el.getAttribute("role");
        expect(roleAttr).toBe("slider");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.dial");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});

// Keyboard behaviour (P12-T4): real key presses in a real browser.
describe("Dial keyboard", function () {
    async function load(inner) {
        await browser.url("file://" + path.resolve(__dirname, "dial.html"));
        if (inner !== undefined) {
            await browser.execute(
                (sel, html) => {
                    document.querySelector(sel).insertAdjacentHTML("beforeend", html);
                },
                ".dial",
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
            const d = document.querySelector(".dial");
            d.setAttribute("aria-valuenow", "50");
            d.setAttribute("data-step", "5");
            Object.keys(e).forEach((k) => d.setAttribute(k, e[k]));
            d.focus();
        }, extra || {});
    }
    it("ArrowRight/ArrowUp increase and ArrowLeft/ArrowDown decrease by step", async function () {
        await setup();
        await browser.keys("ArrowRight");
        expect(await attr(".dial", "aria-valuenow")).toBe("55");
        await browser.keys("ArrowUp");
        expect(await attr(".dial", "aria-valuenow")).toBe("60");
        await browser.keys("ArrowLeft");
        await browser.keys("ArrowDown");
        expect(await attr(".dial", "aria-valuenow")).toBe("50");
    });
    it("Shift multiplies the step by ten and the value is clamped", async function () {
        await setup();
        await browser.keys(["Shift", "ArrowRight"]);
        expect(await attr(".dial", "aria-valuenow")).toBe("100");
        await browser.keys(["Shift", "ArrowRight"]);
        expect(await attr(".dial", "aria-valuenow")).toBe("100");
    });
    it("Home and End jump to the bounds", async function () {
        await setup({ "aria-valuemin": "10", "aria-valuemax": "90" });
        await browser.keys("Home");
        expect(await attr(".dial", "aria-valuenow")).toBe("10");
        await browser.keys("End");
        expect(await attr(".dial", "aria-valuenow")).toBe("90");
    });
    it("aria-disabled ignores keys", async function () {
        await setup({ "aria-disabled": "true" });
        await browser.keys("ArrowRight");
        expect(await attr(".dial", "aria-valuenow")).toBe("50");
    });
    it("is a tab stop slider with range attributes", async function () {
        await load();
        expect(await attr(".dial", "role")).toBe("slider");
        expect(await attr(".dial", "tabindex")).toBe("0");
        expect(await attr(".dial", "aria-valuemax")).toBe("100");
    });
});
