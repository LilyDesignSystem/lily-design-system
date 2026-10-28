// warning-callout.test.js
// WarningCallout component test

const path = require("path");

describe("WarningCallout", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "warning-callout.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.warning-callout");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("warning-callout");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.warning-callout");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
