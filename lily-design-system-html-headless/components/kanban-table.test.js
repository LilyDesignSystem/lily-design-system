// kanban-table.test.js
// KanbanTable component test

const path = require("path");

describe("KanbanTable", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "kanban-table.html"));
    });

    it("should render the table element with correct class", async function () {
        const el = await $("table.kanban-table");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("kanban-table");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("table.kanban-table");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
