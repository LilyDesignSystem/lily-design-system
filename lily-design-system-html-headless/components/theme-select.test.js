// theme-select.test.js
// ThemeSelect component test

const path = require("path");

describe("ThemeSelect", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "theme-select.html"));
    });

    it("should render the select element with correct class", async function () {
        const el = await $("select.theme-select");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("theme-select");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("select.theme-select");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
