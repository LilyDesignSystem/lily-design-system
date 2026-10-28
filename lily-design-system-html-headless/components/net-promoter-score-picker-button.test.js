// net-promoter-score-picker-button.test.js
// NetPromoterScorePickerButton component test

const path = require("path");

describe("NetPromoterScorePickerButton", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" + path.resolve(__dirname, "net-promoter-score-picker-button.html"),
        );
    });

    it("should render the button element with correct class", async function () {
        const el = await $("button.net-promoter-score-picker-button");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("net-promoter-score-picker-button");
    });

    it("should have the correct ARIA role", async function () {
        const el = await $("button.net-promoter-score-picker-button");
        const roleAttr = await el.getAttribute("role");
        expect(roleAttr).toBe("radio");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("button.net-promoter-score-picker-button");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
