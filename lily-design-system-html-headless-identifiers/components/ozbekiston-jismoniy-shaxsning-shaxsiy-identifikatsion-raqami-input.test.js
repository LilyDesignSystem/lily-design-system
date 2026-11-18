// ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-input.test.js
// OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiInput component test

const path = require("path");

describe("OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiInput", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" +
                path.resolve(
                    __dirname,
                    "ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-input.html",
                ),
        );
    });

    it("should render the input element with correct class", async function () {
        const el = await $(
            "input.ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-input",
        );
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain(
            "ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-input",
        );
    });

    it("should have an aria-label attribute", async function () {
        const el = await $(
            "input.ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-input",
        );
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });

    it("should have autocomplete off", async function () {
        const el = await $(
            "input.ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-input",
        );
        const value = await el.getAttribute("autocomplete");
        expect(value).toBe("off");
    });
});
