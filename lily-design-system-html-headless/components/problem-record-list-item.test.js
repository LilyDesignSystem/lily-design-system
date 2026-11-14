// problem-record-list-item.test.js
// ProblemRecordListItem component test

const path = require("path");

describe("ProblemRecordListItem", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "problem-record-list-item.html"));
    });

    it("renders an li with each part, each status as text and data", async function () {
        const item = await $("li.problem-record-list-item");
        await expect(item).toExist();
        expect(await item.getAttribute("data-clinical-status")).toBe("active");
        expect(await item.getAttribute("data-verification-status")).toBe("confirmed");
        expect(await $(".problem-record-list-item-condition").getText()).toBe("Type 2 diabetes");
        expect(await $("time.problem-record-list-item-onset").getAttribute("datetime")).toBe(
            "2019-06-01",
        );
        expect(await $("time.problem-record-list-item-abatement").getAttribute("datetime")).toBe(
            "2024-01-15",
        );
    });
});
