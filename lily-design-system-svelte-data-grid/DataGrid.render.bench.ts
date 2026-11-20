// Render benchmarks for the data grid (tasks.md P38-T8): mounting, sorting and replacing rows at the sizes the grid
// meets, 1,000 rows drawn in full and 10,000 virtualized. Run with bin/benchmark, which compares each mean with
// render-benchmark-baseline.json. jsdom, not a browser: there is no layout or paint, so a time here is the component's
// own work (the reactive graph and the DOM it builds), which is what a regression in the component changes.
// tinybench inside one Vitest test (vitest.bench.config.ts), as shared/benchmarks.bench.ts does. Results go to
// reports/render-benchmark.json.
import { cleanup, fireEvent, render, screen } from "@testing-library/svelte";
import { tick } from "svelte";
import { mkdirSync, writeFileSync } from "node:fs";
import { Bench } from "tinybench";
import { test } from "vitest";

import DataGrid from "./DataGrid.svelte";
import type { DataGridColumn } from "./DataGrid.svelte";

const COLUMNS: DataGridColumn[] = [
    { id: "name", header: "Name", sortable: true },
    { id: "dose", header: "Dose", sortable: true },
    { id: "ward", header: "Ward", sortable: true },
    { id: "started", header: "Started", sortable: true },
    { id: "status", header: "Status" },
    { id: "route", header: "Route" },
];

const WORDS = [
    "Amoxicillin",
    "Ibuprofen",
    "Paracétamol",
    "Metformin",
    "Lisinopril",
    "Atorvastatin",
];
const rows = (n: number, seed = 0) =>
    Array.from({ length: n }, (_, i) => ({
        id: `r${i}`,
        name: `${WORDS[(i + seed) % WORDS.length]} ${i}`,
        dose: ((i * 7 + seed) % 40) * 12.5,
        ward: `Ward ${(i + seed) % 30}`,
        started: `2026-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
        status: i % 3 === 0 ? "active" : "stopped",
        route: i % 2 ? "oral" : "intravenous",
    }));

const ROWS_1K = rows(1_000);
const ROWS_10K = rows(10_000);
const ROWS_10K_NEXT = rows(10_000, 1);
const VIRTUALIZE = { rowHeight: 32, height: 480 };

type Case = { name: string; fn: () => Promise<void> | void; setup?: () => Promise<void> | void };

let rerender: ((props: Record<string, unknown>) => Promise<void>) | undefined;

const CASES: Case[] = [
    {
        name: "mount, 1,000 rows",
        fn: () => {
            render(DataGrid, { props: { label: "Medicines", columns: COLUMNS, rows: ROWS_1K } });
            cleanup();
        },
    },
    {
        name: "mount, 10,000 rows, virtualized",
        fn: () => {
            render(DataGrid, {
                props: {
                    label: "Medicines",
                    columns: COLUMNS,
                    rows: ROWS_10K,
                    virtualize: VIRTUALIZE,
                },
            });
            cleanup();
        },
    },
    {
        name: "sort ascending, descending and back, 10,000 rows, virtualized",
        setup: () => {
            cleanup();
            render(DataGrid, {
                props: {
                    label: "Medicines",
                    columns: COLUMNS,
                    rows: ROWS_10K,
                    virtualize: VIRTUALIZE,
                },
            });
        },
        // Three clicks move the Dose sort through ascending, descending and none, so every iteration starts unsorted:
        // one click a time made the mean depend on which state the run happened to stop in.
        fn: async () => {
            for (let i = 0; i < 3; i++) {
                await fireEvent.click(screen.getByRole("button", { name: "Dose" }));
                await tick();
            }
        },
    },
    {
        name: "replace every row, 10,000 rows, virtualized",
        setup: () => {
            cleanup();
            const r = render(DataGrid, {
                props: {
                    label: "Medicines",
                    columns: COLUMNS,
                    rows: ROWS_10K,
                    virtualize: VIRTUALIZE,
                },
            });
            rerender = async (props) => {
                await r.rerender(props);
            };
        },
        fn: async () => {
            await rerender!({ rows: ROWS_10K_NEXT });
            await rerender!({ rows: ROWS_10K });
        },
    },
];

test("render benchmarks", { timeout: 600_000 }, async () => {
    const results: Record<string, { mean: number; p99: number; samples: number }> = {};
    for (const { name, fn, setup } of CASES) {
        if (setup) await setup();
        const b = new Bench({ time: 1_000, warmupTime: 200, iterations: 10 });
        b.add(name, fn);
        await b.run();
        // An aborted or failed task has no latency, so the result type is a union; read it as the fields used here.
        const result = b.tasks[0].result as
            | {
                  latency?: { mean: number; p99?: number; max: number; samples?: number[] };
                  error?: unknown;
              }
            | undefined;
        const latency = result?.latency;
        const error = result?.error;
        if (!latency) throw new Error(`${name}: no result: ${String(error)}`);
        results[name] = {
            mean: latency.mean,
            p99: latency.p99 ?? latency.max,
            samples: latency.samples?.length ?? 0,
        };
        cleanup();
    }
    mkdirSync("reports", { recursive: true });
    writeFileSync("reports/render-benchmark.json", JSON.stringify(results, null, 2) + "\n");
});
