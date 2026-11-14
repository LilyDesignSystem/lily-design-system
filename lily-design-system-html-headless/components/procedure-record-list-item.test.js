// procedure-record-list-item.test.js
// ProcedureRecordListItem component test

const path = require("path");

describe("ProcedureRecordListItem", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "procedure-record-list-item.html"));
    });

    it("renders an li with each part, each status as text and data", async function () {
        const item = await $("li.procedure-record-list-item");
        await expect(item).toExist();
        expect(await item.getAttribute("data-status")).toBe("completed");
        expect(await $(".procedure-record-list-item-procedure").getText()).toBe("Appendectomy");
        expect(await $("time.procedure-record-list-item-performed").getAttribute("datetime")).toBe(
            "2018-04-22",
        );
    });
});
