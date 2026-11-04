const path = require("path");
const { runPattern } = require("../../shared/pattern-browser.cjs");

describe("ActionGroup pattern", function () {
    it("meets the action-group contract", async function () {
        await browser.url("file://" + path.resolve(__dirname, "action-group.html"));
        await runPattern(browser, "action-group", ".action-group", "action-group", "Actions");
    });
});
