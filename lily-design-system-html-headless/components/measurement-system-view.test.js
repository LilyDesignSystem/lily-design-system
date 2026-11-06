// measurement-system-view.test.js
// MeasurementSystemView component test

const path = require("path");

describe("MeasurementSystemView", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "measurement-system-view.html"));
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.measurement-system-view");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("measurement-system-view");
    });

    it("should not put aria-label on a plain span", async function () {
        const el = await $("span.measurement-system-view");
        expect(await el.getAttribute("aria-label")).toBeNull();
    });
});
