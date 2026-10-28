// meter.test.js
// Meter component test

const path = require("path");

describe("Meter", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "meter.html"));
    });

    it("should render the meter element with correct class", async function () {
        const el = await $("meter.meter");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("meter");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("meter.meter");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
