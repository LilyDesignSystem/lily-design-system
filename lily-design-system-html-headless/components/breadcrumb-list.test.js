// breadcrumb-list.test.js
// BreadcrumbList component test

const path = require("path");

describe("BreadcrumbList", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "breadcrumb-list.html"));
    });

    it("should render the ol element with correct class", async function () {
        const el = await $("ol.breadcrumb-list");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("breadcrumb-list");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("ol.breadcrumb-list");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
