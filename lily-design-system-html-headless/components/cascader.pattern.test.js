const path = require("path");
const { runPattern } = require("../../shared/pattern-browser.cjs");

describe("Cascader pattern", function () {
    it("meets the tree-popup contract", async function () {
        await browser.url("file://" + path.resolve(__dirname, "cascader.html"));
        await runPattern(browser, "tree-popup", ".cascader", "cascader", "Choose");
    });
});
