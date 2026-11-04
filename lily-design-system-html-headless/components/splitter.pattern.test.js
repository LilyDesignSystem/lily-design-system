const path = require("path");
const { runPattern } = require("../../shared/pattern-browser.cjs");

describe("Splitter pattern", function () {
    it("meets the splitter contract", async function () {
        await browser.url("file://" + path.resolve(__dirname, "splitter.html"));
        await runPattern(browser, "splitter", ".splitter", "splitter", "Panes");
    });
});
