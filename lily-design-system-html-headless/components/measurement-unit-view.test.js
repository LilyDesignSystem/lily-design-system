// measurement-unit-view.test.js
// MeasurementUnitView component test

const path = require("path");

describe("MeasurementUnitView", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "measurement-unit-view.html"));
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.measurement-unit-view");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("measurement-unit-view");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("span.measurement-unit-view");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
