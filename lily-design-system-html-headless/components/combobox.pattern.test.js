const path = require("path");
const { runPattern } = require("../../shared/pattern-browser.cjs");

// The snippet's labels are the consumer's; opening is too: its documented "show the list, set aria-expanded".
const listOf = 'document.getElementById(root.querySelector("input").getAttribute("aria-controls"))';

describe("Combobox pattern", function () {
    it("meets the combobox contract", async function () {
        await browser.url("file://" + path.resolve(__dirname, "combobox.html"));
        await runPattern(browser, "combobox", ".combobox", "combobox", null, {
            setup: `root.querySelector("input").setAttribute("aria-label", "Fruit");
                ${listOf}.setAttribute("aria-label", "Fruit");`,
            open: `${listOf}.showPopover();
                root.querySelector("input").setAttribute("aria-expanded", "true");`,
        });
    });
});
