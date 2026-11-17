// repeatable-fieldset.test.js
// RepeatableFieldset component test

const path = require("path");

describe("RepeatableFieldset", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "repeatable-fieldset.html"));
    });

    it("should render the root element with correct class", async function () {
        const el = await $(".repeatable-fieldset");
        await expect(el).toExist();
    });

    it("should have an aria-label attribute", async function () {
        const el = await $(".repeatable-fieldset");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
