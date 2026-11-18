// ghana-card-personal-identification-number-input.test.js
// GhanaCardPersonalIdentificationNumberInput component test

const path = require("path");

describe("GhanaCardPersonalIdentificationNumberInput", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" +
                path.resolve(__dirname, "ghana-card-personal-identification-number-input.html"),
        );
    });

    it("should render the input element with correct class", async function () {
        const el = await $("input.ghana-card-personal-identification-number-input");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("ghana-card-personal-identification-number-input");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("input.ghana-card-personal-identification-number-input");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });

    it("should have autocomplete off", async function () {
        const el = await $("input.ghana-card-personal-identification-number-input");
        const value = await el.getAttribute("autocomplete");
        expect(value).toBe("off");
    });
});
