// header.test.js
// Header component test

const path = require("path");

describe("Header", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "header.html"));
    });

    it("should render the header element with correct class", async function () {
        const el = await $("header.header");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("header");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("header.header");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
