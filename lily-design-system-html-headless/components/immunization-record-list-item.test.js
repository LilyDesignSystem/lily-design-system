// immunization-record-list-item.test.js
// ImmunizationRecordListItem component test

const path = require("path");

describe("ImmunizationRecordListItem", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" + path.resolve(__dirname, "immunization-record-list-item.html"),
        );
    });

    it("renders an li with each part, each status as text and data", async function () {
        const item = await $("li.immunization-record-list-item");
        await expect(item).toExist();
        expect(await item.getAttribute("data-status")).toBe("completed");
        expect(await $(".immunization-record-list-item-vaccine").getText()).toBe("MMR vaccine");
        expect(
            await $("time.immunization-record-list-item-occurrence").getAttribute("datetime"),
        ).toBe("2025-09-12");
    });
});
