const path = require("path");
const { runPattern } = require("../../shared/pattern-browser.cjs");

describe("Sheet pattern", function () {
    it("meets the dialog contract", async function () {
        await browser.url("file://" + path.resolve(__dirname, "sheet.html"));
        await runPattern(browser, "dialog", "dialog.sheet", "sheet", "Settings", {
            open: 'root.setAttribute("data-open", "true")',
        });
    });
});
