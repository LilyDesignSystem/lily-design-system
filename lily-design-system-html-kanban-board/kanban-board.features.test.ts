import { afterEach, describe, expect, test, vi } from "vitest";

import { KanbanBoard } from "./kanban-board.js";
import type { KanbanCard, KanbanColumn, KanbanLabels } from "./kanban-board.js";

if (!customElements.get("kanban-board")) customElements.define("kanban-board", KanbanBoard);

const COLUMNS: KanbanColumn[] = [
    { id: "todo", title: "To Do" },
    { id: "doing", title: "In Progress" },
    { id: "done", title: "Done" },
];
const CARDS: KanbanCard[] = [
    { id: "c1", columnId: "todo", title: "Design login page", values: { owner: "Zoë" } },
    { id: "c2", columnId: "todo", title: "Café menu", subtitle: "vip" },
    { id: "c3", columnId: "doing", title: "Write docs" },
];
const LABELS: KanbanLabels = {
    search: "Search cards",
    searchAnnouncement: (m, t) => `${m} of ${t} cards`,
    moveButton: (card) => `Move ${card.title}`,
    moveMenuLabel: "Move to column",
    moveAnnouncement: (title, column) => `${title} moved to ${column}`,
    copy: "Copy",
    copyAnnouncement: (n) => `${n} rows copied`,
    copyFailed: "Copy failed",
    exportHeaders: { title: "Title", column: "Column" },
    editAnnouncement: (c, f, t) => `${c} ${f} is ${t}`,
    editRefused: (c, f, m) => `${c} ${f}: ${m}`,
    fieldUndoAnnouncement: (c, f, t) => `Undid ${f}: ${t}`,
    fieldRedoAnnouncement: (c, f, t) => `Redid ${f}: ${t}`,
};

let board: KanbanBoard;
function mount(props: Partial<KanbanBoard> & Record<string, unknown> = {}): KanbanBoard {
    board = document.createElement("kanban-board") as KanbanBoard;
    board.setAttribute("label", "Board");
    document.body.appendChild(board);
    board.columns = (props.columns as KanbanColumn[]) ?? COLUMNS;
    board.cards = (props.cards as KanbanCard[]) ?? CARDS;
    board.labels = (props.labels as KanbanLabels) ?? LABELS;
    for (const [k, v] of Object.entries(props)) if (!["columns", "cards", "labels"].includes(k)) (board as never as Record<string, unknown>)[k] = v;
    return board;
}
const ids = () => Array.from(board.querySelectorAll("[data-card-id]")).map((e) => e.getAttribute("data-card-id"));
const input = () => board.querySelector<HTMLInputElement>(".kanban-board-search")!;
const type = (value: string) => {
    input().value = value;
    input().dispatchEvent(new Event("input", { bubbles: true }));
};
const key = (el: Element, k: string, init: KeyboardEventInit = {}) => el.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true, ...init }));
const status = () => board.querySelector(".kanban-board-status, [aria-live='polite']")?.textContent;
const active = () => board.querySelector<HTMLElement>("[data-row][data-col][tabindex='0']")!;
const cell = (r: number, c: number) => board.querySelector<HTMLElement>(`.kanban-table-body [data-row="${r}"][data-col="${c}"]`)!;
const flush = () => new Promise((r) => setTimeout(r, 0));

afterEach(() => {
    document.body.innerHTML = "";
    document.documentElement.removeAttribute("dir");
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
});

describe("search: words, diacritics, field text, highlight, announce, Escape", () => {
    test("§8.110 every word must appear, in any order", () => {
        mount();
        type("page LOGIN");
        expect(ids()).toEqual(["c1"]);
    });
    test("§8.111 ignores diacritics both ways; the default text includes subtitles and field text", () => {
        mount({ fields: [{ id: "owner", header: "Owner" }] });
        type("cafe");
        expect(ids()).toEqual(["c2"]);
        type("zoe");
        expect(ids()).toEqual(["c1"]);
    });
    test("§8.113 matches in the title are wrapped in <mark class=kanban-board-match>, only while searching", () => {
        mount();
        expect(board.querySelector(".kanban-board-match")).toBeNull();
        type("login");
        const mark = board.querySelector<HTMLElement>("mark.kanban-board-match")!;
        expect(mark.textContent?.toLowerCase()).toBe("login");
        expect(mark.classList.contains("mark")).toBe(true);
    });
    test("§8.114 the result count is announced", () => {
        mount();
        type("docs");
        expect(board.textContent).toContain("1 of 3 cards");
    });
    test("§8.115 Escape in the field clears the search", () => {
        mount();
        type("docs");
        key(input(), "Escape");
        expect(board.search).toBe("");
        expect(ids()).toHaveLength(3);
    });
    test("the search field carries the headless search-input class", () => {
        mount();
        expect(input().classList.contains("search-input")).toBe(true);
    });
});

describe("copy to clipboard", () => {
    test("§8.119 the copy button renders only when labels.copy names it (with exportHeaders)", () => {
        mount({ labels: { ...LABELS, copy: undefined } });
        expect(board.querySelector('[data-kanban-export-format="copy"]')).toBeNull();
    });
    test("§8.120 copy puts the view on the clipboard, tab-separated with a header row, and announces", async () => {
        const writeText = vi.fn(async () => {});
        vi.stubGlobal("navigator", { clipboard: { writeText } });
        mount();
        board.querySelector<HTMLElement>('[data-kanban-export-format="copy"]')!.click();
        await flush();
        const text = (writeText.mock.calls[0] as unknown as [string])[0];
        expect(text.split("\r\n")[0]).toBe("Title\tColumn");
        expect(text).toContain("Design login page\tTo Do");
        expect(board.textContent).toContain("3 rows copied");
    });
    test("§8.121 onCopy can take over and the search narrows what is copied", async () => {
        const writeText = vi.fn(async () => {});
        vi.stubGlobal("navigator", { clipboard: { writeText } });
        const onCopy = vi.fn(() => false);
        mount({ onCopy });
        type("docs");
        board.querySelector<HTMLElement>('[data-kanban-export-format="copy"]')!.click();
        await flush();
        expect((onCopy.mock.calls[0] as unknown as [{ text: string }])[0].text).not.toContain("login");
        expect(writeText).not.toHaveBeenCalled();
    });
});

describe("keyboard: page keys, type-ahead, right-to-left", () => {
    const many: KanbanCard[] = Array.from({ length: 25 }, (_, i) => ({ id: `m${i}`, columnId: "todo", title: i === 3 ? "Beta" : i === 5 ? "Bravo" : `Item ${i}` }));
    test("§8.122 PageDown moves ten rows and PageUp moves back; both clamp", () => {
        mount({ cards: many });
        key(active(), "PageDown");
        expect(active().getAttribute("data-row")).toBe("10");
        key(active(), "PageDown");
        key(active(), "PageDown");
        expect(active().getAttribute("data-row")).toBe("24");
        key(active(), "PageUp");
        expect(active().getAttribute("data-row")).toBe("14");
    });
    test("§8.123 typing a letter moves to the next card in the column whose label starts with it", () => {
        mount({ cards: many });
        key(active(), "b");
        expect(active().getAttribute("data-row")).toBe("3");
        key(active(), "r");
        expect(active().getAttribute("data-row")).toBe("5");
    });
    test("§8.143 right-to-left: ArrowLeft goes to the next column", () => {
        document.documentElement.setAttribute("dir", "rtl");
        mount();
        key(active(), "ArrowLeft");
        expect(active().getAttribute("data-col")).toBe("1");
        key(active(), "ArrowRight");
        expect(active().getAttribute("data-col")).toBe("0");
    });
});

describe("in-place edit: validate, undo, redo", () => {
    const fields = [{ id: "cost", header: "Cost", type: "number" as const, validate: (v: unknown) => (typeof v === "number" && v < 0 ? "must not be negative" : undefined) }];
    const cards: KanbanCard[] = [{ id: "c1", columnId: "todo", title: "Card", values: { cost: 5 } }];
    function edit(value: string): HTMLInputElement {
        key(cell(0, 0), "F2");
        const field = board.querySelector<HTMLInputElement>(".kanban-board-field-editor")!;
        field.value = value;
        field.dispatchEvent(new Event("input", { bubbles: true }));
        key(field, "Enter");
        return field;
    }
    test("§8.128 a value validate refuses keeps the editor open, aria-invalid, and announces the reason", () => {
        mount({ cards, fields, onFieldEdit: vi.fn() });
        edit("-1");
        const field = board.querySelector<HTMLInputElement>(".kanban-board-field-editor")!;
        expect(field.getAttribute("aria-invalid")).toBe("true");
        expect(board.textContent).toContain("must not be negative");
    });
    test("§8.130 Ctrl+Z reports the earlier value through onFieldEdit, Ctrl+Shift+Z redoes", () => {
        const onFieldEdit = vi.fn();
        mount({ cards, fields, onFieldEdit });
        edit("9");
        key(cell(0, 0), "z", { ctrlKey: true });
        expect(onFieldEdit).toHaveBeenLastCalledWith({ cardId: "c1", fieldId: "cost", value: 5, previous: 9 });
        expect(board.textContent).toContain("Undid Cost: 5");
        key(cell(0, 0), "z", { ctrlKey: true, shiftKey: true });
        expect(onFieldEdit).toHaveBeenLastCalledWith({ cardId: "c1", fieldId: "cost", value: 9, previous: 5 });
    });
});

describe("live drop cue", () => {
    test("§8.137 a refused drop carries data-drop-blocked, not data-drop-target, and keeps the not-allowed cursor", () => {
        mount({ canMove: (_c: KanbanCard, to: KanbanColumn) => to.id !== "done" });
        const card = board.querySelector<HTMLElement>('[draggable="true"]')!;
        card.dispatchEvent(new Event("dragstart", { bubbles: true }));
        const ok = new Event("dragover", { bubbles: true, cancelable: true });
        cell(0, 1).dispatchEvent(ok);
        expect(cell(0, 1).hasAttribute("data-drop-target")).toBe(true);
        expect(ok.defaultPrevented).toBe(true);
        const blocked = new Event("dragover", { bubbles: true, cancelable: true });
        cell(0, 2).dispatchEvent(blocked);
        expect(cell(0, 2).hasAttribute("data-drop-blocked")).toBe(true);
        expect(cell(0, 2).hasAttribute("data-drop-target")).toBe(false);
        expect(blocked.defaultPrevented).toBe(false);
    });
});
