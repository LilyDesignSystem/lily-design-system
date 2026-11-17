// record-list-item.test.js
// RecordListItem component test

const path = require("path");

describe("RecordListItem", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "record-list-item.html"));
    });

    it("renders an li with each part, each status as text and data", async function () {
        const item = await $("li.record-list-item[data-status]");
        await expect(item).toExist();
        expect(await item.getAttribute("data-status")).toBe("final");
        expect(await $("time.record-list-item-updated").getAttribute("datetime")).toBe(
            "2026-11-03",
        );
    });

    it("keeps withheld and in-error records in the list, in words", async function () {
        const withheld = await $('li.record-list-item[data-entry-state="withheld"]');
        expect(await withheld.$(".record-list-item-entry-state").getText()).toBe(
            "Restricted: not available to you",
        );
        const inError = await $('li.record-list-item[data-entry-state="entered-in-error"]');
        expect(await inError.$("del.record-list-item-entry").getText()).toBe("Pulse 72 bpm");
        expect(await inError.$(".record-list-item-entry-state").getText()).toBe("Entered in error");
    });
});
