const path = require("path");
const { runPattern } = require("../../shared/pattern-browser.cjs");

describe("TreeSelect pattern", function () {
    it("meets the tree-popup contract", async function () {
        await browser.url("file://" + path.resolve(__dirname, "tree-select.html"));
        // The trigger is the combobox, so the name goes on it, not on the root.
        await runPattern(browser, "tree-popup", ".tree-select", "tree-select", null, {
            setup: 'root.querySelector("button").setAttribute("aria-label", "Choose");',
        });
    });
});
