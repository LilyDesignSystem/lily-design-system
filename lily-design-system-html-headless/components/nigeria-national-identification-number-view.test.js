// nigeria-national-identification-number-view.test.js
// NigeriaNationalIdentificationNumberView component test

const path = require("path");

describe("NigeriaNationalIdentificationNumberView", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" + path.resolve(__dirname, "nigeria-national-identification-number-view.html"),
        );
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.nigeria-national-identification-number-view");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("nigeria-national-identification-number-view");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("span.nigeria-national-identification-number-view");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
