// contents-nav.test.js
// ContentsNav component test

const path = require("path");

describe("ContentsNav", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "contents-nav.html"));
    });

    it("should render the nav element with correct class", async function () {
        const el = await $("nav.contents-nav");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("contents-nav");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("nav.contents-nav");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
