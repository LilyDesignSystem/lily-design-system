// slide-out-drawer.test.js
// SlideOutDrawer component test

const path = require("path");

describe("SlideOutDrawer", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "slide-out-drawer.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.slide-out-drawer");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("slide-out-drawer");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.slide-out-drawer");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
