// timeline-list-item.test.js
// TimelineListItem component test

const path = require("path");

describe("TimelineListItem", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "timeline-list-item.html"));
    });

    it("should render the li element with correct class", async function () {
        const el = await $("li.timeline-list-item");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("timeline-list-item");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("li.timeline-list-item");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
