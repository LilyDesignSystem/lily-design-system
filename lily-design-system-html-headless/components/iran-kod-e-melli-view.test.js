// iran-kod-e-melli-view.test.js
// IranKodEMelliView component test

const path = require("path");

describe("IranKodEMelliView", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "iran-kod-e-melli-view.html"));
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.iran-kod-e-melli-view");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("iran-kod-e-melli-view");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("span.iran-kod-e-melli-view");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
