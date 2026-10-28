// kanban-table-foot.test.js
// KanbanTableFoot component test

const path = require("path");

describe("KanbanTableFoot", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "kanban-table-foot.html"));
    });

    it("should render the tfoot element with correct class", async function () {
        const el = await $("tfoot.kanban-table-foot");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("kanban-table-foot");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("tfoot.kanban-table-foot");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
