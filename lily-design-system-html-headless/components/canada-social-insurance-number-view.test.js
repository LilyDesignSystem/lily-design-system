// canada-social-insurance-number-view.test.js
// CanadaSocialInsuranceNumberView component test

const path = require("path");

describe("CanadaSocialInsuranceNumberView", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" + path.resolve(__dirname, "canada-social-insurance-number-view.html"),
        );
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.canada-social-insurance-number-view");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("canada-social-insurance-number-view");
    });

    it("should not put aria-label on a plain span", async function () {
        const el = await $("span.canada-social-insurance-number-view");
        expect(await el.getAttribute("aria-label")).toBeNull();
    });
});
