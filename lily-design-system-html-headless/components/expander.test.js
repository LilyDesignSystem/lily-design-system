// expander.test.js
// Expander component test

const path = require("path");

describe("Expander", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "expander.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.expander");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("expander");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.expander");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
