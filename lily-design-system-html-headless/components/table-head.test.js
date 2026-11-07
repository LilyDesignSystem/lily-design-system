// table-head.test.js
// TableHead component test

const path = require("path");

describe("TableHead", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "table-head.html"));
    });

    it("should render the thead element with correct class", async function () {
        const el = await $("thead.table-head");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("table-head");
    });
});
