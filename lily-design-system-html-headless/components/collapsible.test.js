// collapsible.test.js
// Collapsible component test

const path = require("path");

describe("Collapsible", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "collapsible.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.collapsible");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("collapsible");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.collapsible");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
