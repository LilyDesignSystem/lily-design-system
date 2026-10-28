// banner.test.js
// Banner component test

const path = require("path");

describe("Banner", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "banner.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.banner");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("banner");
    });

    it("should have the correct ARIA role", async function () {
        const el = await $("div.banner");
        const roleAttr = await el.getAttribute("role");
        expect(roleAttr).toBe("banner");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.banner");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
