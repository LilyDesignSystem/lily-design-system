// mexico-clave-unica-de-registro-de-poblacion-view.test.js
// MexicoClaveUnicaDeRegistroDePoblacionView component test

const path = require("path");

describe("MexicoClaveUnicaDeRegistroDePoblacionView", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" +
                path.resolve(__dirname, "mexico-clave-unica-de-registro-de-poblacion-view.html"),
        );
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.mexico-clave-unica-de-registro-de-poblacion-view");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("mexico-clave-unica-de-registro-de-poblacion-view");
    });

    it("should not put aria-label on a plain span", async function () {
        const el = await $("span.mexico-clave-unica-de-registro-de-poblacion-view");
        expect(await el.getAttribute("aria-label")).toBeNull();
    });
});
