// data-table-foot.test.js
// DataTableFoot component test

const path = require("path");

describe("DataTableFoot", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "data-table-foot.html"));
    });

    it("should render the tfoot element with correct class", async function () {
        const el = await $("tfoot.data-table-foot");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("data-table-foot");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("tfoot.data-table-foot");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
