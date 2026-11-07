// slider.test.js
// Slider component test

const path = require("path");

describe("Slider", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "slider.html"));
    });

    it("should render the input element with correct class", async function () {
        const el = await $("input.slider");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("slider");
    });

    it("relies on the element's implicit role, with no explicit one", async function () {
        const el = await $("input.slider");
        const roleAttr = await el.getAttribute("role");
        expect(roleAttr).toBeNull();
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("input.slider");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
