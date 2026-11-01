// switch-button.test.js
// SwitchButton component test

const path = require("path");

describe("SwitchButton", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "switch-button.html"));
    });

    it("should render the button element with correct class", async function () {
        const el = await $("button.switch-button");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("switch-button");
    });

    it("should have the correct ARIA role", async function () {
        const el = await $("button.switch-button");
        const roleAttr = await el.getAttribute("role");
        expect(roleAttr).toBe("switch");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("button.switch-button");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});

// Keyboard behaviour (P12-T4): real key presses in a real browser.
describe("SwitchButton keyboard", function () {
    async function load(inner) {
        await browser.url("file://" + path.resolve(__dirname, "switch-button.html"));
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

    it("Space toggles aria-checked", async function () {
        await load();
        await browser.execute(() => document.querySelector(".switch-button").focus());
        expect(await attr(".switch-button", "aria-checked")).toBe("false");
        await browser.keys(" ");
        expect(await attr(".switch-button", "aria-checked")).toBe("true");
        await browser.keys(" ");
        expect(await attr(".switch-button", "aria-checked")).toBe("false");
    });
    it("Enter toggles aria-checked", async function () {
        await load();
        await browser.execute(() => document.querySelector(".switch-button").focus());
        await browser.keys("Enter");
        expect(await attr(".switch-button", "aria-checked")).toBe("true");
    });
    it("has the switch role", async function () {
        await load();
        expect(await attr(".switch-button", "role")).toBe("switch");
    });
    it("a disabled control does not toggle", async function () {
        await load();
        await browser.execute(() =>
            document.querySelector(".switch-button").setAttribute("disabled", ""),
        );
        await browser.execute(() => document.querySelector(".switch-button").click());
        expect(await attr(".switch-button", "aria-checked")).toBe("false");
    });
});
