// colombia-cedula-de-ciudadania-view.test.js
// ColombiaCedulaDeCiudadaniaView component test

const path = require("path");

describe("ColombiaCedulaDeCiudadaniaView", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" + path.resolve(__dirname, "colombia-cedula-de-ciudadania-view.html"),
        );
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.colombia-cedula-de-ciudadania-view");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("colombia-cedula-de-ciudadania-view");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("span.colombia-cedula-de-ciudadania-view");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
