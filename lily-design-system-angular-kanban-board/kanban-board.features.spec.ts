import { ComponentFixture, TestBed } from "@angular/core/testing";
import { fireEvent as domFireEvent, screen } from "@testing-library/dom";
import { afterEach, describe, expect, test, vi } from "vitest";

import { KanbanBoard, type KanbanCard, type KanbanColumn, type KanbanLabels } from "./kanban-board.component";

let fixtures: ComponentFixture<KanbanBoard>[] = [];

/** The Svelte suite's `render(KanbanBoard, { props })`: mounts the board, wiring callback props to outputs. */
function render(
  _component: unknown,
  options: { props: Record<string, unknown> },
): { unmount: () => void; container: HTMLElement; rerender: (props: Record<string, unknown>) => Promise<void> } {
  const fixture = TestBed.createComponent(KanbanBoard);
  const instance = fixture.componentInstance;
  for (const [key, value] of Object.entries(options.props)) {
    if (key === "onFieldEdit") {
      fixture.componentRef.setInput("editableFields", true);
      instance.fieldEdit.subscribe(value as never);
    } else if (key === "onTitleEdit") {
      fixture.componentRef.setInput("editableTitles", true);
      instance.titleEdit.subscribe(value as never);
    } else if (key === "onMove") {
      instance.move.subscribe((e) => (value as (...args: unknown[]) => void)(e.cardId, e.toColumnId, e.toIndex, e.toLaneId));
    } else fixture.componentRef.setInput(key, value);
  }
  fixture.detectChanges();
  fixtures.push(fixture);
  return {
    unmount: () => fixture.destroy(),
    container: fixture.nativeElement as HTMLElement,
    rerender: async (props) => {
      for (const [key, value] of Object.entries(props)) {
        if (key === "onFieldEdit" || key === "onMove" || key === "onTitleEdit") continue;
        fixture.componentRef.setInput(key, value);
      }
      fixture.detectChanges();
      await Promise.resolve();
    },
  };
}

function settle(): void {
  for (const f of fixtures) f.detectChanges();
}

/** `@testing-library/dom`'s fireEvent, followed by a change-detection pass (Angular does not re-render on its own in a test). */
const fireEvent = new Proxy({} as typeof domFireEvent, {
  get: (_target, name: string) => async (el: Element, init?: unknown) => {
    const fn = (domFireEvent as unknown as Record<string, (e: Element, i?: unknown) => boolean>)[name];
    const result = fn(el, init);
    settle();
    await Promise.resolve();
    settle();
    return result;
  },
});

const nextTick = async () => {
  await Promise.resolve();
  settle();
};

afterEach(() => {
  vi.restoreAllMocks();
  for (const f of fixtures) f.destroy();
  fixtures = [];
});

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

describe("KanbanBoard — search: words, diacritics, fields, highlight, announce, Escape (§8.110–§8.118)", () => {
    const cols: KanbanColumn[] = [
        { id: "todo", title: "To Do" },
        { id: "doing", title: "In Progress" },
    ];
    const cards: KanbanCard[] = [
        { id: "c1", columnId: "todo", title: "Design login page", values: { owner: "Zoë" } },
        { id: "c2", columnId: "todo", title: "Café menu", subtitle: "vip" },
        { id: "c3", columnId: "doing", title: "Write docs" },
    ];
    const L: KanbanLabels = { ...LABELS, search: "Search cards", searchAnnouncement: (m, t) => `${m} of ${t} cards` };
    const base = { label: "Board", columns: cols, cards, labels: L };
    const ids = () => Array.from(document.querySelectorAll("[data-card-id]")).map((e) => e.getAttribute("data-card-id"));
    const input = () => screen.getByRole("searchbox", { name: "Search cards" }) as HTMLInputElement;

    test("§8.110 every word must appear, in any order", async () => {
        render(KanbanBoard, { props: base });
        await fireEvent.input(input(), { target: { value: "page LOGIN" } });
        expect(ids()).toEqual(["c1"]);
    });

    test("§8.111 ignores diacritics both ways", async () => {
        render(KanbanBoard, { props: base });
        await fireEvent.input(input(), { target: { value: "cafe" } });
        expect(ids()).toEqual(["c2"]);
    });

    test("§8.112 the default text includes typed field text", async () => {
        render(KanbanBoard, { props: { ...base, fields: [{ id: "owner", header: "Owner" }] } });
        await fireEvent.input(input(), { target: { value: "zoe" } });
        expect(ids()).toEqual(["c1"]);
    });

    test("§8.113 matches in the title are wrapped in <mark class=kanban-board-match>, only while searching", async () => {
        render(KanbanBoard, { props: base });
        expect(document.querySelector("mark")).toBeNull();
        await fireEvent.input(input(), { target: { value: "wri" } });
        expect(document.querySelector("mark.kanban-board-match")?.textContent).toBe("Wri");
    });

    test("§8.114 the result count is announced", async () => {
        render(KanbanBoard, { props: base });
        await fireEvent.input(input(), { target: { value: "docs" } });
        await new Promise((r) => setTimeout(r, 0));
        expect(document.querySelector(".kanban-board-status")?.textContent).toBe("1 of 3 cards");
    });

    test("§8.115 Escape in the field clears the search", async () => {
        render(KanbanBoard, { props: base });
        await fireEvent.input(input(), { target: { value: "docs" } });
        await fireEvent.keyDown(input(), { key: "Escape" });
        expect(input().value).toBe("");
        expect(ids().sort()).toEqual(["c1", "c2", "c3"]);
    });

    test("§8.116 searchText replaces what is looked in", async () => {
        render(KanbanBoard, { props: { ...base, searchText: (c: KanbanCard) => c.id } });
        await fireEvent.input(input(), { target: { value: "c3" } });
        expect(ids()).toEqual(["c3"]);
    });

    test("§8.117 a linked card's title highlights inside the link", async () => {
        render(KanbanBoard, { props: { ...base, cards: cards.map((c) => (c.id === "c3" ? { ...c, href: "/docs" } : c)) } });
        await fireEvent.input(input(), { target: { value: "docs" } });
        expect(document.querySelector("a.kanban-board-card-link mark")?.textContent).toBe("docs");
    });

    test("§8.118 the search prop works without the field", () => {
        render(KanbanBoard, { props: { ...base, labels: LABELS, search: "docs" } });
        expect(ids()).toEqual(["c3"]);
    });
});

describe("KanbanBoard — copy to clipboard (§8.119–§8.121)", () => {
    const cols: KanbanColumn[] = [{ id: "todo", title: "To Do" }, { id: "doing", title: "Doing" }];
    const cards: KanbanCard[] = [
        { id: "c1", columnId: "todo", title: "One" },
        { id: "c2", columnId: "doing", title: "Two" },
    ];
    const L: KanbanLabels = { ...LABELS, export: "Export", copy: "Copy", exportHeaders: { title: "Title", column: "Column" }, copyAnnouncement: (n) => `${n} cards copied`, copyFailed: "Copy failed" };
    const base = { label: "Board", columns: cols, cards, labels: L };
    const wait = () => new Promise((r) => setTimeout(r, 0));

    test("§8.119 copy needs labels.copy and exportHeaders", () => {
        render(KanbanBoard, { props: { ...base, labels: { ...LABELS, copy: "Copy" } } });
        expect(document.querySelector('[data-kanban-export-format="copy"]')).toBeNull();
    });

    test("§8.120 copy puts the view on the clipboard, tab-separated with a header row, and announces", async () => {
        const writeText = vi.fn(async () => {});
        vi.stubGlobal("navigator", { clipboard: { writeText } });
        render(KanbanBoard, { props: base });
        await fireEvent.click(screen.getByText("Copy"));
        await wait();
        const text = (writeText.mock.calls[0] as unknown as [string])[0];
        expect(text.split("\r\n")[0]).toBe("Title\tColumn");
        expect(text).toContain("One\tTo Do");
        expect(document.querySelector(".kanban-board-status")?.textContent).toBe("2 cards copied");
        vi.unstubAllGlobals();
    });

    test("§8.121 onCopy can take over, and the search narrows what is copied", async () => {
        const writeText = vi.fn(async () => {});
        vi.stubGlobal("navigator", { clipboard: { writeText } });
        const onCopy = vi.fn(() => false);
        render(KanbanBoard, { props: { ...base, copyHandler: onCopy } });
        await fireEvent.click(screen.getByText("Copy"));
        await wait();
        expect(writeText).not.toHaveBeenCalled();
        document.body.innerHTML = "";
        render(KanbanBoard, { props: { ...base, search: "two" } });
        await fireEvent.click(screen.getByText("Copy"));
        await wait();
        const text = (writeText.mock.calls[0] as unknown as [string])[0];
        expect(text).toContain("Two");
        expect(text).not.toContain("One");
        vi.unstubAllGlobals();
    });
});

describe("KanbanBoard — PageUp / PageDown and type-ahead (§8.122–§8.127)", () => {
    const cols: KanbanColumn[] = [{ id: "todo", title: "To Do" }, { id: "doing", title: "Doing" }];
    const many: KanbanCard[] = Array.from({ length: 30 }, (_, i) => ({ id: `c${i}`, columnId: "todo", title: i % 2 ? `Beta ${i}` : `Alpha ${i}` }));
    const base = { label: "Board", columns: cols, cards: many, labels: LABELS };
    const cells = () => Array.from(document.querySelectorAll<HTMLElement>("[data-row][data-col]"));
    const active = () => document.querySelector<HTMLElement>('[data-row][data-col][tabindex="0"]')!;
    const rowOf = (el: HTMLElement) => Number(el.dataset.row);

    test("§8.122 PageDown moves ten rows and PageUp moves back; both clamp", async () => {
        render(KanbanBoard, { props: base });
        await fireEvent.keyDown(cells()[0], { key: "PageDown" });
        expect(rowOf(active())).toBe(10);
        await fireEvent.keyDown(active(), { key: "PageUp" });
        expect(rowOf(active())).toBe(0);
        await fireEvent.keyDown(active(), { key: "PageUp" });
        expect(rowOf(active())).toBe(0);
    });

    test("§8.123 typing a letter moves to the next card in the column whose label starts with it", async () => {
        render(KanbanBoard, { props: base });
        await fireEvent.keyDown(cells()[0], { key: "b" });
        expect(rowOf(active())).toBe(1);
    });

    test("§8.124 letters typed in quick succession form one prefix", async () => {
        const cards: KanbanCard[] = [
            { id: "a", columnId: "todo", title: "Design" },
            { id: "b", columnId: "todo", title: "Deploy" },
            { id: "c", columnId: "todo", title: "Docs" },
        ];
        render(KanbanBoard, { props: { ...base, cards } });
        await fireEvent.keyDown(cells()[0], { key: "d" });
        await fireEvent.keyDown(active(), { key: "e" });
        await fireEvent.keyDown(active(), { key: "p" });
        expect(rowOf(active())).toBe(1);
    });

    test("§8.125 a lone x is still the select shortcut when cards are selectable", async () => {
        const cards: KanbanCard[] = [
            { id: "a", columnId: "todo", title: "Alpha" },
            { id: "b", columnId: "todo", title: "Xylophone" },
        ];
        render(KanbanBoard, { props: { ...base, cards, selectable: true } });
        await fireEvent.keyDown(cells()[0], { key: "x" });
        expect(rowOf(active())).toBe(0);
    });

    test("§8.126 without selectable, x is ordinary type-ahead", async () => {
        const cards: KanbanCard[] = [
            { id: "a", columnId: "todo", title: "Alpha" },
            { id: "b", columnId: "todo", title: "Xylophone" },
        ];
        render(KanbanBoard, { props: { ...base, cards } });
        await fireEvent.keyDown(cells()[0], { key: "x" });
        expect(rowOf(active())).toBe(1);
    });

    test("§8.127 a Ctrl or Alt key is never type-ahead, and an unmatched prefix does nothing", async () => {
        render(KanbanBoard, { props: base });
        await fireEvent.keyDown(cells()[0], { key: "b", ctrlKey: true });
        expect(rowOf(active())).toBe(0);
        await fireEvent.keyDown(cells()[0], { key: "z" });
        expect(rowOf(active())).toBe(0);
    });
});

describe("KanbanBoard — in-place edit: validate, undo, redo (§8.128–§8.136)", () => {
    const cols: KanbanColumn[] = [{ id: "todo", title: "To Do" }, { id: "doing", title: "Doing" }];
    const cards: KanbanCard[] = [{ id: "c1", columnId: "todo", title: "One", values: { points: 3 } }];
    const FIELD = { id: "points", header: "Points", type: "number" as const, validate: (v: unknown) => (typeof v === "number" && v < 0 ? "Must not be negative" : undefined) };
    const L: KanbanLabels = {
        ...LABELS,
        editAnnouncement: (t, h, text) => `${t} ${h} is ${text}`,
        editInvalid: (t, h) => `${t}: bad ${h}`,
        editRefused: (t, h, m) => `${t} ${h}: ${m}`,
        fieldUndoAnnouncement: (t, h, text) => `Undid ${t} ${h}: ${text}`,
        fieldRedoAnnouncement: (t, h, text) => `Redid ${t} ${h}: ${text}`,
    };
    const base = { label: "Board", columns: cols, cards, fields: [FIELD], labels: L };
    const status = () => document.querySelector(".kanban-board-status")?.textContent;
    const button = () => document.querySelector<HTMLElement>(".kanban-board-field-button")!;
    const cell = () => document.querySelector<HTMLElement>("[data-row][data-col]")!;

    async function edit(value: string): Promise<HTMLInputElement> {
        await fireEvent.click(button());
        const input = document.querySelector<HTMLInputElement>(".kanban-board-field-editor")!;
        await fireEvent.input(input, { target: { value } });
        await fireEvent.keyDown(input, { key: "Enter" });
        return input;
    }

    test("§8.128 a value validate refuses keeps the editor open, aria-invalid, and announces the reason", async () => {
        const onFieldEdit = vi.fn();
        render(KanbanBoard, { props: { ...base, onFieldEdit } });
        await edit("-4");
        expect(onFieldEdit).not.toHaveBeenCalled();
        expect(document.querySelector(".kanban-board-field-editor")?.getAttribute("aria-invalid")).toBe("true");
        expect(status()).toBe("One Points: Must not be negative");
    });

    test("§8.129 typing again clears aria-invalid, and an acceptable value then commits", async () => {
        const onFieldEdit = vi.fn();
        render(KanbanBoard, { props: { ...base, onFieldEdit } });
        const input = await edit("-4");
        await fireEvent.input(input, { target: { value: "5" } });
        expect(input.getAttribute("aria-invalid")).toBeNull();
        await fireEvent.keyDown(input, { key: "Enter" });
        expect(onFieldEdit).toHaveBeenCalledWith({ cardId: "c1", fieldId: "points", value: 5, previous: 3 });
    });

    test("§8.130 Ctrl+Z reports the earlier value through onFieldEdit and announces it", async () => {
        const onFieldEdit = vi.fn();
        render(KanbanBoard, { props: { ...base, onFieldEdit } });
        await edit("8");
        await fireEvent.keyDown(cell(), { key: "z", ctrlKey: true });
        expect(onFieldEdit).toHaveBeenLastCalledWith({ cardId: "c1", fieldId: "points", value: 3, previous: 8 });
        expect(status()).toBe("Undid One Points: 3");
    });

    test("§8.131 Ctrl+Shift+Z and Ctrl+Y redo", async () => {
        const onFieldEdit = vi.fn();
        render(KanbanBoard, { props: { ...base, onFieldEdit } });
        await edit("8");
        await fireEvent.keyDown(cell(), { key: "z", ctrlKey: true });
        await fireEvent.keyDown(cell(), { key: "z", ctrlKey: true, shiftKey: true });
        expect(onFieldEdit).toHaveBeenLastCalledWith({ cardId: "c1", fieldId: "points", value: 8, previous: 3 });
        expect(status()).toBe("Redid One Points: 8");
        await fireEvent.keyDown(cell(), { key: "z", ctrlKey: true });
        await fireEvent.keyDown(cell(), { key: "y", ctrlKey: true });
        expect(onFieldEdit).toHaveBeenLastCalledWith({ cardId: "c1", fieldId: "points", value: 8, previous: 3 });
    });

    test("§8.132 undo walks back through several edits, newest first", async () => {
        const onFieldEdit = vi.fn();
        render(KanbanBoard, { props: { ...base, onFieldEdit } });
        await edit("5");
        await edit("9");
        await fireEvent.keyDown(cell(), { key: "z", ctrlKey: true });
        expect(onFieldEdit).toHaveBeenLastCalledWith({ cardId: "c1", fieldId: "points", value: 3, previous: 9 });
        await fireEvent.keyDown(cell(), { key: "z", ctrlKey: true });
        expect(onFieldEdit).toHaveBeenLastCalledWith({ cardId: "c1", fieldId: "points", value: 3, previous: 5 });
    });

    test("§8.133 with nothing to undo Ctrl+Z does nothing, and a new edit ends the redo chain", async () => {
        const onFieldEdit = vi.fn();
        render(KanbanBoard, { props: { ...base, onFieldEdit } });
        await fireEvent.keyDown(cell(), { key: "z", ctrlKey: true });
        expect(onFieldEdit).not.toHaveBeenCalled();
        await edit("5");
        await fireEvent.keyDown(cell(), { key: "z", ctrlKey: true });
        await edit("7");
        onFieldEdit.mockClear();
        await fireEvent.keyDown(cell(), { key: "y", ctrlKey: true });
        expect(onFieldEdit).not.toHaveBeenCalled();
    });

    test("§8.134 with undoable on and a move to take back, Ctrl+Z takes the move back first, then the field edit", async () => {
        const onFieldEdit = vi.fn();
        const onMove = vi.fn();
        const { rerender } = render(KanbanBoard, { props: { ...base, onFieldEdit, onMove, undoable: true } });
        await edit("8");
        await fireEvent.keyDown(cell(), { key: "ArrowRight", altKey: true });
        expect(onMove).toHaveBeenCalledTimes(1);
        await rerender({ ...base, cards: cards.map((c) => ({ ...c, columnId: "doing" })), onFieldEdit, onMove, undoable: true });
        onFieldEdit.mockClear();
        await fireEvent.keyDown(cell(), { key: "z", ctrlKey: true });
        await new Promise((r) => setTimeout(r, 0));
        expect(onMove).toHaveBeenCalledTimes(2);
        expect(onFieldEdit).not.toHaveBeenCalled();
        await fireEvent.keyDown(cell(), { key: "z", ctrlKey: true });
        expect(onFieldEdit).toHaveBeenLastCalledWith({ cardId: "c1", fieldId: "points", value: 3, previous: 8 });
    });

    test("§8.135 undo and redo do nothing in a readonly board or without onFieldEdit", async () => {
        const onFieldEdit = vi.fn();
        render(KanbanBoard, { props: { ...base, readonly: true, onFieldEdit } });
        await fireEvent.keyDown(cell(), { key: "z", ctrlKey: true });
        expect(onFieldEdit).not.toHaveBeenCalled();
    });

    test("§8.136 a wrong-type value without a validate message falls back to editInvalid", async () => {
        render(KanbanBoard, { props: { ...base, fields: [{ ...FIELD, parse: () => Number.NaN }], onFieldEdit: vi.fn() } });
        await edit("x");
        expect(status()).toBe("One: bad Points");
    });
});

describe("KanbanBoard — live drop cue, right-to-left keys, no English left over (§8.137–§8.148)", () => {
    const cols: KanbanColumn[] = [
        { id: "todo", title: "To Do" },
        { id: "doing", title: "Doing" },
        { id: "done", title: "Done" },
    ];
    const cards: KanbanCard[] = [
        { id: "c1", columnId: "todo", title: "One" },
        { id: "c2", columnId: "todo", title: "Two" },
    ];
    const base = { label: "Board", columns: cols, cards };
    const cell = (row: number, col: number) => document.querySelector<HTMLElement>(`.kanban-table-td[data-row="${row}"][data-col="${col}"]`)!;
    const active = () => document.querySelector<HTMLElement>('[data-row][data-col][tabindex="0"]')!;
    const dt = () => ({ setData: vi.fn(), getData: () => "", dropEffect: "" });
    const start = async (el: HTMLElement, transfer = dt()) => fireEvent.dragStart(el.querySelector(".kanban-board-card-title")!, { dataTransfer: transfer });

    test("§8.137 over a column that accepts the card, the cell is a drop target and the drag effect is move", async () => {
        render(KanbanBoard, { props: base });
        await start(cell(0, 0));
        const over = dt();
        await fireEvent.dragOver(cell(0, 1), { dataTransfer: over });
        expect(cell(0, 1).hasAttribute("data-drop-target")).toBe(true);
        expect(cell(0, 1).hasAttribute("data-drop-blocked")).toBe(false);
        expect(over.dropEffect).toBe("move");
    });

    test("§8.138 over a column canMove refuses, the cell is data-drop-blocked, not a drop target, and the effect is none", async () => {
        render(KanbanBoard, { props: { ...base, canMove: (_c: KanbanCard, to: KanbanColumn) => to.id !== "done" } });
        await start(cell(0, 0));
        const over = dt();
        await fireEvent.dragOver(cell(0, 2), { dataTransfer: over });
        expect(cell(0, 2).hasAttribute("data-drop-blocked")).toBe(true);
        expect(cell(0, 2).hasAttribute("data-drop-target")).toBe(false);
        expect(over.dropEffect).toBe("none");
    });

    test("§8.139 the dragover of a refused drop is not cancelled, so the browser shows its not-allowed cursor", async () => {
        render(KanbanBoard, { props: { ...base, canMove: () => false } });
        await start(cell(0, 0));
        const event = new Event("dragover", { bubbles: true, cancelable: true });
        Object.defineProperty(event, "dataTransfer", { value: dt() });
        cell(0, 1).dispatchEvent(event);
        expect(event.defaultPrevented).toBe(false);
    });

    test("§8.139b the dragover of an accepted drop is cancelled, which is what allows the drop", async () => {
        render(KanbanBoard, { props: base });
        await start(cell(0, 0));
        const event = new Event("dragover", { bubbles: true, cancelable: true });
        Object.defineProperty(event, "dataTransfer", { value: dt() });
        cell(0, 1).dispatchEvent(event);
        expect(event.defaultPrevented).toBe(true);
    });

    test("§8.140 the cue follows the pointer: moving to an allowed column clears the blocked cue", async () => {
        render(KanbanBoard, { props: { ...base, canMove: (_c: KanbanCard, to: KanbanColumn) => to.id === "doing" } });
        await start(cell(0, 0));
        await fireEvent.dragOver(cell(0, 2), { dataTransfer: dt() });
        expect(cell(0, 2).hasAttribute("data-drop-blocked")).toBe(true);
        await fireEvent.dragLeave(cell(0, 2));
        await fireEvent.dragOver(cell(0, 1), { dataTransfer: dt() });
        expect(cell(0, 2).hasAttribute("data-drop-blocked")).toBe(false);
        expect(cell(0, 1).hasAttribute("data-drop-target")).toBe(true);
    });

    test("§8.141 a strict WIP limit that is full also blocks, and dropping on a blocked column moves nothing", async () => {
        const onMove = vi.fn();
        const limited: KanbanColumn[] = [cols[0], { id: "doing", title: "Doing", wipLimit: 0, strictLimit: true }, cols[2]];
        render(KanbanBoard, { props: { ...base, columns: limited, onMove } });
        await start(cell(0, 0));
        await fireEvent.dragOver(cell(0, 1), { dataTransfer: dt() });
        expect(cell(0, 1).hasAttribute("data-drop-blocked")).toBe(true);
        await fireEvent.drop(cell(0, 1), { dataTransfer: dt() });
        expect(onMove).not.toHaveBeenCalled();
        expect(cell(0, 1).hasAttribute("data-drop-blocked")).toBe(false);
    });

    test("§8.142 ending the drag clears every cue", async () => {
        render(KanbanBoard, { props: { ...base, canMove: () => false } });
        await start(cell(0, 0));
        await fireEvent.dragOver(cell(0, 1), { dataTransfer: dt() });
        await fireEvent.dragEnd(cell(0, 0).querySelector(".kanban-board-card-title")!);
        expect(document.querySelector("[data-drop-blocked], [data-drop-target]")).toBeNull();
    });

    test("§8.143 left to right: ArrowRight goes to the next column, ArrowLeft back", async () => {
        render(KanbanBoard, { props: base });
        await fireEvent.keyDown(active(), { key: "ArrowRight" });
        expect(Number(active().dataset.col)).toBe(1);
        await fireEvent.keyDown(active(), { key: "ArrowLeft" });
        expect(Number(active().dataset.col)).toBe(0);
    });

    test("§8.144 right to left: ArrowLeft goes to the next column, ArrowRight back", async () => {
        document.body.setAttribute("dir", "rtl");
        try {
            render(KanbanBoard, { props: base });
            await fireEvent.keyDown(active(), { key: "ArrowLeft" });
            expect(Number(active().dataset.col)).toBe(1);
            await fireEvent.keyDown(active(), { key: "ArrowRight" });
            expect(Number(active().dataset.col)).toBe(0);
        } finally {
            document.body.removeAttribute("dir");
        }
    });

    test("§8.145 right to left: Alt+ArrowLeft moves the card to the column that is visually on its left, the next one", async () => {
        document.body.setAttribute("dir", "rtl");
        try {
            const onMove = vi.fn();
            render(KanbanBoard, { props: { ...base, onMove } });
            await fireEvent.keyDown(cell(0, 0), { key: "ArrowLeft", altKey: true });
            expect(onMove.mock.calls[0].slice(0, 2)).toEqual(["c1", "doing"]);
        } finally {
            document.body.removeAttribute("dir");
        }
    });

    test("§8.146 vertical keys and Home/End are the same in both directions", async () => {
        for (const dir of ["ltr", "rtl"]) {
            document.body.innerHTML = "";
            document.body.setAttribute("dir", dir);
            render(KanbanBoard, { props: base });
            await fireEvent.keyDown(active(), { key: "ArrowDown" });
            expect(Number(active().dataset.row)).toBe(1);
            await fireEvent.keyDown(active(), { key: "Home" });
            expect(Number(active().dataset.row)).toBe(0);
        }
        document.body.removeAttribute("dir");
    });

    // A complete Simplified Chinese bundle; the data is Chinese too, so any English in the DOM is Lily's.
    const ZH: KanbanLabels = {
        cardCount: (n) => `${n} 张卡片`, overLimit: (n, l) => `超出上限：${n}/${l}`, moveButton: (c) => `移动${c.title}`, moveMenuLabel: "移动到列",
        moveAnnouncement: (t, c) => `${t}已移到${c}`, moveBlocked: (t, c) => `${t}不能移到${c}`, emptyColumn: () => "此列没有卡片",
        search: "搜索卡片", searchAnnouncement: (m, t) => `${t} 张卡片中有 ${m} 张匹配`, export: "导出", exportCsv: "CSV", copy: "复制",
        exportHeaders: { title: "标题", column: "列" }, copyAnnouncement: (n) => `已复制 ${n} 张卡片`, copyFailed: "复制失败",
        collapseColumn: (c, collapsed) => `${collapsed ? "展开" : "折叠"}${c.title}`, addCard: (c) => `向${c.title}添加卡片`,
    };

    function readable(root: Element): string[] {
        const out: string[] = [];
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        for (let n = walker.nextNode(); n; n = walker.nextNode()) out.push(n.textContent ?? "");
        for (const el of root.querySelectorAll("*")) for (const a of ["aria-label", "title", "placeholder", "alt"]) if (el.hasAttribute(a)) out.push(el.getAttribute(a)!);
        return out.map((t) => t.trim()).filter(Boolean);
    }
    const english = (texts: string[]) => texts.filter((t) => !["CSV", "TSV", "Excel"].includes(t) && /[A-Za-z]{3,}/.test(t));

    test("§8.147 with a full Chinese bundle the board reads as Chinese only", () => {
        const zhCols: KanbanColumn[] = [{ id: "todo", title: "待办", wipLimit: 1 }, { id: "doing", title: "进行中" }, { id: "done", title: "已完成" }];
        const zhCards: KanbanCard[] = [{ id: "c1", columnId: "todo", title: "写文档" }, { id: "c2", columnId: "todo", title: "做评审" }];
        const { container } = render(KanbanBoard, { props: { label: "看板", columns: zhCols, cards: zhCards, labels: ZH } });
        expect(english(readable(container))).toEqual([]);
    });

    test("§8.148 the announcements are the bundle's, so none is English", async () => {
        const zhCols: KanbanColumn[] = [{ id: "todo", title: "待办" }, { id: "doing", title: "进行中" }];
        const zhCards: KanbanCard[] = [{ id: "c1", columnId: "todo", title: "写文档" }];
        render(KanbanBoard, { props: { label: "看板", columns: zhCols, cards: zhCards, labels: ZH, onMove: () => {} } });
        await fireEvent.input(screen.getByRole("searchbox", { name: "搜索卡片" }), { target: { value: "写" } });
        await new Promise((r) => setTimeout(r, 0));
        expect(document.querySelector(".kanban-board-status")?.textContent).toBe("1 张卡片中有 1 张匹配");
    });
});



describe("KanbanBoard — in-place title editing (editableTitles + titleEdit)", () => {
    const cols: KanbanColumn[] = [{ id: "todo", title: "To Do" }, { id: "doing", title: "In Progress" }];
    const cards: KanbanCard[] = [{ id: "c1", columnId: "todo", title: "Card One" }, { id: "c2", columnId: "todo", title: "Linked", href: "/x" }];
    const base = { label: "Board", columns: cols, cards };
    const titleEditor = () => document.querySelector<HTMLInputElement>(".kanban-board-title-editor");

    test("double-click opens an editor with the title; Enter commits and announces", async () => {
        const onTitleEdit = vi.fn();
        render(null, { props: { ...base, onTitleEdit, labels: { titleEditAnnouncement: (p: string, t: string) => `${p} -> ${t}`, titleEditor: (t: string) => `Title of ${t}` } } });
        await fireEvent.dblClick(screen.getByText("Card One"));
        const input = titleEditor()!;
        expect(input.value).toBe("Card One");
        expect(input.getAttribute("aria-label")).toBe("Title of Card One");
        input.value = "  Renamed  ";
        await fireEvent.input(input);
        await fireEvent.keyDown(titleEditor()!, { key: "Enter" });
        expect(onTitleEdit).toHaveBeenCalledWith({ cardId: "c1", title: "Renamed", previous: "Card One" });
        expect(titleEditor()).toBeNull();
        expect(document.body.textContent).toContain("Card One -> Renamed");
    });

    test("Escape cancels; an empty or unchanged title changes nothing", async () => {
        const onTitleEdit = vi.fn();
        render(null, { props: { ...base, onTitleEdit } });
        await fireEvent.dblClick(screen.getByText("Card One"));
        let input = titleEditor()!;
        input.value = "Changed";
        await fireEvent.input(input);
        await fireEvent.keyDown(titleEditor()!, { key: "Escape" });
        expect(titleEditor()).toBeNull();
        await fireEvent.dblClick(screen.getByText("Card One"));
        input = titleEditor()!;
        input.value = "   ";
        await fireEvent.input(input);
        await fireEvent.keyDown(titleEditor()!, { key: "Enter" });
        await fireEvent.dblClick(screen.getByText("Card One"));
        await fireEvent.keyDown(titleEditor()!, { key: "Enter" });
        expect(onTitleEdit).not.toHaveBeenCalled();
    });

    test("leaving the field commits; F2 on a card opens the editor", async () => {
        const onTitleEdit = vi.fn();
        render(null, { props: { ...base, onTitleEdit } });
        await fireEvent.keyDown(document.querySelector<HTMLElement>('[data-card-id="c1"]')!, { key: "F2" });
        const input = titleEditor()!;
        expect(input).not.toBeNull();
        input.value = "By blur";
        await fireEvent.input(input);
        await fireEvent.blur(titleEditor()!);
        expect(onTitleEdit).toHaveBeenCalledWith({ cardId: "c1", title: "By blur", previous: "Card One" });
    });

    test("no editor without editableTitles, for a linked card, or when readonly", async () => {
        const first = render(null, { props: { ...base } });
        await fireEvent.dblClick(screen.getByText("Card One"));
        expect(titleEditor()).toBeNull();
        first.unmount();
        const second = render(null, { props: { ...base, onTitleEdit: vi.fn() } });
        await fireEvent.dblClick(screen.getByText("Linked"));
        expect(titleEditor()).toBeNull();
        second.unmount();
        render(null, { props: { ...base, onTitleEdit: vi.fn(), readonly: true } });
        await fireEvent.dblClick(screen.getByText("Card One"));
        expect(titleEditor()).toBeNull();
    });
});

describe("KanbanBoard — swimlane move rules, visible search label and field layout (ported from Svelte)", () => {
    const cols: KanbanColumn[] = [
        { id: "todo", title: "To Do" },
        { id: "doing", title: "Doing" },
        { id: "done", title: "Done" },
    ];
    const lanes = [{ id: "ann", title: "Ann" }, { id: "bo", title: "Bo" }];
    const laneCards: KanbanCard[] = [
        { id: "c1", columnId: "todo", title: "Card One", laneId: "ann" },
        { id: "c2", columnId: "todo", title: "Card Two", laneId: "bo" },
        { id: "c3", columnId: "doing", title: "Card Three", laneId: "ann" },
    ];
    const base = { label: "Board", columns: cols, cards: laneCards, lanes };
    const cellAt = (row: number, col: number) => document.querySelector<HTMLElement>(`.kanban-table-td[data-row="${row}"][data-col="${col}"]`)!;
    const dt = () => ({ setData: vi.fn(), getData: () => "", dropEffect: "" });
    const start = async (transfer = dt()) => {
        await fireEvent.dragStart(cellAt(0, 0).querySelector(".kanban-board-card-title")!, { dataTransfer: transfer });
        return transfer;
    };

    test("canMove receives the swimlane the card would land in", async () => {
        const onMove = vi.fn();
        const canMove = vi.fn(() => true);
        render(KanbanBoard, { props: { ...base, onMove, canMove } });
        const transfer = await start();
        await fireEvent.drop(cellAt(1, 2), { dataTransfer: transfer });
        const call = canMove.mock.calls.at(-1)! as unknown[];
        expect((call[1] as { id: string }).id).toBe("done");
        expect(call[2]).toEqual({ id: "bo", title: "Bo" });
        expect(onMove).toHaveBeenCalledWith("c1", "done", undefined, "bo");
    });

    test("canMove can veto by lane: a card may not enter one owner's lane", async () => {
        const onMove = vi.fn();
        render(KanbanBoard, { props: { ...base, onMove, canMove: (_c: KanbanCard, _col: KanbanColumn, lane?: { id: string }) => lane?.id !== "bo" } });
        const transfer = await start();
        await fireEvent.drop(cellAt(1, 2), { dataTransfer: transfer });
        expect(onMove).not.toHaveBeenCalled();
    });

    test("allowLaneChange=false refuses a cross-lane drop but still allows a move within the lane", async () => {
        const onMove = vi.fn();
        render(KanbanBoard, { props: { ...base, onMove, allowLaneChange: false } });
        const transfer = await start();
        await fireEvent.dragOver(cellAt(1, 0), { dataTransfer: transfer });
        expect(transfer.dropEffect).toBe("none");
        await fireEvent.drop(cellAt(1, 0), { dataTransfer: transfer });
        await fireEvent.drop(cellAt(1, 2), { dataTransfer: transfer });
        expect(onMove).not.toHaveBeenCalled();
        const again = await start();
        await fireEvent.drop(cellAt(0, 2), { dataTransfer: again });
        expect(onMove).toHaveBeenCalledWith("c1", "done", undefined, "ann");
    });

    test("showSearchLabel renders labels.search as visible text tied to the search field", async () => {
        render(KanbanBoard, { props: { ...base, labels: { search: "Search cards" }, showSearchLabel: true } });
        await nextTick();
        settle();
        const visible = document.querySelector(".kanban-board-search-label")!;
        const input = document.querySelector("input.kanban-board-search") as HTMLInputElement;
        expect(visible.textContent).toBe("Search cards");
        expect(input.id).not.toBe("");
        expect(visible.getAttribute("for")).toBe(input.id);
        expect(input.getAttribute("aria-label")).toBe("Search cards");
    });

    test("without showSearchLabel there is no visible label text", () => {
        render(KanbanBoard, { props: { ...base, labels: { search: "Search cards" } } });
        expect(document.querySelector(".kanban-board-search-label")).toBeNull();
    });

    test("fieldLayout=compact sets data-field-layout on the board; the default sets nothing", () => {
        const { unmount } = render(KanbanBoard, { props: { ...base, fieldLayout: "compact" } });
        expect(document.querySelector(".kanban-board")!.getAttribute("data-field-layout")).toBe("compact");
        unmount();
        render(KanbanBoard, { props: { ...base } });
        expect(document.querySelector(".kanban-board")!.hasAttribute("data-field-layout")).toBe(false);
    });
});
