import { test } from "vitest";

import { gridFixture, runPattern } from "../shared/pattern-tester";
import { DataGrid } from "./data-grid.js";

if (!customElements.get("lily-data-grid")) customElements.define("lily-data-grid", DataGrid);

test("meets the grid contract", async () => {
    const grid = document.createElement("lily-data-grid") as DataGrid;
    grid.setAttribute("label", "People");
    Object.assign(grid, gridFixture);
    document.body.append(grid);
    await runPattern("grid", { root: grid, hook: "data-grid" });
});
