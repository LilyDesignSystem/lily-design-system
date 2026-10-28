// timeline-list.test.js
// TimelineList component test

const path = require("path");

describe("TimelineList", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "timeline-list.html"));
    });

    it("should render the ol element with correct class", async function () {
        const el = await $("ol.timeline-list");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("timeline-list");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("ol.timeline-list");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
