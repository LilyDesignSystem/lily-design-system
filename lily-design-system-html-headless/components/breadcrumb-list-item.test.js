// breadcrumb-list-item.test.js
// BreadcrumbListItem component test

const path = require("path");

describe("BreadcrumbListItem", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "breadcrumb-list-item.html"));
    });

    it("should render the li element with correct class", async function () {
        const el = await $("li.breadcrumb-list-item");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("breadcrumb-list-item");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("li.breadcrumb-list-item");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
