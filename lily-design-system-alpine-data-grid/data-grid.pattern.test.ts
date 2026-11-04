import { readFileSync } from "node:fs";
import Alpine from "alpinejs";
import { test } from "vitest";

import { gridFixture, runPattern } from "../shared/pattern-tester";
import lilyDataGrid from "./index.js";

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

test("meets the grid contract", async () => {
    (window as unknown as { Alpine: typeof Alpine }).Alpine = Alpine;
    Alpine.plugin(lilyDataGrid);
    Alpine.start();
    (window as unknown as { gridOptions: unknown }).gridOptions = {
        ...gridFixture,
        rowId: "id",
        selectionMode: "none",
        labels: { grid: "People" },
    };
    document.body.innerHTML = readFileSync("snippet.html", "utf8");
    await tick();
    await tick();
    await runPattern("grid", { root: document.body, hook: "data-grid", settle: tick });
});
