// five-star-rating-view.test.js
// FiveStarRatingView component test

const path = require("path");

describe("FiveStarRatingView", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "five-star-rating-view.html"));
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.five-star-rating-view");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("five-star-rating-view");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("span.five-star-rating-view");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
