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

    it("should not put aria-label on a plain span", async function () {
        const el = await $("span.measurement-unit-view");
        expect(await el.getAttribute("aria-label")).toBeNull();
    });
});
