// currency-input.test.js
// CurrencyInput component test

const path = require("path");

describe("CurrencyInput", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "currency-input.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.currency-input");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("currency-input");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.currency-input");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });

    it("should carry a data-currency-code attribute the consumer fills, never defaulted to USD", async function () {
        const el = await $("div.currency-input");
        const code = await el.getAttribute("data-currency-code");
        expect(code).not.toBeNull();
        expect(code).not.toBe("USD");
    });
});
