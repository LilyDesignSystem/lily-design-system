// menu-bar.test.js
// MenuBar component test

const path = require("path");

describe("MenuBar", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "menu-bar.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.menu-bar");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("menu-bar");
    });

    it("should have the correct ARIA role", async function () {
        const el = await $("div.menu-bar");
        const roleAttr = await el.getAttribute("role");
        expect(roleAttr).toBe("menubar");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.menu-bar");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
