// kanban-table-head.test.js
// KanbanTableHead component test

const path = require("path");

describe("KanbanTableHead", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "kanban-table-head.html"));
    });

    it("should render the thead element with correct class", async function () {
        const el = await $("thead.kanban-table-head");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("kanban-table-head");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("thead.kanban-table-head");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
