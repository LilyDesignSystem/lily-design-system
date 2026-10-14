import { render, screen, fireEvent, waitFor } from "@testing-library/svelte";
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
    test("§8.5 the roving tab stop is not announced as selection: no cell carries aria-selected", () => {
        render(KanbanBoard, { props: { label: "Sprint board", columns: COLUMNS, cards: CARDS } });
        expect(tabbableCells()).toHaveLength(1);
        expect(document.querySelectorAll("td[aria-selected]")).toHaveLength(0);
    });

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
        // That card's own button: every card used to bind one shared ref, so focus
        // went to whichever card rendered last.
        await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("button", { name: "Move Card One" })));
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
        const listbox = await screen.findByRole("listbox");
        await fireEvent.keyDown(listbox, { key: "ArrowDown" });
        await fireEvent.keyDown(listbox, { key: "Enter" });
        expect(document.querySelector(".kanban-board-status")?.textContent).toBe("");
    });

    test("§8.12 extra attributes spread onto the root", () => {
        render(KanbanBoard, { props: { label: "Sprint board", columns: COLUMNS, cards: CARDS, "data-testid": "board-root" } });
        expect(document.querySelector('[data-testid="board-root"]')).toBeTruthy();
    });
});

describe("KanbanBoard — focus, tab stop and move edge cases", () => {
    const moved = (cards: KanbanCard[], id: string, columnId: string) =>
        cards.map((c) => (c.id === id ? { ...c, columnId } : c));

    test("§8.8 after a move, focus and the tab stop follow the card to its new column", async () => {
        let cards = CARDS;
        const { rerender } = render(KanbanBoard, {
            props: {
                label: "Sprint board",
                columns: COLUMNS,
                cards,
                labels: LABELS,
                onMove: (id: string, col: string) => {
                    cards = moved(cards, id, col);
                    void rerender({ cards });
                },
            },
        });
        await fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
        await fireEvent.click(screen.getByRole("option", { name: "Done" }));
        await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("button", { name: "Move Card One" })));
        expect(tabbableCells()).toHaveLength(1);
        expect(tabbableCells()[0].getAttribute("data-col")).toBe("2");
    });

    test("§8.5 keys pressed in the open move menu do not move the grid cursor or focus", async () => {
        render(KanbanBoard, { props: { label: "Sprint board", columns: COLUMNS, cards: CARDS, labels: LABELS } });
        await fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
        const listbox = await screen.findByRole("listbox");
        await waitFor(() => expect(document.activeElement).toBe(listbox));
        await fireEvent.keyDown(listbox, { key: "ArrowDown" });
        await fireEvent.keyDown(listbox, { key: "ArrowRight" });
        expect(tabbableCells()[0].getAttribute("data-col")).toBe("0");
        await waitFor(() => expect(document.activeElement).toBe(listbox));
    });

    test("§8.8 choosing a destination in the menu does not reopen it", async () => {
        render(KanbanBoard, { props: { label: "Sprint board", columns: COLUMNS, cards: CARDS, labels: LABELS } });
        await fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
        const listbox = await screen.findByRole("listbox");
        await fireEvent.keyDown(listbox, { key: "ArrowDown" });
        await fireEvent.keyDown(listbox, { key: "Enter" });
        await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull());
    });

    test("§8.8 choosing the card's own column, or dropping it there, is not a move", async () => {
        const onMove = vi.fn();
        render(KanbanBoard, { props: { label: "Sprint board", columns: COLUMNS, cards: CARDS, labels: LABELS, onMove } });
        await fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
        await fireEvent.click(screen.getByRole("option", { name: "To Do" }));
        expect(screen.queryByRole("listbox")).toBeNull();
        expect(document.querySelector(".kanban-board-status")?.textContent).toBe("");

        const dataTransfer = { setData: vi.fn(), getData: vi.fn(() => "c1") };
        fireEvent.dragStart(screen.getByText("Card One"), { dataTransfer });
        fireEvent.drop(bodyRows()[1].querySelectorAll(".kanban-table-td")[0], { dataTransfer });
        expect(onMove).not.toHaveBeenCalled();
    });

    test("§8.5 when the board shrinks under the cursor, one cell stays tabbable", async () => {
        const { rerender } = render(KanbanBoard, { props: { label: "Sprint board", columns: COLUMNS, cards: CARDS } });
        await fireEvent.keyDown(tabbableCells()[0], { key: "End" });
        expect(tabbableCells()[0].getAttribute("data-row")).toBe("1");
        await rerender({ cards: CARDS.filter((c) => c.id !== "c2" && c.id !== "c4") });
        expect(bodyRows()).toHaveLength(1);
        expect(tabbableCells()).toHaveLength(1);
    });

    test("§8.5 focusing a cell by pointer moves the cursor there", async () => {
        render(KanbanBoard, { props: { label: "Sprint board", columns: COLUMNS, cards: CARDS } });
        const cell = bodyRows()[1].querySelectorAll<HTMLElement>(".kanban-table-td")[1];
        cell.focus();
        await waitFor(() => expect(tabbableCells()).toEqual([cell]));
        await fireEvent.keyDown(cell, { key: "ArrowUp" });
        expect(tabbableCells()[0].getAttribute("data-row")).toBe("0");
        expect(tabbableCells()[0].getAttribute("data-col")).toBe("1");
    });

    test("§8.13 without labels.moveButton there is no unnamed button; the menu is named by the card and Escape refocuses the cell", async () => {
        render(KanbanBoard, { props: { label: "Sprint board", columns: COLUMNS, cards: CARDS } });
        expect(document.querySelector(".kanban-board-move-button")).toBeNull();
        const cell = tabbableCells()[0] as HTMLElement;
        await fireEvent.keyDown(cell, { key: "Enter" });
        const listbox = await screen.findByRole("listbox", { name: "Card One" });
        await fireEvent.keyDown(listbox, { key: "Escape" });
        await waitFor(() => expect(document.activeElement).toBe(cell));
    });

    test("§8.3 a column exactly at its wipLimit is not over it", () => {
        render(KanbanBoard, {
            props: { label: "Sprint board", columns: COLUMNS, cards: CARDS.filter((c) => c.id !== "c4"), labels: LABELS },
        });
        expect(document.querySelectorAll(".kanban-table-th")[1].hasAttribute("data-over-limit")).toBe(false);
    });
});

describe("KanbanBoard — reorder, veto and read-only (§8.17–§8.21)", () => {
    test("§8.17 Alt+ArrowDown reorders the card within its column via onReorder and announces it", async () => {
        const onReorder = vi.fn();
        const labels: KanbanLabels = { reorderAnnouncement: (t, p, n) => `${t} is ${p} of ${n}` };
        render(KanbanBoard, { props: { label: "Sprint board", columns: COLUMNS, cards: CARDS, onReorder, labels } });
        await fireEvent.keyDown(tabbableCells()[0], { key: "ArrowDown", altKey: true });
        expect(onReorder).toHaveBeenCalledWith("c1", 1);
        expect(document.querySelector(".kanban-board-status")?.textContent).toBe("Card One is 2 of 2");
    });

    test("§8.18 Alt+Arrow at the column's edge, or on an empty cell, does not call onReorder", async () => {
        const onReorder = vi.fn();
        render(KanbanBoard, { props: { label: "Sprint board", columns: COLUMNS, cards: CARDS, onReorder } });
        await fireEvent.keyDown(tabbableCells()[0], { key: "ArrowUp", altKey: true });
        expect(onReorder).not.toHaveBeenCalled();
    });

    test("§8.19 canMove refuses a move: no onMove, an announcement, and the option is aria-disabled", async () => {
        const onMove = vi.fn();
        const labels: KanbanLabels = { ...LABELS, moveBlocked: (t, c) => `${t} cannot go to ${c}` };
        render(KanbanBoard, {
            props: {
                label: "Sprint board", columns: COLUMNS, cards: CARDS, onMove, labels,
                canMove: (_c: KanbanCard, to: KanbanColumn) => to.id !== "done",
            },
        });
        await fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
        const option = screen.getByRole("option", { name: "Done" });
        expect(option.getAttribute("aria-disabled")).toBe("true");
        await fireEvent.click(option);
        expect(onMove).not.toHaveBeenCalled();
        expect(document.querySelector(".kanban-board-status")?.textContent).toBe("Card One cannot go to Done");
    });

    test("§8.20 readonly: no move button, Enter opens no menu, cards are not draggable, no reorder", async () => {
        const onReorder = vi.fn();
        render(KanbanBoard, {
            props: { label: "Sprint board", columns: COLUMNS, cards: CARDS, labels: LABELS, readonly: true, onReorder },
        });
        expect(document.querySelector(".kanban-board-move-button")).toBeNull();
        await fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
        expect(screen.queryByRole("listbox")).toBeNull();
        await fireEvent.keyDown(tabbableCells()[0], { key: "ArrowDown", altKey: true });
        expect(onReorder).not.toHaveBeenCalled();
        expect(document.querySelector("[draggable='true']")).toBeNull();
        expect(document.querySelector(".kanban-board")!.hasAttribute("data-readonly")).toBe(true);
    });

    test("§8.21 readonly still allows arrow-key navigation", async () => {
        render(KanbanBoard, { props: { label: "Sprint board", columns: COLUMNS, cards: CARDS, readonly: true } });
        await fireEvent.keyDown(tabbableCells()[0], { key: "ArrowRight" });
        expect(tabbableCells()[0].getAttribute("data-col")).toBe("1");
    });
});

describe("KanbanBoard — collapse, add card, hard limits (§8.22–§8.30)", () => {
    const base = { label: "Sprint board", columns: COLUMNS, cards: CARDS };
    const cells = () => Array.from(document.querySelectorAll<HTMLElement>(".kanban-table-td"));
    const toggle = (name: string) => screen.getByRole("button", { name });

    test("§8.22 collapseColumn gates a toggle in each header; without it none renders", () => {
        render(KanbanBoard, { props: { ...base } });
        expect(document.querySelector(".kanban-board-collapse-button")).toBeNull();
    });

    test("§8.23 the toggle collapses a column: aria-expanded flips, its cards are not rendered, its count remains", async () => {
        const labels: KanbanLabels = { ...LABELS, collapseColumn: (c, collapsed) => `${collapsed ? "Expand" : "Collapse"} ${c.title}` };
        render(KanbanBoard, { props: { ...base, labels } });
        expect(toggle("Collapse To Do").getAttribute("aria-expanded")).toBe("true");
        expect(screen.getByText("Card One")).toBeTruthy();
        await fireEvent.click(toggle("Collapse To Do"));
        expect(toggle("Expand To Do").getAttribute("aria-expanded")).toBe("false");
        expect(screen.queryByText("Card One")).toBeNull();
        expect(document.querySelectorAll(".kanban-table-th")[0].textContent).toContain("2 cards");
        expect(document.querySelectorAll(".kanban-table-th")[0].hasAttribute("data-collapsed")).toBe(true);
    });

    test("§8.24 collapsedColumns starts a column collapsed, and cells of a collapsed column carry data-collapsed", () => {
        render(KanbanBoard, { props: { ...base, collapsedColumns: ["todo"], labels: LABELS } });
        expect(screen.queryByText("Card One")).toBeNull();
        expect(cells().filter((c) => c.dataset.col === "0").every((c) => c.hasAttribute("data-collapsed"))).toBe(true);
    });

    test("§8.25 the board's height ignores collapsed columns", () => {
        const { unmount } = render(KanbanBoard, { props: { ...base } });
        expect(bodyRows()).toHaveLength(2);
        unmount();
        render(KanbanBoard, { props: { ...base, collapsedColumns: ["todo", "doing"] } });
        expect(bodyRows()).toHaveLength(0);
    });

    test("§8.26 addCard gates an add button per column that fires onAddCard with the column id", async () => {
        const onAddCard = vi.fn();
        const labels: KanbanLabels = { addCard: (c) => `Add to ${c.title}` };
        render(KanbanBoard, { props: { ...base, labels, onAddCard } });
        await fireEvent.click(screen.getByRole("button", { name: "Add to In Progress" }));
        expect(onAddCard).toHaveBeenCalledWith("doing");
    });

    test("§8.27 no add button without labels.addCard, and none when readonly", () => {
        const a = render(KanbanBoard, { props: { ...base } });
        expect(document.querySelector(".kanban-board-add-button")).toBeNull();
        a.unmount();
        render(KanbanBoard, { props: { ...base, readonly: true, labels: { addCard: (c: KanbanColumn) => `Add to ${c.title}` } } });
        expect(document.querySelector(".kanban-board-add-button")).toBeNull();
    });

    test("§8.28 strictLimit refuses a move into a full column, announces it, and marks the option aria-disabled", async () => {
        const onMove = vi.fn();
        const columns: KanbanColumn[] = [
            { id: "todo", title: "To Do" },
            { id: "doing", title: "In Progress", wipLimit: 2, strictLimit: true },
        ];
        const labels: KanbanLabels = { ...LABELS, moveBlocked: (t, c) => `${t} cannot go to ${c}` };
        render(KanbanBoard, { props: { ...base, columns, onMove, labels } });
        await fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
        const option = screen.getByRole("option", { name: "In Progress" });
        expect(option.getAttribute("aria-disabled")).toBe("true");
        await fireEvent.click(option);
        expect(onMove).not.toHaveBeenCalled();
        expect(document.querySelector(".kanban-board-status")?.textContent).toBe("Card One cannot go to In Progress");
    });

    test("§8.29 strictLimit allows a move while the column is under its limit", async () => {
        const onMove = vi.fn();
        const columns: KanbanColumn[] = [
            { id: "todo", title: "To Do" },
            { id: "doing", title: "In Progress", wipLimit: 3, strictLimit: true },
        ];
        render(KanbanBoard, { props: { ...base, columns, onMove, labels: LABELS } });
        await fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
        await fireEvent.click(screen.getByRole("option", { name: "In Progress" }));
        expect(onMove).toHaveBeenCalledWith("c1", "doing");
    });

    test("§8.30 without strictLimit a full column still accepts moves (the WIP limit is only a warning)", async () => {
        const onMove = vi.fn();
        render(KanbanBoard, { props: { ...base, onMove, labels: LABELS } });
        await fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
        await fireEvent.click(screen.getByRole("option", { name: "In Progress" }));
        expect(onMove).toHaveBeenCalledWith("c1", "doing");
    });
});
