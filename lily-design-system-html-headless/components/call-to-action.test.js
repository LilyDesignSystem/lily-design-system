// call-to-action.test.js
// CallToAction component test

const path = require("path");

describe("CallToAction", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "call-to-action.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.call-to-action");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("call-to-action");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.call-to-action");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
