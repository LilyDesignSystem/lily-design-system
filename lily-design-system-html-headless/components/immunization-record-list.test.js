// immunization-record-list.test.js
// ImmunizationRecordList component test

const path = require("path");

describe("ImmunizationRecordList", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "immunization-record-list.html"));
    });

    it("renders a ul named by its status, holding its items", async function () {
        const list = await $("ul.immunization-record-list");
        await expect(list).toExist();
        expect(await list.getAttribute("data-status")).toBe("known");
        expect(await list.getAttribute("aria-label")).toBe("Immunizations");
        await expect($("li.immunization-record-list-item")).toExist();
    });
});
