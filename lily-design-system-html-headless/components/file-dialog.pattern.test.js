const path = require("path");
const { runPattern } = require("../../shared/pattern-browser.cjs");

describe("FileDialog pattern", function () {
    it("meets the dialog contract", async function () {
        await browser.url("file://" + path.resolve(__dirname, "file-dialog.html"));
        await runPattern(browser, "dialog", "dialog.file-dialog", "file-dialog", "Settings", {
            open: "root.showModal()",
        });
    });
});
