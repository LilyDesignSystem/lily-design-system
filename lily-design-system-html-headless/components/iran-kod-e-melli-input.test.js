// iran-kod-e-melli-input.test.js
// IranKodEMelliInput component test

const path = require("path");

describe("IranKodEMelliInput", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "iran-kod-e-melli-input.html"));
    });

    it("should render the input element with correct class", async function () {
        const el = await $("input.iran-kod-e-melli-input");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("iran-kod-e-melli-input");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("input.iran-kod-e-melli-input");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });

    it("should have autocomplete off", async function () {
        const el = await $("input.iran-kod-e-melli-input");
        const value = await el.getAttribute("autocomplete");
        expect(value).toBe("off");
    });
});
