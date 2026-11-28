import { render } from "@testing-library/svelte";
import { tick } from "svelte";
import { describe, expect, test } from "vitest";

import GanttChart, { addDays } from "./GanttChart.svelte";
import type { GanttTask } from "./GanttChart.svelte";

// Large data and rapid change (tasks.md P50-T23): beyond the benchmarks, which time these sizes, check that what is shown is
// still right. 300 tasks, one of them moved 20 times in a row, never awaited: every row is drawn, in order, and the moved
// task's bar covers exactly its last dates.

const RANGE = { start: "2026-10-01", end: "2026-10-31" };
// 300 tasks, not 1,000: in jsdom each change redraws every row (about 3 seconds a change at 1,000 tasks, tasks.md
// P50-T23), which bin/benchmark --suite render is the place to time.
const SIZE = 300;

function makeTasks(): GanttTask[] {
    return Array.from({ length: SIZE }, (_, i) => {
        const start = addDays(RANGE.start, i % 25);
        return {
            id: `t${i}`,
            label: `Task ${String(i).padStart(4, "0")}`,
            start,
            end: addDays(start, (i % 5) + 1),
        };
    });
}

const rows = () => Array.from(document.querySelectorAll(".gantt-table-tbody > .gantt-table-tr"));

describe("GanttChart under large data and rapid change (P50-T23)", () => {
    test("300 tasks, one moved 20 times, draw every row and the last dates", async () => {
        const tasks = makeTasks();
        const { rerender } = render(GanttChart, { props: { label: "Plan", tasks, range: RANGE } });
        await tick();
        expect(rows()).toHaveLength(SIZE);

        let latest = tasks;
        const pending: Promise<void>[] = [];
        for (let i = 0; i < 20; i++) {
            const start = addDays(RANGE.start, i % 20);
            latest = latest.map((t) =>
                t.id === "t150" ? { ...t, start, end: addDays(start, 3) } : t,
            );
            pending.push(rerender({ label: "Plan", tasks: latest, range: RANGE }));
        }
        await Promise.all(pending);
        await tick();

        const all = rows();
        expect(all).toHaveLength(SIZE);
        expect(all[0].textContent).toContain("Task 0000");
        expect(all[SIZE - 1].textContent).toContain("Task 0299");
        const moved = all.find((row) => row.textContent?.includes("Task 0150")) as Element;
        // The last move: start on day 19 (index 19), four days long, so four cells in range.
        expect(moved.querySelectorAll('[data-in-range="true"], [data-in-range=""]').length).toBe(4);
    }, 60_000);
});
