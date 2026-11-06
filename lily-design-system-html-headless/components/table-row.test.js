// table-row.test.js
// TableRow component test

const path = require("path");

describe("TableRow", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "table-row.html"));
    });

    it("should render the tr element with correct class", async function () {
        const el = await $("tr.table-row");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("table-row");
    });
});
