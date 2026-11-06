// table-body.test.js
// TableBody component test

const path = require("path");

describe("TableBody", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "table-body.html"));
    });

    it("should render the tbody element with correct class", async function () {
        const el = await $("tbody.table-body");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("table-body");
    });
});
