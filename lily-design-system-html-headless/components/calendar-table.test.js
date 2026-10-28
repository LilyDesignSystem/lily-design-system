// calendar-table.test.js
// CalendarTable component test

const path = require("path");

describe("CalendarTable", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "calendar-table.html"));
    });

    it("should render the table element with correct class", async function () {
        const el = await $("table.calendar-table");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("calendar-table");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("table.calendar-table");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
