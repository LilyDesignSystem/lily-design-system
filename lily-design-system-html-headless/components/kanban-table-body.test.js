// kanban-table-body.test.js
// KanbanTableBody component test

const path = require("path");

describe("KanbanTableBody", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "kanban-table-body.html"));
    });

    it("should render the tbody element with correct class", async function () {
        const el = await $("tbody.kanban-table-body");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("kanban-table-body");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("tbody.kanban-table-body");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
