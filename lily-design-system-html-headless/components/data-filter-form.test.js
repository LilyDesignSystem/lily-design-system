// data-filter-form.test.js
// DataFilterForm component test

const path = require("path");

describe("DataFilterForm", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "data-filter-form.html"));
    });

    it("should render the form element with correct class", async function () {
        const el = await $("form.data-filter-form");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("data-filter-form");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("form.data-filter-form");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
