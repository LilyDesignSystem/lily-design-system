// cesko-rodne-cislo-view.test.js
// CeskoRodneCisloView component test

const path = require("path");

describe("CeskoRodneCisloView", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "cesko-rodne-cislo-view.html"));
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.cesko-rodne-cislo-view");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("cesko-rodne-cislo-view");
    });

    it("should not put aria-label on a plain span", async function () {
        const el = await $("span.cesko-rodne-cislo-view");
        expect(await el.getAttribute("aria-label")).toBeNull();
    });
});
