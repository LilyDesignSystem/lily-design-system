// argentina-codigo-unico-de-identificacion-laboral-view.test.js
// ArgentinaCodigoUnicoDeIdentificacionLaboralView component test

const path = require("path");

describe("ArgentinaCodigoUnicoDeIdentificacionLaboralView", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" +
                path.resolve(
                    __dirname,
                    "argentina-codigo-unico-de-identificacion-laboral-view.html",
                ),
        );
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.argentina-codigo-unico-de-identificacion-laboral-view");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("argentina-codigo-unico-de-identificacion-laboral-view");
    });

    it("should not put aria-label on a plain span", async function () {
        const el = await $("span.argentina-codigo-unico-de-identificacion-laboral-view");
        expect(await el.getAttribute("aria-label")).toBeNull();
    });
});
