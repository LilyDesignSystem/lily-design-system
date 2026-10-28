// measurement-unit-input.test.js
// MeasurementUnitInput component test

const path = require("path");

describe("MeasurementUnitInput", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "measurement-unit-input.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.measurement-unit-input");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("measurement-unit-input");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.measurement-unit-input");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
