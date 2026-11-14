// early-warning-score-view.test.js
// EarlyWarningScoreView component test

const path = require("path");

describe("EarlyWarningScoreView", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "early-warning-score-view.html"));
    });

    it("renders system, score, band and escalation", async function () {
        const root = await $("span.early-warning-score-view");
        await expect(root).toExist();
        expect(await root.getAttribute("data-band")).toBe("high");
        expect(await $(".early-warning-score-view-score").getText()).toBe("7");
        expect(await $(".early-warning-score-view-band").getText()).toBe("High");
    });
});
