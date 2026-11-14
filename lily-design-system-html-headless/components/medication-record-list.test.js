// medication-record-list.test.js
// MedicationRecordList component test

const path = require("path");

describe("MedicationRecordList", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "medication-record-list.html"));
    });

    it("renders a ul named by its status, holding its items", async function () {
        const list = await $("ul.medication-record-list");
        await expect(list).toExist();
        expect(await list.getAttribute("data-status")).toBe("known");
        expect(await list.getAttribute("aria-label")).toBe("Current medicines");
        await expect($("li.medication-record-list-item")).toExist();
    });
});
