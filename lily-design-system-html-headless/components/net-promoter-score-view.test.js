// net-promoter-score-view.test.js
// NetPromoterScoreView component test

const path = require("path");

describe("NetPromoterScoreView", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "net-promoter-score-view.html"));
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.net-promoter-score-view");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("net-promoter-score-view");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("span.net-promoter-score-view");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
