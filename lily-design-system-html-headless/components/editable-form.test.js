// editable-form.test.js
// EditableForm component test

const path = require("path");

describe("EditableForm", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "editable-form.html"));
    });

    it("should render the form element with correct class", async function () {
        const el = await $("form.editable-form");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("editable-form");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("form.editable-form");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});

// Keyboard behaviour (P12-T4): real key presses in a real browser.
describe("EditableForm keyboard", function () {
    async function load(inner) {
        await browser.url("file://" + path.resolve(__dirname, "editable-form.html"));
        if (inner !== undefined) {
            await browser.execute(
                (sel, html) => {
                    document.querySelector(sel).insertAdjacentHTML("beforeend", html);
                },
                ".editable-form",
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

    const isHidden = () => browser.execute(() => document.querySelector(".editable-form").hidden);
    it("is hidden until data-editing is true, then takes focus", async function () {
        await load('<input id="f" type="text">');
        expect(await isHidden()).toBe(true);
        await browser.execute(() =>
            document.querySelector(".editable-form").setAttribute("data-editing", "true"),
        );
        await browser.waitUntil(async () => !(await isHidden()));
        expect(await browser.execute(() => document.activeElement.className)).toBe("editable-form");
    });
    it("Escape stops editing and dispatches cancel", async function () {
        await load('<input id="f" type="text">');
        await browser.execute(() => {
            window.__cancelled = 0;
            const f = document.querySelector(".editable-form");
            f.addEventListener("cancel", () => window.__cancelled++);
            f.setAttribute("data-editing", "true");
        });
        await browser.waitUntil(async () => !(await isHidden()));
        await focus("f");
        await browser.keys("Escape");
        expect(await attr(".editable-form", "data-editing")).toBe("false");
        expect(await isHidden()).toBe(true);
        expect(await browser.execute(() => window.__cancelled)).toBe(1);
    });
    it("submitting stops editing without navigating", async function () {
        await load('<input id="f" type="text"><button type="submit" id="s">ok</button>');
        await browser.execute(() =>
            document.querySelector(".editable-form").setAttribute("data-editing", "true"),
        );
        await browser.waitUntil(async () => !(await isHidden()));
        await focus("f");
        await browser.keys("Enter");
        expect(await attr(".editable-form", "data-editing")).toBe("false");
        expect(await browser.getUrl()).toContain("editable-form.html");
    });
});
