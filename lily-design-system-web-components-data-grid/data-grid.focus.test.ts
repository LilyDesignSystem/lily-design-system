// Focus follows the record, and an unknown total (spec/index.md §8.150–§8.151).
import { afterEach, describe, expect, test } from "vitest";

import { DataGrid } from "./data-grid.js";
import type { DataGridColumn, DataGridRow } from "./data-grid.js";

if (!customElements.get("lily-data-grid")) customElements.define("lily-data-grid", DataGrid);

const COLUMNS: DataGridColumn[] = [{ id: "name", header: "Name" }];
const PEOPLE = [
    { id: "a", name: "Ann" },
    { id: "b", name: "Bob" },
    { id: "c", name: "Cara" },
];
let grid: DataGrid;

function mount(rows: DataGridRow[], attrs: Record<string, string> = {}): DataGrid {
    grid = document.createElement("lily-data-grid") as DataGrid;
    grid.setAttribute("label", "People");
    for (const [k, v] of Object.entries(attrs)) grid.setAttribute(k, v);
    grid.columns = COLUMNS;
    grid.rowId = (row: DataGridRow) => String(row.id);
    grid.rows = rows;
    document.body.append(grid);
    return grid;
}
const active = () =>
    grid.querySelector<HTMLElement>('.data-table-td[tabindex="0"], .data-table-th[tabindex="0"]')!;
const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

afterEach(() => {
    grid?.remove();
});

describe("DataGrid — focus follows the record (§8.150–§8.151)", () => {
    test("§8.150 when the rows change order, the roving cell stays on the same record", async () => {
        mount(PEOPLE);
        await settle();
        [...grid.querySelectorAll<HTMLElement>(".data-table-body .data-table-td")]
            .find((td) => td.textContent?.includes("Bob"))!
            .focus();
        await settle();
        expect(active().textContent).toContain("Bob");
        grid.rows = [PEOPLE[2], PEOPLE[0], PEOPLE[1]];
        await settle();
        expect(active().textContent).toContain("Bob");
        expect(document.activeElement?.textContent).toContain("Bob");
    });

    test("§8.151 row-count-unknown sets aria-rowcount to -1", async () => {
        mount(PEOPLE, { "row-count-unknown": "" });
        await settle();
        expect(grid.querySelector('[role="grid"]')!.getAttribute("aria-rowcount")).toBe("-1");
    });
});

describe("DataGrid — a coverage statement (§8.152)", () => {
    test("§8.152 coverageLabel is shown above the rows and is the table's description", async () => {
        mount([], {
            "coverage-label":
                "Results from the last 12 months, newest first. The laboratory system did not answer.",
        });
        await settle();
        const coverage = document.querySelector(".data-grid-coverage") as HTMLElement;
        expect(coverage.textContent?.trim()).toBe(
            "Results from the last 12 months, newest first. The laboratory system did not answer.",
        );
        const table = document.querySelector("table.data-table") as HTMLElement;
        expect(
            coverage.compareDocumentPosition(table) & Node.DOCUMENT_POSITION_FOLLOWING,
        ).toBeTruthy();
        expect(table.getAttribute("aria-describedby")).toBe(coverage.id);
    });
});
