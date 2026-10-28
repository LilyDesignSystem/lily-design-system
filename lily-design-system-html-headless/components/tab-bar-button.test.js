// tab-bar-button.test.js
// TabBarButton component test

const path = require("path");

describe("TabBarButton", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "tab-bar-button.html"));
    });

    it("should render the button element with correct class", async function () {
        const el = await $("button.tab-bar-button");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("tab-bar-button");
    });

    it("should have the correct ARIA role", async function () {
        const el = await $("button.tab-bar-button");
        const roleAttr = await el.getAttribute("role");
        expect(roleAttr).toBe("tab");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("button.tab-bar-button");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
