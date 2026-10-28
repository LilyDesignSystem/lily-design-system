// menu-item.test.js
// MenuItem component test

const path = require("path");

describe("MenuItem", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "menu-item.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.menu-item");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("menu-item");
    });

    it("should have the correct ARIA role", async function () {
        const el = await $("div.menu-item");
        const roleAttr = await el.getAttribute("role");
        expect(roleAttr).toBe("menuitem");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.menu-item");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
