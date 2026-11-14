// allergy-record-list.test.js
// AllergyRecordList component test

const path = require("path");

describe("AllergyRecordList", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "allergy-record-list.html"));
    });

    it("renders a ul named by its status, holding its items", async function () {
        const list = await $("ul.allergy-record-list");
        await expect(list).toExist();
        expect(await list.getAttribute("data-status")).toBe("known");
        expect(await list.getAttribute("aria-label")).toBe("Known allergies");
        await expect($("li.allergy-record-list-item")).toExist();
    });
});
