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
