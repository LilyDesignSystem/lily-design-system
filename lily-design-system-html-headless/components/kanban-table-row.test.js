// kanban-table-row.test.js
// KanbanTableRow component test

const path = require("path");

describe("KanbanTableRow", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "kanban-table-row.html"));
    });

    it("should render the tr element with correct class", async function () {
        const el = await $("tr.kanban-table-row");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("kanban-table-row");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("tr.kanban-table-row");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
