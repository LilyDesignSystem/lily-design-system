import { mount, type VueWrapper } from "@vue/test-utils";
import { afterEach, describe, expect, test, vi } from "vitest";
import { nextTick } from "vue";

import KanbanBoard from "./KanbanBoard.vue";
import type { KanbanCard, KanbanColumn, KanbanLabels } from "./KanbanBoard.vue";

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

/** Let Vue's scheduler and any nextTick chains settle. */
async function flush(): Promise<void> {
    await nextTick();
    await new Promise((r) => setTimeout(r, 0));
    await nextTick();
}

const wrappers: VueWrapper<any>[] = [];

function build(props: Record<string, unknown> = {}) {
    const wrapper = mount(KanbanBoard, {
        props: { label: "Sprint board", columns: COLUMNS, cards: CARDS, ...props },
        attachTo: document.body,
    });
    wrappers.push(wrapper);
    return wrapper;
}

afterEach(() => {
    while (wrappers.length) wrappers.pop()!.unmount();
    document.body.innerHTML = "";
});

function bodyRows(): HTMLElement[] {
    return Array.from(document.querySelectorAll(".kanban-table-body .kanban-table-row"));
}

function tabbableCells(): HTMLElement[] {
    return Array.from(document.querySelectorAll<HTMLElement>('.kanban-table-td[tabindex="0"]'));
}

function moveButton(name: string): HTMLElement | null {
    return document.querySelector(`button.kanban-board-move-button[aria-label="${name}"]`);
}

function optionByName(name: string): HTMLElement | undefined {
    return Array.from(document.querySelectorAll<HTMLElement>('[role="option"]')).find(
        (el) => el.textContent?.trim() === name,
    );
}

describe("KanbanBoard — markup (§8.1, §8.2, §8.3, §8.4)", () => {
    test("§8.1 renders a kanban-board root wrapping a role=grid labelled by `label`", () => {
        build();
        const root = document.querySelector(".kanban-board");
        expect(root).toBeTruthy();
        const grid = document.querySelector('[role="grid"]');
        expect(grid?.getAttribute("aria-label")).toBe("Sprint board");
    });

    test("§8.2 renders column titles and, when labels.cardCount is set, a derived count", () => {
        build({ labels: LABELS });
        expect(document.body.textContent).toContain("To Do");
        const headers = document.querySelectorAll(".kanban-table-th");
        expect(headers[0].textContent).toContain("2 cards");
        expect(headers[2].textContent).toContain("0 cards");
    });

    test("§8.2 no card count renders when labels.cardCount is absent", () => {
        build();
        expect(document.querySelector(".kanban-board-count")).toBeNull();
    });

    test("§8.3 a column over its wipLimit carries data-over-limit and the warning text", () => {
        build({ labels: LABELS });
        const headers = document.querySelectorAll(".kanban-table-th");
        expect(headers[1].hasAttribute("data-over-limit")).toBe(true);
        expect(headers[1].textContent).toContain("Over limit: 2/1");
        expect(headers[0].hasAttribute("data-over-limit")).toBe(false);
        expect(headers[2].hasAttribute("data-over-limit")).toBe(false);
    });

    test("§8.4 the body is rectangular: row count equals the largest column's card count", () => {
        build();
        expect(bodyRows()).toHaveLength(2); // todo and doing both have 2 cards
        const doneCells = bodyRows().map((row) => row.querySelectorAll(".kanban-table-td")[2]);
        for (const cell of doneCells) {
            expect(cell.textContent?.trim()).toBe("");
        }
    });
});

describe("KanbanBoard — roving-tabindex keyboard navigation (§8.5, §8.6)", () => {
    test("§8.5 the roving tab stop is not announced as selection: no cell carries aria-selected", () => {
        build();
        expect(tabbableCells()).toHaveLength(1);
        expect(document.querySelectorAll("td[aria-selected]")).toHaveLength(0);
    });

    test("§8.5 exactly one body cell carries tabindex=0, and arrows move it and clamp", async () => {
        build();
        expect(tabbableCells()).toHaveLength(1);
        expect(tabbableCells()[0].getAttribute("data-row")).toBe("0");
        expect(tabbableCells()[0].getAttribute("data-col")).toBe("0");

        tabbableCells()[0].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
        await flush();
        expect(tabbableCells()[0].getAttribute("data-col")).toBe("1");

        // Clamp: ArrowUp past the first row stays on the first row.
        tabbableCells()[0].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));
        await flush();
        expect(tabbableCells()).toHaveLength(1);
        expect(tabbableCells()[0].getAttribute("data-row")).toBe("0");
    });

    test("§8.6 Home/End move within the column; Ctrl+Home/Ctrl+End move to the grid's ends", async () => {
        build();
        tabbableCells()[0].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
        await flush();
        tabbableCells()[0].dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));
        await flush();
        expect(tabbableCells()[0].getAttribute("data-row")).toBe("1");
        expect(tabbableCells()[0].getAttribute("data-col")).toBe("1");

        tabbableCells()[0].dispatchEvent(
            new KeyboardEvent("keydown", { key: "Home", ctrlKey: true, bubbles: true }),
        );
        await flush();
        expect(tabbableCells()[0].getAttribute("data-row")).toBe("0");
        expect(tabbableCells()[0].getAttribute("data-col")).toBe("0");

        tabbableCells()[0].dispatchEvent(new KeyboardEvent("keydown", { key: "End", ctrlKey: true, bubbles: true }));
        await flush();
        expect(tabbableCells()[0].getAttribute("data-row")).toBe("1");
        expect(tabbableCells()[0].getAttribute("data-col")).toBe("2");
    });
});

describe("KanbanBoard — move menu (§8.7, §8.8, §8.9)", () => {
    test("§8.7 Enter on a focused card opens its move menu", async () => {
        build({ labels: LABELS });
        tabbableCells()[0].dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
        await flush();
        const button = moveButton("Move Card One");
        expect(button).toBeTruthy();
        expect(button!.getAttribute("aria-expanded")).toBe("true");
        const listbox = document.querySelector('[role="listbox"]');
        expect(listbox).toBeTruthy();
        expect(listbox!.getAttribute("aria-label")).toBe("Move to column");
        expect(document.querySelectorAll('[role="option"]')).toHaveLength(3);
    });

    test("§8.8 choosing a destination emits move, closes the menu, and refocuses the move button", async () => {
        build({ labels: LABELS });
        tabbableCells()[0].dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
        await flush();
        const doneOption = optionByName("Done")!;
        doneOption.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        await flush();
        const wrapper = wrappers[wrappers.length - 1];
        expect(wrapper.emitted("move")).toEqual([["c1", "done"]]);
        expect(document.querySelector('[role="listbox"]')).toBeNull();
        expect(document.activeElement?.className).toContain("kanban-board-move-button");
    });

    test("§8.9 Escape closes the move menu without emitting move", async () => {
        build({ labels: LABELS });
        tabbableCells()[0].dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
        await flush();
        const listbox = document.querySelector('[role="listbox"]')!;
        listbox.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
        await flush();
        const wrapper = wrappers[wrappers.length - 1];
        expect(wrapper.emitted("move")).toBeUndefined();
        expect(document.querySelector('[role="listbox"]')).toBeNull();
    });
});

describe("KanbanBoard — pointer drag-and-drop (§8.10)", () => {
    test("§8.10 dropping a card on another column's cell emits move", async () => {
        build();
        const dataTransfer = { setData: vi.fn(), getData: vi.fn(() => "c1") };
        const cardTitle = Array.from(document.querySelectorAll(".kanban-board-card-title")).find(
            (el) => el.textContent?.trim() === "Card One",
        )!;
        cardTitle.dispatchEvent(
            Object.assign(new Event("dragstart", { bubbles: true }), { dataTransfer }),
        );

        const doneCell = bodyRows()[0].querySelectorAll(".kanban-table-td")[2];
        doneCell.dispatchEvent(Object.assign(new Event("drop", { bubbles: true }), { dataTransfer }));
        await flush();
        const wrapper = wrappers[wrappers.length - 1];
        expect(wrapper.emitted("move")).toEqual([["c1", "done"]]);
    });
});

describe("KanbanBoard — announcements and extra attributes (§8.11, §8.12)", () => {
    test("§8.11 a successful move announces via labels.moveAnnouncement", async () => {
        build({ labels: LABELS });
        tabbableCells()[0].dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
        await flush();
        optionByName("Done")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        await flush();
        expect(document.querySelector(".kanban-board-status")?.textContent).toBe("Card One moved to Done");
    });

    test("§8.11 no announcement fires when moveAnnouncement is absent", async () => {
        build();
        tabbableCells()[0].dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
        await flush();
        key(listbox()!, "ArrowDown");
        key(listbox()!, "Enter");
        await flush();
        expect(document.querySelector(".kanban-board-status")?.textContent).toBe("");
    });

    test("§8.12 extra attributes spread onto the root", () => {
        build({ "data-testid": "board-root" });
        expect(document.querySelector('[data-testid="board-root"]')).toBeTruthy();
    });
});

function key(el: Element, k: string, init: KeyboardEventInit = {}): void {
    el.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true, ...init }));
}

function listbox(): HTMLElement | null {
    return document.querySelector('[role="listbox"]');
}

describe("KanbanBoard — focus, tab stop and move edge cases", () => {
    test("§8.8 after a move, focus and the tab stop follow the card to its new column", async () => {
        const wrapper = build({
            labels: LABELS,
            onMove: (id: string, columnId: string) =>
                wrapper.setProps({ cards: CARDS.map((c) => (c.id === id ? { ...c, columnId } : c)) }),
        });
        key(tabbableCells()[0], "Enter");
        await flush();
        optionByName("Done")!.click();
        await flush();
        await flush();
        expect(document.activeElement).toBe(moveButton("Move Card One"));
        expect(tabbableCells()).toHaveLength(1);
        expect(tabbableCells()[0].getAttribute("data-col")).toBe("2");
    });

    test("§8.14 keys pressed in the open move menu do not move the grid cursor or focus", async () => {
        build({ labels: LABELS });
        key(tabbableCells()[0], "Enter");
        await flush();
        const menu = listbox()!;
        expect(document.activeElement).toBe(menu);
        key(menu, "ArrowDown");
        key(menu, "ArrowRight");
        await flush();
        expect(tabbableCells()[0].getAttribute("data-col")).toBe("0");
        expect(document.activeElement).toBe(menu);
    });

    test("§8.14 choosing a destination in the menu does not reopen it", async () => {
        build({ labels: LABELS });
        key(tabbableCells()[0], "Enter");
        await flush();
        key(listbox()!, "ArrowDown");
        key(listbox()!, "Enter");
        await flush();
        await flush();
        expect(listbox()).toBeNull();
    });

    test("§8.15 choosing the card's own column, or dropping it there, is not a move", async () => {
        const wrapper = build({ labels: LABELS });
        key(tabbableCells()[0], "Enter");
        await flush();
        optionByName("To Do")!.click();
        await flush();
        expect(listbox()).toBeNull();
        expect(document.querySelector(".kanban-board-status")?.textContent).toBe("");

        const title = Array.from(document.querySelectorAll(".kanban-board-card-title")).find(
            (el) => el.textContent?.trim() === "Card One",
        )!;
        const dataTransfer = { setData: vi.fn(), getData: vi.fn(() => "c1") };
        const drag = new Event("dragstart", { bubbles: true });
        Object.assign(drag, { dataTransfer });
        title.dispatchEvent(drag);
        const drop = new Event("drop", { bubbles: true, cancelable: true });
        Object.assign(drop, { dataTransfer });
        bodyRows()[1].querySelectorAll(".kanban-table-td")[0].dispatchEvent(drop);
        expect(wrapper.emitted("move")).toBeUndefined();
    });

    test("§8.16 when the board shrinks under the cursor, one cell stays tabbable", async () => {
        const wrapper = build();
        key(tabbableCells()[0], "End");
        await flush();
        expect(tabbableCells()[0].getAttribute("data-row")).toBe("1");
        await wrapper.setProps({ cards: CARDS.filter((c) => c.id !== "c2" && c.id !== "c4") });
        expect(bodyRows()).toHaveLength(1);
        expect(tabbableCells()).toHaveLength(1);
    });

    test("§8.16 focusing a cell by pointer moves the cursor there", async () => {
        build();
        const cell = bodyRows()[1].querySelectorAll<HTMLElement>(".kanban-table-td")[1];
        cell.focus();
        await flush();
        expect(tabbableCells()).toEqual([cell]);
        key(cell, "ArrowUp");
        await flush();
        expect(tabbableCells()[0].getAttribute("data-row")).toBe("0");
        expect(tabbableCells()[0].getAttribute("data-col")).toBe("1");
    });

    test("§8.13 without labels.moveButton there is no unnamed button; the menu is named by the card and Escape refocuses the cell", async () => {
        build();
        expect(document.querySelector(".kanban-board-move-button")).toBeNull();
        const cell = tabbableCells()[0];
        key(cell, "Enter");
        await flush();
        expect(listbox()!.getAttribute("aria-label")).toBe("Card One");
        key(listbox()!, "Escape");
        await flush();
        await flush();
        expect(document.activeElement).toBe(cell);
    });

    test("§8.3 a column exactly at its wipLimit is not over it", () => {
        build({ cards: CARDS.filter((c) => c.id !== "c4"), labels: LABELS });
        expect(document.querySelectorAll(".kanban-table-th")[1].hasAttribute("data-over-limit")).toBe(false);
    });
});

describe("KanbanBoard — reorder, veto and read-only (§8.17–§8.21)", () => {
    const key = (el: Element, init: KeyboardEventInit) =>
        el.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, ...init }));

    test("§8.17 Alt+ArrowDown emits reorder and announces it", async () => {
        const wrapper = build({ labels: { reorderAnnouncement: (t: string, p: number, n: number) => `${t} is ${p} of ${n}` } });
        key(tabbableCells()[0], { key: "ArrowDown", altKey: true });
        await flush();
        expect(wrapper.emitted("reorder")).toEqual([["c1", 1]]);
        expect(document.querySelector(".kanban-board-status")?.textContent).toBe("Card One is 2 of 2");
    });

    test("§8.18 Alt+Arrow at the column edge emits nothing", async () => {
        const wrapper = build();
        key(tabbableCells()[0], { key: "ArrowUp", altKey: true });
        await flush();
        expect(wrapper.emitted("reorder")).toBeUndefined();
    });

    test("§8.19 canMove refuses a move: no move event, an announcement, aria-disabled option", async () => {
        const wrapper = build({
            labels: { ...LABELS, moveBlocked: (t: string, c: string) => `${t} cannot go to ${c}` },
            canMove: (_c: KanbanCard, to: KanbanColumn) => to.id !== "done",
        });
        key(tabbableCells()[0], { key: "Enter" });
        await flush();
        const option = optionByName("Done")!;
        expect(option.getAttribute("aria-disabled")).toBe("true");
        option.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        await flush();
        expect(wrapper.emitted("move")).toBeUndefined();
        expect(document.querySelector(".kanban-board-status")?.textContent).toBe("Card One cannot go to Done");
    });

    test("§8.20 readonly: no move button, no menu, no drag, no reorder", async () => {
        const wrapper = build({ labels: LABELS, readonly: true });
        expect(document.querySelector(".kanban-board-move-button")).toBeNull();
        key(tabbableCells()[0], { key: "Enter" });
        await flush();
        expect(document.querySelector('[role="listbox"]')).toBeNull();
        key(tabbableCells()[0], { key: "ArrowDown", altKey: true });
        await flush();
        expect(wrapper.emitted("reorder")).toBeUndefined();
        expect(document.querySelector("[draggable='true']")).toBeNull();
        expect(document.querySelector(".kanban-board")!.hasAttribute("data-readonly")).toBe(true);
    });

    test("§8.21 readonly keeps arrow-key navigation", async () => {
        build({ readonly: true });
        key(tabbableCells()[0], { key: "ArrowRight" });
        await flush();
        expect(tabbableCells()[0].getAttribute("data-col")).toBe("1");
    });
});

describe("KanbanBoard — collapse, add card, hard limits (§8.22–§8.30)", () => {
    const key = (el: Element, init: KeyboardEventInit) =>
        el.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, ...init }));
    const clickEl = (el: Element) => el.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    const buttonNamed = (name: string) =>
        Array.from(document.querySelectorAll("button")).find((b) => b.getAttribute("aria-label") === name)!;
    const cells = () => Array.from(document.querySelectorAll<HTMLElement>(".kanban-table-td"));
    const collapseLabels: KanbanLabels = {
        ...LABELS,
        collapseColumn: (c, collapsed) => `${collapsed ? "Expand" : "Collapse"} ${c.title}`,
    };
    const hasText = (t: string) => document.body.textContent!.includes(t);

    test("§8.22 collapseColumn gates a toggle in each header; without it none renders", async () => {
        build();
        await flush();
        expect(document.querySelector(".kanban-board-collapse-button")).toBeNull();
    });

    test("§8.23 the toggle collapses a column: aria-expanded flips, its cards are not rendered, its count remains", async () => {
        build({ labels: collapseLabels });
        await flush();
        expect(buttonNamed("Collapse To Do").getAttribute("aria-expanded")).toBe("true");
        expect(hasText("Card One")).toBe(true);
        clickEl(buttonNamed("Collapse To Do"));
        await flush();
        expect(buttonNamed("Expand To Do").getAttribute("aria-expanded")).toBe("false");
        expect(hasText("Card One")).toBe(false);
        expect(document.querySelectorAll(".kanban-table-th")[0].textContent).toContain("2 cards");
        expect(document.querySelectorAll(".kanban-table-th")[0].hasAttribute("data-collapsed")).toBe(true);
    });

    test("§8.24 collapsedColumns starts a column collapsed, and its cells carry data-collapsed", async () => {
        build({ collapsedColumns: ["todo"], labels: LABELS });
        await flush();
        expect(hasText("Card One")).toBe(false);
        expect(cells().filter((c) => c.dataset.col === "0").every((c) => c.hasAttribute("data-collapsed"))).toBe(true);
    });

    test("§8.25 the board's height ignores collapsed columns", async () => {
        const a = build();
        await flush();
        expect(bodyRows()).toHaveLength(2);
        a.unmount();
        wrappers.pop();
        build({ collapsedColumns: ["todo", "doing"] });
        await flush();
        expect(bodyRows()).toHaveLength(0);
    });

    test("§8.26 addCard gates an add button per column that emits add-card with the column id", async () => {
        const wrapper = build({ labels: { addCard: (c: KanbanColumn) => `Add to ${c.title}` } });
        await flush();
        clickEl(buttonNamed("Add to In Progress"));
        await flush();
        expect(wrapper.emitted("add-card")).toEqual([["doing"]]);
    });

    test("§8.27 no add button without labels.addCard, and none when readonly", async () => {
        const a = build();
        await flush();
        expect(document.querySelector(".kanban-board-add-button")).toBeNull();
        a.unmount();
        wrappers.pop();
        build({ readonly: true, labels: { addCard: (c: KanbanColumn) => `Add to ${c.title}` } });
        await flush();
        expect(document.querySelector(".kanban-board-add-button")).toBeNull();
    });

    test("§8.28 strictLimit refuses a move into a full column, announces it, and marks the option aria-disabled", async () => {
        const columns: KanbanColumn[] = [
            { id: "todo", title: "To Do" },
            { id: "doing", title: "In Progress", wipLimit: 2, strictLimit: true },
        ];
        const wrapper = build({ columns, labels: { ...LABELS, moveBlocked: (t: string, c: string) => `${t} cannot go to ${c}` } });
        await flush();
        key(tabbableCells()[0], { key: "Enter" });
        await flush();
        const option = optionByName("In Progress")!;
        expect(option.getAttribute("aria-disabled")).toBe("true");
        clickEl(option);
        await flush();
        expect(wrapper.emitted("move")).toBeUndefined();
        expect(document.querySelector(".kanban-board-status")?.textContent).toBe("Card One cannot go to In Progress");
    });

    test("§8.29 strictLimit allows a move while the column is under its limit", async () => {
        const columns: KanbanColumn[] = [
            { id: "todo", title: "To Do" },
            { id: "doing", title: "In Progress", wipLimit: 3, strictLimit: true },
        ];
        const wrapper = build({ columns, labels: LABELS });
        await flush();
        key(tabbableCells()[0], { key: "Enter" });
        await flush();
        clickEl(optionByName("In Progress")!);
        await flush();
        expect(wrapper.emitted("move")).toEqual([["c1", "doing"]]);
    });

    test("§8.30 without strictLimit a full column still accepts moves (the WIP limit is only a warning)", async () => {
        const wrapper = build({ labels: LABELS });
        await flush();
        key(tabbableCells()[0], { key: "Enter" });
        await flush();
        clickEl(optionByName("In Progress")!);
        await flush();
        expect(wrapper.emitted("move")).toEqual([["c1", "doing"]]);
    });
});

describe("KanbanBoard — filter, drop position, locked, Alt+Arrow, cardAttrs, card body, flags, allowed columns, async move, footer, empty, search", () => {
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
    const clickEl = (el: Element) => el.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    const status = () => document.querySelector(".kanban-board-status")!.textContent;
    const focusIn = (el: Element) => el.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));

    test("§8.31–§8.33 filter hides cards; counts and limits still use every card; the height follows the view", async () => {
        build({ labels: LABELS, filter: (c: KanbanCard) => c.columnId !== "doing" });
        await flush();
        const heads = Array.from(document.querySelectorAll(".kanban-table-th"));
        expect(titles()).not.toContain("Card Three");
        expect(heads[1].textContent).toContain("2 cards");
        expect(heads[1].hasAttribute("data-over-limit")).toBe(true);
        expect(heads[1].getAttribute("data-hidden-count")).toBe("2");
        expect(heads[0].hasAttribute("data-hidden-count")).toBe(false);
    });

    test("§8.34 compare orders the cards within each column", async () => {
        build({ compare: (a: KanbanCard, b: KanbanCard) => b.title.localeCompare(a.title) });
        await flush();
        const todo = Array.from(document.querySelectorAll<HTMLElement>('.kanban-table-td[data-col="0"] .kanban-board-card-title')).map((e) => e.textContent?.trim());
        expect(todo).toEqual(["Card Two", "Card One"]);
    });

    test("§8.35–§8.37 drop on a card in another column passes its position; on an empty cell appends; in its own column reorders", async () => {
        const w = build();
        await flush();
        drag(cellAt(0, 0), cellAt(1, 1));
        await flush();
        drag(cellAt(0, 0), cellAt(0, 2));
        await flush();
        drag(cellAt(0, 0), cellAt(1, 0));
        await flush();
        expect(w.emitted("move")).toEqual([["c1", "doing", 1], ["c1", "done"]]);
        expect(w.emitted("reorder")).toEqual([["c1", 1]]);
    });

    test("§8.38 the cell under a dragged card carries data-drop-target; readonly refuses drops", async () => {
        build();
        await flush();
        const d = { setData: () => {}, getData: () => "" };
        cellAt(0, 0).querySelector(".kanban-board-card-title")!.dispatchEvent(dragEvent("dragstart", d));
        cellAt(1, 1).dispatchEvent(dragEvent("dragover", d));
        await flush();
        expect(cellAt(1, 1).hasAttribute("data-drop-target")).toBe(true);
        document.body.innerHTML = "";
        const w = build({ readonly: true });
        await flush();
        cellAt(0, 2).dispatchEvent(dragEvent("drop", d));
        expect(w.emitted("move")).toBeUndefined();
    });

    test("§8.39–§8.41 a locked card has data-locked, no move button, no drag, ignores Enter and Alt+Arrow; others still move", async () => {
        const w = build({ labels: LABELS, cards: CARDS.map((c) => (c.id === "c1" ? { ...c, locked: true } : c)) });
        await flush();
        expect(cellAt(0, 0).hasAttribute("data-locked")).toBe(true);
        expect(cellAt(0, 0).querySelector(".kanban-board-move-button")).toBeNull();
        expect(cellAt(0, 0).querySelector("[draggable]")).toBeNull();
        key(cellAt(0, 0), "Enter");
        await flush();
        expect(document.querySelector('[role="listbox"]')).toBeNull();
        key(cellAt(0, 0), "ArrowDown", { altKey: true });
        expect(w.emitted("reorder")).toBeUndefined();
        focusIn(cellAt(1, 0));
        key(cellAt(1, 0), "Enter");
        await flush();
        clickEl(optionByName("Done")!);
        await flush();
        expect(w.emitted("move")).toEqual([["c2", "done"]]);
    });

    test("§8.44–§8.46 Alt+ArrowRight moves to the next column, not past the first; a full hard-limited column refuses and announces", async () => {
        const w = build();
        await flush();
        key(cellAt(0, 0), "ArrowLeft", { altKey: true });
        expect(w.emitted("move")).toBeUndefined();
        key(cellAt(0, 0), "ArrowRight", { altKey: true });
        expect(w.emitted("move")).toEqual([["c1", "doing"]]);
        document.body.innerHTML = "";
        const cs = [{ id: "todo", title: "To Do" }, { id: "doing", title: "In Progress", wipLimit: 2, strictLimit: true }];
        const w2 = build({ columns: cs, labels: { ...LABELS, moveBlocked: (t: string, c: string) => `${t} cannot go to ${c}` } });
        await flush();
        key(cellAt(0, 0), "ArrowRight", { altKey: true });
        await flush();
        expect(w2.emitted("move")).toBeUndefined();
        expect(status()).toBe("Card One cannot go to In Progress");
    });

    test("§8.47 cardAttrs adds attributes to each card's cell", async () => {
        build({ cardAttrs: (c: KanbanCard) => ({ "data-priority": c.id === "c1" ? "high" : "low" }) });
        await flush();
        expect(cell("c1").getAttribute("data-priority")).toBe("high");
        expect(cell("c2").getAttribute("data-priority")).toBe("low");
    });

    test("§8.48 subtitle, badges and a link title render; §8.50 the flag is text, data-flag and aria-describedby; §8.51 column flag and accent", async () => {
        build({ cards: rich, columns: cols });
        await flush();
        expect(cell("c1").querySelector(".kanban-board-card-subtitle")!.textContent).toBe("Source · 80");
        expect(Array.from(cell("c1").querySelectorAll(".kanban-board-card-badge")).map((b) => b.textContent)).toEqual(["P1", "VIP"]);
        expect(cell("c1").querySelector("a.kanban-board-card-link")!.getAttribute("href")).toBe("/t/1");
        const flag = cell("c1").querySelector(".kanban-board-card-flag")!;
        expect(flag.textContent).toBe("SLA breached");
        expect(cell("c1").getAttribute("data-flag")).toBe("SLA breached");
        expect(cell("c1").getAttribute("aria-describedby")).toBe(flag.id);
        const th = document.querySelector(".kanban-table-th")!;
        expect(th.getAttribute("data-flag")).toBe("Over capacity");
        expect(th.getAttribute("data-accent")).toBe("red");
        expect(th.querySelector(".kanban-board-column-flag")!.textContent).toBe("Over capacity");
        expect(cell("c1").getAttribute("data-accent")).toBe("red");
    });

    test("§8.49 the card slot replaces the title content; §8.59 the header and footer slots render per column", async () => {
        const w = mount(KanbanBoard, {
            props: { label: "B", columns: cols, cards: rich },
            slots: {
                card: (c: any) => `[custom ${c.label}]`,
                columnHeader: (c: any) => `[h${c.count}]`,
                columnFooter: (c: any) => `[f${c.count}:${c.cards.map((x: any) => x.id).join(",")}]`,
            },
            attachTo: document.body,
        });
        wrappers.push(w);
        await flush();
        expect(cell("c2").querySelector(".kanban-board-card-title")!.textContent).toBe("[custom Card Two]");
        expect(document.querySelectorAll("tfoot td")).toHaveLength(3);
        expect(document.querySelector("tfoot td")!.textContent).toBe("[f2:c1,c2]");
        expect(document.querySelectorAll(".kanban-table-th")[1].textContent).toContain("[h1]");
    });

    test("§8.52–§8.53 allowedColumns limits the move menu, and a keyboard move elsewhere is refused and announced", async () => {
        build({ labels: LABELS, cards: rich, columns: cols, allowedColumns: (c: KanbanCard) => (c.id === "c1" ? ["doing"] : ["done"]) });
        await flush();
        key(cell("c1"), "Enter");
        await flush();
        expect(Array.from(document.querySelectorAll('[role="option"]')).map((o) => o.textContent?.trim())).toEqual(["To Do", "In Progress"]);
        document.body.innerHTML = "";
        const w = build({ allowedColumns: () => ["done"], labels: { ...LABELS, moveBlocked: (t: string, c: string) => `${t} cannot go to ${c}` } });
        await flush();
        key(cellAt(0, 0), "ArrowRight", { altKey: true });
        await flush();
        expect(w.emitted("move")).toBeUndefined();
        expect(status()).toBe("Card One cannot go to In Progress");
    });

    test("§8.54 card.draggable=false stops pointer dragging but keeps the move menu", async () => {
        build({ labels: LABELS, cards: CARDS.map((c) => (c.id === "c1" ? { ...c, draggable: false } : c)) });
        await flush();
        expect(cell("c1").querySelector("[draggable]")).toBeNull();
        expect(cell("c1").querySelector(".kanban-board-move-button")).toBeTruthy();
    });

    test("§8.55 an async moveHandler shows data-pending and aria-busy in the new column, then clears on resolve", async () => {
        const d = deferred();
        const w = build({ cards: rich, columns: cols, moveHandler: () => d.promise, labels: { ...LABELS, movePending: (t: string, c: string) => `Moving ${t} to ${c}` } });
        await flush();
        focusIn(cell("c2"));
        key(cell("c2"), "ArrowRight", { altKey: true });
        await flush();
        expect(cell("c2").getAttribute("data-pending")).toBe("");
        expect(cell("c2").getAttribute("aria-busy")).toBe("true");
        expect(cell("c2").getAttribute("data-col")).toBe("1");
        expect(status()).toBe("Moving Card Two to In Progress");
        expect(w.emitted("move")).toEqual([["c2", "doing"]]);
        d.resolve();
        await flush();
        expect(cell("c2").hasAttribute("data-pending")).toBe(false);
    });

    test("§8.56 a rejected moveHandler sends the card back, announces moveFailed and emits move-error; §8.57 a pending card cannot move again", async () => {
        const d = deferred();
        const handler = vi.fn(() => d.promise);
        const w = build({ cards: rich, columns: cols, moveHandler: handler, labels: { ...LABELS, moveFailed: (t: string, c: string) => `Could not move ${t} to ${c}` } });
        await flush();
        focusIn(cell("c2"));
        key(cell("c2"), "ArrowRight", { altKey: true });
        await flush();
        key(cell("c2"), "ArrowRight", { altKey: true });
        expect(handler).toHaveBeenCalledTimes(1);
        d.reject(new Error("no"));
        await flush();
        expect(cell("c2").getAttribute("data-col")).toBe("0");
        expect(w.emitted("move-error")![0].slice(0, 2)).toEqual(["c2", "doing"]);
        expect(status()).toBe("Could not move Card Two to In Progress");
    });

    test("§8.58 without a moveHandler (or a synchronous one) there is no pending state", async () => {
        const w = build({ cards: rich, columns: cols });
        await flush();
        focusIn(cell("c2"));
        key(cell("c2"), "ArrowRight", { altKey: true });
        await flush();
        expect(w.emitted("move")).toEqual([["c2", "doing"]]);
        expect(document.querySelector("[data-pending]")).toBeNull();
    });

    test("§8.60–§8.61 labels.emptyColumn shows a message in an empty column, even when no column has cards; none without it", async () => {
        build({ cards: rich, columns: cols, labels: { ...LABELS, emptyColumn: (c: KanbanColumn) => `No cards in ${c.title}` } });
        await flush();
        expect(document.querySelector(".kanban-board-empty")!.textContent).toBe("No cards in Done");
        document.body.innerHTML = "";
        build({ cards: [], columns: cols, labels: { ...LABELS, emptyColumn: (c: KanbanColumn) => `No cards in ${c.title}` } });
        await flush();
        expect(document.querySelectorAll(".kanban-board-empty")).toHaveLength(3);
        expect(bodyRows()).toHaveLength(1);
        document.body.innerHTML = "";
        build({ cards: rich, columns: cols });
        await flush();
        expect(document.querySelector(".kanban-board-empty")).toBeNull();
    });

    test("§8.62 labels.search adds a search field that filters by label, subtitle and badges", async () => {
        build({ cards: rich, columns: cols, labels: { ...LABELS, search: "Search cards" } });
        await flush();
        const input = document.querySelector<HTMLInputElement>('input[type="search"]')!;
        expect(input.getAttribute("aria-label")).toBe("Search cards");
        input.value = "vip";
        input.dispatchEvent(new Event("input", { bubbles: true }));
        await flush();
        expect(titles()).toEqual(["Card One"]);
        expect(document.querySelector(".kanban-table-th")!.getAttribute("data-hidden-count")).toBe("1");
    });
});
