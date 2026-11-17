// timeline-list-item.test.js
// TimelineListItem component test

const path = require("path");

describe("TimelineListItem", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "timeline-list-item.html"));
    });

    it("should render the li element with correct class", async function () {
        const el = await $("li.timeline-list-item[aria-label]");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("timeline-list-item");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("li.timeline-list-item[aria-label]");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });

    it("keeps withheld and in-error entries in the list, in words", async function () {
        const withheld = await $('li.timeline-list-item[data-entry-state="withheld"]');
        expect(await withheld.$("time").getAttribute("datetime")).toBe("2026-11-03");
        expect(await withheld.$(".timeline-list-item-entry-state").getText()).toBe(
            "Restricted entry",
        );
        const inError = await $('li.timeline-list-item[data-entry-state="entered-in-error"]');
        expect(await inError.$("del.timeline-list-item-entry").getText()).toBe("Wrong patient");
    });
});
