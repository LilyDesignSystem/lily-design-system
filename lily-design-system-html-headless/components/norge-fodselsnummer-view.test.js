// norge-fodselsnummer-view.test.js
// NorgeFodselsnummerView component test

const path = require("path");

describe("NorgeFodselsnummerView", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "norge-fodselsnummer-view.html"));
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.norge-fodselsnummer-view");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("norge-fodselsnummer-view");
    });

    it("should not put aria-label on a plain span", async function () {
        const el = await $("span.norge-fodselsnummer-view");
        expect(await el.getAttribute("aria-label")).toBeNull();
    });
});
