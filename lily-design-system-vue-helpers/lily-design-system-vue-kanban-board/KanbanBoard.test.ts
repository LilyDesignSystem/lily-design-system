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
        document.activeElement!.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
        await flush();
        expect(document.querySelector(".kanban-board-status")?.textContent).toBe("");
    });

    test("§8.12 extra attributes spread onto the root", () => {
        build({ "data-testid": "board-root" });
        expect(document.querySelector('[data-testid="board-root"]')).toBeTruthy();
    });
});
