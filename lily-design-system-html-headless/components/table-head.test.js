// table-head.test.js
// TableHead component test

const path = require("path");

describe("TableHead", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "table-head.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.table-head");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("table-head");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.table-head");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
