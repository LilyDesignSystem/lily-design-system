// table-foot.test.js
// TableFoot component test

const path = require("path");

describe("TableFoot", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "table-foot.html"));
    });

    it("should render the tfoot element with correct class", async function () {
        const el = await $("tfoot.table-foot");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("table-foot");
    });
});
