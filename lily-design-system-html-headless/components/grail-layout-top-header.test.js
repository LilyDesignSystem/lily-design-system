// grail-layout-top-header.test.js
// GrailLayoutTopHeader component test

const path = require("path");

describe("GrailLayoutTopHeader", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "grail-layout-top-header.html"));
    });

    it("should render the header element with correct class", async function () {
        const el = await $("header.grail-layout-top-header");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("grail-layout-top-header");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("header.grail-layout-top-header");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
