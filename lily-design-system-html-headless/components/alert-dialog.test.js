// alert-dialog.test.js
// AlertDialog component test

const path = require("path");

describe("AlertDialog", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "alert-dialog.html"));
    });

    it("should render the dialog element with correct class", async function () {
        const el = await $("dialog.alert-dialog");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("alert-dialog");
    });

    it("should have the correct ARIA role", async function () {
        const el = await $("dialog.alert-dialog");
        const roleAttr = await el.getAttribute("role");
        expect(roleAttr).toBe("alertdialog");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("dialog.alert-dialog");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
