// segment-group-item.test.js
// SegmentGroupItem component test

const path = require("path");

describe("SegmentGroupItem", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "segment-group-item.html"));
    });

    it("should render the button element with correct class", async function () {
        const el = await $("button.segment-group-item");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("segment-group-item");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("button.segment-group-item");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
