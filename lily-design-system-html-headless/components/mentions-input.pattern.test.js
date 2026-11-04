const path = require("path");
const { runPattern } = require("../../shared/pattern-browser.cjs");

describe("MentionsInput pattern", function () {
    it("meets the mentions contract", async function () {
        await browser.url("file://" + path.resolve(__dirname, "mentions-input.html"));
        await runPattern(browser, "mentions", ".mentions-input", "mentions-input", null, {
            setup: `root.querySelector("input").setAttribute("aria-label", "Choose");`,
        });
    });
});
