// data-table-head.test.js
// DataTableHead component test

const path = require("path");

describe("DataTableHead", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "data-table-head.html"));
    });

    it("should render the thead element with correct class", async function () {
        const el = await $("thead.data-table-head");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("data-table-head");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("thead.data-table-head");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
