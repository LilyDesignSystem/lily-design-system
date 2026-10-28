// form.test.js
// Form component test

const path = require("path");

describe("Form", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "form.html"));
    });

    it("should render the form element with correct class", async function () {
        const el = await $("form.form");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("form");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("form.form");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
