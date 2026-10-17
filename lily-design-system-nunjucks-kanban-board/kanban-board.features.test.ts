// @vitest-environment jsdom
import { afterEach, describe, expect, test, vi } from "vitest";
import nunjucks from "nunjucks";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import { initKanbanBoard } from "./kanban-board.client.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = nunjucks.configure([__dirname, path.join(__dirname, "..")], { autoescape: true, throwOnUndefined: false, trimBlocks: true, lstripBlocks: true });

const COLUMNS = [
  { id: "todo", title: "To Do" },
  { id: "doing", title: "In Progress" },
  { id: "done", title: "Done" },
];
const CARDS = [
  { id: "c1", columnId: "todo", title: "Design login page", values: { owner: "Zoë" } },
  { id: "c2", columnId: "todo", title: "Café menu", subtitle: "vip" },
  { id: "c3", columnId: "doing", title: "Write docs" },
];
const LABELS = {
  search: "Search cards",
  searchAnnouncement: "{matched} of {total} cards",
  copy: "Copy",
  copyAnnouncement: "{count} rows copied",
  copyFailed: "Copy failed",
  exportHeaders: { title: "Title", column: "Column" },
  editRefused: "{card} {field}: {message}",
  fieldUndoAnnouncement: "Undid {field}: {value}",
  fieldRedoAnnouncement: "Redid {field}: {value}",
  moveButton: "Move {card}",
  moveMenuLabel: "Move to column",
};

function setup(opts: Record<string, unknown> = {}, initOpts: Record<string, unknown> = {}) {
  document.body.innerHTML = env.renderString(`{% from "./kanban-board.njk" import kanbanBoard %}{{ kanbanBoard(opts) }}`, {
    opts: { label: "Board", columns: COLUMNS, cards: CARDS, labels: LABELS, ...opts },
  });
  const root = document.body.querySelector<HTMLElement>("[data-lily-kanban-board-root]")!;
  return { root, controller: initKanbanBoard(root, initOpts) };
}
const ids = (root: HTMLElement) => Array.from(root.querySelectorAll("[data-lily-kanban-board-card-id].kanban-table-td")).filter((td) => td.childNodes.length > 0).map((td) => td.getAttribute("data-lily-kanban-board-card-id"));
const input = (root: HTMLElement) => root.querySelector<HTMLInputElement>("[data-lily-kanban-board-search]")!;
const type = (root: HTMLElement, value: string) => {
  input(root).value = value;
  input(root).dispatchEvent(new Event("input", { bubbles: true }));
};
const key = (el: Element, k: string, init: KeyboardEventInit = {}) => el.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true, ...init }));
const status = (root: HTMLElement) => root.querySelector("[data-lily-kanban-board-status]")?.textContent;
const active = (root: HTMLElement) => root.querySelector<HTMLElement>('.kanban-table-td[tabindex="0"]')!;
const flush = () => new Promise((r) => setTimeout(r, 0));

afterEach(() => {
  document.body.innerHTML = "";
  document.documentElement.removeAttribute("dir");
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("search: words, diacritics, fields, highlight, announce, Escape", () => {
  test("§8.110 every word must appear, in any order", () => {
    const { root } = setup();
    type(root, "page LOGIN");
    expect(ids(root)).toEqual(["c1"]);
  });
  test("§8.111 ignores diacritics both ways; the default text includes typed field text", () => {
    const { root } = setup({ fields: [{ id: "owner", header: "Owner" }] });
    type(root, "cafe");
    expect(ids(root)).toEqual(["c2"]);
    type(root, "zoe");
    expect(ids(root)).toEqual(["c1"]);
  });
  test("§8.113 matches in the title are wrapped in <mark class=kanban-board-match>, only while searching", () => {
    const { root } = setup();
    expect(root.querySelector(".kanban-board-match")).toBeNull();
    type(root, "login");
    const mark = root.querySelector("mark.kanban-board-match")!;
    expect(mark.textContent?.toLowerCase()).toBe("login");
    expect(mark.classList.contains("mark")).toBe(true);
    type(root, "");
    expect(root.querySelector("mark")).toBeNull();
    expect(root.querySelector("[data-lily-kanban-board-card-handle]")!.textContent).toBe("Design login page");
  });
  test("§8.114 the result count is announced; §8.115 Escape clears the search", () => {
    const { root } = setup();
    type(root, "docs");
    expect(status(root)).toBe("1 of 3 cards");
    key(input(root), "Escape");
    expect(input(root).value).toBe("");
    expect(ids(root)).toHaveLength(3);
  });
  test("the search field carries the headless search-input class", () => {
    const { root } = setup();
    expect(input(root).classList.contains("kanban-board-search")).toBe(true);
  });
});

describe("copy to clipboard", () => {
  test("§8.120 copy puts the view on the clipboard (header first, tab-separated) and announces; onCopy can take over", async () => {
    const writeText = vi.fn(async () => {});
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    const { root } = setup();
    root.querySelector<HTMLElement>('[data-kanban-export-format="copy"]')!.click();
    await flush();
    const text = (writeText.mock.calls[0] as unknown as [string])[0];
    expect(text.split("\r\n")[0]).toBe("Title\tColumn");
    expect(text).toContain("Design login page\tTo Do");
    expect(status(root)).toBe("3 rows copied");
    const onCopy = vi.fn(() => false);
    writeText.mockClear();
    const second = setup({}, { onCopy });
    second.root.querySelector<HTMLElement>('[data-kanban-export-format="copy"]')!.click();
    await flush();
    expect(onCopy).toHaveBeenCalled();
    expect(writeText).not.toHaveBeenCalled();
  });
});

describe("keyboard: page keys, type-ahead, right-to-left", () => {
  const many = Array.from({ length: 25 }, (_, i) => ({ id: `m${i}`, columnId: "todo", title: i === 3 ? "Beta" : i === 5 ? "Bravo" : `Item ${i}` }));
  test("§8.122 PageDown moves ten rows and clamps", () => {
    const { root } = setup({ cards: many });
    key(active(root), "PageDown");
    expect(active(root).getAttribute("data-row")).toBe("10");
    key(active(root), "PageDown");
    key(active(root), "PageDown");
    expect(active(root).getAttribute("data-row")).toBe("24");
  });
  test("§8.123 typing a letter moves to the next card in the column whose label starts with it", () => {
    const { root } = setup({ cards: many });
    key(active(root), "b");
    expect(active(root).getAttribute("data-row")).toBe("3");
    key(active(root), "r");
    expect(active(root).getAttribute("data-row")).toBe("5");
  });
  test("§8.143 right-to-left: ArrowLeft goes to the next column", () => {
    document.documentElement.setAttribute("dir", "rtl");
    const { root } = setup();
    key(active(root), "ArrowLeft");
    expect(active(root).getAttribute("data-col")).toBe("1");
    key(active(root), "ArrowRight");
    expect(active(root).getAttribute("data-col")).toBe("0");
  });
});

describe("in-place edit: validate, undo, redo", () => {
  const fields = [{ id: "cost", header: "Cost", type: "number" }];
  const cards = [{ id: "c1", columnId: "todo", title: "Card", values: { cost: 5 } }];
  const hooks = { cost: { validate: (v: unknown) => (typeof v === "number" && v < 0 ? "must not be negative" : undefined) } };
  function edit(root: HTMLElement, value: string): void {
    root.querySelector<HTMLElement>(".kanban-board-field-button")!.click();
    const field = root.querySelector<HTMLInputElement>(".kanban-board-field-editor")!;
    field.value = value;
    field.dispatchEvent(new Event("input", { bubbles: true }));
    key(field, "Enter");
  }
  test("§8.128 a value validate refuses keeps the editor open, aria-invalid, and announces the reason", () => {
    const { root } = setup({ cards, fields, editableFields: true }, { fieldHooks: hooks });
    edit(root, "-1");
    expect(root.querySelector(".kanban-board-field-editor")!.getAttribute("aria-invalid")).toBe("true");
    expect(status(root)).toBe("Card Cost: must not be negative");
  });
  test("§8.130 Ctrl+Z reports the earlier value through onFieldEdit; Ctrl+Shift+Z redoes", () => {
    const onFieldEdit = vi.fn();
    const { root } = setup({ cards, fields, editableFields: true }, { onFieldEdit });
    edit(root, "9");
    key(active(root), "z", { ctrlKey: true });
    expect(onFieldEdit).toHaveBeenLastCalledWith({ cardId: "c1", fieldId: "cost", value: 5, previous: 9 });
    expect(status(root)).toBe("Undid Cost: 5");
    key(active(root), "z", { ctrlKey: true, shiftKey: true });
    expect(onFieldEdit).toHaveBeenLastCalledWith({ cardId: "c1", fieldId: "cost", value: 9, previous: 5 });
  });
});

describe("live drop cue", () => {
  test("§8.137 a refused drop carries data-drop-blocked, not data-drop-target, and is not prevented", () => {
    const { root } = setup({}, { canMove: (_id: string, to: string) => to !== "done" });
    const handle = root.querySelector<HTMLElement>("[data-lily-kanban-board-card-handle]")!;
    const start = Object.assign(new Event("dragstart", { bubbles: true }), { dataTransfer: { setData: () => {}, setDragImage: () => {}, effectAllowed: "" } });
    handle.dispatchEvent(start);
    const cell = (col: number) => root.querySelector<HTMLElement>(`.kanban-table-td[data-row="0"][data-col="${col}"]`)!;
    const over = (col: number) => {
      const e = Object.assign(new Event("dragover", { bubbles: true, cancelable: true }), { dataTransfer: { dropEffect: "" } });
      cell(col).dispatchEvent(e);
      return e;
    };
    expect(over(1).defaultPrevented).toBe(true);
    expect(cell(1).hasAttribute("data-drop-target")).toBe(true);
    expect(over(2).defaultPrevented).toBe(false);
    expect(cell(2).hasAttribute("data-drop-blocked")).toBe(true);
    expect(cell(2).hasAttribute("data-drop-target")).toBe(false);
  });
});
