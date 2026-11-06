// calendar-range-picker.test.js
// CalendarRangePicker component test

const path = require("path");

describe("CalendarRangePicker", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "calendar-range-picker.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.calendar-range-picker");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("calendar-range-picker");
    });

    it("should have the correct ARIA role", async function () {
        const el = await $("div.calendar-range-picker");
        const roleAttr = await el.getAttribute("role");
        expect(roleAttr).toBe("application");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.calendar-range-picker");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
