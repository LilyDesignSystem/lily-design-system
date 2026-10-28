// united-kingdom-national-health-service-number-input.test.js
// UnitedKingdomNationalHealthServiceNumberInput component test

const path = require("path");

describe("UnitedKingdomNationalHealthServiceNumberInput", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" +
                path.resolve(__dirname, "united-kingdom-national-health-service-number-input.html"),
        );
    });

    it("should render the input element with correct class", async function () {
        const el = await $("input.united-kingdom-national-health-service-number-input");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("united-kingdom-national-health-service-number-input");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("input.united-kingdom-national-health-service-number-input");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
