import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { KanbanBoard } from "./kanban-board.js";
import type { KanbanCard, KanbanColumn, KanbanLabels } from "./kanban-board.js";

// Ensure the custom element is registered exactly once for the suite.
if (
    typeof customElements !== "undefined" &&
    !customElements.get("kanban-board")
) {
    customElements.define("kanban-board", KanbanBoard);
}

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

function mount(opts: {
    columns?: KanbanColumn[];
    cards?: KanbanCard[];
    labels?: KanbanLabels;
    label?: string;
    onMove?: (cardId: string, toColumnId: string) => void;
}): KanbanBoard {
    const el = document.createElement("kanban-board") as KanbanBoard;
    el.setAttribute("label", opts.label ?? "Sprint board");
    document.body.appendChild(el);
    el.columns = opts.columns ?? COLUMNS;
    el.cards = opts.cards ?? CARDS;
    if (opts.labels) el.labels = opts.labels;
    if (opts.onMove) el.onMove = opts.onMove;
    return el;
}

function bodyRows(): HTMLElement[] {
    return Array.from(document.querySelectorAll(".kanban-table-body .kanban-table-row"));
}

function tabbableCells(): HTMLElement[] {
    return Array.from(document.querySelectorAll('.kanban-table-td[tabindex="0"]'));
}

function press(el: Element, key: string, opts: KeyboardEventInit = {}): void {
    el.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...opts }));
}

function click(el: Element): void {
    el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
}

beforeEach(() => {
    document.body.replaceChildren();
});

afterEach(() => {
    document.body.replaceChildren();
});

describe("KanbanBoard — markup (§8.1, §8.2, §8.3, §8.4)", () => {
    test("§8.1 renders a kanban-board root wrapping a role=grid labelled by `label`", () => {
        mount({});
        expect(document.querySelector(".kanban-board")).toBeTruthy();
        const grid = document.querySelector('[role="grid"]')!;
        expect(grid.getAttribute("aria-label")).toBe("Sprint board");
    });

    test("§8.2 renders column titles and, when labels.cardCount is set, a derived count", () => {
        mount({ labels: LABELS });
        const headers = document.querySelectorAll(".kanban-table-th");
        expect(headers[0].textContent).toContain("To Do");
        expect(headers[0].textContent).toContain("2 cards");
        expect(headers[2].textContent).toContain("0 cards");
    });

    test("§8.2 no card count renders when labels.cardCount is absent", () => {
        mount({});
        expect(document.querySelector(".kanban-board-count")).toBeNull();
    });

    test("§8.3 a column over its wipLimit carries data-over-limit and the warning text", () => {
        mount({ labels: LABELS });
        const headers = document.querySelectorAll(".kanban-table-th");
        expect(headers[1].hasAttribute("data-over-limit")).toBe(true);
        expect(headers[1].textContent).toContain("Over limit: 2/1");
        expect(headers[0].hasAttribute("data-over-limit")).toBe(false);
        expect(headers[2].hasAttribute("data-over-limit")).toBe(false);
    });

    test("§8.4 the body is rectangular: row count equals the largest column's card count", () => {
        mount({});
        expect(bodyRows()).toHaveLength(2); // todo and doing both have 2 cards
        const doneCells = bodyRows().map((row) => row.querySelectorAll(".kanban-table-td")[2]);
        for (const cell of doneCells) {
            expect(cell.textContent?.trim()).toBe("");
        }
    });
});

describe("KanbanBoard — roving-tabindex keyboard navigation (§8.5, §8.6)", () => {
    test("§8.5 exactly one body cell carries tabindex=0, and arrows move it and clamp", () => {
        mount({});
        expect(tabbableCells()).toHaveLength(1);
        expect(tabbableCells()[0].getAttribute("data-row")).toBe("0");
        expect(tabbableCells()[0].getAttribute("data-col")).toBe("0");

        press(tabbableCells()[0], "ArrowRight");
        expect(tabbableCells()[0].getAttribute("data-col")).toBe("1");

        // Clamp: ArrowUp past the first row stays on the first row.
        press(tabbableCells()[0], "ArrowUp");
        expect(tabbableCells()).toHaveLength(1);
        expect(tabbableCells()[0].getAttribute("data-row")).toBe("0");
    });

    test("§8.6 Home/End move within the column; Ctrl+Home/Ctrl+End move to the grid's ends", () => {
        mount({});
        press(tabbableCells()[0], "ArrowRight");
        press(tabbableCells()[0], "End");
        expect(tabbableCells()[0].getAttribute("data-row")).toBe("1");
        expect(tabbableCells()[0].getAttribute("data-col")).toBe("1");

        press(tabbableCells()[0], "Home", { ctrlKey: true });
        expect(tabbableCells()[0].getAttribute("data-row")).toBe("0");
        expect(tabbableCells()[0].getAttribute("data-col")).toBe("0");

        press(tabbableCells()[0], "End", { ctrlKey: true });
        expect(tabbableCells()[0].getAttribute("data-row")).toBe("1");
        expect(tabbableCells()[0].getAttribute("data-col")).toBe("2");
    });
});

describe("KanbanBoard — move menu (§8.7, §8.8, §8.9)", () => {
    test("§8.7 Enter on a focused card opens its move menu", () => {
        mount({ labels: LABELS });
        press(tabbableCells()[0], "Enter");
        const button = document.querySelector('[aria-label="Move Card One"]')!;
        expect(button.getAttribute("aria-expanded")).toBe("true");
        const listbox = document.querySelector('[role="listbox"]')!;
        expect(listbox.getAttribute("aria-label")).toBe("Move to column");
        expect(document.querySelectorAll('[role="option"]')).toHaveLength(3);
    });

    test("§8.8 choosing a destination calls onMove, closes the menu, and refocuses the move button", () => {
        const onMove = vi.fn();
        mount({ labels: LABELS, onMove });
        press(tabbableCells()[0], "Enter");
        const doneOption = Array.from(document.querySelectorAll('[role="option"]')).find(
            (o) => o.textContent === "Done",
        )!;
        click(doneOption);
        expect(onMove).toHaveBeenCalledWith("c1", "done");
        expect(document.querySelector('[role="listbox"]')).toBeNull();
        expect((document.activeElement as HTMLElement)?.className).toContain("kanban-board-move-button");
        expect((document.activeElement as HTMLElement)?.getAttribute("aria-label")).toBe("Move Card One");
    });

    test("§8.9 Escape closes the move menu without calling onMove", () => {
        const onMove = vi.fn();
        mount({ labels: LABELS, onMove });
        press(tabbableCells()[0], "Enter");
        const listbox = document.querySelector('[role="listbox"]')!;
        press(listbox, "Escape");
        expect(onMove).not.toHaveBeenCalled();
        expect(document.querySelector('[role="listbox"]')).toBeNull();
    });
});

describe("KanbanBoard — move-menu button identity regression", () => {
    // Every other framework catalog's kanban-board port independently
    // found the same latent bug in the Svelte reference: a single shared
    // element reference for "the move button" refocuses whichever card's
    // button mounted LAST, not the card whose menu actually closed. This
    // proves the fix (#moveButtonEls keyed by card id) by opening and
    // closing two different cards' menus in sequence and checking DOM
    // identity, not just a CSS class.
    test("closing card A's menu refocuses card A's own button, not card B's", () => {
        mount({ labels: LABELS });
        const cardOneButton = document.querySelector('[aria-label="Move Card One"]') as HTMLButtonElement;

        // Open and close card One's menu via Escape.
        press(tabbableCells()[0], "Enter");
        press(document.querySelector('[role="listbox"]')!, "Escape");
        expect(document.activeElement).toBe(cardOneButton);

        // Move the roving-tabindex cursor to card Two's cell (row 1, col 0
        // — c2 is the second "todo" card) via the component's own keyboard
        // path, then open/close ITS menu.
        press(tabbableCells()[0], "ArrowDown");
        const cardTwoCell = tabbableCells()[0];
        expect(cardTwoCell.getAttribute("data-row")).toBe("1");
        expect(cardTwoCell.getAttribute("data-col")).toBe("0");
        const cardTwoButton = cardTwoCell.querySelector('[aria-label="Move Card Two"]') as HTMLButtonElement;
        expect(cardOneButton).not.toBe(cardTwoButton);

        press(cardTwoCell, "Enter");
        press(document.querySelector('[role="listbox"]')!, "Escape");
        // The bug would refocus cardOneButton (the last-bound shared ref
        // in a naive port) instead of cardTwoButton.
        expect(document.activeElement).toBe(cardTwoButton);
        expect(document.activeElement).not.toBe(cardOneButton);
    });
});

describe("KanbanBoard — pointer drag-and-drop (§8.10)", () => {
    test("§8.10 dropping a card on another column's cell calls onMove", () => {
        const onMove = vi.fn();
        mount({ onMove });
        const dataTransfer = { setData: vi.fn(), getData: vi.fn(() => "c1") };
        const cardTitle = document.querySelector(".kanban-board-card-title")!;
        cardTitle.dispatchEvent(
            Object.assign(new Event("dragstart", { bubbles: true, cancelable: true }), { dataTransfer }),
        );

        const doneCell = bodyRows()[0].querySelectorAll(".kanban-table-td")[2];
        doneCell.dispatchEvent(
            Object.assign(new Event("drop", { bubbles: true, cancelable: true }), { dataTransfer }),
        );
        expect(onMove).toHaveBeenCalledWith("c1", "done");
    });
});

describe("KanbanBoard — announcements and extra attributes (§8.11, §8.12)", () => {
    test("§8.11 a successful move announces via labels.moveAnnouncement", () => {
        mount({ labels: LABELS });
        press(tabbableCells()[0], "Enter");
        const doneOption = Array.from(document.querySelectorAll('[role="option"]')).find(
            (o) => o.textContent === "Done",
        )!;
        click(doneOption);
        expect(document.querySelector(".kanban-board-status")?.textContent).toBe("Card One moved to Done");
    });

    test("§8.11 no announcement fires when moveAnnouncement is absent", () => {
        mount({});
        press(tabbableCells()[0], "Enter");
        press(document.activeElement!, "Enter");
        expect(document.querySelector(".kanban-board-status")?.textContent).toBe("");
    });

    test("§8.12 the custom element itself already carries any extra HTML attribute a consumer sets (no forwarding needed)", () => {
        const el = document.createElement("kanban-board") as KanbanBoard;
        el.setAttribute("label", "Sprint board");
        el.setAttribute("data-testid", "board-root");
        document.body.appendChild(el);
        el.columns = COLUMNS;
        el.cards = CARDS;
        expect(document.querySelector('[data-testid="board-root"]')).toBe(el);
    });
});

describe("KanbanBoard — labels are the only source of user-facing strings (§8.13)", () => {
    test("§8.13 no move button accessible name, count, or warning renders without a label", () => {
        mount({});
        expect(document.querySelector(".kanban-board-count")).toBeNull();
        expect(document.querySelector(".kanban-board-wip-warning")).toBeNull();
        const moveButton = document.querySelector(".kanban-board-move-button")!;
        expect(moveButton.getAttribute("aria-label")).toBe("");
    });
});
