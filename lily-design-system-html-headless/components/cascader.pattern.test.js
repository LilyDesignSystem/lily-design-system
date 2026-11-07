const path = require("path");
const { runPattern } = require("../../shared/pattern-browser.cjs");

describe("Cascader pattern", function () {
    it("meets the tree-popup contract", async function () {
        await browser.url("file://" + path.resolve(__dirname, "cascader.html"));
        // The trigger is the combobox, so the name goes on it, not on the root.
        await runPattern(browser, "tree-popup", ".cascader", "cascader", null, {
            setup: 'root.querySelector("button").setAttribute("aria-label", "Choose");',
        });
    });
});
