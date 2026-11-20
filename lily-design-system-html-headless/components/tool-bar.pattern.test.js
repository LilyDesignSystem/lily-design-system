const path = require("path");
const { runPattern } = require("../../shared/pattern-browser.cjs");

describe("ToolBar pattern", function () {
    it("meets the toolbar contract", async function () {
        await browser.url("file://" + path.resolve(__dirname, "tool-bar.html"));
        await runPattern(browser, "toolbar", ".tool-bar", "tool-bar", "Tools");
    });
});
