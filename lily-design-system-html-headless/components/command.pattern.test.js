const path = require("path");
const { runPattern } = require("../../shared/pattern-browser.cjs");

describe("Command pattern", function () {
    it("meets the command contract", async function () {
        await browser.url("file://" + path.resolve(__dirname, "command.html"));
        await runPattern(browser, "command", ".command", "command", null, {
            setup: `root.setAttribute("aria-label", "Actions");
                root.querySelector("input").setAttribute("aria-label", "Actions");
                root.querySelector('[role="listbox"]').setAttribute("aria-label", "Actions");`,
        });
    });
});
