// postal-code-input.test.js
// PostalCodeInput component test

const path = require("path");

describe("PostalCodeInput", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "postal-code-input.html"));
    });

    it("should render the input element with correct class", async function () {
        const el = await $("input.postal-code-input");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("postal-code-input");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("input.postal-code-input");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
