// drawer.test.js
// Drawer component test

const path = require("path");

describe("Drawer", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "drawer.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.drawer");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("drawer");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.drawer");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
