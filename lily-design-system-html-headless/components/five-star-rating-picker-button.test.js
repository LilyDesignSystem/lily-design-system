// five-star-rating-picker-button.test.js
// FiveStarRatingPickerButton component test

const path = require("path");

describe("FiveStarRatingPickerButton", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" + path.resolve(__dirname, "five-star-rating-picker-button.html"),
        );
    });

    it("should render the button element with correct class", async function () {
        const el = await $("button.five-star-rating-picker-button");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("five-star-rating-picker-button");
    });

    it("should have the correct ARIA role", async function () {
        const el = await $("button.five-star-rating-picker-button");
        const roleAttr = await el.getAttribute("role");
        expect(roleAttr).toBe("radio");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("button.five-star-rating-picker-button");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
