// procedure-record-list.test.js
// ProcedureRecordList component test

const path = require("path");

describe("ProcedureRecordList", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "procedure-record-list.html"));
    });

    it("renders a ul named by its status, holding its items", async function () {
        const list = await $("ul.procedure-record-list");
        await expect(list).toExist();
        expect(await list.getAttribute("data-status")).toBe("known");
        expect(await list.getAttribute("aria-label")).toBe("Procedures");
        await expect($("li.procedure-record-list-item")).toExist();
    });
});
