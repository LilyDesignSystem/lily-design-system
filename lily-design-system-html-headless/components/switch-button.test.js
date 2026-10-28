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
