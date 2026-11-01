// uruguay-cedula-de-identidad-input.test.js
// UruguayCedulaDeIdentidadInput component test

const path = require("path");

describe("UruguayCedulaDeIdentidadInput", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" + path.resolve(__dirname, "uruguay-cedula-de-identidad-input.html"),
        );
    });

    it("should render the input element with correct class", async function () {
        const el = await $("input.uruguay-cedula-de-identidad-input");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("uruguay-cedula-de-identidad-input");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("input.uruguay-cedula-de-identidad-input");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });

    it("should have autocomplete off", async function () {
        const el = await $("input.uruguay-cedula-de-identidad-input");
        const value = await el.getAttribute("autocomplete");
        expect(value).toBe("off");
    });
});
