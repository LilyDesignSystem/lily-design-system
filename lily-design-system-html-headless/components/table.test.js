// table.test.js
// Table component test

const path = require("path");

describe("Table", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "table.html"));
    });

    it("should render the table element with correct class", async function () {
        const el = await $("table.table");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("table");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("table.table");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
