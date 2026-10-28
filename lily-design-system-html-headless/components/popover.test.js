// popover.test.js
// Popover component test

const path = require("path");

describe("Popover", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "popover.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.popover");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("popover");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.popover");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
