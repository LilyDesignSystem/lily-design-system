// measurement-instance-view.test.js
// MeasurementInstanceView component test

const path = require("path");

describe("MeasurementInstanceView", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "measurement-instance-view.html"));
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.measurement-instance-view");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("measurement-instance-view");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("span.measurement-instance-view");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
