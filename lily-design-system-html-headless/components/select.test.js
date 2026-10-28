// select.test.js
// Select component test

const path = require("path");

describe("Select", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "select.html"));
    });

    it("should render the select element with correct class", async function () {
        const el = await $("select.select");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("select");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("select.select");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
