const path = require("path");
const { runPattern } = require("../../shared/pattern-browser.cjs");

describe("Dialog pattern", function () {
    it("meets the dialog contract", async function () {
        await browser.url("file://" + path.resolve(__dirname, "dialog.html"));
        await runPattern(browser, "dialog", "dialog.dialog", "dialog", "Settings", {
            open: "root.showModal()",
        });
    });
});
