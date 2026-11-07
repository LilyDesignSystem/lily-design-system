const path = require("path");
const { runPattern } = require("../../shared/pattern-browser.cjs");

describe("KanbanTable pattern", function () {
    it("meets the grid contract", async function () {
        await browser.url("file://" + path.resolve(__dirname, "kanban-table.html"));
        await runPattern(browser, "grid", ".kanban-table", "kanban-table", "Board");
    });
});
