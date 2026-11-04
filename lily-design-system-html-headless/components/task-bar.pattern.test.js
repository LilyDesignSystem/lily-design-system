const path = require("path");
const { runPattern } = require("../../shared/pattern-browser.cjs");

describe("TaskBar pattern", function () {
    it("meets the toolbar contract", async function () {
        await browser.url("file://" + path.resolve(__dirname, "task-bar.html"));
        await runPattern(browser, "toolbar", ".task-bar", "task-bar", "Actions");
    });
});
