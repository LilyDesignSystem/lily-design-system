import { render, screen, fireEvent } from "@testing-library/svelte";
import { describe, expect, test, vi } from "vitest";

import KanbanBoard from "./KanbanBoard.svelte";
import type { KanbanCard, KanbanColumn, KanbanLabels } from "./KanbanBoard.svelte";

const COLUMNS: KanbanColumn[] = [
    { id: "todo", title: "To Do" },
    { id: "doing", title: "In Progress", wipLimit: 1 },
    { id: "done", title: "Done" },
];

const CARDS: KanbanCard[] = [
    { id: "c1", columnId: "todo", title: "Card One" },
    { id: "c2", columnId: "todo", title: "Card Two" },
    { id: "c3", columnId: "doing", title: "Card Three" },
    { id: "c4", columnId: "doing", title: "Card Four" },
];

const LABELS: KanbanLabels = {
    cardCount: (count) => `${count} cards`,
    overLimit: (count, limit) => `Over limit: ${count}/${limit}`,
    moveButton: (card) => `Move ${card.title}`,
    moveMenuLabel: "Move to column",
    moveAnnouncement: (title, column) => `${title} moved to ${column}`,
};

function bodyRows(): HTMLElement[] {
    return Array.from(document.querySelectorAll(".kanban-table-body .kanban-table-row"));
}

function tabbableCells(): Element[] {
    return Array.from(document.querySelectorAll('.kanban-table-td[tabindex="0"]'));
}

describe("KanbanBoard — markup (§8.1, §8.2, §8.3, §8.4)", () => {
    test("§8.1 renders a kanban-board root wrapping a role=grid labelled by `label`", () => {
        render(KanbanBoard, { props: { label: "Sprint board", columns: COLUMNS, cards: CARDS } });
        const root = document.querySelector(".kanban-board");
        expect(root).toBeTruthy();
        const grid = screen.getByRole("grid");
        expect(grid.getAttribute("aria-label")).toBe("Sprint board");
    });

    test("§8.2 renders column titles and, when labels.cardCount is set, a derived count", () => {
        render(KanbanBoard, { props: { label: "Sprint board", columns: COLUMNS, cards: CARDS, labels: LABELS } });
        expect(screen.getByText("To Do")).toBeTruthy();
        const headers = document.querySelectorAll(".kanban-table-th");
        expect(headers[0].textContent).toContain("2 cards");
        expect(headers[2].textContent).toContain("0 cards");
    });

    test("§8.2 no card count renders when labels.cardCount is absent", () => {
        render(KanbanBoard, { props: { label: "Sprint board", columns: COLUMNS, cards: CARDS } });
        expect(document.querySelector(".kanban-board-count")).toBeNull();
    });

    test("§8.3 a column over its wipLimit carries data-over-limit and the warning text", () => {
        render(KanbanBoard, { props: { label: "Sprint board", columns: COLUMNS, cards: CARDS, labels: LABELS } });
        const headers = document.querySelectorAll(".kanban-table-th");
        expect(headers[1].hasAttribute("data-over-limit")).toBe(true);
        expect(headers[1].textContent).toContain("Over limit: 2/1");
        expect(headers[0].hasAttribute("data-over-limit")).toBe(false);
        expect(headers[2].hasAttribute("data-over-limit")).toBe(false);
    });

    test("§8.4 the body is rectangular: row count equals the largest column's card count", () => {
        render(KanbanBoard, { props: { label: "Sprint board", columns: COLUMNS, cards: CARDS } });
        expect(bodyRows()).toHaveLength(2); // todo and doing both have 2 cards
        const doneCells = bodyRows().map((row) => row.querySelectorAll(".kanban-table-td")[2]);
        for (const cell of doneCells) {
            expect(cell.textContent?.trim()).toBe("");
        }
    });
});

describe("KanbanBoard — roving-tabindex keyboard navigation (§8.5, §8.6)", () => {
    test("§8.5 exactly one body cell carries tabindex=0, and arrows move it and clamp", async () => {
        render(KanbanBoard, { props: { label: "Sprint board", columns: COLUMNS, cards: CARDS } });
        expect(tabbableCells()).toHaveLength(1);
        expect(tabbableCells()[0].getAttribute("data-row")).toBe("0");
        expect(tabbableCells()[0].getAttribute("data-col")).toBe("0");

        await fireEvent.keyDown(tabbableCells()[0], { key: "ArrowRight" });
        expect(tabbableCells()[0].getAttribute("data-col")).toBe("1");

        // Clamp: ArrowUp past the first row stays on the first row.
        await fireEvent.keyDown(tabbableCells()[0], { key: "ArrowUp" });
        expect(tabbableCells()).toHaveLength(1);
        expect(tabbableCells()[0].getAttribute("data-row")).toBe("0");
    });

    test("§8.6 Home/End move within the column; Ctrl+Home/Ctrl+End move to the grid's ends", async () => {
        render(KanbanBoard, { props: { label: "Sprint board", columns: COLUMNS, cards: CARDS } });
        await fireEvent.keyDown(tabbableCells()[0], { key: "ArrowRight" });
        await fireEvent.keyDown(tabbableCells()[0], { key: "End" });
        expect(tabbableCells()[0].getAttribute("data-row")).toBe("1");
        expect(tabbableCells()[0].getAttribute("data-col")).toBe("1");

        await fireEvent.keyDown(tabbableCells()[0], { key: "Home", ctrlKey: true });
        expect(tabbableCells()[0].getAttribute("data-row")).toBe("0");
        expect(tabbableCells()[0].getAttribute("data-col")).toBe("0");

        await fireEvent.keyDown(tabbableCells()[0], { key: "End", ctrlKey: true });
        expect(tabbableCells()[0].getAttribute("data-row")).toBe("1");
        expect(tabbableCells()[0].getAttribute("data-col")).toBe("2");
    });
});

describe("KanbanBoard — move menu (§8.7, §8.8, §8.9)", () => {
    test("§8.7 Enter on a focused card opens its move menu", async () => {
        render(KanbanBoard, { props: { label: "Sprint board", columns: COLUMNS, cards: CARDS, labels: LABELS } });
        await fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
        const button = screen.getByRole("button", { name: "Move Card One" });
        expect(button.getAttribute("aria-expanded")).toBe("true");
        expect(screen.getByRole("listbox", { name: "Move to column" })).toBeTruthy();
        expect(screen.getAllByRole("option")).toHaveLength(3);
    });

    test("§8.8 choosing a destination calls onMove, closes the menu, and refocuses the move button", async () => {
        const onMove = vi.fn();
        render(KanbanBoard, {
            props: { label: "Sprint board", columns: COLUMNS, cards: CARDS, labels: LABELS, onMove },
        });
        await fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
        const doneOption = screen.getByRole("option", { name: "Done" });
        await fireEvent.click(doneOption);
        expect(onMove).toHaveBeenCalledWith("c1", "done");
        expect(screen.queryByRole("listbox")).toBeNull();
        expect(document.activeElement?.className).toContain("kanban-board-move-button");
    });

    test("§8.9 Escape closes the move menu without calling onMove", async () => {
        const onMove = vi.fn();
        render(KanbanBoard, {
            props: { label: "Sprint board", columns: COLUMNS, cards: CARDS, labels: LABELS, onMove },
        });
        await fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
        const listbox = screen.getByRole("listbox");
        await fireEvent.keyDown(listbox, { key: "Escape" });
        expect(onMove).not.toHaveBeenCalled();
        expect(screen.queryByRole("listbox")).toBeNull();
    });
});

describe("KanbanBoard — pointer drag-and-drop (§8.10)", () => {
    test("§8.10 dropping a card on another column's cell calls onMove", () => {
        const onMove = vi.fn();
        render(KanbanBoard, {
            props: { label: "Sprint board", columns: COLUMNS, cards: CARDS, onMove },
        });
        const dataTransfer = { setData: vi.fn(), getData: vi.fn(() => "c1") };
        const cardTitle = screen.getByText("Card One");
        fireEvent.dragStart(cardTitle, { dataTransfer });

        const doneCell = bodyRows()[0].querySelectorAll(".kanban-table-td")[2];
        fireEvent.drop(doneCell, { dataTransfer });
        expect(onMove).toHaveBeenCalledWith("c1", "done");
    });
});

describe("KanbanBoard — announcements and extra attributes (§8.11, §8.12)", () => {
    test("§8.11 a successful move announces via labels.moveAnnouncement", async () => {
        render(KanbanBoard, { props: { label: "Sprint board", columns: COLUMNS, cards: CARDS, labels: LABELS } });
        await fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
        await fireEvent.click(screen.getByRole("option", { name: "Done" }));
        expect(document.querySelector(".kanban-board-status")?.textContent).toBe("Card One moved to Done");
    });

    test("§8.11 no announcement fires when moveAnnouncement is absent", async () => {
        render(KanbanBoard, { props: { label: "Sprint board", columns: COLUMNS, cards: CARDS } });
        await fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
        await fireEvent.keyDown(document.activeElement!, { key: "Enter" });
        expect(document.querySelector(".kanban-board-status")?.textContent).toBe("");
    });

    test("§8.12 extra attributes spread onto the root", () => {
        render(KanbanBoard, { props: { label: "Sprint board", columns: COLUMNS, cards: CARDS, "data-testid": "board-root" } });
        expect(document.querySelector('[data-testid="board-root"]')).toBeTruthy();
    });
});
