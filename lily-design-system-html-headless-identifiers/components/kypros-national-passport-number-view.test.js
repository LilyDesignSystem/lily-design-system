// kypros-national-passport-number-view.test.js
// KyprosNationalPassportNumberView component test

const path = require("path");

describe("KyprosNationalPassportNumberView", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" + path.resolve(__dirname, "kypros-national-passport-number-view.html"),
        );
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.kypros-national-passport-number-view");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("kypros-national-passport-number-view");
    });

    it("should not put aria-label on a plain span", async function () {
        const el = await $("span.kypros-national-passport-number-view");
        expect(await el.getAttribute("aria-label")).toBeNull();
    });
});
