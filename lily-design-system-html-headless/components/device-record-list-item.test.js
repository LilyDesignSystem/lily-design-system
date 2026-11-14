// device-record-list-item.test.js
// DeviceRecordListItem component test

const path = require("path");

describe("DeviceRecordListItem", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "device-record-list-item.html"));
    });

    it("renders an li with each part, each status as text and data", async function () {
        const item = await $("li.device-record-list-item");
        await expect(item).toExist();
        expect(await item.getAttribute("data-status")).toBe("active");
        expect(await $(".device-record-list-item-device").getText()).toBe("Cardiac pacemaker");
        expect(await $("time.device-record-list-item-timing").getAttribute("datetime")).toBe(
            "2021-02-08",
        );
    });
});
