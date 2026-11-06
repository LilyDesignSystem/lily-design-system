// measurement-system-input.test.js
// MeasurementSystemInput component test

const path = require("path");

describe("MeasurementSystemInput", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "measurement-system-input.html"));
    });

    it("should render the input element with correct class", async function () {
        const el = await $("input.measurement-system-input");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("measurement-system-input");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("input.measurement-system-input");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
