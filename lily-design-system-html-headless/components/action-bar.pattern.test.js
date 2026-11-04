const path = require("path");
const { runPattern } = require("../../shared/pattern-browser.cjs");

describe("ActionBar pattern", function () {
    it("meets the toolbar contract", async function () {
        await browser.url("file://" + path.resolve(__dirname, "action-bar.html"));
        await runPattern(browser, "toolbar", ".action-bar", "action-bar", "Actions");
    });
});
