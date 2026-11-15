// net-promoter-score-radio-input.test.js
// NetPromoterScoreRadioInput component test

const path = require("path");

describe("NetPromoterScoreRadioInput", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" + path.resolve(__dirname, "net-promoter-score-radio-input.html"),
        );
    });

    it("should render the input element with correct class", async function () {
        const el = await $("input.net-promoter-score-radio-input");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("net-promoter-score-radio-input");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("input.net-promoter-score-radio-input");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });

    it("should carry a data-value attribute for consumer CSS", async function () {
        const el = await $("input.net-promoter-score-radio-input");
        expect(await el.getAttribute("data-value")).not.toBeNull();
    });
});
