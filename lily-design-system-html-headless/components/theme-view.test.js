// theme-view.test.js
// ThemeView component test

const path = require("path");

describe("ThemeView", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "theme-view.html"));
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.theme-view");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("theme-view");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("span.theme-view");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
