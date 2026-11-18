// ityopya-fayda-identification-number-view.test.js
// ItyopyaFaydaIdentificationNumberView component test

const path = require("path");

describe("ItyopyaFaydaIdentificationNumberView", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" + path.resolve(__dirname, "ityopya-fayda-identification-number-view.html"),
        );
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.ityopya-fayda-identification-number-view");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("ityopya-fayda-identification-number-view");
    });

    it("should not put aria-label on a plain span", async function () {
        const el = await $("span.ityopya-fayda-identification-number-view");
        expect(await el.getAttribute("aria-label")).toBeNull();
    });
});
