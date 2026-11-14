// medication-record-list-item.test.js
// MedicationRecordListItem component test

const path = require("path");

describe("MedicationRecordListItem", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "medication-record-list-item.html"));
    });

    it("renders an li with each part, each status as text and data", async function () {
        const item = await $("li.medication-record-list-item");
        await expect(item).toExist();
        expect(await item.getAttribute("data-status")).toBe("active");
        expect(await $("time.medication-record-list-item-effective").getAttribute("datetime")).toBe(
            "2025-03-03",
        );
    });
});
