// five-face-rating-radio-input.test.js
// FiveFaceRatingRadioInput component test

const path = require("path");

describe("FiveFaceRatingRadioInput", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "five-face-rating-radio-input.html"));
    });

    it("should render the input element with correct class", async function () {
        const el = await $("input.five-face-rating-radio-input");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("five-face-rating-radio-input");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("input.five-face-rating-radio-input");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });

    it("should carry a data-value attribute for consumer CSS", async function () {
        const el = await $("input.five-face-rating-radio-input");
        expect(await el.getAttribute("data-value")).not.toBeNull();
    });
});
