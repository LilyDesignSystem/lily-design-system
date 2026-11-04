const path = require("path");
const { runPattern } = require("../../shared/pattern-browser.cjs");

describe("TabBar pattern", function () {
    it("meets the tabs contract", async function () {
        await browser.url("file://" + path.resolve(__dirname, "tab-bar.html"));
        await runPattern(browser, "tabs", ".tab-bar", "tab-bar", "Sections");
    });
});
