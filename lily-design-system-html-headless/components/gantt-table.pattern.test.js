const path = require("path");
const { runPattern } = require("../../shared/pattern-browser.cjs");

describe("GanttTable pattern", function () {
    it("meets the grid contract", async function () {
        await browser.url("file://" + path.resolve(__dirname, "gantt-table.html"));
        await runPattern(browser, "grid", ".gantt-table", "gantt-table", "Grid", {
            setup: 'root.innerHTML = "<tbody><tr><th>Alpha</th><th>Beta</th><th>Gamma</th></tr><tr><td>A1</td><td>B1</td><td>C1</td></tr><tr><td>A2</td><td>B2</td><td>C2</td></tr><tr><td>A3</td><td>B3</td><td>C3</td></tr></tbody>";',
        });
    });
});
