// romania-cod-numeric-personal-view.test.js
// RomaniaCodNumericPersonalView component test

const path = require("path");

describe("RomaniaCodNumericPersonalView", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" + path.resolve(__dirname, "romania-cod-numeric-personal-view.html"),
        );
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.romania-cod-numeric-personal-view");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("romania-cod-numeric-personal-view");
    });

    it("should not put aria-label on a plain span", async function () {
        const el = await $("span.romania-cod-numeric-personal-view");
        expect(await el.getAttribute("aria-label")).toBeNull();
    });
});
