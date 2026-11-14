// allergy-record-list-item.test.js
// AllergyRecordListItem component test

const path = require("path");

describe("AllergyRecordListItem", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "allergy-record-list-item.html"));
    });

    it("renders an li with each part, each status as text and data", async function () {
        const item = await $("li.allergy-record-list-item");
        await expect(item).toExist();
        expect(await item.getAttribute("data-severity")).toBe("severe");
        expect(await item.getAttribute("data-criticality")).toBe("high");
        expect(await item.getAttribute("data-clinical-status")).toBe("active");
        expect(await item.getAttribute("data-verification-status")).toBe("confirmed");
        expect(await $(".allergy-record-list-item-substance").getText()).toBe("Penicillin");
        expect(await $("time.allergy-record-list-item-updated").getAttribute("datetime")).toBe(
            "2026-11-03",
        );
    });
});
