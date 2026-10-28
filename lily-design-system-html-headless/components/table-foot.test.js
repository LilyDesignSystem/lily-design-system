// table-foot.test.js
// TableFoot component test

const path = require("path");

describe("TableFoot", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "table-foot.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.table-foot");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("table-foot");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.table-foot");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
