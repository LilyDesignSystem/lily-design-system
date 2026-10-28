// red-orange-yellow-green-blue-picker.test.js
// RedOrangeYellowGreenBluePicker component test

const path = require("path");

describe("RedOrangeYellowGreenBluePicker", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" + path.resolve(__dirname, "red-orange-yellow-green-blue-picker.html"),
        );
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.red-orange-yellow-green-blue-picker");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("red-orange-yellow-green-blue-picker");
    });

    it("should have the correct ARIA role", async function () {
        const el = await $("div.red-orange-yellow-green-blue-picker");
        const roleAttr = await el.getAttribute("role");
        expect(roleAttr).toBe("radiogroup");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.red-orange-yellow-green-blue-picker");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
