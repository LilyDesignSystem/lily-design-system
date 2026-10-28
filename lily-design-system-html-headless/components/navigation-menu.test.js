// navigation-menu.test.js
// NavigationMenu component test

const path = require("path");

describe("NavigationMenu", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "navigation-menu.html"));
    });

    it("should render the nav element with correct class", async function () {
        const el = await $("nav.navigation-menu");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("navigation-menu");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("nav.navigation-menu");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
