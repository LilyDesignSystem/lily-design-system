// table-row.test.js
// TableRow component test

const path = require("path");

describe("TableRow", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "table-row.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.table-row");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("table-row");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.table-row");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
