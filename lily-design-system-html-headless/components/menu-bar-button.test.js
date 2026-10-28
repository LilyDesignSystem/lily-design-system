// menu-bar-button.test.js
// MenuBarButton component test

const path = require("path");

describe("MenuBarButton", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "menu-bar-button.html"));
    });

    it("should render the button element with correct class", async function () {
        const el = await $("button.menu-bar-button");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("menu-bar-button");
    });

    it("should have the correct ARIA role", async function () {
        const el = await $("button.menu-bar-button");
        const roleAttr = await el.getAttribute("role");
        expect(roleAttr).toBe("menuitem");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("button.menu-bar-button");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
