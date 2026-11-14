// problem-record-list.test.js
// ProblemRecordList component test

const path = require("path");

describe("ProblemRecordList", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "problem-record-list.html"));
    });

    it("renders a ul named by its status, holding its items", async function () {
        const list = await $("ul.problem-record-list");
        await expect(list).toExist();
        expect(await list.getAttribute("data-status")).toBe("known");
        expect(await list.getAttribute("aria-label")).toBe("Problems");
        await expect($("li.problem-record-list-item")).toExist();
    });
});
