const path = require("path");
const { runPattern } = require("../../shared/pattern-browser.cjs");

describe("SlideOutDrawer pattern", function () {
    it("meets the dialog contract", async function () {
        await browser.url("file://" + path.resolve(__dirname, "slide-out-drawer.html"));
        await runPattern(browser, "dialog", "dialog.slide-out-drawer", "slide-out-drawer", "Settings", {
            open: 'root.setAttribute("data-open", "true")',
        });
    });
});
