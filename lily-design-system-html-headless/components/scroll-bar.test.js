// scroll-bar.test.js
// ScrollBar component test

const path = require("path");

describe("ScrollBar", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "scroll-bar.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.scroll-bar");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("scroll-bar");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.scroll-bar");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});

// Keyboard behaviour (P12-T5a): real key presses in a real browser.
describe("ScrollBar keyboard", function () {
    async function attr(name) {
        return browser.execute((n) => document.querySelector(".scroll-bar").getAttribute(n), name);
    }
    async function setup(extra) {
        await browser.url("file://" + path.resolve(__dirname, "scroll-bar.html"));
        await browser.execute((e) => {
            const s = document.querySelector(".scroll-bar");
            s.setAttribute("aria-valuenow", "50");
            s.setAttribute("data-step", "5");
            s.setAttribute("data-page-step", "20");
            Object.keys(e).forEach((k) => s.setAttribute(k, e[k]));
            window.changes = [];
            s.addEventListener("change", (ev) => window.changes.push(ev.detail.value));
            s.focus();
        }, extra || {});
    }
    it("is a tab stop scrollbar with range attributes", async function () {
        await setup();
        expect(await attr("role")).toBe("scrollbar");
        expect(await attr("tabindex")).toBe("0");
        expect(await attr("aria-orientation")).toBe("vertical");
    });
    it("ArrowDown/ArrowRight increase and ArrowUp/ArrowLeft decrease by step", async function () {
        await setup();
        await browser.keys("ArrowDown");
        expect(await attr("aria-valuenow")).toBe("55");
        await browser.keys("ArrowRight");
        expect(await attr("aria-valuenow")).toBe("60");
        await browser.keys("ArrowUp");
        await browser.keys("ArrowLeft");
        await browser.keys("ArrowLeft");
        expect(await attr("aria-valuenow")).toBe("45");
        expect(await browser.execute(() => window.changes)).toEqual([55, 60, 55, 50, 45]);
    });
    it("PageDown and PageUp move by the page step, clamped", async function () {
        await setup();
        await browser.keys("PageDown");
        expect(await attr("aria-valuenow")).toBe("70");
        await browser.keys("PageDown");
        await browser.keys("PageDown");
        expect(await attr("aria-valuenow")).toBe("100");
        await browser.keys("PageUp");
        expect(await attr("aria-valuenow")).toBe("80");
    });
    it("Home and End jump to the bounds", async function () {
        await setup({ "aria-valuemin": "-20", "aria-valuemax": "150" });
        await browser.keys("End");
        expect(await attr("aria-valuenow")).toBe("150");
        await browser.keys("Home");
        expect(await attr("aria-valuenow")).toBe("-20");
    });
});
