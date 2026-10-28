// pagination-list-item.test.js
// PaginationListItem component test

const path = require("path");

describe("PaginationListItem", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "pagination-list-item.html"));
    });

    it("should render the li element with correct class", async function () {
        const el = await $("li.pagination-list-item");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("pagination-list-item");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("li.pagination-list-item");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
