// pagination-nav.test.js
// PaginationNav component test

const path = require("path");

describe("PaginationNav", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "pagination-nav.html"));
    });

    it("should render the nav element with correct class", async function () {
        const el = await $("nav.pagination-nav");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("pagination-nav");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("nav.pagination-nav");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
