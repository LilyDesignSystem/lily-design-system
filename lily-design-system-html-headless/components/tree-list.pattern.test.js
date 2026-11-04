const path = require("path");
const { runPattern } = require("../../shared/pattern-browser.cjs");

describe("TreeList pattern", function () {
    it("meets the tree contract", async function () {
        await browser.url("file://" + path.resolve(__dirname, "tree-list.html"));
        await runPattern(browser, "tree", ".tree-list", "tree-list", "Sections");
    });
});
