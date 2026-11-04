// iban-input.test.js
// IbanInput component test

const path = require("path");

describe("IbanInput", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "iban-input.html"));
    });

    it("should render the input element with correct class", async function () {
        const el = await $("input.iban-input");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("iban-input");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("input.iban-input");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });

    it("should have autocomplete off", async function () {
        const el = await $("input.iban-input");
        const value = await el.getAttribute("autocomplete");
        expect(value).toBe("off");
    });
});
