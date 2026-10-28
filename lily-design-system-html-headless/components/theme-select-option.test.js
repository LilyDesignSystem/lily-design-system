// theme-select-option.test.js
// ThemeSelectOption component test

const path = require("path");

describe("ThemeSelectOption", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "theme-select-option.html"));
    });

    it("should render the option element with correct class", async function () {
        const el = await $("option.theme-select-option");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("theme-select-option");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("option.theme-select-option");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
