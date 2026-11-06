// aspect-ratio-container.test.js
// AspectRatioContainer component test

const path = require("path");

describe("AspectRatioContainer", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "aspect-ratio-container.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.aspect-ratio-container");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("aspect-ratio-container");
    });

    it("should not have an aria-label attribute", async function () {
        const el = await $("div.aspect-ratio-container");
        expect(await el.getAttribute("aria-label")).toBeNull();
    });
});
