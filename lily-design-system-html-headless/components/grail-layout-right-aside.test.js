// grail-layout-right-aside.test.js
// GrailLayoutRightAside component test

const path = require("path");

describe("GrailLayoutRightAside", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "grail-layout-right-aside.html"));
    });

    it("should render the aside element with correct class", async function () {
        const el = await $("aside.grail-layout-right-aside");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("grail-layout-right-aside");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("aside.grail-layout-right-aside");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
