// grail-layout-center-main.test.js
// GrailLayoutCenterMain component test

const path = require("path");

describe("GrailLayoutCenterMain", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "grail-layout-center-main.html"));
    });

    it("should render the main element with correct class", async function () {
        const el = await $("main.grail-layout-center-main");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("grail-layout-center-main");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("main.grail-layout-center-main");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
