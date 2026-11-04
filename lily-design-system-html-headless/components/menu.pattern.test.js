const path = require("path");
const { runPattern } = require("../../shared/pattern-browser.cjs");

describe("Menu pattern", function () {
    it("meets the menu contract", async function () {
        await browser.url("file://" + path.resolve(__dirname, "menu.html"));
        await runPattern(browser, "menu", ".menu", "menu", "Sections");
    });
});
