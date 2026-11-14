// record-list.test.js
// RecordList component test

const path = require("path");

describe("RecordList", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "record-list.html"));
    });

    it("renders a ul named by its status, holding its items", async function () {
        const list = await $("ul.record-list");
        await expect(list).toExist();
        expect(await list.getAttribute("data-status")).toBe("known");
        expect(await list.getAttribute("aria-label")).toBe("Vital signs");
        await expect($("li.record-list-item")).toExist();
    });
});
