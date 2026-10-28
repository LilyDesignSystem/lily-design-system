// color-picker.test.js
// ColorPicker component test

const path = require("path");

describe("ColorPicker", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "color-picker.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.color-picker");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("color-picker");
    });

    it("should have the correct ARIA role", async function () {
        const el = await $("div.color-picker");
        const roleAttr = await el.getAttribute("role");
        expect(roleAttr).toBe("radiogroup");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.color-picker");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
