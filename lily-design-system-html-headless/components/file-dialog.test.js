// file-dialog.test.js
// FileDialog component test

const path = require("path");

describe("FileDialog", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "file-dialog.html"));
    });

    it("should render the dialog element with correct class", async function () {
        const el = await $("dialog.file-dialog");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("file-dialog");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("dialog.file-dialog");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
