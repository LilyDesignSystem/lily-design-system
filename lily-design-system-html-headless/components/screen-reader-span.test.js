// screen-reader-span.test.js
// ScreenReaderSpan component test

const path = require("path");

describe("ScreenReaderSpan", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "screen-reader-span.html"));
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.screen-reader-span");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("screen-reader-span");
    });

    it("should not have an aria-label attribute", async function () {
        const el = await $("span.screen-reader-span");
        expect(await el.getAttribute("aria-label")).toBeNull();
    });
});
