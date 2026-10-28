// slider.test.js
// Slider component test

const path = require("path");

describe("Slider", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "slider.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.slider");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("slider");
    });

    it("should have the correct ARIA role", async function () {
        const el = await $("div.slider");
        const roleAttr = await el.getAttribute("role");
        expect(roleAttr).toBe("slider");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.slider");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
