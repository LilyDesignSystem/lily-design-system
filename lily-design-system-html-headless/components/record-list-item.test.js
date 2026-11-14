// record-list-item.test.js
// RecordListItem component test

const path = require("path");

describe("RecordListItem", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "record-list-item.html"));
    });

    it("renders an li with each part, each status as text and data", async function () {
        const item = await $("li.record-list-item");
        await expect(item).toExist();
        expect(await item.getAttribute("data-status")).toBe("final");
        expect(await $("time.record-list-item-updated").getAttribute("datetime")).toBe(
            "2026-11-03",
        );
    });
});
