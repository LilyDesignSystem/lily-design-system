// republica-dominicana-cedula-de-identidad-y-electoral-input.test.js
// RepublicaDominicanaCedulaDeIdentidadYElectoralInput component test

const path = require("path");

describe("RepublicaDominicanaCedulaDeIdentidadYElectoralInput", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" +
                path.resolve(
                    __dirname,
                    "republica-dominicana-cedula-de-identidad-y-electoral-input.html",
                ),
        );
    });

    it("should render the input element with correct class", async function () {
        const el = await $("input.republica-dominicana-cedula-de-identidad-y-electoral-input");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("republica-dominicana-cedula-de-identidad-y-electoral-input");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("input.republica-dominicana-cedula-de-identidad-y-electoral-input");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });

    it("should have autocomplete off", async function () {
        const el = await $("input.republica-dominicana-cedula-de-identidad-y-electoral-input");
        const value = await el.getAttribute("autocomplete");
        expect(value).toBe("off");
    });
});
