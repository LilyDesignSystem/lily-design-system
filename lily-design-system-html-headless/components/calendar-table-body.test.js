// calendar-table-body.test.js
// CalendarTableBody component test

const path = require("path");

describe("CalendarTableBody", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "calendar-table-body.html"));
    });

    it("should render the tbody element with correct class", async function () {
        const el = await $("tbody.calendar-table-body");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("calendar-table-body");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("tbody.calendar-table-body");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
