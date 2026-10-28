// editable-form.test.js
// EditableForm component test

const path = require("path");

describe("EditableForm", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "editable-form.html"));
    });

    it("should render the form element with correct class", async function () {
        const el = await $("form.editable-form");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("editable-form");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("form.editable-form");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
