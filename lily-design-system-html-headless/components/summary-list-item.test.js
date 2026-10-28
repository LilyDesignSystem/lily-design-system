// summary-list-item.test.js
// SummaryListItem component test

const path = require("path");

describe("SummaryListItem", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "summary-list-item.html"));
    });

    it("should render the li element with correct class", async function () {
        const el = await $("li.summary-list-item");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("summary-list-item");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("li.summary-list-item");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
