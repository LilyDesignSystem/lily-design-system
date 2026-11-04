const path = require("path");
const { runPattern } = require("../../shared/pattern-browser.cjs");

describe("SegmentGroup pattern", function () {
    it("meets the radio-group contract", async function () {
        await browser.url("file://" + path.resolve(__dirname, "segment-group.html"));
        await runPattern(browser, "radio-group", ".segment-group", "segment-group", "Actions");
    });
});
