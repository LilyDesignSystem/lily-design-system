// australia-tax-file-number-input.test.js
// AustraliaTaxFileNumberInput component test

const path = require("path");

describe("AustraliaTaxFileNumberInput", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" + path.resolve(__dirname, "australia-tax-file-number-input.html"),
        );
    });

    it("should render the input element with correct class", async function () {
        const el = await $("input.australia-tax-file-number-input");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("australia-tax-file-number-input");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("input.australia-tax-file-number-input");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });

    it("should have autocomplete off", async function () {
        const el = await $("input.australia-tax-file-number-input");
        const value = await el.getAttribute("autocomplete");
        expect(value).toBe("off");
    });
});
