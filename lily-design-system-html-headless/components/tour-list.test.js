// tour-list.test.js
// TourList component test

const path = require("path");

describe("TourList", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "tour-list.html"));
    });

    it("should render the ol element with correct class", async function () {
        const el = await $("ol.tour-list");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("tour-list");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("ol.tour-list");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});

// Keyboard behaviour (P12-T4): real key presses in a real browser.
describe("TourList keyboard", function () {
    async function load(inner) {
        await browser.url("file://" + path.resolve(__dirname, "tour-list.html"));
        if (inner !== undefined) {
            await browser.execute(
                (sel, html) => {
                    document.querySelector(sel).insertAdjacentHTML("beforeend", html);
                },
                "body",
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

    const SEL = ".tour-list";
    const isHidden = () => browser.execute((s) => document.querySelector(s).hidden, SEL);
    it("is hidden while data-active is false", async function () {
        await load();
        expect(await isHidden()).toBe(true);
    });
    it("shows and takes focus when data-active becomes true", async function () {
        await load();
        await browser.execute(
            (s) => document.querySelector(s).setAttribute("data-active", "true"),
            SEL,
        );
        await browser.waitUntil(async () => !(await isHidden()));
        expect(
            await browser.execute((s) => document.activeElement === document.querySelector(s), SEL),
        ).toBe(true);
    });
    it("Escape closes it and returns focus to the opener", async function () {
        await load();
        await browser.execute((s) => {
            const b = document.createElement("button");
            b.id = "opener";
            document.body.append(b);
            b.focus();
            document.querySelector(s).setAttribute("data-active", "true");
        }, SEL);
        await browser.waitUntil(async () => !(await isHidden()));
        await browser.keys("Escape");
        expect(await attr(SEL, "data-active")).toBe("false");
        await browser.waitUntil(async () => await isHidden());
        expect(await active()).toBe("opener");
    });
    // P18-T6: a plain ordered list, no dialog role (it hid the list semantics) and no aria-modal.
    it("is a plain list: no role, no aria-modal", async function () {
        await load();
        expect(await attr(SEL, "role")).toBeNull();
        expect(await attr(SEL, "aria-modal")).toBeNull();
    });
});
