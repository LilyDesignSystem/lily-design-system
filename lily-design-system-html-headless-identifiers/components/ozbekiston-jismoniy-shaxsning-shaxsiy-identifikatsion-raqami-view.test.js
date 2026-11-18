// ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-view.test.js
// OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiView component test

const path = require("path");

describe("OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiView", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" +
                path.resolve(
                    __dirname,
                    "ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-view.html",
                ),
        );
    });

    it("should render the span element with correct class", async function () {
        const el = await $(
            "span.ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-view",
        );
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain(
            "ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-view",
        );
    });

    it("should not put aria-label on a plain span", async function () {
        const el = await $(
            "span.ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-view",
        );
        expect(await el.getAttribute("aria-label")).toBeNull();
    });
});
