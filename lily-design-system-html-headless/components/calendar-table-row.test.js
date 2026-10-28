// calendar-table-row.test.js
// CalendarTableRow component test

const path = require("path");

describe("CalendarTableRow", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "calendar-table-row.html"));
    });

    it("should render the tr element with correct class", async function () {
        const el = await $("tr.calendar-table-row");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("calendar-table-row");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("tr.calendar-table-row");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
