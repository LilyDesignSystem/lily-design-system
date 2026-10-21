import { readFileSync } from "node:fs";
import Alpine from "alpinejs";
import { afterEach, beforeAll, describe, expect, test, vi } from "vitest";
import lilyKanbanBoard, { createKanbanBoard } from "./index.js";
import type { KanbanOptions } from "./index.js";

const SNIPPET = readFileSync("snippet.html", "utf8");
const tick = () => new Promise((resolve) => setTimeout(resolve, 0));
const settle = async () => { await tick(); await tick(); };

const LABELS = {
    grid: "Board",
    caption: "Work",
    cardCount: (n: number) => n + " cards",
    overLimit: (n: number, limit: number) => n + " over " + limit,
    moveButton: (title: string) => "Move " + title,
    moveMenu: "Move to",
    moveAnnouncement: (card: string, column: string) => card + " moved to " + column,
    moveBlocked: (card: string, column: string) => card + " cannot go to " + column,
};

const options = (extra: Partial<KanbanOptions> = {}): KanbanOptions => ({
    columns: [
        { id: "todo", title: "To do" },
        { id: "doing", title: "Doing", wipLimit: 1 },
        { id: "done", title: "Done" },
    ],
    cards: [
        { id: "c1", columnId: "todo", title: "Alpha" },
        { id: "c2", columnId: "todo", title: "Bravo" },
        { id: "c3", columnId: "doing", title: "Charlie" },
    ],
    labels: LABELS,
    ...extra,
});

beforeAll(() => {
    (window as unknown as { Alpine: typeof Alpine }).Alpine = Alpine;
    Alpine.plugin(lilyKanbanBoard);
    Alpine.start();
});

afterEach(async () => {
    document.body.innerHTML = "";
    await tick();
});

async function mount(extra: Partial<KanbanOptions> = {}) {
    (window as unknown as { boardOptions: KanbanOptions }).boardOptions = options(extra);
    document.body.innerHTML = SNIPPET;
    await settle();
    return document.querySelector(".kanban-board") as HTMLElement;
}

const state = () => Alpine.$data(document.querySelector(".kanban-board") as HTMLElement) as ReturnType<typeof createKanbanBoard>;
const cell = (row: number, col: number) => document.querySelector(`[data-row="${row}"][data-col="${col}"]`) as HTMLElement;
const cardTitles = (col: number) => [...document.querySelectorAll(`td[data-col="${col}"] .kanban-card-title`)].map((e) => e.textContent);
const press = async (target: Element, key: string, init: KeyboardEventInit = {}) => {
    target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init }));
    await settle();
};

describe("rendering", () => {
    test("is a role=grid with a header per column and a rectangular grid of cells", async () => {
        await mount();
        const table = document.querySelector("table") as HTMLElement;
        expect(table.getAttribute("role")).toBe("grid");
        expect(table.getAttribute("aria-label")).toBe("Board");
        expect(table.getAttribute("aria-colcount")).toBe("3");
        expect([...document.querySelectorAll("th")].map((h) => h.querySelector(".kanban-board-column-title")?.textContent)).toEqual(["To do", "Doing", "Done"]);
        expect(document.querySelectorAll("tbody tr")).toHaveLength(2);
        expect(document.querySelectorAll("tbody td")).toHaveLength(6);
        expect(cardTitles(0)).toEqual(["Alpha", "Bravo"]);
        expect(cardTitles(1)).toEqual(["Charlie"]);
        expect(document.querySelector("caption")?.textContent).toBe("Work");
    });

    test("shows card counts and a WIP-limit warning only when over", async () => {
        await mount();
        expect([...document.querySelectorAll(".kanban-board-count")].map((e) => e.textContent)).toEqual(["2 cards", "1 cards", "0 cards"]);
        const over = () => [...document.querySelectorAll("th")].filter((h) => h.hasAttribute("data-over-limit"));
        expect(over()).toHaveLength(0);
        state().move("c1", "doing");
        await settle();
        expect(over()[0].textContent).toContain("2 over 1");
    });

    test("headless: labels absent means the controls and text are absent", async () => {
        await mount({ labels: { grid: "Board" } });
        expect(document.querySelector(".kanban-move-button")).toBeNull();
        expect(document.querySelector(".kanban-board-count")).toBeNull();
        expect(document.querySelector("caption")).toBeNull();
    });
});

describe("moving with the menu", () => {
    test("Enter on a card opens a listbox of the other columns and names the control", async () => {
        await mount();
        cell(0, 0).focus();
        expect(document.querySelector(".kanban-move-button")?.getAttribute("aria-label")).toBe("Move Alpha");
        await press(cell(0, 0), "Enter");
        const menu = document.querySelector(".kanban-move-menu") as HTMLElement;
        expect(menu.getAttribute("role")).toBe("listbox");
        expect([...menu.querySelectorAll("[role=option]")].map((o) => o.textContent)).toEqual(["Doing", "Done"]);
        expect(cell(0, 0).getAttribute("aria-expanded")).toBe("true");
        expect(cell(0, 0).getAttribute("aria-activedescendant")).toBe(menu.querySelector("[role=option]")?.id);
    });

    test("arrows move the cursor, Enter chooses, focus follows the card and it is announced", async () => {
        const board = await mount();
        const seen = vi.fn();
        board.addEventListener("lily:move", (e) => seen((e as CustomEvent).detail));
        cell(0, 0).focus();
        await press(cell(0, 0), "Enter");
        await press(cell(0, 0), "ArrowDown");
        await press(cell(0, 0), "Enter");
        expect(cardTitles(0)).toEqual(["Bravo"]);
        expect(cardTitles(2)).toEqual(["Alpha"]);
        expect(document.activeElement).toBe(cell(0, 2));
        expect(document.querySelector(".kanban-board-status")?.textContent).toBe("Alpha moved to Done");
        expect(seen).toHaveBeenCalledWith({ cardId: "c1", toColumnId: "done" });
        expect(document.querySelector(".kanban-move-menu")).toBeNull();
    });

    test("Escape closes without moving; Home and End jump the cursor", async () => {
        await mount();
        cell(0, 0).focus();
        await press(cell(0, 0), " ");
        await press(cell(0, 0), "End");
        expect(state().menu?.index).toBe(1);
        await press(cell(0, 0), "Home");
        expect(state().menu?.index).toBe(0);
        await press(cell(0, 0), "Escape");
        expect(document.querySelector(".kanban-move-menu")).toBeNull();
        expect(cardTitles(0)).toEqual(["Alpha", "Bravo"]);
        expect(document.activeElement).toBe(cell(0, 0));
    });

    test("clicking the move button or an option works for the pointer", async () => {
        await mount();
        (document.querySelector(".kanban-move-button") as HTMLElement).click(); await settle();
        (document.querySelectorAll(".kanban-move-option")[1] as HTMLElement).click(); await settle();
        expect(cardTitles(2)).toEqual(["Alpha"]);
    });

    test("Enter does nothing without a moveButton label (the control is absent)", async () => {
        await mount({ labels: { grid: "Board" } });
        cell(0, 0).focus();
        await press(cell(0, 0), "Enter");
        expect(state().menu).toBeNull();
    });
});

describe("moving with Alt+Arrow", () => {
    test("Alt+ArrowRight and Alt+ArrowLeft move the card one column", async () => {
        await mount();
        cell(0, 0).focus();
        await press(cell(0, 0), "ArrowRight", { altKey: true });
        expect(cardTitles(1)).toEqual(["Charlie", "Alpha"]);
        expect(document.activeElement).toBe(cell(1, 1));
        await press(cell(1, 1), "ArrowLeft", { altKey: true });
        expect(cardTitles(0)).toEqual(["Bravo", "Alpha"]);
    });

    test("right-to-left makes Alt+ArrowLeft move forward", async () => {
        document.documentElement.setAttribute("dir", "rtl");
        try {
            await mount();
            cell(0, 0).focus();
            await press(cell(0, 0), "ArrowLeft", { altKey: true });
            expect(cardTitles(1)).toContain("Alpha");
        } finally {
            document.documentElement.removeAttribute("dir");
        }
    });

    test("no column beyond the ends: the card stays", async () => {
        await mount();
        cell(0, 0).focus();
        await press(cell(0, 0), "ArrowLeft", { altKey: true });
        expect(cardTitles(0)).toEqual(["Alpha", "Bravo"]);
    });
});

describe("rules", () => {
    test("canMove refuses a move and announces it", async () => {
        await mount({ canMove: (card, to) => !(card.id === "c1" && to.id === "done") });
        expect(state().move("c1", "done")).toBe(false);
        await settle();
        expect(cardTitles(2)).toEqual([]);
        expect(document.querySelector(".kanban-board-status")?.textContent).toBe("Alpha cannot go to Done");
        expect(state().move("c1", "doing")).toBe(true);
    });

    test("a strict WIP limit refuses a card into a full column; without strict it only warns", async () => {
        await mount({ strictWip: true });
        expect(state().move("c1", "doing")).toBe(false);
        expect(state().accepts("c1", "done")).toBe(true);
        await mount();
        expect(state().move("c1", "doing")).toBe(true);
    });

    test("moving to the card's own column is not a move", async () => {
        await mount();
        expect(state().move("c1", "todo")).toBe(false);
        expect(document.querySelector(".kanban-board-status")?.textContent).toBe("");
    });
});

describe("drag and drop", () => {
    const dragEvent = (type: string) => {
        const event = new Event(type, { bubbles: true, cancelable: true }) as Event & { dataTransfer: Record<string, unknown> };
        event.dataTransfer = { setData: vi.fn(), effectAllowed: "", dropEffect: "" };
        return event;
    };

    test("dragging a card onto an accepting column moves it", async () => {
        await mount();
        (document.querySelector(".kanban-card") as HTMLElement).dispatchEvent(dragEvent("dragstart"));
        const over = dragEvent("dragover");
        cell(0, 2).dispatchEvent(over);
        await settle();
        expect(over.defaultPrevented).toBe(true);
        expect(cell(0, 2).hasAttribute("data-drop-target")).toBe(true);
        expect(cell(0, 1).hasAttribute("data-drop-target")).toBe(false);
        cell(0, 2).dispatchEvent(dragEvent("drop"));
        await settle();
        expect(cardTitles(2)).toEqual(["Alpha"]);
        expect(state().dragging).toBeNull();
    });

    test("a refused drop target is marked blocked and not cancelled", async () => {
        await mount({ canMove: (_card, to) => to.id !== "done" });
        (document.querySelector(".kanban-card") as HTMLElement).dispatchEvent(dragEvent("dragstart"));
        await settle();
        const over = dragEvent("dragover");
        cell(0, 2).dispatchEvent(over);
        await settle();
        expect(over.defaultPrevented).toBe(false);
        expect(cell(0, 2).hasAttribute("data-drop-blocked")).toBe(true);
        expect(cell(0, 1).hasAttribute("data-drop-blocked")).toBe(false);
        (document.querySelector(".kanban-card") as HTMLElement).dispatchEvent(dragEvent("dragend"));
        await settle();
        expect(cell(0, 2).hasAttribute("data-drop-blocked")).toBe(false);
    });
});

describe("keyboard navigation", () => {
    test("one tab stop; arrows move across columns and down within one; Home and End are per column", async () => {
        await mount();
        expect([...document.querySelectorAll("[tabindex='0']")]).toEqual([cell(-1, 0)]);
        cell(-1, 0).focus();
        await press(cell(-1, 0), "ArrowDown");
        expect(document.activeElement).toBe(cell(0, 0));
        await press(cell(0, 0), "ArrowRight");
        expect(document.activeElement).toBe(cell(0, 1));
        await press(cell(0, 1), "End");
        expect(document.activeElement).toBe(cell(1, 1));
        await press(cell(1, 1), "Home");
        expect(document.activeElement).toBe(cell(-1, 1));
        await press(cell(-1, 1), "End", { ctrlKey: true });
        expect(document.activeElement).toBe(cell(1, 2));
    });

    test("type-ahead jumps to the next card in the column whose title starts with the letters", async () => {
        await mount();
        cell(0, 0).focus();
        await press(cell(0, 0), "b");
        expect(document.activeElement).toBe(cell(1, 0));
    });
});
