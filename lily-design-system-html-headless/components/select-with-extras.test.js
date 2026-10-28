// select-with-extras.test.js
// SelectWithExtras component test

const path = require("path");

describe("SelectWithExtras", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "select-with-extras.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.select-with-extras");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("select-with-extras");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.select-with-extras");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
