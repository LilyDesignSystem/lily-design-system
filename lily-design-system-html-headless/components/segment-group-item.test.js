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

    it("is a radio with aria-checked", async function () {
        const el = await $("button.segment-group-item");
        expect(await el.getAttribute("role")).toBe("radio");
        expect(await el.getAttribute("aria-checked")).toBe("false");
    });
});
