// measurement-instance-input.test.js
// MeasurementInstanceInput component test

const path = require("path");

describe("MeasurementInstanceInput", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "measurement-instance-input.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.measurement-instance-input");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("measurement-instance-input");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.measurement-instance-input");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
