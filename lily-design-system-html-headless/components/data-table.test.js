// data-table.test.js
// DataTable component test

const path = require("path");

describe("DataTable", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "data-table.html"));
    });

    it("should render the table element with correct class", async function () {
        const el = await $("table.data-table");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("data-table");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("table.data-table");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
