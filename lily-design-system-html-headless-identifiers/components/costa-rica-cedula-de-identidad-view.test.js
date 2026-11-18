// costa-rica-cedula-de-identidad-view.test.js
// CostaRicaCedulaDeIdentidadView component test

const path = require("path");

describe("CostaRicaCedulaDeIdentidadView", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" + path.resolve(__dirname, "costa-rica-cedula-de-identidad-view.html"),
        );
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.costa-rica-cedula-de-identidad-view");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("costa-rica-cedula-de-identidad-view");
    });

    it("should not put aria-label on a plain span", async function () {
        const el = await $("span.costa-rica-cedula-de-identidad-view");
        expect(await el.getAttribute("aria-label")).toBeNull();
    });
});
