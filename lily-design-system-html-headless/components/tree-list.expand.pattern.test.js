const path = require("path");
const { runPattern } = require("../../shared/pattern-browser.cjs");

describe("TreeList expand pattern", function () {
    it("meets the tree-expand contract", async function () {
        await browser.url("file://" + path.resolve(__dirname, "tree-list.html"));
        await runPattern(browser, "tree-expand", "#branch", "tree-list", null, {
            prepare: `document.querySelector(".tree-list").innerHTML = '<li role="treeitem" tabindex="0" aria-expanded="true">Parent<ol role="group"><li id="branch" role="treeitem" tabindex="-1" aria-expanded="false">Branch<ol role="group"><li role="treeitem" tabindex="-1">Child</li></ol></li></ol></li>';`,
        });
    });
});
