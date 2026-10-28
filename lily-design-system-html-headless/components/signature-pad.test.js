// signature-pad.test.js
// SignaturePad component test

const path = require("path");

describe("SignaturePad", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "signature-pad.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.signature-pad");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("signature-pad");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.signature-pad");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
