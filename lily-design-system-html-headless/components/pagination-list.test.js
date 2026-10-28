// pagination-list.test.js
// PaginationList component test

const path = require("path");

describe("PaginationList", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "pagination-list.html"));
    });

    it("should render the ol element with correct class", async function () {
        const el = await $("ol.pagination-list");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("pagination-list");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("ol.pagination-list");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
