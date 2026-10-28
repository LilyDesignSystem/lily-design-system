// sheet.test.js
// Sheet component test

const path = require("path");

describe("Sheet", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "sheet.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.sheet");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("sheet");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.sheet");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
