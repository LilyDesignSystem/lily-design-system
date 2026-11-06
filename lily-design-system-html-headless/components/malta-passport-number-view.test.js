// malta-passport-number-view.test.js
// MaltaPassportNumberView component test

const path = require("path");

describe("MaltaPassportNumberView", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "malta-passport-number-view.html"));
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.malta-passport-number-view");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("malta-passport-number-view");
    });

    it("should not put aria-label on a plain span", async function () {
        const el = await $("span.malta-passport-number-view");
        expect(await el.getAttribute("aria-label")).toBeNull();
    });
});
