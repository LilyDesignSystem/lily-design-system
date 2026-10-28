// dialog.test.js
// Dialog component test

const path = require("path");

describe("Dialog", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "dialog.html"));
    });

    it("should render the dialog element with correct class", async function () {
        const el = await $("dialog.dialog");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("dialog");
    });

    it("should have the correct ARIA role", async function () {
        const el = await $("dialog.dialog");
        const roleAttr = await el.getAttribute("role");
        expect(roleAttr).toBe("dialog");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("dialog.dialog");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
