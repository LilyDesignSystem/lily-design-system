// ecuador-cedula-de-identidad-view.test.js
// EcuadorCedulaDeIdentidadView component test

const path = require("path");

describe("EcuadorCedulaDeIdentidadView", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" + path.resolve(__dirname, "ecuador-cedula-de-identidad-view.html"),
        );
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.ecuador-cedula-de-identidad-view");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("ecuador-cedula-de-identidad-view");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("span.ecuador-cedula-de-identidad-view");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
