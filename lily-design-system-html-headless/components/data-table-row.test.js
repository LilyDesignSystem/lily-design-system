// data-table-row.test.js
// DataTableRow component test

const path = require("path");

describe("DataTableRow", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "data-table-row.html"));
    });

    it("should render the tr element with correct class", async function () {
        const el = await $("tr.data-table-row");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("data-table-row");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("tr.data-table-row");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
