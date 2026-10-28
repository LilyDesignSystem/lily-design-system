// grail-layout-left-aside.test.js
// GrailLayoutLeftAside component test

const path = require("path");

describe("GrailLayoutLeftAside", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "grail-layout-left-aside.html"));
    });

    it("should render the aside element with correct class", async function () {
        const el = await $("aside.grail-layout-left-aside");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("grail-layout-left-aside");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("aside.grail-layout-left-aside");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
