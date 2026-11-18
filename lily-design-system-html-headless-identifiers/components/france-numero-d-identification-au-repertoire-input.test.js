// france-numero-d-identification-au-repertoire-input.test.js
// FranceNumeroDIdentificationAuRepertoireInput component test

const path = require("path");

describe("FranceNumeroDIdentificationAuRepertoireInput", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" +
                path.resolve(__dirname, "france-numero-d-identification-au-repertoire-input.html"),
        );
    });

    it("should render the input element with correct class", async function () {
        const el = await $("input.france-numero-d-identification-au-repertoire-input");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("france-numero-d-identification-au-repertoire-input");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("input.france-numero-d-identification-au-repertoire-input");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
