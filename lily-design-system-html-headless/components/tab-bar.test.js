// tab-bar.test.js
// TabBar component test

const path = require("path");

describe("TabBar", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "tab-bar.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.tab-bar");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("tab-bar");
    });

    it("should have the correct ARIA role", async function () {
        const el = await $("div.tab-bar");
        const roleAttr = await el.getAttribute("role");
        expect(roleAttr).toBe("tablist");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.tab-bar");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
