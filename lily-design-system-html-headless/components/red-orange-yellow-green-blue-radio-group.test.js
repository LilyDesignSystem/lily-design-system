// red-orange-yellow-green-blue-radio-group.test.js
// RedOrangeYellowGreenBlueRadioGroup component test

const path = require("path");

describe("RedOrangeYellowGreenBlueRadioGroup", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" + path.resolve(__dirname, "red-orange-yellow-green-blue-radio-group.html"),
        );
    });

    it("should render the fieldset element with correct class", async function () {
        const el = await $("fieldset.red-orange-yellow-green-blue-radio-group");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("red-orange-yellow-green-blue-radio-group");
    });

    it("should have the correct ARIA role", async function () {
        const el = await $("fieldset.red-orange-yellow-green-blue-radio-group");
        const roleAttr = await el.getAttribute("role");
        expect(roleAttr).toBe("radiogroup");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("fieldset.red-orange-yellow-green-blue-radio-group");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
