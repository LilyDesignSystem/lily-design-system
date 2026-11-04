const path = require("path");
const { runPattern } = require("../../shared/pattern-browser.cjs");

describe("TreeSelect pattern", function () {
    it("meets the tree-popup contract", async function () {
        await browser.url("file://" + path.resolve(__dirname, "tree-select.html"));
        await runPattern(browser, "tree-popup", ".tree-select", "tree-select", "Choose");
    });
});
