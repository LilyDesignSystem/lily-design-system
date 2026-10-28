// scroll-bar.test.js
// ScrollBar component test

const path = require("path");

describe("ScrollBar", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "scroll-bar.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.scroll-bar");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("scroll-bar");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.scroll-bar");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
