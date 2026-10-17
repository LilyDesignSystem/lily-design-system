import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { DataGrid } from "./data-grid.js";
import type { DataGridColumn, DataGridLabels } from "./data-grid.js";

if (!customElements.get("lily-data-grid")) customElements.define("lily-data-grid", DataGrid);

const LABELS: DataGridLabels = {
  search: "Search rows",
  previousPage: "Previous",
  nextPage: "Next",
  pageStatus: (p, c, n) => `Page ${p} of ${c} (${n})`,
  sortAnnouncement: (h, d) => `${h} sorted ${d}`,
  filterAnnouncement: (m, t) => `${m} of ${t} rows match`,
};

let grid: DataGrid;
function mount(props: Record<string, unknown> = {}, attrs: Record<string, string> = {}): DataGrid {
  grid = document.createElement("lily-data-grid") as DataGrid;
  grid.setAttribute("label", "Users");
  for (const [k, v] of Object.entries(attrs)) grid.setAttribute(k, v);
  grid.columns = (props.columns as DataGridColumn[]) ?? [{ id: "name", header: "Name", sortable: true }, { id: "team", header: "Team", sortable: true }];
  grid.rows = (props.rows as never) ?? [];
  grid.labels = (props.labels as DataGridLabels) ?? LABELS;
  for (const [k, v] of Object.entries(props)) if (!["columns", "rows", "labels"].includes(k)) (grid as never as Record<string, unknown>)[k] = v;
  document.body.append(grid);
  return grid;
}
const bodyRows = () => Array.from(grid.querySelectorAll<HTMLElement>(".data-table-body .data-table-row"));
const firstCol = () => bodyRows().map((r) => r.querySelector(".data-table-td")!.textContent?.trim());
const key = (el: Element, k: string, init: KeyboardEventInit = {}) => el.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true, ...init }));
const status = () => grid.querySelector(".data-grid-status")?.textContent;
const search = () => grid.querySelector<HTMLInputElement>(".data-grid-search")!;
const type = (value: string) => {
  search().value = value;
  search().dispatchEvent(new Event("input", { bubbles: true }));
};
const sortButton = (header: string) => Array.from(grid.querySelectorAll<HTMLElement>(".data-grid-sort-button")).find((b) => b.textContent === header)!;
const active = () => grid.querySelector<HTMLElement>("[data-row][data-col][tabindex='0']")!;

beforeEach(() => localStorage.clear());
afterEach(() => {
  document.body.innerHTML = "";
  document.documentElement.removeAttribute("dir");
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

const WORLD = [
  { name: "Zoë Müller", team: "Red" },
  { name: "Bob Stone", team: "Blue" },
  { name: "Alice Stone", team: "Green" },
];

describe("search: every word, any order, ignoring diacritics; Escape clears; field select", () => {
  test("§8.90 every word must appear, in any order, across cells", () => {
    mount({ rows: WORLD });
    type("stone alice");
    expect(firstCol()).toEqual(["Alice Stone"]);
    type("bob blue");
    expect(firstCol()).toEqual(["Bob Stone"]);
  });
  test("§8.92 diacritics are ignored both ways", () => {
    mount({ rows: WORLD });
    type("zoe muller");
    expect(firstCol()).toEqual(["Zoë Müller"]);
  });
  test("§8.94 Escape clears the search, restores every row and announces", () => {
    mount({ rows: WORLD });
    type("alice");
    key(search(), "Escape");
    expect(firstCol()).toHaveLength(3);
    expect(search().value).toBe("");
    expect(status()).toBe("3 of 3 rows match");
  });
  test("§8.132 the search field carries the headless search-input class", () => {
    mount({ rows: WORLD });
    expect(search().classList.contains("search-input")).toBe(true);
  });
  test("§8.133 the field select shows only when labels.searchField and searchAllFields name it, and limits the search", () => {
    mount({ rows: WORLD });
    expect(grid.querySelector(".data-grid-search-field")).toBeNull();
    document.body.innerHTML = "";
    mount({ rows: WORLD, labels: { ...LABELS, searchField: "Search in", searchAllFields: "All columns" } });
    const select = grid.querySelector<HTMLSelectElement>(".data-grid-search-field")!;
    expect(Array.from(select.options).map((o) => o.textContent)).toEqual(["All columns", "Name", "Team"]);
    type("stone");
    expect(firstCol()).toHaveLength(2);
    select.value = "team";
    select.dispatchEvent(new Event("change", { bubbles: true }));
    expect(firstCol()).toHaveLength(0);
  });
});

describe("rowFilter and multi-column sort", () => {
  const people = [
    { name: "Bob", team: "b", age: 30 },
    { name: "Alice", team: "a", age: 40 },
    { name: "Cara", team: "a", age: 30 },
    { name: "Dan", team: "b", age: 40 },
  ];
  const cols: DataGridColumn[] = [
    { id: "name", header: "Name", sortable: true },
    { id: "team", header: "Team", sortable: true },
    { id: "age", header: "Age", sortable: true, type: "number" },
  ];
  test("§8.95 rowFilter hides the rows it rejects, combining with the text filter", () => {
    mount({ columns: cols, rows: people, rowFilter: (r: Record<string, unknown>) => r.team === "a" });
    expect(firstCol()).toEqual(["Alice", "Cara"]);
    type("cara");
    expect(firstCol()).toEqual(["Cara"]);
  });
  test("§8.97 Shift+click adds a secondary key that breaks ties; it cycles ascending, descending, off", () => {
    mount({ columns: cols, rows: people });
    sortButton("Team").click();
    sortButton("Age").dispatchEvent(new MouseEvent("click", { bubbles: true, shiftKey: true }));
    expect(firstCol()).toEqual(["Cara", "Alice", "Bob", "Dan"]);
    sortButton("Age").dispatchEvent(new MouseEvent("click", { bubbles: true, shiftKey: true }));
    expect(firstCol()).toEqual(["Alice", "Cara", "Dan", "Bob"]);
    sortButton("Age").dispatchEvent(new MouseEvent("click", { bubbles: true, shiftKey: true }));
    expect(firstCol()).toEqual(["Alice", "Cara", "Bob", "Dan"]);
  });
  test("§8.99 headers carry data-sort-order while more than one key is set", () => {
    mount({ columns: cols, rows: people });
    sortButton("Team").click();
    expect(grid.querySelector("th[data-sort-order]")).toBeNull();
    sortButton("Age").dispatchEvent(new MouseEvent("click", { bubbles: true, shiftKey: true }));
    const th = Array.from(grid.querySelectorAll("th[data-col]"));
    expect(th[1].getAttribute("data-sort-order")).toBe("1");
    expect(th[2].getAttribute("data-sort-order")).toBe("2");
    expect(th[2].getAttribute("aria-sort")).toBe("ascending");
  });
  test("§8.100 a plain click sets the primary key alone and clears the secondary ones", () => {
    mount({ columns: cols, rows: people });
    sortButton("Team").click();
    sortButton("Age").dispatchEvent(new MouseEvent("click", { bubbles: true, shiftKey: true }));
    sortButton("Name").click();
    expect(firstCol()).toEqual(["Alice", "Bob", "Cara", "Dan"]);
    expect(grid.thenBy).toEqual([]);
  });
});

describe("copy to clipboard", () => {
  const L = { ...LABELS, copy: "Copy", copyAnnouncement: (n: number) => `${n} rows copied`, copyFailed: "Copy failed" };
  const rows = [{ name: "Bob", team: "Blue" }, { name: "Alice", team: "Red" }];
  const flush = () => new Promise((r) => setTimeout(r, 0));
  test("§8.103 the copy button renders only when labels.copy names it", () => {
    mount({ rows });
    expect(grid.querySelector('[data-grid-export-format="copy"]')).toBeNull();
  });
  test("§8.104 copy puts the export on the clipboard (header first, tab-separated) and announces", async () => {
    const writeText = vi.fn(async () => {});
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    mount({ rows, labels: L });
    grid.querySelector<HTMLElement>('[data-grid-export-format="copy"]')!.click();
    await flush();
    const text = (writeText.mock.calls[0] as unknown as [string])[0];
    expect(text.split("\r\n")[0]).toBe("Name\tTeam");
    expect(text).toContain("Bob\tBlue");
    expect(status()).toBe("2 rows copied");
  });
  test("§8.106 onCopy can take over; a failed write is announced", async () => {
    const writeText = vi.fn(async () => {});
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    const onCopy = vi.fn(() => false);
    mount({ rows, labels: L, onCopy });
    grid.querySelector<HTMLElement>('[data-grid-export-format="copy"]')!.click();
    await flush();
    expect(onCopy).toHaveBeenCalled();
    expect(writeText).not.toHaveBeenCalled();
    document.body.innerHTML = "";
    vi.stubGlobal("navigator", { clipboard: { writeText: async () => { throw new Error("denied"); } } });
    (document as unknown as { execCommand: unknown }).execCommand = () => false;
    mount({ rows, labels: L });
    grid.querySelector<HTMLElement>('[data-grid-export-format="copy"]')!.click();
    await flush();
    expect(status()).toBe("Copy failed");
  });
});

describe("keyboard: type-ahead, right-to-left, movable columns", () => {
  const people = [{ name: "Alice", team: "Red" }, { name: "Bob", team: "Blue" }, { name: "Bella", team: "Green" }, { name: "Cara", team: "Blue" }];
  test("§8.107 typing a letter moves to the next row whose cell in this column starts with it", () => {
    mount({ rows: people });
    key(active(), "ArrowDown");
    key(active(), "b");
    expect(active().getAttribute("data-row")).toBe("1");
    key(active(), "e");
    expect(active().getAttribute("data-row")).toBe("2");
  });
  test("§8.140 right-to-left swaps the horizontal arrows", () => {
    document.documentElement.setAttribute("dir", "rtl");
    mount({ rows: people });
    key(active(), "ArrowDown");
    key(active(), "ArrowLeft");
    expect(active().getAttribute("data-col")).toBe("1");
    key(active(), "ArrowRight");
    expect(active().getAttribute("data-col")).toBe("0");
  });
  test("§8.137 movableColumns makes every column draggable, and a column's movable=false opts out", () => {
    mount({ rows: people, movableColumns: true, columns: [{ id: "name", header: "Name" }, { id: "team", header: "Team", movable: false }] });
    const heads = Array.from(grid.querySelectorAll("thead th"));
    expect(heads[0].getAttribute("draggable")).toBe("true");
    expect(heads[1].hasAttribute("draggable")).toBe(false);
  });
});

describe("in-place edit: undo and redo", () => {
  const cols: DataGridColumn[] = [{ id: "name", header: "Name", editable: true }];
  const L = { ...LABELS, undoAnnouncement: (h: string, t: string) => `Undid ${h}: ${t}`, redoAnnouncement: (h: string, t: string) => `Redid ${h}: ${t}` };
  const rows = [{ name: "Ann" }, { name: "Bob" }];
  const cell = (r: number, c: number) => grid.querySelector<HTMLElement>(`.data-table-body [data-row="${r}"][data-col="${c}"]`)!;
  function edit(value: string): void {
    key(cell(0, 0), "F2");
    const input = grid.querySelector<HTMLInputElement>(".data-grid-cell-editor")!;
    input.value = value;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    key(input, "Enter");
  }
  test("§8.111 Ctrl+Z reports the earlier value through onCellEdit and announces it; Ctrl+Shift+Z redoes", () => {
    const onCellEdit = vi.fn();
    mount({ columns: cols, rows, labels: L, onCellEdit });
    edit("Bea");
    key(cell(0, 0), "z", { ctrlKey: true });
    expect(onCellEdit).toHaveBeenLastCalledWith({ rowId: "0", row: rows[0], columnId: "name", value: "Ann", previous: "Bea" });
    expect(status()).toBe("Undid Name: Ann");
    key(cell(0, 0), "z", { ctrlKey: true, shiftKey: true });
    expect(onCellEdit).toHaveBeenLastCalledWith({ rowId: "0", row: rows[0], columnId: "name", value: "Bea", previous: "Ann" });
    expect(status()).toBe("Redid Name: Bea");
  });
  test("§8.114 with nothing to undo Ctrl+Z does nothing", () => {
    const onCellEdit = vi.fn();
    mount({ columns: cols, rows, labels: L, onCellEdit });
    key(cell(0, 0), "z", { ctrlKey: true });
    expect(onCellEdit).not.toHaveBeenCalled();
  });
});

describe("empty values, nulls first or last, locale sort, pager landmark, label warning", () => {
  const cols: DataGridColumn[] = [{ id: "name", header: "Name", sortable: true }, { id: "note", header: "Note" }];
  const rows = [{ name: "Item 10", note: "a" }, { name: null, note: "" }, { name: "Item 2", note: null }, { name: "Äpfel", note: undefined }];
  const notes = () => bodyRows().map((r) => r.querySelectorAll<HTMLElement>(".data-table-td")[1]);
  test("§8.117 without emptyValue a missing value shows nothing and is data-empty", () => {
    mount({ columns: cols, rows });
    expect(notes().map((c) => c.textContent?.trim())).toEqual(["a", "", "", ""]);
    expect(notes().map((c) => c.hasAttribute("data-empty"))).toEqual([false, true, true, true]);
  });
  test("§8.118 emptyValue is shown for null, undefined and an empty string, never for a real value; a column's own wins", () => {
    mount({ columns: [cols[0], { ...cols[1], emptyValue: "n/a" }], rows, emptyValue: "—" });
    expect(notes().map((c) => c.textContent?.trim())).toEqual(["a", "n/a", "n/a", "n/a"]);
    expect(firstCol()[1]).toBe("—");
  });
  test("§8.121 missing values sort last in both directions; nulls=first puts them first", () => {
    mount({ columns: cols, rows });
    sortButton("Name").click();
    expect(firstCol().at(-1)).toBe("");
    sortButton("Name").click();
    expect(firstCol().at(-1)).toBe("");
    document.body.innerHTML = "";
    mount({ columns: cols, rows, nulls: "first" });
    sortButton("Name").click();
    expect(firstCol()[0]).toBe("");
  });
  test("§8.123 without a locale text sorts by code point; with one, by Intl.Collator (numbers by value)", () => {
    mount({ columns: cols, rows });
    sortButton("Name").click();
    expect(firstCol()).toEqual(["Item 10", "Item 2", "Äpfel", ""]);
    document.body.innerHTML = "";
    mount({ columns: cols, rows, locale: "de" });
    sortButton("Name").click();
    expect(firstCol()).toEqual(["Äpfel", "Item 2", "Item 10", ""]);
  });
  test("§8.148 labels.pagination makes the pager a <nav> named by it; without it the pager is a div", () => {
    mount({ rows: WORLD, labels: { ...LABELS, pagination: "Pages" } }, { "page-size": "1" });
    const nav = grid.querySelector(".data-grid-pagination")!;
    expect(nav.tagName).toBe("NAV");
    expect(nav.getAttribute("aria-label")).toBe("Pages");
    document.body.innerHTML = "";
    mount({ rows: WORLD }, { "page-size": "1" });
    expect(grid.querySelector(".data-grid-pagination")!.tagName).toBe("DIV");
  });
  test("§8.128 features that need labels the bundle lacks are named once; warnMissingLabels=false silences it", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    mount({ columns: [{ id: "name", header: "Name", sortable: true }], rows: [{ name: "a" }], labels: {} }, { "selection-mode": "multiple" });
    const messages = warn.mock.calls.map((c) => String(c[0])).filter((m) => m.startsWith("[data-grid]"));
    expect(messages).toHaveLength(1);
    expect(messages[0]).toContain("controls with no name: selectAll");
    document.body.innerHTML = "";
    warn.mockClear();
    mount({ columns: [{ id: "name", header: "Name", sortable: true }], rows: [{ name: "a" }], labels: {} }, { "selection-mode": "multiple", "no-warn-missing-labels": "" });
    expect(warn.mock.calls.filter((c) => String(c[0]).startsWith("[data-grid]"))).toHaveLength(0);
  });
});
