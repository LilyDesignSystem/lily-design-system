const path = require("path");
const { runPattern } = require("../../shared/pattern-browser.cjs");

describe("MenuBar pattern", function () {
    it("meets the menubar contract", async function () {
        await browser.url("file://" + path.resolve(__dirname, "menu-bar.html"));
        await runPattern(browser, "menubar", ".menu-bar", "menu-bar", "Sections");
    });
});
