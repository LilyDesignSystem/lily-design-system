const path = require("path");
const { runPattern } = require("../../shared/pattern-browser.cjs");

describe("Drawer pattern", function () {
    it("meets the dialog contract", async function () {
        await browser.url("file://" + path.resolve(__dirname, "drawer.html"));
        await runPattern(browser, "dialog", "dialog.drawer", "drawer", "Settings", {
            open: 'root.setAttribute("data-open", "true")',
        });
    });
});
