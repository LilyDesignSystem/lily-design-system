// progress-circle.test.js
// ProgressCircle component test

const path = require("path");

describe("ProgressCircle", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "progress-circle.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.progress-circle");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("progress-circle");
    });

    it("should have the correct ARIA role", async function () {
        const el = await $("div.progress-circle");
        const roleAttr = await el.getAttribute("role");
        expect(roleAttr).toBe("progressbar");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.progress-circle");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
