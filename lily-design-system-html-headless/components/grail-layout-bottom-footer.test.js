// grail-layout-bottom-footer.test.js
// GrailLayoutBottomFooter component test

const path = require("path");

describe("GrailLayoutBottomFooter", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "grail-layout-bottom-footer.html"));
    });

    it("should render the footer element with correct class", async function () {
        const el = await $("footer.grail-layout-bottom-footer");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("grail-layout-bottom-footer");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("footer.grail-layout-bottom-footer");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
