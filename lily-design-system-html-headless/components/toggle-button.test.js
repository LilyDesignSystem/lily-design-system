// toggle-button.test.js
// ToggleButton component test

const path = require("path");

describe("ToggleButton", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "toggle-button.html"));
    });

    it("should render the button element with correct class", async function () {
        const el = await $("button.toggle-button");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("toggle-button");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("button.toggle-button");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});

// Keyboard behaviour (P12-T4): real key presses in a real browser.
describe("ToggleButton keyboard", function () {
    async function load(inner) {
        await browser.url("file://" + path.resolve(__dirname, "toggle-button.html"));
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

    it("Space toggles aria-pressed", async function () {
        await load();
        await browser.execute(() => document.querySelector(".toggle-button").focus());
        expect(await attr(".toggle-button", "aria-pressed")).toBe("false");
        await browser.keys(" ");
        expect(await attr(".toggle-button", "aria-pressed")).toBe("true");
        await browser.keys(" ");
        expect(await attr(".toggle-button", "aria-pressed")).toBe("false");
    });
    it("Enter toggles aria-pressed", async function () {
        await load();
        await browser.execute(() => document.querySelector(".toggle-button").focus());
        await browser.keys("Enter");
        expect(await attr(".toggle-button", "aria-pressed")).toBe("true");
    });
    it("is a native button with no switch role", async function () {
        await load();
        expect(await attr(".toggle-button", "role")).toBeNull();
    });
    it("a disabled control does not toggle", async function () {
        await load();
        await browser.execute(() =>
            document.querySelector(".toggle-button").setAttribute("disabled", ""),
        );
        await browser.execute(() => document.querySelector(".toggle-button").click());
        expect(await attr(".toggle-button", "aria-pressed")).toBe("false");
    });
});
