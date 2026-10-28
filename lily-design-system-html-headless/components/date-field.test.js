// date-field.test.js
// DateField component test

const path = require("path");

describe("DateField", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "date-field.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.date-field");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("date-field");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.date-field");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
