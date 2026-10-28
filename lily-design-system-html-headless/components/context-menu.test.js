// context-menu.test.js
// ContextMenu component test

const path = require("path");

describe("ContextMenu", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "context-menu.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.context-menu");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("context-menu");
    });

    it("should have the correct ARIA role", async function () {
        const el = await $("div.context-menu");
        const roleAttr = await el.getAttribute("role");
        expect(roleAttr).toBe("menu");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.context-menu");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
