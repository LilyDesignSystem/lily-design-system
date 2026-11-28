import { render } from "@testing-library/svelte";
import { tick } from "svelte";
import { describe, expect, test } from "vitest";

import DataGrid from "./DataGrid.svelte";
import type { DataGridColumn, DataGridLabels, DataGridRow } from "./DataGrid.svelte";

// Large data and rapid change (tasks.md P50-T23): beyond the benchmarks, which time these sizes, check that what is shown is
// still right. 10,000 rows replaced 30 times in a row, with the sort and the filter changing between, never awaited: the
// page shown at the end is exactly the expected one, and its status counts are right.

const COLUMNS: DataGridColumn[] = [
    { id: "name", header: "Name", sortable: true, filterable: true },
    { id: "ward", header: "Ward", sortable: true },
];
const LABELS: Partial<DataGridLabels> = {
    pageStatus: (page, pageCount, rowCount) => `Page ${page} of ${pageCount} (${rowCount})`,
};
const SIZE = 10_000;
const PAGE = 25;

// A small deterministic generator, so a failure can be replayed.
function random(seed: number) {
    let s = seed >>> 0;
    return () => {
        s = (s * 1664525 + 1013904223) >>> 0;
        return s / 2 ** 32;
    };
}

// Zero-padded names sort by code point the way a person reads them, so no locale is needed.
function makeRows(seed: number): DataGridRow[] {
    const next = random(seed);
    return Array.from({ length: SIZE }, (_, i) => ({
        id: i,
        name: `Patient ${String(Math.floor(next() * 100_000)).padStart(5, "0")}`,
        ward: `Ward ${(i % 12) + 1}`,
    }));
}

const shownNames = () =>
    Array.from(document.querySelectorAll(".data-table-body .data-table-row")).map(
        (row) => row.querySelector(".data-table-td")?.textContent?.trim() ?? "",
    );

describe("DataGrid under large data and rapid change (P50-T23)", () => {
    test("30 replacements of 10,000 rows, with sort and filter changing, show the right page", async () => {
        const base = {
            label: "Patients",
            columns: COLUMNS,
            pageSize: PAGE,
            labels: LABELS,
            rowId: (r: DataGridRow) => String(r.id),
        };
        const { rerender } = render(DataGrid, { props: { ...base, rows: makeRows(1) } });
        await tick();

        let last = {
            rows: makeRows(1),
            filter: "",
            direction: "ascending" as "ascending" | "descending",
        };
        const pending: Promise<void>[] = [];
        for (let i = 2; i <= 31; i++) {
            last = {
                rows: makeRows(i),
                filter: i % 3 === 0 ? "Patient 1" : i % 3 === 1 ? "" : "Patient 0",
                direction: i % 2 ? "ascending" : "descending",
            };
            // Not awaited one by one: each change lands before the last has settled.
            pending.push(
                rerender({
                    ...base,
                    rows: last.rows,
                    filter: last.filter,
                    sort: { columnId: "name", direction: last.direction },
                }),
            );
        }
        await Promise.all(pending);
        await tick();

        const matching = last.rows
            .map((r) => String(r.name))
            .filter((name) => name.toLowerCase().includes(last.filter.toLowerCase()))
            .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
        if (last.direction === "descending") matching.reverse();

        expect(shownNames()).toEqual(matching.slice(0, PAGE));
        expect(document.querySelector(".data-grid-page-status")?.textContent).toBe(
            `Page 1 of ${Math.ceil(matching.length / PAGE)} (${matching.length})`,
        );
    }, 60_000);

    test("a row changed 200 times in a row shows its last value", async () => {
        const rows = makeRows(7);
        const base = {
            label: "Patients",
            columns: COLUMNS,
            pageSize: PAGE,
            labels: LABELS,
            rowId: (r: DataGridRow) => String(r.id),
            sort: { columnId: "name", direction: "ascending" as const },
        };
        const { rerender } = render(DataGrid, { props: { ...base, rows } });
        await tick();
        const pending: Promise<void>[] = [];
        let latest = rows;
        for (let i = 0; i < 200; i++) {
            latest = latest.map((r) =>
                r.id === 42 ? { ...r, name: `Patient 00000-${String(i).padStart(3, "0")}` } : r,
            );
            pending.push(rerender({ ...base, rows: latest }));
        }
        await Promise.all(pending);
        await tick();
        // Sorted ascending, the renamed record is first, with its last name.
        expect(shownNames()[0]).toBe("Patient 00000-199");
        expect(shownNames()).toHaveLength(PAGE);
    }, 60_000);
});
