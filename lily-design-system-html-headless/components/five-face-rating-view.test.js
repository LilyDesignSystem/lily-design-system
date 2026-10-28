// five-face-rating-view.test.js
// FiveFaceRatingView component test

const path = require("path");

describe("FiveFaceRatingView", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "five-face-rating-view.html"));
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.five-face-rating-view");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("five-face-rating-view");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("span.five-face-rating-view");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
