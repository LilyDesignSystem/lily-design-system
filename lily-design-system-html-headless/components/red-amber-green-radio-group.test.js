// red-amber-green-radio-group.test.js
// RedAmberGreenRadioGroup component test

const path = require("path");

describe("RedAmberGreenRadioGroup", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "red-amber-green-radio-group.html"));
    });

    it("should render the fieldset element with correct class", async function () {
        const el = await $("fieldset.red-amber-green-radio-group");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("red-amber-green-radio-group");
    });

    it("should have the correct ARIA role", async function () {
        const el = await $("fieldset.red-amber-green-radio-group");
        const roleAttr = await el.getAttribute("role");
        expect(roleAttr).toBe("radiogroup");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("fieldset.red-amber-green-radio-group");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
