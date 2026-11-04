const path = require("path");
const { runPattern } = require("../../shared/pattern-browser.cjs");

describe("SplitView pattern", function () {
    it("meets the splitter contract", async function () {
        await browser.url("file://" + path.resolve(__dirname, "split-view.html"));
        await runPattern(browser, "splitter", ".split-view", "split-view", "Panes");
    });
});
