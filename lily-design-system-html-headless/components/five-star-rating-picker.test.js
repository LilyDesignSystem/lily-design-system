// five-star-rating-picker.test.js
// FiveStarRatingPicker component test

const path = require("path");

describe("FiveStarRatingPicker", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "five-star-rating-picker.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.five-star-rating-picker");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("five-star-rating-picker");
    });

    it("should have the correct ARIA role", async function () {
        const el = await $("div.five-star-rating-picker");
        const roleAttr = await el.getAttribute("role");
        expect(roleAttr).toBe("radiogroup");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.five-star-rating-picker");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
