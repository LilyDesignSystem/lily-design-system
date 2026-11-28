import { render } from "@testing-library/svelte";
import { tick } from "svelte";
import { describe, expect, test } from "vitest";

import KanbanBoard from "./KanbanBoard.svelte";
import type { KanbanCard, KanbanColumn, KanbanLabels } from "./KanbanBoard.svelte";

// Large data and rapid change (tasks.md P50-T23): beyond the benchmarks, check that what is shown is still right. 1,000
// cards moved between columns 50 times in a row, never awaited: each column's count is the count of its cards at the end.

const COLUMNS: KanbanColumn[] = [
    { id: "todo", title: "To Do" },
    { id: "doing", title: "In Progress" },
    { id: "review", title: "Review" },
    { id: "done", title: "Done" },
];
const LABELS: Partial<KanbanLabels> = { cardCount: (count) => `${count} cards` };
const SIZE = 1_000;

const cardsAt = (round: number): KanbanCard[] =>
    Array.from({ length: SIZE }, (_, i) => ({
        id: `c${i}`,
        columnId: COLUMNS[(i * 7 + round * 3) % COLUMNS.length].id,
        title: `Card ${i}`,
    }));

describe("KanbanBoard under large data and rapid change (P50-T23)", () => {
    test("1,000 cards moved 50 times show the right count in every column", async () => {
        const { rerender } = render(KanbanBoard, {
            props: { label: "Board", columns: COLUMNS, cards: cardsAt(0), labels: LABELS },
        });
        await tick();
        const pending: Promise<void>[] = [];
        for (let round = 1; round <= 50; round++)
            pending.push(
                rerender({
                    label: "Board",
                    columns: COLUMNS,
                    cards: cardsAt(round),
                    labels: LABELS,
                }),
            );
        await Promise.all(pending);
        await tick();

        const last = cardsAt(50);
        const headers = Array.from(document.querySelectorAll(".kanban-table-th"));
        COLUMNS.forEach((column, i) => {
            const count = last.filter((card) => card.columnId === column.id).length;
            expect(headers[i].textContent).toContain(`${count} cards`);
        });
        // The first and the last card are drawn.
        const text = document.querySelector(".kanban-table-body")?.textContent ?? "";
        expect(text.includes("Card 999")).toBe(true);
        expect(text.includes("Card 0")).toBe(true);
    }, 60_000);
});
