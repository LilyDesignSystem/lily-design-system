// net-promoter-score-picker.test.js
// NetPromoterScorePicker component test

const path = require("path");

describe("NetPromoterScorePicker", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "net-promoter-score-picker.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.net-promoter-score-picker");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("net-promoter-score-picker");
    });

    it("should have the correct ARIA role", async function () {
        const el = await $("div.net-promoter-score-picker");
        const roleAttr = await el.getAttribute("role");
        expect(roleAttr).toBe("radiogroup");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.net-promoter-score-picker");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
