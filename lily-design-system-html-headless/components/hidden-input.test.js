// hidden-input.test.js
// HiddenInput component test

const path = require("path");

describe("HiddenInput", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "hidden-input.html"));
    });

    it("should render the input element with correct class", async function () {
        const el = await $("input.hidden-input");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("hidden-input");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("input.hidden-input");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
