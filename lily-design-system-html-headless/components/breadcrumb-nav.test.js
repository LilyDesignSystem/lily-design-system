// breadcrumb-nav.test.js
// BreadcrumbNav component test

const path = require("path");

describe("BreadcrumbNav", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "breadcrumb-nav.html"));
    });

    it("should render the nav element with correct class", async function () {
        const el = await $("nav.breadcrumb-nav");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("breadcrumb-nav");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("nav.breadcrumb-nav");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
