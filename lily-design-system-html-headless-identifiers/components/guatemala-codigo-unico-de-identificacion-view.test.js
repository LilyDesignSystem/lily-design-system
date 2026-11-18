// guatemala-codigo-unico-de-identificacion-view.test.js
// GuatemalaCodigoUnicoDeIdentificacionView component test

const path = require("path");

describe("GuatemalaCodigoUnicoDeIdentificacionView", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" +
                path.resolve(__dirname, "guatemala-codigo-unico-de-identificacion-view.html"),
        );
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.guatemala-codigo-unico-de-identificacion-view");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("guatemala-codigo-unico-de-identificacion-view");
    });

    it("should not put aria-label on a plain span", async function () {
        const el = await $("span.guatemala-codigo-unico-de-identificacion-view");
        expect(await el.getAttribute("aria-label")).toBeNull();
    });
});
