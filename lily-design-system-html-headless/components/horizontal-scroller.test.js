// horizontal-scroller.test.js
// HorizontalScroller component test

const path = require("path");

describe("HorizontalScroller", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "horizontal-scroller.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.horizontal-scroller");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("horizontal-scroller");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.horizontal-scroller");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });

    it("should have role='region'", async function () {
        const el = await $("div.horizontal-scroller");
        const r = await el.getAttribute("role");
        expect(r).toBe("region");
    });
});

// Keyboard behaviour (P12-T4): real key presses in a real browser.
describe("HorizontalScroller keyboard", function () {
    async function load(inner) {
        await browser.url("file://" + path.resolve(__dirname, "horizontal-scroller.html"));
        if (inner !== undefined) {
            await browser.execute(
                (sel, html) => {
                    document.querySelector(sel).insertAdjacentHTML("beforeend", html);
                },
                ".horizontal-scroller",
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

    async function setup() {
        await load('<div style="width:3000px;height:10px">wide</div>');
        await browser.execute(() => {
            const el = document.querySelector(".horizontal-scroller");
            el.style.width = "200px";
            el.style.overflowX = "auto";
            el.setAttribute("data-step", "100");
            el.style.scrollBehavior = "auto";
            el.focus();
        });
    }
    const left = () =>
        browser.execute(() =>
            Math.round(document.querySelector(".horizontal-scroller").scrollLeft),
        );
    it("is a focusable region", async function () {
        await load();
        expect(await attr(".horizontal-scroller", "role")).toBe("region");
        expect(await attr(".horizontal-scroller", "tabindex")).toBe("0");
    });
    it("ArrowRight and ArrowLeft scroll by the step", async function () {
        await setup();
        await browser.keys("ArrowRight");
        await browser.waitUntil(async () => (await left()) === 100);
        await browser.keys("ArrowLeft");
        await browser.waitUntil(async () => (await left()) === 0);
    });
    it("End scrolls to the end and Home back to the start", async function () {
        await setup();
        await browser.keys("End");
        await browser.waitUntil(async () => (await left()) > 1000);
        await browser.keys("Home");
        await browser.waitUntil(async () => (await left()) === 0);
    });
});
