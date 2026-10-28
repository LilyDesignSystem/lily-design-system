// gantt-table.test.js
// GanttTable component test

const path = require("path");

describe("GanttTable", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "gantt-table.html"));
    });

    it("should render the table element with correct class", async function () {
        const el = await $("table.gantt-table");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("gantt-table");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("table.gantt-table");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
