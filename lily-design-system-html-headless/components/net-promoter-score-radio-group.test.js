// net-promoter-score-radio-group.test.js
// NetPromoterScoreRadioGroup component test

const path = require("path");

describe("NetPromoterScoreRadioGroup", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" + path.resolve(__dirname, "net-promoter-score-radio-group.html"),
        );
    });

    it("should render the fieldset element with correct class", async function () {
        const el = await $("fieldset.net-promoter-score-radio-group");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("net-promoter-score-radio-group");
    });

    it("should have the correct ARIA role", async function () {
        const el = await $("fieldset.net-promoter-score-radio-group");
        const roleAttr = await el.getAttribute("role");
        expect(roleAttr).toBe("radiogroup");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("fieldset.net-promoter-score-radio-group");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
