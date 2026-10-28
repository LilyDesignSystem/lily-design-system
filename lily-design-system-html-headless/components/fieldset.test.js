// fieldset.test.js
// Fieldset component test

const path = require("path");

describe("Fieldset", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "fieldset.html"));
    });

    it("should render the fieldset element with correct class", async function () {
        const el = await $("fieldset.fieldset");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("fieldset");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("fieldset.fieldset");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
