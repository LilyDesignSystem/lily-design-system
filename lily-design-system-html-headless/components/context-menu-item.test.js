// context-menu-item.test.js
// ContextMenuItem component test

const path = require("path");

describe("ContextMenuItem", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "context-menu-item.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.context-menu-item");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("context-menu-item");
    });

    it("should have the correct ARIA role", async function () {
        const el = await $("div.context-menu-item");
        const roleAttr = await el.getAttribute("role");
        expect(roleAttr).toBe("menuitem");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.context-menu-item");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
