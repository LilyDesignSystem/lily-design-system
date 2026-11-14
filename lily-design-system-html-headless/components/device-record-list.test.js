// device-record-list.test.js
// DeviceRecordList component test

const path = require("path");

describe("DeviceRecordList", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "device-record-list.html"));
    });

    it("renders a ul named by its status, holding its items", async function () {
        const list = await $("ul.device-record-list");
        await expect(list).toExist();
        expect(await list.getAttribute("data-status")).toBe("known");
        expect(await list.getAttribute("aria-label")).toBe("Medical devices");
        await expect($("li.device-record-list-item")).toExist();
    });
});
