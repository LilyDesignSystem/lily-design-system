// tooltip.test.js
// Tooltip component test

const path = require("path");

describe("Tooltip", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "tooltip.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.tooltip");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("tooltip");
    });

    it("should have the correct ARIA role", async function () {
        const el = await $("div.tooltip");
        const roleAttr = await el.getAttribute("role");
        expect(roleAttr).toBe("tooltip");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.tooltip");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
