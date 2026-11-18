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

    it("should not put aria-label on a plain span", async function () {
        const el = await $("span.iran-kod-e-melli-view");
        expect(await el.getAttribute("aria-label")).toBeNull();
    });
});
