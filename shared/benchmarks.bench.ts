// Performance benchmarks for the shared pure modules (tasks.md P35-T4), at the sizes the helpers meet: a 10,000-row data
// grid, a 1,000-task Gantt chart, a 5,000-option listbox. Run with bin/benchmark, which compares each result with
// shared/benchmark-baseline.json. Inputs are built once, outside the timed functions, and are deterministic.
// tinybench directly, inside one Vitest test (vitest.bench.config.ts), since Vitest 5 dropped its bench API; Vitest
// still resolves the modules' extensionless imports. Results go to reports/benchmark.json.
import { mkdirSync, writeFileSync } from "node:fs";
import { Bench } from "tinybench";
import { test } from "vitest";

import { criticalPath, type CriticalPathTask } from "./critical-path";
import { toCsv, toXlsx, type ExportTable } from "./export-data";
import { toPredicate, type FilterField, type FilterGroup } from "./filter-model";
import { listboxKeydown, initialListboxState } from "./listbox-machine";
import { highlightSegments, matchesSearch } from "./search-text";
import { findTypeaheadMatch } from "./typeahead";
import { yearOfDaysCells } from "./year-of-days-layout";

const WORDS = [
    "Amoxicillin",
    "Ibuprofen",
    "Paracétamol",
    "Metformin",
    "Lisinopril",
    "Atorvastatin",
    "Omeprazole",
    "Sertraline",
];
const word = (i: number) => WORDS[i % WORDS.length];

// A 10,000-row grid of eight columns: text, numbers, ISO dates.
const ROWS = Array.from({ length: 10_000 }, (_, i) => ({
    name: `${word(i)} ${word(i * 7)} ${i}`,
    dose: (i % 40) * 12.5,
    ward: `Ward ${i % 30}`,
    started: `2026-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
    status: i % 3 === 0 ? "active" : "stopped",
    prescriber: `Dr ${word(i * 3)}`,
    route: i % 2 ? "oral" : "intravenous",
    notes: `Reviewed on round ${i % 5}`,
}));
const TABLE: ExportTable = {
    headers: Object.keys(ROWS[0]),
    rows: ROWS.map((r) => Object.values(r)),
};
const ROW_TEXT = ROWS.map((r) => Object.values(r).join(" "));

const FIELDS: FilterField[] = [
    { id: "name", label: "Name", type: "text" },
    { id: "dose", label: "Dose", type: "number" },
    { id: "started", label: "Started", type: "date" },
    {
        id: "status",
        label: "Status",
        type: "select",
        options: [
            { id: "active", label: "Active" },
            { id: "stopped", label: "Stopped" },
        ],
    },
];
const FILTER: FilterGroup = {
    type: "group",
    id: "g",
    combinator: "and",
    children: [
        { type: "rule", id: "r1", field: "name", operator: "contains", value: "pro" },
        { type: "rule", id: "r2", field: "dose", operator: "between", value: 50, value2: 300 },
        {
            type: "group",
            id: "g2",
            combinator: "or",
            children: [
                { type: "rule", id: "r3", field: "status", operator: "in", value: ["active"] },
                { type: "rule", id: "r4", field: "started", operator: "gt", value: "2026-06-01" },
            ],
        },
    ],
};

// A 1,000-task plan: chains of ten, each chain after the one before, with a few cross links.
const TASKS: CriticalPathTask[] = Array.from({ length: 1_000 }, (_, i) => {
    const day = 1 + (i % 25);
    const dependsOn: CriticalPathTask["dependsOn"] & object =
        i % 10 === 0 ? (i >= 10 ? [`t${i - 10}`] : []) : [`t${i - 1}`];
    if (i % 37 === 0 && i > 50) dependsOn.push({ id: `t${i - 50}`, lag: 3 });
    return {
        id: `t${i}`,
        start: `2026-03-${String(day).padStart(2, "0")}`,
        end: `2026-03-${String(day + 2).padStart(2, "0")}`,
        dependsOn,
    };
});

const LABELS = Array.from({ length: 5_000 }, (_, i) => `${word(i)} ${i}`);

const CASES: [string, () => void, number?][] = [];
const group = (name: string, add: () => void) => {
    prefix = name;
    add();
};
let prefix = "";
const bench = (name: string, fn: () => void, options?: { iterations?: number }) => {
    CASES.push([`${prefix}: ${name}`, fn, options?.iterations]);
};

group("data grid, 10,000 rows", () => {
    bench("search: matchesSearch over every row", () => {
        let n = 0;
        for (const text of ROW_TEXT) if (matchesSearch(text, "para ward 1")) n++;
        if (n < 0) throw new Error("unreachable");
    });
    bench("search: highlightSegments on 1,000 rows", () => {
        for (let i = 0; i < 1_000; i++) highlightSegments(ROW_TEXT[i], "metformin ward");
    });
    bench("filter: toPredicate built once, applied to every row", () => {
        const keep = toPredicate(FILTER, FIELDS);
        let n = 0;
        for (const row of ROWS) if (keep(row)) n++;
        if (n < 0) throw new Error("unreachable");
    });
    bench("export: toCsv", () => {
        toCsv(TABLE);
    });
    bench(
        "export: toXlsx",
        () => {
            toXlsx(TABLE);
        },
        { iterations: 5 },
    );
});

group("Gantt chart, 1,000 tasks", () => {
    bench("criticalPath", () => {
        criticalPath(TASKS);
    });
    bench("criticalPath, working days", () => {
        criticalPath(TASKS, { lagUnit: "working-days", weekends: [5, 6] });
    });
});

group("listbox, 5,000 options", () => {
    // A prefix nothing starts with: the full scan, the worst case.
    bench("type-ahead: findTypeaheadMatch with no match", () => {
        findTypeaheadMatch(LABELS, 0, "zz");
    });
    bench("keys: 1,000 ArrowDown transitions", () => {
        let state = initialListboxState(0);
        for (let i = 0; i < 1_000; i++) {
            state = listboxKeydown(
                state,
                { key: "ArrowDown" },
                { labels: LABELS, focusedIndex: state.activeIndex },
            ).state;
        }
    });
});

group("year of days", () => {
    bench("yearOfDaysCells for a leap year", () => {
        yearOfDaysCells(2028, 1);
    });
});

test("benchmarks", { timeout: 600_000 }, async () => {
    const results: Record<string, { mean: number; p99: number; samples: number }> = {};
    for (const [name, fn, iterations] of CASES) {
        const b = new Bench({ time: 500, warmupTime: 100, iterations: iterations ?? 10 });
        b.add(name, fn);
        await b.run();
        const latency = b.tasks[0].result?.latency;
        const error = (b.tasks[0].result as { error?: unknown } | undefined)?.error;
        if (!latency) throw new Error(`${name}: no result: ${String(error)}`);
        results[name] = {
            mean: latency.mean,
            p99: latency.p99 ?? latency.max,
            samples: latency.samples?.length ?? 0,
        };
    }
    mkdirSync("reports", { recursive: true });
    writeFileSync("reports/benchmark.json", JSON.stringify(results, null, 2) + "\n");
});
