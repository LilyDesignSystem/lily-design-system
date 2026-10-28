// red-amber-green-picker.test.js
// RedAmberGreenPicker component test

const path = require("path");

describe("RedAmberGreenPicker", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "red-amber-green-picker.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.red-amber-green-picker");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("red-amber-green-picker");
    });

    it("should have the correct ARIA role", async function () {
        const el = await $("div.red-amber-green-picker");
        const roleAttr = await el.getAttribute("role");
        expect(roleAttr).toBe("radiogroup");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.red-amber-green-picker");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
