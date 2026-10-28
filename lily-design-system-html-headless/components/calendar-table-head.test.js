// calendar-table-head.test.js
// CalendarTableHead component test

const path = require("path");

describe("CalendarTableHead", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "calendar-table-head.html"));
    });

    it("should render the thead element with correct class", async function () {
        const el = await $("thead.calendar-table-head");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("calendar-table-head");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("thead.calendar-table-head");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
