// england-national-health-service-number-view.test.js
// EnglandNationalHealthServiceNumberView component test

const path = require("path");

describe("EnglandNationalHealthServiceNumberView", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" + path.resolve(__dirname, "england-national-health-service-number-view.html"),
        );
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.england-national-health-service-number-view");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("england-national-health-service-number-view");
    });

    it("should not put aria-label on a plain span", async function () {
        const el = await $("span.england-national-health-service-number-view");
        expect(await el.getAttribute("aria-label")).toBeNull();
    });
});
