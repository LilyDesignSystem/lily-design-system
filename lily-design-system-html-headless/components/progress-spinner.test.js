// progress-spinner.test.js
// ProgressSpinner component test

const path = require("path");

describe("ProgressSpinner", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "progress-spinner.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.progress-spinner");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("progress-spinner");
    });

    it("should have the correct ARIA role", async function () {
        const el = await $("div.progress-spinner");
        const roleAttr = await el.getAttribute("role");
        expect(roleAttr).toBe("status");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.progress-spinner");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
