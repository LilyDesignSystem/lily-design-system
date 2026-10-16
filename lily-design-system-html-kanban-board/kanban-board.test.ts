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
    test("§8.5 the roving tab stop is not announced as selection: no cell carries aria-selected", () => {
        mount({});
        expect(tabbableCells()).toHaveLength(1);
        expect(document.querySelectorAll("td[aria-selected]")).toHaveLength(0);
    });

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
        press(document.activeElement!, "ArrowDown");
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
        // No unnamed button: without labels.moveButton there is none at all.
        expect(document.querySelector(".kanban-board-move-button")).toBeNull();
    });
});

describe("KanbanBoard — focus, tab stop and move edge cases", () => {
    function option(name: string): HTMLElement {
        return Array.from(document.querySelectorAll<HTMLElement>(".kanban-board-move-option")).find(
            (el) => el.textContent?.trim() === name,
        )!;
    }

    function list(): HTMLElement | null {
        return document.querySelector<HTMLElement>(".kanban-board-move-list");
    }

    function moveButton(name: string): HTMLElement | null {
        return document.querySelector<HTMLElement>(`.kanban-board-move-button[aria-label="${name}"]`);
    }

    function dragEvent(type: string, dataTransfer: unknown): Event {
        const event = new Event(type, { bubbles: true, cancelable: true });
        Object.defineProperty(event, "dataTransfer", { value: dataTransfer });
        return event;
    }

    test("§8.8 after a move, focus and the tab stop follow the card to its new column", () => {
        const el = mount({ labels: LABELS });
        el.onMove = (id, columnId) => {
            el.cards = CARDS.map((c) => (c.id === id ? { ...c, columnId } : c));
        };
        press(tabbableCells()[0], "Enter");
        click(option("Done"));
        expect(document.activeElement).toBe(moveButton("Move Card One"));
        expect(tabbableCells()).toHaveLength(1);
        expect(tabbableCells()[0].getAttribute("data-col")).toBe("2");
    });

    test("§8.14 keys pressed in the open move menu do not move the grid cursor or focus", () => {
        mount({ labels: LABELS });
        press(tabbableCells()[0], "Enter");
        const menu = list()!;
        expect(document.activeElement).toBe(menu);
        press(menu, "ArrowDown");
        press(menu, "ArrowRight");
        expect(tabbableCells()[0].getAttribute("data-col")).toBe("0");
        expect(document.activeElement).toBe(menu);
    });

    test("§8.14 choosing a destination in the menu does not reopen it", () => {
        mount({ labels: LABELS });
        press(tabbableCells()[0], "Enter");
        press(list()!, "ArrowDown");
        press(list()!, "Enter");
        expect(list()).toBeNull();
    });

    test("§8.15 choosing the card's own column, or dropping it there, is not a move", () => {
        const onMove = vi.fn();
        mount({ labels: LABELS, onMove });
        press(tabbableCells()[0], "Enter");
        click(option("To Do"));
        expect(list()).toBeNull();
        expect(document.querySelector(".kanban-board-status")?.textContent).toBe("");

        const dataTransfer = { setData: vi.fn(), getData: vi.fn(() => "c1") };
        const title = Array.from(document.querySelectorAll(".kanban-board-card-title")).find(
            (el) => el.textContent?.trim() === "Card One",
        )!;
        title.dispatchEvent(dragEvent("dragstart", dataTransfer));
        bodyRows()[1].querySelectorAll(".kanban-table-td")[0].dispatchEvent(dragEvent("drop", dataTransfer));
        expect(onMove).not.toHaveBeenCalled();
    });

    test("§8.16 focusing a cell by pointer moves the cursor there", () => {
        mount({});
        const cell = bodyRows()[1].querySelectorAll<HTMLElement>(".kanban-table-td")[1];
        cell.focus();
        expect(tabbableCells()).toEqual([cell]);
        press(cell, "ArrowUp");
        expect(tabbableCells()[0].getAttribute("data-row")).toBe("0");
        expect(tabbableCells()[0].getAttribute("data-col")).toBe("1");
    });

    test("§8.13 without labels.moveButton the menu still opens from the cell, named by the card, and Escape refocuses the cell", () => {
        mount({});
        const cell = tabbableCells()[0];
        press(cell, "Enter");
        expect(list()!.getAttribute("aria-label")).toBe("Card One");
        press(list()!, "Escape");
        expect(document.activeElement).toBe(cell);
    });

    test("§8.3 a column exactly at its wipLimit is not over it", () => {
        mount({ cards: CARDS.filter((c) => c.id !== "c4"), labels: LABELS });
        expect(document.querySelectorAll(".kanban-table-th")[1].hasAttribute("data-over-limit")).toBe(false);
    });
});

describe("KanbanBoard — reorder, veto and read-only (§8.17–§8.21)", () => {
    const status = () => document.querySelector(".kanban-board-status")?.textContent;

    test("§8.17 Alt+ArrowDown calls onReorder, fires reordercard and announces it", () => {
        const onReorder = vi.fn();
        const el = mount({ labels: { reorderAnnouncement: (t, p, n) => `${t} is ${p} of ${n}` } });
        el.onReorder = onReorder;
        const events: unknown[] = [];
        el.addEventListener("reordercard", (e) => events.push((e as CustomEvent).detail));
        press(tabbableCells()[0], "ArrowDown", { altKey: true });
        expect(onReorder).toHaveBeenCalledWith("c1", 1);
        expect(events).toEqual([{ cardId: "c1", toIndex: 1 }]);
        expect(status()).toBe("Card One is 2 of 2");
    });

    test("§8.18 Alt+Arrow at the column edge does not call onReorder", () => {
        const onReorder = vi.fn();
        const el = mount({});
        el.onReorder = onReorder;
        press(tabbableCells()[0], "ArrowUp", { altKey: true });
        expect(onReorder).not.toHaveBeenCalled();
    });

    test("§8.19 canMove refuses a move: no onMove, an announcement, aria-disabled option", () => {
        const onMove = vi.fn();
        const el = mount({
            labels: { ...LABELS, moveBlocked: (t, c) => `${t} cannot go to ${c}` },
            onMove,
        });
        el.canMove = (_c, to) => to.id !== "done";
        press(tabbableCells()[0], "Enter");
        const option = Array.from(document.querySelectorAll(".kanban-board-move-option")).find(
            (o) => o.textContent === "Done",
        )!;
        expect(option.getAttribute("aria-disabled")).toBe("true");
        click(option);
        expect(onMove).not.toHaveBeenCalled();
        expect(status()).toBe("Card One cannot go to Done");
    });

    test("§8.20 readonly: no move button, no menu, no drag, no reorder", () => {
        const onReorder = vi.fn();
        const el = mount({ labels: LABELS });
        el.onReorder = onReorder;
        el.readonly = true;
        expect(document.querySelector(".kanban-board-move-button")).toBeNull();
        press(tabbableCells()[0], "Enter");
        expect(document.querySelector('[role="listbox"]')).toBeNull();
        press(tabbableCells()[0], "ArrowDown", { altKey: true });
        expect(onReorder).not.toHaveBeenCalled();
        expect(document.querySelector("[draggable='true']")).toBeNull();
        expect(document.querySelector(".kanban-board")!.hasAttribute("data-readonly")).toBe(true);
    });

    test("§8.21 readonly keeps arrow-key navigation", () => {
        const el = mount({});
        el.readonly = true;
        press(tabbableCells()[0], "ArrowRight");
        expect(tabbableCells()[0].getAttribute("data-col")).toBe("1");
    });
});

describe("KanbanBoard — collapse, add card, hard limits (§8.22–§8.30)", () => {
    const collapseLabels: KanbanLabels = {
        ...LABELS,
        collapseColumn: (c, collapsed) => `${collapsed ? "Expand" : "Collapse"} ${c.title}`,
    };
    const named = (name: string) =>
        Array.from(document.querySelectorAll("button")).find((b) => b.getAttribute("aria-label") === name) as HTMLElement;
    const text = () => document.body.textContent ?? "";
    const headers = () => Array.from(document.querySelectorAll(".kanban-table-th")) as HTMLElement[];
    const stat = () => document.querySelector(".kanban-board-status")?.textContent;
    const moveTo = (title: string) => {
        press(tabbableCells()[0], "Enter");
        const option = Array.from(document.querySelectorAll(".kanban-board-move-option")).find(
            (o) => o.textContent === title,
        ) as HTMLElement;
        return option;
    };

    test("§8.22 no collapse toggle without labels.collapseColumn", () => {
        mount({});
        expect(document.querySelector(".kanban-board-collapse-button")).toBeNull();
    });

    test("§8.23 the toggle collapses a column: aria-expanded flips, cards are not rendered, the count remains", () => {
        const el = mount({ labels: collapseLabels });
        const onChange = vi.fn();
        el.onCollapsedChange = onChange;
        expect(named("Collapse To Do").getAttribute("aria-expanded")).toBe("true");
        expect(text()).toContain("Card One");
        click(named("Collapse To Do"));
        expect(named("Expand To Do").getAttribute("aria-expanded")).toBe("false");
        expect(text()).not.toContain("Card One");
        expect(headers()[0].textContent).toContain("2 cards");
        expect(headers()[0].hasAttribute("data-collapsed")).toBe(true);
        expect(onChange).toHaveBeenCalledWith(["todo"]);
    });

    test("§8.24 collapsedColumns starts a column collapsed; its cells carry data-collapsed", () => {
        const el = mount({ labels: LABELS });
        el.collapsedColumns = ["todo"];
        expect(text()).not.toContain("Card One");
        const cells = Array.from(document.querySelectorAll<HTMLElement>(".kanban-table-td")).filter((c) => c.dataset.col === "0");
        expect(cells.every((c) => c.hasAttribute("data-collapsed"))).toBe(true);
    });

    test("§8.25 the board's height ignores collapsed columns", () => {
        const el = mount({});
        expect(bodyRows()).toHaveLength(2);
        el.collapsedColumns = ["todo", "doing"];
        expect(bodyRows()).toHaveLength(0);
    });

    test("§8.26 addCard gates an add button per column that calls onAddCard and fires addcard", () => {
        const el = mount({ labels: { addCard: (c) => `Add to ${c.title}` } });
        const onAddCard = vi.fn();
        el.onAddCard = onAddCard;
        const events: string[] = [];
        el.addEventListener("addcard", (e) => events.push((e as CustomEvent<string>).detail));
        click(named("Add to In Progress"));
        expect(onAddCard).toHaveBeenCalledWith("doing");
        expect(events).toEqual(["doing"]);
    });

    test("§8.27 no add button without labels.addCard, and none when readonly", () => {
        mount({});
        expect(document.querySelector(".kanban-board-add-button")).toBeNull();
        document.body.replaceChildren();
        const el = mount({ labels: { addCard: (c) => `Add to ${c.title}` } });
        el.readonly = true;
        expect(document.querySelector(".kanban-board-add-button")).toBeNull();
    });

    test("§8.28 strictLimit refuses a move into a full column, announces it, marks the option aria-disabled", () => {
        const onMove = vi.fn();
        mount({
            columns: [{ id: "todo", title: "To Do" }, { id: "doing", title: "In Progress", wipLimit: 2, strictLimit: true }],
            labels: { ...LABELS, moveBlocked: (t, c) => `${t} cannot go to ${c}` },
            onMove,
        });
        const option = moveTo("In Progress");
        expect(option.getAttribute("aria-disabled")).toBe("true");
        click(option);
        expect(onMove).not.toHaveBeenCalled();
        expect(stat()).toBe("Card One cannot go to In Progress");
    });

    test("§8.29 strictLimit allows a move while the column is under its limit", () => {
        const onMove = vi.fn();
        mount({
            columns: [{ id: "todo", title: "To Do" }, { id: "doing", title: "In Progress", wipLimit: 3, strictLimit: true }],
            labels: LABELS,
            onMove,
        });
        click(moveTo("In Progress"));
        expect(onMove).toHaveBeenCalledWith("c1", "doing");
    });

    test("§8.30 without strictLimit a full column still accepts moves", () => {
        const onMove = vi.fn();
        mount({ labels: LABELS, onMove });
        click(moveTo("In Progress"));
        expect(onMove).toHaveBeenCalledWith("c1", "doing");
    });
});

describe("KanbanBoard — round 3 and consumer capabilities (§8.31–§8.62)", () => {
    const rich: KanbanCard[] = [
        { id: "c1", columnId: "todo", title: "Card One", subtitle: "Source · 80", badges: ["P1", "VIP"], flag: "SLA breached", href: "/t/1" },
        { id: "c2", columnId: "todo", title: "Card Two" },
        { id: "c3", columnId: "doing", title: "Card Three" },
    ];
    const cols: KanbanColumn[] = [
        { id: "todo", title: "To Do", flag: "Over capacity", accent: "red" },
        { id: "doing", title: "In Progress" },
        { id: "done", title: "Done" },
    ];
    const cell = (id: string) => document.querySelector<HTMLElement>(`[data-card-id="${id}"]`)!;
    const cellAt = (row: number, col: number) => document.querySelector<HTMLElement>(`.kanban-table-td[data-row="${row}"][data-col="${col}"]`)!;
    const titles = () => Array.from(document.querySelectorAll(".kanban-board-card-title")).map((e) => e.textContent?.trim());
    const status = () => document.querySelector(".kanban-board-status")!.textContent;
    const heads = () => Array.from(document.querySelectorAll<HTMLElement>(".kanban-table-th"));
    const focusIn = (el: Element) => el.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    const dragEvent = (type: string, d: unknown) => {
        const e = new Event(type, { bubbles: true, cancelable: true });
        Object.defineProperty(e, "dataTransfer", { value: d });
        return e;
    };
    const drag = (from: HTMLElement, to: HTMLElement) => {
        const d = { setData: () => {}, getData: () => "" };
        from.querySelector(".kanban-board-card-title")!.dispatchEvent(dragEvent("dragstart", d));
        to.dispatchEvent(dragEvent("dragover", d));
        to.dispatchEvent(dragEvent("drop", d));
    };
    const deferred = () => {
        let resolve!: () => void;
        let reject!: (e: unknown) => void;
        const promise = new Promise<void>((res, rej) => ((resolve = res), (reject = rej)));
        return { promise, resolve, reject };
    };
    const flush = () => new Promise((r) => setTimeout(r, 0));

    test("§8.31–§8.33 filter hides cards; counts and limits still use every card; data-hidden-count", () => {
        const el = mount({ labels: LABELS });
        el.filter = (c) => c.columnId !== "doing";
        expect(titles()).not.toContain("Card Three");
        expect(heads()[1].textContent).toContain("2 cards");
        expect(heads()[1].hasAttribute("data-over-limit")).toBe(true);
        expect(heads()[1].getAttribute("data-hidden-count")).toBe("2");
        expect(heads()[0].hasAttribute("data-hidden-count")).toBe(false);
    });

    test("§8.34 compare orders the cards within each column", () => {
        const el = mount({});
        el.compare = (a, b) => b.title.localeCompare(a.title);
        const todo = Array.from(document.querySelectorAll<HTMLElement>('.kanban-table-td[data-col="0"] .kanban-board-card-title')).map((e) => e.textContent?.trim());
        expect(todo).toEqual(["Card Two", "Card One"]);
    });

    test("§8.35–§8.37 drop on a card in another column passes its position; on an empty cell appends; in its own column reorders", () => {
        const onMove = vi.fn();
        const onReorder = vi.fn();
        const el = mount({ onMove });
        el.onReorder = onReorder;
        drag(cellAt(0, 0), cellAt(1, 1));
        drag(cellAt(0, 0), cellAt(0, 2));
        drag(cellAt(0, 0), cellAt(1, 0));
        expect(onMove.mock.calls).toEqual([["c1", "doing", 1], ["c1", "done"]]);
        expect(onReorder).toHaveBeenCalledWith("c1", 1);
    });

    test("§8.38 the cell under a dragged card carries data-drop-target; readonly refuses drops", () => {
        mount({});
        const d = { setData: () => {}, getData: () => "" };
        cellAt(0, 0).querySelector(".kanban-board-card-title")!.dispatchEvent(dragEvent("dragstart", d));
        cellAt(1, 1).dispatchEvent(dragEvent("dragover", d));
        expect(cellAt(1, 1).hasAttribute("data-drop-target")).toBe(true);
        document.body.replaceChildren();
        const onMove = vi.fn();
        const ro = mount({ onMove });
        ro.readonly = true;
        cellAt(0, 2).dispatchEvent(dragEvent("drop", d));
        expect(onMove).not.toHaveBeenCalled();
    });

    test("§8.39–§8.41 a locked card has data-locked, no move button, no drag, ignores Enter and Alt+Arrow; others still move", () => {
        const onMove = vi.fn();
        const onReorder = vi.fn();
        const el = mount({ labels: LABELS, cards: CARDS.map((c) => (c.id === "c1" ? { ...c, locked: true } : c)), onMove });
        el.onReorder = onReorder;
        expect(cellAt(0, 0).hasAttribute("data-locked")).toBe(true);
        expect(cellAt(0, 0).querySelector(".kanban-board-move-button")).toBeNull();
        expect(cellAt(0, 0).querySelector("[draggable]")).toBeNull();
        press(cellAt(0, 0), "Enter");
        expect(document.querySelector('[role="listbox"]')).toBeNull();
        press(cellAt(0, 0), "ArrowDown", { altKey: true });
        expect(onReorder).not.toHaveBeenCalled();
        focusIn(cellAt(1, 0));
        press(cellAt(1, 0), "Enter");
        click(Array.from(document.querySelectorAll(".kanban-board-move-option")).find((o) => o.textContent === "Done")!);
        expect(onMove).toHaveBeenCalledWith("c2", "done");
    });

    test("§8.44–§8.46 Alt+ArrowRight moves to the next column, not past the first; a full hard-limited column refuses and announces", () => {
        const onMove = vi.fn();
        mount({ onMove });
        press(cellAt(0, 0), "ArrowLeft", { altKey: true });
        expect(onMove).not.toHaveBeenCalled();
        press(cellAt(0, 0), "ArrowRight", { altKey: true });
        expect(onMove).toHaveBeenCalledWith("c1", "doing");
        document.body.replaceChildren();
        const refused = vi.fn();
        mount({
            columns: [{ id: "todo", title: "To Do" }, { id: "doing", title: "In Progress", wipLimit: 2, strictLimit: true }],
            labels: { ...LABELS, moveBlocked: (t, c) => `${t} cannot go to ${c}` },
            onMove: refused,
        });
        press(cellAt(0, 0), "ArrowRight", { altKey: true });
        expect(refused).not.toHaveBeenCalled();
        expect(status()).toBe("Card One cannot go to In Progress");
    });

    test("§8.47 cardAttrs adds attributes to each card's cell", () => {
        const el = mount({});
        el.cardAttrs = (c) => ({ "data-priority": c.id === "c1" ? "high" : "low" });
        expect(cell("c1").getAttribute("data-priority")).toBe("high");
        expect(cell("c2").getAttribute("data-priority")).toBe("low");
    });

    test("§8.48 subtitle, badges and a link title render; §8.50 the flag is text, data-flag and aria-describedby; §8.51 column flag and accent", () => {
        mount({ cards: rich, columns: cols });
        expect(cell("c1").querySelector(".kanban-board-card-subtitle")!.textContent).toBe("Source · 80");
        expect(Array.from(cell("c1").querySelectorAll(".kanban-board-card-badge")).map((b) => b.textContent)).toEqual(["P1", "VIP"]);
        expect(cell("c1").querySelector("a.kanban-board-card-link")!.getAttribute("href")).toBe("/t/1");
        const flag = cell("c1").querySelector(".kanban-board-card-flag")!;
        expect(flag.textContent).toBe("SLA breached");
        expect(cell("c1").getAttribute("data-flag")).toBe("SLA breached");
        expect(cell("c1").getAttribute("aria-describedby")).toBe(flag.id);
        expect(heads()[0].getAttribute("data-flag")).toBe("Over capacity");
        expect(heads()[0].getAttribute("data-accent")).toBe("red");
        expect(heads()[0].querySelector(".kanban-board-column-flag")!.textContent).toBe("Over capacity");
        expect(cell("c1").getAttribute("data-accent")).toBe("red");
    });

    test("§8.49 renderCard replaces the title content; §8.59 renderColumnHeader and renderColumnFooter render per column", () => {
        const el = document.createElement("kanban-board") as KanbanBoard;
        el.setAttribute("label", "B");
        el.renderCard = ({ label }) => Object.assign(document.createElement("b"), { textContent: `${label}!` });
        el.renderColumnHeader = ({ count }) => Object.assign(document.createElement("i"), { textContent: String(count) });
        el.renderColumnFooter = ({ column, count, cards }) =>
            Object.assign(document.createElement("i"), { textContent: `${column.id}:${count}:${cards.map((c) => c.id).join(",")}` });
        document.body.appendChild(el);
        el.columns = cols;
        el.cards = rich;
        expect(cell("c2").querySelector(".kanban-board-card-title")!.textContent).toBe("Card Two!");
        expect(document.querySelectorAll("tfoot td")).toHaveLength(3);
        expect(document.querySelector("tfoot td")!.textContent).toBe("todo:2:c1,c2");
        expect(heads()[1].textContent).toContain("1");
    });

    test("§8.52–§8.53 allowedColumns limits the move menu; a keyboard move elsewhere is refused and announced", () => {
        const el = mount({ labels: LABELS, cards: rich, columns: cols });
        el.allowedColumns = (c) => (c.id === "c1" ? ["doing"] : ["done"]);
        press(cell("c1"), "Enter");
        expect(Array.from(document.querySelectorAll('[role="option"]')).map((o) => o.textContent)).toEqual(["To Do", "In Progress"]);
        document.body.replaceChildren();
        const onMove = vi.fn();
        const g = mount({ labels: { ...LABELS, moveBlocked: (t, c) => `${t} cannot go to ${c}` }, onMove });
        g.allowedColumns = () => ["done"];
        press(cellAt(0, 0), "ArrowRight", { altKey: true });
        expect(onMove).not.toHaveBeenCalled();
        expect(status()).toBe("Card One cannot go to In Progress");
    });

    test("§8.54 card.draggable=false stops pointer dragging but keeps the move menu", () => {
        mount({ labels: LABELS, cards: CARDS.map((c) => (c.id === "c1" ? { ...c, draggable: false } : c)) });
        expect(cell("c1").querySelector("[draggable]")).toBeNull();
        expect(cell("c1").querySelector(".kanban-board-move-button")).toBeTruthy();
    });

    test("§8.55 an async moveHandler shows data-pending and aria-busy in the new column, then clears on resolve", async () => {
        const d = deferred();
        const el = mount({ cards: rich, columns: cols, labels: { ...LABELS, movePending: (t, c) => `Moving ${t} to ${c}` } });
        el.moveHandler = () => d.promise;
        focusIn(cell("c2"));
        press(cell("c2"), "ArrowRight", { altKey: true });
        await flush();
        expect(cell("c2").getAttribute("data-pending")).toBe("");
        expect(cell("c2").getAttribute("aria-busy")).toBe("true");
        expect(cell("c2").getAttribute("data-col")).toBe("1");
        expect(status()).toBe("Moving Card Two to In Progress");
        d.resolve();
        await flush();
        expect(cell("c2").hasAttribute("data-pending")).toBe(false);
    });

    test("§8.56 a rejected moveHandler sends the card back, announces moveFailed and calls onMoveError; §8.57 a pending card cannot move again", async () => {
        const d = deferred();
        const handler = vi.fn(() => d.promise);
        const onMoveError = vi.fn();
        const el = mount({ cards: rich, columns: cols, labels: { ...LABELS, moveFailed: (t, c) => `Could not move ${t} to ${c}` } });
        el.moveHandler = handler;
        el.onMoveError = onMoveError;
        focusIn(cell("c2"));
        press(cell("c2"), "ArrowRight", { altKey: true });
        await flush();
        press(cell("c2"), "ArrowRight", { altKey: true });
        expect(handler).toHaveBeenCalledTimes(1);
        d.reject(new Error("no"));
        await flush();
        expect(cell("c2").getAttribute("data-col")).toBe("0");
        expect(onMoveError).toHaveBeenCalledWith("c2", "doing", expect.any(Error));
        expect(status()).toBe("Could not move Card Two to In Progress");
    });

    test("§8.58 without a moveHandler there is no pending state", () => {
        const onMove = vi.fn();
        mount({ cards: rich, columns: cols, onMove });
        focusIn(cell("c2"));
        press(cell("c2"), "ArrowRight", { altKey: true });
        expect(onMove).toHaveBeenCalledWith("c2", "doing");
        expect(document.querySelector("[data-pending]")).toBeNull();
    });

    test("§8.60–§8.61 labels.emptyColumn shows a message in an empty column, even when no column has cards; none without it", () => {
        const lab = { ...LABELS, emptyColumn: (c: KanbanColumn) => `No cards in ${c.title}` };
        mount({ cards: rich, columns: cols, labels: lab });
        expect(document.querySelector(".kanban-board-empty")!.textContent).toBe("No cards in Done");
        document.body.replaceChildren();
        mount({ cards: [], columns: cols, labels: lab });
        expect(document.querySelectorAll(".kanban-board-empty")).toHaveLength(3);
        expect(bodyRows()).toHaveLength(1);
        document.body.replaceChildren();
        mount({ cards: rich, columns: cols });
        expect(document.querySelector(".kanban-board-empty")).toBeNull();
    });

    test("§8.62 labels.search adds a search field that filters by label, subtitle and badges", () => {
        mount({ cards: rich, columns: cols, labels: { ...LABELS, search: "Search cards" } });
        const input = document.querySelector<HTMLInputElement>('input[type="search"]')!;
        expect(input.getAttribute("aria-label")).toBe("Search cards");
        input.value = "vip";
        input.dispatchEvent(new Event("input", { bubbles: true }));
        expect(titles()).toEqual(["Card One"]);
        expect(heads()[0].getAttribute("data-hidden-count")).toBe("1");
    });
});

describe("KanbanBoard — 0.4.0 (§8.63–§8.83)", () => {
    const cell = (id: string) => document.querySelector<HTMLElement>(`[data-card-id="${id}"]`)!;
    const focusCell = (id: string) => cell(id).dispatchEvent(new FocusEvent("focusin", { bubbles: true }));

    test("§8.63 selectable: x and Ctrl+click toggle, selectionchange fires, aria-multiselectable", () => {
        const el = mount({});
        el.selectable = true;
        const changes: string[][] = [];
        el.addEventListener("selectionchange", (e) => changes.push((e as CustomEvent<string[]>).detail));
        expect(document.querySelector("table")!.getAttribute("aria-multiselectable")).toBe("true");
        focusCell("c1");
        press(cell("c1"), "x");
        expect(cell("c1").hasAttribute("data-selected")).toBe(true);
        cell("c2").dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, ctrlKey: true }));
        expect(changes.at(-1)).toEqual(["c1", "c2"]);
        expect(el.selected).toEqual(["c1", "c2"]);
    });

    test("§8.64 moving a selected card moves the whole selection and announces once", () => {
        const onMove = vi.fn();
        const el = mount({ onMove, labels: { moveManyAnnouncement: (n, c) => `${n} to ${c}` } });
        el.selectable = true;
        el.selected = ["c1", "c2"];
        focusCell("c1");
        press(cell("c1"), "ArrowRight", { altKey: true });
        expect(onMove.mock.calls.map((c) => [c[0], c[1]])).toEqual([["c1", "doing"], ["c2", "doing"]]);
        expect(document.querySelector(".kanban-board-status")!.textContent).toBe("2 to In Progress");
        expect(el.selected).toEqual([]);
    });

    test("§8.65 undoable: Ctrl+Z moves the card back", async () => {
        const moves: [string, string][] = [];
        const el = mount({});
        el.undoable = true;
        el.onMove = (id, col) => {
            moves.push([id, col]);
            el.cards = el.cards.map((c) => (c.id === id ? { ...c, columnId: col } : c));
        };
        focusCell("c1");
        press(cell("c1"), "ArrowRight", { altKey: true });
        await Promise.resolve();
        await new Promise((r) => setTimeout(r, 0));
        press(tabbableCells()[0], "z", { ctrlKey: true });
        await new Promise((r) => setTimeout(r, 0));
        expect(moves).toEqual([["c1", "doing"], ["c1", "todo"]]);
    });

    test("§8.66 movableColumns: Alt+Shift+ArrowRight reorders columns", () => {
        const el = mount({});
        el.movableColumns = true;
        const orders: string[][] = [];
        el.addEventListener("columnorderchange", (e) => orders.push((e as CustomEvent<string[]>).detail));
        focusCell("c1");
        press(cell("c1"), "ArrowRight", { altKey: true, shiftKey: true });
        expect(orders.at(-1)).toEqual(["doing", "todo", "done"]);
        expect(document.querySelector(".kanban-table-th")!.textContent).toContain("In Progress");
    });

    test("§8.67 lanes: lane header rows, cards grouped by laneId", () => {
        const el = mount({});
        el.lanes = [{ id: "a", title: "Alpha" }, { id: "b", title: "Beta" }];
        el.cards = CARDS.map((x, i) => ({ ...x, laneId: i < 2 ? "a" : "b" }));
        expect(Array.from(document.querySelectorAll(".kanban-board-lane")).map((e) => e.textContent)).toEqual(["Alpha", "Beta"]);
    });

    test("§8.68 dropping into another lane's cell reports the lane id", () => {
        const onMove = vi.fn();
        const el = mount({ onMove, cards: [{ id: "c1", columnId: "todo", title: "One", laneId: "a" }] });
        el.lanes = [{ id: "a", title: "A" }, { id: "b", title: "B" }];
        document.querySelector(".kanban-board-card-title")!.dispatchEvent(new Event("dragstart", { bubbles: true }));
        document.querySelector('[data-row="1"][data-col="1"]')!.dispatchEvent(new Event("drop", { bubbles: true, cancelable: true }));
        expect(onMove).toHaveBeenCalledWith("c1", "doing", undefined, "b");
    });

    test("§8.69 virtualize renders a window with spacers and aria-rowcount", () => {
        const el = mount({ cards: Array.from({ length: 100 }, (_, i) => ({ id: `k${i}`, columnId: "todo", title: `K${i}` })) });
        el.virtualize = { rowHeight: 20, height: 100 };
        expect(document.querySelector(".kanban-board-scroll")).toBeTruthy();
        expect(document.querySelectorAll("[data-card-id]").length).toBeLessThan(20);
        expect(document.querySelector(".kanban-board-spacer")).toBeTruthy();
        expect(document.querySelector("table")!.getAttribute("aria-rowcount")).toBe("101");
    });
});

describe("kanban-board — collapsible lanes (§8.91–§8.94)", () => {
    const laneDefs = [{ id: "ann", title: "Ann" }, { id: "bo", title: "Bo" }];
    const cardsInLanes: KanbanCard[] = [
        { id: "c1", columnId: "todo", title: "One", laneId: "ann" },
        { id: "c2", columnId: "todo", title: "Two", laneId: "bo" },
        { id: "c3", columnId: "doing", title: "Three", laneId: "bo" },
    ];
    const laneColumns: KanbanColumn[] = [{ id: "todo", title: "To do" }, { id: "doing", title: "Doing" }];
    const collapseLane = (lane: { title: string }, collapsed: boolean) => `${collapsed ? "Expand" : "Collapse"} ${lane.title}`;
    function board(extra: Partial<KanbanBoard> = {}): KanbanBoard {
        const el = mount({ columns: laneColumns, cards: cardsInLanes });
        el.lanes = laneDefs;
        Object.assign(el, extra);
        return el;
    }
    const byName = (name: string) => Array.from(document.querySelectorAll("button")).find((b) => b.getAttribute("aria-label") === name) as HTMLButtonElement;

    test("§8.91 labels.collapseLane gates a toggle with aria-expanded; clicking collapses the lane's rows but keeps its header", () => {
        board({ labels: { collapseLane } as KanbanLabels });
        expect(byName("Collapse Bo").getAttribute("aria-expanded")).toBe("true");
        byName("Collapse Bo").click();
        expect(byName("Expand Bo").getAttribute("aria-expanded")).toBe("false");
        expect(document.querySelector('[data-card-id="c2"]')).toBeNull();
        expect(document.querySelector('[data-card-id="c1"]')).not.toBeNull();
        expect(document.querySelectorAll(".kanban-board-lane")).toHaveLength(2);
    });

    test("§8.92 no toggle without labels.collapseLane", () => {
        board();
        expect(document.querySelector(".kanban-board-lane-toggle")).toBeNull();
    });

    test("§8.93 collapsedLanes starts a lane collapsed; labels.laneCount shows its card count; the change is reported", () => {
        const onChange = vi.fn();
        const el = board({ collapsedLanes: ["bo"], onCollapsedLanesChange: onChange, labels: { collapseLane, laneCount: (lane: { title: string }, n: number) => `${n} cards in ${lane.title}` } as KanbanLabels });
        const events: string[][] = [];
        el.addEventListener("lanecollapsechange", (e) => events.push((e as CustomEvent).detail));
        expect(document.querySelector('[data-card-id="c2"]')).toBeNull();
        expect(Array.from(document.querySelectorAll(".kanban-board-lane-count")).map((e) => e.textContent)).toEqual(["1 cards in Ann", "2 cards in Bo"]);
        expect(document.querySelector('[data-lane-id="bo"][data-collapsed]')).not.toBeNull();
        byName("Expand Bo").click();
        expect(onChange).toHaveBeenCalledWith([]);
        expect(events).toEqual([[]]);
        expect(document.querySelector('[data-card-id="c2"]')).not.toBeNull();
    });

    test("§8.94 collapsing every lane leaves a board with only headers (no body rows, no crash)", () => {
        board({ collapsedLanes: ["ann", "bo"] });
        expect(document.querySelectorAll(".kanban-table-body tr:not([data-lane-row])")).toHaveLength(0);
        expect(document.querySelectorAll(".kanban-board-lane")).toHaveLength(2);
    });
});
